import rawInstitutions from "../data/ugc/institutions.json";
import rawCourses from "../data/ugc/courses.json";
import rawOfferings from "../data/ugc/offerings.json";
import rawEligibility from "../data/ugc/eligibility.json";
import rawCutoffs from "../data/ugc/historicalCutoffs.json";
import rawLatestCutoffs from "../data/ugc/cutoffs2025.json";
export type CutoffYear = "2024/2025" | "2025/2026";
export const LATEST_CUTOFF_YEAR: CutoffYear = "2025/2026";
export const LATEST_CUTOFF_SOURCE = rawLatestCutoffs.source_url;

import type {
  UgcInstitution,
  UgcCourse,
  UgcOffering,
  UgcEligibility,
  UgcHistoricalCutoffColumn,
  UgcHistoricalCutoffsDataset,
  ProgramCutoffViewRow,
  CategorySplitOption,
  SavedPreferenceEntry,
  MigratedPlanResult,
} from "../data/ugc/types";

// Cast loaded JSON data
const institutions: UgcInstitution[] = (
  rawInstitutions as unknown as UgcInstitution[]
).map((inst) => ({
  ...inst,
  code: inst.institution_id,
  type: inst.institution_type?.toLowerCase().includes("campus")
    ? "campus"
    : inst.institution_type?.toLowerCase().includes("institute")
      ? "institute"
      : "university",
  address_or_location: inst.postal_address || "",
  website: inst.website || "",
}));
const courses: UgcCourse[] = rawCourses as unknown as UgcCourse[];
const allOfferings: UgcOffering[] = rawOfferings as unknown as UgcOffering[];
const eligibilityList: UgcEligibility[] =
  rawEligibility as unknown as UgcEligibility[];
const cutoffsDataset: UgcHistoricalCutoffsDataset =
  rawCutoffs as unknown as UgcHistoricalCutoffsDataset;

// Fast in-memory indices
const institutionsById = new Map<string, UgcInstitution>();
for (const inst of institutions) {
  institutionsById.set(inst.institution_id, inst);
  if (inst.code) {
    institutionsById.set(inst.code, inst);
  }
}

const coursesByCode = new Map<string, UgcCourse>();
for (const c of courses) {
  if (c.course_code) {
    coursesByCode.set(c.course_code, c);
  }
}

// Selectable offerings: exactly 255 (excluding the 900 Additional Intake aggregate)
const selectableOfferings: UgcOffering[] = allOfferings.filter(
  (o) => o.is_selectable_unicode_offering && o.uni_code !== null,
);
const selectableOfferingsByUniCode = new Map<string, UgcOffering>();
for (const o of selectableOfferings) {
  if (o.uni_code) {
    selectableOfferingsByUniCode.set(o.uni_code, o);
  }
}

const eligibilityByCourse = new Map<string, UgcEligibility>();
for (const e of eligibilityList) {
  if (e.course_code) {
    eligibilityByCourse.set(e.course_code, e);
  }
}

// Cutoff columns indexed by uni_code (a Uni-Code can have multiple columns for category splits!)
const cutoffColumnsByUniCode = new Map<string, UgcHistoricalCutoffColumn[]>();
for (const col of cutoffsDataset.columns) {
  if (col.uni_code_2025_2026) {
    const existing = cutoffColumnsByUniCode.get(col.uni_code_2025_2026) || [];
    existing.push(col);
    cutoffColumnsByUniCode.set(col.uni_code_2025_2026, existing);
  }
}
const latestCutoffColumnsByUniCode = new Map<
  string,
  UgcHistoricalCutoffColumn[]
>();
for (const col of rawLatestCutoffs.columns as unknown as UgcHistoricalCutoffColumn[]) {
  if (col.uni_code_2025_2026) {
    const list = latestCutoffColumnsByUniCode.get(col.uni_code_2025_2026) || [];
    latestCutoffColumnsByUniCode.set(col.uni_code_2025_2026, [...list, col]);
  }
}

