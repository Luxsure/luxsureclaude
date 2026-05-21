# Luxsure Guide — Extracteur d'adresses automatique

Pipeline Python qui extrait automatiquement toutes les adresses publiées dans les articles de luxsure.fr et génère un fichier CSV prêt à importer dans WordPress BusinessFinder+.

---

## Architecture du pipeline

```
luxsure.fr/sitemap.xml
      ↓ (1) Sitemap parser
Toutes les URLs d'articles
      ↓ (2) Scraper HTML
Texte brut de chaque article
      ↓ (3) Claude AI (Haiku)
JSON structuré : nom, adresse, catégorie, téléphone, site...
      ↓ (4) Google Geocoding API
+ latitude / longitude
      ↓ (5) Déduplication + Export
luxsure_guide_export.csv  →  WP All Import → BusinessFinder+
```

---

## Installation

### 1. Prérequis
- Python 3.10 ou supérieur
- pip

```bash
cd scripts/luxsure-guide-importer
pip install -r requirements.txt
```

### 2. Obtenir les clés API

#### Clé Claude (Anthropic)
1. Va sur https://console.anthropic.com
2. Crée un compte ou connecte-toi
3. Menu **API Keys** → **Create Key**
4. Copie la clé `sk-ant-...`
5. Recharge ton crédit (recommandé : $5 suffisent pour 2000+ articles avec Haiku)

**Coût estimé pour luxsure.fr :**
- ~2000 articles × 1500 tokens input = ~3M tokens
- Claude Haiku : $0.25/M tokens input + $1.25/M tokens output
- **Total estimé : ~$2-4 pour tout le site**

#### Clé Google Maps (Geocoding)
1. Va sur https://console.cloud.google.com
2. Crée un projet (ex: "luxsure-guide")
3. **APIs & Services** → **Enable APIs** → cherche "Geocoding API" → Activer
4. **Credentials** → **Create Credentials** → **API Key**
5. Restreins la clé à l'API Geocoding uniquement (sécurité)

**Coût estimé :**
- Quota gratuit : 40 000 requêtes/mois
- Pour 2000 adresses : **gratuit**

### 3. Configuration

```bash
cp .env.example .env
# Édite .env et colle tes clés API
```

---

## Utilisation

### Lancement complet
```bash
python main.py
```

### Mode test (50 articles seulement)
```bash
python main.py --limit 50
```

### Reprendre après interruption
```bash
python main.py --resume
```

### Sans géocodage (si tu n'as pas de clé Google Maps)
```bash
python main.py --skip-geocoding
```

---

## Fichiers générés

| Fichier | Description |
|---------|-------------|
| `luxsure_guide_export.csv` | **À importer dans WordPress** |
| `luxsure_guide_data.json` | Archive JSON complète |
| `checkpoint.json` | Progression (reprise possible) |

---

## Import dans WordPress avec WP All Import

### Étape 1 — Installer WP All Import
Dans WordPress : **Extensions** → **Ajouter** → chercher "WP All Import" → Installer

### Étape 2 — Importer le CSV
1. **WP All Import** → **New Import**
2. Upload `luxsure_guide_export.csv`
3. Type : **Custom Post Type** → sélectionner `ait-item` (BusinessFinder+)

### Étape 3 — Mapper les champs

Dans l'interface de mapping, associe les colonnes du CSV aux champs WordPress :

| Colonne CSV | Champ WP All Import |
|-------------|---------------------|
| `post_title` | Title |
| `post_content` | Content |
| `post_status` | Status |
| `tax_ait-items` | Category (taxonomy ait-items) |
| `meta:_ait-item_subtitle` | Custom Field: `_ait-item_subtitle` |
| `meta:_ait-item_telephone` | Custom Field: `_ait-item_telephone` |
| `meta:_ait-item_web` | Custom Field: `_ait-item_web` |
| `meta:_ait-item_email` | Custom Field: `_ait-item_email` |

### Étape 4 — Champ Map (adresse + coordonnées GPS)

Le champ `_ait-item_map` de BusinessFinder+ est un tableau PHP sérialisé.
Dans WP All Import, mappe `_ait-item_map` avec ce code PHP :

```php
serialize(array(
  'address'    => '{meta:_ait-item_map:address}',
  'latitude'   => '{meta:_ait-item_map:latitude}',
  'longitude'  => '{meta:_ait-item_map:longitude}',
  'streetview' => false
))
```

### Étape 5 — Lancer l'import
Clique **Confirm & Run Import**. WP All Import crée toutes les fiches automatiquement.

---

## Structure du CSV exporté

```
post_title              → Nom du lieu
post_content            → Description
tax_ait-items           → Catégorie (Gastronomie, Hôtels & Séjours, Shopping...)
meta:_ait-item_subtitle → Sous-titre (ex: "Restaurant gastronomique")
meta:_ait-item_map:address    → Adresse complète
meta:_ait-item_map:latitude   → Latitude GPS
meta:_ait-item_map:longitude  → Longitude GPS
meta:_ait-item_telephone      → Téléphone
meta:_ait-item_web            → Site web
meta:_ait-item_email          → Email
price_range             → 1 (€) à 4 (████)
instagram               → Compte Instagram
source_url              → URL de l'article source
```

---

## Catégories créées automatiquement

| Catégorie CSV | Affichage WordPress |
|---------------|---------------------|
| restaurant | Gastronomie |
| hotel | Hôtels & Séjours |
| boutique | Shopping |
| spa | Wellness & Beauté |
| bar | Bars & Cocktails |
| galerie / musee | Art & Culture |
| club | Nightlife |
| cafe | Cafés & Pâtisseries |
| autre | À découvrir |

Ces catégories doivent être créées dans WordPress avant l'import :
**BusinessFinder+** → **Categories** → créer chaque catégorie avec son slug.

---

## FAQ

**Q: Le script s'arrête à mi-chemin ?**
Relance avec `python main.py --resume` — il reprend exactement là où il s'était arrêté.

**Q: Un article est en accès restreint ?**
Le script l'ignorera automatiquement (contenu < 100 caractères).

**Q: Les coordonnées GPS sont manquantes pour certains lieux ?**
Si l'adresse n'est pas assez précise pour Google, les champs latitude/longitude resteront vides. Tu pourras les compléter manuellement dans WordPress.

**Q: Comment traiter les images des articles ?**
Le script n'importe pas les images (complexité + droits). Pour chaque fiche, tu peux ajouter des photos manuellement dans WordPress, ou étendre le script avec l'argument `--import-images`.
