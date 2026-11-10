import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import profil from "../data/profil.json";
import {
  categories,
  compterOption,
  deuxChiffres,
  elements,
  elementsDe,
  facettes,
  filtrer,
  trier,
  tris,
} from "../data/catalogue";
import { useApresHydratation } from "../lib/hydratation";
import { useSelection } from "../lib/selection";
import { ldFilAriane, metaPage } from "../lib/seo";
import Bouton from "../components/Bouton";
import CarteProduit from "../components/CarteProduit";
import FilAriane from "../components/FilAriane";
import { CaseFiltre, GroupeFiltres } from "../components/Filtres";
import PanneauLateral from "../components/PanneauLateral";
import RecemmentConsultes from "../components/RecemmentConsultes";
import PointFinal from "../components/PointFinal";
import SelecteurTri from "../components/SelecteurTri";
import "./catalogue.css";

export function meta() {
  // L'URL canonique ignore les filtres : /catalogue?cat=projets pointe vers /catalogue
  return metaPage({
    titre: `Catalogue : projets, expertises et passions · ${profil.nom} ${profil.prenom}`,
    description: `Projets e-commerce, expertises (SEO, marketing digital, data, web) et passions de ${profil.nom} ${profil.prenom}, basé à ${profil.ville}. Composez votre sélection.`,
    chemin: "/catalogue",
    jsonLd: [ldFilAriane(FIL_CATALOGUE, "/catalogue")],
  });
}

// Fil d'Ariane : affiché en haut de page et déclaré aux moteurs (JSON-LD)
const FIL_CATALOGUE = [{ label: "Accueil", to: "/" }, { label: "Catalogue" }];

/* ---------- État de la page ↔ paramètres d'URL ---------- */

const TOUTES_CATEGORIES = Object.values(categories).map((c) => c.chemin);
const FACETTES_SECONDAIRES = ["outil", "contexte", "annee"];

/**
 * Lit l'état des filtres dans l'URL, ex. ?cat=projets,expertises&tri=recents&vue=liste
 * - cat absent : toutes les catégories cochées ; « cat= » (vide) : aucune
 * - outil, contexte, annee absents : aucun filtre
 */
function lireUrl(params) {
  const liste = (cle) => (params.get(cle) ?? "").split(",").filter(Boolean);
  const tri = params.get("tri");
  return {
    cat: params.has("cat") ? TOUTES_CATEGORIES.filter((c) => liste("cat").includes(c)) : TOUTES_CATEGORIES,
    outil: liste("outil"),
    contexte: liste("contexte"),
    annee: liste("annee"),
    tri: tri in tris ? tri : "pertinence",
    vue: params.get("vue") === "liste" ? "liste" : "grille",
  };
}

// Inverse de lireUrl : seules les valeurs différentes du défaut vont dans l'URL.
// Les virgules restent lisibles (?cat=projets,expertises plutôt que %2C).
function ecrireUrl(etat) {
  const parties = [];
  const ajouter = (cle, valeurs) =>
    parties.push(`${cle}=${valeurs.map(encodeURIComponent).join(",")}`);
  if (etat.cat.length !== TOUTES_CATEGORIES.length) ajouter("cat", etat.cat);
  for (const cle of FACETTES_SECONDAIRES) {
    if (etat[cle].length) ajouter(cle, etat[cle]);
  }
  if (etat.tri !== "pertinence") ajouter("tri", [etat.tri]);
  if (etat.vue !== "grille") ajouter("vue", [etat.vue]);
  return parties.length ? `?${parties.join("&")}` : "";
}

/* ---------- Page ---------- */

