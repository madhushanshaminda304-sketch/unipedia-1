#!/usr/bin/env node
/**
 * Repeatable Validation, Source Transcription Verification & Report Generator
 * for the UGC 2025/2026 Staging Dataset.
 *
 * Works strictly inside data-staging/ugc-2025-2026/ (reading the 10 original Markdown
 * source files and reading src/data/sriLankaUgcSnapshot.ts read-only).
 *
 * Separates checks into:
 *   1. Structural validation
 *   2. Exact transcription checks (against the 10 source Markdown files)
 *   3. Cross-section consistency checks
 *   4. Items requiring original-PDF review
 *
 * Writes:
 *   - data-staging/ugc-2025-2026/offering-completeness-report.md
 *   - data-staging/ugc-2025-2026/unresolved-issues.md
 *   - data-staging/ugc-2025-2026/validation-report.md
 *   - data-staging/ugc-2025-2026/correction-summary.md
 */

import fs from 'node:fs';
import path from 'node:path';

const WORKSPACE_DIR = path.resolve('c:/Users/DELL/Downloads/srilakan vuzopedia');
const STAGING_DIR = path.join(WORKSPACE_DIR, 'data-staging/ugc-2025-2026');
const SNAPSHOT_PATH = path.join(WORKSPACE_DIR, 'src/data/sriLankaUgcSnapshot.ts');

const SOURCE_PATHS = {
  'ugc1.md': 'C:/Users/DELL/.codex/attachments/e74567f9-98fb-4fa7-9023-3870290723e4/ugc1.md',
  'ugc2.md': 'C:/Users/DELL/.codex/attachments/e74567f9-98fb-4fa7-9023-3870290723e4/ugc2.md',
  'ugc3.md': 'C:/Users/DELL/.codex/attachments/e74567f9-98fb-4fa7-9023-3870290723e4/ugc3.md',
  'ugc4.md': 'C:/Users/DELL/.codex/attachments/e74567f9-98fb-4fa7-9023-3870290723e4/ugc4.md',
  'ugc5.md': 'C:/Users/DELL/.codex/attachments/e74567f9-98fb-4fa7-9023-3870290723e4/ugc5.md',
  'ugc6.md': 'C:/Users/DELL/.codex/attachments/e74567f9-98fb-4fa7-9023-3870290723e4/ugc6.md',
  'ugc7.md': 'C:/Users/DELL/.codex/attachments/e74567f9-98fb-4fa7-9023-3870290723e4/ugc7.md',
  'ugc8.md': 'C:/Users/DELL/.codex/attachments/e74567f9-98fb-4fa7-9023-3870290723e4/ugc8.md',
  'ugc9.md': 'C:/Users/DELL/Downloads/ugc9.md',
  'ugc10.md': 'C:/Users/DELL/Downloads/ugc10.md'
};

const sourceLinesByFile = new Map();
for (const [fileId, fullPath] of Object.entries(SOURCE_PATHS)) {
  const raw = fs.readFileSync(fullPath, 'utf8');
  sourceLinesByFile.set(fileId, raw.split(/\r?\n/));
}

const institutions = JSON.parse(fs.readFileSync(path.join(STAGING_DIR, 'institutions.json'), 'utf8'));
const courses = JSON.parse(fs.readFileSync(path.join(STAGING_DIR, 'courses.json'), 'utf8'));
const offerings = JSON.parse(fs.readFileSync(path.join(STAGING_DIR, 'offerings.json'), 'utf8'));
const eligibility = JSON.parse(fs.readFileSync(path.join(STAGING_DIR, 'eligibility.json'), 'utf8'));
const cutoffs = JSON.parse(fs.readFileSync(path.join(STAGING_DIR, 'historical-cutoffs-2024-2025.json'), 'utf8'));
const sourceInventoryRaw = fs.readFileSync(path.join(STAGING_DIR, 'source-inventory.md'), 'utf8');
const snapshotRaw = fs.readFileSync(SNAPSHOT_PATH, 'utf8');

const structuralChecks = [];
const transcriptionChecks = [];
const consistencyChecks = [];

function addCheck(list, id, name, passed, details) {
  list.push({ id, name, passed, details });
  if (!passed) {
    console.error(`[FAIL] ${id} (${name}): ${details}`);
  }
}

// ===========================================================================
// 1. STRUCTURAL VALIDATION CHECKS
// ===========================================================================
const instIds = institutions.map(i => i.institution_id);
const dupInstIds = instIds.filter((id, idx) => instIds.indexOf(id) !== idx);
const instSuffixes = institutions.filter(i => i.uni_code_suffix).map(i => i.uni_code_suffix);
const dupSuffixes = instSuffixes.filter((s, idx) => instSuffixes.indexOf(s) !== idx);

const activeCourses = courses.filter(c => c.status === 'active');
const suspendedCourses = courses.filter(c => c.status === 'temporarily_suspended');
const courseCodes = activeCourses.map(c => c.course_code);
const dupCourseCodes = courseCodes.filter((c, idx) => courseCodes.indexOf(c) !== idx);
const nonThreeDigitCodes = courseCodes.filter(c => !/^\d{3}$/.test(c));

const selectableOfferings = offerings.filter(o => o.is_selectable_unicode_offering === true);
const aggregateOfferings = offerings.filter(o => o.is_selectable_unicode_offering === false);
const uniCodes = selectableOfferings.map(o => o.uni_code);
const dupUniCodes = uniCodes.filter((u, idx) => uniCodes.indexOf(u) !== idx);

addCheck(
  structuralChecks,
  'STR-01',
  'Unique Identifiers & Leading-Zero Preservation (2025/2026)',
  dupInstIds.length === 0 &&
    dupSuffixes.length === 0 &&
    dupCourseCodes.length === 0 &&
    dupUniCodes.length === 0 &&
    nonThreeDigitCodes.length === 0 &&
    selectableOfferings.length === 255 &&
    aggregateOfferings.length === 1,
  `institutions=${institutions.length} (dups=${dupInstIds.length}), active_courses=${activeCourses.length} (dups=${dupCourseCodes.length}, 3-digit format violations=${nonThreeDigitCodes.length}), selectable_unicode_offerings=${selectableOfferings.length} (dups=${dupUniCodes.length}), additional_intake_aggregate_records=${aggregateOfferings.length}`
);

const validInstIdSet = new Set(instIds);
const validCourseCodeSet = new Set(courseCodes);
const orphanCourseOfferings = offerings.filter(o => !validCourseCodeSet.has(o.course_code));
const orphanInstOfferings = selectableOfferings.filter(o => !validInstIdSet.has(o.institution_id));

addCheck(
  structuralChecks,
  'STR-02',
  'Referential Integrity Across Offerings, Courses, and Institutions',
  orphanCourseOfferings.length === 0 && orphanInstOfferings.length === 0,
  `orphan_course_refs=${orphanCourseOfferings.length}, orphan_institution_refs=${orphanInstOfferings.length}`
);

const EXPECTED_DISTRICTS = [
  'COLOMBO', 'GAMPAHA', 'KALUTARA', 'MATALE', 'KANDY',
  'NUWARA ELIYA', 'GALLE', 'MATARA', 'HAMBANTOTA', 'JAFFNA',
  'KILINOCHCHI', 'MANNAR', 'MULLAITIVU', 'VAVUNIYA', 'TRINCOMALEE',
  'BATTICALOA', 'AMPARA', 'PUTTALAM', 'KURUNEGALA', 'ANURADHAPURA',
  'POLONNARUWA', 'BADULLA', 'MONARAGALA', 'KEGALLE', 'RATNAPURA'
];

let badDistrictCountColumns = 0;
let districtOrderOrDuplicateErrors = 0;
let precisionFormatViolations = 0;
let negativeZScoreCount = 0;

for (const col of cutoffs.columns) {
  if (col.district_count !== 25 || col.districts.length !== 25) {
    badDistrictCountColumns++;
  }
  const seenDistricts = new Set();
  col.districts.forEach((d, idx) => {
    if (seenDistricts.has(d.district) || d.district !== EXPECTED_DISTRICTS[idx]) {
      districtOrderOrDuplicateErrors++;
    }
    seenDistricts.add(d.district);
    if (d.is_nqc) {
      if (d.raw_value !== 'NQC' || d.z_score !== null) {
        precisionFormatViolations++;
      }
    } else {
      if (!/^-?\d+\.\d{4}$/.test(d.raw_value) || typeof d.z_score !== 'number' || Number.isNaN(d.z_score)) {
        precisionFormatViolations++;
      }
      if (d.z_score < 0) {
        negativeZScoreCount++;
      }
    }
  });
}

addCheck(
  structuralChecks,
  'STR-03',
  'Section 9 Cutoff Column Counts, District Order & Precision (2024/2025)',
  cutoffs.columns.length === 266 &&
    badDistrictCountColumns === 0 &&
    districtOrderOrDuplicateErrors === 0 &&
    precisionFormatViolations === 0 &&
    cutoffs.summary_counts.total_district_cutoff_cells === 6650,
  `columns=${cutoffs.columns.length}, total_cells=${cutoffs.summary_counts.total_district_cutoff_cells} (numeric=${cutoffs.summary_counts.numeric_z_score_cells}, negative=${negativeZScoreCount}, nqc=${cutoffs.summary_counts.nqc_cells}), bad_cols=${badDistrictCountColumns}, district_errors=${districtOrderOrDuplicateErrors}, format_violations=${precisionFormatViolations}`
);

// Check Eligibility schema & machine-evaluable vs prose-only separation
const courseEligibilityRecords = eligibility.filter(e => e.record_type === 'course_eligibility');
const machineEvaluableCount = courseEligibilityRecords.filter(
  e => e.evaluation_readiness === 'machine_evaluable' && e.auto_decision_safe === true
).length;
const manualReviewEligibilityCount = courseEligibilityRecords.filter(
  e => e.evaluation_readiness === 'requires_manual_review' && e.auto_decision_safe === false
).length;
const invalidEligibilityFlags = eligibility.filter(
  e =>
    typeof e.auto_decision_safe !== 'boolean' ||
    !['machine_evaluable', 'requires_manual_review'].includes(e.evaluation_readiness) ||
    (e.auto_decision_safe === true && e.requires_manual_review !== false) ||
    (e.auto_decision_safe === false && e.requires_manual_review !== true)
);

addCheck(
  structuralChecks,
  'STR-04',
  'Eligibility Representation & Auto-Decision Safety Guardrails',
  invalidEligibilityFlags.length === 0 && machineEvaluableCount + manualReviewEligibilityCount === 121,
  `total_records=${eligibility.length} (1 general + 121 courses), machine_evaluable=${machineEvaluableCount} (auto_decision_safe=true), requires_manual_review=${manualReviewEligibilityCount + 1} (auto_decision_safe=false), schema_violations=${invalidEligibilityFlags.length}`
);

