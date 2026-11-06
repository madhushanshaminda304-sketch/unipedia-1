import React, { useEffect, useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { SRI_LANKA_DISTRICTS } from "../data/sriLankaUgcSnapshot";
import type { ProgramCutoffViewRow } from "../data/ugc/types";
import {
  academicCheck,
  emptyAcademicProfile,
  STREAMS,
  SUBJECTS,
} from "../lib/discovery";
import type { ALGrade, OlGrade, StudentOlGrades } from "../lib/ugcLogic";
import { copy } from "../lib/ui";
import { ProgramChanceCard } from "./ProgramChanceCard";
import { ProgramDetailDrawer } from "./ProgramDetailDrawer";
import { CutoffEditionSelect } from "./CutoffEditionSelect";
import { AdmissionGuidance } from "./AdmissionGuidance";
import {
  DEFAULT_FILTERS,
  filterCourses,
  readCourseFilters,
  writeCourseFilters,
  type CourseFilters,
} from "../lib/courseFilters";

export { UgcFinder as PredictorView } from "./UgcFinder";
export function LegacyPredictorView() {
  const app = useApp(),
    c = copy(app.lang, app.cutoffYear);
  const [filters, setFilters] = useState(() =>
    readCourseFilters(new URLSearchParams(location.search)),
  );
  const { query, medium } = filters;
  const updateFilter = (key: keyof CourseFilters, value: string | boolean) =>
    setFilters((prev) => ({ ...prev, [key]: value }));
  const setQuery = (q: string) => updateFilter("query", q),
    setMedium = (m: string) => updateFilter("medium", m);
  const [hideMismatch, setHideMismatch] = useState(false),
    [page, setPage] = useState(1),
    [selected, setSelected] = useState<string | null>(null),
    [share, setShare] = useState(""),
    [filtersOpen, setFiltersOpen] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(location.search),
      id = Number(params.get("district"));
    if (params.has("district")) app.setDistrictId(id);
    const stream = params.get("stream");
    const year = params.get("year");
    if (year === "2025/2026" || year === "2024/2025") app.setCutoffYear(year);
    if (stream && (STREAMS.includes(stream) || stream === "ALL"))
      app.setStudentStream(stream);
  }, []);
  useEffect(
    () => setPage(1),
    [
      filters,
      hideMismatch,
      app.district.district_id,
      app.studentStream,
      app.academicProfile,
      app.studentZScore,
      app.cutoffYear,
    ],
  );
  const results = useMemo(
    () =>
      filterCourses(
        app.districtPrograms,
        filters,
        app.studentStream,
        app.studentZScore,
        app.academicProfile,
        hideMismatch,
      ),
    [
      app.districtPrograms,
      filters,
      hideMismatch,
      app.studentStream,
      app.academicProfile,
      app.studentZScore,
    ],
  );
  const pages = Math.max(1, Math.ceil(results.length / 12)),
    currentPage = Math.min(page, pages);
  const clear = () => {
    setFilters({ ...DEFAULT_FILTERS });
    setHideMismatch(false);
    app.setStudentStream("ALL");
    setShare("");
    history.replaceState(null, "", "/courses");
  };
  const copyLink = async () => {
    const url = new URL("/courses", location.origin);
    url.search = writeCourseFilters(
      filters,
      app.cutoffYear,
      app.district.district_id,
      app.studentStream,
    ).toString();
    try {
      await navigator.clipboard.writeText(url.href);
      setShare(c.copied);
    } catch {
      setShare(url.href);
    }
  };
  const updateSubject = (i: number, key: "subject" | "grade", value: string) =>
    app.setAcademicProfile((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s, index) =>
        index === i ? { ...s, [key]: value } : s,
      ),
    }));
  return (
    <div className="page finder-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">State university discovery</p>
          <h1>{c.find}</h1>
          <p className="muted">{c.historical}</p>
        </div>
        <div className="edition-actions">
          <CutoffEditionSelect />
          <button className="button secondary" onClick={copyLink}>
            {c.share}
          </button>
        </div>
      </div>
      <AdmissionGuidance />
      {share && (
        <p role="status" className="notice compact">
          {share}
          <small className="block">{c.shareNote}</small>
        </p>
      )}
      <div className="finder-layout">
        <aside className={`filter-panel ${filtersOpen ? "filters-open" : ""}`}>
          <button
            className="mobile-filter-toggle"
            aria-expanded={filtersOpen}
            aria-controls="course-filters"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            {c.filters} · {app.district.district_name}
            <span aria-hidden="true">{filtersOpen ? "−" : "+"}</span>
          </button>
          <div className="filter-body" id="course-filters">
            <h2>{c.filters}</h2>
            <label className="field">
              {c.district}
              <select
                value={app.district.district_id}
                onChange={(e) => app.setDistrictId(Number(e.target.value))}
              >
                {SRI_LANKA_DISTRICTS.map((d) => (
                  <option value={d.district_id} key={d.district_id}>
                    {d.district_name}
                  </option>
                ))}
              </select>
            </label>
            <p className="small muted">
              Use the admission district determined by UGC rules, which may
              differ from where you live.
            </p>
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
            <p className="small muted">
              Used to choose the correct cutoff category where a course has
              different stream cutoffs. It does not hide other programmes.
            </p>
            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={filters.restrictStream}
                disabled={app.studentStream === "ALL"}
                onChange={(e) =>
                  updateFilter("restrictStream", e.target.checked)
                }
              />
              Only this handbook stream section and courses across streams
            </label>
            <label className="field">
              University / campus
              <select
                value={filters.institution}
                onChange={(e) => updateFilter("institution", e.target.value)}
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
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
              >
                <option value="">All published media</option>
                <option value="E">English</option>
                <option value="S">Sinhala</option>
                <option value="T">Tamil</option>
              </select>
            </label>
            <label className="field">
              {c.z}
              <input
                type="number"
                step="0.0001"
                value={app.studentZScore ?? ""}
                onChange={(e) =>
                  app.setStudentZScore(
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
                placeholder="Enter your published score"
              />
            </label>
            <p className="small muted">
              Use your official result. This site does not calculate a Z score
              from grades.
            </p>
            <label className="field">
              Compare with my Z score
              <select
                disabled={app.studentZScore === null}
                value={app.studentZScore === null ? "any" : filters.score}
                onChange={(e) => updateFilter("score", e.target.value)}
              >
                <option value="any">Show all courses</option>
                <option value="at_or_above">
                  My score meets / exceeds the cutoff
                </option>
                <option value="below">My score is below the cutoff</option>
              </select>
            </label>
            <p className="small muted">
              This compares numbers only. Subject, O/L, aptitude and general
              admission requirements still apply. NQC and unknown categories
              cannot pass a numeric comparison.
            </p>
            <details className="advanced-filters">
              <summary>Advanced filters</summary>
              <label className="field">
                Stated course duration
                <select
                  value={filters.duration}
                  onChange={(e) => updateFilter("duration", e.target.value)}
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
                  value={filters.aptitude}
                  onChange={(e) => updateFilter("aptitude", e.target.value)}
                >
                  <option value="any">Any test status</option>
                  <option value="required">Required by the handbook</option>
                  <option value="not_stated">Not stated in the handbook</option>
                </select>
              </label>
              <label className="field">
                Published cutoff availability
                <select
                  value={filters.cutoff}
                  onChange={(e) => updateFilter("cutoff", e.target.value)}
                >
                  <option value="any">All statuses</option>
                  <option value="numeric">Numeric cutoff available</option>
                  <option value="nqc">NQC for this district</option>
                  <option value="category">
                    Stream category needs selection
                  </option>
                  <option value="missing">
                    No published history in this dataset
                  </option>
                </select>
              </label>
              <p className="small muted">
                Unknown values stay separate. “Not stated” does not mean no test
                is required.
              </p>
            </details>
            <details className="academic-inputs">
              <summary>{c.academic}</summary>
              <p className="small muted">
                Optional. Missing information stays unknown. These details stay
                on this device.
              </p>
              <h3>{c.grades}</h3>
              {app.academicProfile.subjects.map((s, i) => (
                <div className="subject-row" key={i}>
                  <label className="sr-only" htmlFor={`subject-${i}`}>
                    {c.subject} {i + 1}
                  </label>
                  <select
                    id={`subject-${i}`}
                    value={s.subject}
                    onChange={(e) =>
                      updateSubject(i, "subject", e.target.value)
                    }
                  >
                    <option value="">
                      {c.subject} {i + 1}
                    </option>
                    {SUBJECTS.map((name) => (
                      <option key={name}>{name}</option>
                    ))}
                  </select>
                  <label className="sr-only" htmlFor={`grade-${i}`}>
                    {c.grade} {i + 1}
                  </label>
                  <select
                    id={`grade-${i}`}
                    value={s.grade}
                    onChange={(e) =>
                      updateSubject(i, "grade", e.target.value as ALGrade)
                    }
                  >
                    <option value="">—</option>
                    {["A", "B", "C", "S", "F"].map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </div>
              ))}
              <label className="field">
                {c.cgp}
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={app.academicProfile.commonGeneralScore ?? ""}
                  onChange={(e) =>
                    app.setAcademicProfile((prev) => ({
                      ...prev,
                      commonGeneralScore:
                        e.target.value === "" ? null : Number(e.target.value),
                    }))
                  }
                />
              </label>
              <h3>{c.ol}</h3>
              {(
                [
                  "english",
                  "mathematics",
                  "science",
                  "sinhala",
                  "tamil",
                ] as (keyof StudentOlGrades)[]
              ).map((key) => (
                <label className="field ol-field" key={key}>
                  <span>{key}</span>
                  <select
                    value={app.academicProfile.ol[key] || "NONE"}
                    onChange={(e) =>
                      app.setAcademicProfile((prev) => ({
                        ...prev,
                        ol: { ...prev.ol, [key]: e.target.value as OlGrade },
                      }))
                    }
                  >
                    <option value="NONE">{c.notEntered}</option>
                    {["A", "B", "C", "S", "W"].map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </label>
              ))}
              <button
                className="text-link"
                onClick={() => {
                  app.setAcademicProfile(emptyAcademicProfile());
                  app.setStudentZScore(null);
                }}
              >
                Clear my academic details
              </button>
            </details>
            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={hideMismatch}
                onChange={(e) => setHideMismatch(e.target.checked)}
              />
              {c.hideMismatch}
            </label>
            <button className="text-link" onClick={clear}>
              {c.clear}
            </button>
          </div>
        </aside>
        <section className="results-panel" aria-label="Course results">
          <label className="search-field">
            <span className="sr-only">{c.search}</span>
            <input
              type="search"
              placeholder={c.search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span aria-hidden="true">⌕</span>
          </label>
          <div className="results-heading">
            <p role="status">
              <strong>{results.length}</strong> course offerings ·{" "}
              {app.district.district_name}
            </p>
            <label className="sort-control">
              Sort results
              <select
                value={filters.sort}
                onChange={(e) => updateFilter("sort", e.target.value)}
              >
                <option value="name">Course name · A to Z</option>
                <option value="cutoff_up">Cutoff · low to high</option>
                <option value="cutoff_down">Cutoff · high to low</option>
                <option value="duration">Stated duration · shortest</option>
                <option value="intake">Proposed intake · largest</option>
              </select>
            </label>
          </div>
          <p className="small muted results-note">
            {c.disclaimer} Academic checks and historical cutoffs are separate.
          </p>
          {results.length ? (
            <>
              <div className="course-grid">
                {results
                  .slice((currentPage - 1) * 12, currentPage * 12)
                  .map((p: ProgramCutoffViewRow) => (
                    <ProgramChanceCard
                      key={p.uni_code}
                      program={p}
                      studentZ={app.studentZScore}
                      onOpenDetail={(p) => setSelected(p.uni_code)}
                      academicEligibility={academicCheck(
                        p.course_code,
                        app.academicProfile,
                      )}
                    />
                  ))}
              </div>
              <nav className="pagination" aria-label="Results pages">
                <button
                  className="button secondary"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  {c.previous}
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
                  {c.next}
                </button>
              </nav>
            </>
          ) : (
            <div className="empty-state">
              <h2>{c.noResults}</h2>
              <p>{c.noResultsBody}</p>
              <button className="button primary" onClick={clear}>
                {c.clear}
              </button>
            </div>
          )}
        </section>
      </div>
      <ProgramDetailDrawer
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        program={app.districtPrograms.find((p) => p.uni_code === selected)}
      />
    </div>
  );
}
