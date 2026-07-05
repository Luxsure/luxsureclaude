# Audit global & optimisations — Luxsure.fr

**Date :** 05/07/2026
**Méthode :** audit à distance en lecture seule (HTTP/REST, headers, analyse du HTML). Aucune modification effectuée sur le site.
**Principe directeur :** chaque optimisation est classée par risque, avec sa méthode de retour arrière. Rien qui touche au chemin de publication (déjà stabilisé) n'est proposé sans filet.

---

## Bilan de santé actuel : bon

| Domaine | État |
|---|---|
| Pages cachées (hubs, articles) | 0,2 – 0,6 s ✅ |
| Cache Cloudflare | `HIT`, edge cache actif ✅ |
| Compression | Brotli (`br`) actif sur le HTML ✅ |
| Protocole | HTTP/2 ✅ |
| Cache navigateur des assets | `max-age` très long (10 ans sur CSS/JS versionnés) ✅ |
| Cloudflare Polish | Actif (`cf-polished: ok`) — compresse les images ✅ |
| Publications | REST 458 ms, stables ✅ |

Le site n'est plus en situation d'incident. Les optimisations ci-dessous sont des gains incrémentaux, pas des correctifs urgents.

---

## Constats de l'audit

### Performance / poids
- **HTML de l'accueil : 319 Ko non compressé** (~50-70 Ko en brotli). Lourd mais servi par cache edge, donc TTFB bas.
- **20 images sur l'accueil, seulement 2 en `loading="lazy"`.** Les 18 autres se chargent immédiatement.
- **Aucune image en WebP** : Cloudflare Polish est en mode « lossless » (compresse le JPEG/PNG) mais ne convertit pas en WebP, alors que le navigateur l'accepte. Image héro = 74 Ko en JPEG, réductible à ~40 Ko en WebP.
- **16 fichiers JS/CSS proviennent du thème Soledad**, 3 de WPML, 2 de WP Rocket, 1 de Penci — 22 assets distincts. Beaucoup pour une page.
- HTTP/3 (QUIC) non confirmé — le site répond en HTTP/2.

