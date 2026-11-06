import React, { createContext, useContext, useEffect, useState } from "react";
import { useApp } from "./AppContext";
import { validCatalogueIds } from "../lib/portal";
import {
  isSavedProgrammeId, validateSavedChoices, restoredUgcEntries,
  persistRestoredChoices, OTHER_SAVED_KEY,
} from "../lib/savedChoicesBackup";
export const SAVED_CATALOGUE = OTHER_SAVED_KEY,
  COMPARE_CATALOGUE = "unipedia_catalogue_compare_v1";
function read(key: string) {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? [...new Set(value.filter(isSavedProgrammeId))] : [];
  } catch {
    return [];
  }
}
const defaults = {
  saved: [] as string[],
  compared: [] as string[],
  toggleSaved: (_id: string) => {},
  toggleCompared: (_id: string) => {},
  restoreSavedChoices: (_value: unknown) => {},
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
    if (saved.includes(id) || validCatalogueIds([id]).length)
      setSaved((p) =>
        p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
      );
  };
  const toggleCompared = (id: string) => {
    if (!validCatalogueIds([id]).length) return;
    app.toggleCatalogueCompare(id);
  };
  const restoreSavedChoices = (value: unknown) => {
    const backup = validateSavedChoices(value);
    const entries = restoredUgcEntries(backup.ugcProgrammeIds, app.planEntries);
    persistRestoredChoices(localStorage, entries, backup.otherProgrammeIds);
    app.replaceSavedPlan(entries);
    setSaved(backup.otherProgrammeIds);
  };
  return (
    <Context.Provider value={{ saved, compared, toggleSaved, toggleCompared, restoreSavedChoices }}>
      {children}
    </Context.Provider>
  );
}
export const usePortal = () => useContext(Context);
