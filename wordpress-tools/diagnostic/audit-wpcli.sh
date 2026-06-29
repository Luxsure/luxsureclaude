#!/bin/bash
# =============================================================================
# LUXSURE - AUDIT WP-CLI APPROFONDI
# Nécessite WP-CLI installé et accès root/owner du site
# Usage: bash audit-wpcli.sh 2>&1 | tee /tmp/luxsure-wpcli-$(date +%Y%m%d-%H%M%S).log
# =============================================================================

WPROOT="/web"
WP="wp --path=$WPROOT --allow-root"

echo "============================================================"
echo "LUXSURE - AUDIT WP-CLI $(date)"
echo "============================================================"

if ! command -v wp &>/dev/null; then
    echo "ERREUR : WP-CLI n'est pas disponible. Installez-le d'abord."
    echo "  curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar"
    echo "  chmod +x wp-cli.phar && mv wp-cli.phar /usr/local/bin/wp"
    exit 1
fi

echo ""
echo "--- [1] VERSION WORDPRESS ---"
$WP core version 2>/dev/null

echo ""
echo "--- [2] LISTE COMPLÈTE DES PLUGINS (status, version) ---"
$WP plugin list --fields=name,status,version 2>/dev/null

echo ""
echo "--- [3] OPTIONS WPML CRITIQUES ---"
echo "WPML Translation mode :"
$WP option get sitepress_settings 2>/dev/null | grep -i "translation_mode\|auto_translate" || echo "Option non trouvée"

echo ""
echo "--- [4] OPTIONS WP ROCKET ---"
echo "WP Rocket settings (preload, auto_purge) :"
$WP option get wp_rocket_settings 2>/dev/null | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    keys = ['cache_mobile','do_caching_mobile_files','async_css','lazyload','preload','sitemap_preload','manual_preloading','purge_cron_interval','cloudflare_auto_settings']
    for k in keys:
        if k in d:
            print(f'  {k}: {d[k]}')
except:
    print(sys.stdin.read()[:500])
" 2>/dev/null || $WP option get wp_rocket_settings 2>/dev/null | head -30

echo ""
echo "--- [5] HOOKS save_post : plugins enregistrés ---"
# Via mu-plugin temporaire si nécessaire - ici on liste juste les options actives
echo "Plugins actifs pouvant hooker save_post :"
$WP plugin list --status=active --field=name 2>/dev/null | grep -E "(rocket|wpml|sitepress|rank-math|link-whisper|pretty-links|redis|cloudflare)"

echo ""
echo "--- [6] TÂCHES CRON EN RETARD ---"
echo "Tâches overdue (due_date dans le passé) :"
$WP cron event list --fields=hook,next_run,recurrence 2>/dev/null | head -40

echo ""
echo "--- [7] TAILLE BASE DE DONNÉES ---"
$WP db size --tables 2>/dev/null | sort -k2 -rh | head -20

echo ""
echo "--- [8] OPTIONS VOLUMINEUSES (autoload) ---"
echo "Top 10 options autoload les plus lourdes :"
$WP db query "SELECT option_name, LENGTH(option_value) as size FROM wp_options WHERE autoload='yes' ORDER BY size DESC LIMIT 10;" 2>/dev/null

echo ""
echo "--- [9] TRANSIENTS EXPIRÉS ---"
echo "Nombre de transients expirés :"
$WP db query "SELECT COUNT(*) as expired_transients FROM wp_options WHERE option_name LIKE '_transient_timeout_%' AND option_value < UNIX_TIMESTAMP();" 2>/dev/null

echo ""
echo "--- [10] REQUÊTES LENTES MYSQL (si slow log actif) ---"
SLOW_LOG=$($WP db query "SHOW VARIABLES LIKE 'slow_query_log_file';" 2>/dev/null | awk 'NR==2{print $2}')
if [ -n "$SLOW_LOG" ] && [ -f "$SLOW_LOG" ]; then
    echo "Slow log : $SLOW_LOG"
    tail -50 "$SLOW_LOG"
else
    echo "Slow query log MySQL non accessible ou désactivé"
fi

echo ""
echo "============================================================"
echo "AUDIT WP-CLI TERMINÉ $(date)"
echo "============================================================"
