import { describe, it, expect } from 'vitest';
import {
  getInstitutions,
  getActiveCourses,
  getSuspendedCourses,
  getSelectableOfferings,
  getOfferingByUniCode,
  getProgramCutoffRowsForDistrict,
  getAllDistrictCutoffsForUniCode,
  getCutoffForOfferingAndDistrict,
  migrateSavedPlan,
  getDatasetSummaryCounts,
} from '../ugcAdapter';

describe('UGC Adapter — Centralized Authoritative Data Service', () => {
  it('loads exact counts from the official 2025/2026 dataset', () => {
    const insts = getInstitutions();
    expect(insts).toHaveLength(23);

    const activeCourses = getActiveCourses();
    expect(activeCourses).toHaveLength(121);

    const suspendedCourses = getSuspendedCourses();
    expect(suspendedCourses).toHaveLength(8);

    const offerings = getSelectableOfferings();
    expect(offerings).toHaveLength(255);

    const counts = getDatasetSummaryCounts('2024/2025');
    expect(counts.institutionsCount).toBe(23);
    expect(counts.activeCoursesCount).toBe(121);
    expect(counts.selectableOfferingsCount).toBe(255);
    expect(counts.totalCutoffCells).toBe(6650);
  });

  it('excludes Additional Intake aggregate record (900) from selectable offerings', () => {
    const offerings = getSelectableOfferings();
    const hasAggregate = offerings.some((o) => !o.is_selectable_unicode_offering || o.uni_code === null);
    expect(hasAggregate).toBe(false);
  });

  it('retrieves canonical course and institution details for Medicine (001A)', () => {
    const offering = getOfferingByUniCode('001A');
    expect(offering).toBeDefined();
    expect(offering?.course_code).toBe('001');
    expect(offering?.institution_id).toBe('CMB');
    expect(offering?.proposed_intake).toBe(224);
    expect(offering?.duration).toBe('5 years');
  });

  it('performs exact cutoff lookup and preserves negative scores (015W Mullaitivu)', () => {
    // 015W at Mullaitivu (District 13) has published cutoff -0.0096 in Section 9
    const cutoff = getCutoffForOfferingAndDistrict('015W', 13, undefined, '2024/2025');
    expect(cutoff.status).toBe('QUALIFIED');
    expect(cutoff.min_z_score).toBe(-0.0096);
    expect(cutoff.raw_value).toBe('-0.0096');
  });

  it('distinguishes NQC from missing history', () => {
    // Find an NQC cell in district 1
    const colomboRows = getProgramCutoffRowsForDistrict(1,undefined,'2024/2025');
    const nqcRow = colomboRows.find((r) => r.status === 'NQC');
    expect(nqcRow).toBeDefined();
    expect(nqcRow?.min_z_score).toBeNull();
    expect(nqcRow?.status).toBe('NQC');

    // New course offering without 2024/2025 cutoff (e.g. 142F or 141D)
    const newCourseRow = colomboRows.find((r) => r.uni_code === '141D');
    expect(newCourseRow).toBeDefined();
    expect(newCourseRow?.status).toBe('NO_HISTORICAL_CUTOFF');
    expect(newCourseRow?.min_z_score).toBeNull();
  });

  it('does not automatically attach ambiguous Kelaniya sports cutoff to 141D', () => {
    const kelaniya141D = getCutoffForOfferingAndDistrict('141D', 1,undefined,'2024/2025');
    expect(kelaniya141D.status).toBe('NO_HISTORICAL_CUTOFF');
    expect(kelaniya141D.min_z_score).toBeNull();
  });

  it('handles category splits accurately for 021L, 022R, 022W, 027D, and 107L', () => {
    // 021L: Arts vs Commerce stream split
    const artsSplit = getCutoffForOfferingAndDistrict('021L', 1, 'Arts');
    expect(artsSplit.selected_category_qualifier).toContain('Arts');

    const commSplit = getCutoffForOfferingAndDistrict('021L', 1, 'Commerce');
    expect(commSplit.selected_category_qualifier).toContain('Commerce');

    // Unknown stream asks for clarification and returns options
    const unknownSplit = getCutoffForOfferingAndDistrict('021L', 1, undefined);
    expect(unknownSplit.needs_category_clarification).toBe(true);
    expect(unknownSplit.category_split_options).toBeDefined();
    expect(unknownSplit.category_split_options?.length).toBe(2);

    // 027D: Bio Science vs Other stream
    const bioSplit = getCutoffForOfferingAndDistrict('027D', 1, 'Biological Science');
    expect(bioSplit.selected_category_qualifier).toContain('BIO SCIENCE');

    const otherSplit = getCutoffForOfferingAndDistrict('027D', 1, 'Physical Science');
    expect(otherSplit.selected_category_qualifier).toContain('OTHER');
  });

  it('renders unknown degree titles, duration, and medium honestly without guessing old values', () => {
    const colomboRows = getProgramCutoffRowsForDistrict(1);
    // 001A Medicine has degree title not stated in Section 2.2
    const medRow = colomboRows.find((r) => r.uni_code === '001A');
    expect(medRow).toBeDefined();
    expect(medRow?.degree_display).toBe('Not stated in this handbook');
    expect(medRow?.duration_display).toBe('5 years');

    // 019 Arts has duration not stated in Section 2.2
    const artsRow = colomboRows.find((r) => r.course_code === '019');
    expect(artsRow).toBeDefined();
    expect(artsRow?.duration_display).toBe('Not stated in this handbook');
  });

  it('protects existing saved plans and detects ambiguous old codes with migration paths', () => {
    const oldSaved = [
      { uni_code: '008G', locked: false }, // Valid Moratuwa Eng
      { uni_code: '020S', locked: false }, // Ambiguous (mislabeled Law, actually Mass Media)
      { uni_code: '020A', locked: false }, // Old Law Colombo -> 025A
      { uni_code: '096G', locked: false }, // Old AI Moratuwa -> 130G
      { uni_code: '140P', locked: false }, // Suspended
    ];

    const migration = migrateSavedPlan(oldSaved);
    expect(migration.hasModifications).toBe(true);
    expect(migration.flaggedCount).toBe(4);

    const mig008G = migration.migratedEntries.find((e) => e.uni_code === '008G');
    expect(mig008G?.migrationStatus).toBe('valid');

    const mig020S = migration.migratedEntries.find((e) => e.originalCode === '020S');
    expect(mig020S?.migrationStatus).toBe('ambiguous');
    expect(mig020S?.migrationNote).toContain('Mass Media');

    const mig020A = migration.migratedEntries.find((e) => e.originalCode === '020A');
    expect(mig020A?.migrationStatus).toBe('ambiguous');
    expect(mig020A?.uni_code).toBe('020A');
    expect(mig020A?.suggestedUniCode).toBe('025A');

    const mig096G = migration.migratedEntries.find((e) => e.originalCode === '096G');
    expect(mig096G?.migrationStatus).toBe('ambiguous');
    expect(mig096G?.uni_code).toBe('096G');
    expect(mig096G?.suggestedUniCode).toBe('117G');

    const mig140P = migration.migratedEntries.find((e) => e.originalCode === '140P');
    expect(mig140P?.migrationStatus).toBe('ambiguous');
    expect(mig140P?.migrationNote).toContain('suspended');
  });

  it('provides compact source reference for every program row', () => {
    const colomboRows = getProgramCutoffRowsForDistrict(1);
    const firstRow = colomboRows[0];
    expect(firstRow.source_reference).toBeDefined();
    expect(firstRow.source_reference.handbook_edition).toContain('2025/2026');
    expect(firstRow.source_reference.admission_year).toBe('2025/2026');
    expect(firstRow.source_reference.historical_cutoff_year).toBe('2025/2026');
    expect(firstRow.source_reference.review_status).toBe('needs_review');
  });
});