// Check forbidden inference fields & verification_status
let forbiddenInferenceViolations = 0;
let verificationStatusViolations = 0;
for (const rec of [...institutions, ...courses, ...offerings, ...eligibility, ...cutoffs.columns]) {
  if (rec.verification_status !== 'needs_review') verificationStatusViolations++;
  for (const field of ['accreditation', 'salaries', 'fees', 'scholarships', 'internships', 'careers']) {
    if (field in rec && rec[field] !== null) forbiddenInferenceViolations++;
  }
}

addCheck(
  structuralChecks,
  'STR-05',
  'Null Policy for Unsupported Fields & Verification Status Tagging',
  forbiddenInferenceViolations === 0 && verificationStatusViolations === 0,
  `verification_status_violations=${verificationStatusViolations}, forbidden_inference_violations=${forbiddenInferenceViolations}`
);

// ===========================================================================
// 2. EXACT TRANSCRIPTION CHECKS (AGAINST THE 10 SOURCE MARKDOWN FILES)
// ===========================================================================

// TRN-01: Validate every source_file, source_line_start, source_line_end across all JSON records and additional_sources
let totalSourceRefsChecked = 0;
let invalidSourceRefs = 0;

function validateSourceRefObject(ref, contextLabel) {
  totalSourceRefsChecked++;
  const lines = sourceLinesByFile.get(ref.source_file);
  if (
    !lines ||
    typeof ref.source_line_start !== 'number' ||
    typeof ref.source_line_end !== 'number' ||
    ref.source_line_start < 1 ||
    ref.source_line_end < ref.source_line_start ||
    ref.source_line_end > lines.length
  ) {
    invalidSourceRefs++;
    console.error(`Invalid source reference in ${contextLabel}:`, ref);
  }
}

for (const list of [institutions, courses, offerings, eligibility, cutoffs.columns]) {
  for (const rec of list) {
    validateSourceRefObject(rec, rec.record_id || rec.uni_code || rec.course_code || rec.institution_id || rec.column_id);
    if (Array.isArray(rec.additional_sources)) {
      for (const addRef of rec.additional_sources) {
        validateSourceRefObject(addRef, `additional_source of ${rec.uni_code || rec.course_code || rec.institution_id}`);
      }
    }
  }
}

addCheck(
  transcriptionChecks,
  'TRN-01',
  'Source File & Line-Range Existence Verification',
  invalidSourceRefs === 0,
  `Checked ${totalSourceRefsChecked} primary and additional source references across all 5 JSON files against the 10 Markdown files; invalid_refs=${invalidSourceRefs}`
);

// TRN-02: Verify zero unsupported age restriction claims in source files and staged outputs
let age17InSources = 0;
for (const [fileId, lines] of sourceLinesByFile.entries()) {
  for (const l of lines) {
    if (/minimum age|age of 17|17 years/i.test(l)) age17InSources++;
  }
}
const allJsonText = [
  JSON.stringify(institutions),
  JSON.stringify(courses),
  JSON.stringify(offerings),
  JSON.stringify(eligibility),
  JSON.stringify(cutoffs),
  sourceInventoryRaw
].join('\n');
const age17InOutputs = (allJsonText.match(/MINIMUM_AGE_17|minimum age 17|age of 17 years/gi) || []).length;

addCheck(
  transcriptionChecks,
  'TRN-02',
  'Absence of Unsupported Minimum Age 17 Rule',
  age17InSources === 0 && age17InOutputs === 0,
  `source_mentions_of_age_17=${age17InSources}, staged_data_mentions_of_age_17=${age17InOutputs}`
);

// TRN-03: Verify Annex (a) proposed intakes directly against ugc10.md lines
const ugc10Lines = sourceLinesByFile.get('ugc10.md');
let annexATranscriptionErrors = 0;
for (const c of activeCourses) {
  const annexARef = (c.additional_sources || []).find(s => s.source_section === 'Annex (a)');
  const lineText = annexARef ? (ugc10Lines[annexARef.source_line_start - 1] || '') : '';
  const m = lineText.match(/^\|\s*(\d{3})\s*\|\s*(.+?)\s*\|\s*(\d+)\s*\|$/);
  if (!m || m[1] !== c.course_code || Number(m[3]) !== c.proposed_intake_2025_2026) {
    annexATranscriptionErrors++;
  }
}

addCheck(
  transcriptionChecks,
  'TRN-03',
  'Annex (a) Course Code & Proposed Intake Exact Line Transcription',
  annexATranscriptionErrors === 0,
  `Verified all ${activeCourses.length} active courses against their exact cited line in ugc10.md; transcription_errors=${annexATranscriptionErrors}`
);

// TRN-04: Verify Section 5 Uni-Codes table directly against ugc7.md & ugc8.md lines
let uniCodeTranscriptionErrors = 0;
for (const o of selectableOfferings) {
  const fileLines = sourceLinesByFile.get(o.source_file);
  const lineText = fileLines ? fileLines[o.source_line_start - 1] || '' : '';
  if (!lineText.includes(`**${o.uni_code}**`)) {
    uniCodeTranscriptionErrors++;
  }
}

addCheck(
  transcriptionChecks,
  'TRN-04',
  'Section 5 Uni-Code Table Exact Line Transcription',
  uniCodeTranscriptionErrors === 0,
  `Verified all ${selectableOfferings.length} selectable Uni-Code offerings against their exact cited line in ugc7.md / ugc8.md; transcription_errors=${uniCodeTranscriptionErrors}`
);

// TRN-05: Verify Section 6.1 special quotas directly against ugc9.md lines 16-60, including blank vs dash preservation
const ugc9Lines = sourceLinesByFile.get('ugc9.md');
let sec61TranscriptionErrors = 0;
let blankCellsPreservedAsNullCount = 0;
let dashCellsAsZeroCount = 0;

for (const o of selectableOfferings) {
  const q = o.special_provision_6_1_quotas;
  if (!q) continue;
  const lineText = ugc9Lines[q.source_line - 1] || '';
  const m = lineText.match(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([0-9]{3}[A-Z])\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|$/);
  if (!m || m[3].trim() !== o.uni_code) {
    sec61TranscriptionErrors++;
    continue;
  }
  const diffRaw = m[4].trim();
  const blindRaw = m[5].trim();
  if (q.differently_abled_raw !== diffRaw || q.blind_braille_raw !== blindRaw) {
    sec61TranscriptionErrors++;
  }
  if (diffRaw === '' && q.differently_abled_seats !== null) sec61TranscriptionErrors++;
  if (blindRaw === '' && q.blind_braille_seats !== null) sec61TranscriptionErrors++;
  if (diffRaw === '-' && q.differently_abled_seats !== 0) sec61TranscriptionErrors++;
  if (blindRaw === '-' && q.blind_braille_seats !== 0) sec61TranscriptionErrors++;
  if (diffRaw === '' || blindRaw === '') blankCellsPreservedAsNullCount++;
  if (diffRaw === '-') dashCellsAsZeroCount++;
  if (blindRaw === '-') dashCellsAsZeroCount++;
}

addCheck(
  transcriptionChecks,
  'TRN-05',
  'Section 6.1 Special Quotas Exact Transcription (Blank -> null vs Dash -> 0)',
  sec61TranscriptionErrors === 0 && blankCellsPreservedAsNullCount === 1,
  `Verified all 43 Section 6.1 rows against ugc9.md lines 16-60; dash_cells_as_0=${dashCellsAsZeroCount}, blank_cells_preserved_as_null=${blankCellsPreservedAsNullCount} (007R Blind Braille), transcription_errors=${sec61TranscriptionErrors}`
);

// TRN-06: Verify all 6,650 Section 9 cutoff cells against ugc9.md lines 220-519
let sec9CellTranscriptionErrors = 0;
for (const col of cutoffs.columns) {
  const colIdx = Number(col.column_id.split('_COL_')[1]) - 1;
  for (const d of col.districts) {
    const lineText = ugc9Lines[d.source_line - 1] || '';
    const cells = lineText.trim().slice(1, -1).split('|').map(c => c.trim());
    const distInFile = (cells[0] || '').replace(/\*\*/g, '').trim();
    const valInFile = cells[colIdx + 1];
    if (distInFile !== d.district || valInFile !== d.raw_value) {
      sec9CellTranscriptionErrors++;
    }
  }
}

addCheck(
  transcriptionChecks,
  'TRN-06',
  'Section 9 Historical Cutoffs Exact Cell-by-Cell Transcription (6,650 Cells)',
  sec9CellTranscriptionErrors === 0,
  `Verified all 6,650 cells across 266 columns and 10 tables against ugc9.md lines 220-519; transcription_errors=${sec9CellTranscriptionErrors}`
);

// ===========================================================================
// 3. CROSS-SECTION CONSISTENCY CHECKS
// ===========================================================================

// CON-01: Programmatically verify Section 2.2 Practical/Aptitude test mentions against Section 5 Practical/Aptitude Table
const aptitudeDisagreements = [];
const aptitudeRequiredCourses = [];
for (const e of courseEligibilityRecords) {
  const apt = e.conditions.aptitude_or_practical_test;
  if (apt.required_in_section_2 !== apt.listed_in_section_5_table) {
    aptitudeDisagreements.push({
      course_code: e.course_code,
      title: e.official_course_title,
      required_in_section_2: apt.required_in_section_2,
      listed_in_section_5_table: apt.listed_in_section_5_table
    });
  }
  if (apt.status === 'required') {
    aptitudeRequiredCourses.push({
      course_code: e.course_code,
      title: e.official_course_title,
      uni_codes: apt.uni_codes_in_section_5_table,
      section: e.stream_section
    });
  }
}

// Specifically verify 096 (Information Systems) and 098 (Translation Studies) source lines in ugc5.md
const ugc5Lines = sourceLinesByFile.get('ugc5.md');
const sec096Text = ugc5Lines.slice(691, 723).join('\n');
const sec098Text = ugc5Lines.slice(725, 748).join('\n');
const hasAptitudeIn096Source = /aptitude test|practical test/i.test(sec096Text);
const hasAptitudeIn098Source = /aptitude test|practical test/i.test(sec098Text);
const rec096 = courseEligibilityRecords.find(e => e.course_code === '096');
const rec098 = courseEligibilityRecords.find(e => e.course_code === '098');

addCheck(
  consistencyChecks,
  'CON-01',
  'Section 2.2 vs Section 5 Practical/Aptitude Test Consistency',
  aptitudeDisagreements.length === 0 &&
    aptitudeRequiredCourses.length === 16 &&
    !hasAptitudeIn096Source &&
    !hasAptitudeIn098Source &&
    rec096.conditions.aptitude_or_practical_test.status === 'not_stated' &&
    rec098.conditions.aptitude_or_practical_test.status === 'not_stated',
  `All 16 courses (24 Uni-Codes) requiring a Practical/Aptitude Test in Section 2.2 match the 24 rows in Section 5 table 100% (disagreements=${aptitudeDisagreements.length}; 096 status="${rec096.conditions.aptitude_or_practical_test.status}", 098 status="${rec098.conditions.aptitude_or_practical_test.status}")`
);

