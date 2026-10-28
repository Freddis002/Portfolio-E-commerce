import { data } from "react-router";
import { trouverParSlug } from "../data/catalogue";

// Exécuté au build (pré-rendu) : retrouve l'élément d'après le slug de l'URL
export function loader({ params }) {
  const element = trouverParSlug("expertise", params.slug);
  if (!element) throw data(null, { status: 404 });
  return element;
}

export function meta({ data: element }) {
  return [{ title: `Fiche expertise — ${element?.titre ?? ""}` }];
}

export default function Page({ loaderData: element }) {
  return (
    <main>
      <h1>
        Fiche expertise — {element.ref} {element.titre}
      </h1>
    </main>
  );
}
