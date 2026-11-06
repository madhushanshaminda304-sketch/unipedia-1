import React, { useState } from "react";
import {PortalPathways} from './PortalPages';
export function PrivateUniversitiesView(){return <PortalPathways/>;}
import {
  NON_STATE_CATALOG,
  searchNonStateProgrammes,
  type BasicProgramme,
} from "../lib/nonStateCatalog";
import { Modal } from "./Modal";
import { DegreeRoiCalculator } from "./DegreeRoiCalculator";

export function LegacyPrivateUniversitiesView() {
  const [query, setQuery] = useState(""),
    [institution, setInstitution] = useState(""),
    [level, setLevel] = useState(""),
    [selected, setSelected] = useState<BasicProgramme | null>(null),
    [page, setPage] = useState(1);
  const results = searchNonStateProgrammes(query, institution, level),
    pages = Math.max(1, Math.ceil(results.length / 12)),
    currentPage = Math.min(page, pages);
  const reset = () => {
    setQuery("");
    setInstitution("");
    setLevel("");
    setPage(1);
  };
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">More ways to study</p>
          <h1>Private & other programmes</h1>
          <p className="muted">
            Explore private degrees, foreign university awards and direct entry
            public options.
          </p>
        </div>
      </div>
      <p className="notice compact">
        Collected programme information. Fees and requirements may change;
        confirm the current intake with the institution. Unknown details are
        shown as “Contact institution”.
      </p>
      <div className="programme-directory-filters">
        <label className="field">
          Search programmes or institutions
          <input
            type="search"
            placeholder="Try software engineering, SLIIT, business…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </label>
        <label className="field">
          Institution
          <select
            value={institution}
            onChange={(e) => {
              setInstitution(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All institutions</option>
            {[...new Set(NON_STATE_CATALOG.map((p) => p.institution))]
              .sort()
              .map((i) => (
                <option key={i}>{i}</option>
              ))}
          </select>
        </label>
        <label className="field">
          Qualification
          <select
            value={level}
            onChange={(e) => {
              setLevel(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All qualifications</option>
            {[...new Set(NON_STATE_CATALOG.map((p) => p.level))]
              .sort()
              .map((l) => (
                <option key={l}>{l}</option>
              ))}
          </select>
        </label>
        <button className="text-link" onClick={reset}>
          Clear filters
        </button>
      </div>
      <p role="status" className="directory-count">
        <strong>{results.length}</strong> {results.length===1?'programme':'programmes'} · {institution||'all institutions'}
      </p>
      {results.length ? (
        <>
          <div className="course-grid institution-courses">
            {results
              .slice((currentPage - 1) * 12, currentPage * 12)
              .map((p) => (
                <article
                  className="course-card basic-programme-card"
                  key={p.id}
                >
                  <div className="card-top">
                    <span className="eyebrow">{p.level}</span>
                    <span className="small muted">Collected info</span>
                  </div>
                  <h2>{p.title}</h2>
                  <p className="muted">{p.institution}</p>
                  {p.awarding_body && (
                    <p className="small muted">
                      Awarding body reported: {p.awarding_body}
                    </p>
                  )}
                  <div className="course-facts">
                    <span>
                      {p.duration_display || (p.duration_years
                        ? `${p.duration_years} ${p.duration_years === 1 ? "year" : "years"}`
                        : "Duration: contact institution")}
                    </span>
                    {p.campus_mode && <span>{p.campus_mode}</span>}
                  </div>
                  <div className="cutoff-box">
                    <span>Reported fee</span>
                    <strong className="reported-fee">
                      {p.reported_fee || "Contact institution"}
                    </strong>
                  </div>
                  <div className="button-row">
                    <button
                      className="button secondary"
                      onClick={() => setSelected(p)}
                    >
                      Requirements & details
                    </button>
                    <a
                      className="text-link small"
                      href={p.source_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Official website ↗
                    </a>
                  </div>
                </article>
              ))}
          </div>
          <nav className="pagination" aria-label="Programme pages">
            <button
              className="button secondary"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              Previous
            </button>
            <span>
              {currentPage} / {pages}
            </span>
            <button
              className="button secondary"
              disabled={currentPage === pages}
              onClick={() => {
                setPage(currentPage + 1);
                window.scrollTo({ top: 0 });
              }}
            >
              Next
            </button>
          </nav>
        </>
      ) : (
        <div className="empty-state">
          <h2>No programmes match these filters</h2>
          <button className="button primary" onClick={reset}>
            Clear filters
          </button>
        </div>
      )}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Programme requirements & details"
        wide
      >
        {selected && (
          <div className="details-stack">
            <p className="eyebrow">
              {selected.institution} · {selected.level}
            </p>
            <h2>{selected.title}</h2>
            <dl className="facts-grid">
              <div>
                <dt>Reported duration</dt>
                <dd>
                  {selected.duration_display || (selected.duration_years
                    ? `${selected.duration_years} years`
                    : "Contact institution")}
                </dd>
              </div>
              <div>
                <dt>Reported fee</dt>
                <dd>{selected.reported_fee || "Contact institution"}</dd>
              </div>
              {selected.awarding_body && (
                <div>
                  <dt>Reported awarding body</dt>
                  <dd>{selected.awarding_body}</dd>
                </div>
              )}
              {selected.campus_mode && (
                <div><dt>Reported campus & study mode</dt><dd>{selected.campus_mode}</dd></div>
              )}
              {selected.reported_intake && (
                <div><dt>Intake listed in source</dt><dd>{selected.reported_intake}. Confirm current availability with {selected.institution}.</dd></div>
              )}
            </dl>
            {selected.duration_notes && <p className="source-prose">{selected.duration_notes}</p>}
            {selected.programme_notes && (
              <div><h3>Programme notes</h3><p className="source-prose">{selected.programme_notes}</p></div>
            )}
            <h3>Entry requirements from the research</h3>
            <p className="source-prose">
              {selected.requirements ||
                "Contact the institution for course-specific entry requirements."}
            </p>
            {selected.fee_notes && (
              <details>
                <summary>Fee notes from the research</summary>
                <p className="source-prose">{selected.fee_notes}</p>
              </details>
            )}
            <p className="small muted">
              Source: {selected.source_document}
              {selected.report_date
                ? ` · report dated ${selected.report_date}`
                : " · date not supplied"}
              . Collected information has not been independently confirmed.
              Check the current intake, applicable campus and any additional
              fees.
            </p>
            <a
              className="button primary"
              href={selected.source_url}
              target="_blank"
              rel="noreferrer"
            >
              Check official programme information ↗
            </a>
          </div>
        )}
      </Modal>
      <section className="section">
        <h2>Planning your next step</h2>
        <div className="resource-list">
          <a
            href="https://studentloans.mohe.gov.lk/loan_web/"
            target="_blank"
            rel="noreferrer"
          >
            <strong>Official student loan information ↗</strong>
            <span>
              Check the current programme list and eligibility conditions.
            </span>
          </a>
          <a href="https://www.sliate.ac.lk/" target="_blank" rel="noreferrer">
            <strong>SLIATE ↗</strong>
            <span>Explore official diploma programmes and notices.</span>
          </a>
          <a href="https://ou.ac.lk/" target="_blank" rel="noreferrer">
            <strong>The Open University of Sri Lanka ↗</strong>
            <span>Explore programmes and direct admission routes.</span>
          </a>
        </div>
      </section>
      <DegreeRoiCalculator />
    </div>
  );
}
