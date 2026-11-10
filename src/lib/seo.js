import profil from "../data/profil.json";
import { elementsDe } from "../data/catalogue";

/*
 * Référencement : balises <head> et données structurées (JSON-LD).
 *
 * L'adresse du site vient d'UNE seule variable : siteUrl dans
 * src/data/profil.json. Elle sert ici (URL canoniques, partage, JSON-LD)
 * et dans scripts/fichiers-seo.mjs (sitemap.xml, robots.txt, llms.txt).
 */

export const SITE = profil.siteUrl.replace(/\/$/, "");
export const NOM = `${profil.nom} ${profil.prenom}`;
export const urlAbsolue = (chemin) => new URL(chemin, `${SITE}/`).href;

// Limites recommandées (vérifiées à chaque build par scripts/fichiers-seo.mjs)
export const LIMITE_TITRE = 60;
export const LIMITE_DESCRIPTION = 155;

// Image de partage par défaut (réseaux sociaux, messageries) : 1200 × 630
const IMAGE_PARTAGE = {
  chemin: "/partage.png",
  largeur: "1200",
  hauteur: "630",
  alt: `${NOM}, ${profil.postes.join(", ")}, basé à ${profil.ville} (${profil.region})`,
};

// Coupe un texte trop long sur une fin de mot, avec « … »
export function couper(texte, max) {
  if (texte.length <= max) return texte;
  const coupe = texte.slice(0, max - 1);
  return `${coupe.slice(0, coupe.lastIndexOf(" ")).replace(/[\s,;:·.–-]+$/, "")}…`;
}

/**
 * Balises <head> d'une page : title, description, URL canonique, partage
 * (Open Graph, Twitter Card) et données structurées.
 * - chemin : chemin canonique, ex. "/catalogue" (sans paramètres de filtre)
 * - robots : ex. "noindex" pour les pages à ne pas indexer
 * - jsonLd : objets schema.org ajoutés en <script type="application/ld+json">
 */
export function metaPage({ titre, description, chemin, type = "website", robots, jsonLd = [] }) {
  const url = urlAbsolue(chemin);
  const image = urlAbsolue(IMAGE_PARTAGE.chemin);
  return [
    { title: titre },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    ...(robots ? [{ name: "robots", content: robots }] : []),
    { property: "og:type", content: type },
    { property: "og:site_name", content: NOM },
    { property: "og:locale", content: "fr_FR" },
    { property: "og:title", content: titre },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:image:width", content: IMAGE_PARTAGE.largeur },
    { property: "og:image:height", content: IMAGE_PARTAGE.hauteur },
    { property: "og:image:alt", content: IMAGE_PARTAGE.alt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: titre },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: IMAGE_PARTAGE.alt },
    ...jsonLd.map((donnees) => ({ "script:ld+json": donnees })),
  ];
}

/* ---------- Données structurées schema.org ---------- */

const CONTEXTE = "https://schema.org";
// Identifiant unique de la personne : les autres blocs y renvoient
export const ID_PERSONNE = `${SITE}/#personne`;
const ID_SITE = `${SITE}/#site`;
const estUrl = (v) => /^https?:\/\//.test(v ?? "");

// La personne : nom, postes visés, zone, expertises
export function ldPersonne({ avecContexte = true } = {}) {
  return {
    ...(avecContexte && { "@context": CONTEXTE }),
    "@type": "Person",
    "@id": ID_PERSONNE,
    name: NOM,
    givenName: profil.prenom,
    familyName: profil.nom,
    jobTitle: profil.postes,
    url: `${SITE}/`,
    address: {
      "@type": "PostalAddress",
      addressLocality: profil.ville,
      addressRegion: profil.region,
      addressCountry: "FR",
    },
    // Profils externes (LinkedIn) : uniquement les vraies adresses
    ...(estUrl(profil.linkedin) && { sameAs: [profil.linkedin] }),
    knowsAbout: elementsDe("expertise").map((e) => e.titre),
  };
}

// Le site lui-même (accueil)
export function ldSiteWeb() {
  return {
    "@context": CONTEXTE,
    "@type": "WebSite",
    "@id": ID_SITE,
    name: NOM,
    url: `${SITE}/`,
    inLanguage: "fr-FR",
    author: { "@id": ID_PERSONNE },
  };
}

// Page de profil (À propos) : la personne en est le sujet principal
export function ldPageProfil(chemin) {
  return {
    "@context": CONTEXTE,
    "@type": "ProfilePage",
    url: urlAbsolue(chemin),
    inLanguage: "fr-FR",
    isPartOf: { "@id": ID_SITE },
    mainEntity: ldPersonne({ avecContexte: false }),
  };
}

/**
 * Fil d'Ariane : mêmes données que le composant FilAriane (items { label, to }),
 * le dernier élément étant la page courante (chemin).
 */
export function ldFilAriane(items, chemin) {
  return {
    "@context": CONTEXTE,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: urlAbsolue(item.to ?? chemin),
    })),
  };
}

// Un projet : réalisation (CreativeWork) de la personne
export function ldProjet(projet, chemin, expertises) {
  // Les valeurs encore à compléter ([Outil 1], [AAAA]…) ne sont pas publiées
  const reel = (v) => typeof v === "string" && v !== "" && !v.startsWith("[");
  return {
    "@context": CONTEXTE,
    "@type": "CreativeWork",
    name: projet.titre,
    description: projet.accroche,
    url: urlAbsolue(chemin),
    inLanguage: "fr-FR",
    author: { "@id": ID_PERSONNE },
    ...(reel(projet.entreprise) && {
      sourceOrganization: { "@type": "Organization", name: projet.entreprise },
    }),
    ...(/^\d{4}$/.test(projet.annee ?? "") && { dateCreated: projet.annee }),
    ...(expertises.length && { about: expertises.map((e) => e.titre) }),
    ...(projet.outils?.some(reel) && { keywords: projet.outils.filter(reel).join(", ") }),
  };
}
