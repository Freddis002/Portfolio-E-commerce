import { useId } from "react";
import ImageEmplacement from "./ImageEmplacement";
import PointFinal from "./PointFinal";
import "./Banniere.css";

/**
 * Bannière de campagne (hero de l'accueil) : surtitre, grand titre, sous-titre,
 * texte, actions, et un visuel portrait 4:5.
 * - titre : texte du titre ; le point orange est ajouté automatiquement
 * - niveau : 1 sur l'accueil (le titre de la bannière EST le H1 de la page)
 * - actions : boutons (un seul primaire orange)
 * - reference : petite étiquette sur le visuel, ex. « Réf. NP-2026 »
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
}) {
  const Titre = `h${niveau}`;
  const titreId = useId();
  return (
    <section className="banniere conteneur" aria-labelledby={titreId}>
      <div className="banniere__texte">
        {surtitre && <span className="banniere__surtitre">{surtitre}</span>}
        <Titre id={titreId} className="banniere__titre">
          {titre}
          <PointFinal />
        </Titre>
        {sousTitre && <p className="banniere__sous-titre">{sousTitre}</p>}
        {texte && <p className="banniere__corps">{texte}</p>}
        {actions && <div className="banniere__actions">{actions}</div>}
      </div>
      <div className="banniere__visuel">
        <ImageEmplacement type={visuel} ratio="4:5">
          {reference && <span className="banniere__reference">{reference}</span>}
        </ImageEmplacement>
      </div>
    </section>
  );
}
