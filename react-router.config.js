import projets from "./src/data/projets.json";
import expertises from "./src/data/expertises.json";
import passions from "./src/data/passions.json";

/**
 * Configuration React Router (mode framework).
 * - appDirectory : le code de l'application vit dans src/ (et non app/).
 * - ssr: false : aucun serveur Node en production (hébergement OVH mutualisé).
 * - prerender : chaque URL listée est générée en HTML statique au build,
 *   pour que Google et les robots d'IA lisent le contenu sans JavaScript.
 */
export default {
  appDirectory: "src",
  ssr: false,
  async prerender({ getStaticPaths }) {
    return [
      // Routes sans paramètre : /, /catalogue, /a-propos...
      ...getStaticPaths(),
      // Routes à paramètre : une page par élément des données
      ...projets.map((p) => `/projets/${p.slug}`),
      ...expertises.map((e) => `/expertises/${e.slug}`),
      ...passions.map((h) => `/passions/${h.slug}`),
      // Page 404 servie par Apache (ErrorDocument)
      "/404",
    ];
  },
};
