import publiees from "../data/photos.json";

/*
 * Photos publiées par « npm run photos » (liste tenue à jour dans src/data/photos.json).
 *
 * photoPubliee("/photos/passions/crossfit") → { src, largeur, hauteur } si la
 * photo existe, sinon null : le composant affiche alors l'emplacement hachuré.
 */
export function photoPubliee(src) {
  const dimensions = publiees[src];
  return dimensions ? { src, ...dimensions } : null;
}
