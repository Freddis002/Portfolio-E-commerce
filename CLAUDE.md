# Portfolio e-commerce — brief permanent

## Contexte
Portfolio professionnel présenté comme une boutique en ligne premium.
But : décrocher un poste salarié (CDI) de Chargé marketing & communication,
Chargé e-commerce ou Chef de projet digital, à Arras et en Hauts-de-France.
Lecteurs : recruteurs et managers qui doivent juger le profil en moins d'une minute.
Le propriétaire reprend React après une pause : explique tes choix simplement.

Trois catégories, 13 éléments, chacun avec une fiche façon page produit :
- Projets (P-01 à P-04) : Mon Kit Solaire, Mon Grossiste Auto, Les Petits Paniers, Chti Poker Club
  (entreprises à citer sur les fiches : Green Ideas pour Mon Kit Solaire, Market Shop pour Mon Grossiste Auto)
- Expertises (E-01 à E-05) : E-commerce, SEO, Marketing digital, Data & Analytics, Web
- Passions (H-01 à H-04) : Photographie, Voyages, CrossFit, Poker
  (H-02 Voyages remplace l'ancienne passion Trail / randonnée ; sa page phare est le Carnet de route)

« Ma sélection » = panier simulé (aucun achat) : le visiteur ajoute des éléments,
puis envoie un message de contact prérempli avec sa sélection.

## Références (dans docs/)
- docs/maquettes/README.md : index des maquettes validées. Lis-le avant de coder une page,
  puis ouvre les captures (desktop, tablette, mobile) et la source .dc.html de la page.
- docs/charte/ : charte graphique v3, référence visuelle obligatoire
- docs/wireframes/ : wireframes v1, référence de structure et de parcours
En cas de conflit : maquettes > charte > wireframes > ce fichier.

## Stack
- React + Vite + React Router v7 (mode framework) avec pré-rendu statique de toutes les pages
- JavaScript, CSS natif avec variables (pas de framework CSS), icônes lucide-react
- Données dans src/data/*.json (une entrée par élément)
- Hébergement : OVH Perso (Apache, PHP, MySQL), site statique + un script PHP pour le formulaire
- Pourquoi le pré-rendu : Google et les robots d'IA doivent lire le contenu sans exécuter de JavaScript

## Charte (résumé ; le PDF prévaut)
- Couleurs : Noir Encre #111010, Orange Signal #FF5A1F, Blanc Papier #F7F5F2, Graphite #2B2927,
  Pierre #6E6862, Ligne #E3DFD9, Surface #EFECE7, Orange Brûlé #C2410C, Orange Pâle #FFE1D3,
  Succès #1F7A4A, Erreur #C8102E
- Couleurs complémentaires validées (tokens dans src/styles/tokens.css) :
  #D9D4CD texte secondaire sur Noir Encre, #B8B2AA texte tertiaire sur Noir Encre
  (Pierre n'atteint pas le contraste AA sur noir), #FFFFFF fond des champs de formulaire
- Badges NOUVEAU et TOP : fond Orange Pâle, texte Noir Encre (Orange Brûlé sur Orange Pâle = 4,2:1, sous le seuil AA)
- Répartition 60 % Blanc Papier / 30 % Noir Encre / 10 % orange maximum
- Un seul bouton orange par écran (fond orange, texte noir ; survol : fond noir, texte orange)
- Jamais de texte blanc sur orange ; texte orange sur fond clair = Orange Brûlé
- Archivo : display 850 wdth 112, titres 700-800, interface 500, texte 400
- IBM Plex Mono : références, dates, compteurs, labels (13 px, capitales, +8 %)
- Échelle : Display 96/48, H1 64/36, H2 40/28, H3 24/20, Corps L 20/18, Corps 16 (desktop/mobile)
- Grille 12 col / max 1280 / gouttière 24 / marges 80 ; tablette 8 col ; mobile 4 col, marges 20
- Espacements 4 8 12 16 24 32 48 64 96 128 ; rayon 0 (999 pour pastilles et compteur)
- Bordures 1 px #E3DFD9, aucune ombre, transitions 160 ms ease-out
- Icônes Lucide 20/24 px, trait 1,5 ; flèche → pour la navigation
- Focus clavier : contour 2 px Orange Signal décalé de 2 px, espace comblé par un anneau Noir Encre (contraste 3:1)
- Point orange sur chaque H1 de page ; un état ne repose jamais sur la couleur seule

## Codes e-commerce
À utiliser : barre d'annonce, bannière de campagne, bande de réassurance, tuiles catégories,
Nouveautés (badge NOUVEAU), Les plus demandées (badge TOP), page catégorie avec filtres à cocher
et tri, ajout rapide, mini-panier, bloc « En bref », « Souvent sélectionné avec »,
« Récemment consultés », parcours 01 Sélection → 02 Coordonnées → 03 Envoi.
Cartes projet : rôle en pastille noire + outils en pastilles contour.
Carnet de route (/passions/carnet-de-route, page phare de H-02 Voyages) : carte des lieux
(src/data/voyages.json, L-00 Arras départ, puis un lieu par ville), fond public/carte/monde.svg en projection Equal Earth
(src/lib/projection.js, aucun service de carte externe), repères = boutons, filtres France / Étranger,
zoom Monde / Europe / France / Vietnam, fiche du lieu (panneau à droite, panneau bas sur mobile),
liste « Tous les lieux » toujours dans le HTML, lieu partageable (?lieu=L-03), chaque lieu ajoutable à
Ma sélection. Animations Motion sobres (LazyMotion + domAnimation), coupées si prefers-reduced-motion.
Photos : originaux dans photos-originales/ (hors Git), « npm run photos » publie dans public/photos/
des WebP/AVIF sans aucune métadonnée (ni EXIF ni GPS), et tient à jour src/data/photos.json (photos publiées
et dimensions) : photoPubliee() de src/lib/photos.js affiche une photo dès qu'elle existe, sinon l'emplacement hachuré.
Emplacements attendus : voir photos-originales/LISEZMOI.md.
Accueil, section « À découvrir » (maquette 14) : EventailPassions (cartes de jeu en 3D, carte active au survol
et au focus) + BoiteAPropos (boîte produit en CSS 3D, un seul lien) ; sous 768 px, versions simples sans 3D.
Nom : prenom « Frédéric » dans profil.json, affiché en capitales par CSS (logo, H1 accueil, boîte, image de partage).
Mobile : bouton « Ajouter à ma sélection » fixé en bas des fiches, sections longues dépliables.
Interdits : recherche, méga-menu, prix, livraison, avis inventés.

## Interdits de design
Fond sombre à dégradés violets, glassmorphism, ombres, arrondis, animations spectaculaires,
grilles de cartes identiques sans hiérarchie, couleurs hors charte, images génériques.

## Contenus
- Aucun contenu inventé : ni chiffres, ni résultats, ni témoignages, ni missions
- Textes manquants = lorem ipsum clairement repérable ; images manquantes = emplacement hachuré
  indiquant le type de visuel et le ratio (16:9 projet, 4:5 portrait, 1:1 passion)
- Ton : vouvoiement, phrases courtes, verbes d'action ; projet = problème → démarche → résultat
- Tous les textes du site en français

## SEO et GEO
- Un title, une meta description et une URL canonique uniques par page ; un seul H1
- HTML sémantique, alt sur chaque image, fil d'Ariane
- JSON-LD : Person, ProfilePage, CreativeWork, BreadcrumbList
- Local : « Arras » et « Hauts-de-France » dans les titres et textes clés, et dans le JSON-LD
- sitemap.xml, robots.txt (robots d'IA autorisés), llms.txt
- Mise en œuvre : adresse du site = siteUrl dans src/data/profil.json (seule source) ; balises et JSON-LD
  via src/lib/seo.js (metaPage, ldPersonne, ldPageProfil, ldProjet, ldFilAriane) ; sitemap, robots.txt
  et llms.txt écrits après chaque build par scripts/fichiers-seo.mjs, qui fait échouer le build si un
  title dépasse 60 caractères, une description 155, ou s'il manque canonique, image de partage ou H1 unique
- Image de partage public/partage.png (1200 × 630) : « npm run image-partage » après tout changement
  de nom, de postes ou de ville ; vraies photos via le composant Photo (AVIF/WebP, dimensions, lazy)

## Sécurité et vie privée
- Aucune clé ou secret dans le code client (les variables VITE_ sont publiques)
- localStorage : uniquement les identifiants de la sélection et des fiches vues
- Seul cookie posé par le site : « consentement » (choix du bandeau, 6 mois, exempté par la CNIL)
- Matomo sans cookies ; Clarity chargé seulement après consentement (signal consentv2) ;
  identifiants dans src/data/mesure.json (vides = rien n'est chargé, pas de bandeau) ; événements via
  track() de src/lib/analytics.js : ajout_selection, retrait_selection, envoi_contact, telechargement_cv
- Domaine canonique : https, SANS www (public/.htaccess). En-têtes de sécurité dans .htaccess ;
  Content-Security-Policy par page en <meta> ajoutée au build par scripts/securite.mjs (empreintes sha256
  des scripts en ligne, jamais 'unsafe-inline' pour les scripts ; Matomo et Clarity ajoutés d'après mesure.json)
- E-mail jamais écrit en entier dans le HTML (composant AdresseEmail) ; liens externes en
  rel="noopener noreferrer" ; nom et coordonnées lus dans src/data/profil.json, jamais écrits en dur

## Conventions
- Composants dans src/components, pages dans src/routes, styles via variables de src/styles/tokens.css
- Accessibilité WCAG 2.2 AA, navigation clavier complète, prefers-reduced-motion respecté
- Avant de finir une tâche : npm run build sans erreur, puis résume ce qui a changé
- Avant toute modification importante : propose un plan et attends la validation