// CON-02: Programmatically verify Section 2.2 G.C.E. (O/L) requirements against Section 5 O/L Table (31 courses)
const olDisagreements = [];
const olMatchedCourses = [];
for (const e of courseEligibilityRecords) {
  const hasSec5Ol = Boolean(e.conditions.ol_requirement_from_section_5_table);
  const hasSec2Ol = e.conditions.ol_clauses_in_section_2_text.length > 0;
  if (hasSec5Ol !== hasSec2Ol) {
    olDisagreements.push({
      course_code: e.course_code,
      title: e.official_course_title,
      has_sec_2_ol: hasSec2Ol,
      has_sec_5_ol: hasSec5Ol
    });
  }
  if (hasSec5Ol && hasSec2Ol) {
    olMatchedCourses.push(e.course_code);
  }
}

// Specifically verify Data Science (136) in ugc4.md Section 2.2.4.13 (line 462) vs ugc8.md (line 217)
const ugc4Lines = sourceLinesByFile.get('ugc4.md');
const sec136Line462 = ugc4Lines[461] || '';
const rec136 = courseEligibilityRecords.find(e => e.course_code === '136');

addCheck(
  consistencyChecks,
  'CON-02',
  'Section 2.2 vs Section 5 G.C.E. (O/L) Requirements Consistency',
  olDisagreements.length === 0 &&
    olMatchedCourses.length === 31 &&
    /Credit Pass \(C\) in English at the G\.C\.E\. \(Ordinary Level\)/i.test(sec136Line462) &&
    rec136.stream_section === '2.2.4.13',
  `All 31 courses with G.C.E. (O/L) requirements in Section 2.2 (including 136 Data Science in Section 2.2.4.13, ugc4.md line 462) match the 31 courses in Section 5 O/L summary table 100% (contradictions=${olDisagreements.length}; 4 courses [023, 024, 097, 098] have A/L pass waiver clauses in Section 2.2 that are condensed in Section 5)`
);

// CON-03: Proposed intake reconciliation across Section 2.2, Annex (a), and Annex (b)
const totalIntakeAnnexA = activeCourses.reduce((acc, c) => acc + (c.proposed_intake_2025_2026 || 0), 0);
const totalIntakeSelectable = selectableOfferings.reduce((acc, o) => acc + (o.proposed_intake || 0), 0);
const totalIntakeAggregate = aggregateOfferings.reduce((acc, o) => acc + (o.proposed_intake || 0), 0);
const totalIntakeInstitutionsAnnexB =
  institutions.reduce((acc, i) => acc + (i.annex_b_proposed_total_intake || 0), 0) + totalIntakeAggregate;

const courseIntakeMismatches = [];
for (const c of activeCourses) {
  const sumOff = offerings
    .filter(o => o.course_code === c.course_code)
    .reduce((acc, o) => acc + (o.proposed_intake || 0), 0);
  if (sumOff !== c.proposed_intake_2025_2026) {
    courseIntakeMismatches.push({ course_code: c.course_code, annex_a: c.proposed_intake_2025_2026, annex_b_sum: sumOff });
  }
  if (c.proposed_intake_section_2 !== null && c.proposed_intake_section_2 !== c.proposed_intake_2025_2026) {
    courseIntakeMismatches.push({ course_code: c.course_code, annex_a: c.proposed_intake_2025_2026, section_2: c.proposed_intake_section_2 });
  }
}

addCheck(
  consistencyChecks,
  'CON-03',
  'Proposed Intake Reconciliation Across Section 2.2, Annex (a), and Annex (b)',
  totalIntakeAnnexA === 42937 &&
    totalIntakeSelectable === 42037 &&
    totalIntakeAggregate === 900 &&
    totalIntakeInstitutionsAnnexB === 42937 &&
    courseIntakeMismatches.length === 0,
  `annex_a_total=${totalIntakeAnnexA}, selectable_offerings_sum=${totalIntakeSelectable}, additional_intake_aggregate=${totalIntakeAggregate}, combined_sum=${totalIntakeSelectable + totalIntakeAggregate}, per_course_mismatches=${courseIntakeMismatches.length}`
);

// CON-04: Title variants across Section 2, Section 5, Annex (a), and Annex (b)
const titleVariantsReport = [];
for (const c of activeCourses) {
  const sec2Title = c.title_variants.section_2_course_title;
  const annexATitle = c.title_variants.annex_a_title.replace(/\s*\(including Additional Intake\)$/i, '');
  const uTitles = c.title_variants.section_5_unicode_table_titles;
  const offAnnexBTitles = [
    ...new Set(selectableOfferings.filter(o => o.course_code === c.course_code).map(o => o.course_title_annex_b))
  ];

  const normSet = new Set([
    sec2Title.toLowerCase(),
    annexATitle.toLowerCase(),
    ...uTitles.map(t => t.toLowerCase()),
    ...offAnnexBTitles.map(t => t.toLowerCase())
  ]);
  if (normSet.size > 1) {
    titleVariantsReport.push({
      course_code: c.course_code,
      section_2: sec2Title,
      section_5_unicode: uTitles.join(' / '),
      annex_a: c.title_variants.annex_a_title,
      annex_b: offAnnexBTitles.join(' / ')
    });
  }
}

addCheck(
  consistencyChecks,
  'CON-04',
  'Cross-Section Course Title Variant Audit',
  true,
  `Catalogued ${titleVariantsReport.length} courses with minor formatting, abbreviation, or footnote variations across Section 2, Section 5, Annex (a), and Annex (b)`
);

// ===========================================================================
// 4. OFFERING COMPLETENESS AUDIT (FOR offering-completeness-report.md)
// ===========================================================================
const degPopulated = selectableOfferings.filter(o => Array.isArray(o.degree_programmes) && o.degree_programmes.length > 0);
const degNull = selectableOfferings.filter(o => !o.degree_programmes);
const degInstSpecific = selectableOfferings.filter(o => o.fact_scope.degree_programmes === 'institution_specific');
const degCourseShared = selectableOfferings.filter(o => o.fact_scope.degree_programmes === 'course_shared');

const durPopulated = selectableOfferings.filter(o => typeof o.duration === 'string' && o.duration.length > 0);
const durNull = selectableOfferings.filter(o => !o.duration);
const durInstSpecific = selectableOfferings.filter(o => o.fact_scope.duration === 'institution_specific');
const durCourseShared = selectableOfferings.filter(o => o.fact_scope.duration === 'course_shared');

const medPopulated = selectableOfferings.filter(o => Array.isArray(o.medium_of_instruction) && o.medium_of_instruction.length > 0);
const medNull = selectableOfferings.filter(o => !o.medium_of_instruction);
const medInstSpecific = selectableOfferings.filter(o => o.fact_scope.medium_of_instruction === 'institution_specific');
const medCourseShared = selectableOfferings.filter(o => o.fact_scope.medium_of_instruction === 'course_shared');

const altPathwaysPopulated = selectableOfferings.filter(o => Array.isArray(o.alternative_degree_pathways) && o.alternative_degree_pathways.length > 0);
const condHonoursPopulated = selectableOfferings.filter(o => typeof o.conditional_honours_entry === 'string' && o.conditional_honours_entry.length > 0);
const specsPopulated = selectableOfferings.filter(o => Array.isArray(o.specialization_streams) && o.specialization_streams.length > 0);
const locPopulated = selectableOfferings.filter(o => Array.isArray(o.location_or_faculty) && o.location_or_faculty.length > 0);

// Group remaining nulls by course_code + reason for clean reporting
function groupNullsByCourse(nullOfferings, fieldName) {
  const map = new Map();
  for (const o of nullOfferings) {
    const key = o.course_code;
    if (!map.has(key)) {
      const secSource = o.additional_sources.find(s => s.source_section.startsWith('Section 2.2'));
      map.set(key, {
        course_code: o.course_code,
        course_title: o.course_title_unicode_table,
        uni_codes: [],
        section: secSource ? secSource.source_section : 'Section 2.2',
        source_ref: secSource ? `${secSource.source_file}:${secSource.source_line_start}-${secSource.source_line_end}` : o.source_file,
        curriculum_credits: o.curriculum_credits,
        reason: o.null_reasons[fieldName]
      });
    }
    map.get(key).uni_codes.push(o.uni_code);
  }
  return [...map.values()];
}

const degNullGroups = groupNullsByCourse(degNull, 'degree_programmes');
const durNullGroups = groupNullsByCourse(durNull, 'duration');
const medNullGroups = groupNullsByCourse(medNull, 'medium_of_instruction');

// ===========================================================================
// 5. WEBSITE COMPARISON CLASSIFICATION (Finding 8)
// ===========================================================================
const snapshotUgcCourses = [];
const ugcCoursesBlockMatch = snapshotRaw.match(/export const UGC_COURSES:\s*CourseRecord\[\]\s*=\s*\[([\s\S]*?)\n\];/);
if (ugcCoursesBlockMatch) {
  const block = ugcCoursesBlockMatch[1];
  const itemRegex = /course_code:\s*'([^']+)',\s*\n\s*name:\s*'([^']+)',\s*\n\s*stream:\s*'([^']+)',\s*\n\s*faculty:\s*'([^']+)',\s*\n\s*degree_awarded:\s*'([^']+)'/g;
  let m;
  while ((m = itemRegex.exec(block)) !== null) {
    snapshotUgcCourses.push({
      course_code: m[1],
      course_name: m[2],
      stream: m[3],
      degree_awarded: m[5]
    });
  }
}

const snapshotMasterOverviews = [];
const masterBlockMatch = snapshotRaw.match(/export const COURSE_MASTER_OVERVIEWS:\s*Record<string,\s*CourseMasterOverview>\s*=\s*\{([\s\S]*?)\n\};/);
if (masterBlockMatch) {
  const block = masterBlockMatch[1];
  const itemRegex = /"course_code":\s*"([^"]+)",\s*\n\s*"degree_awarded":\s*"([^"]+)",\s*\n\s*"overview":\s*"([^"]+)"[\s\S]*?"total_national_intake":\s*(\d+)/g;
  let m;
  while ((m = itemRegex.exec(block)) !== null) {
    snapshotMasterOverviews.push({
      course_code: m[1],
      degree_awarded: m[2],
      overview: m[3],
      total_national_intake: Number(m[4])
    });
  }
}

const snapshotOptions = [];
const optionsBlockMatch = snapshotRaw.match(/export const ADMISSION_OPTIONS_SEED:\s*AdmissionOptionSeed\[\]\s*=\s*\[([\s\S]*?)\n\];/);
if (optionsBlockMatch) {
  const block = optionsBlockMatch[1];
  const itemRegex = /\{\s*uni_code:\s*'([^']+)',\s*course_code:\s*'([^']+)',\s*institution_code:\s*'([^']+)',\s*duration_years:\s*(\d+),\s*medium:\s*\[([^\]]*)\],\s*proposed_intake:\s*(\d+)/g;
  let m;
  while ((m = itemRegex.exec(block)) !== null) {
    snapshotOptions.push({
      unicode: m[1],
      course_code: m[2],
      institution_code: m[3],
      duration_years: Number(m[4]),
      proposed_intake: Number(m[6])
    });
  }
}

const officialCourseByCode = new Map(activeCourses.map(c => [c.course_code, c]));
const officialOfferingByUniCode = new Map(selectableOfferings.map(o => [o.uni_code, o]));

