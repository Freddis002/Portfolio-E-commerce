<?php
/*
 * Modèle de configuration du formulaire de contact.
 *
 * Sur le serveur OVH, copiez ce fichier en config/contact.php À CÔTÉ du
 * dossier www/ (jamais dans www/, qui est public) :
 *
 *   ~/config/contact.php      ← ce fichier, rempli
 *   ~/www/api/contact.php     ← le script (publié avec le site)
 *
 * Le vrai fichier config/contact.php n'est jamais envoyé sur GitHub (.gitignore).
 */
return [
    // Adresse qui reçoit les messages
    'destinataire' => 'votre-adresse@exemple.fr',

    // Expéditeur technique : une adresse de VOTRE domaine (exigé par OVH pour mail())
    'expediteur' => 'contact@votre-domaine.fr',

    // Longue chaîne aléatoire (au moins 32 caractères) : signe les jetons et
    // sale les empreintes d'IP. Exemple pour en générer une : openssl rand -hex 32
    'secret' => 'remplacez-moi-par-une-longue-chaine-aleatoire-de-64-caracteres',

    // Dossier des compteurs d'envois (hors du dossier public, créé automatiquement)
    'dossier_limites' => __DIR__ . '/../donnees-contact',

    // Délai minimal de remplissage (s), validité du jeton (s), envois par heure et par IP
    'delai_minimum' => 3,
    'duree_jeton' => 7200,
    'envois_par_heure' => 5,
];
