import { useId } from "react";
import ImageEmplacement from "./ImageEmplacement";
import Photo from "./Photo";
import PointFinal from "./PointFinal";
import "./Banniere.css";

/**
 * Bannière de campagne (hero de l'accueil) : surtitre, grand titre, sous-titre,
 * texte, actions, et un visuel portrait 4:5 (accueil, À propos).
 * - titre : texte du titre ; le point orange est ajouté automatiquement
 * - majuscules : true pour afficher le titre en capitales (le texte HTML reste tel quel)
 * - niveau : 1 sur l'accueil (le titre de la bannière EST le H1 de la page)
 * - actions : boutons (un seul primaire orange)
 * - reference : petite étiquette sur le visuel, ex. « Réf. DF-2026 »
 * - image (facultatif) : { src, alt, largeur, hauteur }, photo produite par
 *   « npm run photos » (src sans extension). Elle remplit le cadre 4:5 et se
 *   charge en priorité (haut de page). Sans image : emplacement hachuré « visuel ».
 *   Ex. image={PORTRAIT} (src/lib/seo.js : personnage 3D)
 */
export default function Banniere({
  surtitre,
  titre,
  niveau = 1,
  sousTitre,
  texte,
  actions,
  visuel = "Portrait",
  reference,
  image,
  majuscules = false,
}) {
  const Titre = `h${niveau}`;
  const titreId = useId();
  return (
    <section className="banniere conteneur" aria-labelledby={titreId}>
      <div className="banniere__texte">
        {surtitre && <span className="banniere__surtitre">{surtitre}</span>}
        <Titre id={titreId} className={`banniere__titre ${majuscules ? "banniere__titre--majuscules" : ""}`}>
          {titre}
          <PointFinal />
        </Titre>
        {sousTitre && <p className="banniere__sous-titre">{sousTitre}</p>}
        {texte && <p className="banniere__corps">{texte}</p>}
        {actions && <div className="banniere__actions">{actions}</div>}
      </div>
      <div className="banniere__visuel">
        {image ? (
          <div className="banniere__cadre">
            <Photo
              src={image.src}
              alt={image.alt}
              largeur={image.largeur}
              hauteur={image.hauteur}
              prioritaire
              remplir
              className="banniere__photo"
            />
            {reference && <span className="banniere__reference">{reference}</span>}
          </div>
        ) : (
          <ImageEmplacement type={visuel} ratio="4:5">
            {reference && <span className="banniere__reference">{reference}</span>}
          </ImageEmplacement>
        )}
      </div>
    </section>
  );
}
