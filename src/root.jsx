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
import { SelectionProvider, useSelection } from "./lib/selection";

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
        <SelectionProvider>
          <a href="#contenu" className="lien-evitement">
            Aller au contenu
          </a>
          <Entete />
          {children}
          <Footer />
          <Barre />
        </SelectionProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function Entete() {
  const { count } = useSelection();
  return <Header count={count} />;
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
  return (
    <main id="contenu">
      <h1>{introuvable ? "Page introuvable" : "Erreur"}</h1>
    </main>
  );
}
