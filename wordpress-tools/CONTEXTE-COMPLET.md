# Contexte complet — Incident & optimisation Luxsure.fr (document de passation)

> **But de ce fichier :** donner à une nouvelle conversation (Claude ou autre) tout le
> contexte nécessaire pour reprendre le dossier sans repartir de zéro. À coller en début
> de session. Dernière mise à jour : 05/07/2026.

---

## 0. Résumé en 5 lignes

Site WordPress **luxsure.fr** (magazine luxe, ~31 900 articles, bilingue FR/EN via WPML,
thème Penci/Soledad, hébergé chez saasweb, derrière Cloudflare). Fin juin 2026, après des
optimisations SEO/netlinking, le site est tombé en instabilité : **504 Gateway Timeout** et
**« La mise à jour a échoué »** à la publication. **Cause racine identifiée et corrigée :
le plugin WPML Sticky Links** (scan des liens internes sur toute la base à chaque
sauvegarde). Incident **résolu et validé le 05/07**. Reste : appliquer des optimisations
sûres (Cloudflare/WP Rocket) et élucider pourquoi certains plugins se réactivent seuls.

---

## 1. Le site

- URL : https://www.luxsure.fr — « UNE CERTAINE VISION DU LUXE »
- WordPress **7.0**, thème **Soledad/Penci 8.7.4**, **WPML 4.9.5** (FR + EN).
- **~31 933 articles** (confirmé via `x-wp-total` sur l'API REST).
- Hébergement : **saasweb** — SFTP `cp-hz4.saasweb.net`, user `luxdevsftp`, dossier `/web/`.
- CDN/proxy : **Cloudflare** (Polish actif en mode lossless, cache HTML fonctionnel).
- Pages hubs SEO : `/marques/`, `/mode-luxe/`, `/parfums/`, `/hotels-luxe/`,
  `/horlogerie/`, `/joaillerie/`, `/business-du-luxe/`, `/spiritueux-luxe/`.

### Plugins/outils SEO en jeu
Rank Math SEO, Link Whisper Premium, Pretty Links, WP Rocket, Redis Object Cache,
WPML + WPML SEO, Cloudflare, maillage interne/auto-linking.

---

## 2. Symptômes de l'incident (fin juin 2026)

- `504 Gateway Time-out` fréquents côté admin, parfois sur le front.
- Message Gutenberg « **La mise à jour a échoué** » à la publication/màj d'articles.
- Lenteurs admin, `wp-login.php` et pages publiques pouvant timeout.
- Cloudflare (29/06) : « Browser OK, Cloudflare OK, **Host Error** » → **le serveur
  d'origine ne répondait plus**, Cloudflare hors de cause.
- Déclencheur probable : optimisations SEO récentes (scan Link Whisper, autolinking,
  maillage interne) ajoutant de la charge sur un point déjà fragile.

---

## 3. CAUSE RACINE (confirmée)

**WPML Sticky Links.** À chaque sauvegarde d'article, ce plugin scannait et réécrivait
les liens internes sur toute la base (31 933 articles × traductions). Chaque `save_post`
monopolisait un worker PHP-FPM 5+ secondes. Cloudflare étant alors en `DYNAMIC` (aucun
cache HTML), le trafic public consommait aussi les workers → **saturation du pool
PHP-FPM** → REST timeout → « mise à jour a échoué » → 504 en cascade.

### Preuve (une seule désactivation)
| Mesure (sauvegarde brouillon) | Avant | Après désactivation Sticky Links |
|---|---|---|
| POST REST `/wp/v2/posts/...` (chemin publication Gutenberg) | 5 307 ms | **458 ms** (×10) |
| Heartbeats admin | 2 623–8 769 ms + timeouts | 580–723 ms, plus de timeout |

---

## 4. Actions réalisées (état des plugins — À CONSERVER)

| Élément | État | Décision |
|---|---|---|
| **WPML Sticky Links** | Désactivé (02/07) | **Définitif** — cause racine |
| **WPML CMS Navigation** | Désactivé (02/07) | Définitif — inutilisé (fil d'Ariane géré par Rank Math/Soledad) |
| Link Whisper Premium | Désactivé | Ne pas réactiver — **erreur fatale** à l'activation, non diagnostiquée |
| Query Monitor | Désactivé | Diagnostic ponctuel seulement |
| Code Profiler Pro | Désactivé | Diagnostic ponctuel seulement |
| Redis Object Cache | Désactivé (mais s'est déjà réactivé seul !) | Ne pas réactiver sans redémarrage PHP + purge Redis |
| WPML Translate Everything | Désactivé par le webmaster | Ne pas réactiver |
| WP Rocket | Actif, allégé : preload OFF, Used CSS OFF, heartbeat control OFF, purges ciblées hubs | Conserver |
| `WP_DEBUG` / `SCRIPT_DEBUG` / `WP_DEBUG_LOG` | `false` | Conserver |
| `DISABLE_WP_CRON` | `true` | Vérifier qu'un vrai cron serveur appelle `wp-cron.php` |

### Pistes écartées pendant le diagnostic
- **« Live Visitor »** : la route REST `/livevisitor/v1` existe mais vient du thème
  (fonction « Show Post Views » OFF) — code dormant, jamais appelé. Pas coupable.
- **WPML CMS Navigation** : aucun effet mesurable (désactivé quand même, inutile).
- **Cloudflare** : hors de cause (Host Error = origine).
- **`post.php` à ~7 s (TTFB pur)** : réel mais hors du chemin de publication Gutenberg
  (soumission FormData classique, sans `meta-box-loader`). Résistant aux désactivations
  WPML satellites. Chantier d'optimisation secondaire, pas urgent.

---

## 5. Validation finale (05/07/2026)

- **4 articles réels publiés** les 4-5 juillet sans incident (dont un à 09h46 le 05/07).
- Balayage complet à distance : **tout HTTP 200**, aucune erreur PHP.
  - 9 pages hubs FR : 0,20–0,58 s (contre 2,9–3,3 s pendant l'incident).
  - Accueil EN, 5 derniers articles, REST, sitemaps, feed, recherche, 404 : OK.
  - **Charge 10 requêtes simultanées : 10× 200, max 1,7 s, aucune dégradation.**
- Cache Cloudflare `HIT`, Brotli actif, HTTP/2, cache navigateur assets très long.
- **Statut : incident RÉSOLU ET VALIDÉ.**

---

## 6. Points encore ouverts (par priorité)

1. **Réactivations silencieuses inexpliquées** (RISQUE DE RECHUTE n°1) : Link Whisper
   (dossier renommé) et Redis se sont réactivés « tout seuls » fin juin. Identifier
   qui/quoi a accès en écriture aux plugins : Pascal ? panel saasweb ? sync
   staging→prod ? restauration auto ? mises à jour auto ? **Tant que ce n'est pas
   répondu, chaque correctif peut être annulé silencieusement.**
2. **Erreur fatale Link Whisper** : récupérer le message exact dans les logs PHP avant
   toute tentative de réactivation.
3. **`post.php` à ~7 s** : à élucider (quel éditeur/initiateur) — optimisation, pas urgence.
4. **WPML ATE** : jobs `sync`/`retry` (~1,6 s) à chaque ouverture d'éditeur. Vérifier la
   file de jobs et le mode de traduction (doit être « Traduire ce dont j'ai besoin »,
   PAS « Translate Everything »).
5. **PHP-FPM** : `pm.max_children`, slow log, mémoire — jamais vérifiés (accès serveur requis).

---

## 7. Optimisations proposées (audit du 05/07) — par risque

### 🟢 Risque nul — Cloudflare (réversible 1 clic, n'affecte pas WordPress)
- **Polish → Lossy + WebP** : -30 à -50 % poids images.
- **HTTP/3 (QUIC)** : latence mobile.
- **3 en-têtes de sécurité** (Transform Rule) : `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`.
- **Bloquer `readme.html`/`license.txt`** (WAF) : masque la version WP.
- **Bloquer énumération users REST** (WAF) : bloquer `/wp-json/wp/v2/users` quand le
  cookie `wordpress_logged_in` est absent.

### 🟡 Risque faible — WordPress, réversible
- Lazy-load WP Rocket (Média) **en excluant les 3 premières images** (protège le LCP).
- (Alternative aux règles Cloudflare hardening : mu-plugin `luxsure-hardening.php`, voir §9.)

### 🔴 À NE PAS faire sans procédure dédiée
- **HSTS** (peut rendre le site inaccessible), **CSP** (casse le rendu si mal calibrée),
  **Used CSS / combine JS agressif WP Rocket** (avait déjà cassé le site).

---

## 8. CONTRAINTE MAJEURE — accès au site

Le site est **verrouillé côté serveur** par la couche de sécurité saasweb. Les 4 voies
d'accès programmatique ont été testées et **sont toutes fermées depuis l'extérieur** :
| Voie | Résultat |
|---|---|
| Login cookie `wp-login.php` | **Proof-of-work JavaScript** (spam-shield saasweb) — nécessite un vrai navigateur |
| XML-RPC | Bloqué / rejette l'auth |
| REST Basic Auth (mot de passe de compte) | Refusé (WP n'accepte que les mots de passe d'application) |
| REST Basic Auth (mot de passe d'**application**) | **En-tête `Authorization` strippé** avant WordPress → `rest_not_logged_in` |

**Conséquence :** on ne peut PAS agir sur le site par API depuis une session Claude Code.
Les deux seuls canaux qui marchent :
1. **Extension Claude dans Chrome** (dans le navigateur authentifié de l'utilisateur) —
   c'est elle qui a désactivé Sticky Links avec succès.
2. **SFTP/SSH réel** depuis le poste de Pascal (port 22 bloqué depuis Claude Code).

Pour débloquer l'API REST il faudrait ajouter au `.htaccess` de `/web/` une règle de
transmission de l'en-tête Authorization (`SetEnvIf Authorization ...` + `RewriteRule
E=HTTP_AUTHORIZATION`) — nécessite un accès fichier. Ou lever le blocage côté panel saasweb.

> Note sécurité : des identifiants (SFTP, mot de passe de compte, mot de passe
> d'application) ont transité en clair dans les conversations. **Les faire tourner**
> après les interventions.

---

## 9. Livrables produits (dans le repo, dossier `wordpress-tools/`)

| Fichier | Contenu |
|---|---|
| `PLAN-STABILISATION.md` | Plan initial de stabilisation (audit → PHP-FPM/OPcache → isolation WP Rocket) |
| `RAPPORT-INCIDENT.md` | Rapport d'incident complet + validation finale |
| `AUDIT-OPTIMISATIONS.md` | Audit global + optimisations classées par risque |
| `BRIEFS-OPTIMISATIONS.md` | Briefs d'application (Cloudflare, mu-plugin, WP Rocket) |
| `BRIEF-CHROME-OPTIMISATIONS.md` | Brief prêt à coller dans Claude-Chrome (voie Cloudflare) |
| `mu-plugins/luxsure-hardening.php` | mu-plugin sûr : masque version WP, bloque énum. users REST (non connectés), 3 en-têtes sécurité. Réversible (supprimer le fichier) |
| `mu-plugins/luxsure-publication-guard.php` | mu-plugin optionnel : neutralise les hooks lourds au save_post (activé par constante) |
| `diagnostic/audit-serveur.sh` | Script d'audit serveur (à lancer en SSH) |
| `diagnostic/audit-wpcli.sh` | Audit approfondi WP-CLI |
| `stabilisation/disable-wp-rocket-hooks.sh` | Isolation WP Rocket côté fichiers (+ `--restore`) |
| `stabilisation/reset-opcache-phpfpm.php` | Reset OPcache via navigateur (protégé par secret) |
| `stabilisation/test-publication.sh` | Test de publication via WP-CLI |

Branche git : `claude/luxsure-wordpress-slowness-v3hayf` (repo `luxsure/luxsureclaude`).

---

## 10. Règles d'or (à respecter dans toute suite)

- **Une modification à la fois**, puis vérifier le front + une publication de test.
- **Priorité stabilité, pas optimisation** tant qu'il subsiste un doute.
- Ne PAS réactiver : Link Whisper (avant correction du fatal), scan/autolinking,
  WPML Translate Everything, Redis (sans redémarrage PHP + purge), Used CSS,
  combine JS agressif.
- Ne PAS activer HSTS ni CSP « pour voir ».
- **Ne pas reprendre le SEO/netlinking** avant plusieurs jours de stabilité confirmée ;
  et alors, maillage interne SANS autolinking au save (insertions manuelles/par lots
  hors heures de pointe).
- Garder Sticky Links et CMS Navigation **désactivés définitivement**.

---

## 11. Prochaines actions concrètes

1. Appliquer les optimisations 🟢/🟡 via `BRIEF-CHROME-OPTIMISATIONS.md`
   (Cloudflare Polish WebP, HTTP/3, en-têtes, blocage readme + énum users ; lazy-load).
2. Demander à Pascal/saasweb : **qui/quoi réactive Link Whisper et Redis** (point §6.1).
3. Récupérer le **fatal error exact** de Link Whisper dans les logs.
4. (Optionnel) Corriger le `.htaccess` pour l'en-tête Authorization si on veut un accès
   API REST direct depuis l'extérieur.
