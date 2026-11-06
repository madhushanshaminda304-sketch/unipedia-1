import React, { useState } from "react";
import {PortalHeader} from './PortalHeader';
export function GlobalHeader(){return <PortalHeader/>;}
import { useApp, type ActiveRoute } from "../context/AppContext";
import { routePath } from "../lib/routes";
import { copy } from "../lib/ui";
import { Modal } from "./Modal";

export function LegacyGlobalHeader() {
  const app = useApp(),
    c = copy(app.lang),
    [menu, setMenu] = useState(false);
  const link = (route: ActiveRoute, label: string) => (
    <a
      href={routePath(route)}
      aria-current={app.route === route ? "page" : undefined}
      onClick={(e) => {
        if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
          e.preventDefault();
          app.setRoute(route);
          setMenu(false);
        }
      }}
    >
      {label}
    </a>
  );
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a
            className="brand"
            href="/"
            onClick={(e) => {
              e.preventDefault();
              app.setRoute("home");
            }}
          >
            Uni<span>Pedia</span>
            <small>.lk</small>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {link("predictor", c.find)}
            {link("private-unis", c.pathways)}
            {link("my-plan", `${c.plan} (${app.planEntries.length})`)}
            {link("compare", `${c.compare} (${app.compareList.length})`)}
          </nav>
          <div className="header-controls">
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
            <button
              className="menu-button"
              aria-label={c.menu}
              onClick={() => setMenu(true)}
              aria-haspopup="dialog"
            >
              ☰ <span>{c.menu}</span>
            </button>
          </div>
        </div>
      </header>
      <Modal open={menu} onClose={() => setMenu(false)} title={c.menu}>
        <nav className="menu-links">
          {link("home", c.home)}
          {link("predictor", c.find)}
          {link("my-plan", `${c.plan} (${app.planEntries.length})`)}
          {link("compare", `${c.compare} (${app.compareList.length})`)}
          {link("careers", c.careers)}
          {link("calendar", c.dates)}
          {link("private-unis", c.pathways)}
          {link("about", c.about)}
          {link("privacy", c.privacy)}
        </nav>
      </Modal>
      <nav className="mobile-nav" aria-label="Study tools">
        {link("predictor", c.find)}
        {link("my-plan", `${c.plan} (${app.planEntries.length})`)}
        {link("compare", `${c.compare} (${app.compareList.length})`)}
      </nav>
    </>
  );
}