export default function Catalogue() {
  const pret = useApresHydratation();
  const [params] = useSearchParams();
  const naviguer = useNavigate();
  const etat = lireUrl(pret ? params : new URLSearchParams());
  const [panneauOuvert, setPanneauOuvert] = useState(false);
  const { contient, basculer, count } = useSelection();

  // replace : les filtres ne remplissent pas l'historique du bouton Retour
  const mettreAJour = (changement) =>
    naviguer(
      { search: ecrireUrl({ ...etat, ...changement }) },
      { replace: true, preventScrollReset: true },
    );

  const basculerFiltre = (cle, valeur) => {
    const actuel = etat[cle];
    mettreAJour({
      [cle]: actuel.includes(valeur) ? actuel.filter((v) => v !== valeur) : [...actuel, valeur],
    });
  };

  const toutEffacer = () =>
    mettreAJour({ cat: TOUTES_CATEGORIES, outil: [], contexte: [], annee: [] });

  // Résultats filtrés puis triés
  const filtres = { cat: etat.cat, outil: etat.outil, contexte: etat.contexte, annee: etat.annee };
  const resultats = etat.cat.length ? trier(filtrer(elements, filtres), etat.tri) : [];
  const de = (categorie) => resultats.filter((e) => e.categorie === categorie);
  const projets = de("projet");
  const expertises = de("expertise");
  const passions = de("passion");

  // Nombre de filtres actifs (bouton « Filtrer (n) » sur mobile)
  const nbFiltresActifs =
    FACETTES_SECONDAIRES.reduce((n, cle) => n + etat[cle].length, 0) +
    (etat.cat.length !== TOUTES_CATEGORIES.length ? etat.cat.length : 0);

  const carte = (element, props) => (
    <CarteProduit
      element={element}
      ajoute={contient(element.ref)}
      onBasculer={() => basculer(element)}
      {...props}
    />
  );

  const casesFiltres = (
    <ListeFiltres etat={etat} filtres={filtres} onBasculer={basculerFiltre} />
  );

  const nbResultats = `${deuxChiffres(resultats.length)} résultat${resultats.length > 1 ? "s" : ""}`;

  return (
    <main id="contenu" className="catalogue">
      {/* En-tête de catégorie */}
      <header className="catalogue__entete conteneur">
        <FilAriane items={FIL_CATALOGUE} />
        <div className="catalogue__entete-ligne">
          <div className="catalogue__intro">
            <h1 className="catalogue__titre">
              Catalogue
              <PointFinal />
            </h1>
            <p className="catalogue__texte">{profil.catalogue.introduction}</p>
          </div>
          <dl className="catalogue__chiffres">
            {Object.entries(categories).map(([cle, c]) => (
              <div key={cle} className="catalogue__chiffre">
                <dt className="label-mono">{c.pluriel}</dt>
                <dd>{deuxChiffres(elementsDe(cle).length)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="catalogue__corps conteneur">
        {/* Colonne de filtres (au-dessus des résultats en tablette, panneau en mobile) */}
        <aside className="catalogue__filtres" aria-labelledby="cat-filtrer">
          <div className="catalogue__filtres-entete">
            <h2 id="cat-filtrer" className="catalogue__filtres-titre">
              Filtrer
            </h2>
            <Bouton variante="lien" taille="s" onClick={toutEffacer}>
              Tout effacer
            </Bouton>
          </div>
          {casesFiltres}
        </aside>

        <div className="catalogue__resultats">
          {/* Barre d'outils : nombre de résultats, tri, affichage */}
          <div className="catalogue__outils">
            <button
              type="button"
              className="catalogue__bouton-filtrer"
              aria-haspopup="dialog"
              onClick={() => setPanneauOuvert(true)}
            >
              <SlidersHorizontal size={18} strokeWidth={1.5} aria-hidden="true" />
              Filtrer ({nbFiltresActifs})
            </button>
            <p className="catalogue__nombre label-mono" role="status">
              {nbResultats}
            </p>
            <div className="catalogue__reglages">
              <SelecteurTri value={etat.tri} onChange={(e) => mettreAJour({ tri: e.target.value })} />
              <div className="catalogue__vues" role="group" aria-label="Affichage">
                <button
                  type="button"
                  className="catalogue__vue"
                  aria-pressed={etat.vue === "grille"}
                  aria-label="Vue grille"
                  onClick={() => mettreAJour({ vue: "grille" })}
                >
                  <LayoutGrid size={20} strokeWidth={1.5} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="catalogue__vue"
                  aria-pressed={etat.vue === "liste"}
                  aria-label="Vue liste"
                  onClick={() => mettreAJour({ vue: "liste" })}
                >
                  <List size={20} strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Projets : vitrine (le premier en grand) */}
          {projets.length > 0 && (
            <GroupeResultats id="cat-projets" titre="Projets" nombre={projets.length}>
              {etat.vue === "liste" ? (
                <ListeLignes elements={projets} carte={carte} />
              ) : (
                <div className="catalogue__vitrine">
                  {projets.map((e, i) => (
                    <div key={e.ref} className={i === 0 ? "catalogue__vedette" : undefined}>
                      {i === 0
                        ? carte(e, { variante: "vitrine", imageRemplie: true })
                        : carte(e, { avecTexte: false })}
                    </div>
                  ))}
                  <Link to="/selection" className="catalogue__encart">
                    <span className="catalogue__encart-etapes">
                      01 Sélection → 02 Coordonnées → 03 Envoi
                    </span>
                    <span className="catalogue__encart-titre">
                      Composez votre sélection, puis parlons-en.
                    </span>
                    <span className="catalogue__encart-cta">
                      Voir ma sélection ({count}) <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                </div>
              )}
            </GroupeResultats>
          )}

          {/* Expertises : liste numérotée */}
          {expertises.length > 0 && (
            <GroupeResultats id="cat-expertises" titre="Expertises" nombre={expertises.length}>
              <ListeLignes elements={expertises} carte={carte} />
            </GroupeResultats>
          )}

          {/* Passions : grille 1:1 */}
          {passions.length > 0 && (
            <GroupeResultats id="cat-passions" titre="Passions" nombre={passions.length}>
              {etat.vue === "liste" ? (
                <ListeLignes elements={passions} carte={carte} />
              ) : (
                <ul className="catalogue__carres">
                  {passions.map((e) => (
                    <li key={e.ref}>{carte(e, { variante: "carre" })}</li>
                  ))}
                </ul>
              )}
            </GroupeResultats>
          )}

          {resultats.length === 0 && (
            <div className="catalogue__vide">
              <p className="catalogue__vide-titre">Aucun résultat avec ces filtres.</p>
              <Bouton variante="contour" taille="s" onClick={toutEffacer}>
                Effacer les filtres
              </Bouton>
            </div>
          )}

          {/* Récemment consultés (rempli par les fiches) */}
          <RecemmentConsultes />
        </div>
      </div>

      {/* Mobile : filtres dans un panneau */}
      <PanneauLateral
        ouvert={panneauOuvert}
        onFermer={() => setPanneauOuvert(false)}
        titre="Filtrer"
        pied={
          <>
            <Bouton variante="secondaire" onClick={() => setPanneauOuvert(false)}>
              Voir {nbResultats}
            </Bouton>
            <Bouton variante="contour" onClick={toutEffacer}>
              Tout effacer
            </Bouton>
          </>
        }
      >
        {panneauOuvert && casesFiltres}
      </PanneauLateral>
    </main>
  );
}

/* ---------- Sous-composants de la page ---------- */

function ListeFiltres({ etat, filtres, onBasculer }) {
  return Object.entries(facettes).map(([cle, facette]) => (
    <GroupeFiltres key={cle} legende={facette.legende}>
      {facette.options.map((o) => (
        <CaseFiltre
          key={o.valeur}
          label={o.label}
          nombre={compterOption(cle, o.valeur, filtres)}
          checked={etat[cle].includes(o.valeur)}
          onChange={() => onBasculer(cle, o.valeur)}
        />
      ))}
    </GroupeFiltres>
  ));
}

function GroupeResultats({ id, titre, nombre, children }) {
  return (
    <section className="catalogue__groupe" aria-labelledby={id}>
      <div className="catalogue__groupe-entete">
        <h2 id={id} className="catalogue__groupe-titre">
          {titre}
        </h2>
        <span className="label-mono">
          {deuxChiffres(nombre)}
          <span className="visuellement-cache"> résultat{nombre > 1 ? "s" : ""}</span>
        </span>
      </div>
      {children}
    </section>
  );
}

function ListeLignes({ elements, carte }) {
  return (
    <ol className="catalogue__lignes">
      {elements.map((e) => (
        <li key={e.ref}>{carte(e, { variante: "ligne" })}</li>
      ))}
    </ol>
  );
}
