import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import "./PanneauLateral.css";

const FOCALISABLES = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Panneau latéral (mini-panier, filtres mobiles), construit sur l'élément
 * natif <dialog> : le navigateur gère la touche Échap, l'arrière-plan
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

  /*
   * Piège du focus strict : <dialog> laisserait Tab sortir vers la barre
   * d'adresse du navigateur après le dernier bouton. Ici, Tab sur le dernier
   * élément revient au premier, et Maj+Tab sur le premier va au dernier.
   */
  const surTouche = (e) => {
    if (e.key !== "Tab") return;
    const liste = [...ref.current.querySelectorAll(FOCALISABLES)];
    if (liste.length === 0) return;
    const premier = liste[0];
    const dernier = liste[liste.length - 1];
    if (e.shiftKey && document.activeElement === premier) {
      e.preventDefault();
      dernier.focus();
    } else if (!e.shiftKey && document.activeElement === dernier) {
      e.preventDefault();
      premier.focus();
    }
  };

  return (
    <dialog
      ref={ref}
      className="panneau"
      aria-labelledby={titreId}
      onClose={onFermer}
      onClick={surClic}
      onKeyDown={surTouche}
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
