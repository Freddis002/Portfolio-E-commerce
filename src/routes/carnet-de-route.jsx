import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { LazyMotion, MotionConfig, domAnimation, useReducedMotion } from "motion/react";
import profil from "../data/profil.json";
import {
  CHEMIN_CARNET,
  deuxChiffres,
  lieux,
  situationLieu,
  trouverParRef,
  typesLieu,
  urlElement,
} from "../data/catalogue";
import { useEstMobile } from "../lib/fiche";
import { useApresHydratation } from "../lib/hydratation";
import { ldFilAriane, metaPage, urlAbsolue } from "../lib/seo";
import CarteVoyages, { ZONES, zoneDuLieu } from "../components/CarteVoyages";
import FicheLieu, { FicheLieuMobile } from "../components/FicheLieu";
import FilAriane from "../components/FilAriane";
import PointFinal from "../components/PointFinal";
import "./carnet-de-route.css";

const FIL = [
  { label: "Accueil", to: "/" },
  { label: "Catalogue", to: "/catalogue" },
  { label: "Passions", to: "/catalogue?cat=passions" },
  { label: "Carnet de route" },
];

const voyages = lieux.filter((l) => l.type === "voyage");
const nbPays = new Set(lieux.map((l) => l.pays)).size;
const FILTRES = [
  { cle: "france", libelle: "France" },
  { cle: "etranger", libelle: "Étranger" },
];

export function meta() {
  return metaPage({
    titre: `Carnet de route : voyages au départ d'${profil.ville} · ${profil.nom} ${profil.prenom}`,
    description: `Carte des voyages et des lieux photographiés au départ d'${profil.ville} (${profil.region}) : France, Espagne, Irlande, Pays-Bas, Vietnam. Passion H-02 Voyages.`,
    chemin: CHEMIN_CARNET,
    // Données structurées : la liste des lieux (avec coordonnées) et le fil d'Ariane
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Carnet de route",
        numberOfItems: lieux.length,
        itemListElement: lieux.map((l, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: urlAbsolue(urlElement(l)),
          item: {
            "@type": "Place",
            name: l.nom,
            address: {
              "@type": "PostalAddress",
              addressCountry: l.pays,
              ...(l.region && { addressRegion: l.region }),
            },
            geo: { "@type": "GeoCoordinates", latitude: l.latitude, longitude: l.longitude },
          },
        })),
      },
      ldFilAriane(FIL, CHEMIN_CARNET),
    ],
  });
}

