#!/usr/bin/env python3
"""
Luxsure Guide Extractor
=======================
Pipeline automatique :
  1. Parse le sitemap de luxsure.fr
  2. Scrape le contenu de chaque article
  3. Extrait les adresses avec Claude AI (Haiku)
  4. Géocode les adresses via Google Maps
  5. Exporte un CSV prêt pour WP All Import + BusinessFinder+

Usage:
  python main.py                    # Run full pipeline
  python main.py --resume           # Resume from checkpoint
  python main.py --limit 50         # Test on 50 articles only
  python main.py --skip-geocoding   # Skip geocoding step
"""

import os
import re
import csv
import json
import time
import logging
import argparse
import hashlib
from pathlib import Path
from datetime import datetime
from urllib.parse import urljoin, urlparse
from typing import Optional

import requests
from bs4 import BeautifulSoup
import anthropic
from dotenv import load_dotenv

load_dotenv()

# ── Configuration ──────────────────────────────────────────────────────────────

BASE_URL = "https://www.luxsure.fr"
SITEMAP_URL = "https://www.luxsure.fr/sitemap.xml"

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

CHECKPOINT_FILE = Path("checkpoint.json")
OUTPUT_CSV = Path("luxsure_guide_export.csv")
OUTPUT_JSON = Path("luxsure_guide_data.json")

REQUEST_DELAY = 1.5       # secondes entre chaque requête (respecte le serveur)
BATCH_SIZE = 20           # sauvegarde checkpoint tous les N articles
MAX_RETRIES = 3
CLAUDE_MODEL = "claude-haiku-4-5-20251001"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

# ── Extraction prompt ──────────────────────────────────────────────────────────

EXTRACTION_PROMPT = """Tu es un assistant qui extrait des informations structurées sur des lieux (restaurants, hôtels, boutiques, spas, galeries, bars, etc.) à partir d'articles de presse lifestyle luxe.

Analyse le texte suivant et extrait TOUS les lieux mentionnés qui ont une adresse physique ou suffisamment d'informations pour être localisés.

Pour chaque lieu trouvé, retourne un objet JSON avec ces champs (laisse vide "" si l'info est absente) :
- name : nom exact du lieu
- category : une parmi [restaurant, hotel, boutique, spa, bar, galerie, club, cafe, musee, autre]
- subcategory : description courte (ex: "Restaurant gastronomique", "Hôtel palace", "Prêt-à-porter")
- address : adresse complète si mentionnée
- city : ville
- country : pays (défaut "France")
- zip : code postal si mentionné
- phone : numéro de téléphone
- website : URL du site web
- instagram : compte Instagram (@...)
- price_range : 1 à 4 (1=abordable, 4=très luxe). Déduis depuis le contexte si possible.
- description : 1-2 phrases de description tirées de l'article
- source_article_title : titre de l'article source

Réponds UNIQUEMENT avec un tableau JSON valide. Si aucun lieu n'est trouvé, retourne [].

Exemples de réponse valide :
[
  {
    "name": "Le Bristol Paris",
    "category": "hotel",
    "subcategory": "Hôtel palace",
    "address": "112 Rue du Faubourg Saint-Honoré",
    "city": "Paris",
    "country": "France",
    "zip": "75008",
    "phone": "+33 1 53 43 43 00",
    "website": "https://www.lebristolparis.com",
    "instagram": "@lebristolparis",
    "price_range": 4,
    "description": "Palace parisien emblématique niché au cœur du triangle d'or.",
    "source_article_title": "Les meilleurs palaces de Paris"
  }
]

Article à analyser :
---
TITRE: {title}
URL: {url}

{content}
---
"""

# ── Sitemap parser ─────────────────────────────────────────────────────────────

