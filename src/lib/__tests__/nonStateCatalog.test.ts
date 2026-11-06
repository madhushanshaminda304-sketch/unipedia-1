import { describe, expect, it } from "vitest";
import {
  NON_STATE_CATALOG,
  searchNonStateProgrammes,
} from "../nonStateCatalog";
import { PRIVATE_AND_ALTERNATIVE_PROGRAMS } from "../../data/sriLankaUgcSnapshot";
describe("Basic private and alternative programme directory", () => {
  it("imports 24 distinct SLIIT fact sheets with programme URLs rather than citation suffixes", () => {
    const rows = NON_STATE_CATALOG.filter((p) => p.institution === "SLIIT");
    expect(rows).toHaveLength(24);
    expect(new Set(rows.map((p) => p.source_url)).size).toBe(24);
    expect(
      rows.every((p) =>
        p.source_url.startsWith("https://www.sliit.lk/study/find-a-program/"),
      ),
    ).toBe(true);
    expect(rows.find((p) => p.id === "sliit-research-01")?.source_url).toBe(
      "https://www.sliit.lk/study/find-a-program/sliit-international-foundation",
    );
  });
  it("keeps missing domestic fees unknown instead of substituting international tuition", () => {
    for (const id of ["08", "10", "12", "13", "17", "21", "22"])
      expect(
        NON_STATE_CATALOG.find((p) => p.id === `sliit-research-${id}`)
          ?.reported_fee,
      ).toBeNull();
  });
  it("does not present the local transfer phase as a complete overseas programme fee", () => {
    const p = NON_STATE_CATALOG.find((p) => p.id === "sliit-research-18")!;
    expect(p.awarding_body).toBe("University of Queensland");
    expect(p.reported_fee).toContain(
      "per semester at SLIIT; overseas fees additional",
    );
  });
  it("retains earlier other-institution programmes without duplicating old SLIIT entries", () => {
    for (const p of PRIVATE_AND_ALTERNATIVE_PROGRAMS.filter(
      (p) =>
        p.institute_code !== "SLIIT" &&
        !/cinec/i.test(`${p.institute_code} ${p.institute_name}`) &&
        !/nsbm/i.test(`${p.institute_code} ${p.institute_name}`) &&
        !/nibm|national institute of business management/i.test(`${p.institute_code} ${p.institute_name}`) &&
        !p.institute_name
          .toLowerCase()
          .includes("sri lanka institute of information technology"),
    ))
      expect(NON_STATE_CATALOG.some((row) => row.id === p.id)).toBe(true);
    expect(new Set(NON_STATE_CATALOG.map((p) => p.id)).size).toBe(
      NON_STATE_CATALOG.length,
    );
  });
  it("searches programmes and awarding bodies and combines institution and level", () => {
    expect(
      searchNonStateProgrammes("software", "SLIIT", "Degree").some((p) =>
        p.title.includes("Software Engineering"),
      ),
    ).toBe(true);
    expect(searchNonStateProgrammes("", "SLIIT", "Foundation")).toHaveLength(1);
    expect(searchNonStateProgrammes("Queensland").length).toBeGreaterThan(0);
  });
  it("imports 34 distinct CINEC listings and replaces the older CINEC placeholders", () => {
    const rows = searchNonStateProgrammes("", "CINEC Campus");
    expect(rows).toHaveLength(34);
    expect(new Set(rows.map(p => p.source_url)).size).toBe(34);
    expect(rows.every(p => /^https:\/\/www\.cinec\.edu\/courses\/.+\.html$/.test(p.source_url))).toBe(true);
    expect(rows.every(p => p.id.startsWith("cinec-research-"))).toBe(true);
  });
  it("retains CINEC fee components, exact month durations, unknowns and historical intake dates", () => {
    const row = (id: string) => NON_STATE_CATALOG.find(p => p.id === `cinec-research-${id}`)!;
    expect(row("01").reported_fee).toContain("GBP 1,500");
    expect(row("01").reported_fee).toContain("registration");
    expect(row("01").fee_notes).toContain("LKR 40,000 x 30");
    expect(row("01").reported_intake).toBe("September 2025");
    expect(row("04").requirements).toContain("PTE min 51.");
    expect(row("09").duration_display).toBe("8 Months (2 Semesters)");
    expect(row("09").duration_years).toBeNull();
    expect(row("18").reported_fee).toBeNull();
    expect(row("18").requirements).toBeNull();
    expect(row("28").duration_display).toContain("6-month industrial training");
    expect(row("30").reported_intake).toBe("2022");
  });
  it("imports 28 distinct NSBM programmes with separate awarding bodies and one foundation covering five streams", () => {
    const rows = searchNonStateProgrammes("", "NSBM Green University");
    expect(rows).toHaveLength(28);
    expect(new Set(rows.map(p => p.source_url)).size).toBe(28);
    expect(rows.every(p => p.id.startsWith("nsbm-research-") && /^https:\/\/www\.nsbm\.ac\.lk\/course\/[^/]+\/$/.test(p.source_url))).toBe(true);
    expect(searchNonStateProgrammes("", "NSBM Green University", "Foundation")).toHaveLength(1);
    expect(searchNonStateProgrammes("Computer Science", "NSBM Green University").map(p => p.awarding_body)).toEqual(expect.arrayContaining(["NSBM Green University", "University of Plymouth, United Kingdom"]));
  });
  it("preserves NSBM conflicts, transfer scope, variable duration and specific entry gates", () => {
    const row = (id: string) => NON_STATE_CATALOG.find(p => p.id === `nsbm-research-${id}`)!;
    expect(row("02").reported_fee).toContain("Conflicting fees");
    expect(row("02").fee_notes).toContain("2,800,000 LKR");
    expect(row("02").fee_notes).toContain("400,000 LKR per semester");
    expect(row("06").reported_fee).toBe("LKR 400,000 per semester");
    expect(row("12").duration_years).toBeNull();
    expect(row("12").duration_display).toContain("3 or 4 years");
    expect(row("12").reported_fee).toBeNull();
    expect(row("14").reported_fee).toContain("overseas fees unknown");
    expect(row("24").duration_display).toBe("3 Years + 6 Months Internship");
    expect(row("26").duration_years).toBeNull();
    expect(row("26").duration_display).toContain("1 to 2 Years");
    expect(row("25").requirements).toContain("English Proficiency Test");
    expect(row("25").requirements).toContain("2 years of industrial experience");
    expect(row("27").requirements).toContain("Portfolio Test");
    expect(row("01").requirements).toContain("Engineering Stream");
  });
  it("imports 32 NIBM listings with separate study-mode qualifications and public course URLs", () => {
    const rows = searchNonStateProgrammes("", "NIBM");
    expect(rows).toHaveLength(32);
    expect(new Set(rows.map(p => p.source_url)).size).toBe(32);
    expect(rows.every(p => p.id.startsWith("nibm-research-") && p.source_url.startsWith("https://nibm.ac.lk/course/"))).toBe(true);
    expect(searchNonStateProgrammes("", "NIBM", "Foundation")).toHaveLength(4);
    expect(searchNonStateProgrammes("", "NIBM", "Degree")).toHaveLength(9);
    expect(searchNonStateProgrammes("Higher National Diploma in Software Engineering", "NIBM")).toHaveLength(2);
  });
  it("keeps NIBM staged costs, incomplete rules, conflicts and awarding-body uncertainty visible", () => {
    const row = (id: string) => NON_STATE_CATALOG.find(p => p.id === `nibm-research-${id}`)!;
    expect(row("01").reported_fee).toContain("by year");
    expect(row("01").fee_notes).toContain("Year 04: LKR 800,000");
    expect(row("01").awarding_body).toContain("needs confirmation");
    expect(row("01").programme_notes).toContain("complete A/L entry option");
    expect(row("13").duration_years).toBeNull();
    expect(row("13").reported_fee).toContain("850,000");
    expect(row("13").reported_fee).toContain("450,000");
    expect(row("18").programme_notes).toContain("6 months");
    expect(row("18").programme_notes).toContain("1 year");
    expect(row("22").duration_years).toBe(1.5);
    expect(row("24").duration_display).toBe("6 Months");
    expect(row("31").programme_notes).toContain("not a complete entry rule");
    expect(row("32").requirements).toContain("Placement Test Route");
    expect(row("01").reported_intake).toContain("08 Oct 2026");
    expect(row("01").reported_intake).not.toContain("202614");
  });
});