// Helper: parse duration number from string like "5 years" or "4 Years"
function normalizeStreamCategory(cat: string | undefined): string {
  if (!cat) return "Other";
  if (cat.includes("Different Streams") || cat.includes("Any")) return "Other";
  if (cat.includes("Physical Science")) return "Physical Science";
  if (cat.includes("Biological Science")) return "Biological Science";
  if (cat.includes("Commerce")) return "Commerce";
  if (cat.includes("Arts")) return "Arts";
  if (
    cat.includes("Engineering Technology") ||
    cat.includes("Biosystems Technology") ||
    cat.includes("ICT") ||
    cat.includes("Information Communication Technology")
  )
    return "Technology";
  return cat.replace(/\\s*Stream.*$/i, "").trim() || "Other";
}

function parseDurationYears(dur: string | null): number | null {
  if (!dur) return null;
  const m = dur.match(/(\d+)\s*(?:years?|yrs?)/i);
  return m ? Number(m[1]) : null;
}

// Helper: normalize medium array
function normalizeMediums(meds: string[] | null): ("E" | "S" | "T")[] {
  if (!meds || meds.length === 0) return [];
  const set = new Set<"E" | "S" | "T">();
  for (const m of meds) {
    const lower = m.toLowerCase();
    if (lower.includes("english") || lower === "e") set.add("E");
    if (lower.includes("sinhala") || lower === "s") set.add("S");
    if (lower.includes("tamil") || lower === "t") set.add("T");
  }
  return Array.from(set);
}

export interface CutoffLookupResult {
  status: "QUALIFIED" | "NQC" | "NO_HISTORICAL_CUTOFF";
  min_z_score: number | null;
  raw_value: string | null;
  all_island_merit_only: boolean;
  category_split_options?: CategorySplitOption[];
  needs_category_clarification?: boolean;
  selected_category_qualifier?: string | null;
  column_id?: string;
}

/**
 * Looks up the published Section 9 historical cutoff for a given Uni-Code and district.
 * Respects stream/category splits for 021L, 022R, 022W, 027D, and 107L.
 * Preserves all decimals, negative scores, and NQC values.
 * Never interpolates or calculates synthetic district offsets.
 */
