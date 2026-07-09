# Décisions structurantes

Journal ajout-seulement. Ne jamais réécrire une décision : en cas de changement, ajouter une nouvelle entrée qui la remplace explicitement.

## D1 — 2026-07 · Contenu statique d'abord, base prête ensuite

Le contenu vit dans `src/data/courses.ts` et est lu statiquement par l'app. Le schéma Supabase (cours/modules/leçons/quiz) existe déjà pour préparer la migration vers un CRUD admin, mais n'est **pas** encore la source lue. Ne pas brancher l'app sur la base sans décision explicite du propriétaire.

## D2 — 2026-07 · Progression locale d'abord, sync best-effort

La progression (XP, badges, leçons) est écrite dans Zustand persisté en localStorage, puis synchronisée vers Supabase quand l'utilisateur est connecté (`useSyncProgress`). Le localStorage prime en cas d'écriture ; Supabase prime au chargement après login. Conséquence : la plateforme fonctionne sans compte.

## D3 — 2026-07 · Double source de contenu assumée (temporaire)

`courses.ts` et `supabase/seed.sql` décrivent le même contenu. Tant que le CRUD admin n'existe pas, **toute modification de contenu doit mettre à jour les deux** (le Markdown complet n'est que dans `courses.ts` ; le seed porte structure, métadonnées et quiz). Cette dette disparaîtra à la migration D1.

## D4 — 2026-07 · Trois rôles, double application

Rôles `user` / `editor` / `admin` dans `profiles.role`. Appliqués à deux niveaux : RLS en base ET middleware Next (`/admin` exige admin ou editor). Toute évolution de permission doit modifier les deux, sinon incohérence silencieuse.

## D5 — 2026-07 · Constantes de gamification

XP : 50 par leçon, 20 par point de quiz, 300 par niveau. Définies uniquement dans `src/stores/progress.ts`. Badges définis uniquement dans `src/constants/badges.ts` (miroir en base dans `badges`). Ne pas dupliquer ces valeurs.

## D6 — 2026-07 · Pas de framework de test (pour l'instant)

Aucun runner de test configuré. Le filet de sécurité est lint + typecheck + vérification manuelle du parcours. À reconsidérer quand la logique métier serveur (Stripe, streaks) arrivera.

## D7 — 2026-07 · Architecture d'instructions sans dossier `workflows/`

Les procédures pas-à-pas vivent dans `skills/` (un fichier par type de tâche récurrente). Un dossier `workflows/` séparé dupliquerait ces procédures pour un projet de cette taille. Checklists et exemples restent séparés des skills.
