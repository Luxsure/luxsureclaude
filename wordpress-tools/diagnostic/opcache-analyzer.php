<?php
/**
 * LUXSURE — Analyseur OPcache & verdict automatique
 *
 * Pourquoi cet outil : « OPcache est plein » a QUATRE causes possibles, qui
 * appellent quatre corrections différentes. Augmenter la mémoire au hasard peut
 * ne rien corriger. Ce script lit les compteurs internes d'OPcache et tranche.
 *
 * USAGE :
 *   1. Déposer ce fichier à la racine du site : /web/opcache-analyzer.php
 *   2. CHANGER LE SECRET ci-dessous.
 *   3. Ouvrir : https://www.luxsure.fr/opcache-analyzer.php?secret=VOTRE_SECRET
 *   4. SUPPRIMER LE FICHIER après lecture.
 *
 * Lecture seule par défaut. Le reset n'a lieu qu'avec &reset=1 explicite.
 */

define('LUXSURE_SECRET', 'CHANGEZ_MOI_2026');

if (!isset($_GET['secret']) || !hash_equals(LUXSURE_SECRET, $_GET['secret'])) {
    http_response_code(403);
    exit("Accès refusé.\n");
}

header('Content-Type: text/plain; charset=utf-8');

if (!function_exists('opcache_get_status')) {
    exit("OPcache n'est pas disponible sur ce pool PHP.\n");
}

$status = opcache_get_status(true);
$config = opcache_get_configuration();

if ($status === false) {
    exit("OPcache est désactivé (opcache.enable=0) ou inaccessible depuis ce contexte.\n");
}

$d     = $config['directives'];
$mem   = $status['memory_usage'];
$str   = $status['interned_strings_usage'];
$stats = $status['opcache_statistics'];

function mo($octets) { return round($octets / 1048576, 1) . ' Mo'; }
function pct($n)     { return round($n, 1) . ' %'; }

echo "==========================================================\n";
echo " LUXSURE — Analyse OPcache — " . date('Y-m-d H:i:s') . "\n";
echo "==========================================================\n\n";

/* ---------------------------------------------------------------------------
 * 1. Mémoire
 * ------------------------------------------------------------------------ */
$total_mem  = $mem['used_memory'] + $mem['free_memory'] + $mem['wasted_memory'];
$wasted_pct = $mem['current_wasted_percentage'];

echo "--- MÉMOIRE ---\n";
echo "Allouée (opcache.memory_consumption) : " . $d['opcache.memory_consumption'] . " Mo\n";
echo "Utilisée : " . mo($mem['used_memory']) . "\n";
echo "Libre    : " . mo($mem['free_memory']) . "\n";
echo "Gaspillée (wasted) : " . mo($mem['wasted_memory']) . "  (" . pct($wasted_pct) . ")\n";
echo "Seuil de gaspillage max : " . $d['opcache.max_wasted_percentage'] . " %\n\n";

/* ---------------------------------------------------------------------------
 * 2. Nombre de fichiers (le compteur le plus souvent en cause)
 * ------------------------------------------------------------------------ */
$keys_used = $stats['num_cached_keys'];
$keys_max  = $stats['max_cached_keys'];
$keys_pct  = $keys_max > 0 ? ($keys_used / $keys_max) * 100 : 0;

echo "--- NOMBRE DE FICHIERS ---\n";
echo "Scripts en cache : " . $stats['num_cached_scripts'] . "\n";
echo "Clés utilisées   : $keys_used / $keys_max  (" . pct($keys_pct) . ")\n";
echo "opcache.max_accelerated_files (configuré) : " . $d['opcache.max_accelerated_files'] . "\n";
echo "  (PHP arrondit cette valeur au nombre premier supérieur → max_cached_keys)\n\n";

/* ---------------------------------------------------------------------------
 * 3. Chaînes internes
 * ------------------------------------------------------------------------ */
$str_pct = $str['buffer_size'] > 0
    ? (($str['buffer_size'] - $str['free_memory']) / $str['buffer_size']) * 100
    : 0;

