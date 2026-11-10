/*
 * Génère build/client/sitemap.xml et build/client/llms.txt après le build
 * (lancé automatiquement par « npm run build », via le script postbuild).
 * Version minimale : l'étape SEO ajoutera robots.txt et complétera ces fichiers.
 *
 * Pages exclues : /selection (propre à chaque visiteur), /styleguide et /404.
 */
import fs from "node:fs";
import path from "node:path";

const racine = path.resolve(import.meta.dirname, "..");
const lire = (f) => JSON.parse(fs.readFileSync(path.join(racine, "src/data", f), "utf8"));

const profil = lire("profil.json");
const projets = lire("projets.json");
const expertises = lire("expertises.json");
const passions = lire("passions.json");
const voyages = lire("voyages.json");

const site = profil.siteUrl.replace(/\/$/, "");
const nom = `${profil.nom} ${profil.prenom}`;

const PAGES = [
  { chemin: "/", titre: "Accueil", description: `Portfolio de ${nom}, ${profil.ville} (${profil.region})` },
  { chemin: "/catalogue", titre: "Catalogue", description: "Projets, expertises et passions" },
  {
    chemin: "/passions/carnet-de-route",
    titre: "Carnet de route",
    description: `Carte des voyages au départ d'${profil.ville} : ${voyages.map((l) => l.nom).join(", ")}`,
  },
  { chemin: "/a-propos", titre: "À propos", description: "Parcours" },
  { chemin: "/contact", titre: "Contact", description: "Envoyer un message" },
  { chemin: "/mentions-legales", titre: "Mentions légales" },
  { chemin: "/confidentialite", titre: "Confidentialité" },
];

const fiches = [
  ...projets.map((e) => ({ ...e, dossier: "projets" })),
  ...expertises.map((e) => ({ ...e, dossier: "expertises" })),
  ...passions.map((e) => ({ ...e, dossier: "passions" })),
].map((e) => ({
  chemin: `/${e.dossier}/${e.slug}`,
  titre: `${e.ref} ${e.titre}`,
  description: e.accroche,
}));

const toutes = [...PAGES, ...fiches];

// ---------- sitemap.xml ----------
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${toutes.map((p) => `  <url><loc>${site}${p.chemin}</loc></url>`).join("\n")}
</urlset>
`;

// ---------- llms.txt (format proposé sur llmstxt.org) ----------
const ligne = (p) => `- [${p.titre}](${site}${p.chemin})${p.description ? ` : ${p.description}` : ""}`;
const llms = `# ${nom}

> Portfolio présenté comme une boutique en ligne. Chargé e-commerce, marketing & communication,
> chef de projet digital, basé à ${profil.ville} (${profil.region}), ouvert à un CDI.

## Pages

${PAGES.map(ligne).join("\n")}

## Projets

${fiches.filter((f) => f.chemin.startsWith("/projets/")).map(ligne).join("\n")}

## Expertises

${fiches.filter((f) => f.chemin.startsWith("/expertises/")).map(ligne).join("\n")}

## Passions

${fiches.filter((f) => f.chemin.startsWith("/passions/")).map(ligne).join("\n")}
`;

const sortie = path.join(racine, "build/client");
fs.writeFileSync(path.join(sortie, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(sortie, "llms.txt"), llms);
console.log(`sitemap.xml (${toutes.length} pages) et llms.txt écrits dans build/client`);
