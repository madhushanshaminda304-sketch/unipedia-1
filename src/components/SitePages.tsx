import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { DegreeRoiCalculator } from "./DegreeRoiCalculator";
import { SITE_SECTIONS, STUDY_TOOLS } from "../lib/siteNavigation";
import { discoveryProgrammes, discoveryInstitutions } from "../lib/portal";
import {
  CalculatorIcon,
  WalletIcon,
  BookmarkSimpleIcon,
  CalendarBlankIcon,
  CheckCircleIcon,
  ScalesIcon,
  CaretRightIcon,
  DownloadSimpleIcon,
  CopyIcon,
} from "@phosphor-icons/react";
export function SitePages() {
  const app = useApp(),
    [status, setStatus] = useState(""),
    [page, setPage] = useState(""),
    [message, setMessage] = useState("");
  const all = discoveryProgrammes(app.districtPrograms),
    institutions = discoveryInstitutions(all);
  const report = () =>
    `UniPedia feedback / correction\nPage: ${page || "Not supplied"}\nHandbook requirements edition: 2025/2026\nHistorical cutoff edition: ${app.cutoffYear}\n\nIssue and official source:\n${message || "Describe the issue, current value, correct value and supporting official URL."}\n\nDo not include personal examination details.\n`;
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([report()], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "unipedia-correction.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Report downloaded. No information was sent to a server.");
  };
  return (
    <div className="premium-page site-utility-page" lang="en">
      <nav className="reference-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span>/</span>
        <span>
          {app.route === "tools"
            ? "Student tools"
            : app.route === "budget"
              ? "Study budget"
              : app.route === "sitemap"
                ? "Sitemap"
                : "Feedback & corrections"}
        </span>
      </nav>
      {app.route === "tools" ? (
        <>
          <header className="premium-page-intro">
            <h1>Student tools</h1>
            <p>
              Useful tools to explore, plan and compare your next study step.
            </p>
          </header>
          <div className="premium-tools-grid">
            {STUDY_TOOLS.map((t, i) => {
              const Icon = [
                CalculatorIcon,
                WalletIcon,
                BookmarkSimpleIcon,
                CalendarBlankIcon,
                CheckCircleIcon,
                ScalesIcon,
              ][i];
              return (
                <a href={t.href} key={t.title}>
                  <span className="premium-tool-symbol">
                    <Icon size={30} weight="duotone" />
                  </span>
                  <h2>{t.title}</h2>
                  <p>{t.description}</p>
                  <span className="premium-tool-open">
                    Open tool
                    <CaretRightIcon size={16} />
                  </span>
                </a>
              );
            })}
          </div>
          <p className="premium-context-note">
            These are planning tools. They do not calculate an official Z-score,
            guarantee eligibility or submit applications.
          </p>
        </>
      ) : app.route === "budget" ? (
        <>
          <header className="premium-page-intro">
            <h1>Plan your study costs</h1>
            <p>
              Build a budget with the figures that apply to your programme and
              circumstances.
            </p>
          </header>
          <div className="premium-panel">
            <DegreeRoiCalculator />
          </div>
          <div className="premium-panel">
            <h2>Keep fee periods clear</h2>
            <p>
              Annual, semester and pathway-stage fees are different from
              whole-programme totals. Check registration fees, examinations and
              transfer costs with the institution before entering your total
              tuition estimate.
            </p>
            <a href="/guides/planning-study-costs">
              Read the study-budget guide
            </a>
          </div>
        </>
      ) : app.route === "contact" ? (
        <>
          <header className="premium-page-intro">
            <h1>Feedback & corrections</h1>
            <p>
              Help identify a programme detail, source reference or website
              behaviour that needs review.
            </p>
          </header>
          <div className="feedback-layout">
            <section className="premium-panel">
              <h2>Prepare a correction report</h2>
              <p className="small muted">
                This tool prepares a file or copies text on your device. A
                report submission service is not connected.
              </p>
              <label className="field">
                Page URL or programme code
                <input
                  value={page}
                  onChange={(e) => setPage(e.target.value)}
                  placeholder="For example, /courses/008G"
                />
              </label>
              <label className="field">
                Issue and supporting official source
                <textarea
                  rows={7}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe the current value, the correction and the official source URL."
                />
              </label>
              <div className="button-row">
                <button className="button primary" onClick={download}>
                  <DownloadSimpleIcon size={18} />
                  Download report
                </button>
                <button
                  className="button secondary"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(report());
                      setStatus("Report copied. No information was sent.");
                    } catch {
                      setStatus(
                        "Copy was unavailable. Use Download report instead.",
                      );
                    }
                  }}
                >
                  <CopyIcon size={18} />
                  Copy report
                </button>
              </div>
              {status && (
                <p className="notice" role="status">
                  {status}
                </p>
              )}
            </section>
            <aside className="premium-panel">
              <h2>What makes a useful report?</h2>
              <ul>
                <li>Programme name and Uni Code or research ID.</li>
                <li>
                  The admission edition and handbook page, where relevant.
                </li>
                <li>The displayed value and proposed correction.</li>
                <li>A link to the official supporting information.</li>
              </ul>
              <p>
                Keep personal grades, Z-scores and contact details out of the
                report.
              </p>
              <a href="/about">
                Read about our sources and verification limits
              </a>
            </aside>
          </div>
        </>
      ) : (
        <>
          <header className="premium-page-intro">
            <h1>Website sitemap</h1>
            <p>
              Find every study route, planning tool, guide and catalogue page in
              UniPedia.
            </p>
            <a className="button secondary" href="/sitemap.xml">
              View XML sitemap
            </a>
          </header>
          <div className="sitemap-section-grid">
            {SITE_SECTIONS.map((section) => (
              <section className="premium-panel" key={section.title}>
                <h2>{section.title}</h2>
                <ul>
                  {section.links.map(([href, label]) => (
                    <li key={href}>
                      <a href={href}>{label}</a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <section className="premium-panel">
            <h2>Institution profiles</h2>
            <div className="sitemap-institution-groups">
              {(["ugc", "catalogue"] as const).map((kind) => (
                <div key={kind}>
                  <h3>
                    {kind === "ugc"
                      ? "UGC institutions"
                      : "Private & other institutions"}
                  </h3>
                  <ul>
                    {institutions
                      .filter((i) => i.kind === kind)
                      .map((i) => (
                        <li key={i.href}>
                          <a href={i.href}>{i.name}</a>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
          {(["ugc", "catalogue"] as const).map((kind) => (
            <details className="premium-panel sitemap-programmes" key={kind}>
              <summary>
                {kind === "ugc"
                  ? "UGC programme pages"
                  : "Other programme pages"}{" "}
                ({all.filter((p) => p.ref.kind === kind).length})
              </summary>
              <ul>
                {all
                  .filter((p) => p.ref.kind === kind)
                  .map((p) => (
                    <li key={p.key}>
                      <a href={p.href}>
                        {p.title} — {p.institution}
                      </a>
                    </li>
                  ))}
              </ul>
            </details>
          ))}
          <p className="small muted">
            Personal saved-choice and comparison pages are available here for
            navigation and are excluded from the search-engine XML sitemap.
          </p>
        </>
      )}
    </div>
  );
}
