import "../Illustration.css";

/** E-04 Data & Analytics : tableau de bord, histogramme, anneau de progression. Décorative. */
export default function IllustrationE04() {
  return (
    <svg
      className="illustration"
      viewBox="0 0 400 225"
      aria-hidden="true"
      focusable="false"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ stroke: "var(--color-noir)" }}
    >
      <g transform="translate(24 30) scale(0.88)">
        <rect x="50" y="28" width="300" height="168" className="ill-blanc" />
        <line x1="72" y1="50" x2="150" y2="50" />
        <line x1="72" y1="60" x2="118" y2="60" className="ill-trait-pierre" />
        <line x1="74" y1="172" x2="222" y2="172" />
        <rect x="86" y="132" width="20" height="40" className="ill-blanc" />
        <rect x="118" y="108" width="20" height="64" className="ill-pale" />
        <rect x="150" y="120" width="20" height="52" className="ill-blanc" />
        <rect x="182" y="82" width="20" height="90" className="ill-orange" />
        <circle cx="288" cy="116" r="38" className="ill-trait-pale" strokeWidth="16" />
        <circle
          cx="288"
          cy="116"
          r="38"
          strokeWidth="16"
          strokeDasharray="90 149"
          transform="rotate(-90 288 116)"
        />
        <circle cx="288" cy="116" r="46" />
        <circle cx="288" cy="116" r="30" />
        <line x1="276" y1="112" x2="300" y2="112" />
        <line x1="280" y1="121" x2="296" y2="121" className="ill-trait-pierre" />
      </g>
    </svg>
  );
}
