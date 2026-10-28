import { Link } from "react-router";
import "./IndicateurEtapes.css";

const ETAPES_DEFAUT = [
  { label: "Sélection", to: "/selection" },
  { label: "Coordonnées", to: "/contact" },
  { label: "Envoi" },
];

/**
 * Parcours 01 Sélection → 02 Coordonnées → 03 Envoi.
 * - courante : index de l'étape en cours (0, 1 ou 2)
 * - termine : true quand le message est envoyé (toutes les étapes validées)
 * Étape franchie : « ✓ » + lien ; étape courante : gras + aria-current ;
 * étape à venir : grisée. Chaque état a un repère visuel autre que la couleur.
 */
export default function IndicateurEtapes({ courante = 0, termine = false, etapes = ETAPES_DEFAUT }) {
  return (
    <ol className="etapes" aria-label="Étapes">
      {etapes.map((etape, i) => {
        const numero = String(i + 1).padStart(2, "0");
        const faite = termine || i < courante;
        const enCours = !termine && i === courante;
        const classe = faite ? "etape--faite" : enCours ? "etape--courante" : "etape--a-venir";
        const texte = (
          <>
            {faite && <span aria-hidden="true">✓ </span>}
            {numero} {etape.label}
            {faite && <span className="visuellement-cache"> (terminée)</span>}
          </>
        );
        return (
          <li key={etape.label} className={`etape ${classe}`} aria-current={enCours ? "step" : undefined}>
            {faite && etape.to && !termine ? <Link to={etape.to}>{texte}</Link> : texte}
          </li>
        );
      })}
    </ol>
  );
}
