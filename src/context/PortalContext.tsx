import React, { createContext, useContext, useEffect, useState } from "react";
import { useApp } from "./AppContext";
import { validCatalogueIds } from "../lib/portal";
export const SAVED_CATALOGUE = "unipedia_catalogue_saved_v1",
  COMPARE_CATALOGUE = "unipedia_catalogue_compare_v1";
function read(key: string) {
  try {
    return validCatalogueIds(JSON.parse(localStorage.getItem(key) || "[]"));
  } catch {
    return [];
  }
}
const defaults = {
  saved: [] as string[],
  compared: [] as string[],
  toggleSaved: (_id: string) => {},
  toggleCompared: (_id: string) => {},
};
const Context = createContext(defaults);
export function PortalProvider({ children }: { children: React.ReactNode }) {
  const app = useApp();
  const [saved, setSaved] = useState(() => read(SAVED_CATALOGUE));
  const compared = app.catalogueCompareList;
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_CATALOGUE, JSON.stringify(saved));
    } catch {}
  }, [saved]);
  const toggleSaved = (id: string) => {
    if (validCatalogueIds([id]).length)
      setSaved((p) =>
        p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
      );
  };
  const toggleCompared = (id: string) => {
    if (!validCatalogueIds([id]).length) return;
    app.toggleCatalogueCompare(id);
  };
  return (
    <Context.Provider value={{ saved, compared, toggleSaved, toggleCompared }}>
      {children}
    </Context.Provider>
  );
}
export const usePortal = () => useContext(Context);