export function getCutoffForOfferingAndDistrict(
  uniCode: string,
  districtId: number,
  studentStream?: string,
  cutoffYear: CutoffYear = LATEST_CUTOFF_YEAR,
): CutoffLookupResult {
  // Guard: ambiguous Kelaniya sports cutoff is NOT attached to 141D
  if (uniCode === "141D" && cutoffYear === "2024/2025") {
    return {
      status: "NO_HISTORICAL_CUTOFF",
      min_z_score: null,
      raw_value: null,
      all_island_merit_only: false,
    };
  }

  const cols = (
    cutoffYear === "2025/2026"
      ? latestCutoffColumnsByUniCode
      : cutoffColumnsByUniCode
  ).get(uniCode);
  if (!cols || cols.length === 0) {
    return {
      status: "NO_HISTORICAL_CUTOFF",
      min_z_score: null,
      raw_value: null,
      all_island_merit_only: false,
    };
  }

  // Single column match
  if (cols.length === 1) {
    const col = cols[0];
    const dCut = col.district_cutoffs.find((d) => d.district_id === districtId);
    if (!dCut) {
      return {
        status: "NO_HISTORICAL_CUTOFF",
        min_z_score: null,
        raw_value: null,
        all_island_merit_only: col.all_island_merit_marker,
        column_id: col.column_id,
      };
    }
    return {
      status: dCut.is_nqc ? "NQC" : "QUALIFIED",
      min_z_score: dCut.z_score,
      raw_value: dCut.raw_value,
      all_island_merit_only: col.all_island_merit_marker,
      column_id: col.column_id,
    };
  }

  // Multiple columns -> Category/Stream Split (021L, 022R, 022W, 027D, 107L)
  const categoryOptions: CategorySplitOption[] = cols.map((col) => {
    const dCut = col.district_cutoffs.find((d) => d.district_id === districtId);
    return {
      qualifier: col.stream_or_category_qualifier || col.raw_column_header,
      z_score: dCut?.z_score ?? null,
      is_nqc: dCut?.is_nqc ?? true,
      raw_value: dCut?.raw_value ?? "NQC",
    };
  });

  // Attempt to resolve based on student's stream
  let selectedCol: UgcHistoricalCutoffColumn | undefined;

  const knownStreams = [
    "arts",
    "commerce",
    "biological science",
    "physical science",
    "technology",
    "engineering technology",
    "biosystems technology",
    "ict",
  ];
  const normStream = studentStream?.trim().toLowerCase();
  if (normStream && knownStreams.includes(normStream)) {
    // 021L: Arts Stream vs Commerce Stream
    if (uniCode === "021L") {
      if (normStream.includes("arts")) {
        selectedCol = cols.find((c) =>
          c.stream_or_category_qualifier?.toLowerCase().includes("arts"),
        );
      } else if (normStream.includes("commerce")) {
        selectedCol = cols.find((c) =>
          c.stream_or_category_qualifier?.toLowerCase().includes("commerce"),
        );
      }
    }
    // 022R / 022W: Commerce Stream vs Any subject combination
    else if (uniCode === "022R" || uniCode === "022W") {
      if (normStream.includes("commerce")) {
        selectedCol = cols.find((c) =>
          c.stream_or_category_qualifier?.toLowerCase().includes("commerce"),
        );
      } else {
        selectedCol = cols.find((c) =>
          c.stream_or_category_qualifier?.toLowerCase().includes("any"),
        );
      }
    }
    // 027D: BIO SCIENCE STREAM vs OTHER STREAM
    else if (uniCode === "027D") {
      if (normStream.includes("bio")) {
        selectedCol = cols.find((c) =>
          c.stream_or_category_qualifier?.toLowerCase().includes("bio"),
        );
      } else {
        selectedCol = cols.find((c) =>
          c.stream_or_category_qualifier?.toLowerCase().includes("other"),
        );
      }
    }
    // 107L: Biological / Physical Science Stream vs Commerce Stream
    else if (uniCode === "107L") {
      if (normStream.includes("commerce")) {
        selectedCol = cols.find((c) =>
          c.stream_or_category_qualifier?.toLowerCase().includes("commerce"),
        );
      } else if (
        normStream.includes("bio") ||
        normStream.includes("physical") ||
        normStream.includes("science")
      ) {
        selectedCol = cols.find((c) =>
          c.stream_or_category_qualifier?.toLowerCase().includes("biological"),
        );
      }
    }
  }

  if (selectedCol) {
    const dCut = selectedCol.district_cutoffs.find(
      (d) => d.district_id === districtId,
    );
    return {
      status: dCut?.is_nqc ? "NQC" : "QUALIFIED",
      min_z_score: dCut?.z_score ?? null,
      raw_value: dCut?.raw_value ?? "NQC",
      all_island_merit_only: selectedCol.all_island_merit_marker,
      category_split_options: categoryOptions,
      needs_category_clarification: false,
      selected_category_qualifier: selectedCol.stream_or_category_qualifier,
      column_id: selectedCol.column_id,
    };
  }

  // Student stream is unknown -> Return labeled options and flag for clarification
  return {
    status: "QUALIFIED",
    min_z_score: null,
    raw_value: null,
    all_island_merit_only: false,
    category_split_options: categoryOptions,
    needs_category_clarification: true,
    selected_category_qualifier: null,
  };
}

