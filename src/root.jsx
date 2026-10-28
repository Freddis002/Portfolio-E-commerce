import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import "./styles/fonts.css";
import "./styles/tokens.css";
import "./styles/global.css";

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
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

// Affiché si une page lève une erreur (ex. fiche introuvable)
export function ErrorBoundary({ error }) {
  const introuvable = isRouteErrorResponse(error) && error.status === 404;
  return (
    <main>
      <h1>{introuvable ? "Page introuvable" : "Erreur"}</h1>
    </main>
  );
}
