import { useSyncExternalStore } from "react";
import mesure from "../data/mesure.json";

/*
 * Consentement aux cookies (recommandations CNIL).
 *
 * Seul Microsoft Clarity a besoin d'un accord : Matomo fonctionne sans
 * cookies et en est exempté. Le choix est gardé 6 mois dans un petit cookie
 * technique « consentement » (lui-même exempté : il sert à retenir le choix),
 * puis il est redemandé.
 */

export const CLARITY_ACTIF = Boolean(mesure.clarity.id);
const NOM_COOKIE = "consentement";
const SIX_MOIS = 60 * 60 * 24 * 182; // en secondes

const abonnes = new Set();
let panneauOuvert = false;

// Choix enregistré : { clarity: true | false } ou null si rien n'a été décidé
function lireCookie() {
  try {
    const brut = document.cookie.split("; ").find((c) => c.startsWith(`${NOM_COOKIE}=`));
    if (!brut) return null;
    const valeur = decodeURIComponent(brut.slice(NOM_COOKIE.length + 1));
    return valeur === "clarity" ? { clarity: true } : valeur === "aucun" ? { clarity: false } : null;
  } catch {
    return null;
  }
}

let choix;
const lire = () => {
  if (choix === undefined) choix = lireCookie();
  return choix;
};

function prevenir() {
  etat = { choix: lire(), panneauOuvert };
  abonnes.forEach((f) => f());
}

let etat = null;
const instantane = () => (etat ??= { choix: lire(), panneauOuvert });
const INITIAL = { choix: undefined, panneauOuvert: false }; // pré-rendu : rien d'affiché

/**
 * État du consentement : choix (undefined pendant le pré-rendu, null si
 * aucune décision, sinon { clarity }) et ouverture du panneau « Personnaliser ».
 */
export function useConsentement() {
  return useSyncExternalStore(
    (f) => {
      abonnes.add(f);
      return () => abonnes.delete(f);
    },
    instantane,
    () => INITIAL,
  );
}

// Enregistre le choix pour 6 mois et prévient la page (chargement ou arrêt de Clarity)
export function enregistrerChoix(clarity) {
  const valeur = clarity ? "clarity" : "aucun";
  const securise = window.location.protocol === "https:" ? "; Secure" : "";
  try {
    document.cookie = `${NOM_COOKIE}=${valeur}; Max-Age=${SIX_MOIS}; Path=/; SameSite=Lax${securise}`;
  } catch {
    // cookies bloqués : le choix vaut pour cette visite seulement
  }
  choix = { clarity };
  panneauOuvert = false;
  prevenir();
}

// « Gérer les cookies » (footer, page Confidentialité) : rouvre le panneau
export function ouvrirPanneauCookies() {
  panneauOuvert = true;
  prevenir();
}

export function fermerPanneauCookies() {
  panneauOuvert = false;
  prevenir();
}
