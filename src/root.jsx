import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BarreSelection from "./components/BarreSelection";
import AnnonceSelection from "./components/AnnonceSelection";
import MiniPanier from "./components/MiniPanier";
import PageIntrouvable from "./components/PageIntrouvable";
import { useRetoursSelection, useSelection } from "./lib/selection";

import "./styles/fonts.css";
import "./styles/tokens.css";
import "./styles/global.css";

// Pages sans barre de sélection mobile : le parcours de contact,
// et les fiches (qui auront leur propre bouton d'ajout fixé en bas)
const SANS_BARRE = /^\/(selection|contact|projets|expertises|passions)(\/|$)/;

// Gabarit HTML commun à toutes les pages
export function Layout({ children }) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <a href="#contenu" className="lien-evitement">
          Aller au contenu
        </a>
        <Entete />
        {children}
        <Footer />
        <Barre />
        <MiniPanier />
        <AnnonceSelection />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function Entete() {
  const { count } = useSelection();
  const { impulsion } = useRetoursSelection();
  return <Header count={count} impulsion={impulsion} />;
}

function Barre() {
  const { count } = useSelection();
  const { pathname } = useLocation();
  return SANS_BARRE.test(pathname) ? null : <BarreSelection count={count} />;
}

export default function App() {
  return <Outlet />;
}

// Affiché si une page lève une erreur (ex. fiche introuvable)
export function ErrorBoundary({ error }) {
  const introuvable = isRouteErrorResponse(error) && error.status === 404;
  if (introuvable) return <PageIntrouvable />;
  return (
    <main id="contenu" className="conteneur">
      <h1>Erreur</h1>
      <p>Un problème est survenu. Rechargez la page ou revenez à l'accueil.</p>
    </main>
  );
}
