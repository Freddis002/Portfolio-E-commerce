import { Link } from "react-router";
import { categories, urlElement } from "../data/catalogue";
import BoutonAjout from "./BoutonAjout";
import ImageEmplacement from "./ImageEmplacement";
import { Badge, Pastilles } from "./Etiquettes";
import { ILLUSTRATIONS_ELEMENTS } from "./illustrations/elements";
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
  // Vitrine : « P-02 · Projet · 2022 · Market Shop » (valeurs à compléter [..] ignorées)
  const reel = (v) => typeof v === "string" && v !== "" && !v.startsWith("[");
  const reference = [element.ref, cat.libelle, ...(vitrine ? [element.annee, element.entreprise].filter(reel) : [])].join(" · ");
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
        {/* Nom accessible unique : « Voir Mon Kit Solaire » */}
        {libelleVoir} <span aria-hidden="true">→</span>
        <span className="visuellement-cache"> {element.titre}</span>
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
    // Rôle court sur les cartes (le rôle complet est sur la fiche), 3 outils puis « +N »
    <Pastilles role={element.roleCourt ?? element.role} outils={element.outils} max={3} />
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
    // Vignette carrée : illustration en cadrage 1:1, sinon emplacement hachuré
    const Vignette = ILLUSTRATIONS_ELEMENTS[element.ref];
    const outils = element.outils ?? [];
    const reste = outils.length - 2;
    return (
      <article className="carte carte--mini">
        <div className="carte__vignette" aria-hidden="true">
          {Vignette ? <Vignette cadrage="1:1" /> : <ImageEmplacement type="" ratio="1:1" decoratif />}
        </div>
        {/* Tout le bloc texte est un seul lien vers la fiche */}
        <Link to={url} className="carte__mini-lien">
          <span className="label-mono">{[element.ref, element.ville, element.annee].filter(Boolean).join(" · ")}</span>
          <Titre className="carte__titre">{element.titre}</Titre>
          <span className="carte__mini-meta">
            {element.roleCourt && (
              <span className="pastille pastille--role">
                <span className="visuellement-cache">Rôle : </span>
                {element.roleCourt}
              </span>
            )}
            <span className="carte__mini-outils">
              {element.contexte === "personnel" ? (
                "Projet personnel"
              ) : (
                <>
                  {outils.slice(0, 2).join(" · ")}
                  {reste > 0 && (
                    <>
                      <span aria-hidden="true"> · +{reste}</span>
                      <span className="visuellement-cache">
                        {" "}
                        et {reste} autre{reste > 1 ? "s" : ""} outil{reste > 1 ? "s" : ""}
                      </span>
                    </>
                  )}
                </>
              )}
            </span>
          </span>
        </Link>
        <BoutonAjout ajoute={ajoute} onClick={onBasculer} titre={element.titre} symbole />
      </article>
    );
  }

  const carre = variante === "carre";
  // Illustration de l'élément (zone 16:9) ; sinon emplacement hachuré
  const Illustration = !carre && ILLUSTRATIONS_ELEMENTS[element.ref];
  return (
    <article className={`carte carte--${variante} ${imageRemplie ? "carte--image-remplie" : ""}`}>
      {Illustration ? (
        <div className="carte__visuel">
          <Illustration />
          {aDesBadges && <span className="carte__badges">{badges}</span>}
        </div>
      ) : (
        <ImageEmplacement
          type={vitrine ? "Mockup écran sur fond Noir Encre" : carre ? "Photo personnelle" : cat.visuel}
          ratio={carre ? "1:1" : "16:9"}
          remplir={imageRemplie}
        >
          {aDesBadges && <span className="carte__badges">{badges}</span>}
        </ImageEmplacement>
      )}
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
