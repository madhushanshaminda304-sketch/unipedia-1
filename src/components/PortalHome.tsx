import React, { useMemo } from "react";
import { portalCopy } from "../lib/portalCopy";
import { useApp } from "../context/AppContext";
import {
  SUBJECTS,
  discoveryProgrammes,
  discoveryInstitutions,
  GUIDES,
} from "../lib/portal";
import {
  PortalSearch,
  InstitutionMark,
  ProgrammeCard,
  GraduationCap,
  BookOpen,
  GitCompareArrows,
} from "./PortalPrimitives";

export { PortalHome } from "./PortalHomeNext";
export function LegacyPortalHome() {
  const app = useApp(),
    c = portalCopy(app.lang),
    rows = useMemo(
      () => discoveryProgrammes(app.districtPrograms),
      [app.districtPrograms],
    ),
    institutions = discoveryInstitutions(rows);
  const selected = [
    "MRT",
    "PDN",
    "CMB",
    "SLIIT",
    "CINEC Campus",
    "NSBM Green University",
    "NIBM",
    "UCSC",
  ]
    .map((name) => institutions.find((i) => i.id === name || i.name === name))
    .filter((i): i is (typeof institutions)[number] => !!i);
  const examples = [
    "sliit-research-03",
    "cinec-research-02",
    "nsbm-research-08",
  ];
  return (
    <div className="portal-home" lang="en">
      <section
        className="portal-hero portal-container"
        lang={app.lang.toLowerCase()}
      >
        <div className="portal-hero-copy">
          <h1>
            {app.lang === "EN" ? (
              <>
                Find your next
                <br />
                study path.
              </>
            ) : (
              c.title
            )}
          </h1>
          <p className="hero-lede">{c.subtitle}</p>
          <PortalSearch />
          <div className="hero-quick-links">
            <a href="/explore?route=ugc">{c.ugcDegrees}</a>
            <a href="/explore?route=catalogue&level=Degree">{c.otherDegrees}</a>
            <a href="/explore?level=Diploma">{c.diplomas}</a>
            <a href="/explore?level=Foundation">{c.foundations}</a>
          </div>
        </div>
        <figure className="hero-photo" data-slot="student-life">
          <img
            src="/images/students-japura.webp"
            alt="Students preparing for exams at Japura campus, Sri Lanka"
            width="650"
            height="490"
            fetchPriority="high"
          />
          <figcaption>
            Student life at Japura <span>Photograph from 2013</span>
          </figcaption>
        </figure>
      </section>
      {app.lang !== "EN" && (
        <p
          className="portal-container language-note"
          lang={app.lang.toLowerCase()}
        >
          {c.english}
        </p>
      )}
      <div className="portal-facts portal-container">
        <p>
          <strong>{rows.length}</strong> study options to explore
        </p>
        <p>
          <strong>{institutions.length}</strong> universities & institutes
        </p>
        <a href="/courses">Have your A/L results? Explore UGC options</a>
      </div>
      <section className="portal-section portal-container">
        <div className="portal-section-head">
          <div>
            <h2>What interests you?</h2>
            <p>Find a subject you could see yourself studying.</p>
          </div>
          <a href="/explore">Explore all programmes</a>
        </div>
        <div className="subject-index">
          {SUBJECTS.map((subject, i) => (
            <a
              href={`/explore?subject=${encodeURIComponent(subject)}`}
              key={subject}
            >
              <span className="subject-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{subject}</span>
              <small>
                {rows.filter((p) => p.subject === subject).length} options
              </small>
            </a>
          ))}
        </div>
      </section>
      <section className="institutions-band">
        <div className="portal-container portal-section">
          <div className="portal-section-head">
            <div>
              <h2>Find a place to grow.</h2>
              <p>
                Explore universities and institutes, then see what they offer.
              </p>
            </div>
            <a href="/institutions">All institutions</a>
          </div>
          <div className="portal-institution-grid">
            {selected.map((i) => (
              <a className="portal-institution" href={i.href} key={i.href}>
                <InstitutionMark name={i.name} />
                <div>
                  <h3>{i.name}</h3>
                  <p>{i.count} programmes in our directory</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className="portal-container portal-section">
        <div className="portal-section-head">
          <div>
            <h2>Same interest. Different routes.</h2>
            <p>A closer look at software engineering.</p>
          </div>
          <a href="/explore?subject=Computing">Explore computing</a>
        </div>
        <div className="portal-programme-grid">
          {examples
            .map((id) => rows.find((p) => p.ref.id === id))
            .filter((p): p is (typeof rows)[number] => !!p)
            .map((p) => (
              <ProgrammeCard key={p.key} programme={p} />
            ))}
        </div>
        <div className="compare-invitation">
          <GitCompareArrows size={23} aria-hidden="true" />
          <p>Pick up to four programmes and compare the details that matter.</p>
          <a href="/compare">Open comparison</a>
        </div>
      </section>
      <section className="guide-band">
        <div className="portal-container portal-section">
          <div className="guide-intro">
            <BookOpen size={30} aria-hidden="true" />
            <h2>
              A little clarity
              <br />
              goes a long way.
            </h2>
            <p>Practical guides for your next decision.</p>
          </div>
          <div className="guide-index">
            {GUIDES.map((g, i) => (
              <a href={`/guides/${g.slug}`} key={g.slug}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{g.title}</h3>
                  <p>{g.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className="portal-container portal-section">
        <div className="portal-section-head">
          <div>
            <h2>Fresh from our research desk</h2>
            <p>
              Programme research dated 5 November 2026. Confirm current intakes
              with each institution.
            </p>
          </div>
          <a href="/explore?route=catalogue">Browse the research</a>
        </div>
        <div className="research-list">
          {["SLIIT", "CINEC Campus", "NSBM Green University", "NIBM"].map(
            (name) => (
              <a
                href={`/explore?institution=${encodeURIComponent(institutions.find((i) => i.name === name)?.id || "")}`}
                key={name}
              >
                <GraduationCap size={24} aria-hidden="true" />
                <h3>{name}</h3>
                <span>
                  {rows.filter((p) => p.institution === name).length} programme
                  listings
                </span>
                <time dateTime="2026-11-05">5 Nov 2026</time>
              </a>
            ),
          )}
        </div>
      </section>
      <div className="photo-credit portal-container" data-credits>
        Photograph:{" "}
        <a href="https://commons.wikimedia.org/wiki/File:University_Students_Studying_before_exams.jpg">
          Dinesh De Alwis, Wikimedia Commons
        </a>
        .{" "}
        <a href="https://creativecommons.org/licenses/by-sa/3.0/">
          CC BY-SA 3.0
        </a>
        . Resized and cropped; no endorsement implied.
      </div>
    </div>
  );
}
