import { useSelection } from "../lib/selection";
import BoutonAjout from "./BoutonAjout";
import "./BarreAjoutMobile.css";

/**
 * Bouton « Ajouter à ma sélection » collé en bas de l'écran sur les fiches,
 * sur mobile uniquement (en desktop, le bouton est dans le bloc « En bref »).
 */
export default function BarreAjoutMobile({ element }) {
  const { contient, basculer } = useSelection();
  return (
    <div className="barre-ajout">
      <BoutonAjout
        taille="l"
        ajoute={contient(element.ref)}
        onClick={() => basculer(element)}
        titre={element.titre}
      />
      <p className="barre-ajout__note">Aucune inscription · gardé sur cet appareil</p>
    </div>
  );
}
