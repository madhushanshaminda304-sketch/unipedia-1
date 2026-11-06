import type { OlGrade, OlRequirementRule } from '../data/sriLankaUgcSnapshot';
import rawEligibility from '../data/ugc/eligibility.json';
import type { UgcEligibility } from '../data/ugc/types';

const eligibilityRecords = rawEligibility as unknown as UgcEligibility[];
const eligibilityByCourse = new Map<string, UgcEligibility>();
for (const e of eligibilityRecords) {
  if (e.course_code) {
    eligibilityByCourse.set(e.course_code, e);
  }
}

export type ALGrade = 'A' | 'B' | 'C' | 'S' | 'F';
export type ChanceTier =
  | 'ABOVE_LAST_CUTOFF'
  | 'BELOW_LAST_CUTOFF'
  | 'CUTOFF_ONLY'
  | 'NQC'
  | 'NO_HISTORICAL_CUTOFF';

export interface ClassifyInput {
  studentZ?: number | null;
  minZScore: number | null;
  status: 'QUALIFIED' | 'NQC' | 'NO_HISTORICAL_CUTOFF' | string;
  allIslandMeritOnly: boolean;
  allIslandZScore?: number | null;
}

export interface ClassifyResult {
  tier: ChanceTier;
  margin: number | null;
  effectiveCutoff: number | null;
  label: string;
  description: string;
}

/**
 * Factual comparison of student's Z-score against official published UGC historical cutoffs.
 * Zero prediction — purely factual comparison.
 * CRITICAL SRI LANKAN UGC RULE: Never treat NULL / NQC as 0.0000!
 */
export function classifyProgramMatch(input: ClassifyInput): ClassifyResult {
  if (input.status === 'NO_HISTORICAL_CUTOFF') {
    return {
      tier: 'NO_HISTORICAL_CUTOFF',
      margin: null,
      effectiveCutoff: null,
      label: 'No 2024/25 Cutoff (New Offering)',
      description: 'New course offering for 2025/2026; no 2024/2025 historical cutoff published in Section 9.',
    };
  }

  const effectiveCutoff = input.allIslandMeritOnly
    ? (input.allIslandZScore ?? input.minZScore)
    : input.minZScore;

  if (input.status === 'NQC' || effectiveCutoff === null || effectiveCutoff === undefined) {
    return {
      tier: 'NQC',
      margin: null,
      effectiveCutoff: null,
      label: '2024/25 Cutoff: NQC',
      description: 'NQC in 2024/25 Intake (No quota cutoff established for this district)',
    };
  }

  if (input.studentZ === undefined || input.studentZ === null) {
    return {
      tier: 'CUTOFF_ONLY',
      margin: null,
      effectiveCutoff,
      label: `2024/25 Cutoff: ${effectiveCutoff.toFixed(4)}`,
      description: `2024/2025 Published UGC District Cutoff: ${effectiveCutoff.toFixed(4)}`,
    };
  }

  const margin = Number((input.studentZ - effectiveCutoff).toFixed(4));
  const isAbove = margin >= 0;

  return {
    tier: isAbove ? 'ABOVE_LAST_CUTOFF' : 'BELOW_LAST_CUTOFF',
    margin,
    effectiveCutoff,
    label: isAbove
      ? `2024/25 Cutoff: ${effectiveCutoff.toFixed(4)} (Your Z: +${margin.toFixed(4)})`
      : `2024/25 Cutoff: ${effectiveCutoff.toFixed(4)} (Your Z: ${margin.toFixed(4)})`,
    description: isAbove
      ? `Your Z-score (${input.studentZ.toFixed(4)}) is +${margin.toFixed(4)} above the 2024/25 cutoff (${effectiveCutoff.toFixed(4)}).`
      : `Your Z-score (${input.studentZ.toFixed(4)}) is ${margin.toFixed(4)} below the 2024/25 cutoff (${effectiveCutoff.toFixed(4)}).`,
  };
}

export interface PreferencePlanItem {
  uni_code: string;
  course_name: string;
  institution_code: string;
  min_z_score: number | null;
  locked?: boolean;
}

export interface PreferenceConflict {
  upperIndex: number;
  lowerIndex: number;
  upperUniCode: string;
  lowerUniCode: string;
  upperCutoff: number;
  lowerCutoff: number;
  message: string;
}

