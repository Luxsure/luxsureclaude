# Rapport d'incident — Luxsure.fr : lenteurs, 504 et échecs de publication

**Période :** ~25 juin – 2 juillet 2026
**Statut au 02/07/2026 :** stabilisé, en attente de validation formelle (3 publications consécutives)
**Site :** https://www.luxsure.fr — WordPress ~31 933 articles, WPML (FR/EN), thème Penci/Soledad, hébergement saasweb (cp-hz4.saasweb.net)

---

## 1. Symptômes initiaux

- Erreurs fréquentes `504 Gateway Time-out` côté admin (et parfois front).
- Message Gutenberg « La mise à jour a échoué » lors de la publication/mise à jour d'articles.
- Lenteurs importantes dans l'admin, `wp-login.php` et pages publiques pouvant timeout.
- Déclencheur probable : optimisations SEO/netlinking récentes (Rank Math, Link Whisper, Pretty Links, hubs, autolinking) sur un site déjà très volumineux.

Confirmation Cloudflare (29/06, Ray ID a1366140787403c3) : « Browser OK, Cloudflare OK, **Host Error** » → le serveur d'origine ne répondait plus, Cloudflare hors de cause.

## 2. Cause racine identifiée

**WPML Sticky Links** : à chaque sauvegarde d'article, ce plugin scannait et réécrivait les liens internes sur l'ensemble de la base (31 933 articles, doublés par les traductions WPML). Chaque save monopolisait un worker PHP 5+ secondes.

Mécanique de l'incident :
1. Chaque sauvegarde (rédacteur, heartbeat, autosave) bloquait un worker PHP-FPM plusieurs secondes.
2. Cloudflare étant en `DYNAMIC` (aucun cache HTML servi), le trafic public consommait aussi les workers.
3. Le pool PHP-FPM saturait → REST API timeout → « La mise à jour a échoué » → 504 en cascade.
4. Les optimisations SEO (scan Link Whisper, autolinking) ont ajouté de la charge exactement au même endroit (liens internes en base), déclenchant la crise.

### Preuves

