import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import "./PanneauLateral.css";

/**
 * Panneau latéral (mini-panier), construit sur l'élément natif <dialog> :
 * le navigateur gère le piège du focus, la touche Échap, l'arrière-plan
 * inactif et le retour du focus au bouton qui l'a ouvert.
 * - ouvert / onFermer : état contrôlé par le parent
 * - titre : titre du panneau ; pied : zone d'actions en bas (boutons)
 */
export default function PanneauLateral({ ouvert, onFermer, titre, pied, children }) {
  const ref = useRef(null);
  const titreId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (ouvert && !dialog.open) dialog.showModal();
    if (!ouvert && dialog.open) dialog.close();
  }, [ouvert]);

  // Clic sur le voile (en dehors du panneau) : fermeture
  const surClic = (e) => {
    if (e.target === ref.current) onFermer?.();
  };

  return (
    <dialog
      ref={ref}
      className="panneau"
      aria-labelledby={titreId}
      onClose={onFermer}
      onClick={surClic}
    >
      <div className="panneau__contenu">
        <div className="panneau__entete">
          <h2 id={titreId} className="panneau__titre">
            {titre}
          </h2>
          <button type="button" className="panneau__fermer" onClick={onFermer} aria-label="Fermer le panneau">
            <X size={24} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
        <div className="panneau__corps">{children}</div>
        {pied && <div className="panneau__pied">{pied}</div>}
      </div>
    </dialog>
  );
}