### Sécurité (aucun en-tête de sécurité présent)
- **Aucun header de sécurité** : pas de `Strict-Transport-Security` (HSTS), `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, ni `Content-Security-Policy`.
- **Énumération des utilisateurs via REST ouverte** : `/wp-json/wp/v2/users` renvoie la liste des auteurs avec leurs `slug` (= logins potentiels, ex. `agathe-le-dimna`). Facilite le bruteforce ciblé.
- **`readme.html` accessible** (HTTP 200) → divulgue la version WordPress.
- **Balises `generator` exposées** dans le HTML : `WordPress 7.0`, `Soledad 8.7.4`, `WPML 4.9.5`. Renseigne un attaquant sur les versions exactes.
- Positif : `xmlrpc.php` renvoie 405 sur GET, listing de `/wp-content/uploads/` bloqué (401), `debug.log` en 404.

### SEO technique
- Sitemaps Rank Math OK, hreflang WPML présent et correct.
- `x-default` pointe sur la version FR — cohérent.

---

## Optimisations proposées, par risque

### 🟢 Risque nul — côté Cloudflare uniquement (n'affecte pas WordPress, réversible en 1 clic)

1. **Activer Polish → WebP** (Cloudflare → Speed → Optimization → Polish → « Lossless with WebP » ou « Lossy »).
   - Gain : -30 à -50 % sur le poids des images, sans toucher aux fichiers du site.
   - Retour arrière : repasser Polish en « Lossless ». Aucun risque de casse.

2. **Activer HTTP/3 (QUIC)** (Cloudflare → Network → HTTP/3). Amélioration de la latence mobile. Réversible.

3. **Ajouter les en-têtes de sécurité via Cloudflare** (Rules → Transform Rules → Modify Response Header), plutôt que dans WordPress :
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `X-Frame-Options: SAMEORIGIN`
   - Faire cet ajout côté Cloudflare évite tout risque de conflit avec un plugin WordPress et se retire d'un clic.
   - ⚠️ **HSTS et CSP : à traiter séparément et prudemment** (voir §risque élevé).

### 🟡 Risque faible — WordPress, réversible, à faire hors heures de pointe

4. **Masquer la version WordPress** : retirer la balise `generator` et bloquer `readme.html`.
   - Rank Math propose un réglage « Remove WordPress generator tag » ; sinon un petit mu-plugin (`remove_action('wp_head','wp_generator')`).
   - Retour arrière : retirer la ligne.

5. **Bloquer l'énumération des utilisateurs REST** : la plupart des plugins de sécurité (ou Rank Math) le font ; sinon filtrer `/wp-json/wp/v2/users` pour les non-authentifiés.
   - ⚠️ À tester : WPML et certains thèmes utilisent parfois l'endpoint users. Vérifier après coup que l'admin et le sélecteur d'auteur fonctionnent.

6. **Lazy-loading des images sous la ligne de flottaison** : vérifier le réglage WP Rocket → Media → LazyLoad (images). Actuellement seules 2/20 images sont en lazy.
   - ⚠️ Ne PAS lazy-loader l'image héro / LCP (garder les 2-3 premières en chargement immédiat, sinon le LCP se dégrade). WP Rocket a une option « nombre d'images exclues du lazyload en haut de page ».
   - Retour arrière : décocher LazyLoad.

### 🔴 Risque élevé — à ne PAS activer sans procédure de test dédiée

7. **HSTS (`Strict-Transport-Security`)** : une fois envoyé avec un long `max-age`, les navigateurs refusent tout accès HTTP au domaine pendant la durée. Si un sous-domaine ou un service n'est pas en HTTPS, il devient inaccessible. À n'activer qu'après vérification que **tout** (sous-domaines inclus) est en HTTPS, et commencer avec un `max-age` court (300 s) avant de l'allonger.

8. **Content-Security-Policy (CSP)** : sur un site avec WPML, Rank Math, Penci, régies pub/analytics, une CSP mal calibrée casse le rendu (scripts bloqués, images manquantes). Nécessite un audit complet des domaines tiers et une phase en `Content-Security-Policy-Report-Only`. Chantier à part entière, pas une case à cocher.

9. **Optimiser/réduire les assets du thème Soledad (combine/defer JS)** : WP Rocket peut « Delay JS » / « Combine ». Sur ce thème, une combinaison agressive a déjà cassé des choses par le passé (Used CSS a été désactivé pour cette raison). À tester une option à la fois, sur une page, avec vérification visuelle immédiate.

---

## Ce qu'il ne faut PAS faire (rappel incident)

- Pas de réactivation de « Optimiser le CSS utilisé / Used CSS » WP Rocket (avait contribué à l'instabilité).
- Pas de combine/minify JS agressif en une seule fois.
- Pas de scan Link Whisper ni d'autolinking à la sauvegarde.
- Pas de CSP ou HSTS activés « pour voir ».
- Une modification à la fois, vérification front + test de publication après chacune.

---

## Ordre recommandé (du plus sûr au plus engageant)

1. Cloudflare Polish → WebP (#1)
2. Cloudflare HTTP/3 (#2)
3. Cloudflare en-têtes de sécurité simples (#3, sans HSTS/CSP)
4. Masquer version WP + readme (#4)
5. Vérifier/ajuster le lazy-load WP Rocket sans toucher au LCP (#6)
6. Bloquer énumération users REST (#5) — avec test admin après
7. (Plus tard, chantiers dédiés) HSTS progressif, puis CSP en report-only, puis optimisation JS thème.

Chaque étape est indépendante et réversible. S'arrêter dès qu'un comportement anormal apparaît.

---

*Audit en lecture seule, aucune modification appliquée. Les mises en œuvre se font côté Cloudflare (dashboard) ou WordPress (admin), une étape à la fois.*
