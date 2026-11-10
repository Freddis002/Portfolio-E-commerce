import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import profil from "../data/profil.json";
import { categories, deuxChiffres } from "../data/catalogue";
import { MESSAGE_A_COMPLETER, demanderJeton, envoyerMessage, verifierChamp } from "../lib/contact";
import { useEstMobile } from "../lib/fiche";
import { useApresHydratation } from "../lib/hydratation";
import { metaPage } from "../lib/seo";
import { useSelection } from "../lib/selection";
import Bouton from "../components/Bouton";
import Champ from "../components/Champ";
import IndicateurEtapes from "../components/IndicateurEtapes";
import PointFinal from "../components/PointFinal";
import "./contact.css";

export function meta() {
  return metaPage({
    titre: `Contact · ${profil.nom} ${profil.prenom}, ${profil.ville} (${profil.region})`,
    description: `Écrivez à ${profil.nom} ${profil.prenom}, basé à ${profil.ville} : le message reprend votre sélection de projets, expertises et passions.`,
    chemin: "/contact",
  });
}

const CHAMPS = ["nom", "email", "objet", "message"];
const libelleCategorie = (e) => categories[e.categorie]?.libelle ?? "Lieu";

// Message prérempli à partir de la sélection (modifiable librement)
function messageInitial(selection) {
  if (selection.length === 0) return `Bonjour,\n\n${MESSAGE_A_COMPLETER}`;
  const lignes = selection.map((e) => `– ${e.titre} (${libelleCategorie(e)})`).join("\n");
  return `Bonjour,\n\nJ'ai parcouru votre portfolio et j'aimerais échanger à propos de :\n${lignes}\n\n${MESSAGE_A_COMPLETER}`;
}

