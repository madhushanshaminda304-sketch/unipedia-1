import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, it, expect, vi } from "vitest";
import { getProgramCutoffRowsForDistrict } from "../services/ugcAdapter";
import { PortalExplore } from "./PortalPages";
import { PortalSearch } from "./PortalPrimitives";
import { PortalHome } from "./PortalHomeNext";
import { ImportedProgrammeDetail } from "./ImportedProgrammeDetail";
import { CompareEngineView } from "./CompareEngineView";
import {
  scopeFromQuery,
  scopedProgrammes,
  scopePath,
} from "../lib/discoveryRoutes";
import { discoveryProgrammes, discoveryInstitutions } from "../lib/portal";
vi.mock("../context/AppContext", () => ({
  useApp: () => ({
    lang: "EN",
    districtPrograms: getProgramCutoffRowsForDistrict(1),
    planEntries: [],
    compareList: ["096T"],
    cutoffYear: "2025/2026",
  }),
}));
vi.mock("../context/PortalContext", () => ({
  usePortal: () => ({ saved: [], compared: ["sliit-research-03"] }),
}));

describe("Separate programme destinations", () => {
  it("defaults old all-route links to UGC and keeps explicit catalogue links usable", () => {
    expect(scopeFromQuery(new URLSearchParams())).toBe("ugc");
    expect(scopeFromQuery(new URLSearchParams("route=all"))).toBe("ugc");
    expect(scopeFromQuery(new URLSearchParams("route=catalogue"))).toBe(
      "catalogue",
    );
    expect(scopePath("catalogue")).toBe("/pathways");
  });
  it("partitions the complete dataset without losing records or mixing institution lists", () => {
    const all = discoveryProgrammes();
    const ugc = scopedProgrammes(all, "ugc"),
      other = scopedProgrammes(all, "catalogue");
    expect(ugc.length).toBe(255);
    expect(other.length).toBe(130);
    expect(ugc.length + other.length).toBe(all.length);
    expect(discoveryInstitutions(ugc).every((i) => i.kind === "ugc")).toBe(
      true,
    );
    expect(
      discoveryInstitutions(other).every((i) => i.kind === "catalogue"),
    ).toBe(true);
  });
  it("renders programme and institution filters from only the directory's route", () => {
    const ugc = renderToStaticMarkup(<PortalExplore />);
    const other = renderToStaticMarkup(
      <PortalExplore defaultRoute="catalogue" />,
    );
    expect(ugc).toContain('href="/courses/');
    expect(ugc).not.toContain('href="/programmes/');
    expect(ugc).not.toContain('<option value="sliit">');
    expect(other).toContain('href="/programmes/');
    expect(other).not.toContain('href="/courses/');
    expect(other).not.toContain('<option value="MRT">');
    expect(other).not.toContain("All routes");
  });
  it("submits each search to its own destination", () => {
    expect(renderToStaticMarkup(<PortalSearch scope="ugc" />)).toContain(
      'action="/explore"',
    );
    expect(renderToStaticMarkup(<PortalSearch scope="catalogue" />)).toContain(
      'action="/pathways"',
    );
  });
  it("starts the homepage with only UGC programme cards and route specific subject links", () => {
    const html = renderToStaticMarkup(<PortalHome />);
    expect(html).toContain('href="/explore?subject=Computing"');
    expect(html).toContain('href="/courses/008G"');
    expect(html).not.toContain('href="/programmes/');
    expect(html).not.toContain("students-japura.webp");
    expect(html).toContain("Historical cutoff");
  });
  it("keeps saved private comparison selections out of the UGC comparison view", () => {
    const html = renderToStaticMarkup(<CompareEngineView />);
    expect(html).toContain('href="/courses/096T"');
    expect(html).not.toContain('href="/programmes/sliit-research-03"');
    expect(html).toContain("Private &amp; other programmes (1)");
  });
  it("keeps the two homepage admission pathways explicit and usable", () => {
    const html = renderToStaticMarkup(<PortalHome />);
    expect(html).toContain('class="landing-pathway landing-pathway-ugc"');
    expect(html).toContain('class="landing-pathway landing-pathway-other"');
    expect(html).toContain('href="/courses">Explore the UGC pathway');
    expect(html).toContain('href="/pathways">Explore other programmes');
    expect(html).toContain('aria-label="Choose your admission route"');
    expect(html).not.toContain("hero-paper-background");
  });
  it("links the landing page tools to existing features without promising accounts or applications", () => {
    const html = renderToStaticMarkup(<PortalHome />);
    expect(html).toContain('href="/pathways#study-budget"');
    expect(html).toContain('href="/shortlist"');
    expect(html).toContain('href="/dates"');
    expect(html).not.toContain("Sign in");
    expect(html).not.toContain("Popular:");
    expect(html).toContain("Photography credits");
  });
  it("retains NIBM stage costs, incomplete entry routes and awarding-body uncertainty in programme details", () => {
    const rows = discoveryProgrammes(),
      programme = rows.find((p) => p.ref.id === "nibm-research-01")!;
    const html = renderToStaticMarkup(
      <ImportedProgrammeDetail programme={programme} rows={rows} />,
    );
    expect(html).toContain("staged degree pathway");
    expect(html).toContain("complete A/L entry option");
    expect(html).toContain("Coventry attribution needs confirmation");
    expect(html).toContain("LKR 350,000 course fee");
    expect(html).toContain("registration fees extra");
    expect(html).toContain('href="/compare?route=catalogue"');
    expect(html).not.toContain("UGC Recognized");
  });
  it("uses accessible anchored sections and a name fallback for a programme without verified campus imagery", () => {
    const rows = discoveryProgrammes(),
      programme = rows.find((p) => p.ref.id === "nibm-research-01")!;
    const html = renderToStaticMarkup(
      <ImportedProgrammeDetail programme={programme} rows={rows} />,
    );
    for (const section of [
      "overview",
      "requirements",
      "fees",
      "pathway",
      "sources",
    ]) {
      expect(html).toContain(`href="#programme-${section}"`);
      expect(html).toContain(`id="programme-${section}"`);
    }
    expect(html).toContain("institution-visual-fallback large");
    expect(html).not.toContain("nsbm-engineering.jpg");
    expect(html).toContain("Supporting source pages");
  });
});
