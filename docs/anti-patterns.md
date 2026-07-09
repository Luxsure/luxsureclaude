# Anti-patterns — erreurs à ne pas commettre

Chaque entrée : le piège, pourquoi c'est grave, le bon réflexe.

## Contenu

- **Modifier `courses.ts` sans toucher `seed.sql` (ou l'inverse).** Les deux divergent silencieusement et la future migration en base sera fausse. → Toujours mettre à jour les deux (D3).
- **Quiz dont la réponse n'est pas dans la leçon.** L'apprenant échoue sans pouvoir apprendre. → Chaque question doit être couverte par le texte de la leçon.
- **`lessonsCount` ou `duration` non recalculés** après ajout/suppression de leçons dans un cours. → Recompter à chaque modification.
- **IDs de leçon/quiz dupliqués ou renommés.** La progression utilisateur est indexée par ID (localStorage + base) : renommer un ID efface la progression. → Les IDs sont immuables une fois publiés.

## Code

- **Importer `@/lib/supabase` dans du code serveur** (ou `supabase-server` côté client). Sessions cassées ou erreurs de build. → Respecter la séparation client/serveur.
- **Dupliquer la logique XP/badges** dans un composant. Deux barèmes divergents = XP incohérents. → Tout passe par `stores/progress.ts` et `constants/badges.ts` (D5).
- **Couleurs hex en dur dans les composants.** Casse la cohérence du thème. → Tokens du thème uniquement.
- **Textes UI en anglais.** Le produit est francophone. → Français, vouvoiement.

## Base de données

- **Élargir une policy RLS "pour que ça marche".** C'est presque toujours une fuite de données (progression, profils, abonnements). → Passer par `skills/db-change.md` + `checklists/db-safety.md`.
- **Changer une permission dans le middleware sans changer la RLS (ou l'inverse).** Les deux couches doivent rester alignées (D4).
- **Modifier `schema.sql` comme s'il était appliqué automatiquement.** Il est exécuté à la main dans le SQL Editor : signaler explicitement au propriétaire qu'une ré-exécution/migration est nécessaire.

## Process

- **Push direct sur `main`.** Interdit.
- **Conclure sans lint + typecheck.** Seul filet de sécurité du projet (D6).
