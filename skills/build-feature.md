# Skill : développer une feature ou corriger un bug

## Avant de commencer

1. Lire `docs/architecture.md` (où vit quoi, flux de données) et `docs/conventions.md`.
2. Vérifier dans `docs/decisions.md` qu'aucune décision n'interdit ou ne contraint l'approche envisagée.
3. Lire les fichiers existants du domaine touché avant d'écrire — imiter les patterns en place (ex. les composants `dashboard/` pour un nouveau bloc de dashboard).

## Procédure

1. **Cadrer** : reformuler la demande en une phrase ; si elle touche auth, RLS ou paiement, lever les ambiguïtés avant de coder.
2. **Localiser** : identifier les fichiers à modifier ; préférer étendre un fichier existant plutôt qu'en créer un si le domaine existe déjà.
3. **Implémenter** par petits incréments cohérents :
   - Server Component par défaut, `"use client"` seulement si nécessaire.
   - Données de progression → passer par le store, jamais en direct.
   - Accès aux données → bon client Supabase selon le contexte (client/serveur).
   - Si le schéma DB doit changer → basculer sur `skills/db-change.md` pour cette partie.
4. **Nouvelle dépendance ?** Ne l'ajouter que si indispensable, et consigner le choix dans `docs/decisions.md`.

## Vérification

- `npm run lint` et `npx tsc --noEmit`.
- Passer `checklists/code-quality.md`.
- Exercer le parcours modifié dans l'app (`npm run dev`) quand c'est possible, pas seulement compiler.
- Commit en anglais, préfixe conventionnel.
