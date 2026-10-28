import { Link } from "react-router";
import "./FilAriane.css";

/**
 * Fil d'Ariane. Le dernier élément est la page courante (non cliquable).
 * - items : [{ label, to }] ; le dernier n'a pas besoin de « to »
 * (Le JSON-LD BreadcrumbList sera ajouté à l'étape SEO à partir des mêmes items.)
 */
export default function FilAriane({ items }) {
  return (
    <nav className="fil-ariane" aria-label="Fil d'Ariane">
      <ol className="fil-ariane__liste">
        {items.map((item, i) => {
          const dernier = i === items.length - 1;
          return (
            <li key={item.label} className="fil-ariane__item">
              {dernier ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link to={item.to}>{item.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
