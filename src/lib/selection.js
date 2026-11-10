import { useSyncExternalStore } from "react";
import { trouverParRef } from "../data/catalogue";
import { track } from "./analytics";
import { selection } from "./stockage";

/*
 * Retours visuels et sonores de « Ma sélection », hors de React comme la
 * sélection elle-même (pas de contexte) : n'importe quel composant peut les
 * lire, et le rechargement à chaud de Vite ne les casse pas.
 * - dernierAjout : élément affiché dans le mini-panier (null = fermé)
 * - annonce : phrase lue par les lecteurs d'écran (zone aria-live)
 * - impulsion : augmente à chaque ajout ou retrait (pulsation du compteur) ;
 *   le chargement de la page ne la change pas, donc pas de pulsation au départ
 */
let retours = { dernierAjout: null, annonce: "", impulsion: 0 };
const abonnes = new Set();

function changer(modifs) {
  retours = { ...retours, ...modifs };
  abonnes.forEach((f) => f());
}

function abonner(f) {
  abonnes.add(f);
  return () => abonnes.delete(f);
}

const INITIAL = retours;

export function useRetoursSelection() {
  return useSyncExternalStore(abonner, () => retours, () => INITIAL);
}

// Fonction stable : fermeture du mini-panier
export const fermerMiniPanier = () => changer({ dernierAjout: null });

const nombre = (n) => `${n} élément${n > 1 ? "s" : ""}`;

/**
 * « Ma sélection » : utilisable dans n'importe quel composant, sans fournisseur.
 */
export function useSelection() {
  const refs = selection.utiliser();
  const contient = (ref) => refs.includes(ref);

  const retirer = (element) => {
    selection.retirer(element.ref);
    changer({
      dernierAjout: null,
      annonce: `${element.titre} retiré de votre sélection, ${nombre(refs.length - 1)}`,
      impulsion: retours.impulsion + 1,
    });
  };

  return {
    refs,
    count: refs.length,
    elements: refs.map(trouverParRef).filter(Boolean),
    contient,
    // Ajoute l'élément s'il n'y est pas, sinon le retire
    basculer(element) {
      if (contient(element.ref)) {
        retirer(element);
        return;
      }
      selection.ajouter(element.ref);
      track("ajout_selection", { id: element.ref });
      changer({
        dernierAjout: element,
        annonce: `${element.titre} ajouté à votre sélection, ${nombre(refs.length + 1)}`,
        impulsion: retours.impulsion + 1,
      });
    },
    retirer,
    vider() {
      selection.vider();
      changer({ dernierAjout: null, annonce: "Sélection vidée", impulsion: retours.impulsion + 1 });
    },
  };
}
