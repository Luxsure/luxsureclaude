<?php
/**
 * LUXSURE - Reset OPcache + statut PHP-FPM
 *
 * USAGE : Uploader ce fichier temporairement à la racine du site :
 *   /web/reset-opcache-phpfpm.php
 *
 * Accéder via navigateur (PROTÉGÉ PAR SECRET) :
 *   https://www.luxsure.fr/reset-opcache-phpfpm.php?secret=CHANGER_CE_SECRET
 *
 * SUPPRIMER CE FICHIER IMMÉDIATEMENT APRÈS USAGE
 */

// ⚠️ CHANGER CE SECRET AVANT DE DÉPLOYER
define('SECRET', 'luxsure_reset_2026');

if (!isset($_GET['secret']) || $_GET['secret'] !== SECRET) {
    http_response_code(403);
    die('Accès refusé. Paramètre ?secret= requis.');
}

header('Content-Type: text/plain; charset=utf-8');

echo "=== LUXSURE Reset OPcache + Diagnostic PHP ===\n";
echo "Date : " . date('Y-m-d H:i:s') . "\n\n";

// --- OPcache ---
echo "--- OPcache ---\n";
if (function_exists('opcache_get_status')) {
    $status = opcache_get_status(false);
    echo "Activé : " . ($status['opcache_enabled'] ? 'OUI' : 'NON') . "\n";
    echo "Scripts en cache : " . ($status['opcache_statistics']['num_cached_scripts'] ?? 'N/A') . "\n";
    echo "Mémoire utilisée : " . round(($status['memory_usage']['used_memory'] ?? 0) / 1024 / 1024, 1) . " MB\n";
    echo "Mémoire libre : " . round(($status['memory_usage']['free_memory'] ?? 0) / 1024 / 1024, 1) . " MB\n";

    if (function_exists('opcache_reset')) {
        $reset = opcache_reset();
        echo "Reset OPcache : " . ($reset ? "OK ✓" : "ÉCHEC") . "\n";
    }
} else {
    echo "OPcache non disponible\n";
}

// --- PHP Info ---
echo "\n--- PHP ---\n";
echo "Version : " . phpversion() . "\n";
echo "memory_limit : " . ini_get('memory_limit') . "\n";
echo "max_execution_time : " . ini_get('max_execution_time') . "\n";
echo "max_input_time : " . ini_get('max_input_time') . "\n";
echo "post_max_size : " . ini_get('post_max_size') . "\n";
echo "upload_max_filesize : " . ini_get('upload_max_filesize') . "\n";

// --- WordPress ---
echo "\n--- WordPress ---\n";
$wpconfig = dirname(__FILE__) . '/wp-config.php';
if (file_exists($wpconfig)) {
    $content = file_get_contents($wpconfig);
    preg_match_all("/define\s*\(\s*'(WP_DEBUG|WP_CACHE|DISABLE_WP_CRON|WP_MEMORY_LIMIT|WP_MAX_MEMORY_LIMIT)'\s*,\s*([^)]+)\)/", $content, $matches, PREG_SET_ORDER);
    foreach ($matches as $m) {
        echo $m[1] . " : " . trim($m[2]) . "\n";
    }
} else {
    echo "wp-config.php non trouvé dans " . dirname(__FILE__) . "\n";
}

// --- Drop-ins ---
echo "\n--- Drop-ins wp-content ---\n";
$wpcontent = dirname(__FILE__) . '/wp-content';
foreach (['object-cache.php', 'advanced-cache.php'] as $dropin) {
    echo $dropin . " : " . (file_exists("$wpcontent/$dropin") ? "PRÉSENT" : "ABSENT") . "\n";
}

// --- Plugins désactivés manuellement ---
echo "\n--- Plugins renommés (désactivés manuellement) ---\n";
$plugins_dir = "$wpcontent/plugins";
if (is_dir($plugins_dir)) {
    $items = scandir($plugins_dir);
    $disabled = array_filter($items, function($i) {
        return strpos($i, '.disabled') !== false || strpos($i, '.codex-disabled') !== false;
    });
    if ($disabled) {
        foreach ($disabled as $d) echo "  - $d\n";
    } else {
        echo "  Aucun plugin renommé\n";
    }
}

echo "\n=== FIN DU DIAGNOSTIC ===\n";
echo "⚠️  SUPPRIMER CE FICHIER : /web/reset-opcache-phpfpm.php\n";
