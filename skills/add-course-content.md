# Skill : ajouter ou modifier du contenu pédagogique

Pour : nouvelle leçon, nouveau quiz, nouveau module, nouveau cours, ou édition de contenu existant.

## Avant de commencer

1. Lire `docs/editorial-style.md` (ton, structure, exigences).
2. Ouvrir `templates/lesson-template.md` et, si besoin, `examples/good-lesson.md`.
3. Repérer dans `src/data/courses.ts` le cours/module cible et les IDs existants.

## Procédure

1. **Choisir les IDs** : kebab-case anglais, uniques dans tout le fichier (`lesson`: `understanding-llm` ; `quiz`: `q1-<lesson-id>`). Un ID publié ne change jamais.
2. **Écrire la leçon** dans `src/data/courses.ts`, en suivant le template (Markdown dans le champ `content`, backticks template literal).
3. **Écrire le quiz** (1–3 questions, 4 options, `explanation` pédagogique obligatoire).
4. **Mettre à jour les métadonnées du cours** : `lessonsCount`, `duration` totale si elle change.
5. **Refléter dans `supabase/seed.sql`** : lignes `modules` / `lessons` / `quiz_questions` correspondantes (échapper les apostrophes en doublant : `l''IA`). Le Markdown complet n'est pas dans le seed — seulement structure et quiz.
6. Pour un **nouveau cours** : ajouter aussi la ligne `courses` dans le seed (id, titre, descriptions, `level` en anglais — `beginner`/`intermediate`/`advanced` —, icône, gradient `color`, tags, `order`).

## Vérification

- `npx tsc --noEmit` et `npm run lint`.
- Passer `checklists/content-quality.md`.
- Si possible, lancer `npm run dev` et ouvrir la leçon pour vérifier le rendu Markdown et le quiz.
