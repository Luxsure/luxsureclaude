# Checklist : qualité du code

À passer avant de conclure toute feature ou bugfix.

- [ ] `npm run lint` passe.
- [ ] `npx tsc --noEmit` passe.
- [ ] Pas de `any` ajouté sans justification.
- [ ] `"use client"` seulement là où c'est nécessaire.
- [ ] Bon client Supabase selon le contexte (`supabase` côté client, `supabase-server` côté serveur).
- [ ] Aucune couleur en dur ; tokens du thème utilisés.
- [ ] Textes UI en français, vouvoiement.
- [ ] Logique XP/badges non dupliquée (tout passe par le store et `constants/badges.ts`).
- [ ] Aucune clé secrète ni valeur d'env codée en dur.
- [ ] Parcours modifié exercé dans l'app quand c'était possible (pas seulement compilé).
- [ ] Si une décision structurante a été prise : entrée ajoutée dans `docs/decisions.md`.
