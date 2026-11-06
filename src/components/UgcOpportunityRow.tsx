import React from "react";
import { useApp } from "../context/AppContext";
import type { ProgramCutoffViewRow } from "../data/ugc/types";
import { academicCheck, cutoffLabel } from "../lib/discovery";
import { historicalComparison } from "../lib/finderFlow";
import { InstitutionVisual } from "./InstitutionVisual";
import { rememberUgcReturn } from "../lib/navigationMemory";
import {
  BookmarkSimpleIcon,
  ArrowsLeftRightIcon,
  MapPinIcon,
} from "@phosphor-icons/react";
export function UgcOpportunityRow({
  program: p,
}: {
  program: ProgramCutoffViewRow;
}) {
  const app = useApp(),
    comparison = historicalComparison(p, app.studentZScore),
    academic = academicCheck(p.course_code, app.academicProfile);
  const saved = app.planEntries.some((e) => e.uni_code === p.uni_code),
    compared = app.compareList.includes(p.uni_code);
  return (
    <article className="opportunity-row">
      <div className="opportunity-identity">
        <InstitutionVisual id={p.institution_code} name={p.institution_name} />
        <div>
          <a
            className="opportunity-university"
            href={`/universities/${p.institution_code}`}
          >
            {p.institution_name}
          </a>
          <h2>
            <a
              href={`/courses/${p.uni_code}`}
              onClick={(e) => {
                rememberUgcReturn(
                  location.pathname + location.search + location.hash,
                );
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                  e.preventDefault();
                  app.openCourseProfile(p.uni_code);
                }
              }}
            >
              {p.course_name}
            </a>
          </h2>
          <p>
            <MapPinIcon size={14} aria-hidden="true" />
            {p.institution_location || "Location not stated"}
          </p>
          <div className="opportunity-tags">
            <span>{p.duration_display || "Duration not stated"}</span>
            <span>{p.uni_code}</span>
            <span>{p.stream}</span>
          </div>
          <p className={`eligibility-line status-${academic.status}`}>
            Academic check:{" "}
            {academic.status === "ELIGIBLE"
              ? "Meets evaluated requirements"
              : academic.status === "NOT_ELIGIBLE"
                ? "Requirements not met"
                : "Further checks needed"}
          </p>
        </div>
      </div>
      <div className="opportunity-cutoff">
        <span>Historical cutoff</span>
        <strong>{cutoffLabel(p)}</strong>
        <small>
          {p.cutoff_year} · {p.district_name}
        </small>
        {p.all_island_merit_only && <small>All island merit</small>}
      </div>
      <div className={`opportunity-score score-${comparison}`}>
        <strong>
          {comparison === "at_or_above"
            ? "At or above cutoff"
            : comparison === "below"
              ? "Below cutoff"
              : comparison === "unavailable"
                ? "Comparison unavailable"
                : "No Z-score entered"}
        </strong>
        {typeof app.studentZScore === "number" &&
          Number.isFinite(app.studentZScore) && (
            <small>Your Z-score: {app.studentZScore.toFixed(4)}</small>
          )}
        <small>
          {comparison === "unavailable"
            ? "Check published status and stream category."
            : "Historical comparison only; admission is not guaranteed."}
        </small>
      </div>
      <div className="opportunity-actions">
        <a
          className="button primary"
          href={`/courses/${p.uni_code}`}
          onClick={(e) => {
            rememberUgcReturn(
              location.pathname + location.search + location.hash,
            );
            if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
              e.preventDefault();
              app.openCourseProfile(p.uni_code);
            }
          }}
        >
          View programme
        </a>
        <div>
          <button
            className="icon-action"
            aria-pressed={saved}
            aria-label={`${saved ? "Remove saved" : "Save"} ${p.course_name}`}
            onClick={() =>
              saved ? app.removeFromPlan(p.uni_code) : app.addToPlan(p.uni_code)
            }
          >
            <BookmarkSimpleIcon size={16} />
            {saved ? "Saved" : "Save"}
          </button>
          <button
            className="icon-action"
            aria-pressed={compared}
            aria-label={`Compare ${p.course_name}`}
            onClick={() => app.toggleCompare(p.uni_code)}
          >
            <ArrowsLeftRightIcon size={16} />
            {compared ? "Comparing" : "Compare"}
          </button>
        </div>
      </div>
    </article>
  );
}
