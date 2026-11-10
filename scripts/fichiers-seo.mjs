/*
 * Lancé automatiquement après « npm run build » (script postbuild) :
 * 1. écrit build/client/sitemap.xml, robots.txt et llms.txt ;
 * 2. vérifie chaque page HTML générée (lue telle quelle, sans JavaScript) :
 *    title ≤ 60 caractères, description ≤ 155, URL canonique, image de partage,
 *    un seul H1, JSON-LD valide. Une erreur fait échouer le build.
 *
 * L'adresse du site vient de siteUrl dans src/data/profil.json (seule source).
 * Pages exclues du sitemap : /selection (propre à chaque visiteur), /styleguide, /404.
 */
import fs from "node:fs";
import path from "node:path";

const racine = path.resolve(import.meta.dirname, "..");
const sortie = path.join(racine, "build/client");
const lire = (f) => JSON.parse(fs.readFileSync(path.join(racine, "src/data", f), "utf8"));

const profil = lire("profil.json");
const projets = lire("projets.json");
const expertises = lire("expertises.json");
const passions = lire("passions.json");
const voyages = lire("voyages.json");

const site = profil.siteUrl.replace(/\/$/, "");
const nom = `${profil.nom} ${profil.prenom}`;
const postes = profil.postes.join(", ");

/* ---------- Pages publiques ---------- */

const PAGES = [
  { chemin: "/", titre: "Accueil", description: `Vitrine du portfolio : nouveautés, expertises les plus demandées, projets à la une.` },
  { chemin: "/catalogue", titre: "Catalogue", description: "Tous les projets, expertises et passions, avec filtres par catégorie, outil et contexte." },
  { chemin: "/a-propos", titre: "À propos", description: `Parcours, valeurs et CV ; basé à ${profil.ville}, mobile en ${profil.region}.` },
  { chemin: "/contact", titre: "Contact", description: "Formulaire de contact, prérempli avec la sélection du visiteur." },
  {
    chemin: "/passions/carnet-de-route",
    titre: "Carnet de route",
    description: `Carte des voyages au départ d'${profil.ville} : ${voyages.map((l) => l.nom).join(", ")}.`,
  },
  { chemin: "/mentions-legales", titre: "Mentions légales", description: "Éditeur, hébergement et crédits du site." },
  { chemin: "/confidentialite", titre: "Confidentialité", description: "Données personnelles, mesure d'audience et cookies." },
];

const fiche = (dossier, libelle) => (e) => ({
  chemin: `/${dossier}/${e.slug}`,
  titre: `${e.ref} ${e.titre}`,
  description: `${libelle}. ${e.accroche}`,
});
const fiches = {
  Projets: projets.map(fiche("projets", "Projet")),
  Expertises: expertises.map(fiche("expertises", "Expertise")),
  Passions: passions.map(fiche("passions", "Passion")),
};
const toutes = [...PAGES, ...Object.values(fiches).flat()];

/* ---------- sitemap.xml ---------- */

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${toutes.map((p) => `  <url><loc>${site}${p.chemin}</loc></url>`).join("\n")}
</urlset>
`;

/* ---------- robots.txt : tout est ouvert, y compris aux robots d'IA ---------- */

const ROBOTS_IA = ["GPTBot", "ChatGPT-User", "OAI-SearchBot", "ClaudeBot", "Claude-User", "PerplexityBot", "Google-Extended", "Applebot-Extended"];
const robots = `# Portfolio de ${nom} : contenu ouvert aux moteurs de recherche et aux robots d'IA.

User-agent: *
Allow: /
# Script du formulaire de contact : rien à indexer
Disallow: /api/

${ROBOTS_IA.map((r) => `User-agent: ${r}\nAllow: /\nDisallow: /api/`).join("\n\n")}

Sitemap: ${site}/sitemap.xml
`;

/* ---------- llms.txt (format proposé sur llmstxt.org) ---------- */

const ligne = (p) => `- [${p.titre}](${site}${p.chemin}) : ${p.description}`;
const llms = `# ${nom}

> Portfolio d'un candidat à un poste salarié (CDI) de ${postes.toLowerCase()},
> basé à ${profil.ville} (${profil.departement}), ${profil.region}, France.
> Le site est présenté comme une boutique en ligne : projets, expertises et passions
> forment un catalogue, et le visiteur peut composer une sélection avant d'écrire.

## Profil

- Postes visés : ${postes}
- Contrat recherché : CDI, temps plein
- Zone : ${profil.ville} et ${profil.region} (mobilité régionale)
- Expertises : ${expertises.map((e) => e.titre).join(", ")}
- Projets : ${projets.map((p) => `${p.titre}${p.entreprise && !p.entreprise.startsWith("[") ? ` (${p.entreprise})` : ""}`).join(", ")}

## Pages

${PAGES.map(ligne).join("\n")}

${Object.entries(fiches).map(([titre, liste]) => `## ${titre}\n\n${liste.map(ligne).join("\n")}`).join("\n\n")}
`;

fs.writeFileSync(path.join(sortie, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(sortie, "robots.txt"), robots);
fs.writeFileSync(path.join(sortie, "llms.txt"), llms);
console.log(`sitemap.xml (${toutes.length} pages), robots.txt et llms.txt écrits dans build/client`);

/* ---------- Vérification des pages générées ---------- */

const decoder = (s) =>
  s.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const attribut = (html, motif) => decoder((html.match(motif) || [])[1] ?? "");

const fichiersHtml = (dossier) =>
  fs.readdirSync(dossier, { withFileTypes: true }).flatMap((f) => {
    const p = path.join(dossier, f.name);
    return f.isDirectory() ? fichiersHtml(p) : f.name === "index.html" ? [p] : [];
  });

const problemes = [];
for (const fichier of fichiersHtml(sortie)) {
  const chemin = "/" + path.relative(sortie, fichier).split(path.sep).join("/").replace(/\/?index\.html$/, "");
  const html = fs.readFileSync(fichier, "utf8");
  const noindex = /name="robots" content="[^"]*noindex/.test(html);
  const signaler = (texte) => problemes.push(`${chemin} : ${texte}`);

  const titre = attribut(html, /<title>([^<]*)<\/title>/);
  const description = attribut(html, /<meta name="description" content="([^"]*)"/);
  if (!titre) signaler("title manquant");
  if (titre.length > 60) signaler(`title trop long (${titre.length} > 60) : « ${titre} »`);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) signaler("il faut exactement un H1");

  for (const bloc of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(bloc[1]);
    } catch {
      signaler("JSON-LD illisible");
    }
  }

  if (noindex) continue; // pages non indexées : pas d'exigence de partage
  if (!description) signaler("description manquante");
  if (description.length > 155) signaler(`description trop longue (${description.length} > 155)`);
  if (!/rel="canonical"/.test(html)) signaler("URL canonique manquante");
  if (!/property="og:image"/.test(html)) signaler("image de partage manquante");
}

if (problemes.length) {
  console.error(`\n${problemes.length} problème(s) de référencement :\n- ${problemes.join("\n- ")}\n`);
  process.exit(1);
}
console.log(`Référencement vérifié sur ${fichiersHtml(sortie).length} pages : aucun problème.`);