// District names by ID 1..25
const DISTRICT_NAMES_BY_ID: Record<number, string> = {
  1: "Colombo",
  2: "Gampaha",
  3: "Kalutara",
  4: "Matale",
  5: "Kandy",
  6: "Nuwara Eliya",
  7: "Galle",
  8: "Matara",
  9: "Hambantota",
  10: "Jaffna",
  11: "Kilinochchi",
  12: "Mannar",
  13: "Mullaitivu",
  14: "Vavuniya",
  15: "Trincomalee",
  16: "Batticaloa",
  17: "Ampara",
  18: "Puttalam",
  19: "Kurunegala",
  20: "Anuradhapura",
  21: "Polonnaruwa",
  22: "Badulla",
  23: "Monaragala",
  24: "Kegalle",
  25: "Ratnapura",
};

/**
 * Builds all 255 selectable Uni-Code program rows for a given district.
 * Guarantees zero synthetic calculations.
 */
export function getProgramCutoffRowsForDistrict(
  districtId: number,
  studentStream?: string,
  cutoffYear: CutoffYear = LATEST_CUTOFF_YEAR,
): ProgramCutoffViewRow[] {
  const districtName = DISTRICT_NAMES_BY_ID[districtId] || "Colombo";

  return selectableOfferings.map((offering) => {
    const course = coursesByCode.get(offering.course_code);
    const inst = offering.institution_id
      ? institutionsById.get(offering.institution_id)
      : undefined;
    const elig = eligibilityByCourse.get(offering.course_code);
    const cutoff = getCutoffForOfferingAndDistrict(
      offering.uni_code!,
      districtId,
      studentStream,
      cutoffYear,
    );

    // Honest formatting of unknown fields
    const degreeDisplay =
      offering.degree_programmes && offering.degree_programmes.length > 0
        ? offering.degree_programmes.join(", ")
        : "Not stated in this handbook";

    const durationDisplay = offering.duration
      ? offering.duration
      : "Not stated in this handbook";

    const mediumArr = normalizeMediums(offering.medium_of_instruction);
    const mediumDisplay =
      offering.medium_of_instruction &&
      offering.medium_of_instruction.length > 0
        ? offering.medium_of_instruction.join(", ")
        : "Not stated in this handbook";

    const aptitudeStatus =
      elig?.conditions?.aptitude_or_practical_test?.status ?? "not_stated";
    const aptitudeRequired = aptitudeStatus === "required";

    return {
      uni_code: offering.uni_code!,
      course_code: offering.course_code,
      course_name:
        course?.official_title ||
        offering.course_title_annex_b ||
        offering.course_title_unicode_table,
      stream: normalizeStreamCategory(course?.stream_category),
      faculty:
        (offering.location_or_faculty && offering.location_or_faculty[0]) ||
        inst?.address_or_location ||
        "",
      degree_awarded: degreeDisplay,
      degree_display: degreeDisplay,
      duration_years: parseDurationYears(offering.duration),
      duration_display: durationDisplay,
      curriculum_credits: offering.curriculum_credits,
      medium: mediumArr,
      medium_display: mediumDisplay,
      proposed_intake: offering.proposed_intake,
      aptitude_test_required: aptitudeRequired,
      aptitude_status: aptitudeStatus,
      all_island_merit_only: cutoff.all_island_merit_only,
      district_id: districtId,
      district_name: districtName,
      academic_year: "2025/2026",
      cutoff_year: cutoffYear,
      min_z_score: cutoff.min_z_score,
      status: cutoff.status,
      raw_z_score_text: cutoff.raw_value,
      all_island_min_z: cutoff.min_z_score,
      all_island_max_z: cutoff.min_z_score,
      category_split_options: cutoff.category_split_options,
      needs_category_clarification: cutoff.needs_category_clarification,
      selected_category_qualifier: cutoff.selected_category_qualifier,
      requires_ol_special: Boolean(
        elig?.conditions?.machine_evaluable_conditions?.ol_minimum_grades,
      ),
      is_suspended: course?.status === "temporarily_suspended",
      suspension_reason: course?.suspension_reason || null,
      alternative_degree_pathways: offering.alternative_degree_pathways,
      conditional_honours_entry: offering.conditional_honours_entry,
      auto_decision_safe: elig?.auto_decision_safe ?? false,
      evaluation_readiness:
        elig?.evaluation_readiness ?? "requires_manual_review",
      source_reference: {
        handbook_edition: "2025/2026 UGC Sri Lanka Student Handbook",
        admission_year: "2025/2026",
        historical_cutoff_year: cutoffYear,
        cutoff_source_url:
          cutoffYear === "2025/2026"
            ? LATEST_CUTOFF_SOURCE
            : "https://www.ugc.ac.lk/downloads/admissions/Handbook_2025_26/student_handbook_english.pdf",
        cutoff_publication_date:
          cutoffYear === "2025/2026"
            ? rawLatestCutoffs.publication_date
            : undefined,
        source_file: offering.source_file,
        source_section: offering.source_section,
        source_table: offering.source_table,
        source_line_start: offering.source_line_start,
        source_line_end: offering.source_line_end,
        printed_page: offering.printed_page || null,
        review_status: "needs_review",
      },
      eligibility_source_reference: elig
        ? {
            handbook_edition: "2025/2026 UGC Sri Lanka Student Handbook",
            admission_year: "2025/2026",
            historical_cutoff_year: "2024/2025",
            source_file: elig.source_file,
            source_section: elig.source_section,
            source_line_start: elig.source_line_start,
            source_line_end: elig.source_line_end,
            printed_page: elig.printed_page,
            review_status: "needs_review",
          }
        : undefined,
      al_requirements_summary:
        elig?.conditions?.al_requirement_summary ||
        "Requirements in official handbook.",
      overview: elig?.verbatim_section_2_text || "",
      career_category: course?.stream_category || "General Higher Education",
      institution_code: inst?.code || offering.institution_id || "",
      institution_name:
        inst?.official_name || offering.institution_official_name,
      institution_type: inst?.type || "University",
      institution_location: inst?.address_or_location || "",
      institution_website: inst?.website || "",
      specializations: offering.specialization_streams || [],
      career_paths: [],
      total_national_intake:
        course?.proposed_intake_2025_2026 || offering.proposed_intake,
      differently_abled_quota:
        typeof offering.special_provision_6_1_quotas
          ?.differently_abled_seats === "number"
          ? offering.special_provision_6_1_quotas.differently_abled_seats
          : null,
      // Structured eligibility is evaluated by course code, never flattened into a single grade.
      course_description: elig?.conditions?.al_requirement_summary || "",
      ol_requirements_text: null,
      ol_short_badge: null,
      special_intake_quota_note: null,
      aptitude_test_info: aptitudeRequired
        ? "Pass University Aptitude / Practical Test required"
        : null,
    };
  });
}

