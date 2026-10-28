import { Link } from "react-router";
import "./Bouton.css";

/**
 * Bouton de la charte, rendu en lien ou en <button> selon les props.
 * - variante : "primaire" (orange, UN SEUL par écran), "secondaire" (noir),
 *   "contour", "lien" (texte souligné)
 * - taille : "m" (48 px) ou "s" (44 px, minimum tactile)
 * - to : lien interne (React Router) ; href : lien externe ou fichier ;
 *   sinon <button> (type="button" par défaut)
 * - surNoir : version claire pour les fonds Noir Encre (contour et lien)
 */
export default function Bouton({
  variante = "primaire",
  taille = "m",
  to,
  href,
  surNoir = false,
  className = "",
  children,
  ...reste
}) {
  const classes = [
    "bouton",
    `bouton--${variante}`,
    `bouton--${taille}`,
    surNoir && "bouton--sur-noir",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (to) {
    return (
      <Link to={to} className={classes} {...reste}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...reste}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...reste}>
      {children}
    </button>
  );
}
