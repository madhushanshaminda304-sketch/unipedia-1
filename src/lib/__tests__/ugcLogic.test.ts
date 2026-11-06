import { describe, it, expect } from 'vitest';
import {
  classifyProgramMatch,
  auditPreferenceOrder,
  optimizePreferenceOrder,
  checkSubjectCombinationEligibility,
  checkSubjectEligibility,
  evaluateOlEligibility,
  matchGradeDistribution,
  evaluateCourseAcademicEligibility,
} from '../ugcLogic';
import { OL_REQUIREMENTS_BY_COURSE_CODE } from '../../data/sriLankaUgcSnapshot';
import {
  fetchProgramCutoffsByDistrict,
  matchEligibleProgramsRpc,
  normalizeProgramCutoffRow,
} from '../../services/ugcDataService';

describe('ugcLogic — Sri Lankan UGC Z-Score & Preference Order Engine', () => {
  it('never treats NULL / NQC min_z_score as 0.0000', () => {
    const result = classifyProgramMatch({
      studentZ: 1.52,
      minZScore: null,
      status: 'NQC',
      allIslandMeritOnly: false,
    });
    expect(result.tier).toBe('NQC');
    expect(result.margin).toBeNull();
  });

  it('performs factual cutoff comparison (ABOVE_LAST_CUTOFF, BELOW_LAST_CUTOFF, CUTOFF_ONLY) with zero probability guessing', () => {
    // 1. Student Z is above last cutoff
    const above = classifyProgramMatch({
      studentZ: 1.52,
      minZScore: 1.4125,
      status: 'QUALIFIED',
      allIslandMeritOnly: false,
    });
    expect(above.tier).toBe('ABOVE_LAST_CUTOFF');
    expect(above.margin).toBeCloseTo(0.1075, 4);
    expect(above.label).toContain('Your Z: +0.1075');

    // 2. Student Z is below last cutoff
    const below = classifyProgramMatch({
      studentZ: 1.4,
      minZScore: 1.425,
      status: 'QUALIFIED',
      allIslandMeritOnly: false,
    });
    expect(below.tier).toBe('BELOW_LAST_CUTOFF');
    expect(below.margin).toBeCloseTo(-0.025, 4);
    expect(below.label).toContain('Your Z: -0.0250');

    // 3. Cutoff only (no student Z supplied)
    const cutoffOnly = classifyProgramMatch({
      studentZ: null,
      minZScore: 1.45,
      status: 'QUALIFIED',
      allIslandMeritOnly: false,
    });
    expect(cutoffOnly.tier).toBe('CUTOFF_ONLY');
    expect(cutoffOnly.margin).toBeNull();
    expect(cutoffOnly.effectiveCutoff).toBe(1.45);
  });

  it('detects Preference Order Conflicts when a lower-cutoff safety course is placed above a higher-cutoff dream course', () => {
    const preferences = [
      { uni_code: '013B', course_name: 'Physical Science', institution_code: 'UOP', min_z_score: 1.31, locked: false },
      { uni_code: '013A', course_name: 'Physical Science', institution_code: 'UOC', min_z_score: 1.485, locked: false },
    ];
    const conflicts = auditPreferenceOrder(preferences);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].upperIndex).toBe(0);
    expect(conflicts[0].lowerIndex).toBe(1);
    expect(conflicts[0].upperUniCode).toBe('013B');
    expect(conflicts[0].lowerUniCode).toBe('013A');
  });

  it('auto-optimizes preference order by descending Z-score while respecting locked hometown overrides', () => {
    const preferences = [
      { uni_code: '013B', course_name: 'Physical Science', institution_code: 'UOP', min_z_score: 1.31, locked: false },
      { uni_code: '008G', course_name: 'Engineering', institution_code: 'UOM', min_z_score: 1.985, locked: false },
      { uni_code: '013C', course_name: 'Physical Science', institution_code: 'UOJ', min_z_score: 1.12, locked: true },
      { uni_code: '013A', course_name: 'Physical Science', institution_code: 'UOC', min_z_score: 1.485, locked: false },
    ];
    const optimized = optimizePreferenceOrder(preferences);
    expect(optimized[0].uni_code).toBe('008G');
    expect(optimized[1].uni_code).toBe('013A');
    expect(optimized[2].uni_code).toBe('013C'); // Locked at index 2
    expect(optimized[3].uni_code).toBe('013B');
  });

  it('filters eligible uni_code programs accurately by 3-subject combination without fabricating a Z-score', () => {
    // Student with Physical Science subjects (Combined Maths, Physics, Chemistry)
    const physSubjects = ['Combined Mathematics', 'Physics', 'Chemistry'];

    // Engineering requirements: Combined Maths, Physics, Chemistry
    const engReq = {
      required_subjects: ['Combined Mathematics', 'Physics', 'Chemistry'],
    };
    const engCheck = checkSubjectCombinationEligibility(physSubjects, engReq);
    expect(engCheck.eligible).toBe(true);

    // Medicine requirements: Biology, Chemistry, Physics
    const medReq = {
      required_subjects: ['Biology', 'Chemistry', 'Physics'],
    };
    const medCheck = checkSubjectCombinationEligibility(physSubjects, medReq);
    expect(medCheck.eligible).toBe(false);
    expect(medCheck.reason).toContain('Requires Biology');

    // Computer Science pool requirement (e.g. at least one of Chemistry, Physics, ICT)
    const csReq = {
      required_subjects: ['Combined Mathematics'],
      any_of_subjects: ['Physics', 'Chemistry', 'Information & Communication Technology'],
    };
    const csCheck = checkSubjectCombinationEligibility(physSubjects, csReq);
    expect(csCheck.eligible).toBe(true);
  });

  it('validates 3-subject eligibility and minimum Common General Test (>= 30%)', () => {
    const passCheck = checkSubjectEligibility(
      [
        { subject: 'Combined Mathematics', grade: 'A' },
        { subject: 'Physics', grade: 'B' },
        { subject: 'Chemistry', grade: 'B' },
      ],
      65,
      { required_subjects: ['Combined Mathematics', 'Physics', 'Chemistry'], min_grade: 'C' }
    );
    expect(passCheck.eligible).toBe(true);

    const failCgt = checkSubjectEligibility(
      [
        { subject: 'Combined Mathematics', grade: 'A' },
        { subject: 'Physics', grade: 'A' },
        { subject: 'Chemistry', grade: 'A' },
      ],
      24,
      { required_subjects: ['Combined Mathematics', 'Physics', 'Chemistry'], min_grade: 'C' }
    );
    expect(failCgt.eligible).toBe(false);
    expect(failCgt.reason).toContain('Common General Test');
  });

  it('returns deterministic 25-district offline snapshot rows and RPC matches without live DB credentials', async () => {
    const colomboRows = await fetchProgramCutoffsByDistrict(1);
    expect(colomboRows.length).toBeGreaterThanOrEqual(40);
    const nqcRow = colomboRows.find((r) => r.status === 'NQC');
    expect(nqcRow).toBeDefined();
    expect(nqcRow?.min_z_score).toBeNull();

    const matches = await matchEligibleProgramsRpc({
      p_district_id: 1,
      p_student_z: 1.52,
      p_stream: 'Physical Science',
    });
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every((m) => m.stream === 'Physical Science' || m.stream === 'Other')).toBe(true);
  });

  it('normalizes both live Supabase SQL view columns and offline snapshot columns seamlessly', () => {
    // 1. Live Supabase v_program_cutoffs schema
    const supabaseRow = {
      uni_code: '008G',
      course_name_exact: 'Engineering',
      institution_code: 'UOM',
      institution_name_official: 'University of Moratuwa',
      stream: 'Physical Science',
      intake_capacity: '450',
      all_island_merit_only: false,
      requires_aptitude_test: false,
      z_score_numeric: '1.9850',
      cutoff_status: 'QUALIFIED',
      district_id: '1',
      district_name: 'Colombo',
      requires_special_ol: true,
      intake_suspended: false,
    };
    const normSupabase = normalizeProgramCutoffRow(supabaseRow);
    expect(normSupabase.uni_code).toBe('008G');
    expect(normSupabase.course_name).toBe('Engineering');
    expect(normSupabase.min_z_score).toBe(1.985);
    expect(normSupabase.status).toBe('QUALIFIED');
    expect(normSupabase.requires_ol_special).toBe(true);
    expect(normSupabase.is_suspended).toBe(false);

    // 2. Suspended course row
    const suspendedRow = {
      uni_code: '140P',
      course_name_exact: 'Service Management',
      institution_code: 'GWUIM',
      z_score_numeric: null,
      cutoff_status: 'NQC',
      intake_suspended: true,
    };
    const normSuspended = normalizeProgramCutoffRow(suspendedRow);
    expect(normSuspended.uni_code).toBe('140P');
    expect(normSuspended.is_suspended).toBe(true);
    expect(normSuspended.status).toBe('NQC');
    expect(normSuspended.min_z_score).toBeNull();

    // 3. Snapshot seed format
    const snapshotRow = {
      uni_code: '012T',
      course_name: 'Information Technology',
      institution_code: 'UCSC',
      min_z_score: 1.542,
      status: 'QUALIFIED',
      requires_ol_special: false,
      is_suspended: false,
    };
    const normSnapshot = normalizeProgramCutoffRow(snapshotRow);
    expect(normSnapshot.uni_code).toBe('012T');
    expect(normSnapshot.min_z_score).toBe(1.542);
    expect(normSnapshot.status).toBe('QUALIFIED');
    expect(normSnapshot.requires_ol_special).toBe(false);
    expect(normSnapshot.is_suspended).toBe(false);
  });

  it('evaluates G.C.E. O/L eligibility against Section 5.3 rules accurately', () => {
    // 027 MIT requires Maths (B) and English (C)
    const mitRule = OL_REQUIREMENTS_BY_COURSE_CODE['027'];
    expect(mitRule).toBeDefined();

    // 1. Student with Maths C (fails B requirement)
    const failMaths = evaluateOlEligibility(
      { mathematics: 'C', english: 'C' },
      mitRule
    );
    expect(failMaths.meetsOl).toBe(false);
    expect(failMaths.missingOlSubjects[0]).toContain('Maths: B');

    // 2. Student with Maths B and English C (passes)
    const passMit = evaluateOlEligibility(
      { mathematics: 'B', english: 'C' },
      mitRule
    );
    expect(passMit.meetsOl).toBe(true);
    expect(passMit.missingOlSubjects).toHaveLength(0);

    // 3. Law 025 requires English (C) and Sinhala OR Tamil (C)
    const lawRule = OL_REQUIREMENTS_BY_COURSE_CODE['025'];
    const passLawTamil = evaluateOlEligibility(
      { english: 'B', tamil: 'C' },
      lawRule
    );
    expect(passLawTamil.meetsOl).toBe(true);

    const failLawNoLang = evaluateOlEligibility(
      { english: 'B', sinhala: 'S', tamil: 'S' },
      lawRule
    );
    expect(failLawNoLang.meetsOl).toBe(false);
    expect(failLawNoLang.missingOlSubjects[0]).toContain('Sinhala or Tamil: C');

    // 4. Null rule passes immediately
    const noRule = evaluateOlEligibility({ english: 'S' }, null);
    expect(noRule.meetsOl).toBe(true);
  });

  describe('Conservative Eligibility Engine & Multiset Grade Permutations', () => {
    it('verifies Medicine grade distribution (2 Cs and 1 S) irrespective of subject array position', () => {

      // 1. Permutation 1: Biology=S, Chemistry=C, Physics=C -> PASS
      expect(matchGradeDistribution(['S', 'C', 'C'], ['C', 'C', 'S'])).toBe(true);

      // 2. Permutation 2: Biology=C, Chemistry=S, Physics=C -> PASS
      expect(matchGradeDistribution(['C', 'S', 'C'], ['C', 'C', 'S'])).toBe(true);

      // 3. Permutation 3: Biology=C, Chemistry=C, Physics=S -> PASS
      expect(matchGradeDistribution(['C', 'C', 'S'], ['C', 'C', 'S'])).toBe(true);

      // 4. Higher grades: Biology=A, Chemistry=B, Physics=C -> PASS
      expect(matchGradeDistribution(['A', 'B', 'C'], ['C', 'C', 'S'])).toBe(true);

      // 5. Insufficient grades: Biology=C, Chemistry=S, Physics=S (only one C) -> FAIL
      expect(matchGradeDistribution(['C', 'S', 'S'], ['C', 'C', 'S'])).toBe(false);

      // 6. Insufficient grades: Biology=A, Chemistry=S, Physics=F -> FAIL
      expect(matchGradeDistribution(['A', 'S', 'F'], ['C', 'C', 'S'])).toBe(false);
    });

    it('returns FURTHER_CHECKING_NEEDED for courses that require manual review (auto_decision_safe=false)', () => {

      // Arts (019) has complex subject baskets and auto_decision_safe=false
      const result = evaluateCourseAcademicEligibility({
        courseCode: '019',
        studentSubjects: [
          { subject: 'Sinhala', grade: 'B' },
          { subject: 'History', grade: 'B' },
          { subject: 'Political Science', grade: 'C' },
        ],
        commonGeneralScore: 55,
      });

      expect(result.status).toBe('FURTHER_CHECKING_NEEDED');
      expect(result.autoDecisionSafe).toBe(false);
      expect(result.reason).toContain('manual review');
      expect(result.sourceRequirementText).toBeDefined();
    });

    it('returns FURTHER_CHECKING_NEEDED when student subjects or grades are missing', () => {

      const result = evaluateCourseAcademicEligibility({
        courseCode: '001', // Medicine
        studentSubjects: [],
      });

      expect(result.status).toBe('FURTHER_CHECKING_NEEDED');
      expect(result.reason).toContain('not entered');
    });

    it('evaluates Medicine academic eligibility accurately with student subject combinations', () => {

      // Eligible student with Biology S, Chemistry C, Physics C
      const passResult = evaluateCourseAcademicEligibility({
        courseCode: '001',
        studentSubjects: [
          { subject: 'Biology', grade: 'S' },
          { subject: 'Chemistry', grade: 'C' },
          { subject: 'Physics', grade: 'C' },
        ],
        commonGeneralScore: 40,
      });
      expect(passResult.status).toBe('ELIGIBLE');

      // Ineligible student missing Biology
      const missingSubResult = evaluateCourseAcademicEligibility({
        courseCode: '001',
        studentSubjects: [
          { subject: 'Combined Mathematics', grade: 'A' },
          { subject: 'Chemistry', grade: 'A' },
          { subject: 'Physics', grade: 'A' },
        ],
        commonGeneralScore: 40,
      });
      expect(missingSubResult.status).toBe('NOT_ELIGIBLE');
      expect(missingSubResult.reason).toContain('Biology');
    });

    it('handles negative historical cutoffs accurately without treating them as zero or NQC', () => {

      const negMatch = classifyProgramMatch({
        studentZ: 0.1500,
        minZScore: -0.0096,
        status: 'QUALIFIED',
        allIslandMeritOnly: false,
      });

      expect(negMatch.tier).toBe('ABOVE_LAST_CUTOFF');
      expect(negMatch.effectiveCutoff).toBe(-0.0096);
      expect(negMatch.margin).toBeCloseTo(0.1596, 4);
      expect(negMatch.label).toContain('-0.0096');
    });

    it('handles new offerings with NO_HISTORICAL_CUTOFF cleanly', () => {

      const noCutoffMatch = classifyProgramMatch({
        studentZ: 1.52,
        minZScore: null,
        status: 'NO_HISTORICAL_CUTOFF',
        allIslandMeritOnly: false,
      });

      expect(noCutoffMatch.tier).toBe('NO_HISTORICAL_CUTOFF');
      expect(noCutoffMatch.effectiveCutoff).toBeNull();
      expect(noCutoffMatch.label).toContain('No 2024/25 Cutoff');
    });
  });
});
