import React, { useEffect, useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { usePortal } from "../context/PortalContext";
import { readLocation } from "../lib/routes";
import {
  discoveryProgrammes,
  discoveryInstitutions,
  filterDiscovery,
  readExplore,
  EMPTY_EXPLORE,
  SUBJECTS,
  GUIDES,
  type ExploreFilters,
} from "../lib/portal";
import {
  ProgrammeCard,
  ProgrammeActions,
  InstitutionMark,
  Search,
  BookOpen,
} from "./PortalPrimitives";
import { DegreeRoiCalculator } from "./DegreeRoiCalculator";
import { ProgrammeDirectoryRow } from "./ProgrammeDirectoryRow";
import { ImportedProgrammeDetail } from "./ImportedProgrammeDetail";
import { InstitutionProfile } from "./InstitutionProfile";
import { GuideArt } from "./GuideArt";
import {
  activeExploreFilters,
  applyExplorePatch,
} from "../lib/exploreControls";
import {
  scopeFromQuery,
  scopePath,
  scopeLabel,
  scopedProgrammes,
  type DiscoveryScope,
} from "../lib/discoveryRoutes";

export function DiscoveryRouteLinks({
  scope,
  institutions = false,
}: {
  scope: DiscoveryScope;
  institutions?: boolean;
}) {
  return (
    <nav
      className="route-switch"
      aria-label={
        institutions
          ? "Institution admission routes"
          : "Programme admission routes"
      }
    >
      {(["ugc", "catalogue"] as const).map((route) => (
        <a
          key={route}
          href={
            institutions ? `/institutions?route=${route}` : scopePath(route)
          }
          aria-current={scope === route ? "page" : undefined}
        >
          {scopeLabel(route)}
        </a>
      ))}
    </nav>
  );
}

function useDiscovery() {
  const app = useApp();
  return useMemo(
    () => discoveryProgrammes(app.districtPrograms),
    [app.districtPrograms],
  );
}
function useFilters(defaultRoute: DiscoveryScope) {
  const read = () =>
    readExplore(
      new URLSearchParams(
        typeof window === "undefined" ? "" : window.location.search,
      ),
    );
  const [filters, setFilters] = useState<ExploreFilters>(() => ({
    ...read(),
    route: defaultRoute,
  }));
  useEffect(() => {
    const sync = () =>
      setFilters({
        ...read(),
        route: defaultRoute,
      });
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [defaultRoute]);
  const update = (patch: Partial<ExploreFilters>) => {
    const { filters: next, query } = applyExplorePatch(
      new URLSearchParams(window.location.search),
      patch,
      defaultRoute,
    );
    setFilters(next);
    window.history.pushState(
      null,
      "",
      `${window.location.pathname}${query ? "?" + query : ""}`,
    );
  };
  return [filters, update] as const;
}
export function PortalExplore({
  defaultRoute = "ugc",
}: {
  defaultRoute?: DiscoveryScope;
}) {
  const [filtersOpen, setFiltersOpen] = useState(
    () => typeof window === "undefined" || window.innerWidth > 600,
  );
  const all = useDiscovery(),
    rows = scopedProgrammes(all, defaultRoute),
    institutions = discoveryInstitutions(rows),
    [filters, update] = useFilters(defaultRoute),
    results = filterDiscovery(rows, filters),
    pages = Math.max(1, Math.ceil(results.length / 12)),
    page = Math.min(pages, Math.floor(filters.page));
  return (
    <div
      className={`portal-container portal-directory${defaultRoute === "catalogue" ? " reference-screen catalogue-reference" : " reference-screen ugc-browse-reference"}`}
    >
      {defaultRoute === "catalogue" && (
        <nav className="reference-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span>/</span>
          <span>Private & other programmes</span>
        </nav>
      )}
      <div className="portal-page-heading">
        <h1>{scopeLabel(defaultRoute)}</h1>
        <p>
          {defaultRoute === "ugc"
            ? "Browse degrees offered through central UGC admissions. Use the advanced finder for district cutoffs and academic checks."
            : "Compare reported fees, entry requirements and study routes, then contact institutions directly."}
        </p>
      </div>
      {defaultRoute === "catalogue" ? (
        <nav
          className="catalogue-discovery-tabs"
          aria-label="Explore other study options"
        >
          <a href="/pathways" aria-current="page">
            Find a programme
          </a>
          <a href="/institutions?route=catalogue">Find an institution</a>
        </nav>
      ) : (
        <DiscoveryRouteLinks scope={defaultRoute} />
      )}
      {defaultRoute === "ugc" && (
        <a className="finder-callout" href="/courses">
          <strong>Already have your A/L results?</strong>
          <span>
            Open the advanced UGC finder for Z scores, district cutoffs and
            eligibility checks.
          </span>
        </a>
      )}
      <form
        className="directory-search"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          update({ q: String(data.get("q") || "") });
        }}
      >
        <Search size={22} aria-hidden="true" />
        <label className="sr-only" htmlFor="explore-query">
          Search programmes
        </label>
        <input
          id="explore-query"
          name="q"
          type="search"
          key={filters.q}
          defaultValue={filters.q}
          placeholder="Search a programme, institution or subject"
        />
        <button className="button primary">Search</button>
      </form>
      {activeExploreFilters(filters, institutions).length > 0 && (
        <div className="active-filters" aria-label="Active programme filters">
          <span>Filtered by</span>
          {activeExploreFilters(filters, institutions).map(({ key, label }) => (
            <button
              className="filter-chip"
              key={key}
              aria-label={`Remove filter: ${label}`}
              onClick={() => {
                update({ [key]: "" });
                requestAnimationFrame(() =>
                  document.getElementById("explore-query")?.focus(),
                );
              }}
            >
              {label}
              <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      )}
      <div className="explore-layout">
        <aside className="explore-filters">
          <details
            open={filtersOpen}
            onToggle={(e) => setFiltersOpen(e.currentTarget.open)}
          >
            <summary>Filter programmes</summary>
            <div className="filter-stack">
              <label className="field">
                Qualification
                <select
                  aria-label="Qualification"
                  value={filters.level}
                  onChange={(e) => update({ level: e.target.value })}
                >
                  <option value="">All qualifications</option>
                  {["Degree", "Diploma", "Foundation"].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                Subject
                <select
                  aria-label="Subject"
                  value={filters.subject}
                  onChange={(e) => update({ subject: e.target.value })}
                >
                  <option value="">All subjects</option>
                  {SUBJECTS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                Institution
                <select
                  aria-label="Institution"
                  value={filters.institution}
                  onChange={(e) => update({ institution: e.target.value })}
                >
                  <option value="">All institutions</option>
                  {institutions.map((i) => (
                    <option key={i.href} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Stated duration
                <select
                  aria-label="Stated duration"
                  value={filters.duration}
                  onChange={(e) => update({ duration: e.target.value })}
                >
                  <option value="">Any duration</option>
                  <option value="short">Up to 3 years</option>
                  <option value="four">4 years</option>
                  <option value="long">More than 4 years</option>
                  <option value="unknown">Unknown or variable</option>
                </select>
              </label>
              <label className="field">
                Fee information
                <select
                  aria-label="Fee information"
                  value={filters.fees}
                  onChange={(e) => update({ fees: e.target.value })}
                >
                  <option value="">Any availability</option>
                  <option value="reported">Fee figure reported</option>
                  <option value="unknown">Ask institution</option>
                </select>
              </label>
              <button
                className="text-link"
                onClick={() =>
                  update({ ...EMPTY_EXPLORE, route: defaultRoute })
                }
              >
                Clear filters
              </button>
              <a
                className="filter-help"
                href={
                  defaultRoute === "ugc"
                    ? "/courses"
                    : "/guides/planning-study-costs"
                }
              >
                {defaultRoute === "ugc"
                  ? "Check academic requirements and district cutoffs."
                  : "Understand tuition, registration and living costs."}
              </a>
            </div>
          </details>
        </aside>
        <section aria-label="Programme results">
          <div className="results-toolbar">
            <p role="status">
              <strong>{results.length}</strong>{" "}
              {results.length === 1 ? "programme" : "programmes"} found
            </p>
            <span>Programme name, A to Z</span>
          </div>
          {results.length ? (
            <>
              <div className="explore-results">
                {results
                  .slice((page - 1) * 12, page * 12)
                  .map((p) =>
                    defaultRoute === "catalogue" ? (
                      <ProgrammeDirectoryRow programme={p} key={p.key} />
                    ) : (
                      <ProgrammeCard programme={p} key={p.key} />
                    ),
                  )}
              </div>
              <nav className="pagination" aria-label="Programme pages">
                <button
                  className="button secondary"
                  disabled={page === 1}
                  onClick={() => update({ page: page - 1 })}
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
                    update({ page: page + 1 });
                    window.scrollTo({ top: 0 });
                  }}
                >
                  Next
                </button>
              </nav>
            </>
          ) : (
            <div className="empty-state">
              <h2>No matching programmes yet</h2>
              <p>Try fewer filters or another search term.</p>
              <button
                className="button secondary"
                onClick={() =>
                  update({ ...EMPTY_EXPLORE, route: defaultRoute })
                }
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
export function PortalPathways() {
  return (
    <>
      <PortalExplore defaultRoute="catalogue" />
      <section id="study-budget" className="portal-container portal-section">
        <DegreeRoiCalculator />
        <div className="resource-list">
          <a href="https://studentloans.mohe.gov.lk/loan_web/">
            Official student loan information
          </a>
          <a href="https://www.sliate.ac.lk/">SLIATE programme information</a>
          <a href="https://ou.ac.lk/">Open University programme information</a>
        </div>
      </section>
    </>
  );
}

export function SavedCatalogue() {
  const portal = usePortal(),
    rows = useDiscovery().filter(
      (p) => p.ref.kind === "catalogue" && portal.saved.includes(p.ref.id),
    );
  return (
    <section className="portal-section">
      <div className="portal-section-head">
        <div>
          <h2>Saved other programmes</h2>
          <p>Your direct-entry degrees, diplomas and foundation options.</p>
        </div>
        <a href="/pathways">Find programmes</a>
      </div>
      {rows.length ? (
        <div className="portal-programme-grid">
          {rows.map((p) => (
            <ProgrammeCard key={p.key} programme={p} />
          ))}
        </div>
      ) : (
        <p className="empty-state">
          Save a programme while browsing and it will appear here.
        </p>
      )}
    </section>
  );
}

export function PortalPages() {
  const app = useApp(),
    rows = useDiscovery(),
    institutionScope = scopeFromQuery(
      new URLSearchParams(
        typeof window === "undefined" ? "" : window.location.search,
      ),
    ),
    institutions = discoveryInstitutions(rows),
    visibleInstitutions = institutions.filter(
      (i) => i.kind === institutionScope,
    ),
    location = readLocation(
      typeof window === "undefined"
        ? { pathname: "/", hash: "" }
        : window.location,
    ),
    [query, setQuery] = useState("");
  const p = rows.find(
      (p) => p.ref.kind === "catalogue" && p.ref.id === location.code,
    ),
    institution = institutions.find(
      (i) => i.kind === "catalogue" && i.id === location.code,
    ),
    guide = GUIDES.find((g) => g.slug === location.code);
  useEffect(() => {
    const title =
      app.route === "programme"
        ? p?.title
        : app.route === "catalogue-institution"
          ? institution?.name
          : app.route === "guide"
            ? guide?.title
            : null;
    if (title) document.title = `${title} | UniPedia.lk`;
  }, [app.route, p?.title, institution?.name, guide?.title]);
  if (app.route === "explore")
    return <PortalExplore defaultRoute={institutionScope} />;
  if (app.route === "institutions")
    return (
      <div className="portal-container portal-directory premium-directory">
        <div className="portal-page-heading">
          <h1>
            {institutionScope === "ugc"
              ? "UGC universities & institutes"
              : "Private & other institutions"}
          </h1>
          <p>
            {institutionScope === "ugc"
              ? "Institutions participating in central UGC admissions."
              : "Institutions offering direct entry and other application routes. Inclusion does not establish recognition or ownership."}
          </p>
        </div>
        <DiscoveryRouteLinks scope={institutionScope} institutions />
        <label className="field institution-search">
          Search institutions
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              institutionScope === "ugc"
                ? "Try University of Moratuwa"
                : "Try SLIIT or NIBM"
            }
          />
        </label>
        <p className="directory-count" role="status">
          {
            visibleInstitutions.filter((i) =>
              i.name.toLowerCase().includes(query.toLowerCase()),
            ).length
          }{" "}
          institutions
        </p>
        <div className="portal-institution-grid directory-institutions">
          {visibleInstitutions
            .filter((i) => i.name.toLowerCase().includes(query.toLowerCase()))
            .map((i) => (
              <a className="portal-institution" key={i.href} href={i.href}>
                <InstitutionMark name={i.name} />
                <div>
                  <h2>{i.name}</h2>
                  <p>{i.count} programme listings</p>
                  <small>
                    {i.kind === "ugc"
                      ? "UGC admission"
                      : "Direct entry & other routes"}
                  </small>
                </div>
              </a>
            ))}
        </div>
      </div>
    );
  if (app.route === "catalogue-institution" && institution)
    return (
      <InstitutionProfile
        id={institution.id}
        name={institution.name}
        kind="catalogue"
        website={institution.website ? new URL(institution.website).origin : ""}
        location={institution.location}
        source="Supplied programme research. Dates, fees and verification caveats are available on each programme page. Inclusion does not establish ownership, recognition or accreditation."
        programmes={rows.filter(
          (p) =>
            p.ref.kind === "catalogue" && p.institutionId === institution.id,
        )}
      />
    );
  if (app.route === "programme" && p)
    return <ImportedProgrammeDetail programme={p} rows={rows} />;
  if (app.route === "guides")
    return (
      <div className="portal-container portal-directory premium-directory">
        <div className="portal-page-heading">
          <h1>Student guides</h1>
          <p>
            Simple guides to qualifications, admission routes and study costs.
          </p>
        </div>
        <div className="guide-directory">
          {GUIDES.map((g, index) => (
            <a href={`/guides/${g.slug}`} key={g.slug}>
              <GuideArt index={index} />
              <h2>{g.title}</h2>
              <p>{g.description}</p>
              <span>Read guide</span>
            </a>
          ))}
        </div>
      </div>
    );
  if (app.route === "guide" && guide)
    return (
      <article className="premium-page guide-page premium-guide-detail">
        <a className="breadcrumb" href="/guides">
          Student guides
        </a>
        <h1>{guide.title}</h1>
        <p className="lead">{guide.description}</p>
        {guide.sections.map(([heading, body]) => (
          <section key={heading}>
            <h2>{heading}</h2>
            <p>{body}</p>
          </section>
        ))}
        <p className="small muted">
          Further reading:{" "}
          <a href={guide.source} target="_blank" rel="noreferrer">
            {guide.sourceName}
          </a>
          . Programme-specific details and current official instructions take
          precedence.
        </p>
        <a className="button primary" href={guide.action}>
          {guide.actionLabel}
        </a>
      </article>
    );
  return (
    <div className="portal-container empty-state">
      <h1>We could not find that page</h1>
      <p>
        The link may be incomplete or the programme may no longer be listed.
      </p>
      <a className="button primary" href="/explore">
        Explore programmes
      </a>
    </div>
  );
}
