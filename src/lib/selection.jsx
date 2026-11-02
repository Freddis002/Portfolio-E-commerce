import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { trouverParRef } from "../data/catalogue";
import { selection } from "./stockage";
import Bouton from "../components/Bouton";
import Notification from "../components/Notification";

const SelectionContexte = createContext(null);

/**
 * Fournit « Ma sélection » à toute l'application (placé dans root.jsx).
 * Affiche aussi la notification « ✓ Ajouté à votre sélection » après un ajout.
 */
export function SelectionProvider({ children }) {
  const refs = selection.utiliser();
  const [dernierAjout, setDernierAjout] = useState(null);

  const fermer = useCallback(() => setDernierAjout(null), []);

  const valeur = useMemo(() => {
    const contient = (ref) => refs.includes(ref);
    return {
      refs,
      count: refs.length,
      elements: refs.map(trouverParRef),
      contient,
      // Ajoute l'élément s'il n'y est pas, sinon le retire
      basculer(element) {
        if (contient(element.ref)) {
          selection.retirer(element.ref);
          setDernierAjout(null);
        } else {
          selection.ajouter(element.ref);
          setDernierAjout(element);
        }
      },
      retirer: (ref) => selection.retirer(ref),
    };
  }, [refs]);

  const n = refs.length;
  return (
    <SelectionContexte.Provider value={valeur}>
      {children}
      <Notification
        visible={dernierAjout !== null}
        onFermer={fermer}
        titre="✓ Ajouté à votre sélection"
        meta={`${n} élément${n > 1 ? "s" : ""}`}
        texte={dernierAjout?.titre}
        actions={
          <>
            <Bouton variante="contour" taille="s" onClick={fermer}>
              Continuer
            </Bouton>
            <Bouton variante="secondaire" taille="s" to="/selection" onClick={fermer}>
              Voir ma sélection <span aria-hidden="true">→</span>
            </Bouton>
          </>
        }
      />
    </SelectionContexte.Provider>
  );
}

export function useSelection() {
  return useContext(SelectionContexte);
}
