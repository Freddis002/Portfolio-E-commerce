import Bouton from "./Bouton";
import "./BarreSelection.css";

/**
 * Barre collée en bas de l'écran sur mobile (< 600 px) : rappel de la
 * sélection et accès direct à « Ma sélection ». Masquée au-delà.
 */
export default function BarreSelection({ count }) {
  const pluriel = count > 1 ? "s" : "";
  return (
    <div className="barre-selection">
      <p className="barre-selection__texte">
        {count} élément{pluriel} sélectionné{pluriel}
      </p>
      <Bouton variante="secondaire" taille="s" to="/selection">
        Ma sélection ({count}) <span aria-hidden="true">→</span>
      </Bouton>
    </div>
  );
}
