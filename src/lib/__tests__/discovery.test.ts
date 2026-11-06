import { describe, expect, it } from "vitest";
import {
  academicCheck,
  cutoffLabel,
  emptyAcademicProfile,
  normalizeAcademicProfile,
  requirementPreview,
} from "../discovery";
import { readLocation, routePath } from "../routes";
import {
  getInstitutionById,
  getInstitutions,
  getProgramCutoffRowsForDistrict,
} from "../../services/ugcAdapter";

describe("Discovery and navigation regressions", () => {
  it("starts without invented student grades or general marks", () => {
    const profile = emptyAcademicProfile();
    expect(profile.subjects).toHaveLength(3);
    expect(profile.subjects.every((s) => !s.subject && !s.grade)).toBe(true);
    expect(profile.commonGeneralScore).toBeNull();
    expect(profile.ol).toEqual({});
    expect(academicCheck("001", profile).status).toBe(
      "FURTHER_CHECKING_NEEDED",
    );
  });
  it("recovers from malformed stored academic data", () => {
    for (const value of [
      null,
      false,
      {},
      "bad",
      { subjects: [null], ol: null, commonGeneralScore: 900 },
    ])
      expect(normalizeAcademicProfile(value)).toEqual(emptyAcademicProfile());
    const result = normalizeAcademicProfile({
      subjects: [{ subject: "Biology", grade: "A" }],
      ol: { english: "S", science: "bad" },
      commonGeneralScore: 40,
    });
    expect(result.subjects[0]).toEqual({ subject: "Biology", grade: "A" });
    expect(result.subjects).toHaveLength(3);
    expect(result.ol).toEqual({ english: "S" });
    expect(result.commonGeneralScore).toBe(40);
  });
  it("opens canonical institutions and preserves campus identities", () => {
    const rows = getProgramCutoffRowsForDistrict(1);
    for (const i of getInstitutions().filter(
      (i) => i.ugc_admission_participating,
    )) {
      expect(getInstitutionById(i.institution_id)?.official_name).toBe(
        i.official_name,
      );
      expect(rows.some((p) => p.institution_code === i.institution_id)).toBe(
        true,
      );
    }
    expect(getInstitutionById("MRT")?.official_name).toBe(
      "University of Moratuwa",
    );
    expect(getInstitutionById("UOM")?.institution_id).toBe("MRT");
    expect(getInstitutionById("SP")?.institution_id).not.toBe("CMB");
    expect(getInstitutionById("UNKNOWN")).toBeUndefined();
  });
  it("keeps numeric, negative, NQC and absent cutoffs distinct", () => {
    expect(cutoffLabel({ min_z_score: -0.1234, status: "QUALIFIED" })).toBe(
      "-0.1234",
    );
    expect(cutoffLabel({ min_z_score: null, status: "NQC" })).toBe("NQC");
    expect(
      cutoffLabel({ min_z_score: null, status: "NO_HISTORICAL_CUTOFF" }),
    ).toBe("No published history");
    expect(
      cutoffLabel({
        min_z_score: null,
        status: "QUALIFIED",
        needs_category_clarification: true,
      }),
    ).toBe("Select stream to view category");
  });
  it("shows the requirement before the long institution list", () => {
    const p = getProgramCutoffRowsForDistrict(1).find(
      (p) => p.uni_code === "001A",
    )!;
    expect(requirementPreview(p.al_requirements_summary)).toContain(
      "Biology, Chemistry and Physics",
    );
    expect(requirementPreview(p.al_requirements_summary)).not.toContain(
      "Faculty of Medicine",
    );
  });
  it("supports real paths, legacy bookmarks and unknown pages", () => {
    expect(readLocation({ pathname: "/universities/MRT", hash: "" })).toEqual({
      route: "institution",
      code: "MRT",
    });
    expect(readLocation({ pathname: "/", hash: "#institution/MRT" })).toEqual({
      route: "institution",
      code: "MRT",
    });
    expect(readLocation({ pathname: "/", hash: "#predictor" }).route).toBe(
      "predictor",
    );
    expect(readLocation({ pathname: "/courses/001a", hash: "" })).toEqual({
      route: "course",
      code: "001A",
    });
    expect(readLocation({ pathname: "/unrecognized", hash: "" }).route).toBe(
      "not-found",
    );
    expect(
      readLocation({ pathname: "/courses/%invalid", hash: "" }).route,
    ).toBe("not-found");
    expect(routePath("course", "001A")).toBe("/courses/001A");
  });
});
