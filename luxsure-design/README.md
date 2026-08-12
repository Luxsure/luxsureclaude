# Luxsure — surcouche CSS v2 (proposition)

Optimisation visuelle et UX de **luxsure.fr** (WordPress, thème Soledad 8.7.5), en
surcouche additive. **Rien n'est en production** : ce dossier est une proposition à
valider.

## Fichiers

| Fichier | Rôle |
|---|---|
| `luxsure-surcouche-v2.css` | La proposition. Se colle **à la suite** de la v1 dans *Apparence › Personnaliser › CSS additionnel*. |
| `essai-accueil.html` | Banc d'essai — page d'accueil réelle, bascule avant / après. |
| `essai-article.html` | Banc d'essai — page d'article réelle, bascule avant / après. |
| `rapport-v2.html` | Rapport d'audit : constats, mesures, décisions, ce qui a été écarté. |
| `surcouche-v1-production.css` | Copie de référence du CSS actuellement en production (relevé du 12 août 2026), `@font-face` Newsreader compris. |

## Essayer

Ouvrir `essai-accueil.html` ou `essai-article.html` dans un navigateur, connecté à
Internet (les feuilles de style et les images sont servies depuis luxsure.fr).

- Panneau en bas à droite : bascule **avant / après**. La barre d'espace fait de même.
- Quatre variantes s'activent par case à cocher : lettrine, citation sans filet,
  révélations au défilement, bande sombre.
- Les carrousels sont figés en ligne : la page est servie sans le JavaScript du
  thème, pour que ce qu'on juge soit bien le CSS.
- Ces pages sont locales : elles ne touchent pas au site.

## Mettre en production

1. Coller le contenu de `luxsure-surcouche-v2.css` **à la fin** du CSS additionnel,
   sous la v1 — qui reste intacte.
2. Purger WP Rocket. Sans cela, aucun effet visible.
3. Couper en cas de doute : remplacer `body.wp-theme-soledad` par `body.lx-off`
   dans le bloc v2. Retirer : supprimer le bloc.

## Hors CSS — quatre réglages du thème

Ces corrections ne doivent pas être rattrapées en CSS (voir le rapport) :

1. Le carrousel de Une s'affiche aussi sur les articles → le restreindre à l'accueil.
2. Sept libellés restent en anglais (`View All`, `Related Articles`, `previous post`,
   `next post`, `0 comments`, `by`, `TOP POSTS`) → Soledad › Translation, ou Loco.
3. Couleur d'accent du Customizer réglée sur `#616161` → bronze `#7A6248`.
4. Image de Une masquée sur les articles (`penci-hide-pthumb`) → la réafficher.

## Vérifications faites

Rendu et mesuré dans Chromium sur les pages réelles du site, à 1440, 1024, 768 et
390 px, accueil et article : aucun débordement horizontal, aucune erreur de console,
jetons du thème correctement repris.
