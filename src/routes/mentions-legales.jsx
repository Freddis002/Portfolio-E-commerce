import { Link } from "react-router";
import profil from "../data/profil.json";
import { NOM, NOM_USUEL, ldFilAriane, metaPage } from "../lib/seo";
import AdresseEmail from "../components/AdresseEmail";
import PageLegale from "../components/PageLegale";

const FIL = [{ label: "Accueil", to: "/" }, { label: "Mentions légales" }];

export function meta() {
  return metaPage({
    titre: `Mentions légales · ${NOM}`,
    description: "Mentions légales du portfolio : éditeur, hébergement (OVH), propriété intellectuelle et crédits.",
    chemin: "/mentions-legales",
    jsonLd: [ldFilAriane(FIL, "/mentions-legales")],
  });
}

// Les champs entre crochets sont à compléter avant la mise en ligne
const SECTIONS = [
  {
    id: "editeur",
    titre: "Éditeur du site",
    contenu: (
      <>
        <p>Ce site est édité à titre personnel par {NOM_USUEL}, particulier.</p>
        <dl className="page-legale__infos">
          <dt>Adresse</dt>
          <dd>[Adresse à compléter], {profil.ville} ({profil.departement})</dd>
          <dt>Contact</dt>
          <dd>
            <AdresseEmail /> ou <Link to="/contact">formulaire de contact</Link>
          </dd>
          <dt>Directeur de publication</dt>
          <dd>{NOM_USUEL}</dd>
        </dl>
      </>
    ),
  },
  {
    id: "hebergeur",
    titre: "Hébergeur",
    contenu: (
      <p>
        OVH SAS · 2 rue Kellermann, 59100 Roubaix, France · [téléphone à vérifier sur ovhcloud.com].
      </p>
    ),
  },
  {
    id: "propriete",
    titre: "Propriété intellectuelle",
    contenu: (
      <p>
        Lorem ipsum dolor sit amet : textes, photos et visuels de ce site sont la propriété de{" "}
        {NOM_USUEL}, sauf mention contraire. Toute reproduction sans autorisation est interdite.
      </p>
    ),
  },
  {
    id: "credits",
    titre: "Crédits",
    contenu: (
      <ul>
        <li>Polices : Archivo et IBM Plex Mono (SIL Open Font License)</li>
        <li>Icônes : Lucide (licence ISC)</li>
        <li>Fond de carte du Carnet de route : Natural Earth (domaine public)</li>
        <li>Photos : [à compléter]</li>
      </ul>
    ),
  },
  {
    id: "donnees",
    titre: "Données personnelles",
    contenu: (
      <p>
        Le traitement des données du formulaire de contact et des statistiques est décrit dans la{" "}
        <Link to="/confidentialite">politique de confidentialité</Link>.
      </p>
    ),
  },
];

export default function MentionsLegales() {
  return <PageLegale fil={FIL} titre="Mentions légales" sections={SECTIONS} />;
}