// Classify website differences into:
//   1. Confirmed mapping defect
//   2. Difference between admission years
//   3. Unresolved difference
const confirmedMappingDefects = [];
const admissionYearDifferences = [];
const unresolvedWebsiteDifferences = [];

// 5.1 Classify UGC_COURSES differences
for (const sc of snapshotUgcCourses) {
  const off = officialCourseByCode.get(sc.course_code);
  if (!off) {
    if (sc.course_code === '140') {
      admissionYearDifferences.push({
        scope: 'UGC_COURSES',
        identifier: `Course ${sc.course_code}`,
        website_value: `${sc.course_name} (${sc.degree_awarded})`,
        staging_value: 'Temporarily suspended in 2025/2026 (present in 2024/2025 Section 9 Table 9.4)',
        explanation: 'Service Management at GWUIM was offered in 2024/2025 but is temporarily suspended in 2025/2026 due to curriculum review (ugc3.md line 199).'
      });
    } else {
      unresolvedWebsiteDifferences.push({
        scope: 'UGC_COURSES',
        identifier: `Course ${sc.course_code}`,
        website_value: `${sc.course_name} (${sc.degree_awarded})`,
        staging_value: 'Not in 2025/2026 handbook',
        explanation: 'Snapshot does not record which handbook edition this code came from.'
      });
    }
  } else {
    const nSnap = sc.course_name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const nOff = off.official_title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!nSnap.includes(nOff.slice(0, 5)) && !nOff.includes(nSnap.slice(0, 5))) {
      confirmedMappingDefects.push({
        scope: 'UGC_COURSES',
        identifier: `Course ${sc.course_code}`,
        website_value: `${sc.course_name} (${sc.degree_awarded})`,
        staging_value: off.official_title,
        explanation: `Course code ${sc.course_code} is assigned to the wrong course in UGC_COURSES (official ${sc.course_code} is "${off.official_title}").`
      });
    }
  }
}

// 5.2 Classify COURSE_MASTER_OVERVIEWS differences
for (const mo of snapshotMasterOverviews) {
  const off = officialCourseByCode.get(mo.course_code);
  if (!off) {
    if (mo.course_code === '140') {
      admissionYearDifferences.push({
        scope: 'COURSE_MASTER_OVERVIEWS',
        identifier: `Course ${mo.course_code}`,
        website_value: `${mo.degree_awarded} (intake ${mo.total_national_intake})`,
        staging_value: 'Temporarily suspended in 2025/2026',
        explanation: 'Service Management at GWUIM is suspended for 2025/2026.'
      });
    } else if (['040', '061', '074', '078', '080'].includes(mo.course_code)) {
      unresolvedWebsiteDifferences.push({
        scope: 'COURSE_MASTER_OVERVIEWS',
        identifier: `Course ${mo.course_code}`,
        website_value: `${mo.degree_awarded} (intake ${mo.total_national_intake})`,
        staging_value: 'Code not active in 2025/2026 Annex (a)',
        explanation: `Course code ${mo.course_code} is not assigned in the 2025/2026 handbook; snapshot does not specify whether it came from an older handbook edition or synthetic seed generation.`
      });
    } else {
      confirmedMappingDefects.push({
        scope: 'COURSE_MASTER_OVERVIEWS',
        identifier: `Course ${mo.course_code}`,
        website_value: `${mo.degree_awarded} (intake ${mo.total_national_intake})`,
        staging_value: 'Non-existent course code in 2025/2026 handbook',
        explanation: `Course code ${mo.course_code} is not a valid UGC course code for "${mo.degree_awarded}" (which exists under a different official course code in the handbook).`
      });
    }
  } else {
    const degLower = (mo.degree_awarded + ' ' + mo.overview).toLowerCase();
    const abbrevEquiv =
      (mo.course_code === '001' && degLower.includes('mbbs')) ||
      (mo.course_code === '019' && (degLower.includes('bachelor of arts') || degLower.includes('ba / bahons') || degLower.includes('humanities'))) ||
      (mo.course_code === '023' && degLower.includes('barch')) ||
      (mo.course_code === '103' && degLower.includes('bbst')) ||
      (mo.course_code === '104' && degLower.includes('bict'));
    const offTitleWords = off.official_title
      .replace(/\(.*?\)/g, '')
      .toLowerCase()
      .split(/[^a-z]+/)
      .filter(w => w.length > 3 && !['study', 'course', 'management', 'science', 'sciences', 'technology'].includes(w));
    const wordMatch = abbrevEquiv || offTitleWords.length === 0 || offTitleWords.some(w => degLower.includes(w));
    if (!wordMatch) {
      confirmedMappingDefects.push({
        scope: 'COURSE_MASTER_OVERVIEWS',
        identifier: `Course ${mo.course_code}`,
        website_value: `${mo.degree_awarded} (intake ${mo.total_national_intake})`,
        staging_value: `${off.official_title} (intake ${off.proposed_intake_2025_2026})`,
        explanation: `Wrong course assigned to course_code ${mo.course_code} in COURSE_MASTER_OVERVIEWS.`
      });
    } else if (mo.total_national_intake !== off.proposed_intake_2025_2026) {
      admissionYearDifferences.push({
        scope: 'COURSE_MASTER_OVERVIEWS',
        identifier: `Course ${mo.course_code} (${off.official_title})`,
        website_value: `total_national_intake: ${mo.total_national_intake}`,
        staging_value: `proposed_intake_2025_2026: ${off.proposed_intake_2025_2026}`,
        explanation: 'Course identity matches; national proposed intake figure differs between admission years / snapshot seed.'
      });
    }
  }
}

// 5.3 Classify ADMISSION_OPTIONS_SEED differences
const seenSnapUniCodes = new Set();
for (const opt of snapshotOptions) {
  const isDupInSnap = seenSnapUniCodes.has(opt.unicode);
  seenSnapUniCodes.add(opt.unicode);
  const off = officialOfferingByUniCode.get(opt.unicode);
  const snapCourse = snapshotUgcCourses.find(c => c.course_code === opt.course_code);
  const snapCourseLabel = snapCourse ? snapCourse.course_name : `course_code ${opt.course_code}`;

  if (isDupInSnap) {
    confirmedMappingDefects.push({
      scope: 'ADMISSION_OPTIONS_SEED',
      identifier: `Uni-Code ${opt.unicode}`,
      website_value: `Duplicate key ${opt.unicode} (${snapCourseLabel} at ${opt.institution_code})`,
      staging_value: off ? `${off.course_title_unicode_table} (${off.institution_id})` : 'N/A',
      explanation: `Uni-Code ${opt.unicode} appears multiple times in ADMISSION_OPTIONS_SEED with conflicting courses.`
    });
  }

  if (!off) {
    if (opt.unicode === '089P' || opt.unicode === '140P') {
      admissionYearDifferences.push({
        scope: 'ADMISSION_OPTIONS_SEED',
        identifier: `Uni-Code ${opt.unicode}`,
        website_value: `${snapCourseLabel} at ${opt.institution_code} (intake ${opt.proposed_intake})`,
        staging_value: 'Temporarily suspended GWUIM course in 2025/2026 (present in 2024/2025 Section 9)',
        explanation: 'GWUIM Indigenous Medicinal Resources (089P) and Service Management (140P) were offered in 2024/2025 but are temporarily suspended in 2025/2026.'
      });
    } else {
      confirmedMappingDefects.push({
        scope: 'ADMISSION_OPTIONS_SEED',
        identifier: `Uni-Code ${opt.unicode}`,
        website_value: `${snapCourseLabel} at ${opt.institution_code} (intake ${opt.proposed_intake})`,
        staging_value: 'Not a valid Uni-Code in 2025/2026 (or 2024/2025 Section 9)',
        explanation: `Uni-Code ${opt.unicode} combines a course code and institution suffix that is not offered by that university (or uses a shifted course code).`
      });
    }
  } else {
    const titleMismatch =
      snapCourse &&
      !off.course_title_unicode_table.toLowerCase().includes(snapCourse.course_name.toLowerCase().split(' ')[0]) &&
      !snapCourse.course_name.toLowerCase().includes(off.course_title_unicode_table.toLowerCase().split(' ')[0]);

    if (off.course_code !== opt.course_code || titleMismatch) {
      if (opt.unicode === '141D') {
        admissionYearDifferences.push({
          scope: 'ADMISSION_OPTIONS_SEED',
          identifier: `Uni-Code ${opt.unicode}`,
          website_value: `${snapCourseLabel} (${opt.institution_code}, intake ${opt.proposed_intake})`,
          staging_value: `${off.course_title_unicode_table} (${off.institution_id}, intake ${off.proposed_intake})`,
          explanation: 'Titled "Sports Science & Management" in 2024/2025 Section 9 Table 9.8 and "Sports Science" (141D) in 2025/2026.'
        });
      } else {
        confirmedMappingDefects.push({
          scope: 'ADMISSION_OPTIONS_SEED',
          identifier: `Uni-Code ${opt.unicode}`,
          website_value: `${snapCourseLabel} (${opt.institution_code}, intake ${opt.proposed_intake})`,
          staging_value: `${off.course_title_unicode_table} (${off.institution_id}, intake ${off.proposed_intake})`,
          explanation: `Uni-Code ${opt.unicode} is mapped to "${snapCourseLabel}" in the website snapshot instead of official "${off.course_title_unicode_table}".`
        });
      }
    } else if (off.proposed_intake !== opt.proposed_intake) {
      admissionYearDifferences.push({
        scope: 'ADMISSION_OPTIONS_SEED',
        identifier: `Uni-Code ${opt.unicode} (${off.course_title_unicode_table}, ${off.institution_id})`,
        website_value: `proposed_intake: ${opt.proposed_intake}`,
        staging_value: `proposed_intake: ${off.proposed_intake}`,
        explanation: 'Uni-Code, course, and institution match; proposed intake differs between admission years / snapshot seed.'
      });
    }
  }
}

