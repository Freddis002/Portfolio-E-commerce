import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

/**
 * Le plugin React Router pré-bundle « react-router-dom » dès que Node le trouve,
 * y compris dans un node_modules situé AU-DESSUS du projet (ex. C:\Users\…\node_modules).
 * Ce projet n'utilise pas ce paquet (en v7, tout vient de « react-router ») :
 * on le retire de la liste pour ne jamais charger une version étrangère.
 */
function ignorerReactRouterDom() {
  const filtrer = (optimizeDeps) => {
    if (optimizeDeps?.include) {
      optimizeDeps.include = optimizeDeps.include.filter((dep) => dep !== "react-router-dom");
    }
  };
  return {
    name: "ignorer-react-router-dom",
    enforce: "post",
    configResolved(config) {
      filtrer(config.optimizeDeps);
      Object.values(config.environments ?? {}).forEach((env) => filtrer(env.optimizeDeps));
    },
  };
}

export default defineConfig({
  plugins: [reactRouter(), ignorerReactRouterDom()],
});
