import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Check } from "lucide-react";
import profil from "../data/profil.json";
import {
  categories,
  deuxChiffres,
  elements,
  elementsLies,
  situationLieu,
  trier,
  urlElement,
} from "../data/catalogue";
import { useApresHydratation } from "../lib/hydratation";
import { metaPage } from "../lib/seo";
import { useSelection } from "../lib/selection";
import Bouton from "../components/Bouton";
import BoutonAjout from "../components/BoutonAjout";
import CarteProduit from "../components/CarteProduit";
import EnteteSection from "../components/EnteteSection";
import ImageEmplacement from "../components/ImageEmplacement";
import IndicateurEtapes from "../components/IndicateurEtapes";
import PointFinal from "../components/PointFinal";
import "./selection.css";

export function meta() {
  return metaPage({
    titre: `Ma sélection · ${profil.nom} ${profil.prenom}`,
    description: "Votre sélection de projets, expertises et passions, à envoyer avec un message.",
    chemin: "/selection",
    // Page propre à chaque visiteur : rien à indexer
    robots: "noindex",
  });
}

// Lignes du récapitulatif (les lieux du Carnet de route n'apparaissent que s'il y en a)
const RECAP = [
  { categorie: "projet", libelle: "Projets" },
  { categorie: "expertise", libelle: "Expertises" },
  { categorie: "passion", libelle: "Passions" },
  { categorie: "lieu", libelle: "Lieux du carnet de route", facultatif: true },
];

const libelleCategorie = (e) => categories[e.categorie]?.libelle ?? "Lieu";

// « Vous aimerez aussi » : d'abord les éléments liés à la sélection, puis les plus pertinents
function suggestions(selectionnes, refs) {
  const lies = selectionnes.filter((e) => e.categorie !== "lieu").flatMap((e) => elementsLies(e));
  const candidats = [...lies, ...trier(elements, "pertinence")];
  const vus = new Set(refs);
  return candidats.filter((e) => !vus.has(e.ref) && vus.add(e.ref)).slice(0, 4);
}

