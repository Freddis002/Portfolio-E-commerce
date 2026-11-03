import { Link } from "react-router";
import { categories, voisins } from "../data/catalogue";
import { useSelection } from "../lib/selection";
import BarreAjoutMobile from "./BarreAjoutMobile";
import CarteProduit from "./CarteProduit";
import EnteteSection from "./EnteteSection";
import PaginationVoisins from "./PaginationVoisins";
import RecemmentConsultes from "./RecemmentConsultes";
import "./BasDeFiche.css";

/**
 * Bas commun aux trois fiches :
 * « Souvent sélectionné avec », « Récemment consultés », Précédent / Suivant
 * dans la catégorie, et le bouton d'ajout collé en bas sur mobile.
 * - souvent : éléments liés à afficher (section masquée si vide)
 */
export default function BasDeFiche({ element, souvent = [] }) {
  const { contient, basculer } = useSelection();
  const { precedent, suivant } = voisins(element);

  return (
    <>
      {souvent.length > 0 && (
        <section className="bas-fiche__souvent conteneur" aria-labelledby="fiche-souvent">
          <EnteteSection
            id="fiche-souvent"
            titre="Souvent sélectionné avec"
            aside={
              <Link to="/catalogue">
                Tout le catalogue <span aria-hidden="true">→</span>
              </Link>
            }
          />
          <ul className="bas-fiche__cartes">
            {souvent.map((e) => (
              <li key={e.ref}>
                <CarteProduit
                  element={e}
                  ajoute={contient(e.ref)}
                  onBasculer={() => basculer(e)}
                  avecTexte={false}
                  avecPastilles={false}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="bas-fiche__recents conteneur">
        <RecemmentConsultes exclure={element.ref} />
      </div>

      <PaginationVoisins
        precedent={precedent}
        suivant={suivant}
        label={`${categories[element.categorie].pluriel} : fiche précédente et suivante`}
      />

      <BarreAjoutMobile element={element} />
    </>
  );
}
