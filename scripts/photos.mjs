/*
 * npm run photos : prépare les photos pour le site.
 *
 * - Source : photos-originales/ (ignoré par Git : les originaux contiennent
 *   souvent la position GPS et le modèle d'appareil).
 * - Sortie : public/photos/, même arborescence, une version .webp et une .avif
 *   par photo, 2000 px de large au maximum.
 * - sharp n'écrit aucune métadonnée par défaut (EXIF, GPS, XMP, IPTC) :
 *   on applique seulement l'orientation de l'appareil avant de la retirer.
 * - Chaque fichier produit est relu pour vérifier qu'il ne contient plus rien.
 * - Écrit src/data/photos.json : la liste des photos publiées et leurs dimensions.
 *   Le site s'en sert pour afficher une photo dès qu'elle existe (sinon :
 *   emplacement hachuré), sans rien changer dans le code.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const racine = path.resolve(import.meta.dirname, "..");
const SOURCE = path.join(racine, "photos-originales");
const SORTIE = path.join(racine, "public/photos");
const EXTENSIONS = /\.(jpe?g|png|webp|tiff?|avif|heic|heif)$/i;
const LARGEUR_MAX = 2000;
const LISTE = path.join(racine, "src/data/photos.json");

function lister(dossier) {
  if (!fs.existsSync(dossier)) return [];
  return fs.readdirSync(dossier, { withFileTypes: true }).flatMap((f) => {
    const chemin = path.join(dossier, f.name);
    if (f.isDirectory()) return lister(chemin);
    return EXTENSIONS.test(f.name) ? [chemin] : [];
  });
}

async function sansMetadonnees(fichier) {
  const m = await sharp(fichier).metadata();
  return !m.exif && !m.xmp && !m.iptc;
}

// Liste des photos publiées (public/photos/…webp) : { "/photos/x/y": { largeur, hauteur } }
async function ecrireListe() {
  const liste = {};
  const webp = lister(SORTIE).filter((f) => f.endsWith(".webp")).sort();
  for (const fichier of webp) {
    const { width, height } = await sharp(fichier).metadata();
    const src = "/" + path.relative(path.join(racine, "public"), fichier).replaceAll("\\", "/").replace(/\.webp$/, "");
    liste[src] = { largeur: width, hauteur: height };
  }
  fs.writeFileSync(LISTE, JSON.stringify(liste, null, 2) + "\n");
  console.log(`${webp.length} photo(s) publiée(s), liste écrite dans ${path.relative(racine, LISTE)}`);
}

const originaux = lister(SOURCE);
if (originaux.length === 0) {
  console.log(`Aucune photo dans ${path.relative(racine, SOURCE)}/ : rien à convertir.`);
  await ecrireListe();
  process.exit(0);
}

let erreurs = 0;
for (const original of originaux) {
  const relatif = path.relative(SOURCE, original).replace(EXTENSIONS, "");
  const base = path.join(SORTIE, relatif);
  fs.mkdirSync(path.dirname(base), { recursive: true });

  // rotate() sans argument : redresse selon l'orientation EXIF, avant suppression
  const image = sharp(original).rotate().resize({ width: LARGEUR_MAX, withoutEnlargement: true });
  await image.clone().webp({ quality: 80 }).toFile(`${base}.webp`);
  await image.clone().avif({ quality: 55 }).toFile(`${base}.avif`);

  for (const sortie of [`${base}.webp`, `${base}.avif`]) {
    if (!(await sansMetadonnees(sortie))) {
      console.error(`ERREUR : métadonnées restantes dans ${path.relative(racine, sortie)}`);
      erreurs++;
    }
  }
  console.log(`✓ ${path.relative(racine, original)} → ${path.relative(racine, base)}.webp / .avif`);
}

if (erreurs) process.exit(1);
console.log(`${originaux.length} photo(s) prête(s), sans métadonnées EXIF ni GPS.`);
await ecrireListe();
