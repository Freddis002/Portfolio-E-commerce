/**
 * Photo du site, produite par « npm run photos » (public/photos/…, sans
 * métadonnées) : AVIF d'abord, WebP en secours.
 *
 * - src : chemin sans extension, ex. "/photos/voyages/hanoi/01"
 * - alt : description de la photo (obligatoire ; "" seulement si décorative)
 * - largeur / hauteur : dimensions réelles en px (obligatoires) : le navigateur
 *   réserve la place avant le chargement, la page ne « saute » pas
 * - prioritaire : true pour l'image du haut de page (chargée tout de suite,
 *   en priorité) ; sinon chargement différé, quand on s'en approche
 */
export default function Photo({ src, alt, largeur, hauteur, prioritaire = false, className = "" }) {
  return (
    <picture className={className}>
      <source srcSet={`${src}.avif`} type="image/avif" />
      <source srcSet={`${src}.webp`} type="image/webp" />
      <img
        src={`${src}.webp`}
        alt={alt}
        width={largeur}
        height={hauteur}
        loading={prioritaire ? "eager" : "lazy"}
        decoding={prioritaire ? "sync" : "async"}
        fetchPriority={prioritaire ? "high" : "auto"}
        style={{ width: "100%", height: "auto" }}
      />
    </picture>
  );
}
