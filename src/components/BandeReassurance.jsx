import { CalendarDays, FileDown, MapPin, Route } from "lucide-react";
import "./BandeReassurance.css";

// Contenu par défaut, repris de la maquette d'accueil
const ARGUMENTS_DEFAUT = [
  { icone: MapPin, titre: "Basé à Arras", texte: "Lorem ipsum dolor sit amet" },
  { icone: Route, titre: "Mobile en Hauts-de-France", texte: "Lille · Lens · Douai · Amiens" },
  { icone: CalendarDays, titre: "Disponibilité : [lorem]", texte: "CDI · temps plein" },
  { icone: FileDown, titre: "CV en PDF", texte: "Téléchargement direct" },
];

/**
 * Bande de réassurance : 4 arguments courts avec icône Lucide (24 px, trait 1,5).
 * - items : [{ icone, titre, texte }]
 */
export default function BandeReassurance({ items = ARGUMENTS_DEFAUT }) {
  return (
    <section className="reassurance" aria-label="En bref">
      <ul className="reassurance__liste conteneur">
        {items.map(({ icone: Icone, titre, texte }) => (
          <li key={titre} className="reassurance__item">
            <Icone size={24} strokeWidth={1.5} aria-hidden="true" className="reassurance__icone" />
            <div>
              <p className="reassurance__titre">{titre}</p>
              <p className="reassurance__texte">{texte}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
