import { Link } from "react-router";
import Logo from "./Logo";
import "./Footer.css";

/**
 * Pied de page Noir Encre : positionnement, navigation, contact, liens légaux.
 * - onGererCookies : ouvre le panneau de consentement (étape cookies).
 *   Tant qu'il n'existe pas, le lien mène à la politique de confidentialité.
 */
export default function Footer({ onGererCookies }) {
  const annee = new Date().getFullYear();
  return (
    <footer className="pied">
      <div className="pied__interieur conteneur">
        <div className="pied__haut">
          <div className="pied__marque">
            <Logo lien={false} taille="l" />
            <p className="pied__accroche">
              Lorem ipsum : positionnement en une ligne. Arras, Hauts-de-France.
            </p>
          </div>

          <nav className="pied__colonne" aria-label="Pied de page">
            <h2 className="pied__titre">Navigation</h2>
            <ul className="pied__liste">
              <li><Link to="/catalogue">Catalogue</Link></li>
              <li><Link to="/a-propos">À propos</Link></li>
              <li><Link to="/selection">Ma sélection</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </nav>

          <div className="pied__colonne">
            <h2 className="pied__titre">Me trouver</h2>
            <ul className="pied__liste">
              <li>[E-mail à compléter]</li>
              <li>
                {/* Lien LinkedIn à compléter */}
                <a href="#" rel="noopener noreferrer">
                  [LinkedIn à compléter] <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li>Arras (62), Hauts-de-France</li>
            </ul>
          </div>
        </div>

        <div className="pied__bas">
          <span>© {annee} NOM PRÉNOM</span>
          <ul className="pied__legal">
            <li><Link to="/mentions-legales">Mentions légales</Link></li>
            <li><Link to="/confidentialite">Confidentialité</Link></li>
            <li>
              {onGererCookies ? (
                <button type="button" className="pied__bouton-lien" onClick={onGererCookies}>
                  Gérer les cookies
                </button>
              ) : (
                <Link to="/confidentialite#cookies">Gérer les cookies</Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