/**
 * Scans the student's ordered UGC preference list.
 * Flags any pair where Preference #N has a lower historical district cutoff Z-score
 * than Preference #(N+1), unless manually locked by the student.
 */
export function auditPreferenceOrder(items: PreferencePlanItem[]): PreferenceConflict[] {
  const conflicts: PreferenceConflict[] = [];

  for (let i = 0; i < items.length - 1; i++) {
    const current = items[i];
    const next = items[i + 1];

    if (current.locked || next.locked) continue;
    if (current.min_z_score === null || next.min_z_score === null) continue;

    if (current.min_z_score < next.min_z_score) {
      conflicts.push({
        upperIndex: i,
        lowerIndex: i + 1,
        upperUniCode: current.uni_code,
        lowerUniCode: next.uni_code,
        upperCutoff: current.min_z_score,
        lowerCutoff: next.min_z_score,
        message: `Warning: Your #${i + 1} choice (${current.uni_code} - Cutoff ${current.min_z_score.toFixed(4)}) has a lower Z-score requirement than your #${i + 2} choice (${next.uni_code} - Cutoff ${next.min_z_score.toFixed(4)}). If your Z-score exceeds ${next.min_z_score.toFixed(4)}, the UGC computer system will lock you into #${i + 1} and never evaluate #${i + 2}!`,
      });
    }
  }

  return conflicts;
}

/**
 * Sorts unlocked items by descending Z-score priority while keeping manually locked
 * items fixed at their chosen preference positions.
 */
export function optimizePreferenceOrder<T extends PreferencePlanItem>(items: T[]): T[] {
  const unlocked = items
    .filter((item) => !item.locked)
    .sort((a, b) => {
      const zA = a.min_z_score ?? -999;
      const zB = b.min_z_score ?? -999;
      return zB - zA;
    });

  let unlockedIdx = 0;
  return items.map((item) => {
    if (item.locked) return item;
    const replacement = unlocked[unlockedIdx];
    unlockedIdx += 1;
    return replacement;
  });
}

export interface SubjectGradePair {
  subject: string;
  grade: ALGrade;
}

export interface SubjectRequirementsSpec {
  required_subjects?: string[];
  any_of_subjects?: string[];
  min_grade?: ALGrade;
  notes?: string;
}

/**
 * Checks whether a student's chosen 3 A/L subject combination satisfies a course's
 * subject prerequisites (without requiring grades or Z-score, e.g. for pending-result students).
 */
export function checkSubjectCombinationEligibility(
  studentSubjectNames: string[],
  requirements: SubjectRequirementsSpec
): { eligible: boolean; reason: string } {
  const normSubs = studentSubjectNames.map((s) => s.trim().toLowerCase());

  if (requirements.required_subjects && requirements.required_subjects.length > 0) {
    for (const reqSub of requirements.required_subjects) {
      const found = normSubs.some((s) => s === reqSub.toLowerCase());
      if (!found) {
        return {
          eligible: false,
          reason: `Requires ${reqSub}.`,
        };
      }
    }
  }

  if (requirements.any_of_subjects && requirements.any_of_subjects.length > 0) {
    const hasOne = requirements.any_of_subjects.some((reqSub) =>
      normSubs.some((s) => s === reqSub.toLowerCase())
    );
    if (!hasOne) {
      return {
        eligible: false,
        reason: `Requires at least one of (${requirements.any_of_subjects.join(', ')}).`,
      };
    }
  }

  return { eligible: true, reason: 'Subject prerequisites satisfied.' };
}

export const GRADE_RANK: Record<ALGrade, number> = {
  A: 4,
  B: 3,
  C: 2,
  S: 1,
  F: 0,
};

/**
 * Multiset grade distribution matcher.
 * Matches student grades against required minimum grades invariant of subject array position.
 * E.g., for Medicine (2 C's and 1 S):
 * ['S', 'C', 'C'] -> sorted ranks [2, 2, 1] meets required [2, 2, 1] -> true
 */
export function matchGradeDistribution(
  studentGrades: (ALGrade | string)[],
  requiredGrades: (ALGrade | string)[]
): boolean {
  const studentRanks = studentGrades
    .map((g) => GRADE_RANK[g as ALGrade] ?? 0)
    .sort((a, b) => b - a);
  const requiredRanks = requiredGrades
    .map((g) => GRADE_RANK[g as ALGrade] ?? 0)
    .sort((a, b) => b - a);

  if (studentRanks.length < requiredRanks.length) return false;

  for (let i = 0; i < requiredRanks.length; i++) {
    if (studentRanks[i] < requiredRanks[i]) {
      return false;
    }
  }
  return true;
}

