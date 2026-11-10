import { Link } from "react-router";
import profil from "../data/profil.json";
import aPropos from "../data/a-propos.json";
import { elementsDe, urlElement } from "../data/catalogue";
import { metaPage } from "../lib/seo";
import Banniere from "../components/Banniere";
import Bouton from "../components/Bouton";
import EnteteSection from "../components/EnteteSection";
import "../components/Etiquettes.css";
import "./a-propos.css";

export function meta() {
  return metaPage({
    titre: `À propos · ${profil.nom} ${profil.prenom}, chargé e-commerce et marketing à ${profil.ville}`,
    description: `Parcours, valeurs et CV de ${profil.nom} ${profil.prenom}, basé à ${profil.ville} et mobile en ${profil.region}. Ouvert à un CDI : e-commerce, marketing & communication, chef de projet digital.`,
    chemin: "/a-propos",
  });
}

const TYPES = { experience: "Expérience", formation: "Formation" };

export default function APropos() {
  return (
    <main id="contenu" className="a-propos">
      <Banniere
        surtitre={aPropos.surtitre}
        titre={aPropos.accroche}
        texte={aPropos.presentation}
        visuel="Portrait"
        actions={
          <>
            {/* Fichier public/cv.pdf : version provisoire en attendant le vrai CV */}
            <Bouton href="/cv.pdf" download>
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
        <ol className="parcours">
          {aPropos.parcours.map((etape, i) => (
            <li key={i} className="parcours__etape">
              <p className="parcours__periode label-mono">{etape.periode}</p>
              <p className="parcours__type">
                <span className="pastille">{TYPES[etape.type]}</span>
              </p>
              <div className="parcours__texte">
                <h3 className="parcours__titre">
                  {etape.intitule} · {etape.structure}, {etape.ville}
                </h3>
                <p>{etape.texte}</p>
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
