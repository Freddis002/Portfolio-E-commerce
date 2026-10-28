import { Link } from "react-router";
import { categories, urlElement } from "../data/catalogue";
import BoutonAjout from "./BoutonAjout";
import ImageEmplacement from "./ImageEmplacement";
import { Badge, Pastilles } from "./Etiquettes";
import "./CarteProduit.css";

/**
 * Carte d'un élément du catalogue (projet, expertise ou passion).
 * - element : entrée de src/data/*.json
 * - variante : "vitrine" (grande, 16:9, projet à la une), "standard" (grille),
 *   "ligne" (liste compacte)
 * - ajoute / onBasculer : état et action du bouton d'ajout
 * - niveau : niveau du titre (h2, h3…) selon la page
 */
export default function CarteProduit({
  element,
  variante = "standard",
  ajoute = false,
  onBasculer,
  niveau = 3,
  sombre = false,
}) {
  const Titre = `h${niveau}`;
  const cat = categories[element.categorie];
  const url = urlElement(element);
  const reference = `${element.ref} · ${cat.libelle}`;
  const libelleVoir = element.categorie === "projet" && variante === "vitrine" ? "Voir le projet" : "Voir";
  const estProjet = element.categorie === "projet";

  const badges = (
    <>
      {element.badges?.top && <Badge type="top" />}
      {element.badges?.nouveau && <Badge type="nouveau" />}
    </>
  );

  const actions = (
    <div className="carte__actions">
      <Link to={url} className="carte__voir">
        {libelleVoir} <span aria-hidden="true">→</span>
        <span className="visuellement-cache"> : {element.titre}</span>
      </Link>
      <BoutonAjout ajoute={ajoute} onClick={onBasculer} titre={element.titre} surNoir={sombre} />
    </div>
  );

  if (variante === "ligne") {
    return (
      <article className={`carte carte--ligne ${sombre ? "carte--sombre" : ""}`}>
        <span className="carte__ref label-mono">{element.ref}</span>
        <div className="carte__titre-groupe">
          <Titre className="carte__titre">{element.titre}</Titre>
          {badges}
        </div>
        <p className="carte__texte">{element.accroche}</p>
        {actions}
      </article>
    );
  }

  const vitrine = variante === "vitrine";
  return (
    <article className={`carte carte--${variante}`}>
      <ImageEmplacement
        type={vitrine ? "Mockup écran sur fond Noir Encre" : cat.visuel}
        ratio="16:9"
      >
        {(element.badges?.top || element.badges?.nouveau) && (
          <span className="carte__badges">{badges}</span>
        )}
      </ImageEmplacement>
      <div className="carte__corps">
        <span className="label-mono">{reference}</span>
        <Titre className="carte__titre">{element.titre}</Titre>
        <p className="carte__texte">{element.accroche}</p>
        {estProjet && <Pastilles role={element.role} outils={element.outils} />}
        {actions}
      </div>
    </article>
  );
}
