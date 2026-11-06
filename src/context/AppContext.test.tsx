import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { toast } from "sonner";
import { AppProvider, useApp, type AppContextValue } from "./AppContext";
function inspect() {
  let app: AppContextValue | undefined;
  function Probe() {
    app = useApp();
    return <span />;
  }
  renderToStaticMarkup(
    <AppProvider>
      <Probe />
    </AppProvider>,
  );
  return app!;
}
afterEach(() => vi.unstubAllGlobals());
describe("First visit and saved state", () => {
  it("preserves existing UGC comparison choices and uses only the remaining slots for imported programmes", () => {
    vi.stubGlobal("localStorage", {
      getItem: (key: string) =>
        key === "unipedia_compare_v2"
          ? JSON.stringify(["094F", "004K"])
          : key === "unipedia_catalogue_compare_v1"
            ? JSON.stringify([
                "nibm-research-01",
                "nsbm-research-01",
                "cinec-research-01",
              ])
            : null,
      setItem: () => {},
    });
    const app = inspect();
    expect(app.compareList).toEqual(["094F", "004K"]);
    expect(app.catalogueCompareList).toEqual([
      "nibm-research-01",
      "nsbm-research-01",
    ]);
    expect(app.compareList.length + app.catalogueCompareList.length).toBe(4);
  });
  it("starts with empty choices and no fabricated score", () => {
    vi.stubGlobal("localStorage", { getItem: () => null, setItem: () => {} });
    const app = inspect();
    expect(app.studentZScore).toBeNull();
    expect(app.cutoffYear).toBe("2025/2026");
    expect(app.studentStream).toBe("ALL");
    expect(app.planEntries).toEqual([]);
    expect(app.compareList).toEqual([]);
    expect(app.isWelcomeOpen).toBe(false);
  });
  it("keeps the catalog usable when storage is blocked", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    });
    expect(inspect().districtPrograms).toHaveLength(255);
  });
  it("handles malformed stored collections without crashing", () => {
    vi.stubGlobal("localStorage", {
      getItem: (key: string) =>
        key === "unipedia_compare_v2"
          ? "{}"
          : key === "unipedia_plan_entries"
            ? "[null]"
            : key === "unipedia_student_v2"
              ? "null"
              : null,
      setItem: () => {},
    });
    const app = inspect();
    expect(app.planEntries).toEqual([]);
    expect(app.compareList).toEqual([]);
    expect(app.studentZScore).toBeNull();
  });
  it("preserves old choices for explicit migration review", () => {
    const storage = new Map([
      [
        "unipedia_plan_entries",
        JSON.stringify([{ uni_code: "096G", locked: true }]),
      ],
    ]);
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    });
    const app = inspect();
    expect(app.planEntries[0].uni_code).toBe("096G");
    expect(app.planEntries[0].suggestedUniCode).toBe("117G");
    expect(storage.has("unipedia_pre_migration_backup")).toBe(true);
  });
  it("provides toast notifications when managing shortlist and changing district", () => {
    const successSpy = vi.spyOn(toast, "success");
    const infoSpy = vi.spyOn(toast, "info");
    const app = inspect();
    app.addToPlan("001A");
    expect(successSpy).toHaveBeenCalled();
    app.setDistrictId(2);
    expect(infoSpy).toHaveBeenCalled();
  });
});
