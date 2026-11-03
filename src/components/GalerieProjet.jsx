import { useState } from "react";
import { useEstMobile } from "../lib/fiche";
import ImageEmplacement from "./ImageEmplacement";
import { Badge } from "./Etiquettes";
import "./GalerieProjet.css";

const deux = (n) => String(n).padStart(2, "0");

/**
 * Galerie de fiche projet.
 * - Desktop et tablette : grand visuel 16:10 + miniatures cliquables.
 * - Mobile : rail horizontal qu'on fait glisser du doigt (le visuel suivant
 *   dépasse à droite pour inviter au geste), comme sur la maquette mobile.
 * - nombre : nombre de visuels (emplacements hachurés en attendant les vrais)
 * - badges : { nouveau, top } de l'élément, affichés sur le premier visuel
 */
export default function GalerieProjet({ nombre = 4, badges }) {
  const [actif, setActif] = useState(0);
  const mobile = useEstMobile();

  const pastilles = (badges?.top || badges?.nouveau) && (
    <span className="galerie-projet__badges">
      {badges.top && <Badge type="top" />}
      {badges.nouveau && <Badge type="nouveau" />}
    </span>
  );
  const compteur = (i) => (
    <span className="galerie-projet__compteur" aria-hidden="true">
      {deux(i + 1)} / {deux(nombre)}
    </span>
  );

  if (mobile) {
    return (
      // tabIndex : le rail peut aussi défiler au clavier (flèches gauche/droite)
      <ul className="galerie-projet__rail" aria-label="Galerie : faites glisser pour voir les visuels" tabIndex={0}>
        {Array.from({ length: nombre }, (_, i) => (
          <li key={i} className="galerie-projet__diapo">
            <ImageEmplacement type={`Visuel ${deux(i + 1)}`} ratio="16:10">
              {i === 0 && pastilles}
              {compteur(i)}
            </ImageEmplacement>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="galerie-projet">
      <ImageEmplacement type={`Visuel ${deux(actif + 1)}`} ratio="16:10">
        {pastilles}
        {compteur(actif)}
      </ImageEmplacement>

      <div className="galerie-projet__miniatures" role="group" aria-label="Choisir une image">
        {Array.from({ length: nombre }, (_, i) => (
          <button
            key={i}
            type="button"
            className="galerie-projet__miniature"
            aria-pressed={i === actif}
            aria-label={`Afficher l'image ${i + 1} sur ${nombre}`}
            onClick={() => setActif(i)}
          >
            <ImageEmplacement type="" ratio="16:10" decoratif />
            <span className="galerie-projet__numero" aria-hidden="true">{deux(i + 1)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
