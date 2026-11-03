import "./EnBref.css";

/**
 * Bloc « En bref » des fiches : liste de caractéristiques façon fiche produit.
 * - lignes : [{ label, valeur }] ; les lignes sans valeur sont ignorées
 * - titre : petit label au-dessus (facultatif)
 */
export default function EnBref({ lignes, titre }) {
  return (
    <div className="en-bref">
      {titre && <p className="en-bref__titre label-mono">{titre}</p>}
      <dl className="en-bref__liste">
        {lignes
          .filter((l) => l.valeur)
          .map((l) => (
            <div key={l.label} className="en-bref__ligne">
              <dt className="en-bref__label">{l.label}</dt>
              <dd className="en-bref__valeur">{l.valeur}</dd>
            </div>
          ))}
      </dl>
    </div>
  );
}
