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
