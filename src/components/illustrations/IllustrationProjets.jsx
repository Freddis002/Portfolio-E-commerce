import { useId } from "react";
import "./Illustration.css";

/**
 * Illustration de la catégorie Projets : une page de boutique en ligne
 * (barre d'adresse, panier, grille de produits, boutons).
 * Décorative : le titre de la tuile porte l'information.
 */
export default function IllustrationProjets() {
  // Identifiant unique du motif hachuré (React peut y mettre « : », invalide dans url(#…))
  const hachures = `hachures-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg
      className="illustration"
      viewBox="0 0 400 300"
      aria-hidden="true"
      focusable="false"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ stroke: "var(--color-noir)" }}
    >
      <defs>
        <pattern id={hachures} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" className="ill-trait-ligne" strokeWidth="2" />
        </pattern>
      </defs>
      <rect x="60" y="40" width="280" height="222" className="ill-blanc" />
      <line x1="60" y1="66" x2="340" y2="66" />
      <circle cx="76" cy="53" r="3.5" />
      <circle cx="89" cy="53" r="3.5" />
      <circle cx="102" cy="53" r="3.5" />
      <rect x="120" y="47" width="140" height="12" rx="6" />
      <path d="M290 47h4l4 14h14l3-10h-19" />
      <circle cx="300" cy="65" r="1.6" className="ill-noir" />
      <circle cx="311" cy="65" r="1.6" className="ill-noir" />
      <circle cx="318" cy="46" r="6" className="ill-orange" />
      <line x1="76" y1="84" x2="150" y2="84" />
      <line x1="76" y1="92" x2="120" y2="92" className="ill-trait-pierre" />
      <g>
        <rect x="76" y="106" width="76" height="62" fill={`url(#${hachures})`} />
        <rect x="76" y="106" width="76" height="62" />
        <line x1="76" y1="180" x2="140" y2="180" />
        <line x1="76" y1="189" x2="116" y2="189" className="ill-trait-pierre" />
      </g>
      <g>
        <rect x="162" y="106" width="76" height="62" className="ill-pale" />
        <rect x="162" y="106" width="76" height="62" />
        <path d="M176 156l16-18 12 12 8-8 14 14" />
        <circle cx="216" cy="124" r="5" />
        <line x1="162" y1="180" x2="226" y2="180" />
        <line x1="162" y1="189" x2="202" y2="189" className="ill-trait-pierre" />
      </g>
      <g>
        <rect x="248" y="106" width="76" height="62" fill={`url(#${hachures})`} />
        <rect x="248" y="106" width="76" height="62" />
        <line x1="248" y1="180" x2="312" y2="180" />
        <line x1="248" y1="189" x2="288" y2="189" className="ill-trait-pierre" />
      </g>
      <rect x="76" y="214" width="104" height="26" className="ill-noir" />
      <line x1="94" y1="227" x2="150" y2="227" className="ill-trait-blanc" />
      <path d="M158 223l4 4-4 4" className="ill-trait-blanc" />
      <rect x="190" y="214" width="70" height="26" />
      <line x1="204" y1="227" x2="246" y2="227" />
    </svg>
  );
}
