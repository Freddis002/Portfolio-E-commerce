import { Link } from "react-router";
import { CalendarDays, FileDown, MapPin, Route } from "lucide-react";
import profil from "../data/profil.json";
import { categories, deuxChiffres, elements, elementsDe, trier } from "../data/catalogue";
import { useSelection } from "../lib/selection";
import { metaPage } from "../lib/seo";
import Banniere from "../components/Banniere";
import BandeReassurance from "../components/BandeReassurance";
import Bouton from "../components/Bouton";
import CarteProduit from "../components/CarteProduit";
import EnteteSection from "../components/EnteteSection";
import ImageEmplacement from "../components/ImageEmplacement";
import PointFinal from "../components/PointFinal";
import TuileCategorie from "../components/TuileCategorie";
import "./accueil.css";

const nomComplet = `${profil.nom} ${profil.prenom}`;

export function meta() {
  return metaPage({
    titre: `${nomComplet} · Chargé e-commerce et marketing digital à ${profil.ville} (${profil.region})`,
    description: `Portfolio de ${nomComplet}, basé à ${profil.ville} : projets e-commerce, SEO et marketing digital. Ouvert à un CDI en ${profil.region}.`,
    chemin: "/",
  });
}

// Icônes de la bande de réassurance, désignées par un nom dans profil.json
const ICONES = { lieu: MapPin, mobilite: Route, disponibilite: CalendarDays, cv: FileDown };

// Sélections calculées une fois, à partir des données
const nouveautes = elements.filter((e) => e.badges?.nouveau);
const plusDemandees = trier(elementsDe("expertise"), "demandes");
const [projetVedette, ...autresProjets] = trier(elementsDe("projet"), "pertinence");
const passions = elementsDe("passion");

export default function Accueil() {
  const { contient, basculer, count } = useSelection();
  const carte = (element, props) => (
    <CarteProduit
      element={element}
      ajoute={contient(element.ref)}
      onBasculer={() => basculer(element)}
      {...props}
    />
  );
  const { accueil } = profil;

  return (
    <main id="contenu" className="accueil">
      {/* 1. Bannière de campagne (la barre d'annonce est dans le header) */}
      <Banniere
        surtitre={accueil.surtitre}
        titre={
          <>
            {profil.nom}{" "}
            <br />
            {profil.prenom}
          </>
        }
        sousTitre={profil.postes.join(" · ")}
        texte={accueil.accroche}
        reference={accueil.referenceVisuel}
        visuel="Portrait"
        actions={
          <>
            <Bouton to="/catalogue?cat=projets">
              Voir mes projets <span aria-hidden="true">→</span>
            </Bouton>
            <Bouton variante="contour" href="/cv.pdf">
              Télécharger le CV (PDF)
            </Bouton>
          </>
        }
      />

      {/* 2. Réassurance */}
      <BandeReassurance
        items={accueil.reassurance.map((r) => ({ ...r, icone: ICONES[r.icone] }))}
      />

      {/* 3. Catégories */}
      <section className="accueil__section conteneur" aria-labelledby="acc-categories">
        <EnteteSection
          id="acc-categories"
          titre="Explorer par catégorie"
          aside={<span className="label-mono">{elements.length} éléments</span>}
        />
        <div className="accueil__tuiles">
          {Object.entries(categories).map(([cle, c]) => (
            <TuileCategorie
              key={cle}
              titre={c.pluriel}
              code={c.code}
              nombre={elementsDe(cle).length}
              to={`/catalogue?cat=${c.chemin}`}
            />
          ))}
        </div>
      </section>

      {/* 4. Nouveautés */}
      <section className="accueil__section" aria-labelledby="acc-nouveautes">
        <div className="conteneur">
          <EnteteSection
            id="acc-nouveautes"
            titre="Nouveautés"
            aside={
              <Link to="/catalogue?tri=recents">
                Tout voir <span aria-hidden="true">→</span>
              </Link>
            }
          />
        </div>
        {/* Grille en desktop, rail défilant horizontalement sur mobile */}
        <ul className="accueil__nouveautes conteneur">
          {nouveautes.map((e) => (
            <li key={e.ref}>{carte(e, { avecPastilles: false })}</li>
          ))}
        </ul>
      </section>

      {/* 5. Les plus demandées */}
      <section className="accueil__sombre" aria-labelledby="acc-demandees">
        <div className="conteneur">
          <EnteteSection
            id="acc-demandees"
            sombre
            surtitre="Expertises · Sélection du moment"
            titre="Les plus demandées"
            aside={
              <Link to="/catalogue?cat=expertises&tri=demandes">
                Toutes les expertises <span aria-hidden="true">→</span>
              </Link>
            }
          />
          <ol className="accueil__classement">
            {plusDemandees.map((e, i) => (
              <li key={e.ref}>{carte(e, { variante: "ligne", sombre: true, rang: i + 1 })}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6. Projets à la une */}
      <section className="accueil__section conteneur" aria-labelledby="acc-projets">
        <EnteteSection
          id="acc-projets"
          titre="Projets à la une"
          aside={
            <Link to="/catalogue?cat=projets">
              Tous les projets ({deuxChiffres(elementsDe("projet").length)}){" "}
              <span aria-hidden="true">→</span>
            </Link>
          }
        />
        <div className="accueil__projets">
          <div className="accueil__vedette">{carte(projetVedette, { variante: "vitrine" })}</div>
          <ul className="accueil__autres-projets">
            {autresProjets.map((e) => (
              <li key={e.ref}>{carte(e, { variante: "mini" })}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. Bannières secondaires */}
      <section className="accueil__section accueil__decouvrir conteneur" aria-label="À découvrir">
        <Link to="/catalogue?cat=passions" className="promo promo--passions">
          <div className="promo__texte">
            <div className="promo__textes">
              <span className="label-mono">
                {passions[0].ref} → {passions.at(-1).ref} · Passions
              </span>
              <h2 className="promo__titre">{accueil.passions.titre}</h2>
              <p className="promo__corps">
                {passions.map((p) => p.titre).join(", ")}. {accueil.passions.texte}
              </p>
            </div>
            <span className="promo__cta">
              Découvrir les passions <span aria-hidden="true">→</span>
            </span>
          </div>
          <div className="promo__mosaique" aria-hidden="true">
            {passions.map((p) => (
              <ImageEmplacement key={p.ref} type="Photo" ratio="1:1" decoratif />
            ))}
          </div>
        </Link>

        <Link to="/a-propos" className="promo promo--a-propos">
          <div className="promo__textes">
            <span className="label-mono">À propos · Parcours</span>
            <h2 className="promo__titre">{accueil.aPropos.titre}</h2>
            <p className="promo__corps">{accueil.aPropos.texte}</p>
          </div>
          <span className="promo__cta">
            Voir mon parcours <span aria-hidden="true">→</span>
          </span>
        </Link>
      </section>

      {/* 8. Contact */}
      <section className="accueil__contact conteneur" aria-labelledby="acc-contact">
        <div className="accueil__contact-textes">
          <span className="label-mono">
            Votre sélection : {count} élément{count > 1 ? "s" : ""}
          </span>
          <h2 id="acc-contact" className="accueil__contact-titre">
            Un projet ? Parlons-en
            <PointFinal />
          </h2>
        </div>
        <Bouton variante="secondaire" to="/contact">
          Me contacter <span aria-hidden="true">→</span>
        </Bouton>
      </section>
    </main>
  );
}
