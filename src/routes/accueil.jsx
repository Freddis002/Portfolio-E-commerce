import { Link } from "react-router";
import { CalendarDays, FileDown, MapPin, Route } from "lucide-react";
import profil from "../data/profil.json";
import aPropos from "../data/a-propos.json";
import { categories, deuxChiffres, elements, elementsDe, trier } from "../data/catalogue";
import { useSelection } from "../lib/selection";
import { PORTRAIT, ldPersonne, ldSiteWeb, metaPage } from "../lib/seo";
import Banniere from "../components/Banniere";
import BandeReassurance from "../components/BandeReassurance";
import BoiteAPropos from "../components/BoiteAPropos";
import Bouton from "../components/Bouton";
import CarteProduit from "../components/CarteProduit";
import EnteteSection from "../components/EnteteSection";
import EventailPassions from "../components/EventailPassions";
import PointFinal from "../components/PointFinal";
import TuileCategorie from "../components/TuileCategorie";
import IllustrationExpertises from "../components/illustrations/IllustrationExpertises";
import IllustrationPassions from "../components/illustrations/IllustrationPassions";
import IllustrationProjets from "../components/illustrations/IllustrationProjets";
import "./accueil.css";

// Illustration de chaque tuile « Explorer par catégorie »
const ILLUSTRATIONS = {
  projet: IllustrationProjets,
  expertise: IllustrationExpertises,
  passion: IllustrationPassions,
};

const nomComplet = `${profil.nom} ${profil.prenom}`;

export function meta() {
  return metaPage({
    titre: `${nomComplet} — Chargé e-commerce & marketing à ${profil.ville}`,
    description: `Portfolio de ${nomComplet}, basé à ${profil.ville} : projets e-commerce, SEO et marketing digital. Ouvert à un CDI en ${profil.region}.`,
    chemin: "/",
    // La personne et le site, décrits pour Google et les moteurs d'IA
    jsonLd: [ldSiteWeb(), ldPersonne()],
  });
}

// Icônes de la bande de réassurance, désignées par un nom dans profil.json
const ICONES = { lieu: MapPin, mobilite: Route, disponibilite: CalendarDays, cv: FileDown };

// Sélections calculées une fois, à partir des données
const nouveautes = elements.filter((e) => e.badges?.nouveau);
const plusDemandees = trier(elementsDe("expertise"), "demandes");
const [projetVedette, ...autresProjets] = trier(elementsDe("projet"), "pertinence");
// Carte À propos : bilan du parcours, compté depuis src/data/a-propos.json
const nbEtapes = (type) => aPropos.parcours.filter((e) => e.type === type).length;
// (espaces insécables \u00a0 : le chiffre ne reste jamais seul en fin de ligne)
const bilanParcours = `${nbEtapes("experience")}\u00a0expériences, ${nbEtapes("formation")}\u00a0formations`;

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
        image={PORTRAIT}
        majuscules
        actions={
          <>
            <Bouton to="/catalogue?cat=projets">
              Voir mes projets <span aria-hidden="true">→</span>
            </Bouton>
            <Bouton variante="contour" href={profil.cv.href} download={profil.cv.nomFichier}>
              Télécharger le CV (PDF)
            </Bouton>
          </>
        }
      />

      {/* 2. Réassurance */}
      <BandeReassurance
        items={accueil.reassurance.map((r) => ({
          ...r,
          icone: ICONES[r.icone],
          // Lien vers le CV : enregistré sous son nom lisible
          ...(r.href === profil.cv.href && { nomFichier: profil.cv.nomFichier }),
        }))}
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
              illustration={ILLUSTRATIONS[cle]}
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
            intro="Mes projets et expertises les plus récents, en e-commerce et marketing digital, depuis Arras."
            aside={
              <Link to="/catalogue?tri=recents">
                Tout voir <span aria-hidden="true">→</span>
              </Link>
            }
          />
        </div>
        {/* 4 colonnes en desktop, 2 en tablette ; en mobile, 2 cartes empilées
            (les suivantes restent dans le HTML, masquées en CSS) + lien vers toutes */}
        <div className="conteneur">
          <ul className="accueil__nouveautes">
            {nouveautes.map((e) => (
              <li key={e.ref}>{carte(e, { avecPastilles: false })}</li>
            ))}
          </ul>
          <Link to="/catalogue?tri=recents" className="accueil__nouveautes-tout">
            Voir toutes les nouveautés
            <span className="accueil__nouveautes-nombre" aria-hidden="true">
              {deuxChiffres(nouveautes.length)} →
            </span>
            <span className="visuellement-cache">
              {" "}
              ({nouveautes.length} éléments)
            </span>
          </Link>
        </div>
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

      {/* 7. À découvrir : passions en éventail + À propos en boîte 3D */}
      <section className="accueil__section accueil__decouvrir conteneur" aria-label="À découvrir">
        <EventailPassions />
        <BoiteAPropos titre={bilanParcours} texte={accueil.aPropos.texte} />
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
