import projets from "./projets.json";
import expertises from "./expertises.json";
import passions from "./passions.json";
import voyages from "./voyages.json";

// Point d'accès unique aux 13 éléments du catalogue
export const elements = [...projets, ...expertises, ...passions];

// Infos par catégorie : segment d'URL, libellés, visuel par défaut
export const categories = {
  projet: { chemin: "projets", libelle: "Projet", pluriel: "Projets", code: "P", visuel: "Visuel projet" },
  expertise: { chemin: "expertises", libelle: "Expertise", pluriel: "Expertises", code: "E", visuel: "Illustration" },
  passion: { chemin: "passions", libelle: "Passion", pluriel: "Passions", code: "H", visuel: "Photo" },
};

export const contextes = {
  professionnel: "Professionnel",
  personnel: "Personnel",
};

export function trouverParSlug(categorie, slug) {
  return elements.find((e) => e.categorie === categorie && e.slug === slug);
}

/*
 * Lieux du Carnet de route (voyages.json). Ils ne font pas partie du catalogue
 * (ni filtres ni compteurs), mais on peut les ajouter à « Ma sélection » :
 * ils reçoivent donc les mêmes champs de base que les éléments (ref, titre…).
 */
export const CHEMIN_CARNET = "/passions/carnet-de-route";

export const lieux = voyages.map((l) => ({
  ...l,
  ref: l.id,
  titre: l.nom,
  categorie: "lieu",
  accroche: l.texte,
}));

export const typesLieu = { depart: "Départ", voyage: "Voyage" };

// « France · Normandie », « Irlande »
export function situationLieu(lieu) {
  return [lieu.pays, lieu.region].filter(Boolean).join(" · ");
}

export function trouverParRef(ref) {
  return elements.find((e) => e.ref === ref) ?? lieux.find((l) => l.ref === ref);
}

export function elementsDe(categorie) {
  return elements.filter((e) => e.categorie === categorie);
}

// URL de la fiche d'un élément, ex. /projets/mon-kit-solaire
// (un lieu s'ouvre dans le Carnet de route : /passions/carnet-de-route?lieu=L-03)
export function urlElement(element) {
  if (element.categorie === "lieu") return `${CHEMIN_CARNET}?lieu=${element.ref}`;
  return `/${categories[element.categorie].chemin}/${element.slug}`;
}

// « 4 » → « 04 » (compteurs en IBM Plex Mono)
export function deuxChiffres(n) {
  return String(n).padStart(2, "0");
}

/* ---------- Tri ---------- */

// Comparateurs élémentaires : vrai d'abord, puis nombre croissant (vide à la fin)
const vraiDabord = (cle) => (a, b) => Number(Boolean(cle(b))) - Number(Boolean(cle(a)));
const croissant = (cle) => (a, b) => (cle(a) ?? Infinity) - (cle(b) ?? Infinity);
// Année : plus récente d'abord ; « [AAAA] » (à compléter) ne compte pas
const annee = (e) => (/^\d{4}$/.test(e.annee ?? "") ? Number(e.annee) : null);
const anneeDecroissante = (a, b) => (annee(b) ?? -Infinity) - (annee(a) ?? -Infinity);

function enchainer(...comparateurs) {
  return (a, b) => {
    for (const c of comparateurs) {
      const r = c(a, b);
      if (r !== 0) return r;
    }
    return 0;
  };
}

const parOrdre = croissant((e) => e.ordre);

/**
 * Ordres de tri du catalogue :
 * - pertinence : badge TOP d'abord, puis l'ordre éditorial (champ « ordre »)
 * - recents : badge NOUVEAU, puis année décroissante, puis ordre
 * - demandes : classement (« Les plus demandées »), puis TOP, puis ordre
 */
export const tris = {
  pertinence: enchainer(vraiDabord((e) => e.badges?.top), parOrdre),
  recents: enchainer(vraiDabord((e) => e.badges?.nouveau), anneeDecroissante, parOrdre),
  demandes: enchainer(croissant((e) => e.classement), vraiDabord((e) => e.badges?.top), parOrdre),
};

