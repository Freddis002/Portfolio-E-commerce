import { useEffect, useState } from "react";

/*
 * Le HTML pré-rendu correspond à la page sans paramètres d'URL (filtres,
 * lieu choisi…). Au premier affichage dans le navigateur, on rend donc
 * d'abord cet état par défaut (sinon React signale une différence avec le
 * HTML), puis on applique l'URL. Lors d'une navigation interne, la page est
 * déjà « hydratée » : pas d'attente.
 */
let dejaHydrate = false;

export function useApresHydratation() {
  const [pret, setPret] = useState(dejaHydrate);
  useEffect(() => {
    dejaHydrate = true;
    setPret(true);
  }, []);
  return pret;
}
