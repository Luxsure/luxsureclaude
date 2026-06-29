# Plan de stabilisation Luxsure.fr — Résolution Gateway 504 / Échecs publication

**Date :** Juin 2026  
**Contexte :** WordPress ~31 000 articles, WPML, WP Rocket, Rank Math, Link Whisper. Timeouts 504 fréquents à la publication.

---

## État connu au démarrage

| Élément | État |
|---|---|
| Link Whisper Premium | Désactivé (renommé `.codex-disabled-20260625124120`) |
| Query Monitor | Désactivé (renommé `.codex-disabled-20260625123927`) |
| Code Profiler Pro | Désactivé (renommé `.codex-disabled-20260625123927`) |
| Redis Object Cache | Désactivé |
| `object-cache.php` | Absent (à confirmer) |
| `advanced-cache.php` | Présent (WP Rocket) |
| WP_DEBUG | `false` |
| DISABLE_WP_CRON | `true` |
| WP_CACHE | `true` (WP Rocket) |
| WPML Auto Translate | Désactivé par le webmaster |

---

## Étape 1 — Audit sans modification

**Exécuter sur le serveur :**

```bash
bash wordpress-tools/diagnostic/audit-serveur.sh 2>&1 | tee /tmp/audit-$(date +%Y%m%d).log
bash wordpress-tools/diagnostic/audit-wpcli.sh 2>&1 | tee /tmp/audit-wpcli-$(date +%Y%m%d).log
```

**Vérifier manuellement :**
- `/web/wp-content/plugins/` → confirmer les plugins renommés
- `/web/wp-content/object-cache.php` → doit être absent
- `/web/wp-content/advanced-cache.php` → présent si WP Rocket actif
- `/web/wp-config.php` → WP_DEBUG=false, DISABLE_WP_CRON=true

---

## Étape 2 — Action serveur indispensable

### A. Redémarrer PHP-FPM

```bash
# Option 1 : signal graceful restart
kill -USR2 $(cat /run/php-fpm/*.pid 2>/dev/null)

# Option 2 : service
service php-fpm restart

# Option 3 : systemd (adapter la version PHP)
systemctl restart php8.1-fpm
systemctl restart php8.2-fpm
```

### B. Vider OPcache

Option rapide via navigateur (uploader le fichier PHP) :
```
Uploader : wordpress-tools/stabilisation/reset-opcache-phpfpm.php
Vers : /web/reset-opcache-phpfpm.php
Accéder : https://www.luxsure.fr/reset-opcache-phpfpm.php?secret=luxsure_reset_2026
SUPPRIMER après usage.
```

Option WP-CLI :
```bash
wp eval 'opcache_reset(); echo "OPcache vidé\n";' --path=/web --allow-root
```

---

## Étape 3 — Test de publication minimal

```bash
bash wordpress-tools/stabilisation/test-publication.sh
```

Ou manuellement dans l'admin :
1. Créer un nouvel article (titre simple, pas de contenu lourd)
2. Enregistrer comme brouillon → observer si 504
3. Si OK, tenter de publier → observer

**Critère de succès :** save_post < 8 secondes, pas de 504.

---

## Étape 4 — Isolation WP Rocket (si publication toujours en échec)

```bash
bash wordpress-tools/stabilisation/disable-wp-rocket-hooks.sh
```

Puis redémarrer PHP-FPM + vider OPcache (voir Étape 2).

Retester la publication (Étape 3).

**Pour restaurer WP Rocket :**
```bash
bash wordpress-tools/stabilisation/disable-wp-rocket-hooks.sh --restore
```

---

## Étape 5 — MU-Plugin Publication Guard (alternative à la coupure complète)

Si on veut garder WP Rocket actif mais neutraliser ses hooks lourds à la publication :

1. Copier le mu-plugin :
```bash
cp wordpress-tools/mu-plugins/luxsure-publication-guard.php /web/wp-content/mu-plugins/
```

2. Activer dans `wp-config.php` (ajouter avant `/* That's all */`) :
```php
define('LUXSURE_PUBLICATION_GUARD', true);
```

3. Tester la publication.
4. Une fois stable, retirer la constante et supprimer le mu-plugin.

---

## Étape 6 — Si problème persiste après coupure WP Rocket

Suspects suivants par ordre de probabilité :

1. **WPML core** : même sans Auto Translate, WPML synchronise les métadonnées à chaque save
   - Tester : désactiver temporairement WPML (fichier) + redémarrer PHP-FPM
   
2. **Rank Math** : peut recalculer le score SEO et mettre à jour le sitemap à la publication
   - Désactiver dans Rank Math > Modules > Sitemap l'option "Ping search engines"
   
3. **Thème Soledad/Penci** : certaines versions font des requêtes BDD lourdes aux hooks de publication

4. **Limite serveur** : PHP memory_limit trop bas, pm.max_children PHP-FPM insuffisant pour 31k articles

---

## Critères de résolution

- [ ] Publication d'un brouillon réussit < 8 secondes
- [ ] Publication d'un article réel réussit
- [ ] Pas de 504 pendant 30-60 min d'usage admin
- [ ] REST API WordPress ne retourne plus timeout/500
- [ ] Logs PHP-FPM sans saturation ni fatal errors

---

## Actions à éviter absolument

- Ne pas relancer scan Link Whisper
- Ne pas relancer WPML Translate Everything  
- Ne pas réactiver Redis Object Cache sans redémarrage PHP + purge Redis
- Ne pas réactiver tous les plugins à la fois
- Ne pas lancer purge/preload massif WP Rocket
- Ne pas modifier SEO/netlinking avant stabilisation complète
