import { useState } from "react";
import { elements, trouverParRef } from "../data/catalogue";
import Header, { CompteurSelection } from "../components/Header";
import Footer from "../components/Footer";
import Bouton from "../components/Bouton";
import BoutonAjout from "../components/BoutonAjout";
import { Badge, Pastilles } from "../components/Etiquettes";
import CarteProduit from "../components/CarteProduit";
import TuileCategorie from "../components/TuileCategorie";
import Banniere from "../components/Banniere";
import BandeReassurance from "../components/BandeReassurance";
import { CaseFiltre, GroupeFiltres } from "../components/Filtres";
import SelecteurTri from "../components/SelecteurTri";
import FilAriane from "../components/FilAriane";
import PaginationVoisins from "../components/PaginationVoisins";
import Champ from "../components/Champ";
import IndicateurEtapes from "../components/IndicateurEtapes";
import ImageEmplacement from "../components/ImageEmplacement";
import PanneauLateral from "../components/PanneauLateral";
import Notification from "../components/Notification";
import PointFinal from "../components/PointFinal";
import "./styleguide.css";

// Page interne : jamais indexée, exclue du sitemap
export function meta() {
  return [
    { title: "Styleguide — composants du portfolio" },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

// Lu par le futur générateur de sitemap pour exclure la page
export const handle = { sitemap: false };

const COULEURS = [
  ["Noir Encre", "--color-noir"],
  ["Orange Signal", "--color-orange"],
  ["Blanc Papier", "--color-blanc"],
  ["Graphite", "--color-graphite"],
  ["Pierre", "--color-pierre"],
  ["Ligne", "--color-ligne"],
  ["Surface", "--color-surface"],
  ["Orange Brûlé", "--color-orange-brule"],
  ["Orange Pâle", "--color-orange-pale"],
  ["Succès", "--color-succes"],
  ["Erreur", "--color-erreur"],
  ["Texte secondaire sur noir", "--color-texte-secondaire-sur-noir"],
  ["Texte tertiaire sur noir", "--color-texte-tertiaire-sur-noir"],
  ["Fond champ", "--color-fond-champ"],
];

const ETATS_BOUTON = [
  ["Défaut", undefined],
  ["Survol", "survol"],
  ["Actif", "actif"],
  ["Focus", "focus"],
];

function Section({ id, titre, children }) {
  return (
    <section className="sg-section" aria-labelledby={id}>
      <h2 id={id} className="sg-section__titre">
        {titre}
      </h2>
      {children}
    </section>
  );
}

function Exemple({ label, children, large = false }) {
  return (
    <div className={`sg-exemple ${large ? "sg-exemple--large" : ""}`}>
      <span className="sg-exemple__label">{label}</span>
      <div className="sg-exemple__contenu">{children}</div>
    </div>
  );
}

export default function Styleguide() {
  const [selection, setSelection] = useState(["P-02", "E-02"]);
  const [notif, setNotif] = useState(null);
  const [panneau, setPanneau] = useState(false);
  const [filtres, setFiltres] = useState({ projet: true, expertise: true, passion: false });
  const [tri, setTri] = useState("pertinence");

  const estAjoute = (ref) => selection.includes(ref);
  const basculer = (element) => () => {
    const ajout = !estAjoute(element.ref);
    setSelection((s) => (ajout ? [...s, element.ref] : s.filter((r) => r !== element.ref)));
    if (ajout) setNotif(element.titre);
  };

  const p01 = trouverParRef("P-01");
  const p02 = trouverParRef("P-02");
  const p03 = trouverParRef("P-03");
  const p04 = trouverParRef("P-04");
  const e02 = trouverParRef("E-02");
  const e04 = trouverParRef("E-04");
  const h01 = trouverParRef("H-01");
  const nombre = (categorie) => elements.filter((e) => e.categorie === categorie).length;

  return (
    <>
      <Header count={selection.length} />

      <main>
      <div className="sg conteneur">
        <header className="sg-intro">
          <FilAriane items={[{ label: "Accueil", to: "/" }, { label: "Styleguide" }]} />
          <h1 className="sg-intro__titre">
            Styleguide
            <PointFinal />
          </h1>
          <p className="sg-intro__texte">
            Composants du portfolio et leurs états. Page interne, non indexée. Les états « survol »,
            « actif » et « focus » sont forcés pour l'affichage ; tous les composants restent utilisables
            au clavier (Tab, Entrée, Espace, Échap).
          </p>
        </header>

        <Section id="sg-couleurs" titre="Couleurs">
          <ul className="sg-couleurs">
            {COULEURS.map(([nom, variable]) => (
              <li key={variable} className="sg-couleur">
                <span className="sg-couleur__pastille" style={{ background: `var(${variable})` }} />
                <span className="sg-couleur__nom">{nom}</span>
                <code className="sg-couleur__variable">{variable}</code>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="sg-typo" titre="Typographie">
          <div className="sg-typo">
            <p className="sg-typo__display">Display<PointFinal /></p>
            <p className="sg-typo__h1">Titre H1<PointFinal /></p>
            <p className="sg-typo__h2">Titre de section H2</p>
            <p className="sg-typo__h3">Titre de bloc H3</p>
            <p className="sg-typo__corps-l">Corps L : lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p>Corps : lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
            <p className="label-mono">Label mono · P-01 · 2026</p>
          </div>
        </Section>

        <Section id="sg-header" titre="Header : compteur Ma sélection">
          <p className="sg-note">
            Le header en haut de page est réel : ajoutez ou retirez des éléments ci-dessous pour voir
            le compteur changer. Sous 1024 px, le menu passe en burger.
          </p>
          <div className="sg-grille">
            <Exemple label="0 élément : pastille neutre">
              <span className="entete__selection sg-statique">
                Ma sélection <CompteurSelection count={0} />
              </span>
            </Exemple>
            <Exemple label="1 élément et plus : pastille orange">
              <span className="entete__selection sg-statique">
                Ma sélection <CompteurSelection count={3} />
              </span>
            </Exemple>
          </div>
        </Section>

        <Section id="sg-boutons" titre="Boutons">
          {["primaire", "secondaire", "contour", "lien"].map((variante) => (
            <div key={variante} className="sg-ligne">
              <span className="sg-ligne__titre">{variante}</span>
              {ETATS_BOUTON.map(([label, etat]) => (
                <Exemple key={label} label={label}>
                  <Bouton variante={variante} data-etat={etat}>
                    {variante === "primaire" ? "Voir le projet →" : variante === "lien" ? "Lire l'étude de cas →" : "Me contacter"}
                  </Bouton>
                </Exemple>
              ))}
              <Exemple label="Désactivé">
                <Bouton variante={variante} disabled>
                  Indisponible
                </Bouton>
              </Exemple>
            </div>
          ))}
          <div className="sg-ligne">
            <span className="sg-ligne__titre">Taille S (44 px)</span>
            <Exemple label="Primaire S">
              <Bouton taille="s">Me contacter →</Bouton>
            </Exemple>
            <Exemple label="Contour S">
              <Bouton variante="contour" taille="s">Télécharger le CV</Bouton>
            </Exemple>
          </div>
          <div className="sg-sombre">
            <Exemple label="Contour sur Noir Encre">
              <Bouton variante="contour" surNoir>Me contacter</Bouton>
            </Exemple>
            <Exemple label="Lien sur Noir Encre">
              <Bouton variante="lien" surNoir>Toutes les expertises →</Bouton>
            </Exemple>
          </div>
        </Section>

        <Section id="sg-ajout" titre="Bouton d'ajout">
          <div className="sg-grille">
            <Exemple label="Défaut">
              <BoutonAjout titre="Mon Kit Solaire" />
            </Exemple>
            <Exemple label="Survol">
              <BoutonAjout titre="Mon Kit Solaire" data-etat="survol" />
            </Exemple>
            <Exemple label="Focus">
              <BoutonAjout titre="Mon Kit Solaire" data-etat="focus" />
            </Exemple>
            <Exemple label="Ajouté">
              <BoutonAjout titre="Mon Kit Solaire" ajoute />
            </Exemple>
            <Exemple label="Retirer (Ma sélection)">
              <BoutonAjout titre="Mon Kit Solaire" mode="retirer" />
            </Exemple>
            <Exemple label="Retirer, survol">
              <BoutonAjout titre="Mon Kit Solaire" mode="retirer" data-etat="survol" />
            </Exemple>
            <Exemple label="Désactivé">
              <BoutonAjout titre="Mon Kit Solaire" disabled />
            </Exemple>
            <Exemple label="Interactif">
              <BoutonAjout titre={p01.titre} ajoute={estAjoute("P-01")} onClick={basculer(p01)} />
            </Exemple>
          </div>
          <div className="sg-grille">
            <Exemple label="Fiche (taille L), non ajouté : CTA orange">
              <BoutonAjout titre={p03.titre} taille="l" ajoute={estAjoute("P-03")} onClick={basculer(p03)} />
            </Exemple>
            <Exemple label="Fiche (taille L), ajouté">
              <BoutonAjout titre={p03.titre} taille="l" ajoute />
            </Exemple>
          </div>
          <div className="sg-sombre">
            <Exemple label="Sur Noir Encre">
              <BoutonAjout titre="SEO" surNoir />
            </Exemple>
            <Exemple label="Sur Noir Encre, ajouté">
              <BoutonAjout titre="SEO" surNoir ajoute />
            </Exemple>
          </div>
        </Section>

        <Section id="sg-badges" titre="Badges et pastilles">
          <div className="sg-grille">
            <Exemple label="Badge NOUVEAU">
              <Badge type="nouveau" />
            </Exemple>
            <Exemple label="Badge TOP">
              <Badge type="top" />
            </Exemple>
            <Exemple label="Rôle + outils">
              <Pastilles role="[Rôle]" outils={["[Outil 1]", "[Outil 2]", "[Outil 3]"]} />
            </Exemple>
            <Exemple label="Version compacte">
              <Pastilles role="[Rôle]" outils={["[Outil 1]", "[Outil 2]"]} taille="s" />
            </Exemple>
          </div>
        </Section>

        <Section id="sg-cartes" titre="Cartes produit">
          <Exemple label="Vitrine (projet à la une, 16:9)" large>
            <div className="sg-vitrine">
              <CarteProduit element={p02} variante="vitrine" ajoute={estAjoute("P-02")} onBasculer={basculer(p02)} />
            </div>
          </Exemple>
          <Exemple label="Standard (grille)" large>
            <div className="sg-cartes">
              {[p01, e04, h01].map((el) => (
                <CarteProduit key={el.ref} element={el} ajoute={estAjoute(el.ref)} onBasculer={basculer(el)} />
              ))}
            </div>
          </Exemple>
          <Exemple label="Ligne de liste" large>
            <div className="sg-liste">
              {[e02, e04].map((el) => (
                <CarteProduit key={el.ref} element={el} variante="ligne" ajoute={estAjoute(el.ref)} onBasculer={basculer(el)} />
              ))}
            </div>
          </Exemple>
          <Exemple label="Ligne de liste sur Noir Encre" large>
            <div className="sg-liste sg-sombre sg-sombre--bloc">
              <CarteProduit element={e02} variante="ligne" sombre ajoute={estAjoute("E-02")} onBasculer={basculer(e02)} />
            </div>
          </Exemple>
        </Section>

        <Section id="sg-tuiles" titre="Tuiles catégorie">
          <div className="sg-cartes">
            <TuileCategorie titre="Projets" code="P" nombre={nombre("projet")} to="/catalogue?cat=projets" />
            <TuileCategorie titre="Expertises" code="E" nombre={nombre("expertise")} to="/catalogue?cat=expertises" />
            <TuileCategorie titre="Passions" code="H" nombre={nombre("passion")} to="/catalogue?cat=passions" />
          </div>
        </Section>
      </div>

      <div className="sg-pleine-largeur">
        <div className="conteneur">
          <p className="sg-exemple__label">Bannière de campagne (titre en H2 ici ; H1 sur l'accueil)</p>
        </div>
        <Banniere
          niveau={2}
          surtitre="Collection 2026 · Basé à Arras"
          titre={<>NOM<br />PRÉNOM</>}
          sousTitre="Chargé e-commerce · Marketing & communication · Chef de projet digital"
          texte="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore, en Hauts-de-France."
          reference="Réf. NP-2026"
          actions={
            <>
              <Bouton to="/catalogue">Voir mes projets →</Bouton>
              <Bouton variante="contour" href="/cv.pdf">Télécharger le CV (PDF)</Bouton>
            </>
          }
        />
        <div className="conteneur">
          <p className="sg-exemple__label">Bande de réassurance</p>
        </div>
        <BandeReassurance />
      </div>

      <div className="sg conteneur">
        <Section id="sg-navigation" titre="Filtres, tri, fil d'Ariane, voisins">
          <div className="sg-grille">
            <Exemple label="Filtres à cocher">
              <div className="sg-filtres">
                <GroupeFiltres legende="Catégorie">
                  {[
                    ["projet", "Projets"],
                    ["expertise", "Expertises"],
                    ["passion", "Passions"],
                  ].map(([cle, label]) => (
                    <CaseFiltre
                      key={cle}
                      label={label}
                      nombre={nombre(cle)}
                      checked={filtres[cle]}
                      onChange={() => setFiltres({ ...filtres, [cle]: !filtres[cle] })}
                    />
                  ))}
                </GroupeFiltres>
                <GroupeFiltres legende="États">
                  <CaseFiltre label="Survol" nombre={2} data-etat="survol" readOnly />
                  <CaseFiltre label="Focus" nombre={2} data-etat="focus" readOnly />
                  <CaseFiltre label="Sans résultat" nombre={0} readOnly />
                </GroupeFiltres>
              </div>
            </Exemple>
            <Exemple label="Tri : défaut / focus / désactivé">
              <div className="sg-colonne">
                <SelecteurTri value={tri} onChange={(e) => setTri(e.target.value)} />
                <SelecteurTri value="pertinence" onChange={() => {}} data-etat="focus" />
                <SelecteurTri value="pertinence" onChange={() => {}} disabled />
              </div>
            </Exemple>
          </div>
          <Exemple label="Fil d'Ariane" large>
            <FilAriane
              items={[
                { label: "Accueil", to: "/" },
                { label: "Catalogue", to: "/catalogue" },
                { label: "Projets", to: "/catalogue?cat=projets" },
                { label: p01.titre },
              ]}
            />
          </Exemple>
          <Exemple label="Précédent / suivant" large>
            <PaginationVoisins precedent={p04} suivant={p02} label="Projets voisins" />
          </Exemple>
        </Section>

        <Section id="sg-champs" titre="Champs de formulaire">
          <div className="sg-grille sg-grille--champs">
            <Champ label="Nom" requis placeholder="Votre nom" autoComplete="name" />
            <Champ label="E-mail (focus)" type="email" defaultValue="vous@entreprise" data-etat="focus" />
            <Champ
              label="E-mail (erreur)"
              type="email"
              requis
              defaultValue="vous@entreprise"
              erreur="Format d'e-mail invalide (ex. : nom@entreprise.fr)."
            />
            <Champ label="E-mail (validé)" type="email" defaultValue="nom@entreprise.fr" valide="Adresse valide" />
            <Champ label="Objet (désactivé)" defaultValue="Ma sélection" disabled />
            <Champ label="Message" multiligne requis aide="Le message reprend votre sélection." placeholder="Bonjour, votre profil nous intéresse…" />
          </div>
        </Section>

        <Section id="sg-etapes" titre="Indicateur d'étapes">
          <div className="sg-colonne">
            <Exemple label="Étape 01 en cours (Ma sélection)" large>
              <IndicateurEtapes courante={0} />
            </Exemple>
            <Exemple label="Étape 02 en cours (Contact)" large>
              <IndicateurEtapes courante={1} />
            </Exemple>
            <Exemple label="Message envoyé" large>
              <IndicateurEtapes termine />
            </Exemple>
          </div>
        </Section>

        <Section id="sg-images" titre="Emplacements d'image">
          <div className="sg-images">
            <ImageEmplacement type="Visuel projet" ratio="16:9" />
            <ImageEmplacement type="Portrait" ratio="4:5" />
            <ImageEmplacement type="Photo passion" ratio="1:1" />
            <ImageEmplacement type="Mockup écran" ratio="16:9" fond="sombre" />
          </div>
        </Section>

        <Section id="sg-panneaux" titre="Panneau latéral et notification">
          <div className="sg-grille">
            <Exemple label="Panneau latéral (mini-panier)">
              <Bouton variante="contour" onClick={() => setPanneau(true)}>
                Ouvrir le mini-panier
              </Bouton>
            </Exemple>
            <Exemple label="Notification déclenchée">
              <Bouton variante="contour" onClick={() => setNotif(p04.titre)}>
                Afficher la notification
              </Bouton>
            </Exemple>
          </div>
          <Exemple label="Notification (affichage statique)">
            <Notification
              visible
              statique
              duree={0}
              titre="✓ Ajouté à votre sélection"
              meta="3 éléments"
              texte="Mon Kit Solaire"
              actions={
                <>
                  <Bouton variante="contour" taille="s">Continuer</Bouton>
                  <Bouton variante="secondaire" taille="s" to="/selection">Voir ma sélection →</Bouton>
                </>
              }
            />
          </Exemple>
        </Section>
      </div>
      </main>

      <Footer />

      <PanneauLateral
        ouvert={panneau}
        onFermer={() => setPanneau(false)}
        titre={`Ma sélection (${selection.length})`}
        pied={
          <>
            <Bouton variante="secondaire" to="/selection">Voir ma sélection →</Bouton>
            <Bouton variante="contour" onClick={() => setPanneau(false)}>Continuer</Bouton>
          </>
        }
      >
        {selection.length === 0 ? (
          <p className="sg-note">Votre sélection est vide.</p>
        ) : (
          <ul className="sg-mini-panier">
            {selection.map((ref) => {
              const el = trouverParRef(ref);
              return (
                <li key={ref} className="sg-mini-panier__item">
                  <div>
                    <span className="label-mono">{el.ref}</span>
                    <p className="sg-mini-panier__titre">{el.titre}</p>
                  </div>
                  <BoutonAjout mode="retirer" titre={el.titre} onClick={basculer(el)} />
                </li>
              );
            })}
          </ul>
        )}
      </PanneauLateral>

      <Notification
        visible={notif !== null}
        onFermer={() => setNotif(null)}
        titre="✓ Ajouté à votre sélection"
        meta={`${selection.length} élément${selection.length > 1 ? "s" : ""}`}
        texte={notif}
        actions={
          <>
            <Bouton variante="contour" taille="s" onClick={() => setNotif(null)}>Continuer</Bouton>
            <Bouton variante="secondaire" taille="s" to="/selection">Voir ma sélection →</Bouton>
          </>
        }
      />
    </>
  );
}
