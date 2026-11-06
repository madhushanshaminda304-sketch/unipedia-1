import React, { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { SRI_LANKA_DISTRICTS } from "../data/sriLankaUgcSnapshot";
import {
  STREAMS,
  SUBJECTS,
  emptyAcademicProfile,
  normalizeAcademicProfile,
  type AcademicProfile,
} from "../lib/discovery";
import {
  DEFAULT_FILTERS,
  filterCourses,
  type CourseFilters,
} from "../lib/courseFilters";
import {
  readFinderQuery,
  writeFinderQuery,
  historicalComparison,
  type FinderQuery,
} from "../lib/finderFlow";
import type { CutoffYear } from "../services/ugcAdapter";
import type { ALGrade, OlGrade, StudentOlGrades } from "../lib/ugcLogic";
import { AdmissionGuidance } from "./AdmissionGuidance";
import { portalCopy } from "../lib/portalCopy";
import { UgcOpportunityRow } from "./UgcOpportunityRow";
import {
  GraduationCapIcon,
  ChartBarIcon,
  BookOpenTextIcon,
  StackIcon,
  CheckIcon,
  CaretRightIcon,
  PencilSimpleIcon,
  ShareNetworkIcon,
  InfoIcon,
} from "@phosphor-icons/react";

export function UgcFinder() {
  const app = useApp(),
    appRef = useRef(app);
  appRef.current = app;
  const makeDraft = () => {
    const current = appRef.current,
      params = new URLSearchParams(location.search),
      year = params.get("year"),
      district = Number(params.get("district")),
      stream = params.get("stream");
    return {
      year: (year === "2024/2025" || year === "2025/2026"
        ? year
        : current.cutoffYear) as CutoffYear,
      district: SRI_LANKA_DISTRICTS.some((d) => d.district_id === district)
        ? district
        : current.district.district_id,
      stream:
        stream && (STREAMS.includes(stream) || stream === "ALL")
          ? stream
          : params.has("view") && params.has("year")
            ? "ALL"
            : current.studentStream,
      z: current.studentZScore === null ? "" : String(current.studentZScore),
      academic: normalizeAcademicProfile(current.academicProfile),
    };
  };
  const [state, setState] = useState(() =>
      readFinderQuery(new URLSearchParams(location.search)),
    ),
    [draft, setDraft] = useState(makeDraft),
    [share, setShare] = useState("");
  useEffect(() => {
    const sync = () => {
      const params = new URLSearchParams(location.search),
        current = appRef.current,
        next = makeDraft();
      if (params.has("district"))
        current.setDistrictId(next.district, { silent: true });
      if (params.has("year")) current.setCutoffYear(next.year);
      if (params.has("stream") || (params.has("view") && params.has("year")))
        current.setStudentStream(next.stream);
      setState(readFinderQuery(params));
      setDraft(next);
      setShare("");
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  useEffect(() => {
    document.getElementById("finder-heading")?.focus({ preventScroll: true });
    if (state.view === "profile" && location.hash === "#academic-requirements")
      requestAnimationFrame(() => {
        const details = document.getElementById(
          "academic-requirements",
        ) as HTMLDetailsElement | null;
        if (details) {
          details.open = true;
          details.scrollIntoView();
        }
      });
  }, [state.view]);
  const navigate = (
    next: FinderQuery,
    profile = {
      year: app.cutoffYear,
      district: app.district.district_id,
      stream: app.studentStream,
    },
  ) => {
    const params = writeFinderQuery(
      next,
      profile.year,
      profile.district,
      profile.stream,
    );
    history.pushState(null, "", `/courses?${params}`);
    setState(next);
    setShare("");
  };
  const updateFilters = (patch: Partial<CourseFilters>) =>
    navigate({ ...state, filters: { ...state.filters, ...patch }, page: 1 });
  const setAcademic = (update: (p: AcademicProfile) => AcademicProfile) =>
    setDraft((d) => ({ ...d, academic: update(d.academic) }));
  const updateSubject = (i: number, key: "subject" | "grade", value: string) =>
    setAcademic((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s, index) =>
        index === i ? { ...s, [key]: value } : s,
      ),
    }));
  const edit = () => {
    setDraft(makeDraft());
    navigate({ ...state, view: "profile" });
    window.scrollTo({ top: 0 });
  };
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const z = draft.z.trim() === "" ? null : Number(draft.z);
    if (z !== null && !Number.isFinite(z)) return;
    app.setDistrictId(draft.district);
    app.setCutoffYear(draft.year);
    app.setStudentStream(draft.stream);
    app.setStudentZScore(z);
    app.setAcademicProfile(normalizeAcademicProfile(draft.academic));
    navigate(
      {
        ...state,
        view: "results",
        page: 1,
        filters: {
          ...state.filters,
          score:
            z === null && state.filters.score !== "unavailable"
              ? "any"
              : state.filters.score,
        },
      },
      draft,
    );
    window.scrollTo({ top: 0 });
  };
  const score =
    app.studentZScore === null && state.filters.score !== "unavailable"
      ? "any"
      : state.filters.score;
  const base = useMemo(
    () =>
      filterCourses(
        app.districtPrograms,
        { ...state.filters, score: "any" },
        app.studentStream,
        app.studentZScore,
        app.academicProfile,
        state.hideMismatch,
      ),
    [
      app.districtPrograms,
      state.filters,
      app.studentStream,
      app.studentZScore,
      app.academicProfile,
      state.hideMismatch,
    ],
  );
  const results =
    score === "any"
      ? base
      : base.filter(
          (p) => historicalComparison(p, app.studentZScore) === score,
        );
  const pages = Math.max(1, Math.ceil(results.length / 12)),
    page = Math.min(state.page, pages);
  const clear = () =>
    navigate({
      ...state,
      filters: { ...DEFAULT_FILTERS },
      hideMismatch: false,
      page: 1,
    });
  const copyLink = async () => {
    const params = writeFinderQuery(
      {
        ...state,
        view: "results",
        filters: { ...state.filters, score: "any" },
        hideMismatch: false,
      },
      app.cutoffYear,
      app.district.district_id,
      app.studentStream,
    );
    const url = new URL(`/courses?${params}`, location.origin).href;
    try {
      await navigator.clipboard.writeText(url);
      setShare(
        "Link copied. Your Z-score and academic details are not included.",
      );
    } catch {
      setShare(url + " — Your Z-score and academic details are not included.");
    }
  };
  const tabs = [
    ["any", "All programmes"],
    ["at_or_above", "At or above historical cutoff"],
    ["below", "Below historical cutoff"],
    ["unavailable", "Cutoff unavailable"],
  ] as const;
  return (
    <div className="reference-screen ugc-discovery" lang="en">
      <div className="reference-container">
        {app.lang !== "EN" && (
          <p className="language-note">{portalCopy(app.lang).english}</p>
        )}
        <nav className="reference-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span>/</span>
          <a href="/courses">UGC pathway</a>
          {state.view === "results" && (
            <>
              <span>/</span>
              <span>Results</span>
            </>
          )}
        </nav>
        {state.view === "profile" ? (
          <>
            <header className="reference-banner ugc-banner">
              <div>
                <h1 id="finder-heading" tabIndex={-1}>
                  Explore your university opportunities
                </h1>
                <p>
                  Discover UGC programmes and compare your results with
                  published historical admission cutoffs.
                </p>
                <p className="reference-warning">
                  <InfoIcon size={18} aria-hidden="true" />
                  Historical cutoffs are a reference and do not guarantee
                  admission.
                </p>
              </div>
              <figure>
                <img
                  src="/images/colombo-college-house.jpg"
                  alt="College House at the University of Colombo"
                  width="300"
                  height="180"
                />
                <figcaption>
                  University of Colombo ·{" "}
                  <a href="https://commons.wikimedia.org/wiki/File:UoC_College_House.jpg">
                    Cossde
                  </a>{" "}
                  ·{" "}
                  <a href="https://creativecommons.org/licenses/by-sa/3.0/">
                    CC BY-SA 3.0
                  </a>{" "}
                  · cropped
                </figcaption>
              </figure>
            </header>
            <form className="reference-profile-panel" onSubmit={submit}>
              <div className="profile-form-main">
                <h2>
                  <GraduationCapIcon size={25} aria-hidden="true" />
                  A/L profile & Z-score explorer
                </h2>
                <div className="profile-field-grid">
                  <label className="field">
                    Historical cutoff edition
                    <select
                      aria-label="Historical cutoff edition"
                      value={draft.year}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          year: e.target.value as CutoffYear,
                        }))
                      }
                    >
                      <option value="2025/2026">
                        2025/2026 · latest loaded
                      </option>
                      <option value="2024/2025">
                        2024/2025 · previous edition
                      </option>
                    </select>
                  </label>
                  <label className="field">
                    A/L stream
                    <select
                      aria-label="A/L stream"
                      value={draft.stream}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, stream: e.target.value }))
                      }
                    >
                      <option value="ALL">All streams / not selected</option>
                      {STREAMS.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    Admission district
                    <select
                      aria-label="Admission district"
                      value={draft.district}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          district: Number(e.target.value),
                        }))
                      }
                    >
                      {SRI_LANKA_DISTRICTS.map((d) => (
                        <option key={d.district_id} value={d.district_id}>
                          {d.district_name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    Your Z-score (optional)
                    <input
                      type="number"
                      step="any"
                      value={draft.z}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, z: e.target.value }))
                      }
                      placeholder="Your official published score"
                    />
                  </label>
                  <p className="profile-field-note">
                    Browse without a score. Your stream selects the correct
                    cutoff category where applicable; it does not automatically
                    exclude other programmes.
                  </p>
                  <button
                    className="button primary profile-explore"
                    type="submit"
                  >
                    Explore programmes
                    <CaretRightIcon size={18} />
                  </button>
                </div>
                <p className="small muted">
                  Use the admission district determined by UGC rules. Z-scores
                  are not calculated from grades here.
                </p>
              </div>
              <aside className="profile-explanation">
                <h3>What you can explore</h3>
                <ul>
                  {[
                    "UGC programme options",
                    "Historical district cutoffs",
                    "Programme entry requirements",
                    "Universities and course details",
                  ].map((t) => (
                    <li key={t}>
                      <CheckIcon size={16} aria-hidden="true" />
                      {t}
                    </li>
                  ))}
                </ul>
                <p>
                  Missing academic details remain unknown, so further checks may
                  be needed.
                </p>
              </aside>
              <details className="profile-academic" id="academic-requirements">
                <summary>Check academic requirements</summary>
                <p className="small muted">
                  Optional. A high Z-score does not replace required subjects,
                  grades, aptitude tests or general admission conditions. These
                  details stay on this device.
                </p>
                <h3>A/L subjects & grades</h3>
                <div className="academic-subject-grid">
                  {draft.academic.subjects.map((s, i) => (
                    <div className="subject-row" key={i}>
                      <label className="field">
                        Subject {i + 1}
                        <select
                          aria-label={`Subject ${i + 1}`}
                          value={s.subject}
                          onChange={(e) =>
                            updateSubject(i, "subject", e.target.value)
                          }
                        >
                          <option value="">Not entered</option>
                          {SUBJECTS.map((n) => (
                            <option key={n}>{n}</option>
                          ))}
                        </select>
                      </label>
                      <label className="field">
                        Grade {i + 1}
                        <select
                          aria-label={`Grade ${i + 1}`}
                          value={s.grade}
                          onChange={(e) =>
                            updateSubject(i, "grade", e.target.value as ALGrade)
                          }
                        >
                          <option value="">Not entered</option>
                          {["A", "B", "C", "S", "F"].map((g) => (
                            <option key={g}>{g}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="academic-ol-grid">
                  <label className="field">
                    Common General Paper mark
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={draft.academic.commonGeneralScore ?? ""}
                      onChange={(e) =>
                        setAcademic((p) => ({
                          ...p,
                          commonGeneralScore:
                            e.target.value === ""
                              ? null
                              : Number(e.target.value),
                        }))
                      }
                    />
                  </label>
                  {(
                    [
                      "english",
                      "mathematics",
                      "science",
                      "sinhala",
                      "tamil",
                    ] as (keyof StudentOlGrades)[]
                  ).map((key) => (
                    <label className="field" key={key}>
                      O/L {key}
                      <select
                        value={draft.academic.ol[key] || "NONE"}
                        onChange={(e) =>
                          setAcademic((p) => ({
                            ...p,
                            ol: { ...p.ol, [key]: e.target.value as OlGrade },
                          }))
                        }
                      >
                        <option value="NONE">Not entered</option>
                        {["A", "B", "C", "S", "W"].map((g) => (
                          <option key={g}>{g}</option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
                <button
                  className="text-link"
                  type="button"
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      academic: emptyAcademicProfile(),
                      z: "",
                    }))
                  }
                >
                  Clear my academic details
                </button>
              </details>
            </form>
            <div className="reference-shortcuts">
              <a href="/courses?view=results">
                <ChartBarIcon size={25} />
                <div>
                  <h2>Historical Z-score cutoffs</h2>
                  <p>Browse published cutoffs by course and district.</p>
                </div>
                <CaretRightIcon size={18} />
              </a>
              <a href="/guides/understanding-z-scores">
                <BookOpenTextIcon size={25} />
                <div>
                  <h2>UGC admissions guide</h2>
                  <p>Understand selection, cutoffs and preferences.</p>
                </div>
                <CaretRightIcon size={18} />
              </a>
              <a
                href="#academic-requirements"
                onClick={() => {
                  const el = document.getElementById(
                    "academic-requirements",
                  ) as HTMLDetailsElement;
                  el.open = true;
                  requestAnimationFrame(() =>
                    el.querySelector<HTMLElement>("summary")?.focus(),
                  );
                }}
              >
                <StackIcon size={25} />
                <div>
                  <h2>Course eligibility</h2>
                  <p>Add grades to check academic requirements.</p>
                </div>
                <CaretRightIcon size={18} />
              </a>
            </div>
            <AdmissionGuidance />
          </>
        ) : (
          <>
            <header className="reference-results-head">
              <div>
                <h1 id="finder-heading" tabIndex={-1}>
                  Your university opportunities
                </h1>
                <p className="profile-summary">
                  <span>
                    A/L stream:{" "}
                    <strong>
                      {app.studentStream === "ALL"
                        ? "Not selected"
                        : app.studentStream}
                    </strong>
                  </span>
                  <span>
                    District: <strong>{app.district.district_name}</strong>
                  </span>
                  <span>
                    Z-score:{" "}
                    <strong>
                      {app.studentZScore === null
                        ? "Not entered"
                        : app.studentZScore.toFixed(4)}
                    </strong>
                  </span>
                  <span>
                    Historical edition: <strong>{app.cutoffYear}</strong>
                  </span>
                </p>
              </div>
              <div className="reference-heading-actions">
                <button className="button secondary" onClick={edit}>
                  <PencilSimpleIcon size={16} />
                  Edit search
                </button>
                <button className="button secondary" onClick={copyLink}>
                  <ShareNetworkIcon size={16} />
                  Share results link
                </button>
              </div>
            </header>
            {share && (
              <p className="notice" role="status">
                {share}
              </p>
            )}
            <p className="reference-warning">
              <InfoIcon size={18} />
              Historical comparisons do not guarantee admission. Academic checks
              are separate.
            </p>
            <details className="reference-refinements">
              <summary>Refine results</summary>
              <div className="reference-filter-grid">
                <label className="field">
                  University / campus
                  <select
                    value={state.filters.institution}
                    onChange={(e) =>
                      updateFilters({ institution: e.target.value })
                    }
                  >
                    <option value="">All institutions</option>
                    {[
                      ...new Map(
                        app.districtPrograms.map((p) => [
                          p.institution_code,
                          p.institution_name,
                        ]),
                      ).entries(),
                    ]
                      .sort((a, b) => a[1].localeCompare(b[1]))
                      .map(([code, name]) => (
                        <option key={code} value={code}>
                          {name}
                        </option>
                      ))}
                  </select>
                </label>
                <label className="field">
                  Medium of instruction
                  <select
                    value={state.filters.medium}
                    onChange={(e) => updateFilters({ medium: e.target.value })}
                  >
                    <option value="">All published media</option>
                    <option value="E">English</option>
                    <option value="S">Sinhala</option>
                    <option value="T">Tamil</option>
                  </select>
                </label>
                <label className="field">
                  Stated duration
                  <select
                    value={state.filters.duration}
                    onChange={(e) =>
                      updateFilters({ duration: e.target.value })
                    }
                  >
                    <option value="any">All durations</option>
                    <option value="short">Up to 3 years</option>
                    <option value="four">4 years</option>
                    <option value="long">5 years or more</option>
                    <option value="unknown">Unclear / not stated</option>
                  </select>
                </label>
                <label className="field">
                  Aptitude / practical test
                  <select
                    value={state.filters.aptitude}
                    onChange={(e) =>
                      updateFilters({ aptitude: e.target.value })
                    }
                  >
                    <option value="any">Any test status</option>
                    <option value="required">Required by handbook</option>
                    <option value="not_stated">Not stated in handbook</option>
                  </select>
                </label>
                <label className="field">
                  Published cutoff availability
                  <select
                    value={state.filters.cutoff}
                    onChange={(e) => updateFilters({ cutoff: e.target.value })}
                  >
                    <option value="any">All statuses</option>
                    <option value="numeric">Numeric cutoff available</option>
                    <option value="nqc">NQC for this district</option>
                    <option value="category">
                      Stream category needs selection
                    </option>
                    <option value="missing">No published history</option>
                  </select>
                </label>
              </div>
              <div className="reference-filter-options">
                <label className="checkbox-field">
                  <input
                    type="checkbox"
                    disabled={app.studentStream === "ALL"}
                    checked={state.filters.restrictStream}
                    onChange={(e) =>
                      updateFilters({ restrictStream: e.target.checked })
                    }
                  />
                  Only this handbook stream section and courses across streams
                </label>
                <label className="checkbox-field">
                  <input
                    type="checkbox"
                    checked={state.hideMismatch}
                    onChange={(e) =>
                      navigate({
                        ...state,
                        hideMismatch: e.target.checked,
                        page: 1,
                      })
                    }
                  />
                  Hide confirmed academic mismatches
                </label>
                <button className="text-link" onClick={clear}>
                  Clear filters
                </button>
              </div>
              <p className="small muted">
                “Not stated” is not confirmation that no test is required.
                Incomplete academic checks remain visible.
              </p>
            </details>
            <div className="reference-results-tools">
              <form
                className="directory-search"
                onSubmit={(e) => {
                  e.preventDefault();
                  updateFilters({
                    query: String(new FormData(e.currentTarget).get("q") || ""),
                  });
                }}
              >
                <label className="sr-only" htmlFor="ugc-query">
                  Search UGC programmes
                </label>
                <input
                  id="ugc-query"
                  type="search"
                  name="q"
                  key={state.filters.query}
                  defaultValue={state.filters.query}
                  placeholder="Find a programme or university"
                />
                <button className="button primary">Search</button>
              </form>
              <label className="field">
                Sort results
                <select
                  value={state.filters.sort}
                  onChange={(e) => updateFilters({ sort: e.target.value })}
                >
                  <option value="name">Course name · A to Z</option>
                  <option value="cutoff_up">Cutoff · low to high</option>
                  <option value="cutoff_down">Cutoff · high to low</option>
                  <option value="duration">Stated duration · shortest</option>
                  <option value="intake">Proposed intake · largest</option>
                </select>
              </label>
            </div>
            <div
              className="cutoff-status-filters"
              role="group"
              aria-label="Historical cutoff comparison"
            >
              {tabs.map(([value, label]) => (
                <button
                  key={value}
                  aria-pressed={score === value}
                  disabled={
                    app.studentZScore === null &&
                    (value === "at_or_above" || value === "below")
                  }
                  onClick={() => updateFilters({ score: value })}
                >
                  {label}{" "}
                  <span>
                    (
                    {value === "any"
                      ? base.length
                      : base.filter(
                          (p) =>
                            historicalComparison(p, app.studentZScore) ===
                            value,
                        ).length}
                    )
                  </span>
                </button>
              ))}
            </div>
            <p className="small muted" role="status">
              {results.length} programme offerings ·{" "}
              {app.district.district_name}
              {app.studentZScore === null
                ? " · Enter a Z-score using Edit search to enable numeric comparisons."
                : ""}
            </p>
            <section
              className="opportunity-list"
              aria-label="UGC programme results"
            >
              {results.length ? (
                results
                  .slice((page - 1) * 12, page * 12)
                  .map((p) => (
                    <UgcOpportunityRow key={p.uni_code} program={p} />
                  ))
              ) : (
                <div className="empty-state">
                  <h2>No programmes match these filters</h2>
                  <p>
                    Try fewer filters. Unknown academic cases are not treated as
                    eligible.
                  </p>
                  <button className="button primary" onClick={clear}>
                    Clear filters
                  </button>
                </div>
              )}
            </section>
            <nav className="pagination" aria-label="Results pages">
              <button
                className="button secondary"
                disabled={page === 1}
                onClick={() => navigate({ ...state, page: page - 1 })}
              >
                Previous
              </button>
              <span>
                Page {page} of {pages}
              </span>
              <button
                className="button secondary"
                disabled={page === pages}
                onClick={() => {
                  navigate({ ...state, page: page + 1 });
                  window.scrollTo({ top: 0 });
                }}
              >
                Next
              </button>
            </nav>
            <AdmissionGuidance />
          </>
        )}
      </div>
    </div>
  );
}