export default function CarnetDeRoute() {
  const pret = useApresHydratation();
  const [params] = useSearchParams();
  const naviguer = useNavigate();
  const mobile = useEstMobile();
  const reduit = useReducedMotion();
  const carteRef = useRef(null);

  const [filtres, setFiltres] = useState({ france: true, etranger: true });
  const [zoneChoisie, setZoneChoisie] = useState(null);
  // Vue par défaut : Monde en desktop, Europe sur mobile (carte plus étroite)
  const zone = zoneChoisie ?? (mobile ? "europe" : "monde");

  // Le départ (Arras) reste toujours affiché
  const visibles = lieux.filter((l) => l.type === "depart" || filtres[l.zone]);
  const refLieu = pret ? params.get("lieu") : null;
  const lieu = visibles.find((l) => l.ref === refLieu) ?? null;

  // Lien partagé (?lieu=L-08) : on cadre la carte sur la zone du lieu
  useEffect(() => {
    const depart = refLieu && trouverParRef(refLieu);
    if (depart?.categorie === "lieu") setZoneChoisie(zoneDuLieu(depart));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pret]);

  // L'URL reflète le lieu choisi, pour pouvoir le partager
  const ouvrir = (l) =>
    naviguer({ search: l ? `?lieu=${l.ref}` : "" }, { replace: true, preventScrollReset: true });

  const voisin = (ecart) => {
    const i = visibles.findIndex((l) => l.ref === lieu?.ref);
    ouvrir(visibles[(Math.max(i, 0) + ecart + visibles.length) % visibles.length]);
  };

  // « Voir sur la carte » depuis la liste : filtres ouverts, zone du lieu, défilement
  const voirSurCarte = (l) => {
    setFiltres({ france: true, etranger: true });
    setZoneChoisie(zoneDuLieu(l));
    carteRef.current?.scrollIntoView({ behavior: reduit ? "auto" : "smooth", block: "start" });
  };

  const nbVisibles = visibles.filter((l) => l.type === "voyage").length;

  return (
    // domAnimation : la part de Motion utile ici (animations, pas de mise en page)
    // reducedMotion="user" : mouvements coupés si le système le demande
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <main id="contenu" className="carnet">
          <header className="carnet__entete conteneur">
            <FilAriane court items={FIL} />
            <div className="carnet__entete-ligne">
              <div className="carnet__intro">
                <p className="carnet__passions label-mono">
                  <Link to={urlElement(trouverParRef("H-02"))}>H-02 Voyages</Link>
                  {" · "}
                  <Link to={urlElement(trouverParRef("H-01"))}>H-01 Photographie</Link>
                </p>
                <h1 className="carnet__titre">
                  Carnet de route
                  <PointFinal />
                </h1>
                <p className="carnet__texte">
                  Lorem ipsum dolor sit amet : les voyages et les lieux photographiés, au départ
                  d'{profil.ville}, en {profil.region}.
                </p>
              </div>
              <dl className="carnet__chiffres">
                {[
                  ["Lieux", deuxChiffres(voyages.length)],
                  ["Pays", deuxChiffres(nbPays)],
                  ["Photos", "[XXX]"],
                  ["Depuis", "[AAAA]"],
                ].map(([label, valeur]) => (
                  <div key={label} className="carnet__chiffre">
                    <dt className="label-mono">{label}</dt>
                    <dd>{valeur}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </header>

          {/* Barre d'outils : filtres et zoom */}
          <div className="carnet__ancre conteneur" ref={carteRef}>
          <div className="carnet__outils">
            <div className="carnet__filtres" role="group" aria-label="Filtrer par destination">
              {FILTRES.map((f) => (
                <button
                  key={f.cle}
                  type="button"
                  className="carnet__filtre"
                  aria-pressed={filtres[f.cle]}
                  onClick={() => setFiltres({ ...filtres, [f.cle]: !filtres[f.cle] })}
                >
                  <span className="carnet__filtre-marque" aria-hidden="true" />
                  {f.libelle}
                  <span className="carnet__filtre-nombre">
                    {deuxChiffres(voyages.filter((l) => l.zone === f.cle).length)}
                  </span>
                </button>
              ))}
            </div>
            <div className="carnet__reglages">
              <p className="carnet__nombre label-mono" role="status">
                {deuxChiffres(nbVisibles)} lieux
              </p>
              <div className="carnet__zones" role="group" aria-label="Zone affichée">
                {Object.entries(ZONES).map(([cle, z]) => (
                  <button
                    key={cle}
                    type="button"
                    className="carnet__zone"
                    aria-pressed={zone === cle}
                    onClick={() => setZoneChoisie(cle)}
                  >
                    {z.libelle}
                  </button>
                ))}
              </div>
            </div>
          </div>
          </div>

          {/* Carte + fiche du lieu */}
          <div className="carnet__corps conteneur">
            <div className="carnet__carte">
              <CarteVoyages
                lieux={visibles}
                actif={lieu?.ref}
                zone={zone}
                mobile={mobile}
                onChoisir={ouvrir}
              />
              <p className="carnet__note">
                Années, villes et photos à compléter. Projection Equal Earth, données Natural Earth.
              </p>
            </div>
            {!mobile && (
              <FicheLieu lieu={lieu} onPrecedent={() => voisin(-1)} onSuivant={() => voisin(1)} />
            )}
          </div>

          {/* Tous les lieux : toujours dans le HTML (alternative accessible, lue par Google et les IA) */}
          <section className="carnet__liste conteneur" aria-labelledby="carnet-tous">
            <h2 id="carnet-tous" className="carnet__liste-titre">
              Tous les lieux
            </h2>
            <ul className="carnet__lieux">
              {lieux.map((l) => (
                <li key={l.ref} className="carnet__lieu">
                  <span className={`carnet__lieu-forme repere-mini repere-mini--${l.type}`} aria-hidden="true" />
                  <span className="carnet__lieu-ref label-mono">{l.ref}</span>
                  <span className="carnet__lieu-nom">{l.nom}</span>
                  <span className="carnet__lieu-situation">
                    {l.type === "depart" ? `${situationLieu(l)} · point de départ` : situationLieu(l)}
                    {/* Sur mobile, l'année passe sur cette ligne (colonne Année masquée) */}
                    <span className="carnet__lieu-annee-mobile" aria-hidden="true"> · {l.annee}</span>
                  </span>
                  <span className="carnet__lieu-type label-mono">{typesLieu[l.type]}</span>
                  <span className="carnet__lieu-annee label-mono">{l.annee}</span>
                  <Link
                    to={{ search: `?lieu=${l.ref}` }}
                    replace
                    preventScrollReset
                    className="carnet__lieu-lien"
                    onClick={() => voirSurCarte(l)}
                  >
                    <span className="carnet__lieu-lien-texte">Voir sur la carte</span> <span aria-hidden="true">→</span>
                    <span className="visuellement-cache"> : {l.nom}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Mobile : fiche fixée en bas de l'écran, et la place qu'elle occupe */}
          {mobile && lieu && (
            <>
              <div className="carnet__espace-fiche" aria-hidden="true" />
              <FicheLieuMobile lieu={lieu} onFermer={() => ouvrir(null)} />
            </>
          )}
        </main>
      </MotionConfig>
    </LazyMotion>
  );
}
