import type { SavedPreferenceEntry } from "../data/ugc/types";

export const MAX_BACKUP_BYTES = 1024 * 1024;
export const UGC_SAVED_KEY = "unipedia_plan_entries";
export const OTHER_SAVED_KEY = "unipedia_catalogue_saved_v1";
export interface SavedChoicesBackup {
  format: "unipedia-saved-choices";
  version: 1;
  ugcProgrammeIds: string[];
  otherProgrammeIds: string[];
}
export function isSavedProgrammeId(id: unknown): id is string {
  return typeof id === "string" && /^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/.test(id);
}
export function validateSavedChoices(value: unknown): SavedChoicesBackup {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Choose a UniPedia saved-choices JSON backup.");
  const data = value as Record<string, unknown>;
  if (data.format !== "unipedia-saved-choices" || data.version !== 1)
    throw new Error("This backup format or version is not supported.");
  const keys = ["format", "version", "ugcProgrammeIds", "otherProgrammeIds"];
  if (Object.keys(data).some((key) => !keys.includes(key)))
    throw new Error("This backup contains unexpected fields. Only programme choices can be restored.");
  const readIds = (value: unknown, limit: number, label: string) => {
    if (!Array.isArray(value) || value.length > limit || !value.every(isSavedProgrammeId))
      throw new Error(`${label} must be a list of programme IDs (maximum ${limit}).`);
    if (new Set(value).size !== value.length)
      throw new Error(`${label} contains duplicate programme IDs.`);
    return [...value] as string[];
  };
  return {
    format: "unipedia-saved-choices",
    version: 1,
    ugcProgrammeIds: readIds(data.ugcProgrammeIds, 125, "UGC choices"),
    otherProgrammeIds: readIds(data.otherProgrammeIds, 1000, "Other-programme choices"),
  };
}
export function parseSavedChoices(text: string) {
  if (new Blob([text]).size > MAX_BACKUP_BYTES)
    throw new Error("The backup must be smaller than 1 MB.");
  let value: unknown;
  try { value = JSON.parse(text); }
  catch { throw new Error("This file is not valid JSON. Your saved choices have not changed."); }
  return validateSavedChoices(value);
}
export function createSavedChoicesBackup(entries: SavedPreferenceEntry[], saved: string[]) {
  return validateSavedChoices({
    format: "unipedia-saved-choices",
    version: 1,
    ugcProgrammeIds: entries.map((entry) => entry.uni_code),
    otherProgrammeIds: saved,
  });
}
export function restoredUgcEntries(ids: string[], existing: SavedPreferenceEntry[]) {
  return ids.map((id) => ({
    ...(existing.find((entry) => entry.uni_code === id) || { locked: false }),
    uni_code: id,
  }));
}
// Persist both lists before updating React state; undo partial writes on failure.
export function persistRestoredChoices(
  storage: Pick<Storage, "getItem" | "setItem" | "removeItem">,
  entries: SavedPreferenceEntry[], saved: string[],
) {
  let before: (string | null)[];
  try {
    before = [storage.getItem(UGC_SAVED_KEY), storage.getItem(OTHER_SAVED_KEY)];
  } catch {
    throw new Error("Browser storage is unavailable. Existing choices have not changed.");
  }
  try {
    storage.setItem(UGC_SAVED_KEY, JSON.stringify(entries));
    storage.setItem(OTHER_SAVED_KEY, JSON.stringify(saved));
  } catch {
    try {
      [UGC_SAVED_KEY, OTHER_SAVED_KEY].forEach((key, i) => {
        if (before[i] === null) storage.removeItem(key);
        else storage.setItem(key, before[i]!);
      });
    } catch {
      throw new Error("Browser storage failed and could not be rolled back. Keep your backup and check saved choices after reloading.");
    }
    throw new Error("Could not save the backup in this browser. Existing choices have not changed.");
  }
}
