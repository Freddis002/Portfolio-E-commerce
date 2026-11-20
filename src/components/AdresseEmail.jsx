import profil from "../data/profil.json";
import { useApresHydratation } from "../lib/hydratation";

/**
 * Adresse e-mail protégée des robots collecteurs.
 *
 * L'adresse n'est jamais écrite en entier dans le HTML : profil.json la
 * stocke en deux morceaux (utilisateur, domaine). Le HTML pré-rendu affiche
 * « utilisateur [at] domaine.fr », lisible par un humain ; une fois la page
 * chargée dans le navigateur, elle devient un vrai lien « mailto: ».
 */
export default function AdresseEmail({ className = "" }) {
  const pret = useApresHydratation();
  const { utilisateur, domaine } = profil.email ?? {};

  if (!utilisateur || !domaine) return <span className={className}>[E-mail à compléter]</span>;

  if (!pret) {
    return (
      <span className={className}>
        {utilisateur} [at] {domaine}
      </span>
    );
  }
  const adresse = [utilisateur, domaine].join("@");
  return (
    <a href={`mailto:${adresse}`} className={className}>
      {adresse}
    </a>
  );
}
