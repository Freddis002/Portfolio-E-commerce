import profil from "../data/profil.json";

/**
 * Balises <head> d'une page : title, meta description, URL canonique
 * et aperçu de partage (Open Graph).
 * - chemin : chemin canonique, ex. "/catalogue" (sans paramètres de filtre)
 */
export function metaPage({ titre, description, chemin }) {
  const url = new URL(chemin, profil.siteUrl).href;
  return [
    { title: titre },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "fr_FR" },
    { property: "og:title", content: titre },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
  ];
}
