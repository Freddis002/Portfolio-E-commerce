import { categories, situationLieu } from "../data/catalogue";
import { fermerMiniPanier, useRetoursSelection, useSelection } from "../lib/selection";
import Bouton from "./Bouton";
import ImageEmplacement from "./ImageEmplacement";
import PanneauLateral from "./PanneauLateral";
import "./MiniPanier.css";

const libelle = (e) => categories[e.categorie]?.libelle ?? "Lieu";

/**
 * Mini-panier : panneau latéral ouvert à chaque ajout à « Ma sélection »
 * (placé une seule fois, dans root.jsx).
 * Le panneau repose sur <dialog> : Échap le ferme, le focus y reste piégé,
 * puis le navigateur le rend au bouton d'ajout qui l'a ouvert.
 */
export default function MiniPanier() {
  const { dernierAjout: element } = useRetoursSelection();
  const { count } = useSelection();

  return (
    <PanneauLateral
      ouvert={element !== null}
      onFermer={fermerMiniPanier}
      titre="✓ Ajouté à votre sélection"
      pied={
        <>
          <Bouton variante="secondaire" to="/selection" onClick={fermerMiniPanier}>
            Voir ma sélection <span aria-hidden="true">→</span>
          </Bouton>
          <Bouton variante="contour" onClick={fermerMiniPanier}>
            Continuer l'exploration
          </Bouton>
        </>
      }
    >
      {element && (
        <div className="mini-panier">
          <div className="mini-panier__element">
            <ImageEmplacement type="" ratio="1:1" decoratif className="mini-panier__vignette" />
            <div>
              <p className="label-mono">
                {element.ref} · {libelle(element)}
              </p>
              <p className="mini-panier__titre">{element.titre}</p>
              <p className="mini-panier__texte">
                {element.categorie === "lieu" ? situationLieu(element) : element.accroche}
              </p>
            </div>
          </div>
          <p className="mini-panier__total label-mono">
            {String(count).padStart(2, "0")} élément{count > 1 ? "s" : ""} dans votre sélection
          </p>
        </div>
      )}
    </PanneauLateral>
  );
}