export function checkSubjectEligibility(
  studentSubjects: SubjectGradePair[],
  commonGeneralTestScore: number,
  requirements: SubjectRequirementsSpec
): { eligible: boolean; reason: string } {
  if (commonGeneralTestScore < 30) {
    return {
      eligible: false,
      reason: 'Common General Test score must be at least 30% for UGC university admission.',
    };
  }

  const passedCount = studentSubjects.filter((s) => GRADE_RANK[s.grade] >= GRADE_RANK.S).length;
  if (passedCount < 3) {
    return {
      eligible: false,
      reason: 'Minimum 3 passes (grade S or above) at a single sitting required.',
    };
  }

  const minGrade = requirements.min_grade ?? 'S';
  const minRank = GRADE_RANK[minGrade];

  if (requirements.required_subjects && requirements.required_subjects.length > 0) {
    for (const reqSub of requirements.required_subjects) {
      const found = studentSubjects.find(
        (s) => s.subject.toLowerCase() === reqSub.toLowerCase() && GRADE_RANK[s.grade] >= minRank
      );
      if (!found) {
        return {
          eligible: false,
          reason: `Requires ${reqSub} with at least grade '${minGrade}'.`,
        };
      }
    }
  }

  if (requirements.any_of_subjects && requirements.any_of_subjects.length > 0) {
    const hasOne = requirements.any_of_subjects.some((reqSub) =>
      studentSubjects.some(
        (s) => s.subject.toLowerCase() === reqSub.toLowerCase() && GRADE_RANK[s.grade] >= minRank
      )
    );
    if (!hasOne) {
      return {
        eligible: false,
        reason: `Requires at least one of (${requirements.any_of_subjects.join(', ')}) with grade '${minGrade}' or above.`,
      };
    }
  }

  return { eligible: true, reason: 'Meets 3-subject and Common General Test requirements.' };
}

export type { OlGrade, OlRequirementRule };

export const OL_GRADE_RANK: Record<OlGrade, number> = {
  A: 5,
  B: 4,
  C: 3,
  S: 2,
  W: 1,
  NONE: 0,
};

export interface StudentOlGrades {
  english?: OlGrade;
  mathematics?: OlGrade;
  science?: OlGrade;
  sinhala?: OlGrade;
  tamil?: OlGrade;
  sinhalaOrTamil?: OlGrade;
}

export interface OlEligibilityResult {
  meetsOl: boolean;
  missingOlSubjects: string[];
  olRule: OlRequirementRule | null;
}

/**
 * Section 5.3 G.C.E. (O/L) Requirements Evaluator
 * Compares a student's O/L subject letter grades against published UGC handbook criteria.
 */