def fetch_sitemap_urls(sitemap_url: str) -> list[str]:
    """Récupère toutes les URLs d'articles depuis le sitemap (gère les sitemaps imbriqués)."""
    log.info(f"Parsing sitemap: {sitemap_url}")
    urls = []

    try:
        r = requests.get(sitemap_url, timeout=30, headers={"User-Agent": "LuxsureGuideBot/1.0"})
        r.raise_for_status()
        soup = BeautifulSoup(r.content, "xml")

        # Sitemap index (contient d'autres sitemaps)
        sitemap_tags = soup.find_all("sitemap")
        if sitemap_tags:
            log.info(f"Sitemap index trouvé avec {len(sitemap_tags)} sous-sitemaps")
            for sitemap in sitemap_tags:
                loc = sitemap.find("loc")
                if loc:
                    child_urls = fetch_sitemap_urls(loc.text.strip())
                    urls.extend(child_urls)
                    time.sleep(0.5)
        else:
            # Sitemap direct avec URLs
            url_tags = soup.find_all("url")
            for url_tag in url_tags:
                loc = url_tag.find("loc")
                if loc:
                    url = loc.text.strip()
                    # Filtre : on ne garde que les articles (pas les pages admin, catégories, etc.)
                    if _is_article_url(url):
                        urls.append(url)

    except Exception as e:
        log.error(f"Erreur sitemap {sitemap_url}: {e}")

    log.info(f"  → {len(urls)} URLs trouvées dans ce sitemap")
    return urls


def _is_article_url(url: str) -> bool:
    """Filtre les URLs pour ne garder que les articles."""
    parsed = urlparse(url)
    path = parsed.path

    # Exclusions : pages de catégories, tags, auteurs, pages statiques
    exclusions = [
        "/category/", "/tag/", "/author/", "/page/",
        "/wp-content/", "/wp-admin/", "/feed/",
        "?", "#",
    ]
    for excl in exclusions:
        if excl in path or excl in url:
            return False

    # Inclusion : URLs avec un slug (chemin non vide et non racine)
    path_parts = [p for p in path.split("/") if p]
    return len(path_parts) >= 1 and path != "/"


# ── Article scraper ────────────────────────────────────────────────────────────

def scrape_article(url: str) -> Optional[dict]:
    """Scrape le titre et le contenu textuel d'un article."""
    for attempt in range(MAX_RETRIES):
        try:
            r = requests.get(
                url,
                timeout=20,
                headers={
                    "User-Agent": "Mozilla/5.0 (compatible; LuxsureGuideBot/1.0)",
                    "Accept-Language": "fr-FR,fr;q=0.9",
                },
            )
            if r.status_code == 404:
                return None
            r.raise_for_status()

            soup = BeautifulSoup(r.content, "html.parser")

            # Titre
            title = ""
            for selector in ["h1.entry-title", "h1.post-title", "h1", "title"]:
                el = soup.select_one(selector)
                if el:
                    title = el.get_text(strip=True)
                    break

            # Contenu principal (essaie plusieurs sélecteurs courants)
            content = ""
            for selector in [
                "article .entry-content",
                ".post-content",
                ".entry-content",
                "article",
                "main",
            ]:
                el = soup.select_one(selector)
                if el:
                    # Supprime les balises script, style, nav
                    for tag in el(["script", "style", "nav", "footer", "aside", "form"]):
                        tag.decompose()
                    content = el.get_text(separator="\n", strip=True)
                    break

            # Limite la taille pour l'API (max ~3000 mots)
            words = content.split()
            if len(words) > 3000:
                content = " ".join(words[:3000]) + "..."

            if not content or len(content) < 100:
                return None

            return {"url": url, "title": title, "content": content}

        except requests.exceptions.RequestException as e:
            if attempt < MAX_RETRIES - 1:
                wait = 2 ** attempt
                log.warning(f"Retry {attempt + 1}/{MAX_RETRIES} pour {url} (attente {wait}s): {e}")
                time.sleep(wait)
            else:
                log.error(f"Échec scraping {url}: {e}")
                return None


# ── Claude extractor ───────────────────────────────────────────────────────────

