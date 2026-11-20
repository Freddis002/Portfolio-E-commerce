import { NOM, NOM_USUEL, ldFilAriane, metaPage } from "../lib/seo";
import { ouvrirPanneauCookies } from "../lib/consentement";
import AdresseEmail from "../components/AdresseEmail";
import Bouton from "../components/Bouton";
import PageLegale from "../components/PageLegale";

const FIL = [{ label: "Accueil", to: "/" }, { label: "Confidentialité" }];

export function meta() {
  return metaPage({
    titre: `Confidentialité · ${NOM}`,
    description:
      "Politique de confidentialité : données du formulaire de contact, mesure d'audience sans cookies, gestion des cookies et vos droits.",
    chemin: "/confidentialite",
    jsonLd: [ldFilAriane(FIL, "/confidentialite")],
  });
}

// Traitements de données : ce que le site fait réellement (voir lib/ et public/api/)
const TRAITEMENTS = [
  {
    nom: "Formulaire de contact",
    donnees: "Nom, e-mail, objet, message, sélection",
    base: "Votre demande (mesures précontractuelles)",
    duree: "[X] mois après le dernier échange",
  },
  {
    nom: "Protection anti-robots du formulaire",
    donnees: "Empreinte chiffrée de l'adresse IP (jamais l'IP en clair)",
    base: "Intérêt légitime (sécurité)",
    duree: "1 heure",
  },
  {
    nom: "Ma sélection et fiches vues",
    donnees: "Identifiants des fiches, sur votre appareil (stockage local)",
    base: "Fonctionnement du site",
    duree: "Jusqu'à suppression par vous",
  },
  {
    nom: "Matomo (sans cookies)",
    donnees: "Pages vues, événements du site, IP anonymisée",
    base: "Intérêt légitime (exempté de consentement)",
    duree: "[25] mois maximum",
  },
  {
    nom: "Microsoft Clarity",
    donnees: "Clics, défilement, sessions anonymisées",
    base: "Votre consentement",
    duree: "[À vérifier chez Microsoft]",
  },
];

const SECTIONS = [
  {
    id: "resume",
    titre: "En résumé",
    contenu: (
      <ul className="page-legale__resume">
        <li>
          <strong>Aucune inscription</strong>
          Ma sélection reste sur votre appareil.
        </li>
        <li>
          <strong>Aucune revente</strong>
          Vos messages servent uniquement à vous répondre.
        </li>
        <li>
          <strong>Vous choisissez</strong>
          Clarity ne s'active qu'avec votre accord.
        </li>
      </ul>
    ),
  },
  {
    id: "donnees",
    titre: "Données traitées",
    contenu: (
      <>
        <p>Responsable du traitement : {NOM_USUEL}, éditeur du site.</p>
        <div className="page-legale__tableau">
          <table>
            <thead>
              <tr>
                <th scope="col">Traitement</th>
                <th scope="col">Données</th>
                <th scope="col">Base légale</th>
                <th scope="col">Conservation</th>
              </tr>
            </thead>
            <tbody>
              {TRAITEMENTS.map((t) => (
                <tr key={t.nom}>
                  <th scope="row">{t.nom}</th>
                  <td>{t.donnees}</td>
                  <td>{t.base}</td>
                  <td>{t.duree}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Destinataires : {NOM_USUEL} uniquement. Hébergement : OVH SAS, en France. Microsoft
          Clarity : [lieu de stockage et garanties de transfert à vérifier chez Microsoft].
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    titre: "Cookies",
    contenu: (
      <>
        <p>
          Seul Microsoft Clarity dépose des cookies, et uniquement si vous les acceptez. Votre choix est
          gardé 6 mois dans un cookie technique (« consentement »), puis il vous est redemandé. Vous
          pouvez changer d'avis à tout moment.
        </p>
        <Bouton variante="contour" onClick={ouvrirPanneauCookies}>
          Gérer mes cookies
        </Bouton>
      </>
    ),
  },
  {
    id: "droits",
    titre: "Vos droits",
    contenu: (
      <>
        <p>
          Vous pouvez accéder à vos données, les rectifier, les faire effacer, vous opposer à leur
          traitement, en demander la limitation ou la portabilité, en écrivant à <AdresseEmail />.
          Réponse sous un mois.
        </p>
        <p>
          En cas de désaccord, vous pouvez saisir la CNIL (
          <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">
            cnil.fr<span className="visuellement-cache"> (nouvel onglet)</span>
          </a>
          ).
        </p>
      </>
    ),
  },
];

export default function Confidentialite() {
  return <PageLegale fil={FIL} titre="Confidentialité" sections={SECTIONS} />;
}
