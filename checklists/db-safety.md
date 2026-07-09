# Checklist : sécurité base de données

À passer avant de conclure toute modification de `schema.sql`, `seed.sql` ou des policies RLS.

- [ ] Chaque table nouvelle ou modifiée a `enable row level security`.
- [ ] Aucune policy élargie à `using (true)` sur des données utilisateur (progression, profils, badges gagnés, abonnements).
- [ ] Les policies d'écriture vérifient `auth.uid()` ou le rôle admin/editor.
- [ ] Middleware (`src/middleware.ts`) et RLS toujours alignés sur les rôles.
- [ ] `src/types/database.ts` mis à jour si des colonnes lues par le code ont changé.
- [ ] `seed.sql` toujours exécutable (apostrophes doublées, FK dans le bon ordre : courses → modules → lessons → quiz).
- [ ] Le fragment SQL de migration à rejouer est fourni explicitement dans la réponse finale, avec l'ordre d'exécution.
- [ ] Aucune donnée utilisateur supprimée ou écrasée sans confirmation explicite du propriétaire.
