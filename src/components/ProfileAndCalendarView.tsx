import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getInstitutionById } from "../services/ugcAdapter";
import { copy } from "../lib/ui";
import { CourseDetails } from "./CourseDetails";
import { ProgramChanceCard } from "./ProgramChanceCard";
import { InstitutionProfile } from "./InstitutionProfile";
import { InstitutionVisual } from "./InstitutionVisual";
import { discoveryProgrammes } from "../lib/portal";
import { ugcReturnDestination } from "../lib/navigationMemory";

export function RecordNotFound() {
  const app = useApp(),
    c = copy(app.lang);
  return (
    <div className="premium-page empty-state premium-not-found">
      <p className="eyebrow">Record unavailable</p>
      <h1>{c.notFound}</h1>
      <p>{c.notFoundBody}</p>
      <button
        className="button primary"
        onClick={() => app.setRoute("predictor")}
      >
        {c.find}
      </button>
    </div>
  );
}
export function InstitutionAndCourseProfileView({
  mode,
}: {
  mode: "institution" | "course";
}) {
  const [programmeQuery, setProgrammeQuery] = useState("");
  const app = useApp(),
    c = copy(app.lang);
  if (mode === "course") {
    const program = app.districtPrograms.find(
      (p) => p.uni_code === app.selectedUniCode,
    );
    return program ? (
      <div className="premium-page ugc-programme-page">
        <nav className="reference-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span>/</span>
          <a
            href={ugcReturnDestination()}
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                e.preventDefault();
                const dest = ugcReturnDestination();
                if (typeof window !== "undefined" && window.history.length > 1) {
                  window.history.back();
                } else {
                  window.location.href = dest;
                }
              }
            }}
          >
            Back to courses
          </a>
          <span>/</span>
          <span>{program.course_name}</span>
        </nav>
        <header className="ugc-programme-heading">
          <InstitutionVisual
            id={program.institution_code}
            name={program.institution_name}
          />
          <div>
            <a href={`/universities/${program.institution_code}`}>
              {program.institution_name}
            </a>
            <h1>{program.course_name}</h1>
            <div className="opportunity-tags">
              <span>UGC admission</span>
              <span>{program.uni_code}</span>
              <span>{program.duration_display || "Duration not stated"}</span>
            </div>
          </div>
        </header>
        <nav
          className="programme-section-nav"
          aria-label="UGC programme information"
        >
          <a href="#ugc-overview">Overview</a>
          <a href="#ugc-requirements">Entry requirements</a>
          <a href="#ugc-cutoffs">District cutoffs</a>
        </nav>
        <div className="premium-panel">
          <CourseDetails program={program} headingLevel={1} showTitle={false} />
        </div>
      </div>
    ) : (
      <RecordNotFound />
    );
  }
  const institution = getInstitutionById(app.selectedInstitutionCode);
  if (!institution) return <RecordNotFound />;
  const programs = app.districtPrograms.filter(
    (p) => p.institution_code === institution.institution_id,
  );
  return (
    <InstitutionProfile
      id={institution.institution_id}
      name={institution.official_name}
      kind="ugc"
      website={
        institution.website ||
        (
          { MRT: "https://uom.lk/", PDN: "https://www.pdn.ac.lk/", CMB:'https://cmb.ac.lk/' } as Record<
            string,
            string
          >
        )[institution.institution_id] ||
        ""
      }
      location={institution.address_or_location}
      contact={
        institution.contact_general ||
        institution.telephone_numbers?.join(" / ")
      }
      source={`UGC Handbook 2025/2026 · ${institution.source_file} · ${institution.source_section}. The current catalogue contains ${programs.length} course offerings for this institution. Source transcription still requires review.`}
      programmes={discoveryProgrammes(programs).filter(
        (p) => p.ref.kind === "ugc",
      )}
    />
  );
}
export function AdmissionsCalendarView() {
  return (
    <div className="premium-page premium-notices">
      <p className="eyebrow">Stay informed</p>
      <h1>Dates & official notices</h1>
      <p className="lead">
        Check the current notice before planning an application or aptitude
        test.
      </p>
      <div className="notice">
        <h2>No confirmed deadlines are published in this version.</h2>
        <p>
          The handbook dataset is not a live admissions calendar. Past dates and
          unverified “open now” notices have been removed.
        </p>
      </div>
      <div className="resource-list">
        <a href="https://www.ugc.ac.lk/" target="_blank" rel="noreferrer">
          <strong>University Grants Commission ↗</strong>
          <span>
            Admission notices, handbooks and official selection information.
          </span>
        </a>
        <a href="https://www.doenets.lk/" target="_blank" rel="noreferrer">
          <strong>Department of Examinations ↗</strong>
          <span>Examination results and official notices.</span>
        </a>
      </div>
      <p className="muted">
        For aptitude tests, follow the official website of the university
        offering your course. This site does not send reminders or WhatsApp
        alerts.
      </p>
    </div>
  );
}
