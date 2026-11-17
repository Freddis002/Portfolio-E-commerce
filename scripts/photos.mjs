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
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const racine = path.resolve(import.meta.dirname, "..");
const SOURCE = path.join(racine, "photos-originales");
const SORTIE = path.join(racine, "public/photos");
const EXTENSIONS = /\.(jpe?g|png|webp|tiff?|avif|heic|heif)$/i;
const LARGEUR_MAX = 2000;

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

const originaux = lister(SOURCE);
if (originaux.length === 0) {
  console.log(`Aucune photo dans ${path.relative(racine, SOURCE)}/ : rien à faire.`);
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
