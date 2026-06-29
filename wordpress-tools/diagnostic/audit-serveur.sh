#!/bin/bash
# =============================================================================
# LUXSURE - AUDIT SERVEUR WordPress
# Exécuter depuis le dossier racine du site (là où se trouve wp-config.php)
# Usage: bash audit-serveur.sh 2>&1 | tee /tmp/luxsure-audit-$(date +%Y%m%d-%H%M%S).log
# =============================================================================

WPROOT="/web"
WPCONTENT="$WPROOT/wp-content"

echo "============================================================"
echo "LUXSURE - AUDIT SERVEUR $(date)"
echo "============================================================"

echo ""
echo "--- [1] PLUGINS DÉSACTIVÉS (dossiers renommés) ---"
ls -la "$WPCONTENT/plugins/" | grep -E "\.(disabled|codex-disabled)" || echo "Aucun plugin renommé trouvé"

echo ""
echo "--- [2] DROP-INS WordPress ---"
echo "object-cache.php :"
ls -la "$WPCONTENT/object-cache.php" 2>/dev/null && echo "PRÉSENT" || echo "ABSENT"
echo "advanced-cache.php :"
ls -la "$WPCONTENT/advanced-cache.php" 2>/dev/null && echo "PRÉSENT" || echo "ABSENT"

echo ""
echo "--- [3] WP-CONFIG.PHP - paramètres clés ---"
grep -E "(WP_DEBUG|SCRIPT_DEBUG|WP_DEBUG_LOG|DISABLE_WP_CRON|WP_CACHE|WP_MEMORY_LIMIT|WP_MAX_MEMORY_LIMIT)" "$WPROOT/wp-config.php" | grep -v "^//"

echo ""
echo "--- [4] CACHE WP ROCKET ---"
ROCKET_CACHE="$WPCONTENT/cache/wp-rocket/www.luxsure.fr"
if [ -d "$ROCKET_CACHE" ]; then
    echo "Dossier cache présent : $ROCKET_CACHE"
    echo "Nombre de fichiers HTML :"
    find "$ROCKET_CACHE" -name "*.html" 2>/dev/null | wc -l
    echo "Taille totale :"
    du -sh "$ROCKET_CACHE" 2>/dev/null
else
    echo "Dossier cache WP Rocket ABSENT ou vide"
fi

echo ""
echo "--- [5] PHP VERSION ET MÉMOIRE ---"
php -r "echo 'PHP : ' . phpversion() . PHP_EOL; echo 'memory_limit : ' . ini_get('memory_limit') . PHP_EOL; echo 'max_execution_time : ' . ini_get('max_execution_time') . PHP_EOL; echo 'opcache.enable : ' . ini_get('opcache.enable') . PHP_EOL;"

echo ""
echo "--- [6] PROCESSUS PHP-FPM ---"
if command -v pgrep &>/dev/null; then
    echo "Processus php-fpm actifs :"
    pgrep -a php-fpm 2>/dev/null | head -20 || echo "Impossible de lister (permissions)"
else
    echo "pgrep non disponible"
fi

echo ""
echo "--- [7] WP-CLI - STATUT PLUGINS ACTIFS ---"
if command -v wp &>/dev/null; then
    wp plugin list --path="$WPROOT" --allow-root 2>/dev/null | grep -E "^(wp-rocket|link-whisper|redis-cache|query-monitor|code-profiler|wpml|sitepress|rank-math)" || echo "WP-CLI disponible mais aucun résultat pour ces plugins"
else
    echo "WP-CLI non disponible sur ce serveur"
fi

echo ""
echo "--- [8] LOGS PHP RÉCENTS (20 dernières lignes) ---"
PHP_LOG_CANDIDATES=(
    "/var/log/php-fpm/error.log"
    "/var/log/php/error.log"
    "/var/log/nginx/error.log"
    "/var/log/apache2/error.log"
    "$WPROOT/wp-content/debug.log"
    "/tmp/php-errors.log"
)
FOUND_LOG=0
for LOG in "${PHP_LOG_CANDIDATES[@]}"; do
    if [ -f "$LOG" ] && [ -r "$LOG" ]; then
        echo "Log trouvé : $LOG"
        tail -20 "$LOG"
        FOUND_LOG=1
        break
    fi
done
[ $FOUND_LOG -eq 0 ] && echo "Aucun log PHP accessible"

echo ""
echo "--- [9] MYSQL - TEST CONNEXION ---"
if command -v wp &>/dev/null; then
    wp db check --path="$WPROOT" --allow-root 2>&1 | head -5 || echo "Impossible de vérifier MySQL"
else
    echo "WP-CLI requis pour tester MySQL"
fi

echo ""
echo "--- [10] CRON WORDPRESS EN ATTENTE ---"
if command -v wp &>/dev/null; then
    echo "Tâches cron en attente (overdue) :"
    wp cron event list --path="$WPROOT" --allow-root 2>/dev/null | head -30 || echo "Impossible de lister les crons"
else
    echo "WP-CLI requis"
fi

echo ""
echo "============================================================"
echo "AUDIT TERMINÉ $(date)"
echo "============================================================"