export function evaluateOlEligibility(
  studentOl: StudentOlGrades,
  rule?: OlRequirementRule | null
): OlEligibilityResult {
  if (!rule) {
    return { meetsOl: true, missingOlSubjects: [], olRule: null };
  }

  const missing: string[] = [];

  // English check
  if (rule.english) {
    const studentGrade = studentOl.english ?? 'NONE';
    const reqRank = OL_GRADE_RANK[rule.english];
    const stuRank = OL_GRADE_RANK[studentGrade];
    if (stuRank < reqRank) {
      missing.push(`English: ${rule.english} (You have ${studentGrade === 'NONE' ? 'None' : studentGrade})`);
    }
  }

  // Mathematics check
  if (rule.mathematics) {
    const studentGrade = studentOl.mathematics ?? 'NONE';
    const reqRank = OL_GRADE_RANK[rule.mathematics];
    const stuRank = OL_GRADE_RANK[studentGrade];
    if (stuRank < reqRank) {
      missing.push(`Maths: ${rule.mathematics} (You have ${studentGrade === 'NONE' ? 'None' : studentGrade})`);
    }
  }

  // Science check
  if (rule.science) {
    const studentGrade = studentOl.science ?? 'NONE';
    const reqRank = OL_GRADE_RANK[rule.science];
    const stuRank = OL_GRADE_RANK[studentGrade];
    if (stuRank < reqRank) {
      missing.push(`Science: ${rule.science} (You have ${studentGrade === 'NONE' ? 'None' : studentGrade})`);
    }
  }

  // Sinhala check (e.g. Course 137 Primary Education)
  if (rule.sinhala) {
    const studentGrade = studentOl.sinhala ?? studentOl.sinhalaOrTamil ?? 'NONE';
    const reqRank = OL_GRADE_RANK[rule.sinhala];
    const stuRank = OL_GRADE_RANK[studentGrade];
    if (stuRank < reqRank) {
      missing.push(`Sinhala: ${rule.sinhala} (You have ${studentGrade === 'NONE' ? 'None' : studentGrade})`);
    }
  }

  // Sinhala OR Tamil check (e.g. Courses 025 Law, 098 Translation Studies)
  if (rule.sinhala_or_tamil) {
    const studentSinhala = studentOl.sinhala ?? studentOl.sinhalaOrTamil ?? 'NONE';
    const studentTamil = studentOl.tamil ?? studentOl.sinhalaOrTamil ?? 'NONE';
    const reqRank = OL_GRADE_RANK[rule.sinhala_or_tamil];
    const sinhalaRank = OL_GRADE_RANK[studentSinhala];
    const tamilRank = OL_GRADE_RANK[studentTamil];
    if (sinhalaRank < reqRank && tamilRank < reqRank) {
      const best = Math.max(sinhalaRank, tamilRank);
      const bestGrade = (Object.keys(OL_GRADE_RANK) as OlGrade[]).find((k) => OL_GRADE_RANK[k] === best) ?? 'NONE';
      missing.push(`Sinhala or Tamil: ${rule.sinhala_or_tamil} (You have ${bestGrade === 'NONE' ? 'None' : bestGrade})`);
    }
  }

  return {
    meetsOl: missing.length === 0,
    missingOlSubjects: missing,
    olRule: rule,
  };
}

export interface CourseAcademicEligibilityParams {
  courseCode: string;
  studentSubjects?: SubjectGradePair[];
  commonGeneralScore?: number | null;
  studentOlGrades?: StudentOlGrades;
}

export interface CourseAcademicEligibilityResult {
  status: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'FURTHER_CHECKING_NEEDED';
  autoDecisionSafe: boolean;
  reason: string;
  sourceRequirementText?: string;
  sourceSection?: string;
}

/**
 * Conservative Course Academic Eligibility Evaluator.
 * Treats machine-evaluable rules as course-level academic checks, not proof of complete admission eligibility.
 * For incomplete rules or missing student information, returns FURTHER_CHECKING_NEEDED while keeping the course discoverable.
 */
// Normalize explicit subject aliases without confusing Mathematics with Combined Mathematics.
function subjectKey(subject: string): string {
  return subject.trim().toLowerCase()
    .replace(/\s*\((?:ict|sft|et|bst)\)\s*$/i, '')
    .replace(/\band\b/g, '&').replace(/\s+/g, ' ');
}

/** Unknown requirements stay discoverable under academic filters. */
export function isAcademicResultDiscoverable(result: CourseAcademicEligibilityResult): boolean {
  return result.status !== 'NOT_ELIGIBLE';
}

