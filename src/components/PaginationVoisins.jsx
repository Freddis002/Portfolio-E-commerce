import { Link } from "react-router";
import { urlElement } from "../data/catalogue";
import "./PaginationVoisins.css";

/**
 * Navigation « ← Précédent / Suivant → » entre les fiches d'une même catégorie.
 * - precedent / suivant : éléments du catalogue (src/data/*.json)
 * - label : nom de la navigation, ex. « Projets voisins »
 */
export default function PaginationVoisins({ precedent, suivant, label = "Fiches voisines" }) {
  return (
    <nav className="voisins" aria-label={label}>
      {precedent ? (
        <Link to={urlElement(precedent)} className="voisins__lien" rel="prev">
          <span className="label-mono">
            <span aria-hidden="true">← </span>Précédent · {precedent.ref}
          </span>
          <span className="voisins__titre">{precedent.titre}</span>
        </Link>
      ) : (
        <span />
      )}
      {suivant && (
        <Link to={urlElement(suivant)} className="voisins__lien voisins__lien--suivant" rel="next">
          <span className="label-mono">
            {suivant.ref} · Suivant<span aria-hidden="true"> →</span>
          </span>
          <span className="voisins__titre">{suivant.titre}</span>
        </Link>
      )}
    </nav>
  );
}
