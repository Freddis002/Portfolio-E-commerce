import { Link } from "react-router";
import { elements, trier, urlElement } from "../data/catalogue";
import Bouton from "./Bouton";
import { Badge } from "./Etiquettes";
import PointFinal from "./PointFinal";
import "./PageIntrouvable.css";

// « Les plus demandées » : les éléments marqués TOP, du plus au moins demandé
const SUGGESTIONS = trier(
  elements.filter((e) => e.badges?.top),
  "demandes",
).slice(0, 3);

/**
 * Page 404, façon « rupture de stock » : servie par Apache pour toute adresse
 * inconnue (statut 404) et affichée pour une fiche dont le slug n'existe pas.
 */
export default function PageIntrouvable() {
  return (
    <main id="contenu" className="introuvable conteneur">
      <div className="introuvable__texte">
        <Badge>RÉF. 404 · RUPTURE DE STOCK</Badge>
        <h1 className="introuvable__titre">
          Cette page n'est plus en rayon
          <PointFinal />
        </h1>
        <p className="introuvable__chapo">
          Le lien est peut-être ancien ou mal saisi. Le reste du catalogue, lui, est bien disponible.
        </p>
        <div className="introuvable__actions">
          <Bouton to="/catalogue">
            Retour au catalogue <span aria-hidden="true">→</span>
          </Bouton>
          <Bouton variante="contour" to="/">
            Accueil
          </Bouton>
        </div>
      </div>

      <nav className="introuvable__suggestions" aria-labelledby="introuvable-suggestions">
        <p id="introuvable-suggestions" className="label-mono">
          Les plus demandées
        </p>
        <ul>
          {SUGGESTIONS.map((e) => (
            <li key={e.ref}>
              <Link to={urlElement(e)}>
                {e.titre} <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
