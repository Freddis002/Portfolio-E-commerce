import { Link } from "react-router";
import { categories, urlElement } from "../data/catalogue";
import BoutonAjout from "./BoutonAjout";
import ImageEmplacement from "./ImageEmplacement";
import { Badge, Pastilles } from "./Etiquettes";
import "./CarteProduit.css";

/**
 * Carte d'un élément du catalogue (projet, expertise ou passion).
 * - element : entrée de src/data/*.json
 * - variante :
 *   "vitrine"  grande, 16:9, projet à la une
 *   "standard" grille de cartes
 *   "ligne"    liste compacte (expertises)
 *   "mini"     vignette 1:1 + texte, colonne à côté d'une vitrine
 *   "carre"    visuel 1:1 sans cadre (passions)
 * - ajoute / onBasculer : état et action du bouton d'ajout
 * - niveau : niveau du titre (h2, h3…) selon la page
 * - sombre : variante ligne sur fond Noir Encre
 * - rang : numéro affiché en tête de ligne (« 01 »), variante ligne
 * - imageRemplie : le visuel occupe toute la hauteur libre (vitrine en grille)
 * - avecTexte / avecPastilles : masquer l'accroche ou les pastilles
 */
export default function CarteProduit({
  element,
  variante = "standard",
  ajoute = false,
  onBasculer,
  niveau = 3,
  sombre = false,
  rang,
  imageRemplie = false,
  avecTexte = true,
  avecPastilles = true,
}) {
  const Titre = `h${niveau}`;
  const cat = categories[element.categorie];
  const url = urlElement(element);
  const vitrine = variante === "vitrine";
  const estProjet = element.categorie === "projet";
  const reference = [element.ref, cat.libelle, vitrine && element.annee].filter(Boolean).join(" · ");
  const libelleVoir = estProjet && vitrine ? "Voir le projet" : "Voir";
  const aDesBadges = element.badges?.top || element.badges?.nouveau;

  const badges = (
    <>
      {element.badges?.top && <Badge type="top" />}
      {element.badges?.nouveau && <Badge type="nouveau" />}
    </>
  );

  // En ligne, c'est le titre qui porte le lien (« Voir → » disparaît sur
  // mobile) : le « Voir → » n'est alors qu'un doublon visuel, ignoré au clavier
  // et par les lecteurs d'écran.
  const ligne = variante === "ligne";
  const actions = (
    <div className="carte__actions">
      <Link
        to={url}
        className="carte__voir"
        {...(ligne ? { tabIndex: -1, "aria-hidden": true } : {})}
      >
        {libelleVoir} <span aria-hidden="true">→</span>
        <span className="visuellement-cache"> : {element.titre}</span>
      </Link>
      <BoutonAjout
        ajoute={ajoute}
        onClick={onBasculer}
        titre={element.titre}
        surNoir={sombre}
        compact={ligne}
      />
    </div>
  );

  const pastilles = estProjet && avecPastilles && (
    <Pastilles role={element.role} outils={element.outils} taille={variante === "mini" ? "s" : "m"} />
  );

  if (ligne) {
    return (
      <article className={`carte carte--ligne ${sombre ? "carte--sombre" : ""}`}>
        {rang !== undefined && (
          <span className="carte__rang">
            <span className="visuellement-cache">Rang </span>
            {String(rang).padStart(2, "0")}
          </span>
        )}
        <span className="carte__ref label-mono">{element.ref}</span>
        <div className="carte__titre-groupe">
          <Titre className="carte__titre">
            <Link to={url} className="carte__titre-lien">
              {element.titre}
            </Link>
          </Titre>
          {badges}
        </div>
        {avecTexte && <p className="carte__texte">{element.accroche}</p>}
        {actions}
      </article>
    );
  }

  if (variante === "mini") {
    return (
      <article className="carte carte--mini">
        <ImageEmplacement type="" ratio="1:1" decoratif className="carte__vignette" />
        <div className="carte__corps">
          <span className="label-mono">{`${element.ref} · ${cat.libelle}`}</span>
          <Titre className="carte__titre">{element.titre}</Titre>
          {pastilles}
          {actions}
        </div>
      </article>
    );
  }

  const carre = variante === "carre";
  return (
    <article className={`carte carte--${variante} ${imageRemplie ? "carte--image-remplie" : ""}`}>
      <ImageEmplacement
        type={vitrine ? "Mockup écran sur fond Noir Encre" : carre ? "Photo personnelle" : cat.visuel}
        ratio={carre ? "1:1" : "16:9"}
        remplir={imageRemplie}
      >
        {aDesBadges && <span className="carte__badges">{badges}</span>}
      </ImageEmplacement>
      <div className="carte__corps">
        <span className="label-mono">{reference}</span>
        <Titre className="carte__titre">{element.titre}</Titre>
        {avecTexte && !carre && <p className="carte__texte">{element.accroche}</p>}
        {pastilles}
        {actions}
      </div>
    </article>
  );
}
