import projets from "./projets.json";
import expertises from "./expertises.json";
import passions from "./passions.json";

// Point d'accès unique aux 13 éléments du catalogue
export const elements = [...projets, ...expertises, ...passions];

export function trouverParSlug(categorie, slug) {
  return elements.find((e) => e.categorie === categorie && e.slug === slug);
}

export function trouverParRef(ref) {
  return elements.find((e) => e.ref === ref);
}
