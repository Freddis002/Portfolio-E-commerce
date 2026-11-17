import { m, useReducedMotion } from "motion/react";
import { situationLieu, typesLieu } from "../data/catalogue";
import { positionSurCarte } from "../lib/projection";
import "./CarteVoyages.css";

/*
 * Cadrages du zoom : facteur et point visé (en % de la carte).
 * Sur mobile la carte est plus étroite : on zoome plus fort (maquette mobile).
 * Zooms France et Vietnam un peu plus forts que dans les maquettes : sinon
 * Lyon et Valence, ou Hué et Da Nang, se recouvrent (repères de 32 px).
 * Ils restent assez faibles pour que toutes les villes de la zone tiennent
 * dans le cadre (vérifié à 1440, 768 et 390 px).
 */
export const ZONES = {
  monde: { libelle: "Monde", desktop: 1, mobile: 1, x: 50, y: 50 },
  europe: { libelle: "Europe", desktop: 3.4, mobile: 6.5, x: 49.8, y: 18.8 },
  france: { libelle: "France", desktop: 12, mobile: 30, x: 50.6, y: 17.55 },
  vietnam: { libelle: "Vietnam", desktop: 12, mobile: 20, x: 79.2, y: 41.7 },
};

// Zone la plus adaptée pour montrer un lieu (bouton « Voir sur la carte »)
export function zoneDuLieu(lieu) {
  if (lieu.pays === "Vietnam") return "vietnam";
  return lieu.zone === "france" ? "france" : "europe";
}

const EASE = [0.2, 0.7, 0.2, 1];

/**
 * Carte du Carnet de route : fond monde.svg (image décorative) + un repère
 * par lieu. Chaque repère est un vrai bouton (clavier, lecteurs d'écran).
 * - lieux : lieux visibles (après filtres) ; actif : référence du lieu choisi
 * - zone : clé de ZONES ; mobile : facteurs de zoom mobiles
 * - onChoisir(lieu) : clic sur un repère
 */
export default function CarteVoyages({ lieux, actif, zone, mobile, onChoisir }) {
  const reduit = useReducedMotion();
  const z = ZONES[zone];
  const zoom = mobile ? z.mobile : z.desktop;
  const transition = { duration: reduit ? 0 : 0.48, ease: EASE };

  /*
   * Position d'un point à l'écran, en % du cadre, une fois la carte zoomée.
   * Le fond est agrandi autour du point visé puis recentré : un point p se
   * retrouve à 50 % + zoom × (p − point visé).
   */
  const aLEcran = (p, centre) => (zoom > 1 ? 50 + zoom * (p - centre) : p);

  return (
    <div className="carte-voyages">
      <div className="carte-voyages__cadre">
        {/* Fond zoomé : translation vers le point visé, puis mise à l'échelle */}
        <m.div
          className="carte-voyages__calque"
          style={{ transformOrigin: `${z.x}% ${z.y}%` }}
          initial={false}
          animate={{
            x: zoom > 1 ? `${50 - z.x}%` : "0%",
            y: zoom > 1 ? `${50 - z.y}%` : "0%",
            scale: zoom,
          }}
          transition={transition}
        >
          <img className="carte-voyages__fond" src="/carte/monde.svg" alt="" width="1000" height="437" />
        </m.div>

        {/*
          Repères dans un calque NON zoomé, déplacés au même rythme que le fond :
          ils gardent leur taille, et leur zone cliquable est exactement celle
          dessinée (pas de mise à l'échelle imbriquée).
        */}
        {lieux.map((lieu, i) => {
          const { x, y } = positionSurCarte(lieu.latitude, lieu.longitude);
          const estActif = lieu.ref === actif;
          return (
            <m.button
              key={lieu.ref}
              type="button"
              className={`repere repere--${lieu.type}`}
              style={{ x: "-50%", y: "-50%", zIndex: estActif ? 3 : 2 }}
              initial={false}
              animate={{ left: `${aLEcran(x, z.x)}%`, top: `${aLEcran(y, z.y)}%` }}
              transition={transition}
              aria-pressed={estActif}
              aria-label={`${lieu.nom}, ${situationLieu(lieu)}, ${typesLieu[lieu.type].toLowerCase()}`}
              onClick={() => onChoisir(lieu)}
            >
              {/* Apparition en cascade : 40 ms d'écart entre deux repères */}
              <m.span
                className="repere__forme"
                aria-hidden="true"
                initial={reduit ? false : { scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.28, delay: i * 0.04, ease: EASE }}
              />
              <span className="repere__nom" aria-hidden="true">
                {lieu.nom}
              </span>
            </m.button>
          );
        })}
      </div>

      <p className="carte-voyages__legende" aria-hidden="true">
        <span className="carte-voyages__cle">
          <span className="repere-mini repere-mini--depart" />
          Départ
        </span>
        <span className="carte-voyages__cle">
          <span className="repere-mini repere-mini--voyage" />
          Voyage
        </span>
      </p>
    </div>
  );
}
