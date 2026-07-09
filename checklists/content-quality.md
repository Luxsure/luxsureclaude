# Checklist : qualité du contenu pédagogique

À passer après toute création/modification de cours, leçon ou quiz.

## Éditorial

- [ ] Français correct, vouvoiement, apostrophes typographiques.
- [ ] Un seul `#` dans le Markdown ; sections en `##`/`###`.
- [ ] Termes clés en gras à leur première apparition, définis en langage simple.
- [ ] Callout final `> 💡 **À retenir**` présent, une phrase.
- [ ] 300–800 mots ; `duration` cohérente avec la longueur.
- [ ] Aucun fait inventé ; aucune affirmation périssable sur "le meilleur modèle/outil".

## Quiz

- [ ] 1–3 questions, 4 options chacune.
- [ ] Chaque réponse se trouve dans la leçon.
- [ ] `correctIndex` pointe la bonne option (vérifier une par une).
- [ ] `explanation` réexplique le concept.

## Intégrité des données

- [ ] IDs uniques, kebab-case, jamais renommés s'ils existaient déjà.
- [ ] `lessonsCount` et `duration` du cours recalculés.
- [ ] `supabase/seed.sql` mis à jour en miroir (leçons, quiz, apostrophes doublées).
- [ ] `npx tsc --noEmit` passe.
