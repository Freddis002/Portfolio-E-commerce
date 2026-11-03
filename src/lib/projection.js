/*
 * Projection Equal Earth (Šavrič, Patterson, Jenny, 2018), celle du fond de
 * carte public/carte/monde.svg (Natural Earth, Antarctique retiré).
 * Elle transforme une latitude/longitude en position sur la carte, en % de
 * sa largeur et de sa hauteur, pour placer les repères par-dessus l'image.
 */

const A1 = 1.340264;
const A2 = -0.081106;
const A3 = 0.000893;
const A4 = 0.003796;
const M = Math.sqrt(3) / 2;

// Coordonnées « brutes » de la projection (unités sans dimension)
function equalEarth(latitude, longitude) {
  const phi = (latitude * Math.PI) / 180;
  const lambda = (longitude * Math.PI) / 180;
  const theta = Math.asin(M * Math.sin(phi));
  const t2 = theta * theta;
  const t6 = t2 * t2 * t2;
  return {
    x: (lambda * Math.cos(theta)) / (M * (A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2))),
    y: theta * (A1 + A2 * t2 + t6 * (A3 + A4 * t2)),
  };
}

/*
 * Cadrage de monde.svg (viewBox 0 0 1000 437,4) :
 * - la carte couvre toute la largeur, de -180° à +180° de longitude ;
 * - l'équateur est à 55,19 % de la hauteur (l'Antarctique a été retiré).
 * Vérifié sur les 13 lieux : écart inférieur à 0,01 % avec les maquettes.
 */
const LARGEUR = 1000;
const HAUTEUR = 437.4;
const X_MAX = equalEarth(0, 180).x; // demi-largeur du monde
const ECHELLE = LARGEUR / 2 / X_MAX; // unités → px du viewBox
const EQUATEUR = 0.551912 * HAUTEUR; // px du viewBox

export const RATIO_CARTE = LARGEUR / HAUTEUR;

// Position d'un point sur la carte, en % : { x: 50.64, y: 15.23 } pour Arras
export function positionSurCarte(latitude, longitude) {
  const p = equalEarth(latitude, longitude);
  return {
    x: ((LARGEUR / 2 + ECHELLE * p.x) / LARGEUR) * 100,
    y: ((EQUATEUR - ECHELLE * p.y) / HAUTEUR) * 100,
  };
}
