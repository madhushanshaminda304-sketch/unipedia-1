import React from "react";
import type { DiscoveryProgramme } from "../lib/portal";
import { ProgrammeActions, ProgrammeCard } from "./PortalPrimitives";
import { InstitutionVisual } from "./InstitutionVisual";
import {
  ClockIcon,
  MapPinIcon,
  GraduationCapIcon,
  ArrowSquareOutIcon,
} from "@phosphor-icons/react";
export function ImportedProgrammeDetail({
  programme: p,
  rows,
}: {
  programme: DiscoveryProgramme;
  rows: DiscoveryProgramme[];
}) {
  const source = p.source!;
  return (
    <div className="reference-screen imported-programme-detail">
      <div className="reference-container">
        <nav className="reference-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span>/</span>
          <a href="/pathways">Private & other programmes</a>
          <span>/</span>
          <span>Programme details</span>
        </nav>
        <header className="imported-programme-hero">
          <InstitutionVisual id={p.institutionId} name={p.institution} large />
          <div className="imported-programme-summary">
            <a className="catalogue-institution-name" href={p.institutionHref}>
              {p.institution}
            </a>
            <h1>{p.title}</h1>
            <div className="opportunity-tags">
              <span>
                <GraduationCapIcon size={15} />
                {p.level}
              </span>
              <span>
                <ClockIcon size={15} />
                {p.duration}
              </span>
              <span>Direct entry</span>
            </div>
            <p className="programme-campus-summary">
              <MapPinIcon size={16} />
              {p.campus}
            </p>
            <p className="small muted">
              Explore the reported requirements, costs and pathway details
              before contacting the institution.
            </p>
            <div className="imported-summary-actions">
              <a
                className="button primary"
                href={source.source_url}
                target="_blank"
                rel="noreferrer"
              >
                Visit official programme page
                <ArrowSquareOutIcon size={17} />
              </a>
              <ProgrammeActions programme={p} />
            </div>
          </div>
        </header>
        <nav
          className="programme-section-nav"
          aria-label="Programme information"
        >
          <a href="#programme-overview">Overview</a>
          <a href="#programme-requirements">Entry requirements</a>
          <a href="#programme-fees">Fees & payments</a>
          <a href="#programme-pathway">Pathway notes</a>
          <a href="#programme-sources">Sources</a>
        </nav>
        <section className="programme-overview-panel" id="programme-overview">
          <div>
            <h2>Key information</h2>
            <dl className="programme-key-facts">
              <div>
                <dt>
                  <ClockIcon size={18} />
                  Duration
                </dt>
                <dd>{p.duration}</dd>
              </div>
              <div>
                <dt>
                  <MapPinIcon size={18} />
                  Campus & study mode
                </dt>
                <dd>{p.campus}</dd>
              </div>
            </dl>
            {source.duration_notes && (
              <p className="source-prose small">{source.duration_notes}</p>
            )}
          </div>
          <div className="programme-fee-summary">
            <h2>Reported fee</h2>
            <p>{p.fee}</p>
            <a href="#programme-fees">See payment basis & caveats</a>
            {source.fee_notes && (
              <details className="summary-fee-notes">
                <summary>Fee notes & caveats</summary>
                <p className="source-prose">{source.fee_notes}</p>
              </details>
            )}
          </div>
          <div className="programme-award-summary">
            <h2>Awarding body reported</h2>
            <p>{p.award}</p>
            <small>
              Listing is not confirmation of recognition or accreditation.
            </small>
          </div>
        </section>
        <div className="imported-content-layout">
          <article className="programme-editorial">
            <section id="programme-requirements">
              <h2>Entry requirements</h2>
              <p className="source-prose">{p.requirements}</p>
            </section>
            <section id="programme-fees">
              <h2>Fees & payments</h2>
              <p className="detail-fee">{p.fee}</p>
              {source.fee_notes && (
                <p className="source-prose">{source.fee_notes}</p>
              )}
              <p className="small muted">
                Amounts retain their reported payment period. Confirm the
                current intake price, additional charges and total with the
                institution.
              </p>
            </section>
            <section id="programme-pathway">
              <h2>Pathway & important notes</h2>
              <p className="source-prose">
                {source.programme_notes ||
                  "No additional pathway notes were supplied in this report. Confirm progression and award requirements with the institution."}
              </p>
              {source.reported_intake && (
                <>
                  <h3>Intake listed in the source</h3>
                  <p>{source.reported_intake}</p>
                  <p className="small muted">
                    This is information from the report, not a live admission
                    announcement. Confirm current availability.
                  </p>
                </>
              )}
            </section>
            <section id="programme-sources">
              <h2>Research & sources</h2>
              <p className="small muted">
                Report date: {source.report_date || "Not supplied"}. Programme
                research has not been independently confirmed.
              </p>
              <details className="source-disclosure">
                <summary>View supplied research details</summary>
                <p>{source.source_document}</p>
                <p>
                  Verification status:{" "}
                  {source.verification_status.replaceAll("_", " ")}
                </p>
                <a href={source.source_url} target="_blank" rel="noreferrer">
                  Official programme source
                </a>
                {source.supporting_urls &&
                  source.supporting_urls.length > 0 && (
                    <>
                      <h3>Supporting source pages</h3>
                      <ul>
                        {source.supporting_urls.map((url) => (
                          <li key={url}>
                            <a href={url} target="_blank" rel="noreferrer">
                              {url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
              </details>
            </section>
          </article>
          <aside className="programme-next">
            <h2>Before you apply</h2>
            <p>
              Confirm your entry route, awarding body and full study costs for
              the intake you want.
            </p>
            <a
              className="button primary"
              href={source.source_url}
              target="_blank"
              rel="noreferrer"
            >
              Visit official programme page
            </a>
            <a href={`/pathways?subject=${encodeURIComponent(p.subject)}`}>
              Explore more {p.subject.toLowerCase()} options
            </a>
            <a href="/compare?route=catalogue">Open your comparison</a>
          </aside>
        </div>
        <section className="portal-section">
          <h2>More paths to explore</h2>
          <div className="portal-programme-grid">
            {rows
              .filter(
                (other) =>
                  other.key !== p.key &&
                  other.subject === p.subject &&
                  other.ref.kind === "catalogue",
              )
              .slice(0, 3)
              .map((other) => (
                <ProgrammeCard programme={other} key={other.key} />
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
