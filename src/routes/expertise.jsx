import { deuxChiffres, elementsLies } from "../data/catalogue";
import { chargerFiche, filFiche, metaFiche, useFicheVue } from "../lib/fiche";
import { useSelection } from "../lib/selection";
import BasDeFiche from "../components/BasDeFiche";
import BoutonAjout from "../components/BoutonAjout";
import CarteProduit from "../components/CarteProduit";
import Depliable from "../components/Depliable";
import EnBref from "../components/EnBref";
import EnteteSection from "../components/EnteteSection";
import { Badge, Pastilles } from "../components/Etiquettes";
import FilAriane from "../components/FilAriane";
import ImageEmplacement from "../components/ImageEmplacement";
import PointFinal from "../components/PointFinal";
import "./fiche.css";

// Pré-rendu : une page par expertise de expertises.json ; slug inconnue → 404
export const loader = chargerFiche("expertise");
// Même recherche dans le navigateur (navigation interne) : pas de requête réseau,
// et une slug inconnue donne bien une page 404
export const clientLoader = chargerFiche("expertise");
export const meta = metaFiche;

export default function FicheExpertise({ loaderData: expertise }) {
  useFicheVue(expertise);
  const { contient, basculer } = useSelection();
  const projetsLies = elementsLies(expertise, "projet");
  // « Souvent sélectionné avec » : les liens qui ne sont pas déjà dans l'exemple
  const autresLies = elementsLies(expertise).filter((e) => e.categorie !== "projet");

  return (
    <main id="contenu" className="fiche fiche--expertise">
      <div className="fiche__haut conteneur">
        <FilAriane court items={filFiche(expertise)} />
        <div className="fiche__produit fiche__produit--expertise">
          <div className="fiche__intro">
            <p className="fiche__reference">
              <span className="label-mono">{expertise.ref} · Expertise</span>
              {expertise.badges?.top && (
                <Badge>
                  TOP
                  {expertise.classement && ` · N°${expertise.classement} des plus demandées`}
                </Badge>
              )}
              {expertise.badges?.nouveau && <Badge type="nouveau" />}
            </p>
            <h1 className="fiche__titre fiche__titre--geant">
              {expertise.titre}
              <PointFinal />
            </h1>
            <p className="fiche__accroche">{expertise.accroche}</p>
          </div>

          <div className="fiche__resume">
            <ImageEmplacement type="Illustration" ratio="1:1" className="fiche__illustration" />
            <EnBref
              lignes={[
                { label: "Pratiqué depuis", valeur: expertise.pratiqueeDepuis },
                {
                  label: "Projets liés",
                  valeur: projetsLies.length
                    ? `${deuxChiffres(projetsLies.length)} · ${projetsLies.map((p) => p.titre).join(", ")}`
                    : null,
                },
                { label: "Postes visés", valeur: expertise.postesVises },
              ]}
            />
            <div className="fiche__actions">
              <BoutonAjout
                className="fiche__ajout"
                taille="l"
                ajoute={contient(expertise.ref)}
                onClick={() => basculer(expertise)}
                titre={expertise.titre}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Besoins, missions, méthode */}
      <section className="fiche__section conteneur" aria-label="L'expertise en détail">
        <div className="fiche__colonnes fiche__colonnes--3">
          <Depliable numero="01" titre="Vos besoins" niveau={2} ouvert>
            <p>{expertise.besoins}</p>
          </Depliable>
          <Depliable numero="02" titre="Mes missions" niveau={2}>
            <ul className="fiche__puces">
              {expertise.missions.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </Depliable>
          <Depliable numero="03" titre="Ma méthode" niveau={2}>
            <ol className="fiche__etapes">
              {expertise.methode.map((etape, i) => (
                <li key={etape}>
                  <span className="fiche__etape-numero">Étape {i + 1}</span>
                  {etape}
                </li>
              ))}
            </ol>
          </Depliable>
        </div>

        <div className="fiche__outils">
          <h2 className="fiche__outils-titre label-mono">Outils maîtrisés</h2>
          <Pastilles outils={expertise.outils} />
        </div>
      </section>

      {/* Exemple de mise en application : les projets liés */}
      {projetsLies.length > 0 && (
        <section className="fiche__application" aria-labelledby="fiche-application">
          <div className="conteneur">
            <EnteteSection id="fiche-application" titre="Exemple de mise en application" />
            <div className="fiche__application-grille">
              <div className="fiche__application-texte">
                <p className="label-mono">En pratique</p>
                <p className="fiche__accroche">{expertise.exemple}</p>
              </div>
              <ul className="fiche__application-cartes">
                {projetsLies.map((p) => (
                  <li key={p.ref}>
                    <CarteProduit
                      element={p}
                      ajoute={contient(p.ref)}
                      onBasculer={() => basculer(p)}
                      avecTexte={false}
                      avecPastilles={false}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <BasDeFiche element={expertise} souvent={autresLies} />
    </main>
  );
}
