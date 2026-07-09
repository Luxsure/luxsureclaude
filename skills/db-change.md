# Skill : modifier le schéma ou les données Supabase

Pour : nouvelle table, nouvelle colonne, changement de policy RLS, trigger, seed.

## Contexte critique

- `supabase/schema.sql` et `seed.sql` sont exécutés **à la main** dans le SQL Editor Supabase. Modifier ces fichiers ne change rien en production tant que le propriétaire ne les a pas rejoués.
- Les permissions existent en double : RLS (base) + middleware Next (`src/middleware.ts`). Voir `docs/decisions.md` (D4).

## Procédure

1. Lire le schéma existant en entier (`supabase/schema.sql`) : réutiliser ses conventions (RLS activée sur chaque table, policies nommées en anglais lisible, trigger `update_updated_at` si colonne `updated_at`).
2. Écrire la modification dans `schema.sql` (état cible) **et** fournir dans la réponse le fragment SQL de migration à exécuter sur une base existante (`alter table…`, `create policy…`).
3. Toute nouvelle table : `enable row level security` + policies explicites. Une table sans policy est inaccessible — c'est voulu, ne pas "corriger" avec `using (true)` sans réfléchir à qui doit lire quoi.
4. Si la modification touche des colonnes lues/écrites par le code : mettre à jour `src/types/database.ts` et les requêtes concernées.
5. Si elle touche les rôles ou l'accès aux routes : aligner `src/middleware.ts`.
6. Si elle touche le contenu : aligner `seed.sql` (et `courses.ts` le cas échéant, voir D3).

## Vérification

- Passer `checklists/db-safety.md`.
- `npx tsc --noEmit` si du code TypeScript a été touché.
- Dans le message final : indiquer explicitement quel SQL doit être rejoué et dans quel ordre.
