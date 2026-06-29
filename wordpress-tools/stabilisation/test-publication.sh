#!/bin/bash
# =============================================================================
# LUXSURE - TEST DE PUBLICATION (Étape 3 du plan)
# Crée un brouillon simple via WP-CLI et teste la mise à jour
# Usage: bash test-publication.sh
# =============================================================================

WPROOT="/web"
WP="wp --path=$WPROOT --allow-root"

echo "=== TEST PUBLICATION LUXSURE $(date) ==="
echo ""

if ! command -v wp &>/dev/null; then
    echo "ERREUR : WP-CLI non disponible"
    exit 1
fi

echo "1. Création d'un article brouillon de test..."
POST_ID=$($WP post create \
    --post_title="[TEST LUXSURE GUARD] $(date +%Y%m%d-%H%M%S)" \
    --post_content="Article de test publication - créé automatiquement pour diagnostic. Peut être supprimé." \
    --post_status="draft" \
    --post_type="post" \
    --porcelain \
    2>/dev/null)

if [ -z "$POST_ID" ]; then
    echo "ÉCHEC : Impossible de créer l'article (WP-CLI)"
    exit 1
fi
echo "   Article créé : ID=$POST_ID"

echo ""
echo "2. Mise à jour du brouillon (simule un save)..."
START=$(date +%s%3N)
$WP post update "$POST_ID" \
    --post_content="Mise à jour $(date) - test stabilité publication" \
    2>/dev/null
END=$(date +%s%3N)
DURATION=$((END - START))
echo "   Durée : ${DURATION}ms"

if [ $DURATION -lt 5000 ]; then
    echo "   RÉSULTAT : OK ✓ (< 5s)"
elif [ $DURATION -lt 15000 ]; then
    echo "   RÉSULTAT : LENT mais ok (${DURATION}ms, < 15s)"
else
    echo "   RÉSULTAT : TRÈS LENT ou TIMEOUT probable (${DURATION}ms)"
fi

echo ""
echo "3. Tentative de publication de l'article..."
START=$(date +%s%3N)
$WP post update "$POST_ID" --post_status="publish" 2>/dev/null
END=$(date +%s%3N)
DURATION=$((END - START))
echo "   Durée publication : ${DURATION}ms"

if [ $DURATION -lt 8000 ]; then
    echo "   RÉSULTAT : OK ✓"
else
    echo "   RÉSULTAT : LENT (${DURATION}ms) - problème probable sur les hooks post-publication"
fi

echo ""
echo "4. Nettoyage : suppression de l'article de test..."
$WP post delete "$POST_ID" --force 2>/dev/null && echo "   Supprimé" || echo "   Non supprimé (à faire manuellement)"

echo ""
echo "=== FIN TEST $(date) ==="
