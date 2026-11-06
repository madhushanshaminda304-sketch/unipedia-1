import { describe, expect, it } from "vitest";
import {
  createSavedChoicesBackup, parseSavedChoices, validateSavedChoices,
  restoredUgcEntries, persistRestoredChoices, UGC_SAVED_KEY, OTHER_SAVED_KEY,
} from "../savedChoicesBackup";

const sample = {
  format: "unipedia-saved-choices", version: 1,
  ugcProgrammeIds: ["008G", "001A", "999Z"],
  otherProgrammeIds: ["nibm-research-01", "retired-programme"],
};
describe("Saved choices backup", () => {
  it("round-trips ordered IDs, including unavailable programmes, without academic or migration details", () => {
    const entries = sample.ugcProgrammeIds.map((id) => ({
      uni_code: id, locked: true, originalCourseName: "Private note",
      grades: "A", zScore: 2.5, district: 9,
    }));
    const exported = createSavedChoicesBackup(entries, sample.otherProgrammeIds);
    const restored = parseSavedChoices(JSON.stringify(exported));
    expect(restored).toEqual(sample);
    expect(Object.keys(restored)).toEqual(["format", "version", "ugcProgrammeIds", "otherProgrammeIds"]);
    expect(JSON.stringify(restored)).not.toMatch(/grades|zScore|district|Private note|locked/);
  });
  it("retains matching locks and review information without changing backup order", () => {
    const existing = [{ uni_code: "001A", locked: true, migrationNote: "Review this entry" }];
    const restored = restoredUgcEntries(sample.ugcProgrammeIds, existing);
    expect(restored.map((e) => e.uni_code)).toEqual(sample.ugcProgrammeIds);
    expect(restored[1]).toEqual(existing[0]);
    expect(restored[0].locked).toBe(false);
    expect(restored[2]).toEqual({ uni_code: "999Z", locked: false });
  });
  it("supports explicitly empty backups", () => {
    expect(parseSavedChoices(JSON.stringify({ ...sample, ugcProgrammeIds: [], otherProgrammeIds: [] }))).toMatchObject({ ugcProgrammeIds: [], otherProgrammeIds: [] });
  });
  it("rejects malformed, unsupported, oversized and non-choice files", () => {
    for (const value of [null, [], {}, { ...sample, version: 2 },
      { ...sample, format: "different-app" }, { ...sample, district: 1 },
      { ...sample, ugcProgrammeIds: ["008G", "008G"] },
      { ...sample, ugcProgrammeIds: Array.from({ length: 126 }, (_, i) => `${i}Z`) },
      { ...sample, otherProgrammeIds: [null] }, { ...sample, otherProgrammeIds: "nibm" },
      { ...sample, otherProgrammeIds: ["<script>"] },
      { ...sample, ugcProgrammeIds: [123] }, { ...sample, otherProgrammeIds: undefined }])
      expect(() => validateSavedChoices(value)).toThrow();
    expect(() => parseSavedChoices("{broken")).toThrow(/valid JSON/);
    expect(() => parseSavedChoices(" ".repeat(1024 * 1024 + 1))).toThrow(/1 MB/);
  });
  it("persists an export/import round trip through the existing storage keys only", () => {
    const store = new Map([[UGC_SAVED_KEY, "old ugc"], [OTHER_SAVED_KEY, "old other"], ["unipedia_student_v2", "profile stays"]]);
    const backup = parseSavedChoices(JSON.stringify(createSavedChoicesBackup(
      sample.ugcProgrammeIds.map((uni_code) => ({ uni_code, locked: false })), sample.otherProgrammeIds,
    )));
    const entries = restoredUgcEntries(backup.ugcProgrammeIds, []);
    persistRestoredChoices({ getItem: (key) => store.get(key) ?? null, setItem: (key, value) => { store.set(key, value); }, removeItem: (key) => { store.delete(key); } }, entries, backup.otherProgrammeIds);
    expect(JSON.parse(store.get(UGC_SAVED_KEY)!).map((e: {uni_code: string}) => e.uni_code)).toEqual(sample.ugcProgrammeIds);
    expect(JSON.parse(store.get(OTHER_SAVED_KEY)!)).toEqual(sample.otherProgrammeIds);
    expect(store.get("unipedia_student_v2")).toBe("profile stays");
  });
  it("rolls back a partial storage write before either in-memory list changes", () => {
    const store = new Map([[UGC_SAVED_KEY, "old ugc"], [OTHER_SAVED_KEY, "old other"]]);
    let writes = 0;
    expect(() => persistRestoredChoices({
      getItem: (key) => store.get(key) ?? null,
      setItem: (key, value) => { if (++writes === 2) throw new Error("quota"); store.set(key, value); },
      removeItem: (key) => { store.delete(key); },
    }, [], [])).toThrow(/Existing choices have not changed/);
    expect([...store.values()]).toEqual(["old ugc", "old other"]);
  });
  it("invalid files never reach the storage writer", () => {
    const store = new Map([[UGC_SAVED_KEY, "original"], [OTHER_SAVED_KEY, "original"]]);
    expect(() => {
      const backup = parseSavedChoices('{"version":99}');
      persistRestoredChoices({ getItem: (key) => store.get(key) ?? null, setItem: (key, value) => { store.set(key, value); }, removeItem: (key) => { store.delete(key); } }, restoredUgcEntries(backup.ugcProgrammeIds, []), backup.otherProgrammeIds);
    }).toThrow();
    expect([...store.values()]).toEqual(["original", "original"]);
  });
});
