// Page provisoire (contenu à l'étape des pages légales) ; balises SEO déjà en place
import { NOM, metaPage } from "../lib/seo";

export function meta() {
  return metaPage({
    titre: `Confidentialité · ${NOM}`,
    description: "Politique de confidentialité : données du formulaire de contact, mesure d'audience sans cookies, gestion des cookies et vos droits.",
    chemin: "/confidentialite",
  });
}

export default function Page() {
  return (
    <main id="contenu">
      <h1>Confidentialité</h1>
    </main>
  );
}
