import profil from "../data/profil.json";

/**
 * Lien vers le profil LinkedIn (adresse dans profil.json).
 * Lien sortant : nouvel onglet, rel="noopener noreferrer" (la page ouverte ne
 * peut ni contrôler ce site ni savoir d'où vient le visiteur).
 * Tant que l'adresse n'est pas renseignée : simple texte, pas de faux lien.
 */
export default function LienLinkedIn({ className = "" }) {
  if (!/^https:\/\//.test(profil.linkedin ?? "")) {
    return <span className={className}>[LinkedIn à compléter]</span>;
  }
  return (
    <a href={profil.linkedin} className={className} target="_blank" rel="noopener noreferrer">
      LinkedIn <span aria-hidden="true">↗</span>
      <span className="visuellement-cache"> (nouvel onglet)</span>
    </a>
  );
}
