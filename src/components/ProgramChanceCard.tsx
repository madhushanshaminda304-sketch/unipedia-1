import React from "react";
import { useApp } from "../context/AppContext";
import type { ProgramCutoffViewRow } from "../data/ugc/types";
import type {
  CourseAcademicEligibilityResult,
  StudentOlGrades,
} from "../lib/ugcLogic";
import { academicCheck, cutoffLabel } from "../lib/discovery";
import { copy } from "../lib/ui";
import { routePath } from "../lib/routes";

export const ProgramChanceCard = ({
  program,
  studentZ,
  academicEligibility,
  onOpenDetail,
}: {
  program: ProgramCutoffViewRow;
  studentZ?: number | null;
  studentOlGrades?: StudentOlGrades;
  matchesAlSubjects?: boolean;
  academicEligibility?: CourseAcademicEligibilityResult;
  onOpenDetail?: (p: ProgramCutoffViewRow) => void;
}) => {
  const app = useApp(),
    c = copy(app.lang, program.cutoff_year);
  const check =
    academicEligibility ||
    academicCheck(program.course_code, app.academicProfile);
  const saved = app.planEntries.some((p) => p.uni_code === program.uni_code),
    compared = app.compareList.includes(program.uni_code);
  return (
    <article className="course-card">
      <div className="card-top">
        <span className="eyebrow">{program.stream}</span>
        <span className="code">{program.uni_code}</span>
      </div>
      <h2>
        <a
          className="text-link course-title"
          href={routePath("course", program.uni_code)}
          onClick={(e) => {
            if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
              e.preventDefault();
              onOpenDetail
                ? onOpenDetail(program)
                : app.openCourseProfile(program.uni_code);
            }
          }}
        >
          {program.course_name}
        </a>
      </h2>
      <a
        className="university-link"
        href={routePath("institution", program.institution_code)}
        onClick={(e) => {
          if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
            e.preventDefault();
            app.openInstitutionProfile(program.institution_code);
          }
        }}
      >
        {program.institution_name}
      </a>
      <div className="course-facts">
        <span>
          {program.duration_years
            ? `${program.duration_display}`
            : "Duration not stated"}
        </span>
        <span>{program.medium_display || c.unknown}</span>
      </div>
      <div className="cutoff-box">
        <div>
          <span>
            {c.cutoff} · {program.cutoff_year}
          </span>
          <strong>{cutoffLabel(program)}</strong>
        </div>
        <small>
          {program.district_name}
          {program.all_island_merit_only ? " · All island merit" : ""}
        </small>
        {studentZ != null &&
          program.min_z_score != null &&
          !program.needs_category_clarification && (
            <small>
              Your score is{" "}
              {studentZ >= program.min_z_score ? "at or above" : "below"} this
              published cutoff. Entry requirements and official selection still
              apply.
            </small>
          )}
      </div>
      <div className={`academic-status status-${check.status}`}>
        <span className="status-dot" />
        <span>
          {check.status === "ELIGIBLE"
            ? c.match
            : check.status === "NOT_ELIGIBLE"
              ? c.noMatch
              : c.further}
        </span>
      </div>
      <div className="card-actions">
        <button
          className="button secondary"
          onClick={() =>
            onOpenDetail
              ? onOpenDetail(program)
              : app.openCourseProfile(program.uni_code)
          }
        >
          {c.details}
        </button>
        <button
          className={`button ${saved ? "selected" : "secondary"}`}
          aria-pressed={saved}
          onClick={() =>
            saved
              ? app.removeFromPlan(program.uni_code)
              : app.addToPlan(program.uni_code)
          }
        >
          {saved ? "✓ " + c.saved : "+ " + c.save}
        </button>
        <button
          className="compare-button"
          aria-pressed={compared}
          onClick={() => app.toggleCompare(program.uni_code)}
        >
          {compared ? "✓ " : ""}
          {c.compare}
        </button>
      </div>
    </article>
  );
};
