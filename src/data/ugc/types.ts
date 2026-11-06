/**
 * Official Sri Lankan UGC 2025/2026 Dataset Types
 * Transcribed from UGC Student Handbook for Academic Year 2025/2026
 * (Historical Cutoffs based on Academic Year 2024/2025 - Section 9).
 */

export interface UgcInstitution {
  telephone_numbers?: string[];
  official_abbreviation?: string;
  institution_type?: string;
  postal_address?: string;
  ugc_admission_participating?: boolean;
  institution_id: string;
  code: string;
  official_name: string;
  type: 'university' | 'campus' | 'institute';
  parent_university: string | null;
  address_or_location: string;
  contact_general: string | null;
  website: string;
  verification_status: string;
  source_file: string;
  source_section: string;
  printed_page: string | null;
}

export interface UgcCourse {
  course_code: string | null;
  official_title: string;
  title_variants: Record<string, unknown>;
  admission_year: string;
  examination_year: string;
  status: 'active' | 'temporarily_suspended';
  suspension_reason: string | null;
  is_new_in_2025_2026: boolean;
  stream_section: string;
  stream_category: string;
  proposed_intake_2025_2026: number;
  proposed_intake_section_2: number;
  includes_additional_intake_note: string | null;
  uni_codes: string[];
  verification_status: string;
  source_file: string;
  source_section: string;
  source_line_start: number;
  source_line_end: number;
  printed_page: string | null;
}

export interface UgcOffering {
  record_type: 'selectable_unicode_offering' | 'additional_intake_aggregate';
  is_selectable_unicode_offering: boolean;
  uni_code: string | null;
  course_code: string;
  institution_id: string | null;
  institution_official_name: string;
  course_title_unicode_table: string;
  course_title_annex_b: string;
  admission_year: string;
  examination_year: string;
  proposed_intake: number;
  degree_programmes: string[] | null;
  duration: string | null;
  curriculum_credits: number | null;
  medium_of_instruction: string[] | null;
  location_or_faculty: string[] | null;
  specialization_streams: string[] | null;
  alternative_degree_pathways: string[] | null;
  conditional_honours_entry: string | null;
  course_level_shared_facts: {
    degree_programmes: string[] | null;
    duration: string | null;
    medium_of_instruction: string[] | null;
  };
  institution_specific_facts: {
    degree_programmes: string[] | null;
    duration: string | null;
    medium_of_instruction: string[] | null;
    location_or_faculty: string[] | null;
    specialization_streams: string[] | null;
  };
  fact_scope: {
    degree_programmes: string;
    duration: string;
    medium_of_instruction: string;
  };
  null_reasons: {
    degree_programmes: string | null;
    duration: string | null;
    medium_of_instruction: string | null;
  };
  institution_specific_footnote: string | null;
  special_provision_6_1_quotas: Record<string, unknown> | null;
  verification_status: string;
  source_file: string;
  source_section: string;
  source_table: string | null;
  source_line_start: number;
  source_line_end: number;
  printed_page: string | null;
}

export interface UgcEligibilityCondition {
  general_al_rule_ref: string;
  evaluation_readiness: 'machine_evaluable' | 'requires_manual_review';
  auto_decision_safe: boolean;
  manual_review_reasons: string[];
  machine_evaluable_conditions: {
    general_admission_rule_id: string;
    al_fixed_subject_rule: {
      operator: 'AND' | 'ANY_THREE_APPROVED_AL_SUBJECTS';
      required_subjects?: string[];
      minimum_grades_distribution?: string[];
      subject_minimum_grades?: Record<string, string>;
      third_subject_one_of?: string[];
    } | null;
    ol_minimum_grades: Record<string, string | null> | null;
    is_complete_for_auto_decision: boolean;
  };
  prose_only_conditions: string[];
  al_requirement_summary: string;
  aptitude_or_practical_test: {
    status: 'required' | 'not_stated';
    required_in_section_2: boolean;
    listed_in_section_5_table: boolean;
    uni_codes_in_section_5_table: string[];
  };
  effective_year: string;
  future_effective_year_changes: {
    effective_academic_year: string;
    verbatim_rule: string;
  }[];
  requires_manual_review: boolean;
}

export interface UgcEligibility {
  record_id: string;
  course_code: string | null;
  course_title: string | null;
  admission_year: string;
  examination_year: string;
  effective_year: string;
  stream_section: string;
  stream_category: string;
  evaluation_readiness: 'machine_evaluable' | 'requires_manual_review';
  auto_decision_safe: boolean;
  conditions: UgcEligibilityCondition;
  verbatim_section_2_text: string;
  requires_manual_review: boolean;
  verification_status: string;
  source_file: string;
  source_section: string;
  source_line_start: number;
  source_line_end: number;
  printed_page: string | null;
}

