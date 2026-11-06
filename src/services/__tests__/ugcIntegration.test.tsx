import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { evaluateCourseAcademicEligibility, isAcademicResultDiscoverable, classifyProgramMatch, type SubjectGradePair } from '../../lib/ugcLogic';
import { acceptSavedPlanSuggestion, getProgramCutoffRowsForDistrict, getCutoffForOfferingAndDistrict, migrateSavedPlan, getOfferingByUniCode } from '../ugcAdapter';
import { ProgramChanceCard } from '../../components/ProgramChanceCard';

vi.mock('../../context/AppContext', () => ({ useApp: () => ({
  planEntries: [], compareList: [], addToPlan: vi.fn(), removeFromPlan: vi.fn(),
  toggleCompare: vi.fn(), openInstitutionProfile: vi.fn(),
}) }));

describe('UGC user-facing integration regressions', () => {
  const medicalSubjects = ['Biology', 'Chemistry', 'Physics'];
  it.each([['S', 'C', 'C'], ['C', 'S', 'C'], ['C', 'C', 'S']] as const)(
    'keeps Medicine discoverable and renders its academic match for grades %s/%s/%s', (...grades) => {
      const studentSubjects: SubjectGradePair[] = medicalSubjects.map((subject, i) => ({ subject, grade: grades[i] }));
      const academicEligibility = evaluateCourseAcademicEligibility({ courseCode: '001', studentSubjects, commonGeneralScore: 40 });
      expect(isAcademicResultDiscoverable(academicEligibility)).toBe(true);
      expect(academicEligibility.status).toBe('ELIGIBLE');
      const row = getProgramCutoffRowsForDistrict(1).find(p => p.uni_code === '001A')!;
      expect(renderToStaticMarkup(<ProgramChanceCard program={row} academicEligibility={academicEligibility} />)).toContain('Academic requirements match');
    }
  );
  it('keeps incomplete rules discoverable and renders the uncertainty', () => {
    const academicEligibility = evaluateCourseAcademicEligibility({ courseCode: '096' });
    expect(academicEligibility.status).toBe('FURTHER_CHECKING_NEEDED');
    expect(isAcademicResultDiscoverable(academicEligibility)).toBe(true);
    const row = getProgramCutoffRowsForDistrict(1).find(p => p.uni_code === '096T')!;
    expect(renderToStaticMarkup(<ProgramChanceCard program={row} academicEligibility={academicEligibility} />)).toContain('Further checking needed');
  });
  it('checks Pharmacy Chemistry and actual O/L English without rejecting unknown grades', () => {
    const studentSubjects: SubjectGradePair[] = [
      { subject: 'Biology', grade: 'S' }, { subject: 'Chemistry', grade: 'C' }, { subject: 'Physics', grade: 'S' },
    ];
    const check = (english?: 'S' | 'W' | 'NONE') => evaluateCourseAcademicEligibility({ courseCode: '051', studentSubjects, commonGeneralScore: 40, studentOlGrades: { english } });
    expect(check('S').status).toBe('ELIGIBLE');
    expect(check('W').status).toBe('NOT_ELIGIBLE');
    expect(check('NONE').status).toBe('FURTHER_CHECKING_NEEDED');
    expect(evaluateCourseAcademicEligibility({ courseCode: '051', commonGeneralScore: 40,
      studentSubjects: studentSubjects.map(s => ({ ...s, grade: 'S' })), studentOlGrades: { english: 'S' } }).status).toBe('NOT_ELIGIBLE');
  });
  it('evaluates the third Technology subject and explicit aliases', () => {
    const studentSubjects: SubjectGradePair[] = [
      { subject: 'Information & Communication Technology', grade: 'S' },
      { subject: 'Science for Technology', grade: 'S' },
      { subject: 'Engineering Technology', grade: 'S' },
    ];
    expect(evaluateCourseAcademicEligibility({ courseCode: '104', studentSubjects, commonGeneralScore: 40 }).status).toBe('ELIGIBLE');
    studentSubjects[2] = { subject: 'Accounting', grade: 'A' };
    expect(evaluateCourseAcademicEligibility({ courseCode: '104', studentSubjects, commonGeneralScore: 40 }).status).toBe('NOT_ELIGIBLE');
  });
  it('keeps missing general marks and duplicate subjects incomplete', () => {
    const studentSubjects: SubjectGradePair[] = medicalSubjects.map(subject => ({ subject, grade: 'A' }));
    expect(evaluateCourseAcademicEligibility({ courseCode: '001', studentSubjects }).status).toBe('FURTHER_CHECKING_NEEDED');
    expect(evaluateCourseAcademicEligibility({ courseCode: '001', commonGeneralScore: 40, studentSubjects: [studentSubjects[0], studentSubjects[0], studentSubjects[2]] }).status).toBe('FURTHER_CHECKING_NEEDED');
  });
  it.each(['ALL', '', 'unknown', undefined])('does not choose split categories for unknown stream %s', stream => {
    for (const code of ['021L', '022R', '022W', '027D', '107L']) {
      const result = getCutoffForOfferingAndDistrict(code, 1, stream);
      expect(result.needs_category_clarification).toBe(true);
      expect(result.min_z_score).toBeNull();
      expect(result.category_split_options).toHaveLength(2);
    }
  });
  it('suggests canonical AI without changing the saved code until explicit acceptance', () => {
    const original = [{ uni_code: '096G', locked: true }];
    const pending = migrateSavedPlan(original).migratedEntries;
    expect(original[0].uni_code).toBe('096G');
    expect(pending[0].uni_code).toBe('096G');
    expect(pending[0].suggestedUniCode).toBe('117G');
    expect(getOfferingByUniCode('117G')?.course_title_unicode_table).toBe('ARTIFICIAL INTELLIGENCE');
    const accepted = acceptSavedPlanSuggestion(pending, '096G');
    expect(accepted[0].uni_code).toBe('117G');
    expect(accepted[0].locked).toBe(true);
    expect(migrateSavedPlan(accepted).migratedEntries[0].migrationStatus).toBe('valid');
    expect(migrateSavedPlan(original).migratedEntries[0].uni_code).toBe('096G');
    const earlierBadMigration = migrateSavedPlan([{ uni_code: '130G', originalCode: '096G', locked: false }]).migratedEntries;
    expect(earlierBadMigration[0].uni_code).toBe('130G');
    expect(earlierBadMigration[0].suggestedUniCode).toBe('117G');
    expect(acceptSavedPlanSuggestion(earlierBadMigration, '130G')[0].uni_code).toBe('117G');
  });
  it('does not select a Law university for an ambiguous Mass Media code', () => {
    const pending = migrateSavedPlan([{ uni_code: '020S', locked: false }]).migratedEntries;
    expect(pending[0].suggestedUniCode).toBeUndefined();
    expect(acceptSavedPlanSuggestion(pending, '020S')[0].uni_code).toBe('020S');
  });
  it('uses sourced quotas and exact all-island values without manufactured ranges', () => {
    const rows = getProgramCutoffRowsForDistrict(1, 'Arts');
    expect(rows.find(r => r.uni_code === '001A')?.differently_abled_quota).toBeNull();
    expect(rows.find(r => r.uni_code === '007R')?.differently_abled_quota).toBe(1);
    const arts = rows.find(r => r.uni_code === '019A')!;
    expect(arts.all_island_max_z).toBe(arts.min_z_score);
    const result = classifyProgramMatch({ studentZ: 2, minZScore: arts.min_z_score, status: arts.status, allIslandMeritOnly: true, allIslandZScore: arts.all_island_max_z });
    expect(result.effectiveCutoff).toBe(arts.min_z_score);
  });
});