echo "--- CHAÎNES INTERNES (interned strings) ---\n";
echo "Buffer : " . mo($str['buffer_size']) . " (opcache.interned_strings_buffer = "
     . $d['opcache.interned_strings_buffer'] . " Mo)\n";
echo "Libre  : " . mo($str['free_memory']) . "  → rempli à " . pct($str_pct) . "\n";
echo "Chaînes stockées : " . $str['number_of_strings'] . "\n\n";

/* ---------------------------------------------------------------------------
 * 4. Efficacité et REDÉMARRAGES — les compteurs décisifs
 * ------------------------------------------------------------------------ */
echo "--- EFFICACITÉ ---\n";
echo "Taux de succès (hit rate) : " . pct($stats['opcache_hit_rate']) . "\n";
echo "Hits : " . number_format($stats['hits'], 0, ',', ' ')
     . "   Misses : " . number_format($stats['misses'], 0, ',', ' ') . "\n\n";

echo "--- REDÉMARRAGES AUTOMATIQUES (compteurs décisifs) ---\n";
echo "oom_restarts     : " . $stats['oom_restarts']
     . "   (mémoire saturée → il en manque vraiment)\n";
echo "hash_restarts    : " . $stats['hash_restarts']
     . "   (trop de fichiers → max_accelerated_files trop bas)\n";
echo "manual_restarts  : " . $stats['manual_restarts'] . "\n";
if (!empty($stats['start_time'])) {
    $uptime = time() - $stats['start_time'];
    echo "Uptime OPcache   : " . round($uptime / 3600, 1) . " h\n";
}
if (!empty($stats['last_restart_time'])) {
    echo "Dernier redémarrage : " . date('Y-m-d H:i:s', $stats['last_restart_time']) . "\n";
}
echo "\n";

/* ---------------------------------------------------------------------------
 * 5. Répartition : qui remplit le cache ?
 * ------------------------------------------------------------------------ */
echo "--- QUI REMPLIT LE CACHE (top 15 dossiers) ---\n";
$by_dir = [];
if (!empty($status['scripts'])) {
    foreach ($status['scripts'] as $path => $info) {
        // Regroupe par plugin / thème / coeur
        if (preg_match('#/wp-content/plugins/([^/]+)#', $path, $m)) {
            $key = 'plugin: ' . $m[1];
        } elseif (preg_match('#/wp-content/themes/([^/]+)#', $path, $m)) {
            $key = 'theme: ' . $m[1];
        } elseif (preg_match('#/wp-content/(cache|uploads)/#', $path, $m)) {
            $key = '⚠ wp-content/' . $m[1] . ' (fichiers générés)';
        } elseif (strpos($path, '/wp-includes/') !== false) {
            $key = 'coeur: wp-includes';
        } elseif (strpos($path, '/wp-admin/') !== false) {
            $key = 'coeur: wp-admin';
        } else {
            $key = 'autre';
        }
        if (!isset($by_dir[$key])) $by_dir[$key] = ['n' => 0, 'mem' => 0];
        $by_dir[$key]['n']++;
        $by_dir[$key]['mem'] += $info['memory_consumption'];
    }
    uasort($by_dir, fn($a, $b) => $b['mem'] <=> $a['mem']);
    $i = 0;
    foreach ($by_dir as $name => $v) {
        printf("  %6s  %5d fichiers  %s\n", mo($v['mem']), $v['n'], $name);
        if (++$i >= 15) break;
    }
} else {
    echo "  (liste des scripts non exposée par cette configuration)\n";
}
echo "\n";

/* ---------------------------------------------------------------------------
 * 6. VERDICT AUTOMATIQUE
 * ------------------------------------------------------------------------ */
echo "==========================================================\n";
echo " VERDICT\n";
echo "==========================================================\n\n";

$actions = [];

