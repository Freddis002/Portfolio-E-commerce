import "./BoutonAjout.css";

/**
 * Bouton d'ajout à « Ma sélection ».
 * - ajoute : l'élément est-il déjà dans la sélection ?
 * - onClick : bascule ajout / retrait (géré par le parent)
 * - mode : "bascule" (+ Ajouter / ✓ Ajouté) ou "retirer" (× Retirer, page Ma sélection)
 * - taille : "s" (cartes, 44 px) ou "l" (fiches, 56 px, pleine largeur)
 * - surNoir : version pour les fonds Noir Encre
 * - titre : nom de l'élément, lu par les lecteurs d'écran
 *   (« Ajouter Mon Kit Solaire à ma sélection »)
 *
 * En taille "l" et non ajouté, le bouton est le CTA orange de la fiche.
 */
export default function BoutonAjout({
  ajoute = false,
  onClick,
  mode = "bascule",
  taille = "s",
  surNoir = false,
  titre,
  className = "",
  ...reste
}) {
  const retirer = mode === "retirer";
  const classes = [
    "bouton-ajout",
    `bouton-ajout--${taille}`,
    retirer ? "bouton-ajout--retirer" : ajoute && "bouton-ajout--ajoute",
    surNoir && "bouton-ajout--sur-noir",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  let symbole;
  let texte;
  let complement;
  if (retirer) {
    symbole = "×";
    texte = "Retirer";
    complement = ` ${titre} de ma sélection`;
  } else if (ajoute) {
    symbole = "✓";
    texte = taille === "l" ? "Dans votre sélection" : "Ajouté";
    complement = ` : ${titre} est dans votre sélection. Activer pour le retirer`;
  } else {
    symbole = "+";
    texte = taille === "l" ? "Ajouter à ma sélection" : "Ajouter";
    complement = taille === "l" ? ` : ${titre}` : ` ${titre} à ma sélection`;
  }

  return (
    <button type="button" className={classes} onClick={onClick} {...reste}>
      <span aria-hidden="true">{symbole}</span>
      <span>
        {texte}
        {titre && <span className="visuellement-cache">{complement}</span>}
      </span>
    </button>
  );
}
