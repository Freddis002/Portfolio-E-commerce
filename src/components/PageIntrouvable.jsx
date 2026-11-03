import Bouton from "./Bouton";
import PointFinal from "./PointFinal";
import "./PageIntrouvable.css";

/**
 * Contenu de la page 404 : route /404 (servie par Apache) et fiche
 * dont la slug n'existe pas. (Mise en forme finale à l'étape 404.)
 */
export default function PageIntrouvable() {
  return (
    <main id="contenu" className="introuvable conteneur">
      <p className="label-mono">Erreur 404</p>
      <h1 className="introuvable__titre">
        Page introuvable
        <PointFinal />
      </h1>
      <p className="introuvable__texte">
        Cette page n'existe pas ou a été déplacée. Retrouvez tous les projets, expertises et
        passions dans le catalogue.
      </p>
      <div className="introuvable__actions">
        <Bouton variante="secondaire" to="/catalogue">
          Voir le catalogue <span aria-hidden="true">→</span>
        </Bouton>
        <Bouton variante="contour" to="/">
          Retour à l'accueil
        </Bouton>
      </div>
    </main>
  );
}
