# Portfolio E-commerce

Portfolio professionnel présenté comme une boutique en ligne : projets, expertises et passions, avec une sélection personnelle en guise de panier.

Stack : React 19, Vite, React Router v7 en mode framework avec **pré-rendu statique** de toutes les pages. Hébergement : OVH Perso (Apache), sans serveur Node.

## Prérequis

- Node.js 20 ou plus récent (testé avec Node 24)
- npm

## Lancer le site en local

```bash
npm install      # une seule fois, installe les dépendances
npm run dev      # serveur de développement : http://localhost:5173
```

Les modifications du code s'affichent immédiatement dans le navigateur.

## Construire le site

```bash
npm run build    # génère le site statique dans build/client/
npm run preview  # sert build/client/ en local pour vérifier le résultat
```

`build/client/` contient un fichier `index.html` par page (ex. `build/client/projets/mon-kit-solaire/index.html`), plus les ressources (`assets/`). C'est **ce dossier entier** qu'il faut envoyer sur l'hébergement OVH.

Pourquoi le pré-rendu : chaque page existe déjà en HTML complet, donc Google et les robots d'IA lisent le contenu sans exécuter de JavaScript. React prend ensuite le relais dans le navigateur (sélection, filtres, formulaire).

## Organisation du code

```
react-router.config.js   pré-rendu : liste des URL à générer
vite.config.js           configuration Vite
src/
  root.jsx               gabarit HTML commun (<html lang="fr">, styles)
  routes.js              table des routes : URL → fichier de page
  routes/                une page par route (accueil, catalogue, fiches…)
  components/            composants réutilisables (header, cartes…)
  data/                  projets.json, expertises.json, passions.json
  styles/
    tokens.css           variables de la charte (couleurs, typo, espacements)
    fonts.css            polices auto-hébergées (Archivo, IBM Plex Mono)
    global.css           base commune
docs/                    maquettes, charte, wireframes (références)
```

## Ajouter ou modifier un élément du catalogue

Éditez le fichier JSON de la catégorie dans `src/data/`. Le `slug` donne l'URL de la fiche ; la page correspondante est générée automatiquement au prochain `npm run build`.

## Références de design

Voir [docs/maquettes/README.md](docs/maquettes/README.md). En cas de conflit : maquettes > charte > wireframes.
