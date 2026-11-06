import React, { useId, useMemo, useState } from "react";
import { portalCopy } from "../lib/portalCopy";
import {
  MagnifyingGlassIcon as Search,
  BookmarkSimpleIcon as Bookmark,
  ArrowsLeftRightIcon as GitCompareArrows,
  GraduationCapIcon as GraduationCap,
  BuildingsIcon as Building2,
  BookOpenTextIcon as BookOpen,
  MapPinIcon as MapPin,
} from "@phosphor-icons/react";
import {
  scopePath,
  scopedProgrammes,
  type DiscoveryScope,
} from "../lib/discoveryRoutes";
import { cutoffLabel } from "../lib/discovery";
import { rememberUgcReturn } from "../lib/navigationMemory";
import { useApp } from "../context/AppContext";
import { usePortal } from "../context/PortalContext";
import {
  discoveryProgrammes,
  discoveryInstitutions,
  filterDiscovery,
  EMPTY_EXPLORE,
  type DiscoveryProgramme,
} from "../lib/portal";

export {
  Search,
  Bookmark,
  GitCompareArrows,
  GraduationCap,
  Building2,
  BookOpen,
  MapPin,
};
export function PortalSearch({
  compact = false,
  scope = "ugc",
}: {
  compact?: boolean;
  scope?: DiscoveryScope;
}) {
  const app = useApp(),
    c = portalCopy(app.lang),
    id = useId(),
    [query, setQuery] = useState(""),
    [open, setOpen] = useState(false);
  const rows = useMemo(
    () => scopedProgrammes(discoveryProgrammes(app.districtPrograms), scope),
    [app.districtPrograms, scope],
  );
  const suggestions =
    query.trim().length >= 2
      ? filterDiscovery(rows, { ...EMPTY_EXPLORE, q: query }).slice(0, 4)
      : [];
  const institutions =
    query.trim().length >= 2
      ? discoveryInstitutions(rows)
          .filter((i) =>
            i.name.toLowerCase().includes(query.toLowerCase().trim()),
          )
          .slice(0, 2)
      : [];
  return (
    <form
      className={`portal-search ${compact ? "compact-search" : ""}`}
      action={scopePath(scope)}
      role="search"
      lang={app.lang.toLowerCase()}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <label className="sr-only" htmlFor={id}>
        Search programmes and institutions
      </label>
      <Search aria-hidden="true" size={22} />
      <input
        id={id}
        name="q"
        type="search"
        placeholder={
          app.lang === "EN"
            ? scope === "ugc"
              ? "Search UGC degrees or universities"
              : "Search degrees, diplomas or institutions"
            : c.placeholder
        }
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            setOpen(false);
          }
          if (e.key === "ArrowDown") {
            e.preventDefault();
            document
              .getElementById(`${id}-suggestions`)
              ?.querySelector<HTMLAnchorElement>("a")
              ?.focus();
          }
        }}
        aria-expanded={open && suggestions.length + institutions.length > 0}
        aria-controls={`${id}-suggestions`}
        autoComplete="off"
      />
      <button className="button primary" type="submit">
        {compact ? <Search size={19} aria-label={c.search} /> : c.search}
      </button>
      {open && (suggestions.length > 0 || institutions.length > 0) && (
        <div className="search-suggestions" id={`${id}-suggestions`}>
          {suggestions.length > 0 && (
            <>
              <p>Programmes</p>
              {suggestions.map((p) => (
                <a key={p.key} href={p.href}>
                  {p.title}
                  <small>{p.institution}</small>
                </a>
              ))}
            </>
          )}
          {institutions.length > 0 && (
            <>
              <p>Institutions</p>
              {institutions.map((i) => (
                <a key={i.href} href={i.href}>
                  {i.name}
                </a>
              ))}
            </>
          )}
          <a
            className="suggestion-all"
            href={`${scopePath(scope)}?q=${encodeURIComponent(query)}`}
          >
            See all matching programmes
          </a>
        </div>
      )}
    </form>
  );
}
export function ProgrammeActions({
  programme: p,
}: {
  programme: DiscoveryProgramme;
}) {
  const app = useApp(),
    portal = usePortal(),
    ugc = p.ref.kind === "ugc";
  const saved = ugc
    ? app.planEntries.some((x) => x.uni_code === p.ref.id)
    : portal.saved.includes(p.ref.id);
  const compared = ugc
    ? app.compareList.includes(p.ref.id)
    : portal.compared.includes(p.ref.id);
  return (
    <div className="programme-actions">
      <button
        className="icon-action"
        aria-label={`${saved ? "Remove saved" : "Save"} ${p.title}`}
        aria-pressed={saved}
        onClick={() =>
          ugc
            ? saved
              ? app.removeFromPlan(p.ref.id)
              : app.addToPlan(p.ref.id)
            : portal.toggleSaved(p.ref.id)
        }
      >
        <Bookmark size={17} aria-hidden="true" />
        {saved ? "Saved" : "Save"}
      </button>
      <button
        className="icon-action"
        aria-label={`Compare ${p.title}`}
        aria-pressed={compared}
        onClick={() =>
          ugc ? app.toggleCompare(p.ref.id) : portal.toggleCompared(p.ref.id)
        }
      >
        <GitCompareArrows size={17} aria-hidden="true" />
        {compared ? "Comparing" : "Compare"}
      </button>
    </div>
  );
}
export function ProgrammeCard({
  programme: p,
}: {
  programme: DiscoveryProgramme;
}) {
  return (
    <article className="portal-programme">
      <div className="programme-labels">
        <span>{p.level}</span>
        <span>{p.ref.kind === "ugc" ? "UGC admission" : "Direct entry"}</span>
      </div>
      <h2>
        <a
          href={p.href}
          onClick={() => {
            if (
              p.ref.kind === "ugc" &&
              ["/courses", "/explore"].includes(location.pathname)
            )
              rememberUgcReturn(location.pathname + location.search);
          }}
        >
          {p.title}
        </a>
      </h2>
      <a className="programme-institution" href={p.institutionHref}>
        {p.institution}
      </a>
      <p className="programme-duration">Duration: {p.duration}</p>
      <p className="programme-fee">
        <small>
          {p.ugc
            ? `Historical cutoff · ${p.ugc.district_name} · ${p.ugc.cutoff_year}`
            : "Reported fee"}
        </small>
        {p.ugc ? cutoffLabel(p.ugc) : p.fee}
      </p>
      <div className="programme-card-bottom">
        <a
          className="text-link"
          href={p.href}
          onClick={() => {
            if (
              p.ref.kind === "ugc" &&
              ["/courses", "/explore"].includes(location.pathname)
            )
              rememberUgcReturn(location.pathname + location.search);
          }}
        >
          View programme
        </a>
        <ProgrammeActions programme={p} />
      </div>
    </article>
  );
}
export function InstitutionMark({ name }: { name: string }) {
  return (
    <span className="institution-name-mark" aria-hidden="true">
      {name
        .replace(/University of |Green University|Campus/g, "")
        .trim()
        .split(/\s+/)
        .map((s) => s[0])
        .slice(0, 3)
        .join("")
        .toUpperCase()}
    </span>
  );
}
