/*
 * Lancé après « npm run build » (postbuild, après fichiers-seo.mjs) :
 * ajoute à chaque page HTML une Content-Security-Policy stricte en <meta>.
 *
 * Pourquoi en <meta> et pas seulement dans .htaccess : React Router place dans
 * chaque page de petits scripts de démarrage, différents d'une page à l'autre.
 * On les autorise un par un grâce à leur empreinte (sha256), sans jamais
 * ouvrir la porte à n'importe quel script en ligne ('unsafe-inline').
 * Les règles qu'une balise <meta> ne peut pas porter (frame-ancestors…) sont
 * dans public/.htaccess. Le navigateur applique les deux à la fois.
 *
 * Les adresses Matomo et Clarity viennent de src/data/mesure.json : elles ne
 * sont autorisées que si elles y sont renseignées.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const racine = path.resolve(import.meta.dirname, "..");
const sortie = path.join(racine, "build/client");
const mesure = JSON.parse(fs.readFileSync(path.join(racine, "src/data/mesure.json"), "utf8"));

const matomo = mesure.matomo.url ? new URL(mesure.matomo.url).origin : null;
const clarity = mesure.clarity.id ? ["https://www.clarity.ms", "https://*.clarity.ms"] : [];
const clarityImages = mesure.clarity.id ? ["https://*.clarity.ms", "https://c.bing.com"] : [];

const liste = (...valeurs) => valeurs.flat().filter(Boolean).join(" ");

function politique(empreintes) {
  return [
    "default-src 'self'",
    `script-src ${liste("'self'", empreintes, matomo, clarity)}`,
    // style="…" posés par React (formats d'image, animations) : sans risque d'exécution
    "style-src 'self' 'unsafe-inline'",
    `img-src ${liste("'self'", "data:", matomo, clarityImages)}`,
    "font-src 'self'",
    `connect-src ${liste("'self'", matomo, clarity)}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

// Scripts exécutables écrits dans la page (pas les données JSON-LD, jamais exécutées)
function empreintesDe(html) {
  return [...html.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g)]
    .filter(([, attributs = ""]) => !/type="application\/(ld\+)?json"/.test(attributs) && !/\ssrc=/.test(attributs))
    .map(([, , code]) => `'sha256-${crypto.createHash("sha256").update(code, "utf8").digest("base64")}'`);
}

const pages = (dossier) =>
  fs.readdirSync(dossier, { withFileTypes: true }).flatMap((f) => {
    const p = path.join(dossier, f.name);
    return f.isDirectory() ? pages(p) : f.name.endsWith(".html") ? [p] : [];
  });

let total = 0;
for (const fichier of pages(sortie)) {
  let html = fs.readFileSync(fichier, "utf8");
  html = html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/, "");
  const empreintes = [...new Set(empreintesDe(html))];
  const balise = `<meta http-equiv="Content-Security-Policy" content="${politique(empreintes)}"/>`;
  // Juste après le jeu de caractères : la politique s'applique avant tout script
  html = html.replace(/(<meta charSet="utf-8"\/>)/i, `$1${balise}`);
  if (!html.includes(balise)) throw new Error(`CSP non insérée dans ${fichier}`);
  fs.writeFileSync(fichier, html);
  total++;
}
console.log(`Content-Security-Policy ajoutée à ${total} pages${matomo ? ` (Matomo : ${matomo})` : ""}${clarity.length ? " (Clarity)" : ""}.`);
