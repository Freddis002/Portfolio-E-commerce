import mesure from "../data/mesure.json";

/*
 * Mesure d'audience (configuration : src/data/mesure.json).
 *
 * - Matomo, SANS cookies (disableCookies) : exempté de consentement par la
 *   CNIL, à condition de régler aussi l'instance (IP anonymisée sur 2 octets,
 *   données conservées 25 mois max, pas de recoupement avec d'autres sites).
 * - Microsoft Clarity : chargé SEULEMENT après accord dans le bandeau cookies,
 *   avec le signal de consentement de Clarity (consentv2).
 * Tant que les identifiants sont vides, rien n'est chargé.
 */

const URL_MATOMO = mesure.matomo.url ? mesure.matomo.url.replace(/\/?$/, "/") : null;
const SITE_MATOMO = String(mesure.matomo.siteId ?? "");
const ID_CLARITY = mesure.clarity.id;

let matomoDemarre = false;
let clarityCharge = false;

const file = () => (window._paq = window._paq || []);

// Démarre Matomo (une seule fois, au premier affichage dans le navigateur)
export function demarrerMatomo() {
  if (matomoDemarre || !URL_MATOMO || !SITE_MATOMO) return;
  matomoDemarre = true;
  const paq = file();
  paq.push(["disableCookies"]);
  paq.push(["setTrackerUrl", `${URL_MATOMO}matomo.php`]);
  paq.push(["setSiteId", SITE_MATOMO]);
  paq.push(["enableLinkTracking"]);
  const script = document.createElement("script");
  script.async = true;
  script.src = `${URL_MATOMO}matomo.js`;
  document.head.append(script);
}

// Page vue : appelée à chaque changement de page (le site navigue sans recharger)
export function pageVue(adresse, titre) {
  if (!matomoDemarre) return;
  const paq = file();
  paq.push(["setCustomUrl", adresse]);
  paq.push(["setDocumentTitle", titre]);
  paq.push(["trackPageView"]);
}

// Catégorie Matomo de chaque événement du site
const CATEGORIES = {
  ajout_selection: "Sélection",
  retrait_selection: "Sélection",
  envoi_contact: "Contact",
  telechargement_cv: "CV",
};

/**
 * Événement, ex. track("ajout_selection", { id: "P-01" }).
 * Aucune donnée personnelle n'est envoyée : seulement l'identifiant d'un élément.
 */
export function track(evenement, donnees = {}) {
  if (!matomoDemarre) return;
  file().push(["trackEvent", CATEGORIES[evenement] ?? "Site", evenement, donnees.id]);
}

/**
 * Clarity selon le choix du visiteur :
 * - accord : chargement du script puis signal « mesure d'audience accordée,
 *   publicité refusée » ;
 * - refus après un accord : signal de refus, et Clarity efface ses cookies.
 */
export function appliquerChoixClarity(accord) {
  if (!ID_CLARITY) return;
  if (accord) {
    if (!clarityCharge) {
      clarityCharge = true;
      // File d'attente officielle de Clarity, utilisable avant le chargement du script
      window.clarity =
        window.clarity ||
        function (...args) {
          (window.clarity.q = window.clarity.q || []).push(args);
        };
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.clarity.ms/tag/${encodeURIComponent(ID_CLARITY)}`;
      document.head.append(script);
    }
    window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });
  } else if (clarityCharge) {
    window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" });
    window.clarity("consent", false);
  }
}