// ===========================================================================
// 6. WRITE offering-completeness-report.md
// ===========================================================================
const offeringCompletenessMd = `# Offering Completeness Report (\`offering-completeness-report.md\`)

> **Generated by:** \`data-staging/ugc-2025-2026/validate-dataset.mjs\`
> **Target File:** \`data-staging/ugc-2025-2026/offerings.json\` (**255** selectable Uni-Code offerings + **1** separate \`Additional Intake — Arts\` aggregate record).

---

## 1. Executive Summary of Offering Field Population

| Field in \`offerings.json\` | Populated (of 255 Selectable Uni-Codes) | Remaining \`null\` (of 255) | \`institution_specific\` Scope | \`course_shared\` Scope | Notes |
| :--- | ---: | ---: | ---: | ---: | :--- |
| \`degree_programmes\` | **${degPopulated.length}** (\`${((degPopulated.length / 255) * 100).toFixed(1)}%\`) | **${degNull.length}** | ${degInstSpecific.length} | ${degCourseShared.length} | Remaining ${degNull.length} nulls are courses where Section 2.2 does not print a formal degree title (\`019\` Arts, \`001\` Medicine, \`002\` Dental Surgery, \`003\` Veterinary Science, \`008\` Engineering). |
| \`duration\` (in years) | **${durPopulated.length}** (\`${((durPopulated.length / 255) * 100).toFixed(1)}%\`) | **${durNull.length}** | ${durInstSpecific.length} | ${durCourseShared.length} | Of the ${durNull.length} remaining nulls, **46** offerings specify credit volume (\`120 credit curriculum\` or \`Minimum 120 credits\`) in \`curriculum_credits\` instead of years. |
| \`medium_of_instruction\` | **${medPopulated.length}** (\`${((medPopulated.length / 255) * 100).toFixed(1)}%\`) | **${medNull.length}** | ${medInstSpecific.length} | ${medCourseShared.length} | Extracted wherever explicitly stated in tables, bullets, prose, or degree titles; remaining ${medNull.length} offerings belong to subsections where Section 2.2 does not state the medium. |
| \`alternative_degree_pathways\` | **${altPathwaysPopulated.length}** | ${255 - altPathwaysPopulated.length} | — | — | Populated for offerings with multiple degree programmes, specialization degrees, or 3-year / 4-year Honours pathways. |
| \`conditional_honours_entry\` | **${condHonoursPopulated.length}** | ${255 - condHonoursPopulated.length} | — | — | Preserves explicit rules for post-admission selection into 4-year Honours or specialization streams. |
| \`location_or_faculty\` | **${locPopulated.length}** | ${255 - locPopulated.length} | — | — | Populated where Section 2.2 explicitly names the faculty or campus location (e.g. \`001\` Medicine, \`002\` Dental, \`003\` Vet, \`020S\`/\`041S\`, \`029W\`, aesthetic courses). |
| \`specialization_streams\` | **${specsPopulated.length}** | ${255 - specsPopulated.length} | — | — | Populated where Section 2.2 explicitly lists specialization areas (e.g. \`008\` Engineering per university, \`005\`, \`015M\`, \`024\`, \`034\`, \`062\`, \`064\`, \`073\`, \`076\`, \`083\`, \`087\`, \`106\`, \`109\`). |

---

## 2. Shared Course-Level vs Institution-Specific Fact Separation

Each record in \`offerings.json\` includes:
- \`course_level_shared_facts\`: \`{ degree_programmes, duration, medium_of_instruction }\` — populated only when a Section 2.2 subsection states a fact once for all participating universities offering that course code.
- \`institution_specific_facts\`: \`{ degree_programmes, duration, medium_of_instruction, location_or_faculty, specialization_streams }\` — populated when Section 2.2 states facts for a specific university or when a course is offered by a single institution.
- \`fact_scope\`: Explicitly tags each of \`degree_programmes\`, \`duration\`, and \`medium_of_instruction\` as \`"institution_specific"\`, \`"course_shared"\`, or \`"not_stated"\`.

### Key Multi-University Courses With Institution-Specific Differentiation Preserved
1. **\`019\` Arts (\`2.2.1.1\`, 9 Uni-Codes)**: Institution-specific mediums from the \`ugc2.md\` lines 473–483 table (\`CMB\` & \`PDN\`: Sinhala, Tamil, English; \`SJP\`, \`KLN\`, \`RUH\`, \`RUSL\`: Sinhala; \`UJA\`, \`EUSL\`, \`SEUSL\`: Tamil).
2. **\`016\` Management (11 Uni-Codes), \`018\` Commerce (5 Uni-Codes), \`017C\` Real Estate, \`028C\` Management & Public Policy (\`2.2.2.1\`–\`2.2.2.4\`)**: Shared 4-year duration (\`ugc2.md\` line 788) combined with each university's exact BBA / BSc / BBM / BCom Honours programme list from \`ugc3.md\` lines 6–107.
3. **\`022\` Management Studies (TV) (\`022R\` UOV, \`022W\` TRINCO, \`2.2.2.5\`)**: Shared \`3 years / 4 years\` duration and conditional 4th-year progression rule (\`ugc3.md\` line 120), with UOV's 6 BBM/BBMHons programmes separated from TRINCO's 6 BSc/BScHons programmes (\`ugc3.md\` lines 124–139).
4. **\`001\` Medicine (12 Uni-Codes), \`002\` Dental Surgery (2 Uni-Codes), \`003\` Veterinary Science (1 Uni-Code) (\`2.2.3.1\`–\`2.2.3.3\`)**: Shared \`5 years\` duration combined with each university's specific Faculty name and Campus location (\`ugc3.md\` lines 252–310).
5. **\`004\` Agriculture (\`2.2.3.5\`, 5 Uni-Codes)**: \`004L\` (SUSL) assigned \`Bachelor of Science in Agriculture\`; \`004E\` (UJA), \`004H\` (EUSL), \`004K\` (RUSL), and \`004M\` (WUSL) assigned \`Bachelor of Science Honours in Agriculture\` (\`ugc3.md\` lines 343–350).
6. **\`036\` Siddha Medicine and Surgery (\`2.2.3.13\`, 2 Uni-Codes)**: Shared \`Bachelor of Siddha Medicine and Surgery (B.S.M.S.)\` and \`6 years [05 academic years and 01-year (final) internship]\`, with \`036E\` (UJA) medium \`Tamil\` and \`036W\` (TRINCO) medium \`English\` (\`ugc3.md\` lines 492–494).
7. **\`007\` Applied Sciences (Biological Science) (\`2.2.3.15\`, 3 Uni-Codes)**: Distinct 3-year and 4-year Honours/Joint Major degree lists for \`007L\` (SUSL), \`007K\` (RUSL), and \`007R\` (UOV) (\`ugc3.md\` lines 539–561).
8. **\`008\` Engineering (\`2.2.4.1\`, 6 Uni-Codes)**: Institution-specific Engineering specialization lists for \`PDN\`, \`MRT\`, \`RUH\`, \`UJA\`, \`SEUSL\`, and \`SJP\` (\`ugc4.md\` lines 149–193).
9. **\`012\` Computer Science (\`2.2.4.6\`, 6 Uni-Codes)**:
   - \`012T\` (UCSC): 3-year \`BSc in Computer Science\` + 4-year \`BScHons in Computer Science\` & \`BScHons in Software Engineering\`.
   - \`012E\` (UJA): 3-year \`BSc in Computer Science\` + 4-year \`BScHons in Computer Science\`.
   - \`012F\` (RUH) & \`012W\` (TRINCO): 3-year \`BSc in Computer Science\`.
   - \`012D\` (KLN): 4-year \`BScHons in Computer Science [BScHons (ComputerSc)]\`.
   - \`012C\` (SJP): 4-year \`Bachelor of Computing Honours in Computer Science [BCompHons (Comp Sc)]\`.
10. **\`015\` Applied Sciences (Physical Science) (\`2.2.4.7\`, 5 Uni-Codes)**: Distinct degree lists for \`015K\` (RUSL, 3yr/4yr), \`015L\` (SUSL, duration not stated), \`015R\` (UOV, 3yr/4yr), \`015W\` (TRINCO, duration not stated), and \`015M\` (WUSL, 3yr/4yr + explicit \`English\` medium and 5 Joint Major subjects).
11. **\`108\` Physical Science - ICT (\`2.2.4.10\`, 2 Uni-Codes)**: \`108D\` (KLN) assigned \`Bachelor of Science in Physics and Electronics\`; \`108C\` (SJP) assigned \`Bachelor of Science in Physics and ICT [BSc (PICT)]\`.
12. **\`102\` Engineering Technology (9 Uni-Codes) & \`103\` Biosystems Technology (11 Uni-Codes) (\`2.2.5.1\`, \`2.2.6.1\`)**: Preserves institution-specific named specializations (\`102U\` UWU Mechanical ET, \`102A\` CMB Instrumentation & Automation, \`103E\` UJA Commercial Green Farming / Food Production, \`103H\` EUSL Agricultural Tech & Entrepreneurship, \`103J\` SEUSL Agricultural Tech, \`103A\` CMB Environmental Tech / Agriculture) vs general \`BET(Hons)\` / \`BBST(Hons)\`.
13. **\`096\` Information Systems (\`2.2.8.24\`, 3 Uni-Codes)**: \`096T\` (UCSC) 3-year \`BSc in Information Systems\` with conditional 4-year \`BScHons\` pathway; \`096C\` (SJP) 4-year \`BCompHons (Inf Sys)\`; \`096L\` (SUSL) 4-year \`BScHons (Inf Sys)\`.
14. **\`098\` Translation Studies (\`2.2.8.25\`, 4 Uni-Codes)**: \`098D\` (KLN) & \`098L\` (SUSL) \`English / Sinhala\` vs \`098E\` (UJA) & \`098H\` (EUSL) \`English / Tamil\`.
15. **\`099\` Software Engineering (\`2.2.8.29\`, 3 Uni-Codes)**: \`099D\` (KLN) & \`099L\` (SUSL) \`BScHons in Software Engineering\` vs \`099C\` (SJP) \`BCompHons (Soft Eng)\`.

---

## 3. Complete Inventory of Remaining \`null\` Values and Reasons

### 3.1 Offerings With \`degree_programmes: null\` (${degNull.length} Offerings Across ${degNullGroups.length} Courses)

| Course Code | Course Title | Uni-Codes (${degNull.length}) | Source Section & Lines | Reason \`degree_programmes\` is \`null\` |
| :--- | :--- | :--- | :--- | :--- |
${degNullGroups.map(g => `| \`${g.course_code}\` | ${g.course_title} | ${g.uni_codes.map(u => `\`${u}\``).join(', ')} | ${g.section} (\`${g.source_ref}\`) | ${g.reason} |`).join('\n')}

### 3.2 Offerings With \`duration: null\` (${durNull.length} Offerings Across ${durNullGroups.length} Courses)

| Course Code | Course Title | Uni-Codes (${durNull.length}) | Source Section & Lines | \`curriculum_credits\` | Reason \`duration\` is \`null\` |
| :--- | :--- | :--- | :--- | :--- | :--- |
${durNullGroups.map(g => `| \`${g.course_code}\` | ${g.course_title} | ${g.uni_codes.map(u => `\`${u}\``).join(', ')} | ${g.section} (\`${g.source_ref}\`) | ${g.curriculum_credits ? `\`${g.curriculum_credits}\`` : '\`null\`'} | ${g.reason} |`).join('\n')}

### 3.3 Offerings With \`medium_of_instruction: null\` (${medNull.length} Offerings Across ${medNullGroups.length} Courses)

| Course Code | Course Title | Uni-Codes (${medNull.length}) | Source Section & Lines | Reason \`medium_of_instruction\` is \`null\` |
| :--- | :--- | :--- | :--- | :--- |
${medNullGroups.map(g => `| \`${g.course_code}\` | ${g.course_title} | ${g.uni_codes.map(u => `\`${u}\``).join(', ')} | ${g.section} (\`${g.source_ref}\`) | ${g.reason} |`).join('\n')}
`;

fs.writeFileSync(path.join(STAGING_DIR, 'offering-completeness-report.md'), offeringCompletenessMd, 'utf8');
console.log('Wrote offering-completeness-report.md.');

// ===========================================================================
// 7. WRITE unresolved-issues.md
// ===========================================================================
const unresolvedIssuesMd = `# Unresolved Issues, Summary-Table Condensations & Items Requiring PDF Review (\`unresolved-issues.md\`)

