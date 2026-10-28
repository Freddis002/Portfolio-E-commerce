import { Link } from "react-router";
import PointFinal from "./PointFinal";
import "./Logo.css";

/**
 * Logotype « NOM PRÉNOM. » en Archivo 850, chasse 112.
 * - lien : true dans le header (retour à l'accueil), false dans le footer
 * - taille : "m" (header desktop), "s" (header mobile), "l" (footer)
 */
export default function Logo({ lien = true, taille = "m" }) {
  const contenu = (
    <>
      NOM PRÉNOM
      <PointFinal />
    </>
  );
  const classe = `logo logo--${taille}`;
  if (!lien) return <span className={classe}>{contenu}</span>;
  return (
    <Link to="/" className={classe} aria-label="NOM PRÉNOM, accueil">
      {contenu}
    </Link>
  );
}
