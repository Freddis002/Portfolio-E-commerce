import "../Illustration.css";

// Cadrages : 16:9 (cartes) ou 1:1 (vignettes carrées) ; seul le viewBox change
const CADRAGES = { "16:9": "0 0 400 225", "1:1": "88 0 225 225" };

/** E-05 Web : écran avec code, ordinateur portable et mobile. Décorative. */
export default function IllustrationE05({ cadrage = "16:9" }) {
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
      <g transform="translate(24 30) scale(0.88)">
        <rect x="64" y="34" width="210" height="130" className="ill-blanc" />
        <line x1="64" y1="54" x2="274" y2="54" />
        <circle cx="78" cy="44" r="3" />
        <circle cx="90" cy="44" r="3" />
        <circle cx="102" cy="44" r="3" />
        <path d="M44 164H294L282 180H56Z" className="ill-blanc" />
        <path d="M116 84l-18 16 18 16" />
        <path d="M150 74l-14 52" />
        <path d="M168 84l18 16-18 16" />
        <rect x="200" y="91" width="6" height="18" className="ill-orange" stroke="none" />
        <line x1="92" y1="140" x2="170" y2="140" />
        <line x1="92" y1="150" x2="140" y2="150" className="ill-trait-pierre" />
        <rect x="300" y="62" width="66" height="118" className="ill-pale" />
        <rect x="308" y="78" width="50" height="86" className="ill-blanc" />
        <line x1="324" y1="70" x2="342" y2="70" />
        <rect x="314" y="86" width="38" height="24" className="ill-pale" />
        <line x1="314" y1="120" x2="352" y2="120" />
        <line x1="314" y1="130" x2="340" y2="130" className="ill-trait-pierre" />
        <rect x="314" y="142" width="24" height="12" />
      </g>
    </svg>
  );
}
