import FilAriane from "./FilAriane";
import PointFinal from "./PointFinal";
import "./PageLegale.css";

/**
 * Gabarit des pages légales (Mentions légales, Confidentialité) :
 * fil d'Ariane, sommaire à gauche, sections numérotées « 01 · Titre ».
 * - fil : items du fil d'Ariane ; titre : H1 ; miseAJour : date affichée
 * - sections : [{ id, titre, contenu }] ; l'id sert d'ancre (#cookies…)
 */
export default function PageLegale({ fil, titre, miseAJour = "[JJ/MM/AAAA]", sections }) {
  const numero = (i) => String(i + 1).padStart(2, "0");
  return (
    <main id="contenu" className="page-legale conteneur">
      <FilAriane items={fil} />
      <div className="page-legale__corps">
        <nav className="page-legale__sommaire" aria-labelledby="sommaire-titre">
          <p id="sommaire-titre" className="label-mono">
            Sommaire
          </p>
          <ol>
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>
                  {numero(i)} {s.titre}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="page-legale__contenu">
          <h1 className="page-legale__titre">
            {titre}
            <PointFinal />
          </h1>
          <p className="label-mono">Dernière mise à jour · {miseAJour}</p>
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="page-legale__section" aria-labelledby={`${s.id}-titre`}>
              <h2 id={`${s.id}-titre`} className="page-legale__h2">
                {numero(i)} · {s.titre}
              </h2>
              {s.contenu}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
