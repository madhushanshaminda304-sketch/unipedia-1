import type { ProgramCutoffViewRow } from "../data/ugc/types";
import { academicCheck, type AcademicProfile } from "./discovery";
export const DEFAULT_FILTERS = {
  query: "",
  medium: "",
  institution: "",
  duration: "any",
  aptitude: "any",
  cutoff: "any",
  score: "any",
  sort: "name",
  restrictStream: false,
};
export type CourseFilters = typeof DEFAULT_FILTERS;
export function readCourseFilters(params: URLSearchParams): CourseFilters {
  const result = {
    ...DEFAULT_FILTERS,
    query: params.get("q") || "",
    institution: params.get("institution") || "",
    restrictStream: params.get("section") === "1",
  };
  const allowed = {
    score: ["any", "at_or_above", "below", "unavailable"],
    medium: ["", "E", "S", "T"],
    duration: ["any", "short", "four", "long", "unknown"],
    aptitude: ["any", "required", "not_stated"],
    cutoff: ["any", "numeric", "nqc", "missing", "category"],
    sort: ["name", "cutoff_up", "cutoff_down", "duration", "intake"],
  };
  for (const [key, values] of Object.entries(allowed)) {
    const value = params.get(key);
    if (value && values.includes(value))
      result[key as keyof typeof allowed] = value;
  }
  return result;
}
export function writeCourseFilters(
  filters: CourseFilters,
  year: string,
  district: number,
  stream: string,
) {
  const params = new URLSearchParams();
  params.set("year", year);
  params.set("district", String(district));
  if (stream !== "ALL") params.set("stream", stream);
  if (filters.query) params.set("q", filters.query);
  for (const key of [
    "medium",
    "institution",
    "duration",
    "aptitude",
    "cutoff",
    "sort",
  ] as const) {
    if (filters[key] !== DEFAULT_FILTERS[key]) params.set(key, filters[key]);
  }
  if (filters.restrictStream) params.set("section", "1");
  return params;
}
export function statedDuration(p: ProgramCutoffViewRow) {
  const match = p.duration_display.match(/^\s*0*(\d+)\s*years?\s*$/i);
  return match ? Number(match[1]) : null;
}
export function filterCourses(
  rows: ProgramCutoffViewRow[],
  filters: CourseFilters,
  stream: string,
  z: number | null,
  profile?: AcademicProfile,
  hideMismatch = false,
) {
  const query = filters.query.toLowerCase().trim();
  const result = rows.filter((p) => {
    if (
      query &&
      !`${p.course_name} ${p.institution_name} ${p.uni_code} ${p.stream}`
        .toLowerCase()
        .includes(query)
    )
      return false;
    if (
      filters.restrictStream &&
      stream !== "ALL" &&
      p.stream !== stream &&
      p.stream !== "Other"
    )
      return false;
    if (filters.medium && !p.medium.includes(filters.medium as "E" | "S" | "T"))
      return false;
    if (filters.institution && p.institution_code !== filters.institution)
      return false;
    if (filters.aptitude !== "any" && p.aptitude_status !== filters.aptitude)
      return false;
    const years = statedDuration(p);
    if (filters.duration === "unknown" && years !== null) return false;
    if (filters.duration === "short" && (years === null || years > 3))
      return false;
    if (filters.duration === "four" && years !== 4) return false;
    if (filters.duration === "long" && (years === null || years < 5))
      return false;
    const numeric = p.min_z_score !== null && !p.needs_category_clarification;
    if (filters.cutoff === "numeric" && !numeric) return false;
    if (
      filters.cutoff === "nqc" &&
      (p.status !== "NQC" || p.needs_category_clarification)
    )
      return false;
    if (
      filters.cutoff === "missing" &&
      (p.status !== "NO_HISTORICAL_CUTOFF" || p.needs_category_clarification)
    )
      return false;
    if (filters.cutoff === "category" && !p.needs_category_clarification)
      return false;
    if (filters.score === "unavailable" && numeric) return false;
    if (
      filters.score !== "any" &&
      filters.score !== "unavailable" &&
      z !== null
    ) {
      if (z === null || !Number.isFinite(z) || !numeric) return false;
      if (filters.score === "at_or_above" && z < p.min_z_score!) return false;
      if (filters.score === "below" && z >= p.min_z_score!) return false;
    }
    return (
      !hideMismatch ||
      academicCheck(p.course_code, profile).status !== "NOT_ELIGIBLE"
    );
  });
  return result.sort((a, b) => {
    let first: number | null = null,
      second: number | null = null;
    if (filters.sort.startsWith("cutoff_")) {
      first = a.needs_category_clarification ? null : a.min_z_score;
      second = b.needs_category_clarification ? null : b.min_z_score;
    } else if (filters.sort === "duration") {
      first = statedDuration(a);
      second = statedDuration(b);
    } else if (filters.sort === "intake") {
      first = a.proposed_intake;
      second = b.proposed_intake;
    }
    if (filters.sort !== "name") {
      if (first === null && second !== null) return 1;
      if (first !== null && second === null) return -1;
      if (first !== null && second !== null && first !== second)
        return (
          (first - second) *
          (filters.sort === "cutoff_down" || filters.sort === "intake" ? -1 : 1)
        );
    }
    return (
      a.course_name.localeCompare(b.course_name) ||
      a.institution_name.localeCompare(b.institution_name) ||
      a.uni_code.localeCompare(b.uni_code)
    );
  });
}