def extract_places(article: dict, client: anthropic.Anthropic) -> list[dict]:
    """Utilise Claude pour extraire les lieux structurés d'un article."""
    prompt = EXTRACTION_PROMPT.format(
        title=article["title"],
        url=article["url"],
        content=article["content"],
    )

    for attempt in range(MAX_RETRIES):
        try:
            message = client.messages.create(
                model=CLAUDE_MODEL,
                max_tokens=2048,
                messages=[{"role": "user", "content": prompt}],
            )

            raw = message.content[0].text.strip()

            # Extrait le JSON (parfois Claude enveloppe dans des backticks)
            json_match = re.search(r"\[.*\]", raw, re.DOTALL)
            if not json_match:
                return []

            places = json.loads(json_match.group())

            # Ajoute la source à chaque lieu
            for place in places:
                place["source_url"] = article["url"]
                if not place.get("source_article_title"):
                    place["source_article_title"] = article["title"]

            return places

        except json.JSONDecodeError as e:
            log.warning(f"JSON invalide pour {article['url']}: {e}")
            return []
        except anthropic.RateLimitError:
            wait = 30 * (attempt + 1)
            log.warning(f"Rate limit Claude, attente {wait}s...")
            time.sleep(wait)
        except Exception as e:
            if attempt < MAX_RETRIES - 1:
                time.sleep(2 ** attempt)
            else:
                log.error(f"Erreur Claude pour {article['url']}: {e}")
                return []

    return []


# ── Geocoder ──────────────────────────────────────────────────────────────────

def geocode_place(place: dict, api_key: str) -> dict:
    """Ajoute lat/lng à un lieu via Google Geocoding API."""
    if place.get("latitude") and place.get("longitude"):
        return place

    # Construit la requête de géocodage
    query_parts = []
    if place.get("address"):
        query_parts.append(place["address"])
    if place.get("city"):
        query_parts.append(place["city"])
    if place.get("country") and place.get("country") != "France":
        query_parts.append(place["country"])
    if not query_parts and place.get("name"):
        query_parts = [place["name"], place.get("city", "")]

    query = ", ".join(filter(None, query_parts))
    if not query:
        return place

    try:
        r = requests.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            params={"address": query, "key": api_key, "language": "fr"},
            timeout=10,
        )
        data = r.json()

        if data.get("status") == "OK" and data.get("results"):
            result = data["results"][0]
            loc = result["geometry"]["location"]
            place["latitude"] = str(loc["lat"])
            place["longitude"] = str(loc["lng"])

            # Complète les infos manquantes depuis le résultat Google
            if not place.get("address"):
                place["address"] = result.get("formatted_address", "")

            # Extrait zip et ville depuis components si manquants
            if not place.get("zip") or not place.get("city"):
                for comp in result.get("address_components", []):
                    types = comp.get("types", [])
                    if "postal_code" in types and not place.get("zip"):
                        place["zip"] = comp["long_name"]
                    if "locality" in types and not place.get("city"):
                        place["city"] = comp["long_name"]
        else:
            log.debug(f"Géocodage sans résultat pour: {query} ({data.get('status')})")

    except Exception as e:
        log.warning(f"Erreur géocodage '{query}': {e}")

    return place


# ── Deduplication ─────────────────────────────────────────────────────────────

def deduplicate(places: list[dict]) -> list[dict]:
    """Supprime les doublons basés sur le nom + ville."""
    seen = {}
    unique = []
    for place in places:
        key = f"{place.get('name', '').lower().strip()}|{place.get('city', '').lower().strip()}"
        if key not in seen:
            seen[key] = True
            unique.append(place)
        else:
            log.debug(f"Doublon supprimé: {place.get('name')} ({place.get('city')})")

    return unique


# ── CSV exporter ──────────────────────────────────────────────────────────────

CSV_COLUMNS = [
    # Colonnes WordPress / WP All Import
    "post_title",
    "post_content",
    "post_status",
    "post_type",
    "tax_ait-items",           # Catégorie BusinessFinder+
    # Champs AIT Framework (meta BusinessFinder+)
    "meta:_ait-item_subtitle",
    "meta:_ait-item_map:address",
    "meta:_ait-item_map:latitude",
    "meta:_ait-item_map:longitude",
    "meta:_ait-item_telephone",
    "meta:_ait-item_web",
    "meta:_ait-item_email",
    "meta:_ait-item_headerType",
    "meta:_ait-item_featuredItem",
    # Champs supplémentaires (à mapper dans WP All Import)
    "price_range",
    "instagram",
    "source_url",
    "source_article_title",
]