export default function Contact() {
  const pret = useApresHydratation();
  const mobile = useEstMobile();
  const { elements: selection, count, vider } = useSelection();

  const [champs, setChamps] = useState({
    nom: "",
    email: "",
    objet: "Échange à propos de votre portfolio",
    message: "",
    site_web: "", // champ piège : invisible pour un humain, rempli par les robots
  });
  const [touches, setTouches] = useState({});
  const [erreursServeur, setErreursServeur] = useState({});
  const [statut, setStatut] = useState("saisie"); // saisie | envoi | envoye
  const [echec, setEchec] = useState(null);
  const [essai, setEssai] = useState(false);
  const jeton = useRef(null);
  const messageModifie = useRef(false);
  const formRef = useRef(null);
  const resumeRef = useRef(null);
  const confirmationRef = useRef(null);

  // Message prérempli une fois la sélection lue (jamais par-dessus une saisie)
  useEffect(() => {
    if (pret && !messageModifie.current) {
      setChamps((c) => ({ ...c, message: messageInitial(selection) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pret, count]);

  // Jeton daté demandé à l'affichage (délai minimal de remplissage)
  useEffect(() => {
    demanderJeton().then((j) => (jeton.current = j));
  }, []);

  const erreurDe = (nom) => (touches[nom] || essai ? verifierChamp(nom, champs[nom]) : null) ?? erreursServeur[nom] ?? null;
  const erreurs = CHAMPS.map((nom) => [nom, verifierChamp(nom, champs[nom])]).filter(([, e]) => e);

  const modifier = (nom) => (e) => {
    if (nom === "message") messageModifie.current = true;
    setChamps({ ...champs, [nom]: e.target.value });
    setErreursServeur({ ...erreursServeur, [nom]: undefined });
  };
  // Vérification d'un champ quand on le quitte
  const quitter = (nom) => () => setTouches({ ...touches, [nom]: true });

  const envoyer = async (e) => {
    e.preventDefault();
    setEssai(true);
    setEchec(null);
    if (erreurs.length > 0) {
      // Le résumé est annoncé (role="alert") ; le focus va au premier champ à corriger
      formRef.current?.querySelector(`#contact-${erreurs[0][0]}`)?.focus();
      return;
    }
    setStatut("envoi");
    const reponse = await envoyerMessage({ ...champs, jeton: jeton.current });
    if (reponse.ok) {
      vider();
      setStatut("envoye");
      return;
    }
    setStatut("saisie");
    setErreursServeur(reponse.erreurs ?? {});
    setEchec(reponse.message ?? "Le message n'a pas pu partir. Réessayez dans un instant.");
    // Nouveau jeton pour le prochain essai
    demanderJeton().then((j) => (jeton.current = j));
  };

  // Après l'envoi : focus sur la confirmation (annoncée aux lecteurs d'écran)
  useEffect(() => {
    if (statut === "envoye") confirmationRef.current?.focus();
    if (echec) resumeRef.current?.focus();
  }, [statut, echec]);

  const envoye = statut === "envoye";

  return (
    <main id="contenu" className="contact">
      <div className="contact__haut conteneur">
        <IndicateurEtapes courante={1} termine={envoye} />
      </div>

      <div className="contact__corps conteneur">
        <div className="contact__colonne">
          <p className="label-mono contact__surtitre">Contact</p>
          <h1 className="contact__titre">
            Parlons-en
            <PointFinal />
          </h1>
          <p className="contact__intro">
            Le message reprend votre sélection. Modifiez-le librement avant d'envoyer.
          </p>

          {/* Récapitulatif de la sélection (dépliable sur mobile) */}
          {pret && !envoye && (
            <details className="contact__recap" open={!mobile}>
              <summary className="contact__recap-titre label-mono">
                Votre sélection · {deuxChiffres(count)} élément{count > 1 ? "s" : ""}
              </summary>
              {count > 0 ? (
                <ul className="contact__recap-liste">
                  {selection.map((e) => (
                    <li key={e.ref}>
                      <span>{e.titre}</span>
                      <span className="label-mono">{libelleCategorie(e)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="contact__recap-vide">
                  Aucun élément pour l'instant : vous pouvez écrire directement.
                </p>
              )}
              <Link to="/selection" className="contact__recap-lien">
                Modifier la sélection <span aria-hidden="true">→</span>
              </Link>
            </details>
          )}

          <div className="contact__direct">
            <p className="label-mono">Ou directement</p>
            <p>[E-mail à compléter]</p>
            <p>
              {/* Lien LinkedIn à compléter */}
              <a href="#" rel="noopener noreferrer">
                [LinkedIn à compléter] <span aria-hidden="true">↗</span>
              </a>
            </p>
            <p className="contact__lieu">
              Basé à {profil.ville} · {profil.region}
            </p>
          </div>
        </div>

        <div className="contact__formulaire">
          {envoye ? (
            // Étape 03 Envoi : confirmation
            <div className="contact__succes" role="status">
              <p className="contact__succes-etat">
                <CheckCircle2 size={24} strokeWidth={1.5} aria-hidden="true" />
                Message envoyé
              </p>
              <h2 ref={confirmationRef} tabIndex={-1} className="contact__succes-titre">
                Merci, votre message est bien parti.
              </h2>
              <p>
                Je vous réponds sous [délai à compléter] à l'adresse indiquée. Votre sélection a été
                vidée de cet appareil.
              </p>
              <div className="contact__succes-actions">
                <Bouton variante="secondaire" to="/catalogue">
                  Retour au catalogue
                </Bouton>
                <Bouton variante="contour" href="/cv.pdf" download>
                  Télécharger le CV (PDF)
                </Bouton>
              </div>
            </div>
          ) : (
            <form ref={formRef} onSubmit={envoyer} noValidate aria-describedby="contact-rgpd">
              {/* Résumé des erreurs (annoncé dès qu'il apparaît) */}
              {(echec || (essai && erreurs.length > 0)) && (
                <div ref={resumeRef} tabIndex={-1} className="contact__alerte" role="alert">
                  <AlertCircle size={20} strokeWidth={1.5} aria-hidden="true" />
                  <div>
                    {echec ?? `${erreurs.length} champ${erreurs.length > 1 ? "s" : ""} à corriger avant l'envoi.`}
                  </div>
                </div>
              )}

              <div className="contact__ligne">
                <Champ
                  id="contact-nom"
                  label="Nom"
                  requis
                  autoComplete="name"
                  placeholder="Votre nom"
                  value={champs.nom}
                  onChange={modifier("nom")}
                  onBlur={quitter("nom")}
                  erreur={erreurDe("nom")}
                />
                <Champ
                  id="contact-email"
                  label="E-mail"
                  type="email"
                  requis
                  autoComplete="email"
                  placeholder="vous@entreprise.com"
                  value={champs.email}
                  onChange={modifier("email")}
                  onBlur={quitter("email")}
                  erreur={erreurDe("email")}
                  valide={(touches.email || essai) && !erreurDe("email") ? "Adresse valide" : undefined}
                />
              </div>
              <Champ
                id="contact-objet"
                label="Objet"
                value={champs.objet}
                onChange={modifier("objet")}
                onBlur={quitter("objet")}
                erreur={erreurDe("objet")}
              />
              <Champ
                id="contact-message"
                label="Message"
                multiligne
                requis
                rows={10}
                value={champs.message}
                onChange={modifier("message")}
                onBlur={quitter("message")}
                erreur={erreurDe("message")}
              />

              {/* Champ piège : hors écran, ignoré au clavier et par les lecteurs d'écran */}
              <div className="contact__piege" aria-hidden="true">
                <label htmlFor="contact-site-web">Site web</label>
                <input
                  id="contact-site-web"
                  name="site_web"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={champs.site_web}
                  onChange={(e) => setChamps({ ...champs, site_web: e.target.value })}
                />
              </div>

              <div className="contact__envoi">
                <p id="contact-rgpd" className="contact__rgpd">
                  * Champs obligatoires. Vos données servent uniquement à vous répondre et ne sont
                  jamais revendues. <Link to="/confidentialite">Politique de confidentialité</Link>
                </p>
                <Bouton type="submit" disabled={statut === "envoi"} aria-busy={statut === "envoi"}>
                  {statut === "envoi" ? (
                    "Envoi en cours…"
                  ) : (
                    <>
                      Envoyer le message <span aria-hidden="true">→</span>
                    </>
                  )}
                </Bouton>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
