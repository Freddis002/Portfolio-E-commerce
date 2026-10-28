import projets from "./projets.json";
import expertises from "./expertises.json";
import passions from "./passions.json";

// Point d'accès unique aux 13 éléments du catalogue
export const elements = [...projets, ...expertises, ...passions];

// Infos par catégorie : segment d'URL, libellés, visuel par défaut
export const categories = {
  projet: { chemin: "projets", libelle: "Projet", pluriel: "Projets", visuel: "Visuel projet" },
  expertise: { chemin: "expertises", libelle: "Expertise", pluriel: "Expertises", visuel: "Illustration" },
  passion: { chemin: "passions", libelle: "Passion", pluriel: "Passions", visuel: "Photo" },
};

export function trouverParSlug(categorie, slug) {
  return elements.find((e) => e.categorie === categorie && e.slug === slug);
}

export function trouverParRef(ref) {
  return elements.find((e) => e.ref === ref);
}

// URL de la fiche d'un élément, ex. /projets/mon-kit-solaire
export function urlElement(element) {
  return `/${categories[element.categorie].chemin}/${element.slug}`;
}
