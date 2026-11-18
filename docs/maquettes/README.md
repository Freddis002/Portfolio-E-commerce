# Maquettes haute fidélité

Référence visuelle validée pour le développement du portfolio. En cas de conflit : maquettes > charte graphique > wireframes.

## Images

Captures pleine page, avec les polices Archivo et IBM Plex Mono.

| Page | Desktop 1440 | Tablette 768 | Mobile 390 |
| --- | --- | --- | --- |
| Accueil | [desktop/01-accueil.png](desktop/01-accueil.png) | [tablette/01-accueil.png](tablette/01-accueil.png) | [mobile/01-accueil.png](mobile/01-accueil.png) |
| Catalogue | [desktop/02-catalogue.png](desktop/02-catalogue.png) | [tablette/02-catalogue.png](tablette/02-catalogue.png) | [mobile/02-catalogue.png](mobile/02-catalogue.png) |
| Fiche projet | [desktop/03-fiche-projet.png](desktop/03-fiche-projet.png) | [tablette/03-fiche-projet.png](tablette/03-fiche-projet.png) | [mobile/03-fiche-projet.png](mobile/03-fiche-projet.png) |
| Fiche expertise | [desktop/04-fiche-expertise.png](desktop/04-fiche-expertise.png) | [tablette/04-fiche-expertise.png](tablette/04-fiche-expertise.png) | [mobile/04-fiche-expertise.png](mobile/04-fiche-expertise.png) |
| Fiche passion | [desktop/05-fiche-passion.png](desktop/05-fiche-passion.png) | [tablette/05-fiche-passion.png](tablette/05-fiche-passion.png) | [mobile/05-fiche-passion.png](mobile/05-fiche-passion.png) |
| Ma sélection | [desktop/06-ma-selection.png](desktop/06-ma-selection.png) | [tablette/06-ma-selection.png](tablette/06-ma-selection.png) | [mobile/06-ma-selection.png](mobile/06-ma-selection.png) |
| Contact | [desktop/07-contact.png](desktop/07-contact.png) | [tablette/07-contact.png](tablette/07-contact.png) | [mobile/07-contact.png](mobile/07-contact.png) |
| À propos | [desktop/08-a-propos.png](desktop/08-a-propos.png) | [tablette/08-a-propos.png](tablette/08-a-propos.png) | [mobile/08-a-propos.png](mobile/08-a-propos.png) |
| Mentions légales | [desktop/09-mentions-legales.png](desktop/09-mentions-legales.png) | [tablette/09-mentions-legales.png](tablette/09-mentions-legales.png) | [mobile/09-mentions-legales.png](mobile/09-mentions-legales.png) |
| Confidentialité | [desktop/10-confidentialite.png](desktop/10-confidentialite.png) | [tablette/10-confidentialite.png](tablette/10-confidentialite.png) | [mobile/10-confidentialite.png](mobile/10-confidentialite.png) |
| 404 | [desktop/11-404.png](desktop/11-404.png) | [tablette/11-404.png](tablette/11-404.png) | [mobile/11-404.png](mobile/11-404.png) |
| Bandeau cookies | [desktop/12-bandeau-cookies.png](desktop/12-bandeau-cookies.png) | — | [mobile/12-bandeau-cookies.png](mobile/12-bandeau-cookies.png) |
| Carnet de route | [desktop/13-carnet-de-route.png](desktop/13-carnet-de-route.png) | [tablette/13-carnet-de-route.png](tablette/13-carnet-de-route.png) | [mobile/13-carnet-de-route.png](mobile/13-carnet-de-route.png) |
| Accueil · section « À découvrir » (remplace les bannières Passions et À propos) | [desktop/14-accueil-decouvrir.png](desktop/14-accueil-decouvrir.png) (zone de 1120 px) | blocs empilés, 3D conservée | [mobile/14-accueil-decouvrir.png](mobile/14-accueil-decouvrir.png) |

La tablette utilise les pages desktop, qui sont fluides : sous 1024 px, le menu passe en burger et les filtres du catalogue passent au-dessus des résultats.

## Sources

`source/` contient les maquettes au format Design Component (`.dc.html`) : du HTML avec les styles en ligne et la logique des interactions. Elles servent à lire les valeurs exactes (tailles, espacements, couleurs) et les états interactifs ; elles ne sont pas du code à reprendre tel quel. Les fichiers `*Mobile.dc.html` sont les versions 390 px. `Header` et `Footer` sont les composants partagés.

`monde.svg` est le fond de carte du Carnet de route (données Natural Earth, domaine public ; projection Equal Earth, Antarctique retiré). Dans `CarnetDeRoute*.dc.html`, il est référencé par l'adresse `/_blob/47711d06433ad49888f3bc2abfac6d15` du canevas : dans le site, utiliser `public/carte/monde.svg`. Les positions des repères (`x`, `y` en % de la carte) sont calculées depuis latitude/longitude avec la même projection.

## États à reproduire

- Bouton d'ajout : « + Ajouter » → « ✓ Ajouté » (fond Noir Encre), compteur du header mis à jour, panneau de confirmation.
- Catalogue : filtres à cocher, tri, état « Aucun résultat ».
- Ma sélection : état rempli, état vide, retrait d'un élément.
- Contact : initial, erreurs (bordure et message Erreur #C8102E), envoyé.
- Bandeau cookies : bandeau, panneau Personnaliser, confirmation.
- Mobile : bouton « Ajouter à ma sélection » fixé en bas des fiches, sections dépliables, panneau de filtres.
- Accueil, section « À découvrir » (`AccueilDecouvrir*.dc.html`) : en desktop, les 4 passions en cartes 3D disposées en éventail ; la carte survolée ou atteinte au clavier s'avance (Voyages par défaut, avec la carte du monde). À propos : une boîte produit en 3D, avec sur sa face avant le personnage 3D tiré de la photo du CV ; elle pivote au survol. En mobile, sans 3D : cartes passions empilées à la verticale. `personnage-3d-apercu.png` n'est qu'un aperçu basse définition : le fichier du site vient de `photos-originales/profil/` via `npm run photos`. Dans ces deux sources, `/_blob/f9c653…` désigne `monde.svg` et `/_blob/43ea22…` le personnage.
- Carnet de route : 12 villes et Arras (départ), clic sur un repère (repère actif noir avec anneau orange), filtres France / Étranger, zoom Monde / Europe / France / Vietnam, fiche du lieu (panneau à droite en desktop, panneau bas en mobile), ajout à Ma sélection.

Contenus en lorem ipsum et emplacements d'image hachurés (type de visuel + ratio) : à remplacer par les contenus réels.
