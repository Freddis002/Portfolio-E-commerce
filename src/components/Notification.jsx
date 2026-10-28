import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import "./Notification.css";

/**
 * Notification courte (ex. « ✓ Ajouté à votre sélection »).
 * La zone role="status" est toujours présente dans la page : les lecteurs
 * d'écran annoncent ainsi le message dès qu'il apparaît.
 * - visible / onFermer : état contrôlé par le parent
 * - duree : fermeture automatique en ms (0 = jamais). Le minuteur se met
 *   en pause au survol ou au focus, pour laisser le temps de lire (WCAG 2.2.1).
 * - statique : affichage dans le flux (styleguide) au lieu d'en bas à droite
 */
export default function Notification({
  visible,
  onFermer,
  titre,
  meta,
  texte,
  actions,
  duree = 4000,
  statique = false,
}) {
  const [enPause, setEnPause] = useState(false);
  const minuteur = useRef(null);

  useEffect(() => {
    if (!visible || !duree || enPause) return;
    minuteur.current = setTimeout(() => onFermer?.(), duree);
    return () => clearTimeout(minuteur.current);
  }, [visible, duree, enPause, onFermer]);

  return (
    <div role="status" className={`notification-zone ${statique ? "notification-zone--statique" : ""}`}>
      {visible && (
        <div
          className="notification"
          onMouseEnter={() => setEnPause(true)}
          onMouseLeave={() => setEnPause(false)}
          onFocus={() => setEnPause(true)}
          onBlur={() => setEnPause(false)}
        >
          <div className="notification__entete">
            <p className="notification__titre">{titre}</p>
            {meta && <span className="notification__meta">{meta}</span>}
            {onFermer && (
              <button type="button" className="notification__fermer" onClick={onFermer} aria-label="Fermer la notification">
                <X size={20} strokeWidth={1.5} aria-hidden="true" />
              </button>
            )}
          </div>
          {texte && <p className="notification__texte">{texte}</p>}
          {actions && <div className="notification__actions">{actions}</div>}
        </div>
      )}
    </div>
  );
}
