import { useEffect, useSyncExternalStore } from "react";
import { data } from "react-router";
import profil from "../data/profil.json";
import { categories, elementsLies, trouverParSlug, urlElement } from "../data/catalogue";
import { fichesVues } from "./stockage";
import { LIMITE_DESCRIPTION, LIMITE_TITRE, couper, ldFilAriane, ldProjet, metaPage } from "./seo";

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

/**
 * Fil d'Ariane d'une fiche : Accueil / Catalogue / Projets / Mon Kit Solaire.
 * Le même tableau sert au fil affiché (FilAriane) et au JSON-LD.
 */
export function filFiche(element) {
  const cat = categories[element.categorie];
  return [
    { label: "Accueil", to: "/" },
    { label: "Catalogue", to: "/catalogue" },
    { label: cat.pluriel, to: `/catalogue?cat=${cat.chemin}` },
    { label: element.titre },
  ];
}

// Balises <head> d'une fiche, générées depuis les données (title ≤ 60, description ≤ 155)
export function metaFiche({ data: element }) {
  if (!element) return [{ title: "Page introuvable" }];
  const libelle = categories[element.categorie].libelle;
  const chemin = urlElement(element);
  const nom = `${profil.nom} ${profil.prenom}`;
  // Titre complet si possible, sinon sans la ville
  const titreComplet = `${element.titre} · ${libelle} · ${nom}, ${profil.ville}`;
  const titre = titreComplet.length <= LIMITE_TITRE ? titreComplet : couper(`${element.titre} · ${libelle} · ${nom}`, LIMITE_TITRE);
  const description = couper(
    `${libelle} ${element.ref} : ${element.titre}. ${element.accroche} Portfolio de ${nom}, basé à ${profil.ville}.`,
    LIMITE_DESCRIPTION,
  );
  const jsonLd = [ldFilAriane(filFiche(element), chemin)];
  if (element.categorie === "projet") jsonLd.push(ldProjet(element, chemin, elementsLies(element, "expertise")));
  return metaPage({ titre, description, chemin, jsonLd });
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
