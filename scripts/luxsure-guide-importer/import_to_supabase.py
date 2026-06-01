#!/usr/bin/env python3
"""
Import luxsure_guide_export.csv → Supabase (table: places)

Usage:
  python import_to_supabase.py
  python import_to_supabase.py --dry-run     # Vérifie sans insérer
  python import_to_supabase.py --batch 100   # Taille des batches
"""

import os
import csv
import re
import unicodedata
import json
import time
import argparse
import logging
from pathlib import Path

import requests
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s  %(levelname)-8s  %(message)s", datefmt="%H:%M:%S")
log = logging.getLogger(__name__)

SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # Pas la clé anon — la service role key

CSV_FILE = Path(__file__).parent / "luxsure_guide_export.csv"
BATCH_SIZE = 50

# ── Slug generator ─────────────────────────────────────────────────────────────

def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^\w\s-]", "", text.lower())
    text = re.sub(r"[-\s]+", "-", text)
    return text.strip("-")

def make_slug(name: str, city: str) -> str:
    base = slugify(f"{name}-{city}" if city else name)
    return base[:100]  # Limite de longueur

# ── CSV → Place dict ────────────────────────────────────────────────────────────

def csv_row_to_place(row: dict, slug_counter: dict) -> dict | None:
    name = row.get("post_title", "").strip()
    if not name:
        return None

    city    = row.get("meta:_ait-item_map:address", "").strip()
    # Extraire la ville depuis la colonne source_file si dispo
    # On utilise le champ address qui contient "Adresse, CP Ville"
    address_full = row.get("meta:_ait-item_map:address", "").strip()

    city_val = ""
    address_val = address_full
    # Essaie d'extraire ville depuis l'adresse si elle contient " · "
    if " · " in address_full:
        parts = address_full.split(" · ")
        address_val = parts[0].strip()
        city_val    = parts[1].strip() if len(parts) > 1 else ""

    # Génère un slug unique
    slug_base = make_slug(name, city_val)
    slug = slug_base
    counter = 1
    while slug in slug_counter:
        slug = f"{slug_base}-{counter}"
        counter += 1
    slug_counter[slug] = True

    # Nettoyage website
    website = row.get("meta:_ait-item_web", "").strip()
    if website and not website.startswith("http"):
        website = f"https://{website}"

    # Prix
    price_range = None
    pr = row.get("price_range", "").strip()
    if pr and pr.isdigit():
        price_range = int(pr)

    return {
        "slug":        slug,
        "name":        name,
        "category":    row.get("tax_ait-items", "À découvrir").strip(),
        "subcategory": row.get("meta:_ait-item_subtitle", "").strip() or None,
        "address":     address_val or None,
        "city":        city_val or None,
        "country":     "France",  # Sera affiné si l'adresse contient le pays
        "zip":         None,
        "lat":         float(row["meta:_ait-item_map:latitude"])  if row.get("meta:_ait-item_map:latitude",  "").strip() else None,
        "lng":         float(row["meta:_ait-item_map:longitude"]) if row.get("meta:_ait-item_map:longitude", "").strip() else None,
        "phone":       row.get("meta:_ait-item_telephone", "").strip() or None,
        "website":     website or None,
        "email":       row.get("meta:_ait-item_email", "").strip() or None,
        "instagram":   row.get("instagram", "").strip() or None,
        "price_range": price_range,
        "description": row.get("post_content", "").strip() or None,
        "is_published": True,
        "source_file": row.get("source_file", "").strip() or None,
    }

# ── Supabase REST upsert ───────────────────────────────────────────────────────

def upsert_batch(places: list[dict], dry_run: bool) -> int:
    if dry_run:
        log.info(f"  [DRY RUN] {len(places)} entrées à insérer")
        return len(places)

    headers = {
        "apikey":        SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type":  "application/json",
        "Prefer":        "resolution=merge-duplicates",  # Upsert sur slug (unique)
    }

    r = requests.post(
        f"{SUPABASE_URL}/rest/v1/places",
        headers=headers,
        json=places,
        timeout=30,
    )

    if r.status_code not in (200, 201):
        log.error(f"Erreur Supabase {r.status_code}: {r.text[:200]}")
        return 0

    return len(places)

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run",  action="store_true")
    parser.add_argument("--batch",    type=int, default=BATCH_SIZE)
    args = parser.parse_args()

    if not SUPABASE_URL:
        log.error("SUPABASE_URL manquante dans .env")
        return
    if not SUPABASE_SERVICE_KEY and not args.dry_run:
        log.error("SUPABASE_SERVICE_ROLE_KEY manquante dans .env")
        log.error("Trouve-la dans : Supabase Dashboard → Settings → API → service_role")
        return
    if not CSV_FILE.exists():
        log.error(f"Fichier introuvable : {CSV_FILE}")
        return

    # Lecture CSV
    with open(CSV_FILE, encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))
    log.info(f"CSV chargé : {len(rows)} lignes")

    # Conversion
    slug_counter: dict = {}
    places = []
    for row in rows:
        p = csv_row_to_place(row, slug_counter)
        if p:
            places.append(p)

    log.info(f"Places valides : {len(places)}")

    # Batches
    total_inserted = 0
    for i in range(0, len(places), args.batch):
        batch = places[i:i + args.batch]
        n = upsert_batch(batch, args.dry_run)
        total_inserted += n
        log.info(f"Batch {i // args.batch + 1}: {n}/{len(batch)} insérés ({total_inserted} total)")
        if not args.dry_run:
            time.sleep(0.3)  # Respecte les rate limits Supabase

    log.info(f"\n✓ Import terminé : {total_inserted} adresses dans Supabase")

    # Résumé JSON
    summary = {"total": total_inserted, "dry_run": args.dry_run}
    with open("import_summary.json", "w") as f:
        json.dump(summary, f)


if __name__ == "__main__":
    main()
