# Contexte du projet

## Mission

Rendre des apprenants francophones opérationnels sur l'IA (concepts, usage business, IA générative, éthique) via des cours courts, interactifs et gamifiés.

## Utilisateurs cibles

- **Apprenants débutants à intermédiaires** : professionnels et curieux, non techniques, francophones.
- **Éditeurs** (rôle `editor`) : créent et maintiennent le contenu pédagogique.
- **Admins** (rôle `admin`) : gèrent utilisateurs, contenu et abonnements.

## État du produit (2026-07)

### Implémenté
- 4 cours, 8 leçons, 6 quiz — contenu statique dans `src/data/courses.ts`.
- Parcours : catalogue → page cours → leçon (Markdown + quiz) → progression.
- Gamification : XP (50/leçon, 20/point de quiz, 300/niveau), 10 badges, streaks.
- Auth Supabase (login/signup/signout, callback OAuth), protection de routes via middleware.
- Sync de progression localStorage ⇄ Supabase (best-effort, voir `useSyncProgress`).
- Schéma Postgres complet avec RLS (profils, cours, leçons, quiz, progression, badges, abonnements, audit log) + seed.

### Non implémenté (prévu par le schéma)
- CRUD admin des cours/leçons (l'admin est un scaffold en lecture seule).
- Paiement Stripe / gating des leçons `is_free = false`.
- Streaks calculés côté serveur (valeur statique côté client).
- Recherche full-text (index prêt en base, pas d'UI).

## Vocabulaire

- **Cours** → **Modules** → **Leçons** (contenu Markdown) → **Quiz** (QCM avec explication).
- Un badge a un `requirement_type` + `requirement_value` (voir `src/constants/badges.ts`).

## Zones d'incertitude (à clarifier avec le propriétaire)

- Lien entre le nom du repo (`luxsureclaude`, org Luxsure) et la marque "AI Fluency Academy" : positionnement et identité de marque non documentés.
- Tarification du freemium et périmètre exact du contenu gratuit.
- Cible de déploiement (Vercel ? autre ?) et environnements.
