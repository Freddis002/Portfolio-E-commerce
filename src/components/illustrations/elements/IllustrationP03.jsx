import "../Illustration.css";

/** P-03 Les Petits Paniers : panier de produits frais. Décorative. */
export default function IllustrationP03() {
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
      <line x1="40" y1="200" x2="360" y2="200" />
      <path d="M142 118C142 46 258 46 258 118" />
      <path d="M154 118C154 62 246 62 246 118" />
      <circle cx="172" cy="104" r="20" className="ill-blanc" />
      <path d="M172 84c0-6 3-10 8-12" />
      <path d="M176 82c6-6 14-6 18-2c-6 5-12 5-18 2Z" className="ill-blanc" />
      <path d="M204 120L266 84L216 104Z" className="ill-orange" />
      <path d="M266 84l10-10M266 84l14-2M266 84l2-14" />
      <path d="M118 120c4-18 22-22 30-8c6-14 24-10 24 8" className="ill-blanc" />
      <path d="M104 118H296L276 194H124Z" className="ill-pale" />
      <line x1="110" y1="142" x2="290" y2="142" />
      <line x1="116" y1="166" x2="284" y2="166" />
      <line x1="152" y1="118" x2="160" y2="194" />
      <line x1="200" y1="118" x2="200" y2="194" />
      <line x1="248" y1="118" x2="240" y2="194" />
    </svg>
  );
}