if ($stats['oom_restarts'] > 0) {
    $new = $d['opcache.memory_consumption'] * 2;
    $actions[] = "MÉMOIRE RÉELLEMENT INSUFFISANTE (oom_restarts = {$stats['oom_restarts']}).\n"
        . "   OPcache s'est vidé en urgence faute de place : à chaque fois, tous les scripts\n"
        . "   sont recompilés → pics de CPU et de latence.\n"
        . "   → opcache.memory_consumption : {$d['opcache.memory_consumption']} → {$new}";
}

if ($stats['hash_restarts'] > 0 || $keys_pct > 95) {
    $new = max(65407, $d['opcache.max_accelerated_files'] * 2);
    $actions[] = "TROP DE FICHIERS pour la table de hachage"
        . " (hash_restarts = {$stats['hash_restarts']}, clés à " . pct($keys_pct) . ").\n"
        . "   Symptôme classique : « cache full » alors qu'il reste de la mémoire libre.\n"
        . "   → opcache.max_accelerated_files : {$d['opcache.max_accelerated_files']} → {$new}";
}

if ($str_pct > 95) {
    $new = max(32, $d['opcache.interned_strings_buffer'] * 4);
    $actions[] = "BUFFER DE CHAÎNES SATURÉ (rempli à " . pct($str_pct) . ").\n"
        . "   Les chaînes ne sont plus dédupliquées → surconsommation mémoire.\n"
        . "   → opcache.interned_strings_buffer : {$d['opcache.interned_strings_buffer']} → {$new} Mo";
}

if ($wasted_pct >= $d['opcache.max_wasted_percentage'] * 0.8) {
    $actions[] = "MÉMOIRE GASPILLÉE ÉLEVÉE (" . pct($wasted_pct) . ").\n"
        . "   Des fichiers PHP changent souvent : anciennes versions abandonnées en mémoire.\n"
        . "   Causes typiques : plugin générant des .php dynamiques, mises à jour fréquentes,\n"
        . "   déploiements. NE PAS se contenter d'augmenter la mémoire — chercher la source\n"
        . "   dans le tableau « qui remplit le cache » ci-dessus (ligne ⚠ le cas échéant).";
}

foreach ($by_dir as $name => $v) {
    if (strpos($name, '⚠') === 0) {
        $actions[] = "FICHIERS GÉNÉRÉS DANS LE CACHE OPCACHE ({$name}, {$v['n']} fichiers).\n"
            . "   Ces fichiers changent en permanence et polluent OPcache.\n"
            . "   → Demander l'exclusion via opcache.blacklist_filename pointant un fichier\n"
            . "     contenant : /web/wp-content/cache/";
        break;
    }
}

if ($stats['opcache_hit_rate'] < 90 && !$actions) {
    $actions[] = "TAUX DE SUCCÈS FAIBLE (" . pct($stats['opcache_hit_rate']) . ") sans cause\n"
        . "   structurelle évidente. Vérifier opcache.revalidate_freq et la stabilité des\n"
        . "   chemins de fichiers.";
}

if (!$actions) {
    echo "Aucune anomalie structurelle détectée. OPcache fonctionne correctement.\n"
       . "Si des lenteurs persistent, la cause est ailleurs (PHP-FPM pm.max_children,\n"
       . "MySQL, ou charge applicative).\n";
} else {
    foreach ($actions as $n => $a) {
        echo ($n + 1) . ". " . $a . "\n\n";
    }
    echo "Après TOUTE modification de configuration : redémarrer PHP-FPM.\n";
}

/* ---------------------------------------------------------------------------
 * 7. Reset optionnel
 * ------------------------------------------------------------------------ */
echo "\n--- RESET ---\n";
if (isset($_GET['reset']) && $_GET['reset'] === '1') {
    echo opcache_reset() ? "OPcache vidé. ✓\n" : "Échec du reset.\n";
    echo "Note : un reset soulage temporairement mais ne corrige pas la configuration.\n";
} else {
    echo "Ajouter &reset=1 à l'URL pour vider OPcache (non fait ici).\n";
}

echo "\n⚠️  SUPPRIMER CE FICHIER APRÈS USAGE : /web/opcache-analyzer.php\n";
