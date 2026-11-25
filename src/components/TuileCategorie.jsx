import { Link } from "react-router";
import ImageEmplacement from "./ImageEmplacement";
import "./TuileCategorie.css";

/**
 * Tuile d'entrée vers une catégorie du catalogue (Projets, Expertises, Passions).
 * Toute la tuile est un lien.
 * - code : lettre de la catégorie (P, E, H) ; nombre : éléments dans la catégorie
 * - illustration (facultatif) : composant SVG décoratif affiché dans la zone 4:3,
 *   ex. illustration={IllustrationProjets} ; sans elle, emplacement hachuré
 */
export default function TuileCategorie({ titre, code, nombre, to, niveau = 3, illustration: Illustration }) {
  const Titre = `h${niveau}`;
  return (
    <Link to={to} className="tuile">
      {Illustration ? (
        <span className="tuile__visuel">
          <Illustration />
        </span>
      ) : (
        <ImageEmplacement type="Visuel catégorie" ratio="4:3" decoratif />
      )}
      <div className="tuile__pied">
        <div className="tuile__textes">
          <span className="label-mono">
            {code} · {String(nombre).padStart(2, "0")} éléments
          </span>
          <Titre className="tuile__titre">{titre}</Titre>
        </div>
        <span className="tuile__cta" aria-hidden="true">
          Voir →
        </span>
      </div>
    </Link>
  );
}
