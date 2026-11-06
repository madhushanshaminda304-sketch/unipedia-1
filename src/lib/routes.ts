export type ActiveRoute =
  | "tools"
  | "budget"
  | "contact"
  | "sitemap"
  | "explore"
  | "institutions"
  | "catalogue-institution"
  | "programme"
  | "guides"
  | "guide"
  | "home"
  | "predictor"
  | "my-plan"
  | "compare"
  | "careers"
  | "career-quiz"
  | "calendar"
  | "institution"
  | "course"
  | "private-unis"
  | "about"
  | "privacy"
  | "terms"
  | "not-found";
const paths: Partial<Record<ActiveRoute, string>> = {
  tools: "/tools",
  budget: "/tools/budget",
  contact: "/contact",
  sitemap: "/sitemap",
  explore: "/explore",
  institutions: "/institutions",
  guides: "/guides",
  home: "/",
  predictor: "/courses",
  "my-plan": "/shortlist",
  compare: "/compare",
  careers: "/interests",
  "career-quiz": "/interests/quiz",
  calendar: "/dates",
  "private-unis": "/pathways",
  about: "/about",
  privacy: "/privacy",
  terms: "/terms",
};
export function routePath(route: ActiveRoute, code?: string) {
  if (route === "programme")
    return `/programmes/${encodeURIComponent(code ?? "")}`;
  if (route === "catalogue-institution")
    return `/institutions/${encodeURIComponent(code ?? "")}`;
  if (route === "guide") return `/guides/${encodeURIComponent(code ?? "")}`;
  return route === "course"
    ? `/courses/${encodeURIComponent(code ?? "")}`
    : route === "institution"
      ? `/universities/${encodeURIComponent(code ?? "")}`
      : (paths[route] ?? "/not-found");
}
export function readLocation(location: Pick<Location, "pathname" | "hash">): {
  route: ActiveRoute;
  code?: string;
} {
  try {
    if (location.hash && !location.hash.startsWith("#?")) {
      const [name, code] = location.hash.slice(1).split("?")[0].split("/");
      if (name === "institution" || name === "course")
        return {
          route: name,
          code: decodeURIComponent(code ?? "").toUpperCase(),
        };
      if (name in paths) return { route: name as ActiveRoute };
    }
    const path = location.pathname.replace(/\/$/, "") || "/";
    const exact = Object.entries(paths).find(([, p]) => p === path);
    if (exact) return { route: exact[0] as ActiveRoute };
    const portal = path.match(/^\/(programmes|institutions|guides)\/([^/]+)$/);
    if (portal)
      return {
        route:
          portal[1] === "programmes"
            ? "programme"
            : portal[1] === "institutions"
              ? "catalogue-institution"
              : "guide",
        code: decodeURIComponent(portal[2]),
      };
    const match = path.match(/^\/(courses|universities)\/([^/]+)$/);
    return match
      ? {
          route: match[1] === "courses" ? "course" : "institution",
          code: decodeURIComponent(match[2]).toUpperCase(),
        }
      : { route: "not-found" };
  } catch {
    return { route: "not-found" };
  }
}
