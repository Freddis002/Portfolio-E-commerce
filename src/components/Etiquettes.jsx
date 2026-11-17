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
 */
export function Pastilles({ role, outils = [], taille = "m" }) {
  if (!role && outils.length === 0) return null;
  return (
    <ul className={`pastilles pastilles--${taille}`} aria-label="Rôle et outils">
      {role && (
        <li className="pastille pastille--role">
          <span className="visuellement-cache">Rôle : </span>
          {role}
        </li>
      )}
      {outils.map((outil) => (
        <li key={outil} className="pastille">
          {outil}
        </li>
      ))}
    </ul>
  );
}
