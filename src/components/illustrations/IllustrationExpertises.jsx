import "./Illustration.css";

/**
 * Illustration de la catégorie Expertises : pastilles, courbe de performance
 * qui monte, loupe d'analyse.
 * Décorative : le titre de la tuile porte l'information.
 */
export default function IllustrationExpertises() {
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
      <rect x="50" y="40" width="300" height="222" className="ill-blanc" />
      <rect x="74" y="60" width="58" height="18" rx="9" className="ill-noir" />
      <line x1="88" y1="69" x2="118" y2="69" className="ill-trait-blanc" />
      <rect x="140" y="60" width="70" height="18" rx="9" />
      <line x1="154" y1="69" x2="196" y2="69" />
      <rect x="218" y="60" width="50" height="18" rx="9" />
      <line x1="232" y1="69" x2="254" y2="69" />
      <line x1="80" y1="232" x2="326" y2="232" />
      <line x1="80" y1="100" x2="80" y2="232" />
      <line x1="76" y1="134" x2="80" y2="134" />
      <line x1="76" y1="168" x2="80" y2="168" />
      <line x1="76" y1="202" x2="80" y2="202" />
      <path d="M80 232V206l46-12 46 8 46-38 46-16 46-34V232Z" className="ill-pale" stroke="none" />
      <path d="M80 206l46-12 46 8 46-38 46-16 46-34" />
      <circle cx="126" cy="194" r="3" className="ill-blanc" />
      <circle cx="172" cy="202" r="3" className="ill-blanc" />
      <circle cx="218" cy="164" r="3" className="ill-blanc" />
      <circle cx="264" cy="148" r="3" className="ill-blanc" />
      <circle cx="310" cy="114" r="7" className="ill-orange" />
      <circle cx="152" cy="150" r="30" className="ill-blanc" />
      <circle cx="152" cy="150" r="21" />
      <path d="M140 156l8-10 7 6 9-12" />
      <path d="M173 171l22 22" strokeWidth="7" />
    </svg>
  );
}
