import "./Etiquettes.css";

/**
 * Badge commercial : NOUVEAU ou TOP.
 * Fond Orange Pâle, texte Noir Encre, IBM Plex Mono.
 * - children : texte personnalisé (ex. « TOP · N°1 des plus demandées »)
 */
export function Badge({ type = "nouveau", children }) {
  return <span className="badge">{children ?? (type === "top" ? "TOP" : "NOUVEAU")}</span>;
}

/**
 * Pastilles d'un projet : rôle en pastille noire, outils en pastilles contour.
 * - taille : "m" (cartes) ou "s" (lignes compactes)
 * - max : nombre d'outils affichés ; les autres sont résumés en « +N »
 */
export function Pastilles({ role, outils = [], taille = "m", max = Infinity }) {
  if (!role && outils.length === 0) return null;
  const visibles = outils.slice(0, max);
  const reste = outils.length - visibles.length;
  return (
    <ul className={`pastilles pastilles--${taille}`} aria-label="Rôle et outils">
      {role && (
        <li className="pastille pastille--role">
          <span className="visuellement-cache">Rôle : </span>
          {role}
        </li>
      )}
      {visibles.map((outil) => (
        <li key={outil} className="pastille">
          {outil}
        </li>
      ))}
      {reste > 0 && (
        <li className="pastille pastille--plus">
          <span aria-hidden="true">+{reste}</span>
          <span className="visuellement-cache">
            et {reste} autre{reste > 1 ? "s" : ""} outil{reste > 1 ? "s" : ""}
          </span>
        </li>
      )}
    </ul>
  );
}
