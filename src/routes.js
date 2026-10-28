import { index, route } from "@react-router/dev/routes";

// Table des routes : URL → fichier de page dans src/routes/
export default [
  index("routes/accueil.jsx"),
  route("catalogue", "routes/catalogue.jsx"),
  route("projets/:slug", "routes/projet.jsx"),
  route("expertises/:slug", "routes/expertise.jsx"),
  route("passions/:slug", "routes/passion.jsx"),
  route("a-propos", "routes/a-propos.jsx"),
  route("selection", "routes/selection.jsx"),
  route("contact", "routes/contact.jsx"),
  route("mentions-legales", "routes/mentions-legales.jsx"),
  route("confidentialite", "routes/confidentialite.jsx"),
  // Page interne des composants (noindex, hors sitemap)
  route("styleguide", "routes/styleguide.jsx"),
  // Toute autre URL : page introuvable
  route("*", "routes/404.jsx"),
];
