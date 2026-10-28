import { useId } from "react";
import { Check, X } from "lucide-react";
import "./Champ.css";

/**
 * Champ de formulaire avec libellé, aide et message d'état.
 * États : repos, focus (natif), erreur (« erreur » = texte du message),
 * validé (« valide » = texte du message), désactivé.
 * - multiligne : true pour un <textarea>
 * - requis : ajoute « * » au libellé et l'attribut required
 * Le message d'erreur est relié au champ (aria-describedby) et commence
 * par une icône ET un texte : l'état ne repose jamais sur la couleur seule.
 */
export default function Champ({
  label,
  id,
  type = "text",
  multiligne = false,
  requis = false,
  aide,
  erreur,
  valide,
  className = "",
  ...reste
}) {
  const idAuto = useId();
  const idChamp = id ?? idAuto;
  const idAide = `${idChamp}-aide`;
  const idMessage = `${idChamp}-message`;
  const etat = erreur ? "erreur" : valide ? "valide" : null;
  const decrit = [aide && idAide, etat && idMessage].filter(Boolean).join(" ") || undefined;

  const proprietes = {
    id: idChamp,
    className: `champ__saisie ${etat ? `champ__saisie--${etat}` : ""}`,
    required: requis,
    "aria-invalid": erreur ? true : undefined,
    "aria-describedby": decrit,
    ...reste,
  };

  return (
    <div className={`champ ${className}`}>
      <label htmlFor={idChamp} className="champ__label">
        {label}
        {requis && <span aria-hidden="true"> *</span>}
      </label>
      {aide && (
        <p id={idAide} className="champ__aide">
          {aide}
        </p>
      )}
      {multiligne ? <textarea rows={6} {...proprietes} /> : <input type={type} {...proprietes} />}
      {erreur && (
        <p id={idMessage} className="champ__message champ__message--erreur">
          <X size={16} strokeWidth={2} aria-hidden="true" />
          {erreur}
        </p>
      )}
      {!erreur && valide && (
        <p id={idMessage} className="champ__message champ__message--valide">
          <Check size={16} strokeWidth={2} aria-hidden="true" />
          {valide}
        </p>
      )}
    </div>
  );
}