| Mesure (sauvegarde d'un brouillon vide) | Avant | Après désactivation Sticky Links |
|---|---|---|
| `POST /wp-json/wp/v2/posts/...` (chemin de publication Gutenberg) | 5 307 ms | **458 ms** (×10) |
| Heartbeats admin | 2 623 – 8 769 ms, timeouts (status 0) | 580 – 723 ms, aucun timeout |

Une seule modification a produit cette amélioration.

## 3. Pistes écartées pendant le diagnostic

| Suspect | Verdict |
|---|---|
| WPML CMS Navigation | Aucun effet mesurable sur les temps de save (désactivé quand même — inutilisé, fil d'Ariane géré par Rank Math/Soledad) |
| Plugin « Live Visitor » | La route REST `/livevisitor/v1` existe mais est enregistrée par le thème, fonction « Show Post Views » OFF — code dormant, jamais appelé |
| Cloudflare | Hors de cause (Host Error = origine) |
| Query Monitor / Code Profiler Pro | Surcharge de diagnostic, pas la cause — désactivés |
| WP Rocket | Contribuait au contexte (purge/preload) mais pas coupable principal |

## 4. État du site au 02/07/2026 (mesures à distance, 18h27 UTC)

| Mesure | 29/06 | 02/07 |
|---|---|---|
| Page d'accueil | ~1,6 s | **0,67 s** |
| Pages hubs (`/marques/`, `/mode-luxe/`…) | 2,9 – 3,3 s | **0,70 – 0,85 s** |
| Cache Cloudflare | `DYNAMIC` (jamais caché) | **`HIT`** (page servie du cache depuis 2h+) |
| REST API `/wp-json/wp/v2/posts` | ~1,4 s | ~1,7 s (non caché, normal) |
| `wp-login.php` | ~0,9 s | 0,73 s |

Le front public est désormais servi par le cache Cloudflare, ce qui décharge le serveur d'origine et libère les workers PHP pour l'admin.

## 5. Modifications effectuées (à conserver)

| Élément | État | Décision |
|---|---|---|
| WPML Sticky Links | **Désactivé** (02/07) | Définitif — cause racine |
| WPML CMS Navigation | **Désactivé** (02/07) | Définitif — inutilisé |
| Link Whisper Premium | Désactivé (erreur fatale à la réactivation) | Ne pas réactiver avant diagnostic du fatal error |
| Query Monitor | Désactivé | Réactivation ponctuelle uniquement (diagnostic court) |
| Code Profiler Pro | Désactivé | Idem |
| Redis Object Cache | Désactivé (état à re-vérifier — s'est déjà réactivé seul) | Ne pas réactiver sans redémarrage PHP + purge Redis |
| WPML Translate Everything | Désactivé par le webmaster | Ne pas réactiver |
| WP Rocket | Actif, allégé : preload OFF, Used CSS OFF, heartbeat control OFF, purges ciblées sur les hubs | Conserver ces réglages |
| `WP_DEBUG` / `SCRIPT_DEBUG` / `WP_DEBUG_LOG` | `false` | Conserver |
| `DISABLE_WP_CRON` | `true` | Vérifier qu'un cron serveur appelle bien `wp-cron.php` régulièrement |

## 6. Points encore ouverts (par priorité)

1. **Validation formelle non faite** : publier 3 articles de test consécutifs (dont 1 avec image de la médiathèque) sans échec ni 504. Critère : REST < 3 s, aucun « La mise à jour a échoué ». Tant que ce test n'est pas passé, l'incident n'est pas clos.
2. **Réactivations silencieuses inexpliquées** : Link Whisper (dossier renommé) et Redis se sont réactivés « tout seuls » fin juin. Identifier qui/quoi a accès en écriture (Pascal ? panel saasweb ? sync staging→prod ? restauration auto ?). **Principal risque de rechute** — chaque correctif peut être annulé silencieusement.
3. **`post.php` à ~7 s (TTFB pur)** : requête FormData classique (sans `meta-box-loader`), résistante aux désactivations WPML satellites. Probablement hors du chemin de publication Gutenberg. À élucider (quel éditeur, quel initiateur) avant d'y toucher — chantier d'optimisation, pas une urgence.
4. **Erreur fatale Link Whisper** : récupérer le message exact dans les logs PHP avant toute tentative de réactivation.
5. **WPML ATE** : jobs `sync`/`retry` (~1,6 s) à chaque ouverture d'éditeur. Vérifier la file de jobs et le mode de traduction dans WPML → Réglages.
6. **PHP-FPM** : `pm.max_children`, slow log et mémoire jamais vérifiés (accès serveur requis). À faire via Pascal/saasweb.

## 7. Conditions de reprise du chantier SEO

Ne reprendre le SEO/netlinking qu'après validation du point 6.1 **et** quelques jours de stabilité, puis :

- Maillage interne **sans** autolinking à la sauvegarde : insertions manuelles ou par lots hors heures de pointe. Jamais de scan global.
- Si Link Whisper revient : corriger d'abord le fatal error, puis réactiver avec `Disable Autolinking on Post Update` ON, cron autolinking OFF, broken link checker cron OFF.
- Sticky Links et CMS Navigation restent désactivés définitivement.
- Pas de purge/preload massif WP Rocket ; pas de Translate Everything WPML.

## 8. Accès et outils

- SFTP : `cp-hz4.saasweb.net`, user `luxdevsftp`, dossier `/web/` (mot de passe auprès de Pascal — jamais dans les logs/scripts). Port 22 inaccessible depuis les environnements Claude Code (HTTPS uniquement).
- `wp-login.php` protégé par un proof-of-work JavaScript (spam-shield saasweb) : les connexions automatisées par mot de passe de compte sont impossibles (REST Basic Auth, XML-RPC et login par cookie tous bloqués). **Pour un accès API : créer un mot de passe d'application WordPress** (wp-admin → Utilisateurs → Profil).
- Un plugin **MCP Adapter** est installé sur le site (`/wp-json/mcp/mcp-adapter-default-server`) — voie d'accès authentifiée possible pour de futures interventions.
- Scripts de diagnostic/stabilisation serveur : voir `wordpress-tools/` (audit, isolation WP Rocket, mu-plugin Publication Guard, reset OPcache) et `PLAN-STABILISATION.md`.

---

*Rapport établi le 02/07/2026 sur la base de diagnostics à distance (HTTP/REST) et d'interventions dans l'admin WordPress via l'extension Chrome.*