CATEGORY_MAP = {
    "restaurant": "Gastronomie",
    "hotel":      "Hôtels & Séjours",
    "boutique":   "Shopping",
    "spa":        "Wellness & Beauté",
    "bar":        "Bars & Cocktails",
    "galerie":    "Art & Culture",
    "club":       "Nightlife",
    "cafe":       "Cafés & Pâtisseries",
    "musee":      "Art & Culture",
    "autre":      "À découvrir",
}


def place_to_csv_row(place: dict) -> dict:
    category_key = place.get("category", "autre").lower()
    tax_category = CATEGORY_MAP.get(category_key, "À découvrir")

    return {
        "post_title":                      place.get("name", ""),
        "post_content":                    place.get("description", ""),
        "post_status":                     "publish",
        "post_type":                       "ait-item",
        "tax_ait-items":                   tax_category,
        "meta:_ait-item_subtitle":         place.get("subcategory", ""),
        "meta:_ait-item_map:address":      place.get("address", ""),
        "meta:_ait-item_map:latitude":     place.get("latitude", ""),
        "meta:_ait-item_map:longitude":    place.get("longitude", ""),
        "meta:_ait-item_telephone":        place.get("phone", ""),
        "meta:_ait-item_web":              place.get("website", ""),
        "meta:_ait-item_email":            place.get("email", ""),
        "meta:_ait-item_headerType":       "map",
        "meta:_ait-item_featuredItem":     "true",
        "price_range":                     str(place.get("price_range", "")),
        "instagram":                       place.get("instagram", ""),
        "source_url":                      place.get("source_url", ""),
        "source_article_title":            place.get("source_article_title", ""),
    }


def export_csv(places: list[dict], output_path: Path):
    with open(output_path, "w", newline="", encoding="utf-8-sig") as f:  # utf-8-sig for Excel
        writer = csv.DictWriter(f, fieldnames=CSV_COLUMNS)
        writer.writeheader()
        for place in places:
            writer.writerow(place_to_csv_row(place))

    log.info(f"CSV exporté : {output_path} ({len(places)} adresses)")


# ── Checkpoint ────────────────────────────────────────────────────────────────

def load_checkpoint() -> dict:
    if CHECKPOINT_FILE.exists():
        with open(CHECKPOINT_FILE) as f:
            return json.load(f)
    return {"processed_urls": [], "places": [], "started_at": datetime.now().isoformat()}


def save_checkpoint(checkpoint: dict):
    with open(CHECKPOINT_FILE, "w") as f:
        json.dump(checkpoint, f, ensure_ascii=False, indent=2)


