import { useDernierAjout, useSelection } from "../lib/selection";
import Bouton from "./Bouton";
import Notification from "./Notification";

/**
 * Notification affichée après chaque ajout à « Ma sélection » (placée dans root.jsx).
 */
export default function NotificationSelection() {
  const { element, fermer } = useDernierAjout();
  const { count } = useSelection();

  return (
    <Notification
      visible={element !== null}
      onFermer={fermer}
      titre="✓ Ajouté à votre sélection"
      meta={`${count} élément${count > 1 ? "s" : ""}`}
      texte={element?.titre}
      actions={
        <>
          <Bouton variante="contour" taille="s" onClick={fermer}>
            Continuer
          </Bouton>
          <Bouton variante="secondaire" taille="s" to="/selection" onClick={fermer}>
            Voir ma sélection <span aria-hidden="true">→</span>
          </Bouton>
        </>
      }
    />
  );
}
