import React from "react";
import { useApp } from "../context/AppContext";
import type { ProgramCutoffViewRow } from "../data/ugc/types";
import {
  academicCheck,
  cutoffLabel,
  plainHandbook,
  requirementPreview,
  STREAMS,
} from "../lib/discovery";
import { getAllDistrictCutoffsForUniCode } from "../services/ugcAdapter";
import { copy } from "../lib/ui";
import { SourceCitation } from "./SourceCitation";
import { CutoffEditionSelect } from "./CutoffEditionSelect";

export function CourseDetails({
  program: p,
  headingLevel = 2,
  showTitle = true,
}: {
  program: ProgramCutoffViewRow;
  headingLevel?: 1 | 2;
  showTitle?: boolean;
}) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const app = useApp(),
    c = copy(app.lang, app.cutoffYear),
    check = academicCheck(p.course_code, app.academicProfile),
    saved = app.planEntries.some((e) => e.uni_code === p.uni_code);
  return (
    <div className="details-stack">
      {showTitle && (
        <>
          <p className="eyebrow">
            {p.uni_code} · {p.stream}
          </p>
          <Heading>{p.course_name}</Heading>
          <button
            className="text-link"
            onClick={() => app.openInstitutionProfile(p.institution_code)}
          >
            {p.institution_name} ↗
          </button>
          <p className="muted">{c.historical}</p>
        </>
      )}
      <CutoffEditionSelect />
      <div className="button-row">
        <button
          className="button primary"
          onClick={() =>
            saved ? app.removeFromPlan(p.uni_code) : app.addToPlan(p.uni_code)
          }
        >
          {saved ? "✓ " + c.saved : c.save}
        </button>
        <button
          className="button secondary"
          aria-pressed={app.compareList.includes(p.uni_code)}
          onClick={() => app.toggleCompare(p.uni_code)}
        >
          {app.compareList.includes(p.uni_code) ? "✓ " : ""}
          {c.compare}
        </button>
      </div>
      <dl className="facts-grid" id="ugc-overview">
        <div>
          <dt>Degree</dt>
          <dd>{p.degree_display || c.unknown}</dd>
        </div>
        <div>
          <dt>Duration</dt>
          <dd>{p.duration_display || c.unknown}</dd>
        </div>
        <div>
          <dt>Medium</dt>
          <dd>{p.medium_display || c.unknown}</dd>
        </div>
        <div>
          <dt>Proposed intake · 2025/2026</dt>
          <dd>{p.proposed_intake ?? c.unknown}</dd>
        </div>
        <div>
          <dt>Aptitude / practical test</dt>
          <dd>
            {p.aptitude_status === "required"
              ? "Required. Check the institution’s current notice."
              : c.unknown}
          </dd>
        </div>
        <div>
          <dt>
            {c.cutoff} · {p.district_name}
          </dt>
          <dd>{cutoffLabel(p)}</dd>
        </div>
      </dl>
      <section id="ugc-requirements">
        <h3>{c.requirements} · 2025/2026</h3>
        <p className="source-prose">
          {requirementPreview(p.al_requirements_summary) ||
            "Read the full handbook section below."}
        </p>
        <p className="academic-explanation">
          <strong>
            {check.status === "ELIGIBLE"
              ? c.match
              : check.status === "NOT_ELIGIBLE"
                ? c.noMatch
                : c.further}
            .
          </strong>{" "}
          {check.reason}
        </p>
        <p className="small muted">
          The check covers supported academic rules only. General admission
          conditions, sitting and attempt rules, aptitude tests and official
          selection still apply.
        </p>
        {p.ol_requirements_text && (
          <p className="source-prose">
            {plainHandbook(p.ol_requirements_text)}
          </p>
        )}
        {p.conditional_honours_entry && (
          <p className="source-prose">
            {plainHandbook(p.conditional_honours_entry)}
          </p>
        )}
        <details>
          <summary>Read the full extracted handbook section</summary>
          <div className="source-prose full-excerpt">
            {plainHandbook(p.overview || p.al_requirements_summary)}
          </div>
        </details>
      </section>
      <section id="ugc-cutoffs">
        <h3>District cutoffs · {p.cutoff_year}</h3>
        <p className="small muted">
          {c.disclaimer} NQC means “No Qualified Candidates” in the handbook. It
          is not a zero score or a personal eligibility result. It can reflect a
          filled district quota, places filled by higher scores from other
          districts, or no candidates meeting requirements. No published history
          is not evidence of eligibility.
        </p>
        {p.needs_category_clarification ? (
          <>
            <label className="field">
              {c.stream}
              <select
                value={app.studentStream}
                onChange={(e) => app.setStudentStream(e.target.value)}
              >
                <option value="ALL">{c.all}</option>
                {STREAMS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <p>
              Select your stream to view the correct historical category.
              Categories:{" "}
              {p.category_split_options?.map((o) => o.qualifier).join("; ")}.
            </p>
          </>
        ) : (
          <div className="cutoff-grid">
            {getAllDistrictCutoffsForUniCode(
              p.uni_code,
              app.studentStream,
              p.cutoff_year,
            ).map((d) => (
              <div
                key={d.district_id}
                className={
                  d.district_id === app.district.district_id
                    ? "current-district"
                    : ""
                }
              >
                <span>{d.district_name}</span>
                <strong>
                  {d.min_z_score !== null
                    ? d.min_z_score.toFixed(4)
                    : d.status === "NQC"
                      ? "NQC"
                      : "No history"}
                </strong>
              </div>
            ))}
          </div>
        )}
      </section>
      <details className="source-details">
        <summary>{c.source}</summary>
        <dl>
          <dt>Handbook</dt>
          <dd>UGC 2025/2026</dd>
          <dt>Offering reference</dt>
          <dd>
            {p.source_reference.source_file} ·{" "}
            {p.source_reference.source_section}
            {p.source_reference.printed_page
              ? ` · printed page ${p.source_reference.printed_page}`
              : ""}
          </dd>
          <dt>Cutoff source · {p.cutoff_year}</dt>
          <dd>
            {p.cutoff_year === "2025/2026"
              ? "Official UGC selection cutoff release · 31 July 2026 · based on 2025 A/L results"
              : "Section 9 of the 2025/2026 handbook · based on 2024 A/L results"}
          </dd>
          {p.source_reference.cutoff_source_url && (
            <dd>
              <a
                href={p.source_reference.cutoff_source_url}
                target="_blank"
                rel="noreferrer"
              >
                Read the official cutoff PDF ↗
              </a>
            </dd>
          )}
          <dt>Review status</dt>
          <dd>
            Handbook requirements were extracted with AI assistance and checked
            against Markdown; original handbook PDF review remains outstanding.
            The 2025/2026 cutoffs are extracted directly from the official PDF
            with cell and mapping validation.
          </dd>
        </dl>
        <a href="https://www.ugc.ac.lk/" target="_blank" rel="noreferrer">
          Open the official UGC website ↗
        </a>
      </details>
      <SourceCitation source={p.eligibility_source_reference} />
    </div>
  );
}
