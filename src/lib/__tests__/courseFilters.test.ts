import { describe, expect, it } from "vitest";
import {
  DEFAULT_FILTERS,
  filterCourses,
  readCourseFilters,
  writeCourseFilters,
} from "../courseFilters";
import { emptyAcademicProfile } from "../discovery";
import { getProgramCutoffRowsForDistrict } from "../../services/ugcAdapter";
const rows = getProgramCutoffRowsForDistrict(1, "ALL");
describe("Advanced course filters", () => {
  it("does not treat stream choice as an eligibility decision or hide other sections by default", () => {
    expect(
      filterCourses(rows, { ...DEFAULT_FILTERS }, "Arts", null),
    ).toHaveLength(255);
    const filtered = filterCourses(
      rows,
      { ...DEFAULT_FILTERS, restrictStream: true },
      "Arts",
      null,
    );
    expect(filtered.length).toBeLessThan(255);
    expect(
      filtered.every((p) => p.stream === "Arts" || p.stream === "Other"),
    ).toBe(true);
  });
  it("combines university, media and aptitude filters using published values", () => {
    const example = rows.find((p) => p.medium.includes("E"))!;
    const result = filterCourses(
      rows,
      {
        ...DEFAULT_FILTERS,
        institution: example.institution_code,
        medium: "E",
        aptitude: example.aptitude_status,
      },
      "ALL",
      null,
    );
    expect(result.length).toBeGreaterThan(0);
    expect(
      result.every(
        (p) =>
          p.institution_code === example.institution_code &&
          p.medium.includes("E") &&
          p.aptitude_status === example.aptitude_status,
      ),
    ).toBe(true);
  });
  it("filters stated duration without assigning a default to unknown durations", () => {
    const four = filterCourses(
        rows,
        { ...DEFAULT_FILTERS, duration: "four" },
        "ALL",
        null,
      ),
      unknown = filterCourses(
        rows,
        { ...DEFAULT_FILTERS, duration: "unknown" },
        "ALL",
        null,
      );
    expect(four.length).toBeGreaterThan(0);
    expect(unknown.length).toBeGreaterThan(0);
    expect(
      four.every((p) => /^\s*0*4\s*years?\s*$/i.test(p.duration_display)),
    ).toBe(true);
    expect(unknown.some((p) => four.includes(p))).toBe(false);
  });
  it("keeps NQC, missing history and unresolved categories distinct", () => {
    const nqc = filterCourses(
      rows,
      { ...DEFAULT_FILTERS, cutoff: "nqc" },
      "ALL",
      null,
    );
    expect(nqc.length).toBeGreaterThan(0);
    expect(nqc.every((p) => p.status === "NQC" && p.min_z_score === null)).toBe(
      true,
    );
    expect(
      filterCourses(
        rows,
        { ...DEFAULT_FILTERS, cutoff: "category" },
        "ALL",
        null,
      ),
    ).toHaveLength(5);
    expect(
      filterCourses(
        rows,
        { ...DEFAULT_FILTERS, cutoff: "missing" },
        "ALL",
        null,
      ),
    ).toHaveLength(0);
  });
  it("compares Z scores without pretending missing or NQC scores are zero", () => {
    const result = filterCourses(
      rows,
      { ...DEFAULT_FILTERS, score: "at_or_above" },
      "ALL",
      1.5,
    );
    expect(result.length).toBeGreaterThan(0);
    expect(
      result.every(
        (p) =>
          p.min_z_score !== null &&
          !p.needs_category_clarification &&
          p.min_z_score <= 1.5,
      ),
    ).toBe(true);
    expect(
      filterCourses(
        rows,
        { ...DEFAULT_FILTERS, score: "at_or_above" },
        "ALL",
        null,
      ),
    ).toHaveLength(255);
  });
  it("sorts numeric cutoffs correctly and puts unresolved values last", () => {
    for (const sort of ["cutoff_up", "cutoff_down"]) {
      const result = filterCourses(
          rows,
          { ...DEFAULT_FILTERS, sort },
          "ALL",
          null,
        ),
        numeric = result
          .filter((p) => p.min_z_score !== null)
          .map((p) => p.min_z_score!);
      expect(numeric).toEqual(
        [...numeric].sort((a, b) => (sort === "cutoff_up" ? a - b : b - a)),
      );
      expect(result.at(-1)?.min_z_score).toBeNull();
    }
  });
  it("keeps uncertain academic cases discoverable when hiding confirmed mismatches", () => {
    expect(
      filterCourses(
        rows,
        { ...DEFAULT_FILTERS },
        "ALL",
        null,
        emptyAcademicProfile(),
        true,
      ),
    ).toHaveLength(255);
  });
  it("round trips browsing filters and year while excluding personal score comparisons", () => {
    const filters = {
      ...DEFAULT_FILTERS,
      query: "Engineering",
      institution: "MRT",
      medium: "E",
      duration: "four",
      aptitude: "required",
      cutoff: "numeric",
      sort: "cutoff_up",
      restrictStream: true,
      score: "at_or_above",
    };
    const params = writeCourseFilters(
      filters,
      "2025/2026",
      2,
      "Physical Science",
    );
    expect(params.get("year")).toBe("2025/2026");
    expect(params.has("score")).toBe(false);
    expect(params.has("z")).toBe(false);
    expect(readCourseFilters(params)).toEqual({ ...filters, score: "any" });
    expect(
      readCourseFilters(new URLSearchParams("sort=bad&medium=bad")).sort,
    ).toBe("name");
  });
});
