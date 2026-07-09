# Architecture technique

## Stack

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 (thème sombre custom dans `globals.css`) · Zustand (persist) · TanStack Query · Supabase (`@supabase/ssr`) · lucide-react.

Pas de framework de test configuré. Vérification = `npm run lint` + `npx tsc --noEmit`.

## Arborescence utile

| Chemin | Rôle |
|---|---|
| `src/app/` | Routes App Router : `/`, `/courses`, `/courses/[courseId]`, `/courses/[courseId]/lessons/[lessonId]`, `/dashboard`, `/admin`, `/auth/*` |
| `src/data/courses.ts` | **Source de vérité du contenu** : types + cours/modules/leçons/quiz |
| `src/constants/badges.ts` | Définitions des badges + logique d'éligibilité |
| `src/stores/progress.ts` | Store Zustand persisté (`ai-fluency-progress`) : XP, niveau, badges, progression |
| `src/hooks/useSyncProgress.ts` | Sync store → Supabase et chargement Supabase → store |
| `src/hooks/useLessonCompletion.ts` | Complétion de leçon + attribution de badges |
| `src/lib/supabase.ts` | Client Supabase **navigateur** (`createBrowserClient`) |
| `src/lib/supabase-server.ts` | Client Supabase **serveur** (cookies Next) |
| `src/middleware.ts` | Refresh session + protection `/dashboard`, `/admin` (rôle admin/editor) |
| `src/components/` | UI : `Quiz`, `LessonContent`, `MarkdownRenderer`, `Navbar`, `dashboard/*` |
| `supabase/schema.sql` | Schéma complet + RLS + triggers (à exécuter dans le SQL Editor) |
| `supabase/seed.sql` | Seed reflétant `courses.ts` (contenu Markdown non inclus) |

## Flux de données

1. **Contenu** : lu statiquement depuis `courses.ts` par les pages. La base (`courses`, `modules`, `lessons`, `quiz_questions`) existe mais n'est pas encore la source lue par l'app.
2. **Progression** : écrite dans le store Zustand (localStorage) → poussée en best-effort vers Supabase par `useSyncProgress` quand l'utilisateur est connecté → rechargée au login par `useLoadProgress`.
3. **Auth** : middleware rafraîchit la session sur chaque requête ; redirige les non-connectés hors de `/dashboard` et `/admin` ; `/admin` exige rôle `admin` ou `editor` (vérifié en base).
4. **Rôles** : `user` / `editor` / `admin` dans `profiles.role` ; appliqués par RLS ET par le middleware — les deux doivent rester alignés.

## Variables d'environnement

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
