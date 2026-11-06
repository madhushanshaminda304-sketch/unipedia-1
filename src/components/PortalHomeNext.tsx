import React, { useEffect, useMemo, useState } from "react";
import { readHomeScope } from "../lib/navigationMemory";
import { useApp } from "../context/AppContext";
import { portalCopy } from "../lib/portalCopy";
import {
  SUBJECTS,
  discoveryProgrammes,
  discoveryInstitutions,
  GUIDES,
} from "../lib/portal";
import {
  DISCOVERY_SCOPE_CHANGED,
  scopePath,
  scopeLabel,
  scopedProgrammes,
  type DiscoveryScope,
} from "../lib/discoveryRoutes";
import {
  PortalSearch,
  InstitutionMark,
  ProgrammeCard,
} from "./PortalPrimitives";
import {
  GraduationCapIcon,
  BuildingsIcon,
  CalculatorIcon,
  LaptopIcon,
  BriefcaseIcon,
  GearIcon,
  HeartbeatIcon,
  FlaskIcon,
  PaletteIcon,
  ChalkboardTeacherIcon,
  SquaresFourIcon,
  BookOpenTextIcon,
  CaretRightIcon,
  MagnifyingGlassIcon,
  ScalesIcon,
  BookmarkSimpleIcon,
  CalendarBlankIcon,
  ChartBarIcon,
  UsersThreeIcon,
  StackIcon,
  ArrowSquareOutIcon,
  PaperPlaneTiltIcon,
} from "@phosphor-icons/react";

