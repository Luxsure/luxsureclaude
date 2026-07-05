<?php
/**
 * Plugin Name: Luxsure Hardening & Sécurité (MU)
 * Description: Durcissement léger et SANS RISQUE : masque la version WordPress,
 *              bloque l'énumération des utilisateurs via l'API REST pour les
 *              visiteurs non connectés, et ajoute 3 en-têtes de sécurité de base.
 *              Aucune modification du chemin de publication. Entièrement réversible
 *              (supprimer ce fichier suffit à tout annuler).
 *
 * INSTALLATION :
 *   Déposer ce fichier dans /web/wp-content/mu-plugins/luxsure-hardening.php
 *   (créer le dossier mu-plugins s'il n'existe pas). Les mu-plugins se chargent
 *   automatiquement, aucune activation nécessaire.
 *
 * DÉSACTIVATION :
 *   Supprimer le fichier. Effet immédiat.
 *
 * CE QUE CE PLUGIN NE FAIT PAS (volontairement, car risqué) :
 *   - Pas de HSTS (peut rendre le site inaccessible si mal configuré).
 *   - Pas de Content-Security-Policy (casse le rendu si mal calibrée).
 *   - Ne bloque PAS les pages auteur publiques /author/slug/ (elles sont
 *     utilisées par le site — seul l'endpoint REST /wp/v2/users est filtré).
 */

if (!defined('ABSPATH')) exit;

/* -------------------------------------------------------------------------
 * 1. Masquer la version de WordPress
 * ---------------------------------------------------------------------- */
remove_action('wp_head', 'wp_generator');
add_filter('the_generator', '__return_empty_string');

/* -------------------------------------------------------------------------
 * 2. Bloquer l'énumération des utilisateurs via l'API REST
 *    UNIQUEMENT pour les visiteurs NON connectés.
 *    Les administrateurs et les processus authentifiés (WPML, éditeur…)
 *    conservent un accès complet — rien n'est cassé côté admin.
 * ---------------------------------------------------------------------- */
add_filter('rest_endpoints', function ($endpoints) {
    if (is_user_logged_in()) {
        return $endpoints; // admin/éditeurs : accès inchangé
    }
    foreach (['/wp/v2/users', '/wp/v2/users/(?P<id>[\d]+)'] as $route) {
        if (isset($endpoints[$route])) {
            unset($endpoints[$route]);
        }
    }
    return $endpoints;
});

/* -------------------------------------------------------------------------
 * 3. En-têtes de sécurité de base (sans risque)
 *    HSTS et CSP délibérément exclus (voir en-tête du fichier).
 * ---------------------------------------------------------------------- */
add_filter('wp_headers', function ($headers) {
    $headers['X-Content-Type-Options'] = 'nosniff';
    $headers['Referrer-Policy']        = 'strict-origin-when-cross-origin';
    // SAMEORIGIN : autorise l'affichage du site dans ses propres iframes,
    // bloque le framing par des tiers (protection clickjacking).
    $headers['X-Frame-Options']        = 'SAMEORIGIN';
    return $headers;
});
