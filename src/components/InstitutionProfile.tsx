import React, { useState } from "react";
import type { DiscoveryProgramme } from "../lib/portal";
import {
  InstitutionVisual,
  hasInstitutionPhotograph,
} from "./InstitutionVisual";
import { InstitutionMark } from "./PortalPrimitives";
import { UgcOpportunityRow } from "./UgcOpportunityRow";
import { ProgrammeDirectoryRow } from "./ProgrammeDirectoryRow";
import { INSTITUTION_PROFILES } from "../data/institutionProfiles";
import {
  MapPinIcon,
  GraduationCapIcon,
  BuildingsIcon,
  ArrowSquareOutIcon,
  BookOpenTextIcon,
} from "@phosphor-icons/react";
export function InstitutionProfile({
  id,
  name,
  kind,
  website,
  location,
  contact,
  source,
  programmes,
}: {
  id: string;
  name: string;
  kind: "ugc" | "catalogue";
  website: string;
  location: string;
  contact?: string | null;
  source: string;
  programmes: DiscoveryProgramme[];
}) {
  const research = kind === "ugc" ? INSTITUTION_PROFILES[id] : undefined;
  website = research?.website || website;
  location = research?.address || location;
  const [query, setQuery] = useState("");
  const choices = programmes.filter((p) =>
    `${p.title} ${p.subject}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="premium-page institution-profile-page" lang="en">
      <nav className="reference-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span>/</span>
        <a href={`/institutions?route=${kind}`}>
          {kind === "ugc" ? "UGC institutions" : "Other institutions"}
        </a>
        <span>/</span>
        <span>{name}</span>
      </nav>
      <div
        className={`institution-cover institution-cover-${id}${hasInstitutionPhotograph(id) ? "" : " institution-cover-text"}`}
        aria-hidden={hasInstitutionPhotograph(id) ? undefined : true}
      >
        {research?.cover ? (
          <figure className="institution-visual large">
            <img src={research.cover.src} srcSet={research.cover.srcSet}
              sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1384px) calc(100vw - 64px), 1320px"
              width={research.cover.width} height={research.cover.height}
              alt={research.cover.alt} decoding="async" />
            <figcaption>Photograph supplied by the site owner. Cropped for display.</figcaption>
          </figure>
        ) : hasInstitutionPhotograph(id) && (
          <InstitutionVisual id={id} name={name} large />
        )}
      </div>
      <header className="institution-profile-summary">
        <InstitutionMark name={name} />
        <div>
          <h1>{name}</h1>
          <p>
            {kind === "ugc"
              ? "Explore programmes listed in central UGC admissions."
              : "Explore reported programmes and direct institution entry routes."}
          </p>
        </div>
        {website && (
          <a
            className="button primary"
            href={website}
            target="_blank"
            rel="noreferrer"
          >
            Official website
            <ArrowSquareOutIcon size={17} />
          </a>
        )}
      </header>
      <dl className="institution-fact-strip">
        <div>
          <dt>
            <MapPinIcon size={19} />
            Location
          </dt>
          <dd>{location || "Check the official institution website"}</dd>
        </div>
        <div>
          <dt>
            <GraduationCapIcon size={19} />
            Listed programmes
          </dt>
          <dd>
            <strong>
              {programmes.length}{" "}
              {kind === "ugc" ? "course offerings" : "programme listings"}
            </strong>
          </dd>
        </div>
        <div>
          <dt>
            <BuildingsIcon size={19} />
            Admission route
          </dt>
          <dd>
            {kind === "ugc"
              ? "Central UGC admissions"
              : "Direct entry & other routes"}
          </dd>
        </div>
        <div>
          <dt>
            <BookOpenTextIcon size={19} />
            Information basis
          </dt>
          <dd>
            {kind === "ugc"
              ? "UGC handbook 2025/2026"
              : "Supplied programme research"}
          </dd>
        </div>
      </dl>
      <nav
        className="programme-section-nav"
        aria-label="Institution information"
      >
        <a href="#institution-overview">Overview</a>
        <a href="#institution-programmes">Programmes</a>
        <a href="#institution-admissions">Admissions</a>
        <a href="#institution-sources">Sources & contact</a>
      </nav>
      <div className="institution-overview-layout">
        <section className="premium-panel" id="institution-overview">
          <h2>About this listing</h2>
          <p>
            {research?.overview || (kind === "ugc"
              ? `${name} is included in the UGC handbook records used by UniPedia. Browse its listed course offerings and check programme-specific requirements and historical district cutoffs.`
              : `This profile brings together the supplied programme reports for ${name}. Compare durations, entry requirements, awarding bodies and reported fee periods before contacting the institution.`)}
          </p>
          <p className="small muted">
            Directory inclusion does not establish recognition or accreditation.
            Programme availability and current facts should be confirmed with
            the official institution.
          </p>
        </section>
        <aside className="premium-panel quick-links">
          <h2>Quick links</h2>
          {website && (
            <a href={website} target="_blank" rel="noreferrer">
              Official institution website
              <ArrowSquareOutIcon size={16} />
            </a>
          )}
          <a href={kind === "ugc" ? "/courses" : "/pathways"}>
            {kind === "ugc" ? "UGC course finder" : "Other programme directory"}
          </a>
          <a href="/guides">Student guides</a>
        </aside>
      </div>
      <section id="institution-programmes" className="institution-programmes">
        <div className="portal-section-head">
          <div>
            <h2>Programmes at {name}</h2>
            <p>{programmes.length} listings from the current catalogue</p>
          </div>
        </div>
        <label className="field">
          Find a programme at {name}
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search programme titles or subjects"
          />
        </label>
        <p className="small muted" role="status">
          {choices.length} matching programmes
        </p>
        <div className="opportunity-list">
          {choices.map((p) =>
            p.ugc ? (
              <UgcOpportunityRow key={p.key} program={p.ugc} />
            ) : (
              <ProgrammeDirectoryRow key={p.key} programme={p} />
            ),
          )}
          {!choices.length && (
            <div className="empty-state">
              <h3>No programmes match this search</h3>
              <button className="button secondary" onClick={() => setQuery("")}>
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>
      <section id="institution-admissions" className="premium-panel">
        <h2>Admissions & requirements</h2>
        <p>
          {research?.admissions || (kind === "ugc"
            ? "Historical cutoffs are references, not admission guarantees. Programme-specific subjects, grades, general admission conditions and aptitude tests may apply. Keep your preferences in the order you wish to study."
            : "Entry requirements and application steps differ by programme and awarding body. Check the full course page for fees, pathway stages, source dates and exceptions.")}
        </p>
        {research && <ul>{research.admissionsLinks.map((link) => <li key={link.href}><a href={link.href} target="_blank" rel="noreferrer">{link.label}</a></li>)}</ul>}
        <a
          className="button secondary"
          href={kind === "ugc" ? "/courses" : "/pathways"}
        >
          Explore your study options
        </a>
      </section>
      <section id="institution-sources" className="premium-panel">
        <h2>Sources & contact</h2>
        {research ? <>
          <p>Report research date: <time dateTime={research.reportDate}>{new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(research.reportDate))}</time>. Central address and general telephone numbers checked against the official university contact directory.</p>
          <p><strong>Central university address:</strong> {research.address}</p>
          <p><strong>General university telephone numbers:</strong></p>
          <ul>{research.telephones.map((phone) => <li key={phone}><a href={`tel:${phone.replace(/ /g, "")}`}>{phone}</a></li>)}</ul>
          <p>A single general university email is not listed. Use the official contact directory for office-specific contacts; faculty contacts are separate.</p>
          <ul>{research.sources.map((link) => <li key={link.href}><a href={link.href} target="_blank" rel="noreferrer">{link.label}</a></li>)}</ul>
          <p className="small muted">Programme requirements and historical cutoffs continue to use the existing UGC catalogue sources.</p>
        </> : <><p>{source}</p>{contact && <p>Contact listed in the source: {contact}</p>}</>}
        {website && (
          <a href={website} target="_blank" rel="noreferrer">
            Visit the official website for current contact details
          </a>
        )}
      </section>
    </div>
  );
}
