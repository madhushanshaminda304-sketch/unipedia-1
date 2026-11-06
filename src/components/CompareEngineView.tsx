import React from "react";
import { usePortal } from "../context/PortalContext";
import { discoveryProgrammes } from "../lib/portal";
import { ProgrammeActions } from "./PortalPrimitives";
import { useApp } from "../context/AppContext";
import { copy } from "../lib/ui";
import { cutoffLabel, requirementPreview } from "../lib/discovery";
import { CutoffEditionSelect } from "./CutoffEditionSelect";
import { scopeFromQuery } from "../lib/discoveryRoutes";

export function CompareEngineView() {
  const app = useApp(),
    c = copy(app.lang, app.cutoffYear);
  const portal = usePortal();
  const scope = scopeFromQuery(
    new URLSearchParams(
      typeof window === "undefined" ? "" : window.location.search,
    ),
  );
  const catalogue = discoveryProgrammes(app.districtPrograms).filter(
    (p) =>
      scope === "catalogue" &&
      p.ref.kind === "catalogue" &&
      portal.compared.includes(p.ref.id),
  );
  const rows = app.compareList
    .map((code) => app.districtPrograms.find((p) => p.uni_code === code))
    .filter((p) => !!p);
  const visibleRows = scope === "ugc" ? rows : [];
  return (
    <div className="premium-page premium-comparison">
      <nav className="reference-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>Compare programmes</span></nav>
      <div className="page-heading">
        <div>
          <h1>{c.compare}</h1>
          <p className="muted">
            UGC and other programmes have separate comparison views. Save up to
            four choices in total.
          </p>
        </div>
        <button
          className="button secondary"
          onClick={() =>
            app.setRoute(scope === "ugc" ? "explore" : "private-unis")
          }
        >
          Add courses
        </button>
      </div>
      <p className="comparison-total" role="status">
        <strong>{app.compareList.length + portal.compared.length} of 4</strong>{" "}
        comparison slots used across both lists.
      </p>
      <nav className="route-switch" aria-label="Comparison admission routes">
        <a href="/compare" aria-current={scope === "ugc" ? "page" : undefined}>
          UGC programmes ({app.compareList.length})
        </a>
        <a
          href="/compare?route=catalogue"
          aria-current={scope === "catalogue" ? "page" : undefined}
        >
          Private & other programmes ({portal.compared.length})
        </a>
      </nav>
      {scope === "ugc" && <CutoffEditionSelect />}
      <p className="directory-count">
        <a href={scope === "ugc" ? "/explore" : "/pathways"}>
          Find more programmes to compare
        </a>
      </p>
      {!visibleRows.length && !catalogue.length ? (
        <div className="empty-state">
          <h2>{c.emptyCompare}</h2>
          <p>{c.emptyCompareBody}</p>
          <button
            className="button primary"
            onClick={() =>
              app.setRoute(scope === "ugc" ? "explore" : "private-unis")
            }
          >
            {c.find}
          </button>
        </div>
      ) : (
        <>
          <p className="notice compact">
            {scope === "ugc"
              ? `${c.disclaimer} “Not stated” means the handbook extraction does not establish that fact.`
              : "Fees keep their reported payment periods and currencies. Confirm current fees and requirements with the institution."}
          </p>
          <div
            className="comparison-table-wrap"
            tabIndex={0}
            role="region"
            aria-label="Programme comparison table"
          >
            <table className="comparison-table">
              <caption>Compare the essentials</caption>
              <thead>
                <tr>
                  <th scope="col">Programme details</th>
                  {[
                    ...visibleRows.map((p) => ({
                      id: p.uni_code,
                      title: p.course_name,
                      href: `/courses/${p.uni_code}`,
                      institution: p.institution_name,
                      route: "UGC admission",
                      award: p.degree_display || c.unknown,
                      duration: p.duration_display || c.unknown,
                      fee: "Check official UGC programme information",
                      requirements: p.al_requirements_summary,
                    })),
                    ...catalogue.map((p) => ({
                      id: p.key,
                      title: p.title,
                      href: p.href,
                      institution: p.institution,
                      route: "Direct entry",
                      award: p.award,
                      duration: p.duration,
                      fee: p.fee,
                      requirements: p.requirements,
                    })),
                  ].map((p) => (
                    <th scope="col" key={p.id}>
                      <a href={p.href}>{p.title}</a>
                      <button
                        className="text-link comparison-remove"
                        aria-label={`Remove ${p.title} from comparison table`}
                        onClick={() =>
                          p.id.startsWith("catalogue:")
                            ? portal.toggleCompared(p.id.slice(10))
                            : app.toggleCompare(p.id)
                        }
                      >
                        Remove
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    "institution",
                    "route",
                    "award",
                    "duration",
                    "fee",
                    "requirements",
                  ] as const
                ).map((field, index) => (
                  <tr key={field}>
                    <th scope="row">
                      {
                        [
                          "Institution",
                          "Admission route",
                          "Qualification / award",
                          "Duration",
                          "Fee information",
                          "Entry requirements",
                        ][index]
                      }
                    </th>
                    {[
                      ...visibleRows.map((p) => ({
                        id: p.uni_code,
                        institution: p.institution_name,
                        route: "UGC admission",
                        award: p.degree_display || c.unknown,
                        duration: p.duration_display || c.unknown,
                        fee: "Check official UGC programme information",
                        requirements: p.al_requirements_summary,
                      })),
                      ...catalogue.map((p) => ({
                        id: p.key,
                        institution: p.institution,
                        route: "Direct entry",
                        award: p.award,
                        duration: p.duration,
                        fee: p.fee,
                        requirements: p.requirements,
                      })),
                    ].map((p) => (
                      <td key={p.id}>
                        {field === "requirements" ? (
                          <details>
                            <summary>Read entry requirements</summary>
                            <p className="source-prose">{p[field]}</p>
                          </details>
                        ) : (
                          p[field]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <details className="comparison-detail-section" open>
            <summary>Cutoffs, sources & full programme details</summary>
            <div className="comparison-grid">
              {visibleRows.map((p) => (
                <article className="comparison-card" key={p.uni_code}>
                  <div className="card-top">
                    <span className="code">{p.uni_code}</span>
                    <button
                      className="text-link danger"
                      aria-label={`Remove ${p.course_name} from comparison`}
                      onClick={() => app.toggleCompare(p.uni_code)}
                    >
                      {c.remove}
                    </button>
                  </div>
                  <h2>{p.course_name}</h2>
                  <button
                    className="text-link"
                    onClick={() =>
                      app.openInstitutionProfile(p.institution_code)
                    }
                  >
                    {p.institution_name}
                  </button>
                  <dl>
                    <dt>Admission route</dt>
                    <dd>UGC admission</dd>
                    <dt>Institution</dt>
                    <dd>{p.institution_name}</dd>
                    <dt>Fee information</dt>
                    <dd>Check official UGC programme information</dd>
                    <dt>Degree</dt>
                    <dd>{p.degree_display || c.unknown}</dd>
                    <dt>Duration</dt>
                    <dd>{p.duration_display || c.unknown}</dd>
                    <dt>Medium</dt>
                    <dd>{p.medium_display || c.unknown}</dd>
                    <dt>Proposed intake · 2025/2026</dt>
                    <dd>{p.proposed_intake}</dd>
                    <dt>
                      {c.cutoff} · {p.district_name} · {p.cutoff_year}
                    </dt>
                    <dd>{cutoffLabel(p)}</dd>
                    <dt>Aptitude / practical test</dt>
                    <dd>
                      {p.aptitude_status === "required"
                        ? "Required"
                        : c.unknown}
                    </dd>
                    <dt>Academic rule review</dt>
                    <dd>
                      {p.auto_decision_safe
                        ? "Supported academic checks available"
                        : "Manual review needed"}
                    </dd>
                    <dt>{c.requirements} · 2025/2026</dt>
                    <dd className="source-prose">
                      {requirementPreview(p.al_requirements_summary)}
                    </dd>
                  </dl>
                  <button
                    className="button secondary"
                    onClick={() => app.openCourseProfile(p.uni_code)}
                  >
                    {c.details}
                  </button>
                </article>
              ))}
              {catalogue.map((p) => (
                <article className="comparison-card" key={p.key}>
                  <div className="card-top">
                    <span>{p.level}</span>
                    <button
                      className="text-link danger"
                      aria-label={`Remove ${p.title} from comparison`}
                      onClick={() => portal.toggleCompared(p.ref.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <h2>
                    <a href={p.href}>{p.title}</a>
                  </h2>
                  <a href={p.institutionHref}>{p.institution}</a>
                  <dl>
                    <dt>Admission route</dt>
                    <dd>Direct entry</dd>
                    <dt>Institution</dt>
                    <dd>{p.institution}</dd>
                    <dt>Fee information</dt>
                    <dd>{p.fee}</dd>
                    <dt>Degree / qualification</dt>
                    <dd>{p.award}</dd>
                    <dt>Duration</dt>
                    <dd>{p.duration}</dd>
                    <dt>Campus & study mode</dt>
                    <dd>{p.campus}</dd>
                    <dt>District cutoff</dt>
                    <dd>Not applicable to this admission route</dd>
                    <dt>Entry requirements</dt>
                    <dd className="source-prose">{p.requirements}</dd>
                  </dl>
                  {p.source?.programme_notes && (
                    <p className="small muted">{p.source.programme_notes}</p>
                  )}
                  <ProgrammeActions programme={p} />
                  <a className="button secondary" href={p.href}>
                    View programme
                  </a>
                </article>
              ))}
            </div>
          </details>
        </>
      )}
    </div>
  );
}
