import IllustrationE04 from "./IllustrationE04";
import IllustrationE05 from "./IllustrationE05";
import IllustrationP01 from "./IllustrationP01";
import IllustrationP02 from "./IllustrationP02";
import IllustrationP03 from "./IllustrationP03";
import IllustrationP04 from "./IllustrationP04";

/*
 * Illustrations des éléments du catalogue, par référence.
 * CarteProduit affiche celle de l'élément : zone visuel 16:9 des cartes,
 * vignette carrée (prop cadrage="1:1") des cartes « mini ».
 * Un élément absent de cette liste garde l'emplacement hachuré.
 */
export const ILLUSTRATIONS_ELEMENTS = {
  "P-01": IllustrationP01,
  "P-02": IllustrationP02,
  "P-03": IllustrationP03,
  "P-04": IllustrationP04,
  "E-04": IllustrationE04,
  "E-05": IllustrationE05,
};
