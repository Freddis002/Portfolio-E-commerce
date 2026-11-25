import "../Illustration.css";

// Dessin carré (225 × 225) : centré dans le 16:9 grâce au viewBox élargi
const CADRAGES = { "16:9": "-87.5 0 400 225", "1:1": "0 0 225 225" };

/** P-04 Chti Poker Club : cartes, bulle de discussion, jeton. Décorative. */
export default function IllustrationP04({ cadrage = "16:9" }) {
  return (
    <svg
      className="illustration"
      viewBox={CADRAGES[cadrage]}
      aria-hidden="true"
      focusable="false"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ stroke: "var(--color-noir)" }}
    >
      <g transform="rotate(-10 80 96)">
        <rect x="40" y="40" width="80" height="112" className="ill-blanc" />
        <rect x="50" y="50" width="60" height="92" />
      </g>
      <g transform="rotate(8 126 92)">
        <rect x="86" y="36" width="80" height="112" className="ill-pale" />
        <path
          d="M126 76c-9 9-14 13-14 18a7 7 0 0 0 12 4l-3 9h10l-3-9a7 7 0 0 0 12-4c0-5-5-9-14-18Z"
          className="ill-noir"
          stroke="none"
        />
      </g>
      <path d="M28 158H100V192H60L46 204V192H28Z" className="ill-blanc" />
      <line x1="40" y1="170" x2="86" y2="170" />
      <line x1="40" y1="180" x2="72" y2="180" className="ill-trait-pierre" />
      <circle cx="164" cy="170" r="30" className="ill-blanc" />
      <circle cx="164" cy="170" r="24" strokeWidth="6" strokeDasharray="8 8" />
      <circle cx="164" cy="170" r="14" className="ill-blanc" />
      <circle cx="164" cy="170" r="6" className="ill-orange" />
    </svg>
  );
}
