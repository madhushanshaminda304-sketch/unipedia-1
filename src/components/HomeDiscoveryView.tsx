import React from "react";
import {PortalHome} from './PortalHome';
export function HomeDiscoveryView(){return <PortalHome/>;}
import { useApp } from "../context/AppContext";
import {
  getInstitutions,
  getActiveCourses,
  getSelectableOfferings,
} from "../services/ugcAdapter";
import { copy } from "../lib/ui";
import { routePath } from "../lib/routes";

export function LegacyHomeDiscoveryView() {
  const app = useApp(),
    c = copy(app.lang, app.cutoffYear);
  const institutions = getInstitutions().filter(
    (i) => i.ugc_admission_participating,
  );
  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">A clearer way to explore higher education</p>
          <h1>{c.title}</h1>
          <p className="hero-description">{c.subtitle}</p>
          <button
            className="button primary"
            onClick={() => app.setRoute("predictor")}
          >
            {c.start} <span aria-hidden="true">↗</span>
          </button>
          <p className="muted small">{c.local}</p>
          <button
            className="button secondary"
            onClick={() => app.setRoute("private-unis")}
          >
            Explore private & other programmes ↗
          </button>
        </div>
        <div className="hero-guide">
          <span className="eyebrow">Your next steps</span>
          <ol>
            <li>
              <span>01</span>
              <div>
                <h2>Explore your options</h2>
                <p>Browse degrees by stream, subject and university.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h2>Understand the requirements</h2>
                <p>Read the handbook rules and compare historical cutoffs.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h2>Build your own shortlist</h2>
                <p>Save choices and put your preferences first.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>
      <div className="dataset-strip">
        <div>
          <strong>{getSelectableOfferings().length}</strong>
          <span>UGC course offerings</span>
        </div>
        <div>
          <strong>{getActiveCourses().length}</strong>
          <span>Active courses</span>
        </div>
        <div>
          <strong>{institutions.length}</strong>
          <span>Participating institutions</span>
        </div>
        <p>
          {c.historical}
          <br />
          <button className="text-link" onClick={() => app.setRoute("about")}>
            How this data was prepared →
          </button>
        </p>
      </div>
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Explore the institutions</p>
            <h2>A place to begin.</h2>
          </div>
          <p className="muted">
            Universities, campuses and institutes retain their own identities.
          </p>
        </div>
        <div className="institution-grid">
          {institutions.map((i) => (
            <a
              className="institution-tile"
              key={i.institution_id}
              href={routePath("institution", i.institution_id)}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                  e.preventDefault();
                  app.openInstitutionProfile(i.institution_id);
                }
              }}
            >
              <span className="institution-initial">
                {i.official_abbreviation || i.institution_id}
              </span>
              <span>{i.official_name}</span>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>
      <section className="notice">
        <h2>Know what the numbers mean.</h2>
        <p>
          {c.disclaimer} NQC, missing history and different stream categories
          are shown separately. Source transcription still needs checking
          against the original PDF.
        </p>
        <button className="text-link" onClick={() => app.setRoute("about")}>
          {c.about} →
        </button>
      </section>
    </div>
  );
}
