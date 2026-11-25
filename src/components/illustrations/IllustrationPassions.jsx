import "./Illustration.css";

/**
 * Illustration de la catégorie Passions : carte postale (voyages), appareil photo,
 * kettlebell (CrossFit), jeton de poker.
 * Décorative : le titre de la tuile porte l'information.
 */
export default function IllustrationPassions() {
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
      <g transform="rotate(-6 120 92)">
        <rect x="46" y="44" width="150" height="100" className="ill-blanc" />
        <rect x="166" y="54" width="20" height="24" />
        <line x1="132" y1="58" x2="132" y2="132" strokeDasharray="4 4" />
        <path d="M58 108c10-12 22-14 30-6s16 8 26-2" />
        <path d="M62 126c12-6 24-4 34 2s18 4 26-4" className="ill-trait-pierre" />
        <circle cx="92" cy="84" r="7" className="ill-orange" />
        <line x1="142" y1="100" x2="186" y2="100" />
        <line x1="142" y1="112" x2="178" y2="112" />
        <line x1="142" y1="124" x2="182" y2="124" />
      </g>
      <rect x="232" y="54" width="38" height="16" className="ill-blanc" />
      <rect x="214" y="68" width="136" height="88" className="ill-pale" />
      <rect x="322" y="78" width="16" height="10" />
      <circle cx="282" cy="112" r="30" className="ill-blanc" />
      <circle cx="282" cy="112" r="18" />
      <circle cx="282" cy="112" r="7" />
      <path d="M90 228C78 140 176 140 164 228H150C158 168 96 168 104 228Z" className="ill-blanc" />
      <path
        d="M127 210C168 210 180 242 166 268C164 272 160 274 156 274H98C94 274 90 272 88 268C74 242 86 210 127 210Z"
        className="ill-blanc"
      />
      <circle cx="292" cy="226" r="40" className="ill-pale" />
      <circle cx="292" cy="226" r="33" strokeWidth="7" strokeDasharray="10 11" />
      <circle cx="292" cy="226" r="22" className="ill-blanc" />
      <path
        d="M292 216c-6 6-10 9-10 13a5 5 0 0 0 9 3l-2 6h6l-2-6a5 5 0 0 0 9-3c0-4-4-7-10-13Z"
        className="ill-noir"
        stroke="none"
      />
    </svg>
  );
}
