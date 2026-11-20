# Photos originales

Déposez ici les photos telles qu'elles sortent de l'appareil ou du téléphone
(sous-dossiers acceptés, par exemple `voyages/hanoi/01.jpg`).

Ce dossier n'est jamais envoyé sur GitHub : les originaux contiennent souvent
la position GPS de la prise de vue.

Ensuite, lancez :

    npm run photos

Le script écrit dans `public/photos/` une version WebP et une version AVIF de
chaque photo (2000 px de large au maximum), sans aucune métadonnée (EXIF, GPS,
modèle d'appareil), et vérifie qu'il n'en reste aucune.

## Où déposer quelles photos

| Emplacement sur le site | Fichier à déposer |
| --- | --- |
| Bannières accueil et À propos (personnage 3D) | `profil/personnage-3d.jpg` |
| Accueil, carte « Au-delà du bureau » (4 cases) | `passions/photographie.jpg`, `passions/voyages.jpg`, `passions/crossfit.jpg`, `passions/poker.jpg` |

Le nom du fichier doit être exactement celui-ci (jpg, png, webp ou heic acceptés).
Les cases sont carrées : la photo est recadrée au centre. Après `npm run photos`,
la photo apparaît toute seule ; tant qu'elle manque, la case reste hachurée.
