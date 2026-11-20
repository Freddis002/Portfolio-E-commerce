import { NOM, metaPage } from "../lib/seo";
import PageIntrouvable from "../components/PageIntrouvable";

// Page 404 (servie par Apache avec le statut 404) : jamais indexée
export function meta() {
  return metaPage({
    titre: `Page introuvable · ${NOM}`,
    description: "Cette page n'existe pas ou a été déplacée. Le catalogue complet reste disponible.",
    chemin: "/404",
    robots: "noindex",
  });
}

export default function Page() {
  return <PageIntrouvable />;
}
