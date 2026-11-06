import { describe, it, expect } from "vitest";
import { activeExploreFilters, applyExplorePatch } from "../exploreControls";
import { EMPTY_EXPLORE, readExplore } from "../portal";
describe("Programme filter controls", () => {
  it("clears one filter while retaining the route, remaining filters and unrelated parameters", () => {
    const current = new URLSearchParams(
      "route=catalogue&q=computer&institution=nibm&level=Foundation&page=3&campaign=school",
    );
    const next = applyExplorePatch(current, { level: "" }, "catalogue");
    const params = new URLSearchParams(next.query);
    expect(readExplore(params)).toMatchObject({
      route: "catalogue",
      q: "computer",
      institution: "nibm",
      level: "",
      page: 1,
    });
    expect(params.get("campaign")).toBe("school");
    expect(params.has("page")).toBe(false);
    expect(current.get("level")).toBe("Foundation");
  });
  it("keeps route separation even if a patch or old URL asks for mixed results", () => {
    expect(
      applyExplorePatch(
        new URLSearchParams("route=all"),
        { route: "all", subject: "Computing" },
        "ugc",
      ).filters.route,
    ).toBe("ugc");
  });
  it("uses readable removable labels without treating fees as comparable amounts", () => {
    const chips = activeExploreFilters(
      {
        ...EMPTY_EXPLORE,
        route: "catalogue",
        institution: "nibm",
        duration: "short",
        fees: "reported",
      },
      [{ id: "nibm", name: "NIBM" }],
    );
    expect(chips).toEqual([
      { key: "institution", label: "NIBM" },
      { key: "duration", label: "Up to 3 years" },
      { key: "fees", label: "Fee figure reported" },
    ]);
    expect(activeExploreFilters(EMPTY_EXPLORE, [])).toEqual([]);
  });
});