/**
 * Returns all 25 district cutoffs for a single Uni-Code.
 */
export function getAllDistrictCutoffsForUniCode(
  uniCode: string,
  studentStream?: string,
  cutoffYear: CutoffYear = LATEST_CUTOFF_YEAR,
): {
  district_id: number;
  district_name: string;
  min_z_score: number | null;
  status: "QUALIFIED" | "NQC" | "NO_HISTORICAL_CUTOFF";
}[] {
  const result: {
    district_id: number;
    district_name: string;
    min_z_score: number | null;
    status: "QUALIFIED" | "NQC" | "NO_HISTORICAL_CUTOFF";
  }[] = [];
  for (let dId = 1; dId <= 25; dId++) {
    const cut = getCutoffForOfferingAndDistrict(
      uniCode,
      dId,
      studentStream,
      cutoffYear,
    );
    result.push({
      district_id: dId,
      district_name: DISTRICT_NAMES_BY_ID[dId],
      min_z_score: cut.min_z_score,
      status: cut.status,
    });
  }
  return result;
}

/**
 * Protects existing saved plans.
 * Detects ambiguous old codes, provides clear migration notes and recovery paths,
 * without silently reinterpreting them.
 */
export function migrateSavedPlan(
  entries: SavedPreferenceEntry[],
): MigratedPlanResult {
  let hasModifications = false;
  let flaggedCount = 0;

  const migratedEntries: SavedPreferenceEntry[] = entries.map((entry) => {
    const code = entry.uni_code;
    if (code === "130G" && entry.originalCode === "096G") {
      hasModifications = true;
      flaggedCount++;
      return {
        ...entry,
        migrationStatus: "ambiguous",
        suggestedUniCode: "117G",
        migrationNote:
          "The earlier migration suggested 130G incorrectly. Review 117G for Artificial Intelligence at University of Moratuwa.",
      };
    }
    if (entry.migrationReviewedFor === "2025/2026") return { ...entry };

    // 1. 020S: mislabeled as Law in previous snapshot, but officially Arts (SP) - Mass Media
    if (code === "020S") {
      hasModifications = true;
      flaggedCount++;
      return {
        ...entry,
        migrationStatus: "ambiguous",
        originalCode: "020S",
        originalCourseName: "Law (LLB (Hons)) [Prior Website Label]",
        migrationNote:
          "In the previous version of this tool, 020S was mislabeled as Law. In the official UGC 2025/2026 handbook, 020S is Arts (SP) - Mass Media at Sripalee Campus. If you intended to study Law, official Law courses are 025A (Colombo), 025B (Peradeniya), and 025E (Jaffna).",
        suggestedUniCode: undefined,
      };
    }

    // 2. 020A: Old fake code for Law Colombo -> Canonical 025A
    if (code === "020A") {
      hasModifications = true;
      flaggedCount++;
      return {
        ...entry,
        migrationStatus: "ambiguous",
        originalCode: "020A",
        originalCourseName: "Law (University of Colombo)",
        suggestedUniCode: "025A",
        migrationNote:
          "Review suggested correction: 020A to 025A (Law at University of Colombo). Your saved code is unchanged until you accept.",
      };
    }

    // 3. 020B: Old fake code for Law Peradeniya -> Canonical 025B
    if (code === "020B") {
      hasModifications = true;
      flaggedCount++;
      return {
        ...entry,
        migrationStatus: "ambiguous",
        originalCode: "020B",
        originalCourseName: "Law (University of Peradeniya)",
        suggestedUniCode: "025B",
        migrationNote:
          "Review suggested correction: 020B to 025B (Law at University of Peradeniya). Your saved code is unchanged until you accept.",
      };
    }

    // 4. 020E: Old fake code for Law Jaffna -> Canonical 025E
    if (code === "020E") {
      hasModifications = true;
      flaggedCount++;
      return {
        ...entry,
        migrationStatus: "ambiguous",
        originalCode: "020E",
        originalCourseName: "Law (University of Jaffna)",
        suggestedUniCode: "025E",
        migrationNote:
          "Review suggested correction: 020E to 025E (Law at University of Jaffna). Your saved code is unchanged until you accept.",
      };
    }

    // 5. Preserve the old AI code until the student accepts the canonical 117G suggestion.
    if (code === "096G") {
      hasModifications = true;
      flaggedCount++;
      return {
        ...entry,
        migrationStatus: "ambiguous",
        originalCode: "096G",
        originalCourseName: "Artificial Intelligence (University of Moratuwa)",
        suggestedUniCode: "117G",
        migrationNote:
          "Review suggested correction: 096G to 117G (Artificial Intelligence at University of Moratuwa). Course code 096 identifies Information Systems.",
      };
    }

    // 6. 140P: Service Management at GWUIM (temporarily suspended for 2025/2026)
    if (code === "140P") {
      hasModifications = true;
      flaggedCount++;
      return {
        ...entry,
        migrationStatus: "ambiguous",
        originalCode: "140P",
        originalCourseName: "Service Management (GWUIM)",
        migrationNote:
          "Intake for Service Management at GWUIM is temporarily suspended for Academic Year 2025/2026 due to ongoing curriculum review.",
      };
    }

    // 7. Check if valid selectable offering in 2025/2026
    if (selectableOfferingsByUniCode.has(code)) {
      return {
        ...entry,
        migrationStatus: "valid",
      };
    }

    // 8. Other unrecognized codes
    hasModifications = true;
    flaggedCount++;
    return {
      ...entry,
      migrationStatus: "unresolved",
      originalCode: code,
      migrationNote: `Code ${code} is not an active selectable Uni-Code offering in the official 2025/2026 UGC handbook.`,
    };
  });

  return {
    migratedEntries,
    hasModifications,
    flaggedCount,
  };
}

