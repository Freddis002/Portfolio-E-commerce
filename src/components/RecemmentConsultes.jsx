import { Link } from "react-router";
import { categories, trouverParRef, urlElement } from "../data/catalogue";
import { fichesVues } from "../lib/stockage";
import ImageEmplacement from "./ImageEmplacement";
import "./RecemmentConsultes.css";

/**
 * « Récemment consultés » : fiches ouvertes récemment (gardées dans le
 * navigateur, identifiants seulement). Rien n'est affiché si la liste est vide.
 * - exclure : référence à ne pas montrer (la fiche en cours)
 */
export default function RecemmentConsultes({ exclure, className = "" }) {
  const vues = fichesVues.utiliser().filter((ref) => ref !== exclure);
  if (vues.length === 0) return null;

  return (
    <section className={`recents ${className}`} aria-labelledby="recents-titre">
      <h2 id="recents-titre" className="recents__titre">
        Récemment consultés
      </h2>
      <ul className="recents__liste">
        {vues.map(trouverParRef).map((e) => (
          <li key={e.ref}>
            <Link to={urlElement(e)} className="recents__lien">
              <ImageEmplacement type={categories[e.categorie].visuel} ratio="1:1" decoratif />
              <span>
                <span className="recents__ref">{e.ref}</span>
                <span className="recents__nom">{e.titre}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
