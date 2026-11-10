import { useRetoursSelection } from "../lib/selection";

/**
 * Zone invisible lue par les lecteurs d'écran à chaque ajout ou retrait :
 * « Mon Kit Solaire ajouté à votre sélection, 3 éléments ».
 * Elle est toujours présente dans la page (sinon la première annonce serait perdue).
 */
export default function AnnonceSelection() {
  const { annonce } = useRetoursSelection();
  return (
    <p className="visuellement-cache" aria-live="polite" aria-atomic="true">
      {annonce}
    </p>
  );
}
