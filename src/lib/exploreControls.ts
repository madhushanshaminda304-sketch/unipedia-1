import {
  EMPTY_EXPLORE,
  readExplore,
  writeExplore,
  type ExploreFilters,
} from "./portal";
import type { DiscoveryScope } from "./discoveryRoutes";
export type ActiveFilterKey =
  "q" | "level" | "subject" | "institution" | "duration" | "fees";
export function activeExploreFilters(
  filters: ExploreFilters,
  institutions: { id: string; name: string }[],
) {
  const duration: Record<string, string> = {
    short: "Up to 3 years",
    four: "4 years",
    long: "More than 4 years",
    unknown: "Unknown or variable duration",
  };
  const labels: Record<ActiveFilterKey, string> = {
    q: `Search: ${filters.q}`,
    level: filters.level,
    subject: filters.subject,
    institution:
      institutions.find((i) => i.id === filters.institution)?.name ||
      filters.institution,
    duration: duration[filters.duration] || filters.duration,
    fees:
      filters.fees === "reported"
        ? "Fee figure reported"
        : "Ask institution for fees",
  };
  return (Object.keys(labels) as ActiveFilterKey[])
    .filter((key) => !!filters[key])
    .map((key) => ({ key, label: labels[key] }));
}
export function applyExplorePatch(
  current: URLSearchParams,
  patch: Partial<ExploreFilters>,
  scope: DiscoveryScope,
) {
  const filters = {
    ...readExplore(current),
    ...patch,
    route: scope,
    page: patch.page ?? 1,
  };
  const query = new URLSearchParams(current);
  Object.keys(EMPTY_EXPLORE).forEach((key) => query.delete(key));
  new URLSearchParams(writeExplore(filters)).forEach((value, key) =>
    query.set(key, value),
  );
  return { filters, query: query.toString() };
}