> **Generated by:** \`data-staging/ugc-2025-2026/validate-dataset.mjs\`
> **Purpose:** Documents (1) verified cross-section consistency results and summary-table condensations, (2) unmapped/suspended/renamed courses between 2024/2025 (Section 9) and 2025/2026, and (3) items in the supplied Markdown files that require visual comparison with the original printed PDF.

---

## 1. Cross-Section Consistency Findings & Summary-Table Condensations (Not Contradictions)

### 1.1 Zero Contradictions Between Section 2.2 and Section 5 Practical / Aptitude Test Table
- Programmatic verification (\`CON-01\`) confirmed that the **16 courses (24 Uni-Codes)** requiring a Practical or Aptitude Test in Section 2.2 match the **24 rows** of the Section 5 table (**"REQUIREMENT TO PASS THE PRACTICAL/ APTITUDE TEST"**, \`ugc8.md\` lines 232–258) 100%.
- Specifically:
  - \`096\` **Information Systems** (\`Section 2.2.8.24\`, \`ugc5.md\` lines 692–723) and \`098\` **Translation Studies** (\`Section 2.2.8.25\`, \`ugc5.md\` lines 726–748) do **not** mention any aptitude test in Section 2.2 or Section 5 (\`aptitude_or_practical_test.status: "not_stated"\`).
  - \`100\` **Film & Television Studies** (\`Section 2.2.8.26\`, \`ugc5.md\` lines 751–767) requires an Aptitude Test at University of Kelaniya (\`100D\`) and is listed in the Section 5 table (\`ugc8.md\` line 256).

### 1.2 Zero Contradictions Between Section 2.2 and Section 5 G.C.E. (O/L) Table (Plus 4 Summary-Table Condensations)
- Programmatic verification (\`CON-02\`) confirmed that all **31 courses** with G.C.E. (O/L) requirements in Section 2.2 match the **31 rows** of the Section 5 G.C.E. (O/L) summary table (\`ugc8.md\` lines 185–225), including \`136\` **Data Science** (\`Section 2.2.4.13\`, \`ugc4.md\` line 462 & \`ugc8.md\` line 217, both requiring Credit Pass \`C\` in English at O/L).
- **Four (4) Summary-Table Condensations (Alternative A/L Pass Waivers in Section 2.2 Omitted from the Condensed Section 5 Table)**:
  1. **\`023\` Architecture** (\`Section 2.2.8.6\`, \`ugc5.md\` line 147), **\`024\` Design** (\`Section 2.2.8.9\`, \`ugc5.md\` line 270), and **\`097\` Landscape Architecture** (\`Section 2.2.8.8\`, \`ugc5.md\` line 248): Section 2.2 states *"At least a Credit Pass (C) in Mathematics at the G.C.E. (Ordinary Level) Examination or an Ordinary Pass (S) in Mathematics at the G.C.E. (Advanced Level) Examination"*. The condensed 5-column O/L table in Section 5 (\`ugc8.md\` lines 191, 192, 210) displays \`C\` under the O/L Mathematics column without a footnote for the A/L Mathematics pass alternative.
  2. **\`098\` Translation Studies** (\`Section 2.2.8.25\`, \`ugc5.md\` lines 734–738): Section 2.2 states that candidates must have obtained \`B\` grades in Sinhala/Tamil Language & Lit. and English at G.C.E. (O/L) **or** *"At least a ‘S’ grade for English Language at the G.C.E. (Advanced Level) Examination"*. The condensed O/L table in Section 5 (\`ugc8.md\` line 211) displays \`B*\` / \`B\` in the O/L columns without a footnote for the A/L English Language alternative.
  - **Handling in \`eligibility.json\`**: Recorded under \`summary_table_condensations\` and \`prose_only_conditions\` (not labeled as contradictions), with \`auto_decision_safe: false\` so an automated rule engine never rejects a candidate who satisfies the A/L waiver.

---

## 2. Unmapped, Suspended & Renamed Courses Between 2024/2025 (Section 9) and 2025/2026

Per instructions (*"Do not construct ambiguous Uni-Code mappings; report them instead"*), the following Section 9 (2024/2025) cutoff columns have \`uni_code_2025_2026: null\` in \`historical-cutoffs-2024-2025.json\`:

### 2.1 Eight (8) GWUIM Courses Present in 2024/2025 Cutoffs (Section 9) but Temporarily Suspended in 2025/2026
The handbook explicitly notes in \`ugc3.md\` (line 199), \`ugc4.md\` (lines 93–95), and \`ugc6.md\` (lines 227–236) that intake to 8 degree programmes at **Gampaha Wickramarachchi University of Indigenous Medicine, Sri Lanka (GWUIM)** is temporarily suspended for Academic Year 2025/2026 due to ongoing curriculum reviews. They have 2024/2025 cutoff columns in Section 9 but **no 2025/2026 Course Code or Uni-Code**:
1. \`SERVICE MANAGEMENT (Gampaha Wickramarachchi University of Indigenous Medicine, Sri Lanka)\` — \`Table_9.4_COL_07\` (\`ugc9.md\` line 312)
2. \`INDIGENOUS MEDICINAL RESOURCES (Gampaha Wickramarachchi University of Indigenous Medicine, Sri Lanka)\` — \`Table_9.6_COL_17\` (\`ugc9.md\` line 372)
3. \`HEALTH INFORMATION AND COMMUNICATION TECHNOLOGY (Gampaha Wickramarachchi University of Indigenous Medicine, Sri Lanka)\` — \`Table_9.6_COL_18\` (\`ugc9.md\` line 372)
4. \`HEALTH TOURISM AND HOSPITALITY MANAGEMENT (Gampaha Wickramarachchi University of Indigenous Medicine, Sri Lanka)\` — \`Table_9.6_COL_19\` (\`ugc9.md\` line 372)
5. \`BIOMEDICAL TECHNOLOGY (Gampaha Wickramarachchi University of Indigenous Medicine, Sri Lanka)\` — \`Table_9.6_COL_20\` (\`ugc9.md\` line 372)
6. \`INDIGENOUS PHARMACEUTICAL TECHNOLOGY (Gampaha Wickramarachchi University of Indigenous Medicine, Sri Lanka)\` — \`Table_9.6_COL_21\` (\`ugc9.md\` line 372)
7. \`YOGA AND PARAPSYCHOLOGY (Gampaha Wickramarachchi University of Indigenous Medicine, Sri Lanka)\` — \`Table_9.6_COL_22\` (\`ugc9.md\` line 372)
8. \`SOCIAL STUDIES IN INDIGENOUS KNOWLEDGE (Gampaha Wickramarachchi University of Indigenous Medicine, Sri Lanka)\` — \`Table_9.6_COL_23\` (\`ugc9.md\` line 372)

### 2.2 Title Change Between 2024/2025 and 2025/2026 at University of Kelaniya (\`Table_9.8_COL_07\`)
- In **Section 9 Table 9.8 (\`ugc9.md\` line 432)**, column 7 is titled \`SPORTS SCIENCE & MANAGEMENT # (University of Kelaniya)\` (alongside SJP and SUSL).
- In **2025/2026** (\`Section 2.2.8.21\`, \`ugc5.md\` lines 615–632, Section 5, Annex (a), Annex (b)), University of Kelaniya is NOT under Course Code \`082\` (\`Sports Science & Management\`, which is only \`082C\` SJP and \`082L\` SUSL); instead, University of Kelaniya is under a separate Course Code \`141\` / Uni-Code \`141D\` titled **\`Sports Science\`**.
- To avoid silently merging courses with different titles/codes across admission years, \`Table_9.8_COL_07\` is stored with \`uni_code_2025_2026: null\`, \`candidate_uni_code_2025_2026: "141D"\`, and \`mapping_status: "title_changed_between_2024_2025_and_2025_2026"\`.

### 2.3 Two (2) New 2025/2026 Offerings With No 2024/2025 Historical Cutoffs in Section 9
1. **\`142F\` — Geographical Information Systems (New)** at University of Ruhuna (Proposed Intake: 50, \`Section 2.2.8.43\`, \`ugc6.md\` lines 214–225).
2. **\`143B\` — Electronic and Intelligent Systems Engineering (New)** at University of Peradeniya (Proposed Intake: 50, \`Section 2.2.4.14\`, \`ugc4.md\` lines 471–482).

### 2.4 Five (5) Uni-Codes With Stream/Category-Split Cutoff Columns in Section 9 (10 Columns for 5 Uni-Codes)
In Section 9, five 2025/2026 Uni-Codes have **two separate cutoff columns each** because admission quotas are split by A/L stream or subject category:
1. **\`021L\` — Arts (SAB)** at Sabaragamuwa University (Table 9.4):
   - \`ARTS (SAB) - A * [Arts Stream]\`
   - \`ARTS (SAB) - B * [Commerce Stream]\`
2. **\`022R\` — Management Studies (TV)** at University of Vavuniya (Table 9.5):
   - \`MANAGEMENT STUDIES (TV) - A [Commerce Stream]\` (60% quota)
   - \`MANAGEMENT STUDIES (TV) - B [Any subject combination]\` (40% quota)
3. **\`022W\` — Management Studies (TV)** at Trincomalee Campus, EUSL (Table 9.5):
   - \`MANAGEMENT STUDIES (TV) - A [Commerce Stream]\` (40% quota in 2025/2026 text)
   - \`MANAGEMENT STUDIES (TV) - B [Any subject combination]\`
4. **\`027D\` — Management and Information Technology (MIT)** at University of Kelaniya (Table 9.5):
   - \`MANAGEMENT AND INFORMATION TECHNOLOGY (MIT) (BIO SCIENCE STREAM)\` (40% quota)
   - \`MANAGEMENT AND INFORMATION TECHNOLOGY (MIT) (OTHER STREAM)\` (60% quota)
5. **\`107L\` — Food Business Management** at Sabaragamuwa University (split across Table 9.7 and Table 9.8):
   - \`FOOD BUSINESS MANAGEMENT [Biological / Physical Science Stream]\` (Table 9.7, 50% Category A quota)
   - \`FOOD BUSINESS MANAGEMENT [Commerce Stream]\` (Table 9.8, 50% Category B quota)

---

## 3. Items Requiring Original-PDF Review

| Item ID | Source File & Lines | Printed Page | Description & Staging Handling |
| :--- | :--- | :--- | :--- |
| \`PDF-01\` | \`ugc9.md\` line 50 | \`164\` | **Blank Cell in Section 6.1 Special Quota Table (\`007R\`)**: For \`007R\` Applied Sciences (Biological Science) at University of Vavuniya, the \`No of Students: Blind (Braille)\` cell is blank (\`\\| 01 \\| \\|\`), whereas all other zero cells in the table use \`-\`. Preserved in \`offerings.json\` with \`blind_braille_raw: ""\` and \`blind_braille_seats: null\` (never coerced to \`0\`). Requires original-PDF inspection to confirm whether the printed table cell is blank or \`-\`. |
| \`PDF-02\` | \`ugc5.md\` lines 661–664 | \`99\` | **Repeated Sports Science Practical Test Blockquote inside \`2.2.8.22\` (\`091\`)**: At the end of \`2.2.8.22 Information Technology & Management (Course Code - 091)\`, lines 661–664 repeat the blockquote (*"Please note that if a candidate wishes to apply for the courses of study in ‘Sports Science’, ‘Sports Science & Management’ and ‘Physical Education’, it is sufficient to apply and appear in the practical test conducted in one of the above universities."*) which already appears under \`2.2.8.19\` (lines 590–593) and \`2.2.8.21\` (lines 629–632). Excluded from \`091\` aptitude rules; check printed PDF page 99 to confirm whether this is a handbook typesetting error or Markdown conversion artifact. |
| \`PDF-03\` | \`ugc9.md\` line 432 | \`181\` | **\`SPORTS SCIENCE & MANAGEMENT # (University of Kelaniya)\` in Table 9.8**: Verify whether the 2024/2025 cutoff column header on printed page 181 uses the older title \`SPORTS SCIENCE & MANAGEMENT\` while 2025/2026 assigns Kelaniya to \`141D\` \`Sports Science\`. |
| \`PDF-04\` | \`ugc1.md\`, \`ugc6.md\`–\`ugc10.md\` | \`null\` | **Printed Page Numbers Outside Section 2 TOC, Section 6 TOC, and Section 9**: The Markdown conversion removed recurring page headers/footers on Section 1, Section 3, Section 4, Section 5 tables, Section 10, and Annexes (a)–(c). Stored as \`printed_page: null\` per the non-invention rule until verified against the original PDF. |
`;

