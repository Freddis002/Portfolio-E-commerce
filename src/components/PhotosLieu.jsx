import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, LazyMotion, m, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import ImageEmplacement from "./ImageEmplacement";
import "./PhotosLieu.css";

// Fonctions layout de Motion, chargées en différé (voir lib/motion-layout.js)
const chargerLayout = () => import("../lib/motion-layout").then((r) => r.default);

const deux = (n) => String(n).padStart(2, "0");

/**
 * Photos d'un lieu : grande photo 16:10 + vignettes, et visionneuse plein
 * écran. À l'ouverture, la vignette « grandit » jusqu'à la visionneuse
 * (transition partagée layoutId). Fermeture : Échap, bouton ou clic hors photo.
 * - lieu : lieu du Carnet de route
 * - compacte : une seule vignette (panneau mobile)
 * - children(ouvrir) : facultatif, pour placer un bouton « Voir les photos »
 */
export default function PhotosLieu({ lieu, compacte = false, children }) {
  const [ouverte, setOuverte] = useState(null);
  const reduit = useReducedMotion();
  const photos = lieu.photos;
  // Sans animation demandée : pas de transition partagée
  const id = (i) => (reduit ? undefined : `photo-${lieu.ref}-${i}`);

  const vignette = (i, classe = "") => (
    <m.button
      key={i}
      type="button"
      layoutId={id(i)}
      className={`photos-lieu__vignette ${classe}`}
      aria-label={`Agrandir la photo ${deux(i + 1)} : ${lieu.nom}`}
      onClick={() => setOuverte(i)}
    >
      <ImageEmplacement
        type={i === 0 && !compacte ? `Photo ${deux(1)}` : ""}
        ratio={i === 0 && !compacte ? "16:10" : "1:1"}
        decoratif
      />
      {i === 3 && <span className="photos-lieu__plus">+ [X] photos</span>}
    </m.button>
  );

  return (
    <LazyMotion features={chargerLayout}>
      {compacte ? (
        vignette(0, "photos-lieu__vignette--seule")
      ) : (
        <div className="photos-lieu">
          {vignette(0, "photos-lieu__vignette--grande")}
          {photos.slice(1, 4).map((_, j) => vignette(j + 1))}
        </div>
      )}

      {children?.(() => setOuverte(0))}

      <AnimatePresence>
        {ouverte !== null && (
          <Visionneuse
            key="visionneuse"
            lieu={lieu}
            index={ouverte}
            layoutId={id(ouverte)}
            onChanger={setOuverte}
            onFermer={() => setOuverte(null)}
          />
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}

function Visionneuse({ lieu, index, layoutId, onChanger, onFermer }) {
  const fermerRef = useRef(null);
  const total = lieu.photos.length;
  const precedente = (index - 1 + total) % total;
  const suivante = (index + 1) % total;

  // Focus sur « Fermer » à l'ouverture, rendu à l'élément d'origine à la fermeture
  useEffect(() => {
    const origine = document.activeElement;
    fermerRef.current?.focus();
    return () => origine?.focus?.();
  }, []);

  // Échap ferme, flèches gauche / droite changent de photo
  useEffect(() => {
    const touche = (e) => {
      if (e.key === "Escape") onFermer();
      if (e.key === "ArrowRight") onChanger(suivante);
      if (e.key === "ArrowLeft") onChanger(precedente);
    };
    document.addEventListener("keydown", touche);
    return () => document.removeEventListener("keydown", touche);
  }, [onFermer, onChanger, suivante, precedente]);

  return createPortal(
    <m.div
      className="visionneuse"
      role="dialog"
      aria-modal="true"
      aria-label={`Photos : ${lieu.nom}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      // Clic hors de la photo (sur le voile) : fermeture
      onClick={(e) => e.target === e.currentTarget && onFermer()}
    >
      <m.figure
        className="visionneuse__photo"
        layoutId={layoutId}
        transition={{ duration: 0.32, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <ImageEmplacement type={`Photo ${deux(index + 1)}`} ratio="16:10" />
        <figcaption className="visionneuse__legende">
          <span className="label-mono">
            {lieu.ref} · {deux(index + 1)} / {deux(total)}
          </span>
          <span>{lieu.photos[index].legende}</span>
        </figcaption>
      </m.figure>

      <div className="visionneuse__commandes">
        <button type="button" className="visionneuse__bouton" aria-label="Photo précédente" onClick={() => onChanger(precedente)}>
          <ChevronLeft size={24} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button type="button" className="visionneuse__bouton" aria-label="Photo suivante" onClick={() => onChanger(suivante)}>
          <ChevronRight size={24} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button ref={fermerRef} type="button" className="visionneuse__bouton" aria-label="Fermer les photos" onClick={onFermer}>
          <X size={24} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </m.div>,
    document.body,
  );
}
