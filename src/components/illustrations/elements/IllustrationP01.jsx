import "../Illustration.css";

/** P-01 Mon Kit Solaire : maison, soleil, panneau solaire. Décorative. */
export default function IllustrationP01() {
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
      <line x1="40" y1="192" x2="380" y2="192" />
      <g>
        <line x1="320" y1="22" x2="320" y2="30" />
        <line x1="320" y1="74" x2="320" y2="82" />
        <line x1="290" y1="52" x2="298" y2="52" />
        <line x1="342" y1="52" x2="350" y2="52" />
        <line x1="299" y1="31" x2="305" y2="37" />
        <line x1="335" y1="67" x2="341" y2="73" />
        <line x1="341" y1="31" x2="335" y2="37" />
        <line x1="305" y1="67" x2="299" y2="73" />
      </g>
      <circle cx="320" cy="52" r="15" className="ill-orange" />
      <rect x="104" y="118" width="130" height="74" className="ill-blanc" />
      <path d="M88 122L169 66L250 122" />
      <rect x="118" y="134" width="26" height="22" />
      <line x1="131" y1="134" x2="131" y2="156" />
      <rect x="160" y="148" width="28" height="44" />
      <line x1="198" y1="138" x2="222" y2="138" />
      <line x1="198" y1="148" x2="216" y2="148" className="ill-trait-pierre" />
      <path d="M268 128H352L372 172H288Z" className="ill-pale" />
      <line x1="296" y1="128" x2="316" y2="172" />
      <line x1="324" y1="128" x2="344" y2="172" />
      <line x1="278" y1="150" x2="362" y2="150" />
      <line x1="330" y1="172" x2="330" y2="192" />
    </svg>
  );
}
