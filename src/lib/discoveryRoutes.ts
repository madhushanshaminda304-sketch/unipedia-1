import type { DiscoveryProgramme } from "./portal";

export type DiscoveryScope = "ugc" | "catalogue";
export const DISCOVERY_SCOPE_CHANGED = "unipedia:discovery-scope-changed";
export const scopeFromQuery = (query: URLSearchParams): DiscoveryScope =>
  query.get("route") === "catalogue" ? "catalogue" : "ugc";
export const scopePath = (scope: DiscoveryScope) =>
  scope === "ugc" ? "/explore" : "/pathways";
export const scopeLabel = (scope: DiscoveryScope) =>
  scope === "ugc" ? "UGC programmes" : "Private & other programmes";
export const scopedProgrammes = (
  programmes: DiscoveryProgramme[],
  scope: DiscoveryScope,
) => programmes.filter((p) => p.ref.kind === scope);
