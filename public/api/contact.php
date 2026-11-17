<?php
/*
 * Formulaire de contact du portfolio (hébergement OVH, PHP 8).
 *
 * GET  /api/contact.php  → { "jeton": "…" }  jeton daté et signé, demandé à l'affichage
 * POST /api/contact.php  → corps JSON { nom, email, objet, message, site_web, jeton }
 *                          réponse { ok, message } ou { ok: false, message, erreurs: { champ: texte } }
 *
 * Protections :
 * - tous les champs sont revalidés ici (le navigateur ne fait foi de rien) ;
 * - retours à la ligne refusés dans le nom, l'e-mail et l'objet (injection d'en-têtes) ;
 * - champ piège « site_web » : s'il est rempli, on répond « succès » sans rien envoyer ;
 * - délai minimal de remplissage : le jeton signé doit dater d'au moins 3 s ;
 * - 5 envois par heure et par adresse IP (IP stockée sous forme d'empreinte, 1 h).
 *
 * L'adresse de destination et le secret sont lus dans config/contact.php,
 * placé HORS du dossier public (à côté de www/) : voir config/contact.exemple.php.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function repondre(int $code, array $donnees): void
{
    http_response_code($code);
    echo json_encode($donnees, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function echec(int $code, string $message, array $erreurs = []): void
{
    $reponse = ['ok' => false, 'message' => $message];
    if ($erreurs) {
        $reponse['erreurs'] = $erreurs;
    }
    repondre($code, $reponse);
}

/* ---------- Configuration (hors du dossier public) ---------- */

$fichierConfig = dirname(__DIR__, 2) . '/config/contact.php';
if (!is_readable($fichierConfig)) {
    echec(500, "Le formulaire n'est pas encore configuré. Écrivez directement par e-mail.");
}
$config = require $fichierConfig;

$secret = (string) ($config['secret'] ?? '');
$destinataire = (string) ($config['destinataire'] ?? '');
$expediteur = (string) ($config['expediteur'] ?? '');
if (strlen($secret) < 32 || !filter_var($destinataire, FILTER_VALIDATE_EMAIL) || !filter_var($expediteur, FILTER_VALIDATE_EMAIL)) {
    echec(500, "Le formulaire n'est pas encore configuré. Écrivez directement par e-mail.");
}
$delaiMinimum = (int) ($config['delai_minimum'] ?? 3);
$dureeJeton = (int) ($config['duree_jeton'] ?? 7200);
$envoisParHeure = (int) ($config['envois_par_heure'] ?? 5);
$dossierLimites = (string) ($config['dossier_limites'] ?? dirname(__DIR__, 2) . '/donnees-contact');

/* ---------- Jeton daté et signé ---------- */

function signer(string $horodatage, string $secret): string
{
    return hash_hmac('sha256', 'contact|' . $horodatage, $secret);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $maintenant = (string) time();
    repondre(200, ['jeton' => $maintenant . '.' . signer($maintenant, $secret)]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: GET, POST');
    echec(405, 'Méthode non autorisée.');
}

// Même site uniquement : un autre site ne peut pas utiliser ce script
$origine = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origine !== '' && parse_url($origine, PHP_URL_HOST) !== ($_SERVER['HTTP_HOST'] ?? '')) {
    echec(403, 'Origine non autorisée.');
}

/* ---------- Lecture de la demande ---------- */

$brut = file_get_contents('php://input', false, null, 0, 20000);
$donnees = json_decode((string) $brut, true);
if (!is_array($donnees)) {
    echec(400, 'Demande illisible. Rechargez la page et réessayez.');
}

$champ = static function (string $nom) use ($donnees): string {
    $valeur = $donnees[$nom] ?? '';
    return is_string($valeur) ? trim(str_replace("\0", '', $valeur)) : '';
};

$nom = $champ('nom');
$email = $champ('email');
$objet = $champ('objet');
$message = str_replace("\r\n", "\n", $champ('message'));
$piege = $champ('site_web');
$jeton = $champ('jeton');

// Champ piège rempli : un robot. On fait comme si tout allait bien.
if ($piege !== '') {
    repondre(200, ['ok' => true, 'message' => 'Message envoyé.']);
}

// Jeton : signature valide et délai minimal respecté
if (!preg_match('/^(\d{9,11})\.([a-f0-9]{64})$/', $jeton, $morceaux)
    || !hash_equals(signer($morceaux[1], $secret), $morceaux[2])) {
    echec(400, 'Le formulaire a expiré. Rechargez la page, votre sélection est conservée.');
}
$age = time() - (int) $morceaux[1];
if ($age < $delaiMinimum) {
    echec(400, 'Envoi trop rapide. Patientez quelques secondes et réessayez.');
}
if ($age > $dureeJeton) {
    echec(400, 'Le formulaire a expiré. Rechargez la page, votre sélection est conservée.');
}

