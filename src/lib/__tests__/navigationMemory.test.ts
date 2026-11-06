import { afterEach, describe, it, expect, vi } from "vitest";
import {
  safeUgcReturn,
  rememberUgcReturn,
  ugcReturnDestination,
  readHomeScope,
} from "../navigationMemory";
import { SITE_SECTIONS } from "../siteNavigation";
import { readLocation } from "../routes";
afterEach(() => vi.unstubAllGlobals());
describe("Discovery navigation and sitemap destinations", () => {
  it("restores only a local UGC browse/result destination", () => {
    expect(safeUgcReturn("/courses?view=results&q=Engineering&page=2")).toBe(
      "/courses?view=results&q=Engineering&page=2",
    );
    expect(safeUgcReturn("/explore?subject=Computing")).toBe(
      "/explore?subject=Computing",
    );
    for (const value of [
      "https://example.com",
      "//example.com",
      "/courses/008G",
      "/contact",
      null,
    ])
      expect(safeUgcReturn(value)).toBe("/courses?view=results");
  });
  it("preserves complex search queries, hashes, and view parameters on return", () => {
    const store = new Map<string, string>();
    vi.stubGlobal("sessionStorage", {
      getItem: (k: string) => store.get(k),
      setItem: (k: string, v: string) => store.set(k, v),
    });
    const queryUrl = "/courses?view=results&stream=PHYSICAL&district=1&z=1.85&page=2#results-grid";
    rememberUgcReturn(queryUrl);
    expect(ugcReturnDestination()).toBe(queryUrl);
  });
  it("survives unavailable session storage and remembers a filtered results URL", () => {
    expect(ugcReturnDestination()).toBe("/courses?view=results");
    const store = new Map<string, string>();
    vi.stubGlobal("sessionStorage", {
      getItem: (k: string) => store.get(k),
      setItem: (k: string, v: string) => store.set(k, v),
    });
    rememberUgcReturn("/courses?view=results&year=2024%2F2025&page=3");
    expect(ugcReturnDestination()).toBe(
      "/courses?view=results&year=2024%2F2025&page=3",
    );
  });
  it("restores the homepage admission route from its URL", () => {
    expect(readHomeScope("?route=catalogue")).toBe("catalogue");
    expect(readHomeScope("?route=ugc")).toBe("ugc");
    expect(readHomeScope("")).toBe("ugc");
  });
  it("resolves every human sitemap destination, including the tools and budget pages", () => {
    for (const section of SITE_SECTIONS)
      for (const [href] of section.links) {
        const url = new URL(href, "https://unipedia.lk");
        expect(
          readLocation({ pathname: url.pathname, hash: url.hash }).route,
        ).not.toBe("not-found");
      }
    expect(readLocation({ pathname: "/tools/budget", hash: "" }).route).toBe(
      "budget",
    );
  });
});
