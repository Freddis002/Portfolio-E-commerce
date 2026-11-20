import { useEffect, useId, useState } from "react";
import { Link } from "react-router";
import {
  CLARITY_ACTIF,
  enregistrerChoix,
  fermerPanneauCookies,
  ouvrirPanneauCookies,
  useConsentement,
} from "../lib/consentement";
import Bouton from "./Bouton";
import PanneauLateral from "./PanneauLateral";
import "./BandeauCookies.css";

/**
 * Consentement aux cookies, conforme aux recommandations de la CNIL :
 * - bandeau à la première visite (seulement si Clarity est configuré) :
 *   « Tout refuser » et « Tout accepter » strictement identiques, « Personnaliser » ;
 * - panneau « Personnaliser », rouvrable par « Gérer les cookies » (footer,
 *   page Confidentialité) pour changer d'avis à tout moment ;
 * - confirmation courte du choix, annoncée aux lecteurs d'écran.
 * Tant qu'aucun choix n'est fait, Clarity n'est pas chargé (refus par défaut).
 */
export default function BandeauCookies() {
  const { choix, panneauOuvert } = useConsentement();
  const [clarity, setClarity] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const titreId = useId();

  // Le panneau part du choix déjà enregistré
  useEffect(() => {
    if (panneauOuvert) setClarity(Boolean(choix?.clarity));
  }, [panneauOuvert, choix]);

  // La confirmation disparaît d'elle-même
  useEffect(() => {
    if (!confirmation) return;
    const minuteur = setTimeout(() => setConfirmation(""), 4000);
    return () => clearTimeout(minuteur);
  }, [confirmation]);

  const decider = (accord) => {
    enregistrerChoix(accord);
    setConfirmation(
      CLARITY_ACTIF
        ? `Choix enregistré : Microsoft Clarity ${accord ? "activé" : "désactivé"}.`
        : "Choix enregistré.",
    );
  };

  // choix === null : aucune décision ; undefined : pré-rendu (rien d'affiché)
  const bandeau = CLARITY_ACTIF && choix === null && !panneauOuvert;

  return (
    <>
      {bandeau && (
        <section className="bandeau-cookies" aria-labelledby={titreId}>
          <div className="bandeau-cookies__interieur conteneur">
            <div className="bandeau-cookies__texte">
              <h2 id={titreId} className="bandeau-cookies__titre">
                Vos choix de cookies
              </h2>
              <p>
                La mesure d'audience Matomo fonctionne sans cookies. Avec votre accord, Microsoft
                Clarity m'aide aussi à comprendre comment le site est parcouru (clics, défilement).{" "}
                <Link to="/confidentialite#cookies">En savoir plus</Link>
              </p>
            </div>
            <div className="bandeau-cookies__actions">
              <button type="button" className="bandeau-cookies__personnaliser" onClick={ouvrirPanneauCookies}>
                Personnaliser
              </button>
              {/* Refuser et accepter : même style, même taille (exigence CNIL) */}
              <Bouton variante="secondaire" onClick={() => decider(false)}>
                Tout refuser
              </Bouton>
              <Bouton variante="secondaire" onClick={() => decider(true)}>
                Tout accepter
              </Bouton>
            </div>
          </div>
        </section>
      )}

      <PanneauLateral
        ouvert={panneauOuvert}
        onFermer={fermerPanneauCookies}
        titre="Personnaliser"
        pied={
          CLARITY_ACTIF ? (
            <>
              <Bouton variante="secondaire" onClick={() => decider(clarity)}>
                Enregistrer mes choix
              </Bouton>
              <div className="bandeau-cookies__duo">
                <Bouton variante="contour" onClick={() => decider(false)}>
                  Tout refuser
                </Bouton>
                <Bouton variante="contour" onClick={() => decider(true)}>
                  Tout accepter
                </Bouton>
              </div>
            </>
          ) : (
            <Bouton variante="secondaire" onClick={fermerPanneauCookies}>
              Fermer
            </Bouton>
          )
        }
      >
        <div className="reglages-cookies">
          <p>
            Choix gardé 6 mois sur cet appareil. Vous pouvez le changer à tout moment avec « Gérer
            les cookies », en bas de chaque page.
          </p>
          <div className="reglages-cookies__ligne">
            <div>
              <p className="reglages-cookies__nom">Mesure d'audience · Matomo</p>
              <p className="reglages-cookies__detail">Sans cookies, IP anonymisée. Exemptée de consentement.</p>
            </div>
            <span className="reglages-cookies__etat">Toujours actif</span>
          </div>
          {CLARITY_ACTIF && (
            <div className="reglages-cookies__ligne">
              <div>
                <p className="reglages-cookies__nom" id="libelle-clarity">
                  Analyse de navigation · Microsoft Clarity
                </p>
                <p className="reglages-cookies__detail">Clics, défilement et sessions anonymisées. Dépose des cookies.</p>
              </div>
              {/* Interrupteur : état lu par les lecteurs d'écran (role="switch") et écrit en clair */}
              <button
                type="button"
                role="switch"
                aria-checked={clarity}
                aria-labelledby="libelle-clarity"
                className="interrupteur"
                onClick={() => setClarity(!clarity)}
              >
                <span className="interrupteur__piste" aria-hidden="true" />
                <span className="interrupteur__texte">{clarity ? "Activé" : "Désactivé"}</span>
              </button>
            </div>
          )}
        </div>
      </PanneauLateral>

      {/* Confirmation du choix (zone toujours présente : l'annonce n'est pas perdue) */}
      <p className={`confirmation-cookies ${confirmation ? "confirmation-cookies--visible" : ""}`} role="status">
        {confirmation}
      </p>
    </>
  );
}