/** Apply a validated suggestion only after the student explicitly accepts it. */
export function acceptSavedPlanSuggestion(
  entries: SavedPreferenceEntry[],
  code: string,
): SavedPreferenceEntry[] {
  const target = entries.find(
    (e) => e.uni_code === code || e.originalCode === code,
  );
  if (
    !target?.suggestedUniCode ||
    !selectableOfferingsByUniCode.has(target.suggestedUniCode)
  )
    return entries;
  // Preserve both entries rather than silently merging distinct preferences.
  if (
    entries.some((e) => e !== target && e.uni_code === target.suggestedUniCode)
  )
    return entries;
  return entries.map((e) =>
    e === target
      ? {
          ...e,
          uni_code: target.suggestedUniCode!,
          migrationStatus: "valid",
          migrationReviewedFor: "2025/2026",
        }
      : e,
  );
}

export function getInstitutions(): UgcInstitution[] {
  return institutions;
}

export function getActiveCourses(): UgcCourse[] {
  return courses.filter((c) => c.status === "active");
}

export function getSuspendedCourses(): UgcCourse[] {
  return courses.filter((c) => c.status === "temporarily_suspended");
}

export function getSelectableOfferings(): UgcOffering[] {
  return selectableOfferings;
}

export function getOfferingByUniCode(uniCode: string): UgcOffering | undefined {
  return selectableOfferingsByUniCode.get(uniCode);
}

