import { useSyncExternalStore } from "react";
import { trouverParRef } from "../data/catalogue";
import { selection } from "./stockage";

/*
 * Dernier élément ajouté, pour la notification « ✓ Ajouté à votre sélection ».
 * Comme la sélection, il vit hors de React (pas de contexte) : n'importe quel
 * composant peut le lire, et le rechargement à chaud de Vite ne le casse pas.
 */
let dernierAjout = null;
const abonnes = new Set();

function changerDernierAjout(element) {
  dernierAjout = element;
  abonnes.forEach((f) => f());
}

function abonner(f) {
  abonnes.add(f);
  return () => abonnes.delete(f);
}

// Fonction stable : le minuteur de la notification n'est pas relancé à chaque rendu
const fermer = () => changerDernierAjout(null);

export function useDernierAjout() {
  const element = useSyncExternalStore(abonner, () => dernierAjout, () => null);
  return { element, fermer };
}

/**
 * « Ma sélection » : utilisable dans n'importe quel composant, sans fournisseur.
 */
export function useSelection() {
  const refs = selection.utiliser();
  const contient = (ref) => refs.includes(ref);
  return {
    refs,
    count: refs.length,
    elements: refs.map(trouverParRef),
    contient,
    // Ajoute l'élément s'il n'y est pas, sinon le retire
    basculer(element) {
      if (contient(element.ref)) {
        selection.retirer(element.ref);
        changerDernierAjout(null);
      } else {
        selection.ajouter(element.ref);
        changerDernierAjout(element);
      }
    },
    retirer: (ref) => selection.retirer(ref),
  };
}
