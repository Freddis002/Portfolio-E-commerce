import { useEffect } from "react";
import { useLocation } from "react-router";
import { appliquerChoixClarity, demarrerMatomo, pageVue, track } from "../lib/analytics";
import { useConsentement } from "../lib/consentement";

/**
 * Branche la mesure d'audience (placé une seule fois, dans root.jsx) :
 * - Matomo sans cookies démarre au premier affichage, puis compte chaque page ;
 * - tout clic sur un lien vers le CV envoie « telechargement_cv » ;
 * - Clarity suit le choix du bandeau cookies (chargé seulement après accord).
 * N'affiche rien.
 */
export default function MesureAudience() {
  const { pathname, search } = useLocation();
  const { choix } = useConsentement();

  useEffect(() => {
    demarrerMatomo();
    // Un seul écouteur pour tous les liens vers le CV (header, bannières, contact…)
    const surClic = (e) => {
      if (e.target.closest?.('a[href$="/cv.pdf"]')) track("telechargement_cv");
    };
    document.addEventListener("click", surClic);
    return () => document.removeEventListener("click", surClic);
  }, []);

  // Page vue à chaque changement d'adresse (le titre est mis à jour juste avant)
  useEffect(() => {
    const minuteur = setTimeout(() => pageVue(pathname + search, document.title), 0);
    return () => clearTimeout(minuteur);
  }, [pathname, search]);

  useEffect(() => {
    if (choix) appliquerChoixClarity(choix.clarity);
  }, [choix]);

  return null;
}
