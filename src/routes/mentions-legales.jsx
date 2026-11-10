// Page provisoire (contenu à l'étape des pages légales) ; balises SEO déjà en place
import { NOM, metaPage } from "../lib/seo";

export function meta() {
  return metaPage({
    titre: `Mentions légales · ${NOM}`,
    description: "Mentions légales du portfolio : éditeur, hébergement (OVH), propriété intellectuelle et crédits.",
    chemin: "/mentions-legales",
  });
}

export default function Page() {
  return (
    <main id="contenu">
      <h1>Mentions légales</h1>
    </main>
  );
}
