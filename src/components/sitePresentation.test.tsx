import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getProgramCutoffRowsForDistrict } from "../services/ugcAdapter";
import { emptyAcademicProfile } from "../lib/discovery";
import {
  InstitutionAndCourseProfileView,
  AdmissionsCalendarView,
} from "./ProfileAndCalendarView";
import { CompareEngineView } from "./CompareEngineView";
import { DegreeRoiCalculator } from "./DegreeRoiCalculator";
import { CareerAtlasAndQuizView } from "./CareerAtlasAndQuizView";
import { CourseDetails } from "./CourseDetails";
const fixture = vi.hoisted(() => ({ app: {} as any }));
vi.mock("../context/AppContext", () => ({ useApp: () => fixture.app }));
beforeEach(() => {
  fixture.app = {
    lang: "EN",
    district: { district_id: 1, district_name: "Colombo" },
    studentStream: "ALL",
    selectedInstitutionCode: "MRT",
    districtPrograms: getProgramCutoffRowsForDistrict(1),
    academicProfile: emptyAcademicProfile(),
    planEntries: [],
    compareList: [],
    setRoute: vi.fn(),
    openInstitutionProfile: vi.fn(),
  };
});
describe("Truthful site presentation", () => {
  it("gives standalone UGC programme pages a main heading", () => {
    fixture.app.selectedUniCode = "008G";
    const html = renderToStaticMarkup(<InstitutionAndCourseProfileView mode="course" />);
    expect(html).toContain("<h1>Engineering</h1>");
  });
  it("renders Moratuwa without substituting Colombo", () => {
    const html = renderToStaticMarkup(
      <InstitutionAndCourseProfileView mode="institution" />,
    );
    expect(html).toContain("<h1>University of Moratuwa</h1>");
    expect(html).toContain("16 course offerings");
    expect(html).not.toContain("University of Colombo");
  });
  it("shows a missing record rather than a university fallback", () => {
    fixture.app.selectedInstitutionCode = "MISSING";
    expect(
      renderToStaticMarkup(
        <InstitutionAndCourseProfileView mode="institution" />,
      ),
    ).toContain("We could not find that record");
  });
  it("does not convert unstated aptitude tests into No", () => {
    fixture.app.compareList = ["096T"];
    const html = renderToStaticMarkup(<CompareEngineView />);
    expect(html).toContain(
      "<dt>Aptitude / practical test</dt><dd>Not stated in this handbook</dd>",
    );
    expect(html).not.toContain("Minimum: S");
  });
  it("asks for the stream before displaying a split district matrix", () => {
    const p = fixture.app.districtPrograms.find(
      (p: any) => p.uni_code === "021L",
    );
    const html = renderToStaticMarkup(<CourseDetails program={p} />);
    expect(html).toContain(
      "Select your stream to view the correct historical category",
    );
    expect(html).not.toContain('class="cutoff-grid"');
    expect(html).toContain("Requirement source:");
  });
  it("does not promise reminders or a fabricated active admission window", () => {
    const html = renderToStaticMarkup(<AdmissionsCalendarView />);
    expect(html).toContain("No confirmed deadlines are published");
    expect(html).not.toContain("OPEN NOW");
    expect(html).not.toContain("<button");
  });
  it("waits for the user’s budget inputs instead of assuming costs or salary", () => {
    const html = renderToStaticMarkup(<DegreeRoiCalculator />);
    expect(html).toContain("Enter all four estimates");
    expect(html).not.toContain("165000");
    expect(html).not.toContain("Actual");
  });
  it("does not invent interest results before a choice is made", () => {
    const html = renderToStaticMarkup(<CareerAtlasAndQuizView />);
    expect(html).toContain("Select an area above");
    expect(html).not.toContain('class="course-card"');
    expect(html).not.toContain("Degrees you qualify");
  });
});
