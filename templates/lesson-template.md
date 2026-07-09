# Template : leçon + quiz

Squelette à insérer dans `src/data/courses.ts`, dans le tableau `lessons` d'un module. Règles de fond : `docs/editorial-style.md`.

```ts
{
  id: "lesson-id-kebab",            // immuable une fois publié
  title: "Titre en français",
  duration: "15 min",               // durée honnête, 10–20 min
  content: `# Titre en français

Phrase d'accroche qui situe le sujet et pourquoi il compte.

## Première section

Le concept clé en **gras** à sa première apparition, expliqué simplement.

### Sous-point si nécessaire

- Élément concret 1
- Élément concret 2
- Élément concret 3

## Deuxième section

Un exemple ancré dans le quotidien ou l'entreprise.

> 💡 **À retenir** : l'essentiel de la leçon en une phrase.`,
  quiz: [
    {
      id: "q1-lesson-id-kebab",
      question: "Question testant un point couvert par la leçon ?",
      options: [
        "Bonne réponse",
        "Distracteur plausible",
        "Distracteur plausible",
        "Distracteur plausible",
      ],
      correctIndex: 0,
      explanation:
        "Réexplication du concept — pas seulement 'c'est la bonne réponse'.",
    },
  ],
},
```

## Miroir seed.sql

```sql
-- dans insert into public.lessons (…)
('lesson-id-kebab', 'module-id', 'Titre en français', '15 min', <order>, true),

-- dans insert into public.quiz_questions (…)
('q1-lesson-id-kebab', 'lesson-id-kebab', 'Question… ?', '{"Bonne réponse","D1","D2","D3"}', 0, 'Réexplication.', 1);
```

Rappel : apostrophes doublées en SQL (`l''IA`), `correctIndex`/`correct_index` en base zéro.
