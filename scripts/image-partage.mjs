/*
 * npm run image-partage : crée public/partage.png (1200 × 630), l'image
 * affichée quand une page du site est partagée (LinkedIn, messageries…).
 *
 * L'image est dessinée en HTML avec les polices et couleurs de la charte,
 * puis photographiée par Chrome (installé sur le poste) via playwright-core.
 * À relancer quand le nom, les postes ou la ville changent dans profil.json.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright-core";
import sharp from "sharp";

const racine = path.resolve(import.meta.dirname, "..");
const profil = JSON.parse(fs.readFileSync(path.join(racine, "src/data/profil.json"), "utf8"));
const police = (chemin) => pathToFileURL(path.join(racine, "node_modules", chemin)).href;

const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><style>
  @font-face { font-family: Archivo; src: url(${police("@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2")}); font-weight: 100 900; font-stretch: 62% 125%; }
  @font-face { font-family: Plex; src: url(${police("@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2")}); }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: #F7F5F2; color: #111010; font-family: Archivo, sans-serif;
         display: flex; flex-direction: column; justify-content: space-between; padding: 72px 80px; }
  .haut { font: 400 22px Plex, monospace; letter-spacing: .08em; text-transform: uppercase; color: #C2410C; }
  h1 { font-size: 116px; line-height: 1; font-weight: 850; font-variation-settings: "wdth" 112; letter-spacing: -.03em; }
  h1 span { color: #FF5A1F; }
  .postes { margin-top: 28px; font: 400 26px Plex, monospace; letter-spacing: .02em; color: #2B2927; }
  .bas { display: flex; justify-content: space-between; align-items: center; border-top: 2px solid #111010; padding-top: 24px;
         font: 400 22px Plex, monospace; letter-spacing: .08em; text-transform: uppercase; }
  .cdi { background: #111010; color: #F7F5F2; padding: 10px 18px; }
</style></head><body>
  <p class="haut">Portfolio · Basé à ${profil.ville}</p>
  <div>
    <h1>${profil.nom}<br>${profil.prenom}<span>.</span></h1>
    <p class="postes">${profil.postes.join(" · ")}</p>
  </div>
  <p class="bas"><span>${profil.ville} · ${profil.region}</span><span class="cdi">Ouvert à un CDI</span></p>
</body></html>`;

// Chrome installé sur le poste (canal « chrome » de Playwright)
const navigateur = await chromium.launch({ channel: "chrome" });
const page = await navigateur.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
const capture = await page.screenshot({ type: "png" });
await navigateur.close();

// PNG optimisé (palette de couleurs réduite : fichier léger, rendu identique)
const sortie = path.join(racine, "public/partage.png");
await sharp(capture).png({ palette: true, quality: 90, compressionLevel: 9 }).toFile(sortie);
const { width, height, size } = await sharp(sortie).metadata().then(async (m) => ({ ...m, size: fs.statSync(sortie).size }));
console.log(`public/partage.png : ${width} × ${height}, ${Math.round(size / 1024)} Ko`);
