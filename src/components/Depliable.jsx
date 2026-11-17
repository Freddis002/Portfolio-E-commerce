import { useEstMobile } from "../lib/fiche";
import "./Depliable.css";

/**
 * Section de fiche : bloc toujours ouvert en desktop, dépliable sur mobile.
 * Sur mobile, on utilise <details>/<summary>, l'élément natif du navigateur :
 * clavier (Entrée, Espace) et lecteurs d'écran gérés sans JavaScript.
 * Le HTML pré-rendu contient la version ouverte : tout le texte reste
 * lisible par Google, même replié à l'écran.
 * - numero : « 01 » ; titre : intitulé ; niveau : niveau du titre (3 par défaut)
 * - ouvert : déplié par défaut sur mobile (la première section)
 */
export default function Depliable({ numero, titre, niveau = 3, ouvert = false, className = "", children }) {
  const mobile = useEstMobile();
  const Titre = `h${niveau}`;
  // Un seul titre dans l'en-tête (règle HTML de <summary>), numéro inclus
  const entete = (
    <Titre className="depliable__titre">
      {numero && <span className="depliable__numero">{numero}</span>}
      <span className="depliable__intitule">{titre}</span>
    </Titre>
  );

  if (mobile) {
    return (
      <details className={`depliable depliable--mobile ${className}`} open={ouvert}>
        <summary className="depliable__entete">{entete}</summary>
        <div className="depliable__contenu">{children}</div>
      </details>
    );
  }

  return (
    <div className={`depliable ${className}`}>
      <div className="depliable__entete">{entete}</div>
      <div className="depliable__contenu">{children}</div>
    </div>
  );
}