export function evaluateCourseAcademicEligibility(
  params: CourseAcademicEligibilityParams
): CourseAcademicEligibilityResult {
  const { courseCode, studentSubjects, commonGeneralScore, studentOlGrades } = params;
  const elig = eligibilityByCourse.get(courseCode);
  const conds = elig?.conditions;
  const result = (status: CourseAcademicEligibilityResult['status'], reason: string): CourseAcademicEligibilityResult => ({
    status, reason, autoDecisionSafe: elig?.auto_decision_safe ?? false,
    sourceRequirementText: conds?.al_requirement_summary, sourceSection: elig?.source_section,
  });
  if (!elig || !conds) return result('FURTHER_CHECKING_NEEDED', 'Course eligibility record not found in the handbook dataset.');
  if (!elig.auto_decision_safe || !conds.machine_evaluable_conditions?.is_complete_for_auto_decision) {
    return result('FURTHER_CHECKING_NEEDED', 'Course requirements include conditions requiring manual review.');
  }
  if (!studentSubjects || studentSubjects.length !== 3 || studentSubjects.some(s => !s.subject.trim() || !(s.grade in GRADE_RANK))) {
    return result('FURTHER_CHECKING_NEEDED', 'Three A/L subjects and grades not entered completely.');
  }
  const subjects = new Map(studentSubjects.map(s => [subjectKey(s.subject), s.grade]));
  if (subjects.size !== 3) return result('FURTHER_CHECKING_NEEDED', 'Enter three different A/L subjects.');
  if (studentSubjects.some(s => GRADE_RANK[s.grade] < GRADE_RANK.S)) {
    return result('NOT_ELIGIBLE', 'Minimum three A/L passes (S or higher) required at one sitting.');
  }

  const rule = conds.machine_evaluable_conditions.al_fixed_subject_rule;
  if (!rule || !['AND', 'ANY_THREE_APPROVED_AL_SUBJECTS'].includes(rule.operator)) {
    return result('FURTHER_CHECKING_NEEDED', 'This subject rule requires further checking.');
  }
  if (rule.operator === 'AND') {
    const required = rule.required_subjects ?? [];
    const matchedGrades: ALGrade[] = [];
    for (const subject of required) {
      const grade = subjects.get(subjectKey(subject));
      if (!grade) return result('NOT_ELIGIBLE', `Missing required subject: ${subject}.`);
      matchedGrades.push(grade);
    }
    if (rule.third_subject_one_of) {
      const alternatives = rule.third_subject_one_of.filter(s => !required.some(r => subjectKey(r) === subjectKey(s)));
      const third = alternatives.find(s => subjects.has(subjectKey(s)));
      if (!third) return result('NOT_ELIGIBLE', `Requires a third subject from: ${alternatives.join(', ')}.`);
      matchedGrades.push(subjects.get(subjectKey(third))!);
    }
    if (rule.minimum_grades_distribution && !matchGradeDistribution(matchedGrades, rule.minimum_grades_distribution)) {
      return result('NOT_ELIGIBLE', `Grades do not meet the required distribution (${rule.minimum_grades_distribution.join(', ')}).`);
    }
    for (const [subject, minimum] of Object.entries(rule.subject_minimum_grades ?? {})) {
      const grade = subjects.get(subjectKey(subject));
      if (!(minimum in GRADE_RANK)) return result('FURTHER_CHECKING_NEEDED', 'Unrecognized minimum grade in the source rule.');
      if (!grade || GRADE_RANK[grade] < GRADE_RANK[minimum as ALGrade]) {
        return result('NOT_ELIGIBLE', `Requires ${subject} grade ${minimum} or above.`);
      }
    }
  }

  const missing: string[] = [];
  const ol = conds.machine_evaluable_conditions.ol_minimum_grades;
  const fields: Record<string, keyof StudentOlGrades> = {
    english: 'english', mathematics: 'mathematics', science: 'science',
    sinhala_language_and_literature: 'sinhala', tamil_language_and_literature: 'tamil',
  };
  for (const [subject, minimum] of Object.entries(ol ?? {})) {
    if (!minimum) continue;
    const field = fields[subject];
    if (!field || !(minimum in OL_GRADE_RANK)) {
      return result('FURTHER_CHECKING_NEEDED', 'An O/L condition requires manual review.');
    }
    const grade = studentOlGrades?.[field];
    if (!grade || grade === 'NONE') { missing.push(subject.replace(/_/g, ' ')); continue; }
    if (OL_GRADE_RANK[grade] < OL_GRADE_RANK[minimum as OlGrade]) {
      return result('NOT_ELIGIBLE', `Requires G.C.E. (O/L) ${subject.replace(/_/g, ' ')} grade ${minimum} or above (you have ${grade}).`);
    }
  }
  if (missing.length) return result('FURTHER_CHECKING_NEEDED', `O/L grades still needed: ${missing.join(', ')}.`);
  if (commonGeneralScore == null || !Number.isFinite(commonGeneralScore) || commonGeneralScore < 0 || commonGeneralScore > 100) {
    return result('FURTHER_CHECKING_NEEDED', 'Enter the applicable Common General Paper mark.');
  }
  if (commonGeneralScore < 30) {
    return result('FURTHER_CHECKING_NEEDED', 'Common General Paper registration requirement needs checking: a qualifying previous or future attempt may apply under Section 1.2.');
  }
  return result('ELIGIBLE', 'Entered academic requirements match; admission remains subject to general conditions and official selection.');
}