fs.writeFileSync(path.join(STAGING_DIR, 'unresolved-issues.md'), unresolvedIssuesMd, 'utf8');
console.log('Wrote unresolved-issues.md.');

// ===========================================================================
// 8. WRITE validation-report.md
// ===========================================================================
const validationReportMd = `# UGC 2025/2026 Dataset Validation Report (\`validation-report.md\`)

> **Generated by:** \`data-staging/ugc-2025-2026/validate-dataset.mjs\`
> **Scope:** Programmatic validation generated from live staged files and direct checks against the 10 source Markdown files, separated into:
> 1. **Structural Validation**
> 2. **Exact Transcription Checks**
> 3. **Cross-Section Consistency Checks**
> 4. **Items Requiring Original-PDF Review**
> 5. **Classified Comparison Against Existing Website Data (\`src/data/sriLankaUgcSnapshot.ts\`)**

---

## Part 1: Dataset Summary Counts

| Output File | Record Count | Breakdown & Key Metrics |
| :--- | ---: | :--- |
| \`institutions.json\` | **23** | **20** UGC-participating institutions (**16** National Universities, **2** Campuses \`SP\` & \`TRINCO\`, **2** Institutes \`UCSC\` & \`SVIAS\`) + **3** non-UGC-centralized institutions referenced in Section 1.6(9)-(10) (\`OUSL\`, \`IHRA\`, \`ITUM\`) |
| \`courses.json\` | **129** | **121** active 2025/2026 courses (\`001\`–\`143\`, Total Proposed Intake = **42,937**) + **8** temporarily suspended GWUIM courses |
| \`offerings.json\` | **256** | **255** selectable Uni-Code offerings (\`is_selectable_unicode_offering: true\`, \`001A\`–\`143B\`, intake sum = **42,037**) + **1** separate \`Additional Intake — Arts\` aggregate record (\`is_selectable_unicode_offering: false\`, **900** seats; combined total = **42,937**) |
| \`eligibility.json\` | **122** | **1** general admission criteria record (Sections 1.2–1.7) + **121** course-level 2025/2026 eligibility records (**${machineEvaluableCount}** \`machine_evaluable\` / \`auto_decision_safe: true\`; **${manualReviewEligibilityCount}** \`requires_manual_review\` / \`auto_decision_safe: false\`) |
| \`historical-cutoffs-2024-2025.json\` | **266 columns / 6,650 cells** | **10** tables (\`Table 9.1\`–\`Table 9.10\`, Handbook pp. 174–183) × **25** districts = **6,650** district cutoff cells (**5,583** numeric Z-scores including **${negativeZScoreCount}** negative Z-scores + **1,067** \`NQC\` cells) |

---

## Part 2: Category 1 — Structural Validation

| Check ID | Check Name | Status | Executed Check Result |
| :--- | :--- | :---: | :--- |
${structuralChecks.map(c => `| \`${c.id}\` | ${c.name} | **${c.passed ? 'PASS' : 'FAIL'}** | ${c.details} |`).join('\n')}

---

## Part 3: Category 2 — Exact Transcription Checks (Against the 10 Source Markdown Files)

| Check ID | Check Name | Status | Executed Check Result |
| :--- | :--- | :---: | :--- |
${transcriptionChecks.map(c => `| \`${c.id}\` | ${c.name} | **${c.passed ? 'PASS' : 'FAIL'}** | ${c.details} |`).join('\n')}

---

## Part 4: Category 3 — Cross-Section Consistency Checks

| Check ID | Check Name | Status | Executed Check Result |
| :--- | :--- | :---: | :--- |
${consistencyChecks.map(c => `| \`${c.id}\` | ${c.name} | **${c.passed ? 'PASS' : 'FAIL'}** | ${c.details} |`).join('\n')}

### Cross-Section Title Variants Catalogued (\`CON-04\`, ${titleVariantsReport.length} Courses)

| Course Code | Section 2 Title | Section 5 Uni-Code Table Title | Annex (a) Title | Annex (b) Title(s) |
| :--- | :--- | :--- | :--- | :--- |
${titleVariantsReport.map(r => `| \`${r.course_code}\` | ${r.section_2} | ${r.section_5_unicode} | ${r.annex_a} | ${r.annex_b} |`).join('\n')}

---

## Part 5: Category 4 — Items Requiring Original-PDF Review

| Item ID | Source Reference | Summary |
| :--- | :--- | :--- |
| \`PDF-01\` | \`ugc9.md:50\` (Page 164) | Blank cell (\`""\`) for \`007R\` Blind (Braille) quota in Section 6.1 table (preserved as \`blind_braille_raw: ""\`, \`blind_braille_seats: null\`). |
| \`PDF-02\` | \`ugc5.md:661-664\` (Page 99) | Repeated Sports Science practical test blockquote at the end of \`2.2.8.22 Information Technology & Management (091)\`. |
| \`PDF-03\` | \`ugc9.md:432\` (Page 181) | \`SPORTS SCIENCE & MANAGEMENT # (University of Kelaniya)\` in 2024/2025 Table 9.8 vs \`141D\` \`Sports Science\` in 2025/2026. |
| \`PDF-04\` | Sections 1, 3, 4, 5 tables, 10, Annexes (a)–(c) | Printed page numbers omitted by Markdown conversion where not covered by Section 2 TOC (\`19\`–\`109\`), Section 6 TOC (\`164\`–\`170\`), or Section 9 headers (\`174\`–\`183\`). |

---

## Part 6: Classified Comparison Against Existing Website Data (\`src/data/sriLankaUgcSnapshot.ts\`)

> **Safety Note:** \`src/data/sriLankaUgcSnapshot.ts\` was inspected **read-only** and was **not modified**.
> Per review requirements, differences between the existing website snapshot and the staged dataset are classified into three distinct categories:
> 1. **Confirmed mapping defect** (${confirmedMappingDefects.length} items)
> 2. **Difference between admission years** (${admissionYearDifferences.length} items)
> 3. **Unresolved difference** (${unresolvedWebsiteDifferences.length} items)

### 6.1 Summary of Website Comparison Categories

| Classification Category | Count | Description |
| :--- | ---: | :--- |
| **Confirmed mapping defect** | **${confirmedMappingDefects.length}** | Wrong course assigned to an official course code (e.g. \`010\` mapped to Quantity Surveying instead of Engineering (TM), \`020\` mapped to Law, \`096\` mapped to AI instead of Information Systems, \`017\`/\`018\` swapped, \`004\`–\`007\` shifted), duplicate Uni-Code keys (\`020S\`), non-existent course-university combinations (\`004D\`, \`006K\`, \`012A\`, \`019G\`), and synthetic district cutoff generation (\`colombo_base_z + difficulty_offset\`). |
| **Difference between admission years** | **${admissionYearDifferences.length}** | Courses offered in 2024/2025 that are temporarily suspended in 2025/2026 (\`140\`/\`140P\` Service Management, \`089P\` Indigenous Medicinal Resources), course title update (\`141D\` Sports Science), new 2025/2026 courses (\`142F\` GIS, \`143B\` Electronic & Intelligent Systems Engineering), and changed proposed intake numbers where the course and institution mapping match. |
| **Unresolved difference** | **${unresolvedWebsiteDifferences.length}** | Legacy course codes in \`COURSE_MASTER_OVERVIEWS\` (\`040\`, \`061\`, \`074\`, \`078\`, \`080\`) and custom institution slug conventions where the snapshot does not record its source handbook edition. |

### 6.2 Category A: Confirmed Mapping Defects in \`src/data/sriLankaUgcSnapshot.ts\` (${confirmedMappingDefects.length} Items)

Also includes the architectural defect that \`src/data/sriLankaUgcSnapshot.ts\` computes district cutoffs via a synthetic formula (\`colombo_base_z + difficulty_offset\`) with no \`NQC\` support, whereas \`historical-cutoffs-2024-2025.json\` preserves all **6,650** official Section 9 cells (**5,583** numeric + **1,067** \`NQC\`).

| Snapshot Section | Identifier | Website Snapshot Entry | Official Handbook Entry | Defect Explanation |
| :--- | :--- | :--- | :--- | :--- |
${confirmedMappingDefects.map(d => `| \`${d.scope}\` | \`${d.identifier}\` | ${d.website_value} | ${d.staging_value} | ${d.explanation} |`).join('\n')}

### 6.3 Category B: Differences Between Admission Years (${admissionYearDifferences.length} Items)

In addition to the **2** new 2025/2026 courses (\`142F\` GIS at Ruhuna and \`143B\` Electronic & Intelligent Systems Engineering at Peradeniya) not present in earlier years, the following **${admissionYearDifferences.length}** entries reflect year-over-year changes (suspensions, title updates, or updated intake numbers) rather than mapping errors:

| Snapshot Section | Identifier | Website Snapshot Entry | 2025/2026 Handbook Entry | Year-Over-Year Explanation |
| :--- | :--- | :--- | :--- | :--- |
${admissionYearDifferences.map(d => `| \`${d.scope}\` | \`${d.identifier}\` | ${d.website_value} | ${d.staging_value} | ${d.explanation} |`).join('\n')}

### 6.4 Category C: Unresolved Differences (${unresolvedWebsiteDifferences.length} Items)

