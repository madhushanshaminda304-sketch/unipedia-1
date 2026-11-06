import React, { useState, useEffect } from "react";
import {
  ListIcon as Menu,
  MagnifyingGlassIcon as Search,
  BookmarkSimpleIcon as Bookmark,
  ArrowsLeftRightIcon as GitCompareArrows,
  GraduationCapIcon,
} from "@phosphor-icons/react";
import { type DiscoveryScope } from "../lib/discoveryRoutes";
import { portalCopy } from "../lib/portalCopy";
import { useApp } from "../context/AppContext";
import { usePortal } from "../context/PortalContext";
import { PortalSearch } from "./PortalPrimitives";
import { Modal } from "./Modal";
export function PortalHeader() {
  const app = useApp(),
    c = portalCopy(app.lang),
    portal = usePortal(),
    [menu, setMenu] = useState(false),
    [search, setSearch] = useState(false),
    [searchScope, setSearchScope] = useState<DiscoveryScope>(
      typeof location !== "undefined" &&
        (location.pathname === "/pathways" ||
          location.pathname.startsWith("/programmes"))
        ? "catalogue"
        : "ugc",
    );
  useEffect(() => {
    const other =
      app.route === "private-unis" ||
      app.route === "programme" ||
      app.route === "catalogue-institution" ||
      new URLSearchParams(location.search).get("route") === "catalogue";
    setSearchScope(other ? "catalogue" : "ugc");
  }, [app.route]);
  const links = [
    ["/", c.home],
    ["/courses", app.lang === "EN" ? "UGC finder" : c.ugc],
    ["/pathways", app.lang === "EN" ? "Other programmes" : c.otherDegrees],
    ["/institutions", c.institutions],
    ["/guides", c.guides],
    ["/tools", "Tools"],
  ];
  const saved = app.planEntries.length + portal.saved.length,
    compared = app.compareList.length + portal.compared.length;
  const referenceScreen = true;
  const link = (href: string, label: string) => (
    <a
      href={href}
      key={href}
      aria-current={
        typeof location !== "undefined" &&
        (location.pathname === href ||
          (href === "/courses" &&
            ["predictor", "explore", "course"].includes(app.route)) ||
          (href === "/institutions" &&
            ["institution", "catalogue-institution"].includes(app.route)) ||
          (href === "/pathways" && app.route === "programme"))
          ? "page"
          : undefined
      }
    >
      {label}
    </a>
  );
  return (
    <>
      <header
        className={`site-header portal-header${referenceScreen ? " reference-header" : ""}`}
      >
        <div className="header-inner">
          <a className="brand" href="/">
            {referenceScreen ? (
              <>
                <GraduationCapIcon
                  className="brand-cap"
                  size={46}
                  weight="fill"
                  aria-hidden="true"
                />
                <span className="brand-lockup">
                  <span>
                    UniPedia<small>.lk</small>
                  </span>
                  <span className="brand-tagline">
                    Sri Lanka’s study explorer
                  </span>
                </span>
              </>
            ) : (
              <>
                Uni<span>Pedia</span>
                <small>.lk</small>
              </>
            )}
          </a>
          <nav className="portal-main-nav" aria-label="Main navigation">
            {links.map(([href, label]) => link(href, label))}
          </nav>
          <div className="header-controls">
            <button
              className="icon-button"
              onClick={() => setSearch(true)}
              aria-label="Search programmes and institutions"
            >
              <Search size={20} />
            </button>
            <label className="sr-only" htmlFor="site-language">
              Language
            </label>
            <select
              id="site-language"
              value={app.lang}
              onChange={(e) =>
                app.setLang(e.target.value as "EN" | "SI" | "TA")
              }
            >
              <option value="EN">EN</option>
              <option value="SI">සිං</option>
              <option value="TA">தமிழ்</option>
            </select>
            <a
              className="header-saved"
              href="/shortlist"
              aria-label={`Saved programmes (${saved})`}
            >
              <Bookmark size={19} />
              <span>{saved}</span>
            </a>
            <a
              className="header-saved"
              href={
                searchScope === "catalogue"
                  ? "/compare?route=catalogue"
                  : "/compare"
              }
              aria-label={`Compare programmes (${compared})`}
            >
              <GitCompareArrows size={19} />
              <span>{compared}</span>
            </a>
            <button
              className="portal-menu-button icon-button"
              onClick={() => setMenu(true)}
              aria-label={c.menu}
              aria-haspopup="dialog"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>
      <Modal
        open={menu}
        onClose={() => setMenu(false)}
        title="Explore UniPedia"
      >
        <nav className="menu-links">
          {links.map(([href, label]) => link(href, label))}
          {link("/explore", "Browse UGC programmes")}
          {link("/shortlist", `${c.plan} (${saved})`)}
          {link("/compare", `${c.compare} (${compared})`)}
          {link("/interests", c.careers)}
          {link("/dates", c.dates)}
          {link("/about", c.about)}
          {link("/contact", "Feedback & corrections")}
          {link("/sitemap", "Sitemap")}
          {link("/privacy", c.privacy)}
          {link("/terms", c.terms)}
        </nav>
      </Modal>
      <Modal
        open={search}
        onClose={() => setSearch(false)}
        title="What would you like to study?"
        wide
      >
        <div
          className="route-switch"
          role="group"
          aria-label="Search admission route"
        >
          <button
            aria-pressed={searchScope === "ugc"}
            onClick={() => setSearchScope("ugc")}
          >
            {c.ugcDegrees}
          </button>
          <button
            aria-pressed={searchScope === "catalogue"}
            onClick={() => setSearchScope("catalogue")}
          >
            {c.otherDegrees}
          </button>
        </div>
        <PortalSearch key={searchScope} scope={searchScope} />
      </Modal>
      <nav className="mobile-nav portal-mobile-nav" aria-label="Study tools">
        <a href="/">
          <Search size={19} />
          {c.explore}
        </a>
        <a href="/shortlist">
          <Bookmark size={19} />
          {c.saved} ({saved})
        </a>
        <a
          href={
            searchScope === "catalogue"
              ? "/compare?route=catalogue"
              : "/compare"
          }
        >
          <GitCompareArrows size={19} />
          {c.compare} ({compared})
        </a>
      </nav>
    </>
  );
}
