import { Link } from "react-router";
import profil from "../data/profil.json";
import { PORTRAIT } from "../lib/seo";
import Photo from "./Photo";
import PointFinal from "./PointFinal";
import "./BoiteAPropos.css";

/*
 * Bloc À propos de l'accueil : le candidat présenté comme un produit, dans une
 * boîte en CSS 3D (face avant = personnage, tranche = ville, dessus = collection).
 * Maquettes : docs/maquettes/source/AccueilDecouvrir(.Mobile).dc.html
 *
 * Tout le bloc est UN seul lien vers /a-propos : le « bouton » du bas est un
 * simple <span> (un lien ne peut pas contenir un autre lien ou un bouton).
 * Mobile (< 768 px) : carte compacte, personnage en vignette, sans 3D.
 * - titre, texte : textes du bloc (le titre reçoit le point orange)
 */
export default function BoiteAPropos({ titre, texte }) {
  const { accueil } = profil;
  // « Collection 2026 · Basé à Arras » → « Collection 2026 »
  const collection = accueil.surtitre.split(" · ")[0];

  return (
    <Link to="/a-propos" className="boite-a-propos">
      <span className="boite-a-propos__scene">
        <span className="boite-a-propos__boite">
          {/* Face avant : le personnage (seul visuel lu par les lecteurs d'écran) */}
          <span className="boite-a-propos__face boite-a-propos__face--avant">
            <Photo
              src={PORTRAIT.src}
              alt={PORTRAIT.alt}
              largeur={PORTRAIT.largeur}
              hauteur={PORTRAIT.hauteur}
              remplir
              className="boite-a-propos__portrait"
            />
            <span className="boite-a-propos__reference" aria-hidden="true">
              {accueil.referenceVisuel}
            </span>
            <span className="boite-a-propos__nom" aria-hidden="true">
              {profil.nom}
              <br />
              {profil.prenom}
              <PointFinal />
            </span>
          </span>
          <span className="boite-a-propos__face boite-a-propos__face--tranche" aria-hidden="true">
            <span>
              {profil.ville} · {profil.region}
            </span>
          </span>
          <span className="boite-a-propos__face boite-a-propos__face--dessus" aria-hidden="true">
            {collection}
          </span>
        </span>
      </span>

      <span className="boite-a-propos__textes">
        <span className="boite-a-propos__label label-mono">À propos · Parcours</span>
        <h2 className="boite-a-propos__titre">
          {titre}
          <PointFinal />
        </h2>
        <span className="boite-a-propos__texte">{texte}</span>
      </span>

      <span className="boite-a-propos__cta">
        Voir mon parcours <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
