# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run lint      # Run ESLint across the project
npx eslint src/path/to/file.ts  # Lint a single file
```

No test framework is configured.

## Environment Variables

Required (create a `.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxx...
```

## Architecture

This is an AI education platform ("AI Fluency Academy") built with Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Supabase, Zustand, and TanStack Query.

### Data Flow

Course and lesson content is **hardcoded** in `src/data/courses.ts` (4 courses, 30+ lessons, quiz questions). The database stores user progress only — it does not store course content.

User progress follows a **local-first** pattern:
1. Zustand store (`src/stores/progress.ts`) holds all client state (XP, badges, lesson completion), persisted to `localStorage` under key `"ai-fluency-progress"`.
2. `useSyncProgress()` watches the store and writes changes to Supabase asynchronously.
3. `useLoadProgress()` hydrates the Zustand store from Supabase on mount.

### Auth & Route Protection

`src/middleware.ts` runs on every request at the Edge, creates a server-side Supabase client, and enforces:
- `/dashboard`, `/admin` → require authenticated session
- `/auth/login`, `/auth/signup` → redirect to `/dashboard` if already signed in
- `/admin` → requires `role === 'admin'` or `'editor'` in the `profiles` table

The `?next=<path>` query param is preserved on login redirects.

### Supabase Clients

Two separate clients are required:
- `src/lib/supabase.ts` — browser client (uses cookies via `@supabase/ssr`)
- `src/lib/supabase-server.ts` — server/Route Handler client (uses `cookies()` from `next/headers`)

Always use the server client inside Route Handlers (`app/**/route.ts`), and the browser client inside `"use client"` components.

### Key Supabase Tables

- `profiles` — user info, XP, streak, level, role
- `user_lesson_progress` — per-lesson completion + quiz scores
- `user_badges` — earned badges per user
- `courses`, `modules`, `lessons`, `quiz_questions` — content schema (currently populated from hardcoded data)
- `subscriptions` — Stripe placeholder (not yet implemented)

TypeScript types for all tables are in `src/types/database.ts`.

### XP & Badge System

XP constants: `+50 XP` per lesson completed, `+20 XP` per quiz point. Level = `Math.floor(xp / 300) + 1`.

Badge eligibility is declaratively defined in `src/constants/badges.ts`. `useLessonCompletion()` (`src/hooks/useLessonCompletion.ts`) evaluates and awards badges after each lesson or quiz completion.

### Next.js Patterns

- Path alias `@/*` maps to `src/*`.
- Dynamic route params are typed as `Promise<{...}>` and awaited (Next.js 15+ async params pattern):
  ```ts
  const { courseId } = await params;
  ```
- TanStack Query is configured in `src/components/providers.tsx` with `staleTime: 60s` and `refetchOnWindowFocus: false`, but is not yet used for data fetching — it's ready for future server-state hooks.
