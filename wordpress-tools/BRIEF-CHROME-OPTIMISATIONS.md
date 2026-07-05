# Brief Claude-Chrome — application des optimisations sans risque

À coller dans l'extension Claude (Chrome), connecté à `wp-admin` **et** au dashboard
Cloudflare. Tout passe par Cloudflare (réversible en 1 clic, n'affecte pas WordPress)
sauf un réglage WP Rocket. Voie choisie pour éviter tout risque sur le cœur WordPress
(pas de mu-plugin à installer).

> La règle Cloudflare 1.5 remplace le mu-plugin `luxsure-hardening.php` : elle bloque
> l'énumération des utilisateurs REST côté edge, sans rien installer dans WordPress.
> Seul effet non couvert : le retrait de la balise `generator` (mineur, Cloudflare ne
> réécrit pas le corps HTML sur l'offre actuelle) — à ignorer ou traiter plus tard.

---

```
CONTEXTE — Luxsure.fr, application d'optimisations SANS RISQUE.
Le site vient d'être stabilisé (ne pas toucher au chemin de publication).
Règle : UN bloc à la fois, vérifier le site public + une publication de test
après chacun. S'arrêter au moindre comportement anormal. Chaque changement
est réversible — noter comment revenir en arrière.

Presque tout passe par Cloudflare (réversible en 1 clic, n'affecte pas WordPress).
Un seul réglage se fait dans wp-admin (WP Rocket lazy-load).

════════════════════════════════════════
BLOC 1 — Cloudflare (dashboard du domaine luxsure.fr)
════════════════════════════════════════

1.1 — Polish + WebP (poids images -30 à -50%)
  Speed → Optimization → Image Optimization (Polish)
  → régler sur "Lossy" + cocher "WebP" → Save.
  Vérif : recharger un article, aucune image cassée ; en DevTools Network
  une image renvoie content-type: image/webp.
  Retour arrière : Polish → "Lossless" ou "Off".

1.2 — HTTP/3
  Network → activer "HTTP/3 (with QUIC)".
  Retour arrière : désactiver l'interrupteur.

1.3 — En-têtes de sécurité (3, sans risque)
  Rules → Transform Rules → Modify Response Header → Create rule.
  "If: All incoming requests", "Then: Set static" :
    X-Content-Type-Options = nosniff
    Referrer-Policy = strict-origin-when-cross-origin
    X-Frame-Options = SAMEORIGIN
  Déployer.
  NE PAS ajouter Strict-Transport-Security ni Content-Security-Policy.
  Retour arrière : supprimer la Transform Rule.

1.4 — Masquer readme.html / fichiers de version
  Security → WAF → Custom rules → Create.
  Expression :
    (http.request.uri.path eq "/readme.html")
    or (http.request.uri.path eq "/license.txt")
    or (http.request.uri.path eq "/wp-config-sample.php")
  Action : Block. Déployer.
  Vérif : ouvrir https://www.luxsure.fr/readme.html → page de blocage.
  Retour arrière : supprimer la règle.

1.5 — Bloquer l'énumération des utilisateurs REST (remplace le mu-plugin)
  Objectif : empêcher les visiteurs NON connectés de lister les auteurs via
  /wp-json/wp/v2/users, sans bloquer l'admin.
  Security → WAF → Custom rules → Create.
  Expression :
    (http.request.uri.path contains "/wp-json/wp/v2/users")
    and not (http.cookie contains "wordpress_logged_in")
  Action : Block. Déployer.
  Vérif NON connecté (fenêtre privée) :
    https://www.luxsure.fr/wp-json/wp/v2/users → bloqué.
  Vérif CONNECTÉ (ta session admin) : l'éditeur et WPML fonctionnent toujours.
  Retour arrière : supprimer la règle.

════════════════════════════════════════
BLOC 2 — WP Rocket lazy-load (wp-admin) — ATTENTION au LCP
════════════════════════════════════════
  Réglages → WP Rocket → onglet Média.
  - Activer LazyLoad → pour les images (et iframes/vidéos si proposé).
  - IMPORTANT : trouver l'option "Nombre d'images exclues du LazyLoad"
    (excluded / above the fold) et la régler sur 3, pour que l'image héro
    du haut se charge immédiatement (sinon le LCP se dégrade).
  - Vider le cache WP Rocket (purge simple, PAS "vider et précharger").
  Vérif : recharger l'accueil → la bannière du haut s'affiche instantanément ;
    en scrollant, les images plus bas se chargent au défilement ; tester mobile.
  Retour arrière : WP Rocket → Média → décocher LazyLoad → vider le cache.

════════════════════════════════════════
NE PAS FAIRE
════════════════════════════════════════
  - Pas de HSTS, pas de CSP (chantiers à risque, séparés).
  - Pas de Used CSS / combine JS WP Rocket (avait cassé le site).
  - Pas de scan Link Whisper ni d'autolinking.
  - Ne pas enchaîner les blocs sans vérifier entre chaque.

ORDRE : 1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 2.
Après chaque bloc : recharger le front + publier un brouillon de test = OK.
Rapporte-moi le résultat de chaque bloc (fait / souci / retour arrière).
```

---

## Variante si PAS d'accès Cloudflare

Si le dashboard Cloudflare n'est pas accessible, ces protections se font alors dans
WordPress via le plugin léger **Code Snippets** (à installer), en collant le contenu de
`wordpress-tools/mu-plugins/luxsure-hardening.php` en tant que snippet PHP « exécuté
partout ». Voie un peu plus intrusive — préférer Cloudflare si disponible.
Le lazy-load (Bloc 2) reste identique dans tous les cas.
