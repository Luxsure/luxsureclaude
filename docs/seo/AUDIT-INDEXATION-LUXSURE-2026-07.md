# Audit d'indexation Google — www.luxsure.fr

**Date : 3 juillet 2026** — basé sur les exports Google Search Console (Coverage + Drilldowns du 03/07/2026) et sur des vérifications en direct du site.

---

## 1. Résumé exécutif

| Indicateur (au 30/06/2026) | Valeur | Tendance depuis avril |
|---|---|---|
| Pages indexées | **38 362** | ↗ +16 % (33 072 → 38 362) |
| Pages connues non indexées | **197 548** | ↘ −19 % (245 350 → 197 548) |
| Impressions / jour | ~8 500–9 500 | stable |

La tendance est **déjà positive** : Google nettoie progressivement. Le problème de fond n'est pas que Google refuse vos articles — le sitemap contient ~44 600 articles et ~38 400 pages sont indexées (≈ 85 %). Le problème est que Google connaît **~236 000 URL**, soit 5× plus que de contenu réel, et gaspille son budget d'exploration sur du bruit :

1. **Pages « pièces jointes » WordPress** (une page par image uploadée) → la cause n°1 des 404, des redirections et des erreurs 5xx.
2. **URL à paramètres** (`?share=`, `?fbclid=`, `?utm_`…) générées par les boutons de partage Jetpack.
3. **Pages de tags** trop nombreuses et trop minces, toutes en `index,follow`.
4. **Traces d'un piratage** (URL spam casino datées du 30/04/2026) — aujourd'hui nettoyées (404), mais à surveiller.
5. **robots.txt qui pointe vers un sitemap inexistant** (`https://luxsure.fr/sitemap.xml` → 404).

---

## 2. Ce que disent vos rapports GSC

### Problèmes critiques (rapport Coverage)

| Raison | Pages | Gravité réelle |
|---|---|---|
| Explorée, actuellement non indexée | 154 473 | ⚠️ C'est le cœur du sujet (voir §3.1) |
| Page avec redirection | 20 186 | 🟡 Majoritairement voulu (redirections de pièces jointes) |
| Introuvable (404) | 14 538 | 🟡 Surtout pièces jointes supprimées + spam nettoyé |
| Erreur serveur (5xx) | 865 | 🔴 À corriger : le serveur sature sous la charge de Googlebot |
| Détectée, non indexée | 5 551 | 🟡 File d'attente de crawl |
| Autre page avec balise canonique correcte | 1 199 | 🟢 Comportement normal (canoniques OK) |
| Exclue par noindex | 482 | 🟢 Normal |

### Analyse des URL présentes dans les drilldowns (échantillons GSC)

| Rapport | Pattern dominant |
|---|---|
| 404 (1 006 URL) | **70 %** = pages pièces jointes (`/article/nom-image/`), 34 URL de **spam casino** |
| 5xx (870 URL) | **52 %** = pages pièces jointes, **18 %** = pages tags, 4 % = flux RSS |
| Canonique correcte (1 083 URL) | **42 %** = `?share=` (Jetpack), 15 % tags, 9 % feeds, 9 % autres paramètres |
| Validation « redirection » (2 000 URL) | **66 %** = pages pièces jointes |

### Vérifications faites en direct sur le site (03/07/2026)

- `robots.txt` → référence `https://luxsure.fr/sitemap.xml` qui renvoie **404**. Le vrai sitemap est `https://www.luxsure.fr/sitemap_index.xml` (Yoast, 225 sitemaps, ~44 600 URL, uniquement des articles + 1 sitemap pages + 1 catégories : propre ✅).
- URL `?share=x&nb=1` → canonique correcte vers l'article ✅ (rien à corriger côté balises).
- Pièce jointe sous article (`/2014/04/07/…/img_8192/`) → 301 vers l'article parent ✅ (réglage Yoast actif).
- Pièce jointe orpheline (`/img_0155-3/`) → **301 vers la page d'accueil** ⚠️ (signal « soft 404 » pour Google).
- Page tag (`/tag/nixon/`) → `index, follow` ⚠️ alors que la plupart des tags n'ont que 1–3 articles.
- URL spam casino (`/2026/04/30/…casino…/`) → **404** ✅ le contenu injecté a été supprimé.

---

## 3. Diagnostic détaillé et corrections

### 3.1 « Explorée, actuellement non indexée » (154 473 pages) — le gros morceau

Ce n'est **pas** une pénalité : c'est Google qui dit « j'ai vu cette URL, elle ne mérite pas une place dans l'index ». Sur luxsure.fr, cette masse est composée de :

- dizaines de milliers de **pages pièces jointes** (chaque image uploadée depuis 2010 a créé une URL) ;
- **pages tags** quasi vides (tags utilisés 1 ou 2 fois, doublons comme `printemps-ete-2025-2`) ;
- URL à paramètres, pagination profonde, flux `/feed/` de chaque tag ;
- vieux articles très courts (communiqués de 3 lignes de 2010–2014) que Google juge trop minces.

**Actions :**

1. **Yoast SEO → Réglages → Types de contenus → Médias** : activer *« Rediriger les URL de pièces jointes vers le média lui-même »* (déjà partiellement actif — vérifier qu'il l'est bien, il élimine la génération de ces pages).
2. **Yoast SEO → Archives de taxonomies → Étiquettes (tags)** : passer les tags en **noindex** (garder les catégories indexées). Avec ~16 ans d'archives, les tags apportent quasi zéro trafic mais consomment un budget de crawl énorme (157 tags dans le seul échantillon 5xx).
3. Faire le ménage dans les tags en doublon (`printemps-ete-2025` vs `printemps-ete-2025-2`) — plugin *Term Management Tools* pour fusionner.
4. **Renforcer les articles stratégiques** plutôt que les 44 000 archives : les guides evergreen (hôtels, restaurants, parfums) méritent mise à jour + maillage interne depuis la home et les catégories. Un vieil article de communiqué non indexé n'est pas une perte.