export interface UgcHistoricalDistrictCutoff {
  district_id: number;
  district_name: string;
  z_score: number | null;
  is_nqc: boolean;
  raw_value: string;
}

export interface UgcHistoricalCutoffColumn {
  column_id: string;
  admission_year: string;
  examination_year: string;
  raw_column_header: string;
  uni_code_2025_2026: string | null;
  course_code_2025_2026: string | null;
  institution_id: string | null;
  institution_name_in_header: string;
  course_title_in_header: string;
  stream_or_category_qualifier: string | null;
  all_island_merit_marker: boolean;
  practical_or_aptitude_marker: boolean;
  mapping_status: string;
  mapping_note: string | null;
  district_cutoffs: UgcHistoricalDistrictCutoff[];
}

export interface UgcHistoricalCutoffsDataset {
  dataset_title: string;
  admission_year: string;
  examination_basis: string;
  handbook_edition: string;
  legend: Record<string, string>;
  summary_counts: Record<string, number>;
  source_file: string;
  source_section: string;
  printed_page_range: string;
  columns: UgcHistoricalCutoffColumn[];
}

export interface CategorySplitOption {
  qualifier: string;
  z_score: number | null;
  is_nqc: boolean;
  raw_value: string;
}

export interface SourceReference {
  cutoff_source_url?: string;
  cutoff_publication_date?: string;
  handbook_edition: string;
  admission_year: string;
  historical_cutoff_year: string;
  source_file: string;
  source_section: string;
  source_table?: string | null;
  source_line_start?: number;
  source_line_end?: number;
  printed_page?: string | null;
  review_status: 'needs_review';
}

/**
 * Unified Program Row Model
 * Shared across Homepage, Finder, Detail Drawer, Profiles, Comparison, and Saved Plan.
 */
import type { SubjectRequirementsSpec } from '../../lib/ugcLogic';
export type { SubjectRequirementsSpec };

export interface ProgramCutoffViewRow {
  subject_requirements?: SubjectRequirementsSpec;
  ol_rule?: any;
  uni_code: string;
  course_code: string;
  course_name: string;
  stream: string;
  faculty: string;
  degree_awarded: string;
  degree_display: string;
  duration_years: number | null;
  duration_display: string;
  curriculum_credits: number | null;
  medium: ('E' | 'S' | 'T')[];
  medium_display: string;
  proposed_intake: number;
  aptitude_test_required: boolean;
  aptitude_status: 'required' | 'not_stated';
  all_island_merit_only: boolean;
  district_id: number;
  district_name: string;
  academic_year: '2025/2026';
  cutoff_year: '2024/2025' | '2025/2026';
  min_z_score: number | null;
  status: 'QUALIFIED' | 'NQC' | 'NO_HISTORICAL_CUTOFF';
  raw_z_score_text: string | null;
  all_island_min_z: number | null;
  all_island_max_z: number | null;
  category_split_options?: CategorySplitOption[];
  needs_category_clarification?: boolean;
  selected_category_qualifier?: string | null;
  requires_ol_special: boolean;
  is_suspended: boolean;
  suspension_reason: string | null;
  alternative_degree_pathways: string[] | null;
  conditional_honours_entry: string | null;
  auto_decision_safe: boolean;
  evaluation_readiness: 'machine_evaluable' | 'requires_manual_review';
  source_reference: SourceReference;
  eligibility_source_reference?: SourceReference;
  al_requirements_summary: string;
  overview: string;
  career_category: string;
  institution_code: string;
  institution_name: string;
  institution_type: string;
  institution_location: string;
  institution_website: string;
  specializations: string[];
  career_paths: string[];
  total_national_intake: number;
  differently_abled_quota: number | null;
  // Backward compatibility fields for existing UI components
  course_description?: string;
  ol_requirements_text?: string | null;
  ol_short_badge?: string | null;
  special_intake_quota_note?: string | null;
  aptitude_test_info?: string | null;
}

export interface SavedPreferenceEntry {
  uni_code: string;
  locked: boolean;
  migrationStatus?: 'valid' | 'ambiguous' | 'migrated' | 'unresolved';
  originalCode?: string;
  originalCourseName?: string;
  migrationNote?: string;
  suggestedUniCode?: string;
  migrationReviewedFor?: '2025/2026';
}

export interface MigratedPlanResult {
  migratedEntries: SavedPreferenceEntry[];
  hasModifications: boolean;
  flaggedCount: number;
}
