import "./Filtres.css";

/**
 * Groupe de filtres à cocher (fieldset + légende), ex. « CATÉGORIE ».
 */
export function GroupeFiltres({ legende, children }) {
  return (
    <fieldset className="filtres-groupe">
      <legend className="filtres-groupe__legende">{legende}</legend>
      <div className="filtres-groupe__options">{children}</div>
    </fieldset>
  );
}

/**
 * Case à cocher de filtre, avec le nombre de résultats associés.
 * Case native (accessible au clavier et aux lecteurs d'écran), teintée Noir Encre.
 * - checked / onChange : état contrôlé par le parent
 * - nombre : résultats pour ce filtre ; 0 → option désactivée
 */
export function CaseFiltre({ label, nombre, checked = false, onChange, disabled, ...reste }) {
  const inactif = disabled ?? nombre === 0;
  return (
    <label className={`case-filtre ${inactif ? "case-filtre--inactif" : ""}`}>
      <input
        type="checkbox"
        className="case-filtre__case"
        checked={checked}
        onChange={onChange}
        disabled={inactif}
        {...reste}
      />
      <span className="case-filtre__label">{label}</span>
      {nombre !== undefined && (
        <span className="case-filtre__nombre">
          {String(nombre).padStart(2, "0")}
          <span className="visuellement-cache"> résultat{nombre > 1 ? "s" : ""}</span>
        </span>
      )}
    </label>
  );
}
