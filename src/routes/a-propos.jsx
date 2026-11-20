import { useState } from "react";
import { Link } from "react-router";
import profil from "../data/profil.json";
import aPropos from "../data/a-propos.json";
import { elementsDe, trouverParRef, urlElement } from "../data/catalogue";
import { PORTRAIT, ldPageProfil, metaPage } from "../lib/seo";
import Banniere from "../components/Banniere";
import Bouton from "../components/Bouton";
import EnteteSection from "../components/EnteteSection";
import { CaseFiltre, GroupeFiltres } from "../components/Filtres";
import "../components/Etiquettes.css";
import "./a-propos.css";

export function meta() {
  return metaPage({
    titre: `À propos · ${profil.nom} ${profil.prenom}, e-commerce à ${profil.ville}`,
    description: `Parcours, valeurs et CV de ${profil.nom} ${profil.prenom}, basé à ${profil.ville}, mobile en ${profil.region}. Ouvert à un CDI en e-commerce et marketing.`,
    chemin: "/a-propos",
    type: "profile",
    // Page de profil : la personne en est le sujet principal
    jsonLd: [ldPageProfil("/a-propos")],
  });
}

const TYPES = { experience: "Expérience", formation: "Formation" };

// Filtres du parcours : libellé au pluriel et nombre d'étapes, calculé depuis les données
const FILTRES = [
  { type: "experience", label: "Expériences" },
  { type: "formation", label: "Formations" },
].map((f) => ({ ...f, nombre: aPropos.parcours.filter((e) => e.type === f.type).length }));

export default function APropos() {
  // Types affichés : tout est coché au départ (les 9 étapes sont dans le HTML pré-rendu)
  const [affiches, setAffiches] = useState({ experience: true, formation: true });
  const etapes = aPropos.parcours.filter((e) => affiches[e.type]);
  const basculer = (type) => setAffiches((a) => ({ ...a, [type]: !a[type] }));

  return (
    <main id="contenu" className="a-propos">
      <Banniere
        surtitre={aPropos.surtitre}
        titre={aPropos.accroche}
        texte={aPropos.presentation}
        image={PORTRAIT}
        actions={
          <>
            <Bouton href={profil.cv.href} download={profil.cv.nomFichier}>
              Télécharger le CV (PDF) <span aria-hidden="true">↓</span>
            </Bouton>
            <Bouton variante="contour" to="/catalogue?cat=projets">
              Voir mes projets <span aria-hidden="true">→</span>
            </Bouton>
          </>
        }
      />

      {/* Infos pratiques : localisation, mobilité, contrat, disponibilité */}
      <section className="a-propos__infos" aria-label="En bref">
        <dl className="a-propos__infos-liste conteneur">
          {aPropos.infos.map((info) => (
            <div key={info.label} className="a-propos__info">
              <dt className="label-mono">{info.label}</dt>
              <dd>{info.valeur}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Parcours en timeline */}
      <section className="a-propos__section conteneur" aria-labelledby="a-propos-parcours">
        <EnteteSection id="a-propos-parcours" titre="Parcours" />

        {/* Filtres à cocher (mêmes composants que le catalogue) */}
        <div className="parcours__filtres">
          <GroupeFiltres legende="Afficher">
            {FILTRES.map((f) => (
              <CaseFiltre
                key={f.type}
                label={f.label}
                nombre={f.nombre}
                checked={affiches[f.type]}
                onChange={() => basculer(f.type)}
                aria-controls="parcours-liste"
              />
            ))}
          </GroupeFiltres>
          {/* Annonce du résultat aux lecteurs d'écran à chaque changement */}
          <p className="visuellement-cache" role="status">
            {etapes.length} étape{etapes.length > 1 ? "s" : ""} affichée{etapes.length > 1 ? "s" : ""}
          </p>
        </div>

        {etapes.length === 0 && (
          <p className="parcours__vide">Aucune étape affichée : cochez Expériences ou Formations.</p>
        )}
        <ol id="parcours-liste" className="parcours">
          {etapes.map((etape) => (
            <li key={`${etape.periode}-${etape.intitule}-${etape.structure}`} className="parcours__etape">
              <p className="parcours__periode label-mono">{etape.periode}</p>
              <p className="parcours__type">
                <span className="pastille">{TYPES[etape.type]}</span>
              </p>
              <div className="parcours__texte">
                <h3 className="parcours__titre">
                  {etape.intitule} · {etape.structure}, {etape.ville}
                </h3>
                {etape.texte && <p>{etape.texte}</p>}
                {/* Missions (facultatif) : liste à puces, comme sur un CV */}
                {etape.missions && (
                  <ul className="parcours__missions">
                    {etape.missions.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                )}
                <LienProjet reference={etape.ref} />
              </div>
            </li>
          ))}
        </ol>

        <div className="a-propos__expertises">
          <h3 className="a-propos__expertises-titre label-mono">Mes expertises</h3>
          <ul className="a-propos__expertises-liste">
            {elementsDe("expertise").map((e) => (
              <li key={e.ref}>
                <Link to={urlElement(e)} className="pastille-lien">
                  {e.ref} · {e.titre}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="a-propos__expertises">
          <h3 id="a-propos-outils" className="a-propos__expertises-titre label-mono">
            Ma boîte à outils
          </h3>
          {/* Même style que les outils des cartes projet (pastilles contour) */}
          <ul className="pastilles" aria-labelledby="a-propos-outils">
            {aPropos.outils.map((outil) => (
              <li key={outil} className="pastille">
                {outil}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Ce qui me guide : 3 valeurs */}
      <section className="a-propos__valeurs" aria-labelledby="a-propos-valeurs">
        <div className="conteneur">
          <EnteteSection id="a-propos-valeurs" titre="Ce qui me guide" />
          <ul className="valeurs">
            {aPropos.valeurs.map((v) => (
              <li key={v.titre} className="valeurs__item">
                <h3 className="valeurs__titre">{v.titre}</h3>
                <p>{v.texte}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Bandeau final */}
      <section className="a-propos__echange conteneur" aria-labelledby="a-propos-echange">
        <h2 id="a-propos-echange" className="a-propos__echange-titre">
          Envie d'échanger ?
        </h2>
        <Bouton variante="secondaire" to="/contact">
          Me contacter <span aria-hidden="true">→</span>
        </Bouton>
      </section>
    </main>
  );
}

// Lien vers la fiche du catalogue liée à une étape (ex. ref "P-03")
function LienProjet({ reference }) {
  const element = reference && trouverParRef(reference);
  if (!element) return null;
  return (
    <Link to={urlElement(element)} className="parcours__lien">
      Voir le projet {element.ref}
      <span className="visuellement-cache"> : {element.titre}</span> <span aria-hidden="true">→</span>
    </Link>
  );
}
