import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  SRI_LANKA_DISTRICTS,
  UGC_INSTITUTIONS,
  NON_STATE_IFSLS_PATHWAYS,
  PRIVATE_AND_ALTERNATIVE_PROGRAMS,
  type PrivateAndAlternativeProgram,
  type HigherEdTier,
  type EntryQualification,
  type FinancialAidType,
  CAREER_ATLAS,
  INITIAL_CAMPUS_REVIEWS,
  INITIAL_QNA_THREADS,
  ADMISSIONS_CALENDAR_EVENTS,
  type CampusReviewItem,
  type QnAThreadItem,
  type DistrictInfo,
  type CareerAtlasItem,
  OL_REQUIREMENTS_BY_COURSE_CODE,
  COURSE_MASTER_OVERVIEWS,
} from '../data/sriLankaUgcSnapshot';
import {
  getProgramCutoffRowsForDistrict,
  getAllDistrictCutoffsForUniCode,
  getOfferingByUniCode,
  getInstitutions,
  getActiveCourses,
  getSuspendedCourses,
  getSelectableOfferings,
  getDatasetSummaryCounts,
  migrateSavedPlan,
} from './ugcAdapter';
import type { ProgramCutoffViewRow } from '../data/ugc/types';
import { classifyProgramMatch, type ChanceTier } from '../lib/ugcLogic';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// In-memory + sessionStorage cache to protect Supabase 5GB free-tier egress
const memoryCache = new Map<string, unknown>();

function getCached<T>(key: string): T | null {
  if (memoryCache.has(key)) {
    return memoryCache.get(key) as T;
  }
  try {
    const raw = sessionStorage.getItem(`unipedia_cache_${key}`) ?? sessionStorage.getItem(`lankavuz_cache_${key}`);
    if (raw) {
      const parsed = JSON.parse(raw) as T;
      memoryCache.set(key, parsed);
      return parsed;
    }
  } catch {
    // Ignore sessionStorage quota or private browsing errors
  }
  return null;
}