export function getCourseByCode(courseCode: string): UgcCourse | undefined {
  return coursesByCode.get(courseCode);
}

export function getInstitutionById(
  institutionId: string,
): UgcInstitution | undefined {
  const aliases: Record<string, string> = {
    UOM: "MRT",
    UOC: "CMB",
    UOP: "PDN",
    USJP: "SJP",
    USJ: "SJP",
    UOK: "KLN",
    UOJ: "UJA",
    UOR: "RUH",
    SPC: "SP",
    TC: "TRINCO",
  };
  return (
    institutionsById.get(institutionId) ||
    institutionsById.get(aliases[institutionId])
  );
}

export function getDatasetSummaryCounts(
  cutoffYear: CutoffYear = LATEST_CUTOFF_YEAR,
): {
  institutionsCount: number;
  activeCoursesCount: number;
  suspendedCoursesCount: number;
  selectableOfferingsCount: number;
  totalCutoffCells: number;
  numericCutoffCells: number;
  nqcCutoffCells: number;
} {
  return {
    institutionsCount: institutions.length,
    activeCoursesCount: courses.filter((c) => c.status === "active").length,
    suspendedCoursesCount: courses.filter(
      (c) => c.status === "temporarily_suspended",
    ).length,
    selectableOfferingsCount: selectableOfferings.length,
    totalCutoffCells:
      cutoffYear === "2025/2026"
        ? rawLatestCutoffs.summary_counts.district_cells
        : cutoffsDataset.summary_counts.total_district_cutoff_cells,
    numericCutoffCells:
      cutoffYear === "2025/2026"
        ? rawLatestCutoffs.summary_counts.numeric
        : cutoffsDataset.summary_counts.numeric_z_score_cells,
    nqcCutoffCells:
      cutoffYear === "2025/2026"
        ? rawLatestCutoffs.summary_counts.nqc
        : cutoffsDataset.summary_counts.nqc_cells,
  };
}
