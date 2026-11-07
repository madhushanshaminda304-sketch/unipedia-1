import React, { Suspense, lazy, useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { PortalProvider } from "./context/PortalContext";
import { portalCopy } from "./lib/portalCopy";
const Portal = lazy(() =>
  import("./components/PortalPages").then((m) => ({ default: m.PortalPages })),
);
import { GlobalHeader } from "./components/GlobalHeader";
import { PageSkeleton } from "./components/PageSkeleton";
import { Toaster } from "sonner";
import { copy } from "./lib/ui";
import { routePath, readLocation } from "./lib/routes";
import { NON_STATE_CATALOG } from "./lib/nonStateCatalog";
import { GUIDES, slugify } from "./lib/portal";
import type { ActiveRoute } from "./context/AppContext";
import { getInstitutionById } from "./services/ugcAdapter";
const Home = lazy(() =>
  import("./components/HomeDiscoveryView").then((m) => ({
    default: m.HomeDiscoveryView,
  })),
);
const Finder = lazy(() =>
  import("./components/PredictorView").then((m) => ({
    default: m.PredictorView,
  })),
);
const Plan = lazy(() =>
  import("./components/PreferenceSimulatorView").then((m) => ({
    default: m.PreferenceSimulatorView,
  })),
);
const Compare = lazy(() =>
  import("./components/CompareEngineView").then((m) => ({
    default: m.CompareEngineView,
  })),
);
const Interests = lazy(() =>
  import("./components/CareerAtlasAndQuizView").then((m) => ({
    default: m.CareerAtlasAndQuizView,
  })),
);
const Profile = lazy(() =>
  import("./components/ProfileAndCalendarView").then((m) => ({
    default: m.InstitutionAndCourseProfileView,
  })),
);
const Dates = lazy(() =>
  import("./components/ProfileAndCalendarView").then((m) => ({
    default: m.AdmissionsCalendarView,
  })),
);
const NotFound = lazy(() =>
  import("./components/ProfileAndCalendarView").then((m) => ({
    default: m.RecordNotFound,
  })),
);
const Pathways = lazy(() =>
  import("./components/PrivateUniversitiesView").then((m) => ({
    default: m.PrivateUniversitiesView,
  })),
);
const Information = lazy(() =>
  import("./components/InformationView").then((m) => ({
    default: m.InformationView,
  })),
);
const SiteUtilities = lazy(() =>
  import("./components/SitePages").then((m) => ({ default: m.SitePages })),
);

class ViewBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="page empty-state" role="alert">
        <h1>This page could not load.</h1>
        <p>Your saved choices remain on this device. Reload to try again.</p>
        <button className="button primary" onClick={() => location.reload()}>
          Reload page
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
function ResearchLanguage({ children }: { children: React.ReactNode }) {
  const app = useApp();
  return (
    <>
      {app.lang !== "EN" && (
        <p
          className="portal-container language-note"
          lang={app.lang.toLowerCase()}
        >
          {portalCopy(app.lang).english}
        </p>
      )}
      <div lang="en">{children}</div>
    </>
  );
}
function AppContent() {
  const app = useApp(),
    c = copy(app.lang, app.cutoffYear);
  useEffect(() => {
    const pointer = () => {
      document.documentElement.dataset.input = "pointer";
    };
    const keyboard = () => {
      document.documentElement.dataset.input = "keyboard";
    };
    document.addEventListener("pointerdown", pointer, { passive: true });
    document.addEventListener("keydown", keyboard);
    return () => {
      document.removeEventListener("pointerdown", pointer);
      document.removeEventListener("keydown", keyboard);
    };
  }, []);
  useEffect(() => {
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }, [app.route]);
  useEffect(() => {
    const portalCode = readLocation(window.location).code;
    const titles: Partial<Record<ActiveRoute, string>> = {
      tools: "Student tools",
      budget: "Study budget calculator",
      contact: "Feedback & corrections",
      sitemap: "Website sitemap",
      home: "Explore Sri Lankan study options",
      predictor: c.find,
      "my-plan": c.plan,
      compare: c.compare,
      careers: c.careers,
      "career-quiz": c.careers,
      calendar: c.dates,
      "private-unis": c.pathways,
      explore: "UGC programmes",
      institutions: "Universities & institutes",
      guides: "Student guides",
      programme:
        NON_STATE_CATALOG.find((p) => p.id === portalCode)?.title || c.notFound,
      "catalogue-institution":
        NON_STATE_CATALOG.find((p) => slugify(p.institution) === portalCode)
          ?.institution || c.notFound,
      guide: GUIDES.find((g) => g.slug === portalCode)?.title || c.notFound,
      about: c.about,
      privacy: c.privacy,
      terms: c.terms,
      institution:
        getInstitutionById(app.selectedInstitutionCode)?.official_name ||
        c.notFound,
      course:
        app.districtPrograms.find((p) => p.uni_code === app.selectedUniCode)
          ?.course_name || c.notFound,
      "not-found": c.notFound,
    };
    document.title = `${titles[app.route] || "Study options"} · UniPedia.lk`;
    const canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (canonical) {
      const institutionRoute =
        window.location.pathname === "/institutions" &&
        new URLSearchParams(window.location.search).get("route") === "catalogue"
          ? "?route=catalogue"
          : "";
      canonical.href = `https://unipedia.lk${window.location.pathname}${institutionRoute}`;
    }
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", document.title);
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.append(robots);
    }
    robots.setAttribute(
      "content",
      ["my-plan", "compare", "not-found"].includes(app.route)
        ? "noindex,follow"
        : "index,follow",
    );
  }, [app.route, app.selectedUniCode, app.selectedInstitutionCode, app.lang]);
  const footerLink = (route: ActiveRoute, label: string) => (
    <a
      href={routePath(route)}
      onClick={(e) => {
        e.preventDefault();
        app.setRoute(route);
      }}
    >
      {label}
    </a>
  );
  return (
    <div className="app-shell premium-application">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <GlobalHeader />
      <main id="main-content" tabIndex={-1}>
        <ViewBoundary key={app.route}>
          <Suspense
            fallback={
              <PageSkeleton
                label={c.loading}
                detail={[
                  "course",
                  "programme",
                  "guide",
                  "institution",
                  "catalogue-institution",
                ].includes(app.route)}
              />
            }
          >
            {[
              "explore",
              "institutions",
              "programme",
              "catalogue-institution",
              "guides",
              "guide",
            ].includes(app.route) ? (
              <ResearchLanguage>
                <Portal />
              </ResearchLanguage>
            ) : ["tools", "budget", "contact", "sitemap"].includes(
                app.route,
              ) ? (
              <SiteUtilities />
            ) : app.route === "home" ? (
              <Home />
            ) : app.route === "predictor" ? (
              <Finder />
            ) : app.route === "my-plan" ? (
              <Plan />
            ) : app.route === "compare" ? (
              <Compare />
            ) : app.route === "careers" || app.route === "career-quiz" ? (
              <Interests />
            ) : app.route === "calendar" ? (
              <Dates />
            ) : app.route === "institution" || app.route === "course" ? (
              <Profile mode={app.route} />
            ) : app.route === "private-unis" ? (
              <ResearchLanguage>
                <Pathways />
              </ResearchLanguage>
            ) : ["about", "privacy", "terms"].includes(app.route) ? (
              <Information page={app.route} />
            ) : (
              <NotFound />
            )}
          </Suspense>
        </ViewBoundary>
      </main>
      <footer className="site-footer no-print">
        <div className="footer-inner">
          <div>
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
            <p>Explore higher education in Sri Lanka.</p>
          </div>
          <nav aria-label="Information">
            {footerLink("explore", "UGC programmes")}
            {footerLink("institutions", "Universities & institutes")}
            {footerLink("guides", "Student guides")}
            {footerLink("tools", "Student tools")}
            {footerLink("contact", "Feedback & corrections")}
            {footerLink("sitemap", "Sitemap")}
            {footerLink("about", c.about)}
            {footerLink("calendar", c.dates)}
            {footerLink("private-unis", c.pathways)}
            {footerLink("careers", c.careers)}
            {footerLink("privacy", c.privacy)}
            {footerLink("terms", c.terms)}
          </nav>
          <p className="small">
            {c.historical}
          </p>
        </div>
      </footer>
      <Toaster
        richColors
        position="bottom-right"
        closeButton
        mobileOffset={{ bottom: "88px", left: "16px", right: "16px" }}
        toastOptions={{ duration: 4000 }}
      />
    </div>
  );
}
export function App() {
  return (
    <AppProvider>
      <PortalProvider>
        <AppContent />
      </PortalProvider>
    </AppProvider>
  );
}
export default App;
