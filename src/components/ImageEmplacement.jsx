import "./ImageEmplacement.css";

/**
 * Emplacement d'image hachuré, en attendant le vrai visuel.
 * Affiche le type de visuel et le ratio, ex. « Visuel projet · 16:9 ».
 * - ratio : "16:9" (projet), "4:5" (portrait), "1:1" (passion), "4:3", "16:10"
 * - fond : "clair" (défaut) ou "sombre" (mockup sur Noir Encre)
 * - remplir : true pour occuper toute la hauteur du parent (ratio ignoré)
 * - decoratif : true si l'image n'apporte rien au texte voisin (ex. dans un lien)
 * - children : éléments superposés (badge, référence…)
 */
export default function ImageEmplacement({
  type = "Visuel",
  ratio = "16:9",
  fond = "clair",
  remplir = false,
  decoratif = false,
  className = "",
  children,
}) {
  const [l, h] = ratio.split(":");
  const style = remplir ? undefined : { aspectRatio: `${l} / ${h}` };
  const classes = [
    "image-emplacement",
    `image-emplacement--${fond}`,
    remplir && "image-emplacement--remplir",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} style={style}>
      {/* role="img" sur la légende seule : les badges superposés restent lisibles */}
      <span
        className="image-emplacement__legende"
        {...(decoratif
          ? { "aria-hidden": true }
          : { role: "img", "aria-label": `Emplacement d'image : ${type}, format ${ratio}` })}
      >
        {type} · {ratio}
      </span>
      {children}
    </div>
  );
}