# ── Main pipeline ─────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Luxsure Guide Extractor")
    parser.add_argument("--resume", action="store_true", help="Reprendre depuis le checkpoint")
    parser.add_argument("--limit", type=int, default=0, help="Limiter à N articles (test)")
    parser.add_argument("--skip-geocoding", action="store_true", help="Passer l'étape géocodage")
    args = parser.parse_args()

    # ── Validation API keys ──
    if not ANTHROPIC_API_KEY:
        log.error("ANTHROPIC_API_KEY manquante dans .env")
        return

    if not GOOGLE_MAPS_API_KEY and not args.skip_geocoding:
        log.warning("GOOGLE_MAPS_API_KEY absente — géocodage désactivé automatiquement")
        args.skip_geocoding = True

    claude_client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    # ── Checkpoint ──
    checkpoint = load_checkpoint() if args.resume else {
        "processed_urls": [],
        "places": [],
        "started_at": datetime.now().isoformat(),
    }
    processed_urls = set(checkpoint["processed_urls"])
    all_places = checkpoint["places"]

    # ── Step 1: Sitemap ──
    log.info("=" * 60)
    log.info("ÉTAPE 1 — Récupération du sitemap")
    log.info("=" * 60)
    all_urls = fetch_sitemap_urls(SITEMAP_URL)
    urls_to_process = [u for u in all_urls if u not in processed_urls]

    if args.limit:
        urls_to_process = urls_to_process[:args.limit]
        log.info(f"Mode test : limité à {args.limit} articles")

    log.info(f"Total URLs : {len(all_urls)} | Déjà traités : {len(processed_urls)} | À traiter : {len(urls_to_process)}")

    # ── Step 2 & 3: Scrape + Extract ──
    log.info("\n" + "=" * 60)
    log.info("ÉTAPES 2 & 3 — Scraping + Extraction IA")
    log.info("=" * 60)

    stats = {"scraped": 0, "skipped": 0, "places_found": 0, "errors": 0}

    for i, url in enumerate(urls_to_process, 1):
        log.info(f"[{i}/{len(urls_to_process)}] {url}")

        # Scraping
        article = scrape_article(url)
        if not article:
            log.debug(f"  ✗ Scraping échoué ou contenu vide")
            stats["skipped"] += 1
            processed_urls.add(url)
            time.sleep(REQUEST_DELAY)
            continue

        stats["scraped"] += 1

        # Extraction Claude
        places = extract_places(article, claude_client)

        if places:
            log.info(f"  ✓ {len(places)} lieu(x) trouvé(s) : {[p.get('name') for p in places]}")
            all_places.extend(places)
            stats["places_found"] += len(places)
        else:
            log.debug(f"  — Aucun lieu dans cet article")

        processed_urls.add(url)

        # Checkpoint toutes les N URLs
        if i % BATCH_SIZE == 0:
            checkpoint["processed_urls"] = list(processed_urls)
            checkpoint["places"] = all_places
            save_checkpoint(checkpoint)
            log.info(f"  💾 Checkpoint sauvegardé ({i} articles, {stats['places_found']} adresses)")

        time.sleep(REQUEST_DELAY)

    # Checkpoint final
    checkpoint["processed_urls"] = list(processed_urls)
    checkpoint["places"] = all_places
    save_checkpoint(checkpoint)

    # ── Step 4: Geocoding ──
    if not args.skip_geocoding:
        log.info("\n" + "=" * 60)
        log.info("ÉTAPE 4 — Géocodage des adresses")
        log.info("=" * 60)

        places_without_coords = [p for p in all_places if not p.get("latitude")]
        log.info(f"{len(places_without_coords)} lieux à géocoder sur {len(all_places)} total")

        for i, place in enumerate(places_without_coords, 1):
            geocode_place(place, GOOGLE_MAPS_API_KEY)
            if i % 10 == 0:
                log.info(f"  Géocodage : {i}/{len(places_without_coords)}")
            time.sleep(0.2)  # Respecte le quota Google (50 req/s)

    # ── Step 5: Déduplication + Export ──
    log.info("\n" + "=" * 60)
    log.info("ÉTAPE 5 — Déduplication & Export")
    log.info("=" * 60)

    unique_places = deduplicate(all_places)
    log.info(f"Avant dédup : {len(all_places)} | Après : {len(unique_places)}")

    # Export CSV (pour WP All Import)
    export_csv(unique_places, OUTPUT_CSV)

    # Export JSON (archive complète)
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(unique_places, f, ensure_ascii=False, indent=2)
    log.info(f"JSON exporté : {OUTPUT_JSON}")

    # ── Résumé final ──
    log.info("\n" + "=" * 60)
    log.info("RÉSUMÉ")
    log.info("=" * 60)
    log.info(f"Articles traités  : {stats['scraped']}")
    log.info(f"Articles ignorés  : {stats['skipped']}")
    log.info(f"Adresses extraites: {len(unique_places)}")

    # Répartition par catégorie
    from collections import Counter
    cats = Counter(p.get("category", "autre") for p in unique_places)
    for cat, count in cats.most_common():
        log.info(f"  {cat:20s}: {count}")

    log.info(f"\nFichier prêt à importer : {OUTPUT_CSV}")
    log.info("Prochain étape : WP All Import > voir README.md")


if __name__ == "__main__":
    main()
