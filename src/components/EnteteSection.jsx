import "./EnteteSection.css";

/**
 * En-tête de section : titre H2 souligné d'un filet, avec à droite
 * un lien (« Tout voir → ») ou un compteur.
 * - id : relie la section à son titre (aria-labelledby)
 * - surtitre : petit label mono orange au-dessus du titre
 * - aside : contenu à droite (lien, label)
 * - sombre : version sur fond Noir Encre
 */
export default function EnteteSection({ id, titre, surtitre, aside, sombre = false }) {
  return (
    <div className={`entete-section ${sombre ? "entete-section--sombre" : ""}`}>
      <div className="entete-section__titres">
        {surtitre && <span className="entete-section__surtitre">{surtitre}</span>}
        <h2 id={id} className="entete-section__titre">
          {titre}
        </h2>
      </div>
      {aside && <div className="entete-section__aside">{aside}</div>}
    </div>
  );
}
