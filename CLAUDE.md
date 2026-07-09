# Project Instructions

## Mission

AI Fluency Academy : plateforme francophone d'apprentissage de l'IA. Cours interactifs (leçons Markdown + quiz), gamification (XP, niveaux, badges, streaks), dashboard de progression, espace admin en construction. Stack : Next.js 16 (App Router) + Supabase. Modèle freemium prévu (Stripe, non implémenté).

## Operating Principles

- Lis le fichier spécialisé pertinent AVANT d'agir (voir Documentation Map). Ne charge pas tout.
- Contenu pédagogique et textes UI en **français** (vouvoiement). Code, identifiants et commits en **anglais**.
- Le contenu vit à deux endroits : `src/data/courses.ts` (source de vérité actuelle) et `supabase/seed.sql`. Toute modification de contenu doit maintenir les deux cohérents — voir `docs/decisions.md` (D3).
- Ne jamais affaiblir une policy RLS ni modifier le schéma sans passer par `skills/db-change.md`.
- Pas de nouvelle dépendance npm sans justification consignée dans `docs/decisions.md`.

## Default Workflow

1. Identifier le type de tâche :
   - Contenu pédagogique (cours, leçon, quiz) → `skills/add-course-content.md`
   - Feature ou bugfix → `skills/build-feature.md`
   - Schéma, RLS, seed → `skills/db-change.md`
2. Suivre le skill correspondant.
3. Passer la checklist associée avant de conclure.
4. Vérifier : `npm run lint` et `npx tsc --noEmit` passent.

## Documentation Map

- `docs/context.md` — mission, utilisateurs cibles, état du produit
- `docs/architecture.md` — carte technique : arborescence, flux de données, auth
- `docs/conventions.md` — conventions de code (TS, composants, Supabase, Tailwind)
- `docs/editorial-style.md` — ton, structure et exigences des leçons
- `docs/decisions.md` — décisions structurantes (à enrichir, jamais réécrire)
- `docs/anti-patterns.md` — erreurs connues à ne pas reproduire
- `skills/` — procédures pas-à-pas par type de tâche
- `templates/lesson-template.md` — squelette d'une leçon + quiz
- `checklists/` — contrôles qualité par type de tâche
- `examples/good-lesson.md` — leçon de référence

## Rules

- TypeScript strict ; pas de `any` non justifié.
- Utiliser les tokens du thème (`bg-card`, `border-border`, `text-foreground`…), jamais de couleurs codées en dur — voir `docs/conventions.md`.
- Client Supabase : `@/lib/supabase` côté client, `@/lib/supabase-server` côté serveur. Ne jamais croiser.
- Toute logique XP/badges passe par `src/stores/progress.ts` et `src/constants/badges.ts` — ne pas la dupliquer ailleurs.
- Nouvelle décision structurante → ajouter une entrée datée dans `docs/decisions.md`.

## Before Finishing Any Task

- [ ] Lint + typecheck OK.
- [ ] Checklist du type de tâche passée (`checklists/`).
- [ ] Si contenu modifié : `courses.ts` et `seed.sql` cohérents.
- [ ] Commit clair en anglais ; jamais de push direct sur `main`.
