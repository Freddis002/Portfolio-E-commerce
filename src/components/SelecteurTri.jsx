import { useId } from "react";
import { ChevronDown } from "lucide-react";
import "./SelecteurTri.css";

const OPTIONS_DEFAUT = [
  { valeur: "pertinence", label: "Pertinence" },
  { valeur: "recents", label: "Plus récents" },
  { valeur: "demandes", label: "Plus demandés" },
];

/**
 * Sélecteur de tri (liste déroulante native, donc accessible au clavier).
 * - value / onChange : valeur contrôlée par le parent
 */
export default function SelecteurTri({ value, onChange, options = OPTIONS_DEFAUT, ...reste }) {
  const id = useId();
  return (
    <div className="tri">
      <label htmlFor={id} className="tri__label">
        Trier par
      </label>
      <div className="tri__champ">
        <select id={id} className="tri__select" value={value} onChange={onChange} {...reste}>
          {options.map((o) => (
            <option key={o.valeur} value={o.valeur}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown size={20} strokeWidth={1.5} aria-hidden="true" className="tri__icone" />
      </div>
    </div>
  );
}
