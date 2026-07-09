# Conventions de code

## TypeScript

- Mode strict. Pas de `any` ; typer les réponses Supabase avec `src/types/database.ts`.
- Interfaces exportées près de leurs données (voir le haut de `src/data/courses.ts`).
- Imports absolus via l'alias `@/` (jamais de `../../..`).

## Composants React

- Server Components par défaut ; ajouter `"use client"` uniquement si hooks/état/événements.
- Un composant = un fichier, nom en PascalCase, dans `src/components/` (sous-dossier par domaine, ex. `dashboard/`).
- Composition avec `cn()` de `@/lib/utils` pour les classes conditionnelles.

## Supabase

- Côté client : `createClient()` de `@/lib/supabase`.
- Côté serveur (Server Components, route handlers) : `createClient()` de `@/lib/supabase-server`.
- Ne jamais utiliser la clé service_role dans du code embarqué côté client.
- Les mutations de progression passent par upsert avec `onConflict` (voir `useSyncProgress`).

## Styles

- Tailwind v4, thème défini dans `src/app/globals.css` (`@theme inline`).
- Utiliser les tokens : `background`, `foreground`, `card`, `card-hover`, `border`, `primary`, `primary-light`, `accent`, `success`, `warning`, `error`.
- Jamais de hex codé en dur dans les composants ; le rendu Markdown des leçons utilise la classe `.prose-lesson`.
- Rayons généreux (`rounded-2xl` pour les cartes), thème sombre uniquement.

## Textes et langue

- UI et contenu : français, vouvoiement. Apostrophes typographiques (’) dans le contenu.
- Code, noms de variables, commits : anglais.
- IDs de contenu (cours, modules, leçons, quiz) : kebab-case anglais (`what-is-ai`, `q1-ml`).

## Git

- Branches de travail : jamais de push direct sur `main`.
- Messages de commit : anglais, préfixe conventionnel (`feat:`, `fix:`, `chore:`, `docs:`, `content:`).
