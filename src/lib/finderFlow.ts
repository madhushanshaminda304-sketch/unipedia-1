import {
  DEFAULT_FILTERS,
  readCourseFilters,
  writeCourseFilters,
  type CourseFilters,
} from "./courseFilters";
import type { ProgramCutoffViewRow } from "../data/ugc/types";
export type FinderView = "profile" | "results";
export interface FinderQuery {
  view: FinderView;
  filters: CourseFilters;
  page: number;
  hideMismatch: boolean;
}
export function readFinderQuery(params: URLSearchParams): FinderQuery {
  const explicit = params.get("view");
  const legacy = [
    "q",
    "year",
    "district",
    "stream",
    "institution",
    "medium",
    "duration",
    "aptitude",
    "cutoff",
    "score",
    "sort",
    "section",
    "page",
  ].some((k) => params.has(k));
  const rawPage = Number(params.get("page"));
  return {
    view:
      explicit === "profile"
        ? "profile"
        : explicit === "results" || legacy
          ? "results"
          : "profile",
    filters: readCourseFilters(params),
    page: Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1,
    hideMismatch: params.get("academic") === "1",
  };
}
export function writeFinderQuery(
  state: FinderQuery,
  year: string,
  district: number,
  stream: string,
) {
  const params = writeCourseFilters(state.filters, year, district, stream);
  if (["at_or_above", "below", "unavailable"].includes(state.filters.score))
    params.set("score", state.filters.score);
  params.set("view", state.view);
  if (state.page > 1) params.set("page", String(state.page));
  if (state.hideMismatch) params.set("academic", "1");
  return params;
}
export function historicalComparison(
  row: Pick<
    ProgramCutoffViewRow,
    "min_z_score" | "needs_category_clarification"
  >,
  z: number | null,
) {
  if (row.min_z_score === null || row.needs_category_clarification)
    return "unavailable";
  if (z === null || !Number.isFinite(z)) return "no_score";
  return z >= row.min_z_score ? "at_or_above" : "below";
}
export const freshFinderQuery = (): FinderQuery => ({
  view: "results",
  filters: { ...DEFAULT_FILTERS },
  page: 1,
  hideMismatch: false,
});
