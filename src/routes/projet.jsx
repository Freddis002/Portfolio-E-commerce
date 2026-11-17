import { Link } from "react-router";
import { contextes, deuxChiffres, elementsLies, urlElement } from "../data/catalogue";
import { chargerFiche, filFiche, metaFiche, useFicheVue } from "../lib/fiche";
import { useSelection } from "../lib/selection";
import BasDeFiche from "../components/BasDeFiche";
import Bouton from "../components/Bouton";
import BoutonAjout from "../components/BoutonAjout";
import Depliable from "../components/Depliable";
import EnBref from "../components/EnBref";
import EnteteSection from "../components/EnteteSection";
import { Pastilles } from "../components/Etiquettes";
import FilAriane from "../components/FilAriane";
import GalerieProjet from "../components/GalerieProjet";
import ImageEmplacement from "../components/ImageEmplacement";
import PointFinal from "../components/PointFinal";
import "./fiche.css";

// Pré-rendu : une page par projet de projets.json ; slug inconnue → 404
export const loader = chargerFiche("projet");
// Même recherche dans le navigateur (navigation interne) : pas de requête réseau,
// et une slug inconnue donne bien une page 404
export const clientLoader = chargerFiche("projet");
export const meta = metaFiche;

// Sections du récit : clé dans « recit » (projets.json) → intitulé
const RECIT = [
  ["contexte", "Contexte"],
  ["problematique", "Problématique"],
  ["role", "Mon rôle"],
  ["demarche", "Ma démarche"],
];

export default function FicheProjet({ loaderData: projet }) {
  useFicheVue(projet);
  const { contient, basculer } = useSelection();
  const expertises = elementsLies(projet, "expertise");
  // Le lien n'apparaît que si une vraie adresse est renseignée
  const siteEnLigne = /^https?:\/\//.test(projet.siteEnLigne ?? "") ? projet.siteEnLigne : null;

  return (
    <main id="contenu" className="fiche fiche--projet">
      {/* Zone produit : galerie + résumé */}
      <div className="fiche__haut conteneur">
        <FilAriane court items={filFiche(projet)} />
        <div className="fiche__produit">
          <div className="fiche__visuel">
            <GalerieProjet badges={projet.badges} />
          </div>

          <div className="fiche__resume">
            <p className="fiche__reference label-mono">
              {[projet.ref, "Projet", projet.annee, projet.duree].join(" · ")}
            </p>
            <h1 className="fiche__titre">
              {projet.titre}
              <PointFinal />
            </h1>
            <p className="fiche__accroche">{projet.accroche}</p>
            <EnBref
              titre="En bref"
              lignes={[
                {
                  label: "Catégorie",
                  valeur: ["Projet", ...expertises.map((e) => e.titre)].join(" · "),
                },
                { label: "Entreprise", valeur: projet.entreprise },
                { label: "Rôle", valeur: projet.role },
                { label: "Contexte", valeur: contextes[projet.contexte] },
                { label: "Année", valeur: `${projet.annee} · ${projet.duree}` },
                { label: "Outils", valeur: <Pastilles outils={projet.outils} /> },
              ]}
            />
            <div className="fiche__actions">
              <BoutonAjout
                className="fiche__ajout"
                taille="l"
                ajoute={contient(projet.ref)}
                onClick={() => basculer(projet)}
                titre={projet.titre}
              />
              {siteEnLigne && (
                <Bouton variante="contour" href={siteEnLigne} target="_blank" rel="noopener noreferrer">
                  Voir le site en ligne <span aria-hidden="true">↗</span>
                  <span className="visuellement-cache"> (nouvel onglet)</span>
                </Bouton>
              )}
              <p className="fiche__note">Votre sélection reste sur cet appareil. Aucune inscription.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Récit : problème → démarche */}
      <section className="fiche__section conteneur" aria-labelledby="fiche-recit">
        <EnteteSection id="fiche-recit" titre="Le projet" />
        <div className="fiche__colonnes fiche__colonnes--4">
          {RECIT.map(([cle, titre], i) => (
            <Depliable key={cle} numero={deuxChiffres(i + 1)} titre={titre} ouvert={i === 0}>
              <p>{projet.recit[cle]}</p>
            </Depliable>
          ))}
        </div>
      </section>

      {/* Résultats : uniquement s'ils sont réels et renseignés dans projets.json */}
      {projet.resultats.length > 0 && (
        <section className="fiche__resultats" aria-labelledby="fiche-resultats">
          <div className="fiche__resultats-interieur conteneur">
            <div>
              <p className="label-mono">05 · Résultats</p>
              <h2 id="fiche-resultats" className="fiche__h2">
                Résultats
              </h2>
            </div>
            <ul className="fiche__kpis">
              {projet.resultats.map((r) => (
                <li key={r.libelle} className="fiche__kpi">
                  <span className="fiche__kpi-valeur">{r.valeur}</span>
                  <span className="label-mono">{r.libelle}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* En images + outils et expertises mobilisés */}
      <section className="fiche__section fiche__images conteneur" aria-label="En images, outils et expertises">
        <div className="fiche__images-galerie">
          <h2 className="fiche__h3">En images</h2>
          <div className="fiche__captures">
            <ImageEmplacement type="Capture" ratio="16:9" />
            <ImageEmplacement type="Capture" ratio="16:9" />
          </div>
        </div>
        <div className="fiche__mobilises">
          <h2 className="fiche__h3">Outils et expertises mobilisés</h2>
          <Pastilles outils={projet.outils} />
          {expertises.length > 0 && (
            <ul className="fiche__liens-pastilles">
              {expertises.map((e) => (
                <li key={e.ref}>
                  <Link to={urlElement(e)} className="pastille-lien">
                    {e.ref} · {e.titre} <span aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <BasDeFiche element={projet} souvent={elementsLies(projet)} />
    </main>
  );
}
