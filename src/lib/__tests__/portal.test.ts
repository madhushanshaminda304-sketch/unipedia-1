import { describe, it, expect } from "vitest";
import {
  discoveryProgrammes,
  discoveryInstitutions,
  readExplore,
  writeExplore,
  filterDiscovery,
  EMPTY_EXPLORE,
  validCatalogueIds,
  nextComparison,
  subjectFor,
  GUIDES,
} from "../portal";
import { NON_STATE_CATALOG } from "../nonStateCatalog";
import { readLocation, routePath } from "../routes";
import { portalCopy } from "../portalCopy";
const rows = discoveryProgrammes();
describe("Unified education discovery", () => {
  it("keeps every source record and programme variant discoverable", () => {
    expect(rows).toHaveLength(255 + NON_STATE_CATALOG.length);
    expect(new Set(rows.map((p) => p.key)).size).toBe(rows.length);
    for (const p of NON_STATE_CATALOG)
      expect(
        rows.some((r) => r.ref.id === p.id && r.href === `/programmes/${p.id}`),
      ).toBe(true);
    expect(
      filterDiscovery(rows, {
        ...EMPTY_EXPLORE,
        q: "computer science",
        institution: "nsbm-green-university",
      }).length,
    ).toBeGreaterThan(1);
    expect(
      discoveryInstitutions(rows).reduce((sum, i) => sum + i.count, 0),
    ).toBe(rows.length);
  });
  it("combines filters without interpreting fee text as comparable prices or assessing eligibility", () => {
    const result = filterDiscovery(rows, {
      ...EMPTY_EXPLORE,
      route: "catalogue",
      institution: "nibm",
      level: "Foundation",
      duration: "short",
      fees: "reported",
    });
    expect(result).toHaveLength(4);
    expect(
      filterDiscovery(rows, {
        ...EMPTY_EXPLORE,
        route: "catalogue",
        institution: "nibm",
        level: "Foundation",
      }),
    ).toHaveLength(4);
    expect(
      filterDiscovery(rows, { ...EMPTY_EXPLORE, q: "no such course xyz" }),
    ).toEqual([]);
    expect(rows.find((p) => p.ref.id === "nibm-research-13")?.fee).toContain(
      "Conflicting",
    );
    expect(subjectFor("Unmapped qualification")).toBe("Other");
    expect(subjectFor("Diploma in Software Engineering")).toBe("Computing");
    expect(subjectFor("Technology Foundation Programme (IT)")).toBe(
      "Computing",
    );
    expect(subjectFor("Agricultural Technology & Management")).toBe("Science");
  });
  it("retains language-aware navigation and explicitly identifies English research content", () => {
    expect(portalCopy("SI").title).not.toBe(portalCopy("EN").title);
    expect(portalCopy("TA").explore).not.toBe(portalCopy("EN").explore);
    expect(portalCopy("SI").search).not.toBe("Search");
    expect(portalCopy("EN").english).toContain("English");
  });
  it("round-trips shareable filters and safely defaults invalid values", () => {
    const f = {
      ...EMPTY_EXPLORE,
      q: "Arts & design",
      subject: "Arts & Design",
      page: 2,
      route: "catalogue",
    };
    expect(readExplore(new URLSearchParams(writeExplore(f)))).toEqual(f);
    expect(
      readExplore(new URLSearchParams("route=invalid&duration=cheap&page=-2")),
    ).toMatchObject({ route: "all", duration: "", page: 1 });
  });
  it("preserves existing UGC links and exact imported programme identifiers", () => {
    expect(readLocation({ pathname: "/courses/008G", hash: "" })).toEqual({
      route: "course",
      code: "008G",
    });
    expect(
      readLocation({ pathname: "/programmes/nibm-research-13", hash: "" }),
    ).toEqual({ route: "programme", code: "nibm-research-13" });
    expect(routePath("programme", "nibm-research-13")).toBe(
      "/programmes/nibm-research-13",
    );
    expect(
      readLocation({
        pathname: "/institutions/nsbm-green-university",
        hash: "",
      }).route,
    ).toBe("catalogue-institution");
    expect(
      readLocation({ pathname: "/guides/degree-or-hnd", hash: "" }).route,
    ).toBe("guide");
  });
  it("cleans malformed saved records and enforces a combined four-programme comparison limit", () => {
    expect(validCatalogueIds({})).toEqual([]);
    expect(
      validCatalogueIds(["nibm-research-13", "nibm-research-13", "bad", null]),
    ).toEqual(["nibm-research-13"]);
    expect(nextComparison(["a"], "b", 3)).toEqual(["a"]);
    expect(nextComparison(["a"], "a", 3)).toEqual([]);
    expect(nextComparison(["a"], "b", 2)).toEqual(["a", "b"]);
  });
  it("keeps research-specific caveats and links all four student guides", () => {
    expect(
      rows.find((p) => p.ref.id === "nsbm-research-12")?.duration,
    ).toContain("3 or 4 years");
    expect(rows.find((p) => p.ref.id === "nibm-research-01")?.award).toContain(
      "needs confirmation",
    );
    expect(rows.find((p) => p.ref.id === "cinec-research-01")?.fee).toContain(
      "GBP",
    );
    expect(GUIDES).toHaveLength(4);
    expect(new Set(GUIDES.map((g) => g.slug)).size).toBe(4);
    expect(
      GUIDES.every(
        (g) => g.source.startsWith("https://") && g.sections.length === 3,
      ),
    ).toBe(true);
  });
});