const subjectIcons = [
  LaptopIcon,
  BriefcaseIcon,
  GearIcon,
  HeartbeatIcon,
  FlaskIcon,
  PaletteIcon,
  ChalkboardTeacherIcon,
  SquaresFourIcon,
];
export function PortalHome() {
  const app = useApp(),
    c = portalCopy(app.lang);
  const [scope, setScopeState] = useState<DiscoveryScope>(() =>
    readHomeScope(typeof location === "undefined" ? "" : location.search),
  );
  useEffect(() => {
    const sync = () => setScopeState(readHomeScope(location.search));
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  const setScope = (next: DiscoveryScope) => {
    setScopeState(next);
    const url = new URL(location.href);
    url.searchParams.set("route", next);
    history.replaceState(null, "", url.pathname + url.search);
    window.dispatchEvent(new Event(DISCOVERY_SCOPE_CHANGED));
  };
  const all = useMemo(
    () => discoveryProgrammes(app.districtPrograms),
    [app.districtPrograms],
  );
  const rows = scopedProgrammes(all, scope),
    institutions = discoveryInstitutions(rows);
  const featuredIds =
    scope === "ugc"
      ? ["008G", "006A", "001A"]
      : ["sliit-research-03", "cinec-research-02", "nsbm-research-08"];
  const featured = featuredIds
    .map((id) => rows.find((p) => p.ref.id === id))
    .filter((p): p is (typeof rows)[number] => !!p);
  for (const p of rows) {
    if (featured.length === 3) break;
    if (!featured.includes(p)) featured.push(p);
  }
  const names =
    scope === "ugc"
      ? ["MRT", "PDN", "CMB", "SJP"]
      : ["sliit", "cinec-campus", "nsbm-green-university", "nibm"];
  const selected = names
    .map((id) => institutions.find((i) => i.id === id))
    .filter((i): i is (typeof institutions)[number] => !!i);
  return (
    <div className="portal-home discovery-home reference-home" lang="en">
      <section className="landing-opening" aria-labelledby="landing-heading">
        <div className="landing-skyline" aria-hidden="true" />
        <div className="portal-container landing-opening-inner">
          <div className="landing-intro">
            <h1 id="landing-heading" lang={app.lang.toLowerCase()}>
              {app.lang === "EN" ? (
                <>
                  Find your <span>higher education path</span> in Sri Lanka
                </>
              ) : (
                c.title
              )}
            </h1>
            <p className="opening-description" lang={app.lang.toLowerCase()}>
              {app.lang === "EN"
                ? "Explore universities, degrees, admission requirements, historical Z-scores and fees. Choose the route that works for you."
                : c.subtitle}
            </p>
          </div>
          <div className="landing-search">
            <div
              className="landing-search-route"
              role="group"
              aria-label="Choose your admission route"
            >
              <button
                aria-pressed={scope === "ugc"}
                onClick={() => setScope("ugc")}
              >
                <GraduationCapIcon size={17} />
                {c.ugcDegrees}
              </button>
              <button
                aria-pressed={scope === "catalogue"}
                onClick={() => setScope("catalogue")}
              >
                <BuildingsIcon size={17} />
                {c.otherDegrees}
              </button>
            </div>
            <div className="landing-search-field" key={scope}>
              <PortalSearch scope={scope} />
              <div className="search-starters">
                <span>Explore:</span>
                {[
                  "Computing",
                  "Business",
                  "Engineering",
                  scope === "ugc" ? "Health" : "Arts & Design",
                ].map((s) => (
                  <a
                    key={s}
                    href={`${scopePath(scope)}?subject=${encodeURIComponent(s)}`}
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>
          {app.lang !== "EN" && <p className="language-note">{c.english}</p>}
        </div>
        <div className="portal-container landing-pathways">
          <article className="landing-pathway landing-pathway-ugc">
            <figure>
              <img
                src="/images/colombo-college-house.jpg"
                alt="College House at the University of Colombo"
                width="472"
                height="472"
              />
              <figcaption>University of Colombo</figcaption>
            </figure>
            <div className="landing-pathway-content">
              <span className="landing-route-label">
                Central UGC admissions
              </span>
              <h2>Government universities</h2>
              <p>
                Explore UGC entry based on your A/L results, district, course
                preferences and programme requirements.
              </p>
              <ul aria-label="UGC pathway tools">
                <li>
                  <ChartBarIcon size={21} />
                  Historical cutoffs
                </li>
                <li>
                  <UsersThreeIcon size={21} />
                  Eligibility checks
                </li>
                <li>
                  <BookOpenTextIcon size={21} />
                  UGC guide
                </li>
              </ul>
              <a className="landing-pathway-action" href="/courses">
                Explore the UGC pathway <CaretRightIcon size={18} />
              </a>
            </div>
          </article>
          <article className="landing-pathway landing-pathway-other">
            <figure>
              <img
                src="/images/nsbm-engineering.jpg"
                alt="Faculty of Engineering building at NSBM Green University"
                width="960"
                height="720"
              />
              <figcaption>NSBM Green University</figcaption>
            </figure>
            <div className="landing-pathway-content">
              <span className="landing-route-label">
                Direct institution applications
              </span>
              <h2>Private & other programmes</h2>
              <p>
                Find degrees, diplomas and foundation routes. Check reported
                fees and requirements before applying directly.
              </p>
              <ul aria-label="Other programme information">
                <li>
                  <GraduationCapIcon size={21} />
                  Degrees & fees
                </li>
                <li>
                  <StackIcon size={21} />
                  Entry requirements
                </li>
                <li>
                  <ArrowSquareOutIcon size={21} />
                  Direct entry
                </li>
              </ul>
              <a className="landing-pathway-action" href="/pathways">
                Explore other programmes <CaretRightIcon size={18} />
              </a>
            </div>
          </article>
        </div>
        <nav
          className="portal-container landing-tools"
          aria-label="Plan your studies"
        >
          {[
            {
              Icon: MagnifyingGlassIcon,
              title: "Browse programmes",
              text: "Find options in your chosen admission route",
              href: scopePath(scope),
            },
            {
              Icon: ScalesIcon,
              title: "Compare",
              text: "See programme facts side by side",
              href: scope === "ugc" ? "/compare" : "/compare?route=catalogue",
            },
            {
              Icon: CalculatorIcon,
              title: "Study budget",
              text: "Estimate the total cost of your studies",
              href: "/pathways#study-budget",
            },
            {
              Icon: BookmarkSimpleIcon,
              title: "Shortlist",
              text: "Keep your favourite study options together",
              href: "/shortlist",
            },
            {
              Icon: CalendarBlankIcon,
              title: "Admission dates",
              text: "Check dates and official notices",
              href: "/dates",
            },
            {
              Icon: BookOpenTextIcon,
              title: "Student guides",
              text: "Practical help for your next step",
              href: "/guides",
            },
          ].map(({ Icon, title, text, href }) => (
            <a href={href} key={title}>
              <Icon size={30} aria-hidden="true" />
              <h2>{title}</h2>
              <p>{text}</p>
            </a>
          ))}
        </nav>
      </section>
      <section
        className="portal-container landing-how"
        aria-labelledby="how-heading"
      >
        <div className="landing-how-intro">
          <h2 id="how-heading">How it works</h2>
          <p>
            Different admission routes.
            <br />
            One place to plan.
          </p>
        </div>
        <ol>
          {[
            {
              Icon: MagnifyingGlassIcon,
              title: "Explore",
              text: "Choose a route and discover programmes that interest you.",
            },
            {
              Icon: ChartBarIcon,
              title: "Check requirements",
              text: "Review entry criteria and historical cutoffs where relevant.",
            },
            {
              Icon: StackIcon,
              title: "Compare & decide",
              text: "Weigh up requirements, duration and reported fees.",
            },
            {
              Icon: PaperPlaneTiltIcon,
              title: "Take the next step",
              text: "Follow official UGC or institution application guidance.",
            },
          ].map(({ Icon, title, text }) => (
            <li key={title}>
              <h3>
                <span>
                  <Icon size={21} aria-hidden="true" />
                </span>
                {title}
              </h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>
      <section
        className="portal-container discovery-section"
        aria-labelledby="subject-heading"
      >
        <div className="portal-section-head">
          <div>
            <h2 id="subject-heading">Explore your interests</h2>
            <p>
              {scopeLabel(scope)} · {rows.length} programme listings
            </p>
          </div>
          <a className="section-link" href={scopePath(scope)}>
            View programmes <CaretRightIcon size={16} />
          </a>
        </div>
        <div className="discovery-subjects">
          {SUBJECTS.map((subject, index) => {
            const Icon = subjectIcons[index];
            const count = rows.filter((p) => p.subject === subject).length;
            const contents = (
              <>
                <span className="subject-symbol">
                  <Icon aria-hidden="true" size={24} weight="duotone" />
                </span>
                <h3>{subject}</h3>
                <p>{count ? `${count} programmes` : "No listings yet"}</p>
              </>
            );
            if (!count)
              return (
                <div className="subject-unavailable" key={subject}>
                  {contents}
                </div>
              );
            return (
              <a
                href={`${scopePath(scope)}?subject=${encodeURIComponent(subject)}`}
                key={subject}
              >
                {contents}
              </a>
            );
          })}
        </div>
      </section>
      <section className="catalogue-band">
        <div className="portal-container discovery-section">
          <div className="portal-section-head">
            <div>
              <h2>
                {scope === "ugc"
                  ? "Discover UGC degree options"
                  : "Explore private & other programmes"}
              </h2>
              <p>
                {scope === "ugc"
                  ? "Find a course, then check the requirements for your subjects and district."
                  : "Compare the reported costs and requirements before contacting an institution."}
              </p>
            </div>
            <a className="section-link" href={scopePath(scope)}>
              View all <CaretRightIcon size={16} />
            </a>
          </div>
          <div className="portal-programme-grid">
            {featured.map((p) => (
              <ProgrammeCard key={p.key} programme={p} />
            ))}
          </div>
          <p className="section-footnote">
            {scope === "ugc"
              ? "Cutoffs are historical references. A subject match does not establish academic eligibility."
              : "Fees retain their reported payment period. Confirm the current total with the institution."}
          </p>
        </div>
      </section>
      <section className="portal-container discovery-section">
        <div className="portal-section-head">
          <div>
            <h2>
              {scope === "ugc"
                ? "Meet the UGC universities"
                : "Find your institution"}
            </h2>
            <p>
              {scope === "ugc"
                ? "Explore the universities and institutes in central UGC admissions."
                : "Browse institutions offering direct application routes."}
            </p>
          </div>
          <a className="section-link" href={`/institutions?route=${scope}`}>
            All institutions <CaretRightIcon size={16} />
          </a>
        </div>
        <div className="discovery-institutions">
          {selected.map((i) => (
            <a href={i.href} key={i.href}>
              <InstitutionMark name={i.name} />
              <h3>{i.name}</h3>
              <p>{i.count} programmes</p>
              <span>
                View institution <CaretRightIcon size={15} />
              </span>
            </a>
          ))}
        </div>
      </section>
      <section className="student-guides-band">
        <div className="portal-container discovery-section">
          <div className="portal-section-head">
            <div>
              <h2>A clearer picture before you choose</h2>
              <p>Short reads for the questions that come next.</p>
            </div>
            <a className="section-link" href="/guides">
              All guides <CaretRightIcon size={16} />
            </a>
          </div>
          <div className="discovery-guides">
            {GUIDES.map((g, i) => (
              <a href={`/guides/${g.slug}`} key={g.slug}>
                <span className={`guide-art guide-art-${i}`}>
                  <BookOpenTextIcon size={40} weight="duotone" />
                </span>
                <div>
                  <h3>{g.title}</h3>
                  <p>{g.description}</p>
                  <span className="guide-read">
                    Read guide <CaretRightIcon size={15} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className="portal-container discovery-section route-next-step">
        <GraduationCapIcon size={36} weight="duotone" />
        <div>
          <h2>Different routes. A choice that works for you.</h2>
          <p>
            Keep your UGC preferences organised, and save other options in their
            own list.
          </p>
        </div>
        <a className="button primary" href="/shortlist">
          Open saved choices
        </a>
      </section>
      <details className="portal-container landing-photo-credits">
        <summary>Photography credits</summary>
        <p>
          Colombo skyline:{" "}
          <a href="https://commons.wikimedia.org/wiki/File:ColomboSkyline_-_November_2017_(1).jpg">
            Rehman Abubakr
          </a>{" "}
          ·{" "}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/">
            CC BY-SA 4.0
          </a>
          . College House, University of Colombo:{" "}
          <a href="https://commons.wikimedia.org/wiki/File:UoC_College_House.jpg">
            Cossde at English Wikipedia
          </a>{" "}
          ·{" "}
          <a href="https://creativecommons.org/licenses/by-sa/3.0/">
            CC BY-SA 3.0
          </a>
          . NSBM Faculty of Engineering:{" "}
          <a href="https://commons.wikimedia.org/wiki/File:NSBM_Green_University_-_FOE.jpg">
            Osanda97
          </a>{" "}
          ·{" "}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/">
            CC BY-SA 4.0
          </a>
          . Images resized by Wikimedia where available and cropped for display;
          the skyline has a colour overlay. Adapted photographs retain their
          respective licenses. These are examples of campus architecture and do
          not represent every institution in either pathway. Inclusion does not
          imply endorsement.
        </p>
      </details>
    </div>
  );
}