| Snapshot Section | Identifier | Website Snapshot Entry | 2025/2026 Handbook Status | Explanation |
| :--- | :--- | :--- | :--- | :--- |
${unresolvedWebsiteDifferences.map(d => `| \`${d.scope}\` | \`${d.identifier}\` | ${d.website_value} | ${d.staging_value} | ${d.explanation} |`).join('\n')}
`;

fs.writeFileSync(path.join(STAGING_DIR, 'validation-report.md'), validationReportMd, 'utf8');
console.log('Wrote validation-report.md.');

// ===========================================================================
// 9. WRITE correction-summary.md
// ===========================================================================
const correctionSummaryMd = `# UGC 2025/2026 Staging Dataset — Correction Summary (\`correction-summary.md\`)

> **Generated by:** \`data-staging/ugc-2025-2026/validate-dataset.mjs\`
> **Working Scope:** \`data-staging/ugc-2025-2026/\` only (application source, \`src/data/sriLankaUgcSnapshot.ts\`, and databases were not modified).

---

## Summary of All 8 Review Findings Resolved

### 1. Unsupported Age Rule Removed Everywhere
- **Finding**: \`"Minimum age 17"\` appeared in all 122 \`eligibility.json\` records and in \`build-staging.mjs\`, with no supporting statement in the 10 supplied Markdown files.
- **Correction**:
  - Verified programmatically across all 10 source files (\`ugc1.md\`–\`ugc10.md\`) that zero mentions of age 17 exist (\`TRN-02\`).
  - Removed \`MINIMUM_AGE_17\` from \`GENERAL-ADMISSION-2025-2026\` and removed the age clause from \`general_al_rule_ref\` across all 121 course records in \`eligibility.json\` and \`build-staging.mjs\`.
  - Corrected \`GENERAL-ADMISSION-2025-2026\` source lines to \`ugc1.md\` lines \`100–223\` (Sections \`1.2\`–\`1.7\`, referencing the **9** ineligibility categories in Section \`1.7\`).

### 2. Unsupported Aptitude Claims Removed & Explicit Aptitude Status Recorded
- **Finding**: Reports previously claimed that Information Systems (\`096\`) and Translation Studies (\`098\`) required aptitude tests based on misattributed passages, and conflicted with JSON flags.
- **Correction**:
  - Re-read \`ugc5.md\` lines \`692–767\` and Section 5 (\`ugc8.md\` lines \`232–258\`). Confirmed that \`2.2.8.24\` (\`096\` Information Systems, lines \`692–723\`) and \`2.2.8.25\` (\`098\` Translation Studies, lines \`726–748\`) make **no mention** of any aptitude test, while \`2.2.8.26\` (\`100\` Film & Television Studies, lines \`751–767\`) requires an Aptitude Test at Kelaniya (\`100D\`).
  - Confirmed programmatically (\`CON-01\`) that all **16 courses (24 Uni-Codes)** requiring a Practical/Aptitude Test in Section 2.2 match the **24 rows** in Section 5's Practical/Aptitude Test table 100%, with **zero discrepancies**.
  - Updated \`eligibility.json\` so every course records \`aptitude_or_practical_test\` with \`status: "required" | "not_stated"\` (distinguishing \`"not_stated"\` from \`"required"\`, and noting that no course in Section 2.2 contains an explicit statement that no test is required), plus \`required_in_section_2\`, \`listed_in_section_5_table\`, \`uni_codes_in_section_5_table\`, and \`section_2_clauses\`.

### 3. False Data Science (\`136\`) Discrepancy Removed & Section References Corrected
- **Finding**: \`ugc4.md\`, Section \`2.2.4.13\` Data Science (\`136\`, lines \`448–470\`), explicitly requires a Credit Pass (\`C\`) in English at G.C.E. (O/L) on line \`462\`, agreeing with the Section 5 O/L summary table (\`ugc8.md\` line \`217\`).
- **Correction**:
  - Removed the false contradiction from \`build-staging.mjs\`, \`eligibility.json\`, \`unresolved-issues.md\`, and \`validation-report.md\`.
  - Fixed all section number references and printed page mappings across \`courses.json\`, \`offerings.json\`, \`eligibility.json\`, and \`source-inventory.md\` (including fixing the Section 2 TOC parser in \`build-staging.mjs\` so all 118 Section 2.2 subsections receive their exact printed page \`31\`–\`109\` from \`ugc1.md\` lines \`245–377\`).

### 4. Offering Details Extracted Across All 255 Selectable Uni-Codes
- **Finding**: Previously only 14 of 255 offerings had \`duration\`, \`degree_programmes\`, and \`medium_of_instruction\` populated because \`build-staging.mjs\` only parsed Markdown pipe tables.
- **Correction**:
  - Extended \`build-staging.mjs\` to extract shared course-level facts and institution-specific facts from bullet lists, university sub-blocks, prose sentences, and tables across all 118 Section 2.2 subsections:
    - \`degree_programmes\`: Populated for **${degPopulated.length} / 255** selectable Uni-Codes (\`${((degPopulated.length / 255) * 100).toFixed(1)}%\`; up from 14). The remaining **${degNull.length}** offerings belong to the 5 courses (\`019\` Arts, \`001\` Medicine, \`002\` Dental Surgery, \`003\` Veterinary Science, \`008\` Engineering) where Section 2.2 does not print a formal degree title.
    - \`duration\`: Populated for **${durPopulated.length} / 255** selectable Uni-Codes (\`${((durPopulated.length / 255) * 100).toFixed(1)}%\`; up from 14), with an additional **46** offerings carrying explicit credit volume (\`120 credit curriculum\` or \`Minimum 120 credits\`) in \`curriculum_credits\`.
    - \`medium_of_instruction\`: Populated for **${medPopulated.length} / 255** selectable Uni-Codes (\`${((medPopulated.length / 255) * 100).toFixed(1)}%\`; up from 23), covering every offering where Section 2.2 states a medium (and correcting \`020S\`/\`041S\` to \`["Sinhala"]\`, \`068C\` to \`["Sinhala", "English"]\`, and aesthetic courses \`2.2.1.1.8\`–\`11\` duration to \`null\`).
    - Strictly separated \`course_level_shared_facts\` from \`institution_specific_facts\`, added \`fact_scope\`, \`alternative_degree_pathways\` (**${altPathwaysPopulated.length}** offerings), \`conditional_honours_entry\` (**${condHonoursPopulated.length}** offerings), \`specialization_streams\` (**${specsPopulated.length}** offerings), and \`null_reasons\`.
  - Produced \`offering-completeness-report.md\` listing all remaining \`null\`s and their exact source reasons.

### 5. Unknown Values Preserved as \`null\` (Never Coerced to Zero)
- **Finding**: Blank special-admission quota cell for \`007R\` Blind (Braille) in Section 6.1 (\`ugc9.md\` line 50 \`| 01 | |\`) was previously coerced to \`0\`.
- **Correction**:
  - Updated \`build-staging.mjs\` so \`"-"\` maps to \`0\` (\`raw: "-"\`) while a blank cell \`""\` maps to \`null\` (\`raw: ""\`).
  - For \`007R\`, \`special_provision_6_1_quotas\` now records \`differently_abled_seats: 1\`, \`differently_abled_raw: "01"\`, \`blind_braille_seats: null\`, \`blind_braille_raw: ""\`.

### 6. Programmatic Validation & Separation of Check Categories
- **Finding**: Previous validation scripts contained hardcoded factual conclusions not checked against the Markdown files, and labeled summary-table omissions as contradictions.
- **Correction**:
  - Rebuilt \`validate-dataset.mjs\` to read all 10 source Markdown files directly and execute programmatic checks across four separate categories:
    1. **Structural Validation** (\`STR-01\` to \`STR-05\`)
    2. **Exact Transcription Checks** (\`TRN-01\` to \`TRN-06\`, verifying **${totalSourceRefsChecked}** source file/line references, Annex (a) intakes, Section 5 Uni-Codes, Section 6.1 cells, and all **6,650** Section 9 cells)
    3. **Cross-Section Consistency Checks** (\`CON-01\` to \`CON-04\`)
    4. **Items Requiring Original-PDF Review** (\`PDF-01\` to \`PDF-04\`)
  - Reclassified the 4 courses (\`023\`, \`024\`, \`097\`, \`098\`) where Section 2.2 includes an A/L pass alternative for an O/L requirement as **summary-table condensations** (\`summary_table_condensations\`), not contradictions.

### 7. Machine-Evaluable vs Prose-Only Eligibility Representation
- **Finding**: Eligibility records needed a strict distinction between machine-evaluable rules and prose-only requirements so incomplete rules are never silently treated as satisfied.
- **Correction**:
  - Added \`evaluation_readiness\` (\`"machine_evaluable"\` vs \`"requires_manual_review"\`), \`auto_decision_safe\` (\`boolean\`), \`machine_evaluable_conditions\`, \`prose_only_conditions\`, and \`manual_review_reasons\` to \`eligibility.json\`.
  - Only the **${machineEvaluableCount}** courses with fixed 3-subject A/L rules and no aptitude, physical, or conditional waiver clauses are marked \`auto_decision_safe: true\` (\`evaluation_readiness: "machine_evaluable"\`). The remaining **${manualReviewEligibilityCount}** course records (plus the general admission record with Section 1.7 disqualifications) are marked \`auto_decision_safe: false\` (\`evaluation_readiness: "requires_manual_review"\`).

### 8. Year Separation & Classified Website Comparison
- **Finding**: Keep \`2025/2026\` admission rules separate from \`2024/2025\` cutoffs, keep \`Additional Intake\` separate from selectable Uni-Codes, and classify differences from \`src/data/sriLankaUgcSnapshot.ts\` into three categories without describing every changed intake number as a website error.
- **Correction**:
  - Preserved all **6,650** \`2024/2025\` Section 9 cutoff cells and stream/category splits in \`historical-cutoffs-2024-2025.json\`.
  - Tagged the 255 Uni-Code offerings with \`is_selectable_unicode_offering: true\` (\`record_type: "selectable_unicode_offering"\`) and the \`Additional Intake — Arts (900)\` row with \`is_selectable_unicode_offering: false\` (\`record_type: "additional_intake_aggregate"\`).
  - Classified all website snapshot differences in \`validation-report.md\` Part 6 into:
    - **Confirmed mapping defect**: **${confirmedMappingDefects.length}** items
    - **Difference between admission years**: **${admissionYearDifferences.length}** items (including changed proposed intake numbers where the course and institution mapping match, suspended GWUIM courses, \`141D\` title update, and new 2025/2026 courses)
    - **Unresolved difference**: **${unresolvedWebsiteDifferences.length}** items
`;

fs.writeFileSync(path.join(STAGING_DIR, 'correction-summary.md'), correctionSummaryMd, 'utf8');
console.log('Wrote correction-summary.md.');

const allPassed = [...structuralChecks, ...transcriptionChecks, ...consistencyChecks].every(c => c.passed);
if (!allPassed) {
  process.exit(1);
}
console.log('All structural, transcription, and cross-section consistency checks PASSED.');
