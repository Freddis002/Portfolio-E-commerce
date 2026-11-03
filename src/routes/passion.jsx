import { Link } from "react-router";
import { deuxChiffres, elementsDe, elementsLies, urlElement } from "../data/catalogue";
import { chargerFiche, metaFiche, useFicheVue } from "../lib/fiche";
import { useSelection } from "../lib/selection";
import BasDeFiche from "../components/BasDeFiche";
import BoutonAjout from "../components/BoutonAjout";
import CarteProduit from "../components/CarteProduit";
import EnBref from "../components/EnBref";
import EnteteSection from "../components/EnteteSection";
import FilAriane from "../components/FilAriane";
import ImageEmplacement from "../components/ImageEmplacement";
import PointFinal from "../components/PointFinal";
import "./fiche.css";

// Pré-rendu : une page par passion de passions.json ; slug inconnue → 404
export const loader = chargerFiche("passion");
// Même recherche dans le navigateur (navigation interne) : pas de requête réseau,
// et une slug inconnue donne bien une page 404
export const clientLoader = chargerFiche("passion");
export const meta = metaFiche;

const NOMBRE_PHOTOS = 6;

export default function FichePassion({ loaderData: passion }) {
  useFicheVue(passion);
  const { contient, basculer } = useSelection();
  const autresPassions = elementsDe("passion").filter((p) => p.ref !== passion.ref);
  const expertiseLiee = elementsLies(passion, "expertise")[0];
  // « Souvent sélectionné avec » : projets et expertises liés (les passions ont leur bloc)
  const souvent = elementsLies(passion).filter((e) => e.categorie !== "passion");

  return (
    <main id="contenu" className="fiche fiche--passion">
      <div className="fiche__haut conteneur">
        <FilAriane
          court
          items={[
            { label: "Accueil", to: "/" },
            { label: "Catalogue", to: "/catalogue" },
            { label: "Passions", to: "/catalogue?cat=passions" },
            { label: passion.titre },
          ]}
        />
        <div className="fiche__produit fiche__produit--passion">
          <div className="fiche__resume">
            <p className="fiche__reference label-mono">{passion.ref} · Passion</p>
            <h1 className="fiche__titre">
              {passion.titre}
              <PointFinal />
            </h1>
            <p className="fiche__accroche">{passion.accroche}</p>
            <p className="fiche__description">{passion.description}</p>
            <EnBref
              lignes={[
                { label: "Pratiquée depuis", valeur: passion.pratiqueeDepuis },
                { label: "Terrain de jeu", valeur: passion.terrainDeJeu },
                { label: "Lien avec le métier", valeur: passion.lienMetier },
              ]}
            />
            <div className="fiche__actions">
              <BoutonAjout
                className="fiche__ajout"
                taille="l"
                ajoute={contient(passion.ref)}
                onClick={() => basculer(passion)}
                titre={passion.titre}
              />
            </div>
          </div>
          <div className="fiche__visuel">
            <ImageEmplacement type="Photo personnelle" ratio="4:5" />
          </div>
        </div>
      </div>

      {/* Galerie de 6 photos 1:1 */}
      <section className="fiche__section conteneur" aria-labelledby="fiche-galerie">
        <EnteteSection
          id="fiche-galerie"
          titre="Galerie"
          aside={<span className="label-mono">{deuxChiffres(NOMBRE_PHOTOS)} photos</span>}
        />
        <ul className="fiche__photos">
          {Array.from({ length: NOMBRE_PHOTOS }, (_, i) => (
            <li key={i}>
              <figure className="fiche__photo">
                <ImageEmplacement type="" ratio="1:1" decoratif />
                <figcaption className="label-mono">
                  Photo {deuxChiffres(i + 1)} · [Lieu, AAAA] · 1:1
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      {/* Ce que ça m'apporte au travail */}
      <section className="fiche__apport" aria-labelledby="fiche-apport">
        <div className="fiche__apport-interieur conteneur">
          <h2 id="fiche-apport" className="fiche__h2">
            Ce que ça m'apporte au travail
          </h2>
          <div className="fiche__apport-texte">
            <p>{passion.apportTravail}</p>
            {expertiseLiee && (
              <Link to={urlElement(expertiseLiee)} className="fiche__apport-lien">
                Voir l'expertise {expertiseLiee.ref} · {expertiseLiee.titre}{" "}
                <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Autres passions */}
      <section className="fiche__section conteneur" aria-labelledby="fiche-autres">
        <EnteteSection id="fiche-autres" titre="Autres passions" />
        <ul className="fiche__autres">
          {autresPassions.map((p) => (
            <li key={p.ref}>
              <CarteProduit
                element={p}
                variante="carre"
                ajoute={contient(p.ref)}
                onBasculer={() => basculer(p)}
              />
            </li>
          ))}
        </ul>
      </section>

      <BasDeFiche element={passion} souvent={souvent} />
    </main>
  );
}
