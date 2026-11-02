import { useSyncExternalStore } from "react";
import { trouverParRef } from "../data/catalogue";

/**
 * Liste de références (ex. ["P-02", "E-01"]) sauvegardée dans localStorage.
 * Seules des références d'éléments y sont stockées (règle de CLAUDE.md).
 *
 * useSyncExternalStore branche React sur cette liste : chaque composant qui
 * l'utilise se met à jour quand elle change, même depuis un autre onglet.
 * Pendant le pré-rendu et la première peinture, la liste est vide
 * (getServerSnapshot) : le HTML statique et le navigateur restent d'accord,
 * puis la vraie liste s'affiche juste après.
 */
const VIDE = [];

export function creerListe(cle, { max = Infinity } = {}) {
  let cache = null;
  const abonnes = new Set();

  function lire() {
    if (cache) return cache;
    try {
      const brut = JSON.parse(window.localStorage.getItem(cle));
      // On ne garde que des références qui existent encore dans le catalogue
      cache = Array.isArray(brut) ? brut.filter((ref) => trouverParRef(ref)) : VIDE;
    } catch {
      cache = VIDE;
    }
    return cache;
  }

  function ecrire(liste) {
    cache = liste.slice(0, max);
    try {
      window.localStorage.setItem(cle, JSON.stringify(cache));
    } catch {
      // Navigation privée ou stockage plein : la liste vit quand même en mémoire
    }
    abonnes.forEach((f) => f());
  }

  function abonner(f) {
    abonnes.add(f);
    const surStorage = (e) => {
      if (e.key === cle) {
        cache = null;
        f();
      }
    };
    window.addEventListener("storage", surStorage);
    return () => {
      abonnes.delete(f);
      window.removeEventListener("storage", surStorage);
    };
  }

  return {
    utiliser: () => useSyncExternalStore(abonner, lire, () => VIDE),
    ajouter: (ref) => !lire().includes(ref) && ecrire([...lire(), ref]),
    retirer: (ref) => ecrire(lire().filter((r) => r !== ref)),
    // Ajoute en tête et retire les doublons (fiches récemment consultées)
    placerEnTete: (ref) => ecrire([ref, ...lire().filter((r) => r !== ref)]),
    vider: () => ecrire(VIDE),
  };
}

// « Ma sélection » et « Récemment consultés »
export const selection = creerListe("selection");
export const fichesVues = creerListe("fiches-vues", { max: 6 });
