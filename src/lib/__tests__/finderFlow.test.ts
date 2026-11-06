import { describe, it, expect } from "vitest";
import {
  readFinderQuery,
  writeFinderQuery,
  historicalComparison,
  freshFinderQuery,
} from "../finderFlow";
import { filterCourses } from "../courseFilters";
import { getProgramCutoffRowsForDistrict } from "../../services/ugcAdapter";
describe("Two-step UGC discovery", () => {
  it("opens the profile by default and restores explicit or legacy results links", () => {
    expect(readFinderQuery(new URLSearchParams()).view).toBe("profile");
    expect(readFinderQuery(new URLSearchParams("view=results")).view).toBe(
      "results",
    );
    expect(
      readFinderQuery(new URLSearchParams("year=2024%2F2025&district=2")).view,
    ).toBe("results");
    expect(readFinderQuery(new URLSearchParams("q=medicine")).view).toBe(
      "results",
    );
    expect(
      readFinderQuery(new URLSearchParams("view=profile&q=medicine")).view,
    ).toBe("profile");
  });
  it("roundtrips filters, status, page and view without including academic details", () => {
    const state = freshFinderQuery();
    state.page = 3;
    state.filters.query = "Science";
    state.filters.score = "below";
    state.filters.medium = "E";
    state.filters.restrictStream = true;
    state.hideMismatch = true;
    const params = writeFinderQuery(state, "2024/2025", 5, "Physical Science");
    expect(readFinderQuery(params)).toEqual(state);
    expect(params.get("year")).toBe("2024/2025");
    expect(params.get("district")).toBe("5");
    expect(params.get("stream")).toBe("Physical Science");
    expect([...params.keys()]).not.toContain("z");
    expect([...params.keys()]).not.toContain("subjects");
  });
  it("normalises invalid pages and status values", () => {
    for (const value of ["0", "-2", "NaN", "Infinity", "1.5"])
      expect(readFinderQuery(new URLSearchParams(`page=${value}`)).page).toBe(
        1,
      );
    expect(
      readFinderQuery(new URLSearchParams("score=high_match")).filters.score,
    ).toBe("any");
  });
  it("handles negative and equal scores without implying admission eligibility", () => {
    const row = { min_z_score: -0.125, needs_category_clarification: false };
    expect(historicalComparison(row, -0.125)).toBe("at_or_above");
    expect(historicalComparison(row, -0.126)).toBe("below");
    expect(historicalComparison(row, null)).toBe("no_score");
  });
  it("keeps category ambiguity and missing values out of numeric comparisons", () => {
    expect(
      historicalComparison(
        { min_z_score: 1, needs_category_clarification: true },
        3,
      ),
    ).toBe("unavailable");
    expect(
      historicalComparison(
        { min_z_score: null, needs_category_clarification: false },
        3,
      ),
    ).toBe("unavailable");
  });
  it("partitions all rows across the three historical comparison groups", () => {
    for (const year of ["2025/2026", "2024/2025"] as const) {
      const rows = getProgramCutoffRowsForDistrict(1, "ALL", year),
        state = freshFinderQuery();
      const counts = ["at_or_above", "below", "unavailable"].map(
        (score) =>
          filterCourses(rows, { ...state.filters, score }, "ALL", 1.5).length,
      );
      expect(counts.reduce((a, b) => a + b, 0)).toBe(rows.length);
      expect(
        filterCourses(
          rows,
          { ...state.filters, score: "unavailable" },
          "ALL",
          null,
        ).every((p) => historicalComparison(p, null) === "unavailable"),
      ).toBe(true);
    }
  });
});
