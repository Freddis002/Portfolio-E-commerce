import { Link } from "react-router";
import { m, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { situationLieu, trouverParRef, typesLieu, urlElement } from "../data/catalogue";
import { useSelection } from "../lib/selection";
import BoutonAjout from "./BoutonAjout";
import PhotosLieu from "./PhotosLieu";
import "./Etiquettes.css";
import "./FicheLieu.css";

// Entrée de la fiche : fondu + légère montée (240 ms)
function useEntree() {
  const reduit = useReducedMotion();
  return {
    initial: reduit ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.24, ease: "easeOut" },
  };
}

const reference = (lieu) => [lieu.ref, typesLieu[lieu.type], lieu.annee].join(" · ");

/**
 * Fiche du lieu, desktop et tablette : panneau à droite de la carte.
 * - lieu : lieu choisi (ou null : invitation à choisir un repère)
 * - onPrecedent / onSuivant : lieu voisin parmi les lieux visibles
 */
export default function FicheLieu({ lieu, onPrecedent, onSuivant }) {
  const { contient, basculer } = useSelection();
  const entree = useEntree();

  return (
    <aside className="fiche-lieu" aria-label="Fiche du lieu" aria-live="polite">
      {!lieu ? (
        <div className="fiche-lieu__vide">
          <p className="label-mono">Fiche du lieu</p>
          <p className="fiche-lieu__vide-titre">Choisissez un repère sur la carte.</p>
          <p>Ou parcourez la liste de tous les lieux plus bas.</p>
        </div>
      ) : (
        // key : la fiche est recréée (et donc ré-animée) à chaque changement de lieu
        <m.div key={lieu.ref} className="fiche-lieu__contenu" {...entree}>
          <PhotosLieu lieu={lieu} />
          <div className="fiche-lieu__texte">
            <p className="label-mono">{reference(lieu)}</p>
            <h2 className="fiche-lieu__nom">{lieu.nom}</h2>
            <p className="fiche-lieu__situation">{situationLieu(lieu)}</p>
            <p className="fiche-lieu__description">{lieu.texte}</p>
            <LienPassion lieu={lieu} />
            <div className="fiche-lieu__espace" />
            <BoutonAjout
              taille="l"
              ajoute={contient(lieu.ref)}
              onClick={() => basculer(lieu)}
              titre={lieu.nom}
            />
            <div className="fiche-lieu__voisins">
              <button type="button" className="fiche-lieu__voisin" onClick={onPrecedent}>
                <span aria-hidden="true">← </span>Lieu précédent
              </button>
              <button type="button" className="fiche-lieu__voisin" onClick={onSuivant}>
                Lieu suivant<span aria-hidden="true"> →</span>
              </button>
            </div>
          </div>
        </m.div>
      )}
    </aside>
  );
}

/**
 * Fiche du lieu sur mobile : panneau fixé en bas de l'écran
 * (vignette, nom, « Voir les photos », « + Ajouter », fermer).
 */
export function FicheLieuMobile({ lieu, onFermer }) {
  const { contient, basculer } = useSelection();
  const entree = useEntree();
  if (!lieu) return null;

  return (
    <m.section key={lieu.ref} className="fiche-lieu-mobile" aria-label={`Fiche du lieu : ${lieu.nom}`} aria-live="polite" {...entree}>
      <PhotosLieu lieu={lieu} compacte>
        {(ouvrir) => (
          <>
            <div className="fiche-lieu-mobile__texte">
              <p className="label-mono">{reference(lieu)}</p>
              <h2 className="fiche-lieu-mobile__nom">{lieu.nom}</h2>
              <p className="fiche-lieu-mobile__situation">
                {situationLieu(lieu)} · [X] photos
              </p>
            </div>
            <button type="button" className="fiche-lieu-mobile__fermer" aria-label="Fermer la fiche du lieu" onClick={onFermer}>
              <X size={24} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <div className="fiche-lieu-mobile__actions">
              <button type="button" className="bouton bouton--contour bouton--m" onClick={ouvrir}>
                Voir les photos
              </button>
              <BoutonAjout
                taille="l"
                ajoute={contient(lieu.ref)}
                onClick={() => basculer(lieu)}
                titre={lieu.nom}
                court
                className="fiche-lieu-mobile__ajout"
              />
            </div>
          </>
        )}
      </PhotosLieu>
    </m.section>
  );
}

// Pastille vers la passion liée (H-02 Voyages)
function LienPassion({ lieu }) {
  const passion = trouverParRef(lieu.passion);
  if (!passion) return null;
  return (
    <Link to={urlElement(passion)} className="pastille-lien fiche-lieu__passion">
      {passion.ref} · {passion.titre} <span aria-hidden="true">→</span>
    </Link>
  );
}
