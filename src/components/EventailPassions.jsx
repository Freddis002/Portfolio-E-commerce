import { useState } from "react";
import { Link } from "react-router";
import { CHEMIN_CARNET, deuxChiffres, elementsDe, lieux, urlElement } from "../data/catalogue";
import { photoPubliee } from "../lib/photos";
import { positionSurCarte } from "../lib/projection";
import ImageEmplacement from "./ImageEmplacement";
import Photo from "./Photo";
import PointFinal from "./PointFinal";
import "./EventailPassions.css";

/*
 * « Au-delà du bureau » (accueil) : les passions en éventail de cartes de jeu.
 * Maquettes : docs/maquettes/source/AccueilDecouvrir(.Mobile).dc.html
 *
 * - Desktop / tablette : cartes en 3D. Une carte « active » est au premier plan ;
 *   elle change au survol et au focus clavier. Les autres pivotent vers elle.
 * - Mobile (< 768 px) : simple liste verticale, sans 3D (voir le CSS).
 * Tout est calculé depuis les données : passions, lieux du carnet, photos publiées.
 */

const passions = elementsDe("passion");
const ACTIVE_DEFAUT = Math.max(0, passions.findIndex((p) => p.slug === "voyages"));

// Carte du monde : repères des lieux (en % de la carte), le départ en carré noir
const reperes = lieux.map((l) => ({ id: l.id, depart: l.type === "depart", ...positionSurCarte(l.latitude, l.longitude) }));
const nbVoyages = lieux.filter((l) => l.type === "voyage").length;
const nbPays = new Set(lieux.map((l) => l.pays)).size;

// Visuel de chaque passion : la carte pour Voyages, sinon la photo publiée
const visuels = passions.map((p) => ({
  carte: p.slug === "voyages",
  photo: photoPubliee(`/photos/passions/${p.slug}`),
}));

// Légende sous l'éventail, ex. « H-02 · VOYAGES · 13 LIEUX · 05 PAYS »
function legende(i) {
  const p = passions[i];
  const { carte, photo } = visuels[i];
  const detail = carte
    ? `${deuxChiffres(nbVoyages)} lieux · ${deuxChiffres(nbPays)} pays`
    : photo
      ? null
      : "[Photo à venir]";
  return [p.ref, p.titre, detail].filter(Boolean).join(" · ");
}

// Position 3D d'une carte selon sa distance à la carte active
function position(i, active) {
  const d = i - active;
  return {
    "--gauche": `${10 + i * 116}px`,
    "--profondeur": 10 - Math.abs(d),
    "--transformation":
      d === 0
        ? "translateZ(70px) rotateY(0deg) rotateX(0deg)"
        : `translateZ(${-Math.abs(d) * 30}px) rotateY(${d < 0 ? 38 : -38}deg) rotateX(4deg)`,
  };
}

function Visuel({ index }) {
  const { carte, photo } = visuels[index];
  if (carte) {
    return (
      <span className="eventail__visuel eventail__visuel--carte" aria-hidden="true">
        <span className="eventail__monde">
          <img src="/carte/monde.svg" alt="" width="1000" height="437" />
          {reperes.map((r) => (
            <span
              key={r.id}
              className={`eventail__repere ${r.depart ? "eventail__repere--depart" : ""}`}
              style={{ left: `${r.x}%`, top: `${r.y}%` }}
            />
          ))}
        </span>
      </span>
    );
  }
  if (photo) {
    return (
      <span className="eventail__visuel" aria-hidden="true">
        <Photo src={photo.src} alt="" largeur={photo.largeur} hauteur={photo.hauteur} remplir />
      </span>
    );
  }
  return (
    <span className="eventail__visuel" aria-hidden="true">
      <ImageEmplacement type="Photo" ratio="1:1" remplir decoratif />
    </span>
  );
}

export default function EventailPassions() {
  const [active, setActive] = useState(ACTIVE_DEFAUT);

  return (
    <div className="eventail">
      <div className="eventail__entete">
        <h2 id="acc-passions" className="eventail__titre">
          Au-delà <br className="eventail__coupure" />
          du bureau
          <PointFinal />
        </h2>
        <span className="eventail__collection label-mono">
          Collection <br className="eventail__coupure" />
          Passions · {deuxChiffres(passions.length)}
        </span>
      </div>

      <ul className="eventail__cartes" aria-label="Mes passions">
        {passions.map((p, i) => (
          <li key={p.ref} className="eventail__place" style={position(i, active)}>
            <Link
              to={urlElement(p)}
              className={[
                "eventail__carte",
                i === active && "eventail__carte--active",
                visuels[i].carte && "eventail__carte--vedette",
              ]
                .filter(Boolean)
                .join(" ")}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              {/* Grille : ref et flèche en haut, visuel, nom (desktop) ;
                  vignette à gauche, ref et nom au centre, flèche à droite (mobile) */}
              <span className="eventail__ref">{p.ref}</span>
              <span className="eventail__fleche" aria-hidden="true">
                →
              </span>
              <Visuel index={i} />
              <span className="eventail__nom">{p.titre}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="eventail__pied">
        <span className="eventail__legende label-mono">{legende(active)}</span>
        <Link to={CHEMIN_CARNET} className="eventail__lien">
          Ouvrir le carnet de route <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