function setCached<T>(key: string, value: T): void {
  memoryCache.set(key, value);
  try {
    sessionStorage.setItem(`unipedia_cache_${key}`, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors
  }
}

export interface MatchedProgramRow extends ProgramCutoffViewRow {
  z_margin: number | null;
  chance_tier: ChanceTier;
}

/**
 * Normalizes both Supabase SQL view columns and local rows into ProgramCutoffViewRow.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeProgramCutoffRow(raw: Record<string, any>): ProgramCutoffViewRow {
  const uniCode = String(raw.uni_code ?? '');
  const canonicalOffering = getOfferingByUniCode(uniCode);

  let mediumArr: ('E' | 'S' | 'T')[] = canonicalOffering?.medium_of_instruction
    ? (canonicalOffering.medium_of_instruction.map((m) => m[0].toUpperCase() as 'E' | 'S' | 'T'))
    : ['E'];

  if (Array.isArray(raw.medium)) {
    mediumArr = raw.medium;
  } else if (typeof raw.medium === 'string') {
    const medLower = raw.medium.toLowerCase();
    const arr: ('E' | 'S' | 'T')[] = [];
    if (medLower.includes('english') || medLower.includes('e')) arr.push('E');
    if (medLower.includes('sinhala') || medLower.includes('s')) arr.push('S');
    if (medLower.includes('tamil') || medLower.includes('t')) arr.push('T');
    mediumArr = arr.length > 0 ? arr : ['E'];
  }

  let minZ: number | null = null;
  if (raw.min_z_score !== undefined && raw.min_z_score !== null) {
    minZ = Number(raw.min_z_score);
  } else if (raw.z_score_numeric !== undefined && raw.z_score_numeric !== null) {
    minZ = Number(raw.z_score_numeric);
  } else if (raw.cutoff_z !== undefined && raw.cutoff_z !== null) {
    minZ = Number(raw.cutoff_z);
  }

  const isNqc = raw.status === 'NQC' || raw.cutoff_status === 'NQC' || (minZ === null && raw.status !== 'NO_HISTORICAL_CUTOFF');

  const courseCode = String(raw.course_code ?? canonicalOffering?.course_code ?? '');
  const districtId = Number(raw.district_id ?? 1);
  const districtName = String(raw.district_name ?? raw.district_exact ?? 'Colombo');

  const degreeDisplay = String(
    raw.degree_awarded ??
      raw.degree_title_exact ??
      canonicalOffering?.degree_programmes?.join(', ') ??
      'Not stated in this handbook'
  );

  const durationYears = raw.duration_years !== undefined && raw.duration_years !== null
    ? Number(raw.duration_years)
    : (canonicalOffering?.duration ? Number(canonicalOffering.duration.match(/\d+/)?.[0] || 4) : null);

  const durationDisplay = String(
    raw.duration_display ??
      canonicalOffering?.duration ??
      (durationYears ? `${durationYears} years` : 'Not stated in this handbook')
  );

  const mediumDisplay = String(
    raw.medium_display ??
      canonicalOffering?.medium_of_instruction?.join(', ') ??
      (mediumArr.length > 0 ? mediumArr.join(', ') : 'Not stated in this handbook')
  );

  return {
    uni_code: uniCode,
    course_code: courseCode,
    course_name: String(raw.course_name ?? canonicalOffering?.course_title_annex_b ?? 'UGC Course'),
    stream: String(raw.stream ?? 'Other'),
    faculty: String(raw.faculty ?? raw.faculty_name ?? canonicalOffering?.location_or_faculty?.[0] ?? ''),
    degree_awarded: degreeDisplay,
    degree_display: degreeDisplay,
    duration_years: durationYears,
    duration_display: durationDisplay,
    curriculum_credits: canonicalOffering?.curriculum_credits ?? null,
    medium: mediumArr,
    medium_display: mediumDisplay,
    proposed_intake: Number(raw.proposed_intake ?? canonicalOffering?.proposed_intake ?? 100),
    aptitude_test_required: Boolean(raw.aptitude_test_required ?? raw.requires_aptitude_test),
    aptitude_status: Boolean(raw.aptitude_test_required ?? raw.requires_aptitude_test) ? 'required' : 'not_stated',
    all_island_merit_only: Boolean(raw.all_island_merit_only ?? raw.all_island_merit_marker),
    district_id: districtId,
    district_name: districtName,
    academic_year: '2025/2026',
    cutoff_year: '2024/2025',
    min_z_score: isNqc ? null : minZ,
    status: isNqc ? 'NQC' : (raw.status ?? 'QUALIFIED'),
    raw_z_score_text: raw.raw_z_score_text ?? (isNqc ? 'NQC' : (minZ !== null ? minZ.toFixed(4) : null)),
    all_island_min_z: minZ,
    all_island_max_z: minZ,
    requires_ol_special: Boolean(raw.requires_ol_special ?? raw.requires_special_ol ?? false),
    is_suspended: Boolean(raw.is_suspended ?? raw.intake_suspended ?? false),
    suspension_reason: raw.suspension_reason ?? null,
    alternative_degree_pathways: canonicalOffering?.alternative_degree_pathways ?? null,
    conditional_honours_entry: canonicalOffering?.conditional_honours_entry ?? null,
    auto_decision_safe: raw.auto_decision_safe ?? false,
    evaluation_readiness: raw.evaluation_readiness ?? 'requires_manual_review',
    source_reference: raw.source_reference ?? {
      handbook_edition: '2025/2026 UGC Sri Lanka Student Handbook',
      admission_year: '2025/2026',
      historical_cutoff_year: '2024/2025',
      source_file: canonicalOffering?.source_file ?? 'ugc7.md',
      source_section: canonicalOffering?.source_section ?? 'Section 5',
      printed_page: canonicalOffering?.printed_page ?? null,
      review_status: 'needs_review',
    },
    al_requirements_summary: String(raw.al_requirements_summary ?? '3 S passes in approved A/L subjects'),
    overview: String(raw.overview ?? raw.course_description ?? ''),
    career_category: String(raw.career_category ?? 'General Higher Education'),
    institution_code: String(raw.institution_code ?? canonicalOffering?.institution_id ?? ''),
    institution_name: String(raw.institution_name ?? canonicalOffering?.institution_official_name ?? 'State University'),
    institution_type: String(raw.institution_type ?? 'University'),
    institution_location: String(raw.institution_location ?? ''),
    institution_website: String(raw.institution_website ?? ''),
    specializations: Array.isArray(raw.specializations) ? raw.specializations : (canonicalOffering?.specialization_streams ?? []),
    career_paths: Array.isArray(raw.career_paths) ? raw.career_paths : [],
    total_national_intake: Number(raw.total_national_intake ?? canonicalOffering?.proposed_intake ?? 120),
    differently_abled_quota: typeof raw.differently_abled_quota === 'number' ? raw.differently_abled_quota : null,
    course_description: String(raw.course_description ?? ''),
  };
}

/**
 * Centralized district program cutoff fetcher.
 * Queries Supabase when configured, or uses the authoritative local UGC adapter.
 * Zero synthetic difficulty offsets.
 */
export const UGC_DATA_SOURCE = {
  source: 'local-reviewed-transcription', admissionYear: '2025/2026',
  cutoffYear: '2025/2026', availableCutoffYears:['2025/2026','2024/2025'], reviewStatus: 'needs_review',
} as const;

export async function fetchProgramCutoffsByDistrict(districtId: number, studentStream?: string): Promise<ProgramCutoffViewRow[]> {
  // Do not reuse unversioned session caches or legacy remote UGC rows.
  return getProgramCutoffRowsForDistrict(districtId, studentStream);
}

export async function matchEligibleProgramsRpc(params: {
  p_district_id: number; p_student_z: number; p_stream: string;
}): Promise<MatchedProgramRow[]> {
  const { p_district_id, p_student_z, p_stream } = params;
  return getProgramCutoffRowsForDistrict(p_district_id, p_stream)
    .filter(r => p_stream === 'ALL' || r.stream === p_stream || r.stream === 'Other')
    .map(base => {
      const cl = classifyProgramMatch({ studentZ: p_student_z, minZScore: base.min_z_score,
        status: base.status, allIslandMeritOnly: base.all_island_merit_only });
      return { ...base, z_margin: cl.margin, chance_tier: cl.tier };
    });
}

export async function fetchAllDistrictCutoffsForUniCode(uniCode: string, studentStream?: string) {
  return getAllDistrictCutoffsForUniCode(uniCode, studentStream);
}

export interface StudentBackupApplicationInput {
  full_name: string;
  phone: string;
  email: string;
  district_name: string;
  al_stream: string;
  z_score: number;
  program_id: string;
  program_title: string;
  institution_name: string;
  wants_ifsls_loan: boolean;
  notes?: string;
}

export async function submitStudentBackupApplication(
  input: StudentBackupApplicationInput
): Promise<{ success: boolean; error?: string }> {
  if (supabase) {
    try {
      const { error } = await supabase.from('lead_applications').insert([input]);
      if (error) throw error;
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown database error';
      return { success: false, error: msg };
    }
  }
  try {
    const existingRaw = localStorage.getItem('unipedia_backup_apps') ?? localStorage.getItem('lankavuz_backup_apps') ?? '[]';
    const existing = JSON.parse(existingRaw) as unknown[];
    existing.push({ ...input, submitted_at: new Date().toISOString() });
    localStorage.setItem('unipedia_backup_apps', JSON.stringify(existing));
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Storage error';
    return { success: false, error: msg };
  }
}

export async function submitCampusReview(item: Record<string, any>): Promise<{ success: boolean; error?: string }> {
  if (supabase) {
    try {
      const { error } = await supabase.from('campus_reviews').insert([item]);
      if (error) throw error;
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Review insertion error';
      return { success: false, error: msg };
    }
  }
  try {
    const key = 'unipedia_local_reviews';
    const raw = localStorage.getItem(key) ?? '[]';
    const parsed = JSON.parse(raw) as unknown[];
    parsed.push({ ...item, id: `local_rev_${Date.now()}`, created_at: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(parsed));
    return { success: true };
  } catch {
    return { success: false, error: 'Could not write to local storage' };
  }
}

export function getCampusReviews(): CampusReviewItem[] {
  try {
    const localRaw = localStorage.getItem('unipedia_local_reviews');
    const local = localRaw ? (JSON.parse(localRaw) as CampusReviewItem[]) : [];
    return [...local, ...INITIAL_CAMPUS_REVIEWS];
  } catch {
    return INITIAL_CAMPUS_REVIEWS;
  }
}

export function getQnAThreads(): QnAThreadItem[] {
  try {
    const localRaw = localStorage.getItem('unipedia_local_qna');
    const local = localRaw ? (JSON.parse(localRaw) as QnAThreadItem[]) : [];
    return [...local, ...INITIAL_QNA_THREADS];
  } catch {
    return INITIAL_QNA_THREADS;
  }
}

export function submitQnAQuestion(item: Record<string, any>): { success: boolean } {
  try {
    const key = 'unipedia_local_qna';
    const raw = localStorage.getItem(key) ?? '[]';
    const parsed = JSON.parse(raw) as QnAThreadItem[];
    const newItem = {
      id: `qna_${Date.now()}`,
      institution_code: item.institution_code || item.target_id || '',
      uni_code: item.uni_code || '',
      asked_by: item.author_role || 'A/L Student',
      question: item.question || '',
      answer: '',
      answered_by_role: '',
      verified_ambassador: false,
      created_at: new Date().toISOString(),
      ...item,
    } as QnAThreadItem;
    parsed.unshift(newItem);
    localStorage.setItem(key, JSON.stringify(parsed));
    return { success: true };
  } catch {
    return { success: false };
  }
}

export {
  SRI_LANKA_DISTRICTS,
  UGC_INSTITUTIONS,
  NON_STATE_IFSLS_PATHWAYS,
  PRIVATE_AND_ALTERNATIVE_PROGRAMS,
  type PrivateAndAlternativeProgram,
  type HigherEdTier,
  type EntryQualification,
  type FinancialAidType,
  CAREER_ATLAS,
  type CareerAtlasItem,
  ADMISSIONS_CALENDAR_EVENTS,
  getInstitutions,
  getActiveCourses,
  getSuspendedCourses,
  getSelectableOfferings,
  getDatasetSummaryCounts,
  migrateSavedPlan,
};
