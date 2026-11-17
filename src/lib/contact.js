/*
 * Échanges avec le script d'envoi public/api/contact.php (hébergement OVH).
 *
 * En local (npm run dev ou npm run preview), PHP n'est pas disponible : les
 * réponses sont simulées. Pour tester un échec, écrivez « #erreur » dans le
 * message. En ligne, l'adresse n'est jamais localhost : le vrai script répond.
 */

const ADRESSE = "/api/contact.php";
const SIMULATION =
  import.meta.env.DEV ||
  (typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname));
const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

const ECHEC_RESEAU = {
  ok: false,
  message: "Le message n'a pas pu partir (connexion interrompue). Votre texte est conservé : réessayez dans un instant.",
};

/*
 * Jeton daté et signé par le serveur, demandé à l'affichage du formulaire.
 * Le serveur refuse un envoi fait moins de 3 secondes après : un robot qui
 * remplit le formulaire instantanément est bloqué.
 */
export async function demanderJeton() {
  if (SIMULATION) return `simulation-${Date.now()}`;
  try {
    const reponse = await fetch(ADRESSE, { headers: { Accept: "application/json" } });
    const donnees = await reponse.json();
    return donnees.jeton ?? null;
  } catch {
    return null;
  }
}

/**
 * Envoie le message. Réponse : { ok: true, message }
 * ou { ok: false, message, erreurs: { champ: "texte" } }.
 */
export async function envoyerMessage(champs) {
  if (SIMULATION) {
    await attendre(600);
    if (champs.message.includes("#erreur")) {
      return { ok: false, message: "Simulation : le serveur a refusé l'envoi. Votre texte est conservé." };
    }
    return { ok: true, message: "Message envoyé (simulation locale)." };
  }
  try {
    const reponse = await fetch(ADRESSE, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(champs),
    });
    return await reponse.json();
  } catch {
    return ECHEC_RESEAU;
  }
}

/* ---------- Validation côté navigateur (le serveur revalide tout) ---------- */

export const LIMITES = { nom: 100, email: 254, objet: 150, message: 5000 };
export const MESSAGE_A_COMPLETER = "[Précisez votre besoin ou votre question]";
const FORMAT_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Renvoie le texte d'erreur d'un champ, ou null s'il est correct
export function verifierChamp(nom, valeur) {
  const v = valeur.trim();
  switch (nom) {
    case "nom":
      if (!v) return "Indiquez votre nom.";
      if (v.length > LIMITES.nom) return `${LIMITES.nom} caractères maximum.`;
      return null;
    case "email":
      if (!v) return "Indiquez votre adresse e-mail.";
      if (!FORMAT_EMAIL.test(v) || v.length > LIMITES.email) return "Format d'e-mail invalide (ex. : nom@entreprise.fr).";
      return null;
    case "objet":
      return v.length > LIMITES.objet ? `${LIMITES.objet} caractères maximum.` : null;
    case "message":
      if (!v) return "Écrivez votre message.";
      if (v.includes(MESSAGE_A_COMPLETER)) return "Remplacez « [Précisez votre besoin ou votre question] » par votre message.";
      if (v.length > LIMITES.message) return `${LIMITES.message} caractères maximum.`;
      return null;
    default:
      return null;
  }
}
