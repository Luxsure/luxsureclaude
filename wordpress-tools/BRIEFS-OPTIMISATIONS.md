# Briefs d'application — optimisations risque nul & faible

Chaque bloc est indépendant et réversible. Appliquer **un bloc à la fois**, vérifier
le site public + une publication de test après chacun, puis passer au suivant.
S'arrêter dès qu'un comportement anormal apparaît.

---

## BLOC 1 — Cloudflare (risque nul, réversible en 1 clic)

À faire dans le dashboard Cloudflare du domaine luxsure.fr.

### 1.1 — Polish WebP (poids des images -30 à -50 %)
1. Cloudflare → **Speed** → **Optimization** → onglet **Image Optimization** (ou « Polish »).
2. Régler **Polish** sur **« Lossy »**.
3. Cocher **« WebP »** (convertit les images à la volée pour les navigateurs compatibles).
4. Enregistrer.
- **Vérification :** recharger un article, vérifier qu'aucune image n'est cassée.
  En DevTools → Network → une image doit renvoyer `content-type: image/webp`.
- **Retour arrière :** repasser Polish sur « Lossless » ou « Off ».

### 1.2 — HTTP/3 (latence mobile)
1. Cloudflare → **Network**.
2. Activer **HTTP/3 (with QUIC)**.
- **Retour arrière :** désactiver l'interrupteur. Aucun risque.

### 1.3 — En-têtes de sécurité (si NON déjà couverts par le mu-plugin, voir Bloc 2)
> Le mu-plugin `luxsure-hardening.php` ajoute déjà `X-Content-Type-Options`,
> `Referrer-Policy` et `X-Frame-Options`. Ne PAS les dupliquer ici si le mu-plugin
> est installé. Ce sous-bloc n'est utile que si tu préfères tout gérer côté Cloudflare
> plutôt qu'avec le mu-plugin.
1. Cloudflare → **Rules** → **Transform Rules** → **Modify Response Header** → Create.
2. « If: All incoming requests ». « Then: Set static » :
   - `X-Content-Type-Options` = `nosniff`
   - `Referrer-Policy` = `strict-origin-when-cross-origin`
   - `X-Frame-Options` = `SAMEORIGIN`
3. Déployer.
- **NE PAS** ajouter `Strict-Transport-Security` ni `Content-Security-Policy` ici
  (chantiers à risque, traités séparément).
- **Retour arrière :** supprimer la Transform Rule.

### 1.4 — Bloquer readme.html & fichiers de version (masque la version WP)
1. Cloudflare → **Security** → **WAF** → **Custom rules** → Create.
2. Expression : `(http.request.uri.path eq "/readme.html") or (http.request.uri.path eq "/license.txt") or (http.request.uri.path eq "/wp-config-sample.php")`
3. Action : **Block**.
4. Déployer.
- **Vérification :** `https://www.luxsure.fr/readme.html` doit renvoyer une page de blocage.
- **Retour arrière :** supprimer la règle.

---

## BLOC 2 — Durcissement WordPress via mu-plugin (risque faible, réversible)

Fichier fourni : `wordpress-tools/mu-plugins/luxsure-hardening.php`.
Il fait 3 choses sûres : masque la version WP, bloque l'énumération des users REST
pour les visiteurs non connectés, ajoute 3 en-têtes de sécurité.

### Déploiement
1. Se connecter en SFTP (ou gestionnaire de fichiers de l'hébergeur).
2. Aller dans `/web/wp-content/`. Si le dossier `mu-plugins/` n'existe pas, le créer.
3. Y déposer `luxsure-hardening.php`.
4. C'est tout : les mu-plugins s'activent automatiquement.

### Vérifications après déploiement
- Le site public s'affiche normalement (recharger l'accueil + un article).
- `https://www.luxsure.fr/wp-json/wp/v2/users` doit renvoyer une **erreur** (plus la liste des auteurs) quand on n'est PAS connecté.
- Se connecter à l'admin : tout fonctionne, l'éditeur s'ouvre, WPML fonctionne.
- Publier un brouillon de test → doit réussir (le mu-plugin ne touche pas au save_post).
- En DevTools → Network → la réponse de l'accueil porte `x-content-type-options: nosniff`.

### Retour arrière
Supprimer le fichier `/web/wp-content/mu-plugins/luxsure-hardening.php`. Effet immédiat.

---

## BLOC 3 — Lazy-load WP Rocket (risque faible, attention au LCP)

Aujourd'hui seules 2 images sur 20 de l'accueil sont en `loading="lazy"`.

1. WordPress admin → **Réglages** → **WP Rocket** → onglet **Média**.
2. Activer **LazyLoad → pour les images** (et « pour les iframes/vidéos » si présent).
3. **IMPORTANT** — protéger le LCP : dans WP Rocket, chercher l'option
   **« Nombre d'images exclues du LazyLoad »** (Excluded images / "above the fold")
   et la régler sur **3** (les 3 premières images se chargent immédiatement,
   le reste en lazy). Cela évite de dégrader le Largest Contentful Paint.
4. Vider le cache WP Rocket (purge simple, PAS « vider et précharger »).

### Vérifications
- Recharger l'accueil : l'image héro (bannière du haut) s'affiche **immédiatement**,
  sans clignotement ni retard.
- Faire défiler : les images plus bas se chargent au scroll.
- Tester sur mobile (ou DevTools mode responsive).

### Retour arrière
WP Rocket → Média → décocher LazyLoad → vider le cache.

---

## Ordre d'exécution recommandé

1. **Bloc 1.1 + 1.2** (Cloudflare Polish WebP + HTTP/3) — gain immédiat, zéro risque.
2. **Bloc 2** (mu-plugin hardening) — couvre version WP + énumération users + en-têtes.
3. **Bloc 1.4** (blocage readme.html côté Cloudflare) — complète le masquage de version.
4. **Bloc 3** (lazy-load) — en dernier, car c'est celui qui demande le plus de vérif visuelle.

> Bloc 1.3 à ignorer si le Bloc 2 (mu-plugin) est installé — sinon doublon d'en-têtes.

Ne rien enchaîner à l'aveugle : vérification front + publication de test entre chaque bloc.
