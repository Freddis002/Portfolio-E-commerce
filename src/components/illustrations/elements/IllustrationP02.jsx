import "../Illustration.css";

// Cadrages : 16:9 (cartes) ou 1:1 (vignettes carrées) ; seul le viewBox change
const CADRAGES = { "16:9": "0 0 400 225", "1:1": "150 -5 230 230" };

/** P-02 Mon Grossiste Auto : voiture, colis, vitesse. Décorative. */
export default function IllustrationP02({ cadrage = "16:9" }) {
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
      <line x1="30" y1="194" x2="372" y2="194" />
      <line x1="22" y1="140" x2="44" y2="140" />
      <line x1="16" y1="152" x2="44" y2="152" className="ill-trait-pierre" />
      <line x1="26" y1="164" x2="44" y2="164" />
      <path
        d="M56 174V148C56 142 60 138 66 137L102 132L128 106C132 102 138 100 144 100H204C210 100 216 103 220 108L240 132L270 136C278 137 284 143 284 150V174Z"
        className="ill-blanc"
      />
      <path d="M134 130L150 112H180V130Z" className="ill-pale" />
      <path d="M188 112H204L220 130H188Z" className="ill-pale" />
      <line x1="184" y1="106" x2="184" y2="170" />
      <line x1="196" y1="144" x2="208" y2="144" />
      <rect x="274" y="144" width="8" height="8" />
      <circle cx="102" cy="174" r="20" className="ill-blanc" />
      <circle cx="102" cy="174" r="8" />
      <circle cx="244" cy="174" r="20" className="ill-blanc" />
      <circle cx="244" cy="174" r="8" />
      <rect x="300" y="138" width="62" height="56" className="ill-pale" />
      <line x1="331" y1="138" x2="331" y2="158" />
      <rect x="310" y="98" width="46" height="40" className="ill-blanc" />
      <line x1="333" y1="98" x2="333" y2="110" />
      <rect x="318" y="118" width="18" height="10" />
      <circle cx="348" cy="180" r="6" className="ill-orange" />
    </svg>
  );
}