/* ---------- Validation des champs ---------- */

$erreurs = [];
$sansSautDeLigne = static fn (string $v): bool => !preg_match('/[\r\n]|%0a|%0d/i', $v);

if ($nom === '') {
    $erreurs['nom'] = 'Indiquez votre nom.';
} elseif (mb_strlen($nom) > 100) {
    $erreurs['nom'] = '100 caractères maximum.';
} elseif (!$sansSautDeLigne($nom)) {
    $erreurs['nom'] = 'Caractères non autorisés.';
}

if ($email === '') {
    $erreurs['email'] = 'Indiquez votre adresse e-mail.';
} elseif (strlen($email) > 254 || !$sansSautDeLigne($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $erreurs['email'] = "Format d'e-mail invalide (ex. : nom@entreprise.fr).";
}

if (mb_strlen($objet) > 150) {
    $erreurs['objet'] = '150 caractères maximum.';
} elseif (!$sansSautDeLigne($objet)) {
    $erreurs['objet'] = 'Caractères non autorisés.';
}

if ($message === '') {
    $erreurs['message'] = 'Écrivez votre message.';
} elseif (mb_strlen($message) > 5000) {
    $erreurs['message'] = '5000 caractères maximum.';
} elseif (str_contains($message, '[Précisez votre besoin ou votre question]')) {
    $erreurs['message'] = 'Remplacez « [Précisez votre besoin ou votre question] » par votre message.';
}

if ($erreurs) {
    $nombre = count($erreurs);
    echec(422, $nombre . ($nombre > 1 ? ' champs à corriger' : ' champ à corriger') . " avant l'envoi.", $erreurs);
}

/* ---------- Limite : 5 envois par heure et par IP ---------- */

if (!is_dir($dossierLimites) && !@mkdir($dossierLimites, 0700, true)) {
    echec(500, "Le message n'a pas pu partir. Écrivez directement par e-mail.");
}

// L'IP n'est jamais stockée en clair : seulement une empreinte salée
$empreinte = hash('sha256', $secret . '|' . ($_SERVER['REMOTE_ADDR'] ?? 'inconnue'));
$fichierLimite = $dossierLimites . '/' . $empreinte . '.json';
$maintenant = time();

$poignee = fopen($fichierLimite, 'c+');
if ($poignee === false || !flock($poignee, LOCK_EX)) {
    echec(500, "Le message n'a pas pu partir. Réessayez dans un instant.");
}
$envois = json_decode((string) stream_get_contents($poignee), true);
$envois = array_values(array_filter(
    is_array($envois) ? $envois : [],
    static fn ($t): bool => is_int($t) && $t > $maintenant - 3600
));
if (count($envois) >= $envoisParHeure) {
    flock($poignee, LOCK_UN);
    fclose($poignee);
    echec(429, "Trop de messages envoyés depuis cette connexion. Réessayez dans une heure ou écrivez directement par e-mail.");
}
$envois[] = $maintenant;
ftruncate($poignee, 0);
rewind($poignee);
fwrite($poignee, json_encode($envois));
flock($poignee, LOCK_UN);
fclose($poignee);

// Ménage occasionnel : les empreintes de plus d'une heure sont effacées
if (random_int(1, 20) === 1) {
    foreach (glob($dossierLimites . '/*.json') ?: [] as $ancien) {
        if (filemtime($ancien) < $maintenant - 3600) {
            @unlink($ancien);
        }
    }
}

/* ---------- Envoi de l'e-mail ---------- */

$sujet = '[Portfolio] ' . ($objet !== '' ? $objet : 'Nouveau message');
$corps = "Nom : {$nom}\nE-mail : {$email}\nObjet : {$objet}\n\n{$message}\n\n"
    . "--\nEnvoyé depuis le formulaire de contact du portfolio.";

$entetes = [
    'From' => $expediteur,
    'Reply-To' => $email,
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
    'Content-Transfer-Encoding' => '8bit',
    'X-Mailer' => 'Portfolio',
];

$envoye = mail(
    $destinataire,
    mb_encode_mimeheader($sujet, 'UTF-8', 'B'),
    $corps,
    $entetes,
    '-f' . $expediteur
);

if (!$envoye) {
    echec(500, "Le message n'a pas pu partir. Réessayez dans un instant ou écrivez directement par e-mail.");
}

repondre(200, ['ok' => true, 'message' => 'Message envoyé.']);
