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

La tablette utilise les pages desktop, qui sont fluides : sous 1024 px, le menu passe en burger et les filtres du catalogue passent au-dessus des résultats.

## Sources

`source/` contient les maquettes au format Design Component (`.dc.html`) : du HTML avec les styles en ligne et la logique des interactions. Elles servent à lire les valeurs exactes (tailles, espacements, couleurs) et les états interactifs ; elles ne sont pas du code à reprendre tel quel. Les fichiers `*Mobile.dc.html` sont les versions 390 px. `Header` et `Footer` sont les composants partagés.

## États à reproduire

- Bouton d'ajout : « + Ajouter » → « ✓ Ajouté » (fond Noir Encre), compteur du header mis à jour, panneau de confirmation.
- Catalogue : filtres à cocher, tri, état « Aucun résultat ».
- Ma sélection : état rempli, état vide, retrait d'un élément.
- Contact : initial, erreurs (bordure et message Erreur #C8102E), envoyé.
- Bandeau cookies : bandeau, panneau Personnaliser, confirmation.
- Mobile : bouton « Ajouter à ma sélection » fixé en bas des fiches, sections dépliables, panneau de filtres.

Contenus en lorem ipsum et emplacements d'image hachurés (type de visuel + ratio) : à remplacer par les contenus réels.