export function trier(liste, tri = "pertinence") {
  return [...liste].sort(tris[tri] ?? tris.pertinence);
}

/* ---------- Filtres ---------- */

/**
 * Facettes du catalogue. Pour chacune :
 * - valeurs(e) : valeurs portées par un élément (tableau, vide si sans objet)
 * - options : toutes les valeurs possibles, dans l'ordre d'affichage
 * Une facette sans case cochée ne filtre rien. Avec des cases cochées,
 * seuls les éléments qui portent au moins une des valeurs restent
 * (ex. « Professionnel » coché → les passions, sans contexte, sortent).
 */
function valeursUniques(liste) {
  return [...new Set(liste)];
}

export const facettes = {
  cat: {
    legende: "Catégorie",
    valeurs: (e) => [categories[e.categorie].chemin],
    options: Object.values(categories).map((c) => ({ valeur: c.chemin, label: c.pluriel })),
  },
  outil: {
    legende: "Outils",
    valeurs: (e) => e.outils ?? [],
    options: valeursUniques(elements.flatMap((e) => e.outils ?? [])).map((o) => ({ valeur: o, label: o })),
  },
  contexte: {
    legende: "Contexte",
    valeurs: (e) => (e.contexte ? [e.contexte] : []),
    options: Object.entries(contextes).map(([valeur, label]) => ({ valeur, label })),
  },
  annee: {
    legende: "Année",
    valeurs: (e) => (e.annee ? [e.annee] : []),
    options: valeursUniques(elements.map((e) => e.annee).filter(Boolean))
      .sort()
      .reverse()
      .map((a) => ({ valeur: a, label: a })),
  },
};

// filtres : { cat: ["projets"], outil: [], ... } — tableau vide = facette inactive
export function correspond(element, filtres, sauf) {
  return Object.entries(filtres).every(([cle, choisis]) => {
    if (cle === sauf || !choisis?.length) return true;
    return facettes[cle].valeurs(element).some((v) => choisis.includes(v));
  });
}

export function filtrer(liste, filtres) {
  return liste.filter((e) => correspond(e, filtres));
}

/**
 * Nombre de résultats pour chaque option, compte tenu des AUTRES facettes
 * (comportement habituel des boutiques : cocher une option ne fait pas
 * tomber à zéro les autres options de la même facette).
 */
export function compterOption(cle, valeur, filtres) {
  return elements.filter(
    (e) => correspond(e, filtres, cle) && facettes[cle].valeurs(e).includes(valeur),
  ).length;
}

/* ---------- Liens entre éléments (fiches) ---------- */

const refsLiees = (e) => [
  ...(e.liens?.projets ?? []),
  ...(e.liens?.expertises ?? []),
  ...(e.liens?.passions ?? []),
];

/**
 * Éléments liés à un élément, dans les deux sens : ceux qu'il cite dans
 * « liens », et ceux qui le citent (ex. SEO ← Mon Kit Solaire).
 * - categorie : pour ne garder qu'une catégorie (ex. "projet")
 */
export function elementsLies(element, categorie) {
  const refs = new Set(refsLiees(element));
  for (const e of elements) {
    if (refsLiees(e).includes(element.ref)) refs.add(e.ref);
  }
  refs.delete(element.ref);
  return elements.filter(
    (e) => refs.has(e.ref) && (!categorie || e.categorie === categorie),
  );
}

// Fiches précédente et suivante dans la catégorie (en boucle)
export function voisins(element) {
  const liste = elementsDe(element.categorie).sort((a, b) => a.ordre - b.ordre);
  const i = liste.findIndex((e) => e.ref === element.ref);
  return {
    precedent: liste[(i - 1 + liste.length) % liste.length],
    suivant: liste[(i + 1) % liste.length],
  };
}
