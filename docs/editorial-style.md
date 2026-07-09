# Style éditorial des leçons

## Ton

- Français, vouvoiement, direct et pédagogique. Pas de jargon sans définition immédiate.
- Vulgariser sans infantiliser : le lecteur est un professionnel curieux, pas un ingénieur.
- Exemples ancrés dans le quotidien ou l'entreprise (Netflix, assistants vocaux, service client…).

## Structure d'une leçon

- 1 leçon = 1 idée maîtrisable en **10 à 20 min** (champ `duration` honnête).
- Markdown : un seul `#` (titre de la leçon), sections `##`, sous-points `###`.
- **Gras** sur les termes clés à leur première apparition.
- Listes à puces dès que 3 éléments ou plus.
- Terminer par un callout : `> 💡 **À retenir** : …` (une phrase, l'essentiel).
- Longueur cible : 300–800 mots. Au-delà, découper en deux leçons.

## Quiz

- 1 à 3 questions par leçon, format QCM à 4 options.
- Chaque question teste un point réellement couvert par la leçon — jamais de culture générale hors leçon.
- Une seule bonne réponse (`correctIndex`) ; les distracteurs doivent être plausibles.
- `explanation` obligatoire : elle réexplique le concept, elle ne dit pas juste "c'est la bonne réponse".

## Exactitude

- Faits techniques vérifiables (dates, définitions) : en cas de doute, vérifier avant d'écrire.
- L'IA évolue vite : éviter les affirmations périssables ("le meilleur modèle est X") ; préférer les principes durables.
- Ne jamais inventer de chiffres ou d'études.

Format concret : `templates/lesson-template.md`. Référence : `examples/good-lesson.md`.
