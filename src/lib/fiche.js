import { useEffect, useSyncExternalStore } from "react";
import { data } from "react-router";
import profil from "../data/profil.json";
import { categories, trouverParSlug, urlElement } from "../data/catalogue";
import { fichesVues } from "./stockage";
import { metaPage } from "./seo";

/**
 * Loader d'une fiche, exécuté au build (pré-rendu) : retrouve l'élément
 * d'après le slug de l'URL. Slug inconnue → erreur 404 (page introuvable).
 */
export function chargerFiche(categorie) {
  return ({ params }) => {
    const element = trouverParSlug(categorie, params.slug);
    if (!element) throw data(null, { status: 404 });
    return element;
  };
}

// Balises <head> d'une fiche : « Mon Kit Solaire · Projet · NOM PRÉNOM, Arras »
export function metaFiche({ data: element }) {
  if (!element) return [{ title: "Page introuvable" }];
  const libelle = categories[element.categorie].libelle;
  return metaPage({
    titre: `${element.titre} · ${libelle} · ${profil.nom} ${profil.prenom}, ${profil.ville}`,
    description: `${libelle} ${element.ref} : ${element.titre}. ${element.accroche} Portfolio de ${profil.nom} ${profil.prenom}, ${profil.ville} (${profil.region}).`,
    chemin: urlElement(element),
  });
}

// Mémorise la fiche ouverte pour « Récemment consultés » (identifiant seulement)
export function useFicheVue(element) {
  useEffect(() => {
    fichesVues.placerEnTete(element.ref);
  }, [element.ref]);
}

/*
 * Vrai sous 600 px. Pendant le pré-rendu et l'hydratation, on répond « faux »
 * (version desktop, tout le texte visible dans le HTML), puis la vraie valeur.
 */
const REQUETE_MOBILE = "(max-width: 599px)";

function abonnerMobile(f) {
  const mq = window.matchMedia(REQUETE_MOBILE);
  mq.addEventListener("change", f);
  return () => mq.removeEventListener("change", f);
}

export function useEstMobile() {
  return useSyncExternalStore(
    abonnerMobile,
    () => window.matchMedia(REQUETE_MOBILE).matches,
    () => false,
  );
}
