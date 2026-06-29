<?php
/**
 * Plugin Name: Luxsure Publication Guard (MU)
 * Description: Neutralise les hooks lourds sur save_post pour stabiliser les publications.
 *              Active/désactive via constante dans wp-config.php ou option BDD.
 *              TEMPORAIRE - à supprimer après stabilisation.
 *
 * INSTALLATION :
 *   Copier ce fichier dans /web/wp-content/mu-plugins/luxsure-publication-guard.php
 *   Les mu-plugins se chargent automatiquement, sans activation.
 *
 * ACTIVATION DES PROTECTIONS :
 *   Ajouter dans wp-config.php :
 *   define('LUXSURE_PUBLICATION_GUARD', true);
 *
 * DÉSACTIVATION COMPLÈTE :
 *   Retirer la constante OU supprimer ce fichier.
 */

if (!defined('ABSPATH')) exit;

// Activer uniquement si la constante est définie
if (!defined('LUXSURE_PUBLICATION_GUARD') || !LUXSURE_PUBLICATION_GUARD) {
    return;
}

/**
 * Hook principal : se déclenche très tôt, avant WP Rocket, WPML, Rank Math, etc.
 */
add_action('init', 'luxsure_guard_init', 1);

function luxsure_guard_init() {
    // --- WP ROCKET : neutraliser purge + preload à la sauvegarde ---
    add_filter('rocket_before_run_on_save_post', '__return_false');
    add_filter('do_rocket_generate_caching_files', '__return_false');

    // WP Rocket: désactiver la génération CSS utilisé au save
    add_filter('rocket_generate_critical_css', '__return_false');

    // WP Rocket: désactiver purge Cloudflare au save
    remove_action('save_post', 'rocket_clean_post', 50);

    // --- WPML : désactiver la synchronisation auto des traductions ---
    // (évite que WPML clone/sync la page vers toutes les langues à chaque save)
    add_filter('wpml_auto_add_translation_of_attachments', '__return_false');

    // Désactiver le job WPML qui traduit à la publication
    add_filter('wpml_tm_jobs_send_batch', '__return_empty_array');

    // --- RANK MATH : désactiver les mises à jour de sitemap auto ---
    add_filter('rank_math/sitemap/remove_post_from_sitemap', '__return_false');
    add_filter('rank_math/sitemap/add_post_to_sitemap', '__return_false');

    // --- LINK WHISPER : normalement déjà désactivé côté fichier ---
    // Sécurité : si jamais réactivé, désactiver l'autolinking à la save
    add_filter('wpil_disable_autolinking', '__return_true');

    // --- HEARTBEAT : ralentir l'API Heartbeat en admin ---
    add_filter('heartbeat_settings', function($settings) {
        $settings['interval'] = 120; // 120s au lieu de 15-60s par défaut
        return $settings;
    });

    // Log silencieux pour traçabilité
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('[Luxsure Guard] Hooks de publication lourds neutralisés');
    }
}

/**
 * Ajouter un indicateur dans l'admin pour confirmer que le guard est actif
 */
add_action('admin_notices', 'luxsure_guard_notice');
function luxsure_guard_notice() {
    if (!current_user_can('manage_options')) return;
    echo '<div class="notice notice-warning"><p>';
    echo '<strong>[Luxsure Guard]</strong> Mode stabilisation actif : hooks de publication lourds désactivés (WP Rocket purge, WPML sync, Rank Math sitemap). ';
    echo 'Retirer <code>define(\'LUXSURE_PUBLICATION_GUARD\', true);</code> de wp-config.php une fois stable.';
    echo '</p></div>';
}
