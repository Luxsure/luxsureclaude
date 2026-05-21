# Prompt ChatGPT Agent — Luxsure Guide Paris

---

## PROMPT À COPIER-COLLER DANS CHATGPT (mode Agent / GPT-4o avec navigation web)

---

```
Tu es un agent de recherche spécialisé dans l'univers du luxe parisien.

Ta mission : constituer la base de données la plus complète possible des adresses
incontournables à Paris dans 3 catégories, en t'appuyant sur des sources
reconnues (guides Michelin, Relais & Châteaux, Forbes Travel Guide, Condé Nast,
Vogue, sites officiels, Google Maps).

---

## CATÉGORIE 1 — RESTAURANTS ÉTOILÉS & GASTRONOMIQUES

Recherche et liste TOUS les restaurants suivants à Paris :
- Restaurants 3 étoiles Michelin (guide actuel)
- Restaurants 2 étoiles Michelin
- Restaurants 1 étoile Michelin réputés / tables de chef célèbre
- Restaurants gastronomiques haut de gamme sans étoile mais reconnus
  (ex: tables d'hôtels palace, restaurants de grands chefs)

Pour chacun, fournis :
- Nom exact
- Nombre d'étoiles Michelin (0 si aucune)
- Nom du chef
- Adresse complète (numéro, rue, arrondissement, code postal)
- Arrondissement
- Téléphone
- Site web officiel
- Compte Instagram si connu
- Fourchette de prix (menu dégustation ou prix moyen) : €€€ ou €€€€
- Spécialité / type de cuisine (1 ligne)

---

## CATÉGORIE 2 — HÔTELS 5 ÉTOILES & PALACES

Recherche et liste :
- Tous les hôtels classés "Palace" par Atout France (label officiel)
- Tous les hôtels 5 étoiles de Paris notables
- Les hôtels membres Leading Hotels of the World à Paris
- Les membres Relais & Châteaux à Paris

Pour chacun, fournis :
- Nom exact
- Classification (Palace / 5 étoiles / Leading Hotels / Relais & Châteaux)
- Adresse complète
- Arrondissement
- Téléphone
- Site web officiel
- Compte Instagram si connu
- Nombre de chambres approximatif
- Restaurant étoilé intégré (oui/non, nom du restaurant si oui)
- Note Google Maps si disponible

---

## CATÉGORIE 3 — BOUTIQUES DE LUXE & MAISONS DE MODE

Recherche et liste :
- Toutes les maisons de haute couture avec boutique principale à Paris
  (Chanel, Dior, Louis Vuitton, Hermès, Givenchy, Balenciaga, Saint Laurent,
  Valentino, Celine, Loewe, Bottega Veneta, Prada, Gucci, Fendi, Versace,
  Burberry, Cartier, Van Cleef & Arpels, Bulgari, Chopard, Harry Winston,
  Rolex, Patek Philippe, Richard Mille, etc.)
- Concept stores et multi-marques luxe (Colette spirit, 24 Sèvres, etc.)
- Parfumeries et maisons de beauté de luxe (Creed, Serge Lutens, Diptyque,
  By Terry, etc.)
- Maroquiniers, bottiers, chapeliers de luxe

Pour chacun, fournis :
- Nom exact
- Catégorie (Haute Couture / Joaillerie / Horlogerie / Maroquinerie /
  Parfumerie / Concept Store / Beauté)
- Adresse de la boutique PRINCIPALE ou FLAGSHIP à Paris
- Arrondissement
- Téléphone de la boutique
- Site web officiel
- Compte Instagram officiel
- Rue / quartier emblématique si applicable
  (ex: Avenue Montaigne, Rue du Faubourg Saint-Honoré, Place Vendôme,
  Rue Saint-Honoré, Le Marais)

---

## FORMAT DE SORTIE

Pour chaque adresse trouvée, génère un tableau JSON valide avec cette structure exacte :

[
  {
    "name": "Nom du lieu",
    "category": "restaurant | hotel | boutique | joaillerie | horlogerie | parfumerie",
    "subcategory": "Description courte (ex: Restaurant 3 étoiles Michelin)",
    "address": "Adresse complète",
    "zip": "75008",
    "city": "Paris",
    "country": "France",
    "arrondissement": "8e",
    "phone": "+33 1 XX XX XX XX",
    "website": "https://...",
    "instagram": "@...",
    "price_range": 4,
    "chef_or_director": "Nom si applicable",
    "michelin_stars": 0,
    "classification": "Palace | 5 étoiles | Haute Couture | etc.",
    "neighborhood": "Avenue Montaigne | Place Vendôme | etc.",
    "description": "1-2 phrases de présentation",
    "notes": "Infos complémentaires pertinentes"
  }
]

---

## INSTRUCTIONS IMPORTANTES

1. Utilise ta navigation web pour vérifier les adresses actuelles
   (certains établissements ont déménagé)
2. Vérifie que les numéros de téléphone sont au format international (+33...)
3. Si une information est incertaine ou introuvable, laisse le champ vide ""
   plutôt que d'inventer
4. Vise l'exhaustivité : il vaut mieux trop que trop peu
5. Produis les données en 3 blocs JSON séparés (un par catégorie),
   puis un 4e bloc avec TOUTES les entrées fusionnées
6. Indique à la fin : nombre total d'entrées par catégorie

Commence par les restaurants (catégorie 1), puis les hôtels (catégorie 2),
puis les boutiques (catégorie 3).
```

---

## COMMENT UTILISER CE PROMPT

1. **Ouvre ChatGPT** avec GPT-4o (la navigation web doit être activée)
2. **Colle le prompt** complet ci-dessus
3. **Attends** — ChatGPT va faire plusieurs recherches web (peut prendre 5-10 min)
4. **Récupère le JSON** généré à la fin
5. **Sauvegarde-le** dans un fichier `paris_luxury_manual.json`
6. Lance ensuite le script Python avec ce fichier en entrée
   (ajoute `--input paris_luxury_manual.json` à la commande)

## ASTUCE

Si ChatGPT produit trop de données en une fois, relance avec :
> "Continue avec la catégorie suivante" ou "Donne-moi les 20 suivants"

Tu peux aussi relancer le prompt en précisant un quartier spécifique :
> "Même chose mais uniquement pour les adresses de l'Avenue Montaigne et ses environs"