### 3.2 Erreurs serveur 5xx (865 pages) — priorité technique n°1

La courbe GSC montre un pic (267 → ~2 000 entre le 14/04 et le 01/05) : le serveur **sature quand Googlebot explore massivement** les tags/pièces jointes. Chaque 5xx incite Google à ralentir son crawl → moins d'indexation des vrais articles.

**Actions :**

1. Mettre en place / vérifier un **cache de pages serveur** (LiteSpeed Cache, WP Rocket ou équivalent hébergeur) incluant les pages d'archives et tags.
2. Vérifier les ressources d'hébergement (PHP workers, mémoire). Avec 44 000 articles, un hébergement mutualisé d'entrée de gamme est sous-dimensionné.
3. La réduction de la surface de crawl (§3.1 et §3.3) réduira mécaniquement la charge.

### 3.3 Budget de crawl gaspillé par les paramètres (`?share=`, `?fbclid=`, `?utm_`…)

Les canoniques sont **déjà corrects** — aucun risque de contenu dupliqué indexé. Mais Googlebot crawle des dizaines de milliers de variantes inutiles. Le fichier `robots.txt` corrigé (livré dans `docs/seo/robots.txt`) :

- corrige la ligne `Sitemap:` (actuellement → 404) ;
- bloque `?share=` et `?replytocom=` (jamais destinés à l'index) ;
- bloque les flux `/feed/` des tags/catégories (garde le flux principal).

> Note : on ne bloque volontairement **pas** `?utm_` et `?fbclid` par robots.txt — les canoniques suffisent et bloquer empêcherait Google de consolider les liens externes de campagnes.

Bonus : dans les réglages Jetpack → Partage, désactiver les boutons de partage inutilisés réduit la génération de ces URL.

### 3.4 Piratage (URL spam casino) — à surveiller de près

34 URL du type `/2026/04/30/votre-guide-integral-…-casino-…/`, `/…pokies-online-for-real-money…/` apparaissent dans le rapport 404. Elles datent du **30/04/2026** (ce qui correspond au pic de pages découvertes fin avril dans vos courbes). Elles renvoient 404 aujourd'hui : le nettoyage a eu lieu. **Mais** une injection de contenu = un accès attaquant qu'il faut fermer :

1. GSC → **Sécurité et actions manuelles** : vérifier qu'aucun avertissement n'est actif.
2. Mettre à jour WordPress + tous les plugins/thèmes, supprimer les plugins inactifs.
3. Changer tous les mots de passe (admin WP, FTP/SSH, base de données) + activer la 2FA.
4. Scanner avec Wordfence ou l'outil de l'hébergeur (chercher des fichiers PHP modifiés, des utilisateurs admin inconnus, des tâches cron suspectes).
5. Vérifier qu'aucun sitemap fantôme ni utilisateur GSC inconnu n'a été ajouté.

### 3.5 Redirections (20 186) et 404 (14 538) — surtout du normal, un réglage à changer

- Pièce jointe → article parent (301) : **bon**, ne rien changer.
- Pièce jointe orpheline → **page d'accueil** : Google traite ça comme un soft-404 et re-crawle sans fin. Mieux vaut laisser ces URL renvoyer **404/410** (réglage Yoast : les pièces jointes sans parent doivent rediriger vers le fichier média, pas vers l'accueil ; si un plugin « redirige les 404 vers l'accueil » est actif, le désactiver).
- Les 14 538 erreurs 404 (vieilles images, spam supprimé) sortiront de l'index naturellement. Ne **pas** les rediriger en masse vers l'accueil.

---

## 4. Plan d'action priorisé

| # | Action | Où | Effort | Impact |
|---|---|---|---|---|
| P0 | Corriger `robots.txt` (fichier livré) | WP / hébergeur | 5 min | Sitemap enfin déclaré + crawl économisé |
| P0 | Audit sécurité post-piratage (§3.4) | WP + GSC | 2 h | Évite une ré-injection et une action manuelle |
| P0 | Cache de pages + ressources serveur (§3.2) | Hébergeur | 1–4 h | Stoppe les 5xx, débloque le crawl |
| P1 | Tags en `noindex` via Yoast (§3.1) | Yoast | 10 min | Réduit massivement le crawl inutile |
| P1 | Vérifier réglage médias Yoast + redirection accueil (§3.5) | Yoast | 15 min | Élimine les soft-404 |
| P2 | Fusion des tags en doublon | WP | 2–3 h | Archives plus propres |
| P2 | Mise à jour + maillage des articles evergreen | Éditorial | continu | Plus de pages « dignes d'indexation » |

## 5. Fichiers livrés

- `docs/seo/robots.txt` — fichier corrigé, prêt à remplacer l'actuel (via Yoast → Outils → Éditeur de fichiers, ou à la racine du site).
- `docs/seo/AUDIT-INDEXATION-LUXSURE-2026-07.md` — ce rapport.

## 6. Suivi (à contrôler dans GSC à 30 / 60 / 90 jours)

- **Pages indexées** : objectif > 40 000 à 90 jours (tendance actuelle déjà bonne).
- **Erreurs 5xx** : objectif ~0 après mise en cache.
- **« Explorée, non indexée »** : doit continuer à baisser (197 k → < 150 k à 90 jours une fois les tags en noindex).
- **Statistiques d'exploration** (GSC → Paramètres → Statistiques sur l'exploration) : la part de crawl sur les articles doit augmenter.
- Relancer une **validation** sur les rapports « Page avec redirection » et « 404 » une fois les réglages faits.
