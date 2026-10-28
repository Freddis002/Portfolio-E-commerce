import { useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import Logo from "./Logo";
import "./Header.css";

const LIENS = [
  { to: "/", label: "Accueil", end: true },
  { to: "/catalogue", label: "Catalogue" },
  { to: "/a-propos", label: "À propos" },
  { to: "/contact", label: "Contact" },
];

// Fichier à déposer dans public/ (étape contenus)
const CV_URL = "/cv.pdf";

/**
 * Compteur de « Ma sélection » : pastille neutre à 0, orange dès 1.
 * Le nombre est toujours écrit : l'état ne repose pas sur la couleur.
 */
export function CompteurSelection({ count }) {
  return (
    <span className={`compteur ${count > 0 ? "compteur--actif" : ""}`} aria-hidden="true">
      {count}
    </span>
  );
}

/**
 * En-tête global : barre d'annonce, logo, navigation, bouton Ma sélection.
 * Sous 1024 px, les liens passent dans un menu déroulant (bouton burger).
 * - count : nombre d'éléments dans la sélection
 */
export default function Header({ count = 0 }) {
  const [ouvert, setOuvert] = useState(false);
  const boutonRef = useRef(null);
  const menuId = useId();
  const { pathname } = useLocation();

  // Ferme le menu quand on change de page
  useEffect(() => setOuvert(false), [pathname]);

  // Échap ferme le menu et rend le focus au bouton burger
  useEffect(() => {
    if (!ouvert) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOuvert(false);
        boutonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [ouvert]);

  const libelleSelection = `Ma sélection, ${count} élément${count > 1 ? "s" : ""}`;

  return (
    <div className="entete">
      <p className="entete__annonce">
        <span>
          Ouvert aux opportunités · CDI · Arras
          <span className="entete__annonce-region"> &amp; Hauts-de-France</span>
        </span>
        <Link to="/a-propos" className="entete__annonce-lien">
          Voir mon parcours <span aria-hidden="true">→</span>
        </Link>
      </p>

      <header className="entete__barre">
        <div className="entete__interieur conteneur">
          <Logo />

          <nav className="entete__nav" aria-label="Navigation principale">
            <ul className="entete__liens">
              {LIENS.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} end={l.end} className="entete__lien">
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <NavLink to="/selection" className="entete__selection" aria-label={libelleSelection}>
              <ShoppingBag size={20} strokeWidth={1.5} aria-hidden="true" />
              <span className="entete__selection-texte">Ma sélection</span>
              <CompteurSelection count={count} />
            </NavLink>

            <button
              ref={boutonRef}
              type="button"
              className="entete__burger"
              aria-expanded={ouvert}
              aria-controls={menuId}
              aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setOuvert(!ouvert)}
            >
              {ouvert ? (
                <X size={24} strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <Menu size={24} strokeWidth={1.5} aria-hidden="true" />
              )}
            </button>
          </nav>
        </div>

        <nav id={menuId} className="entete__menu" aria-label="Menu" hidden={!ouvert}>
          <ul className="entete__menu-liens conteneur">
            {LIENS.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end} className="entete__menu-lien">
                  <span>{l.label}</span>
                  <span aria-hidden="true">→</span>
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink to="/selection" className="entete__menu-lien">
                <span>Ma sélection</span>
                <span className="entete__menu-compteur">({count})</span>
              </NavLink>
            </li>
            <li className="entete__menu-cv">
              <a href={CV_URL} className="bouton bouton--contour bouton--m">
                Télécharger le CV (PDF)
              </a>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}