export default function MaSelection() {
  // Avant lecture de la sélection (HTML pré-rendu), ni liste ni état vide :
  // on évite d'afficher « Votre sélection est vide » à qui a une sélection
  const pret = useApresHydratation();
  const { elements: selectionnes, refs, count, retirer, vider, contient, basculer } = useSelection();
  const [confirmerVider, setConfirmerVider] = useState(false);
  const [focusApres, setFocusApres] = useState(null);
  const titreRef = useRef(null);
  const listeRef = useRef(null);

  // Après un retrait : focus sur l'élément suivant (ou le titre si la liste est vide)
  useEffect(() => {
    if (!focusApres) return;
    const cible = listeRef.current?.querySelector(`[data-retirer="${focusApres}"]`);
    (cible ?? titreRef.current)?.focus();
    setFocusApres(null);
  }, [focusApres]);

  const retirerElement = (element, i) => {
    const voisin = selectionnes[i + 1] ?? selectionnes[i - 1];
    retirer(element);
    setFocusApres(voisin ? voisin.ref : "titre");
  };

  const parCategorie = (cat) => selectionnes.filter((e) => e.categorie === cat).length;
  const variee = ["projet", "expertise", "passion"].every((c) => parCategorie(c) > 0);

  return (
    <main id="contenu" className="selection">
      <div className="selection__haut conteneur">
        <IndicateurEtapes courante={0} />
        <div className="selection__entete">
          {/* Les changements sont annoncés par la zone aria-live globale (AnnonceSelection) */}
          <p className="label-mono">
            {pret ? `${deuxChiffres(count)} élément${count > 1 ? "s" : ""}` : " "}
          </p>
          <h1 ref={titreRef} tabIndex={-1} className="selection__titre">
            Ma sélection
            <PointFinal />
          </h1>
        </div>
      </div>

      {/*
        Zone qui dépend de la sélection : elle occupe au moins un écran dès le
        HTML pré-rendu, pour que son remplissage ne pousse pas le footer
        à l’écran (aucun décalage de mise en page visible).
      */}
      <div className="selection__zone">
      {pret && count === 0 && (
        <div className="selection__vide conteneur">
          <h2 className="selection__vide-titre">Votre sélection est vide</h2>
          <p>
            Parcourez le catalogue et cliquez sur « + Ajouter » sur les projets, expertises ou
            passions qui vous intéressent. Vous pourrez ensuite m'écrire avec votre sélection.
          </p>
          <Bouton to="/catalogue">
            Explorer le catalogue <span aria-hidden="true">→</span>
          </Bouton>
        </div>
      )}

      {pret && count > 0 && (
        <div className="selection__corps conteneur">
          <div className="selection__colonne">
            <ul className="selection__liste" ref={listeRef}>
              {selectionnes.map((e, i) => (
                <li key={e.ref} className="selection__element">
                  <ImageEmplacement type="" ratio="1:1" decoratif className="selection__vignette" />
                  <div className="selection__infos">
                    <p className="label-mono">
                      {e.ref} · {libelleCategorie(e)}
                    </p>
                    <h2 className="selection__nom">
                      <Link to={urlElement(e)} className="selection__nom-lien">
                        {e.titre}
                      </Link>
                    </h2>
                    <p className="selection__accroche">
                      {e.categorie === "lieu" ? situationLieu(e) : e.accroche}
                    </p>
                  </div>
                  <div className="selection__actions">
                    {/* Doublon visuel du titre-lien : ignoré au clavier et par les lecteurs d’écran */}
                    <Link to={urlElement(e)} className="selection__voir" tabIndex={-1} aria-hidden="true">
                      Voir <span>→</span>
                    </Link>
                    <BoutonAjout
                      mode="retirer"
                      compact
                      titre={e.titre}
                      data-retirer={e.ref}
                      onClick={() => retirerElement(e, i)}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <div className="selection__bas">
              <Link to="/catalogue" className="selection__continuer">
                <span aria-hidden="true">← </span>
                Continuer l'exploration
              </Link>
              {confirmerVider ? (
                <span className="selection__confirmer">
                  <button
                    type="button"
                    className="selection__lien-bouton selection__lien-bouton--fort"
                    onClick={() => {
                      vider();
                      setConfirmerVider(false);
                      titreRef.current?.focus();
                    }}
                  >
                    Confirmer : tout retirer
                  </button>
                  <button type="button" className="selection__lien-bouton" onClick={() => setConfirmerVider(false)}>
                    Annuler
                  </button>
                </span>
              ) : (
                <button type="button" className="selection__lien-bouton" onClick={() => setConfirmerVider(true)}>
                  Vider la sélection
                </button>
              )}
            </div>
          </div>

          <aside className="selection__recap" aria-labelledby="selection-recap">
            <h2 id="selection-recap" className="selection__recap-titre">
              Récapitulatif
            </h2>
            <dl className="selection__comptes">
              {RECAP.filter((r) => !r.facultatif || parCategorie(r.categorie) > 0).map((r) => (
                <div key={r.categorie} className="selection__compte">
                  <dt>{r.libelle}</dt>
                  <dd>{deuxChiffres(parCategorie(r.categorie))}</dd>
                </div>
              ))}
              <div className="selection__compte selection__compte--total">
                <dt>Total</dt>
                <dd>{deuxChiffres(count)}</dd>
              </div>
            </dl>
            {variee && (
              <p className="selection__variee">Une sélection variée : de quoi nourrir un premier échange.</p>
            )}
            <Bouton to="/contact" className="selection__parlons">
              Parlons-en <span aria-hidden="true">→</span>
            </Bouton>
            <ul className="selection__garanties">
              {[
                "Aucune inscription",
                "Message prérempli, modifiable avant l'envoi",
                "Sélection gardée sur cet appareil uniquement",
              ].map((g) => (
                <li key={g}>
                  <Check size={14} strokeWidth={1.5} aria-hidden="true" />
                  {g}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}

      {pret && (
        <section className="selection__suggestions conteneur" aria-labelledby="selection-aussi">
          <EnteteSection id="selection-aussi" titre="Vous aimerez aussi" />
          <ul className="selection__cartes">
            {suggestions(selectionnes, refs).map((e) => (
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

      </div>

      {/* Mobile : barre collée en bas avec le bouton orange */}
      {pret && count > 0 && (
        <div className="selection__barre">
          <span className="label-mono">{deuxChiffres(count)} él.</span>
          <Bouton to="/contact">
            Parlons-en <span aria-hidden="true">→</span>
          </Bouton>
        </div>
      )}
    </main>
  );
}
