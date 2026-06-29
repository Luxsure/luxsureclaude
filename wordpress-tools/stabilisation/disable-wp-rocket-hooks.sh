#!/bin/bash
# =============================================================================
# LUXSURE - ISOLATION WP ROCKET (Étape 4 du plan de stabilisation)
# Désactive WP Rocket côté fichiers pour tester si c'est lui qui cause les 504
#
# ATTENTION : backup automatique avant toute action
# Usage: bash disable-wp-rocket-hooks.sh
# Pour réactiver: bash disable-wp-rocket-hooks.sh --restore
# =============================================================================

WPROOT="/web"
WPCONTENT="$WPROOT/wp-content"
PLUGIN_DIR="$WPCONTENT/plugins"
ROCKET_DIR="$PLUGIN_DIR/wp-rocket"
ROCKET_DISABLED="$PLUGIN_DIR/wp-rocket.disabled-luxsure-$(date +%Y%m%d%H%M%S)"
ADV_CACHE="$WPCONTENT/advanced-cache.php"
ADV_CACHE_DISABLED="$WPCONTENT/advanced-cache.php.disabled-luxsure"

# --- MODE RESTORE ---
if [ "$1" = "--restore" ]; then
    echo "=== RESTAURATION WP ROCKET ==="

    # Trouver le dossier désactivé le plus récent
    LAST_DISABLED=$(ls -td "$PLUGIN_DIR"/wp-rocket.disabled-luxsure-* 2>/dev/null | head -1)
    if [ -n "$LAST_DISABLED" ]; then
        echo "Restauration : $LAST_DISABLED -> $ROCKET_DIR"
        mv "$LAST_DISABLED" "$ROCKET_DIR" && echo "Plugin WP Rocket restauré" || echo "ERREUR restauration plugin"
    else
        echo "Aucun dossier wp-rocket désactivé trouvé"
    fi

    if [ -f "$ADV_CACHE_DISABLED" ]; then
        mv "$ADV_CACHE_DISABLED" "$ADV_CACHE" && echo "advanced-cache.php restauré" || echo "ERREUR restauration advanced-cache.php"
    fi

    echo ""
    echo "IMPORTANT : Redémarrer PHP-FPM et vider OPcache après restauration"
    echo "  kill -USR2 \$(cat /run/php-fpm/*.pid) 2>/dev/null || service php-fpm restart"
    exit 0
fi

# --- MODE DÉSACTIVATION ---
echo "=== DÉSACTIVATION WP ROCKET POUR TEST D'ISOLATION ==="
echo "Date : $(date)"
echo ""

# Vérifier que le plugin existe
if [ ! -d "$ROCKET_DIR" ]; then
    echo "ERREUR : Dossier $ROCKET_DIR introuvable"
    echo "WP Rocket est peut-être déjà désactivé ou absent"
    ls -la "$PLUGIN_DIR/" | grep rocket
    exit 1
fi

echo "1. Désactivation plugin wp-rocket :"
mv "$ROCKET_DIR" "$ROCKET_DISABLED" && echo "   OK : renommé en $ROCKET_DISABLED" || { echo "ERREUR"; exit 1; }

echo ""
echo "2. Désactivation drop-in advanced-cache.php :"
if [ -f "$ADV_CACHE" ]; then
    mv "$ADV_CACHE" "$ADV_CACHE_DISABLED" && echo "   OK : renommé en $ADV_CACHE_DISABLED" || echo "   ERREUR (non bloquant)"
else
    echo "   advanced-cache.php déjà absent"
fi

echo ""
echo "3. Vider le cache WP Rocket HTML :"
ROCKET_CACHE="$WPCONTENT/cache/wp-rocket"
if [ -d "$ROCKET_CACHE" ]; then
    find "$ROCKET_CACHE" -name "*.html" -delete 2>/dev/null
    echo "   Cache HTML supprimé"
else
    echo "   Dossier cache absent"
fi

echo ""
echo "=== ACTIONS MANUELLES REQUISES APRÈS CE SCRIPT ==="
echo ""
echo "A. Redémarrer PHP-FPM (choisir selon votre config) :"
echo "   kill -USR2 \$(cat /run/php-fpm/*.pid 2>/dev/null)"
echo "   -- ou --"
echo "   service php-fpm restart"
echo "   -- ou --"
echo "   systemctl restart php8.1-fpm   (adapter la version)"
echo ""
echo "B. Vider OPcache PHP :"
echo "   php -r \"opcache_reset();\""
echo "   -- ou créer un fichier opcache-reset.php temporaire --"
echo ""
echo "C. Tester la publication d'un brouillon simple dans l'admin WordPress"
echo "   URL admin : https://www.luxsure.fr/wp-admin/"
echo ""
echo "D. Pour restaurer WP Rocket :"
echo "   bash disable-wp-rocket-hooks.sh --restore"
