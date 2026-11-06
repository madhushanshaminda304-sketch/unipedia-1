import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const stagingDir = path.join(rootDir, 'data-staging', 'ugc-2025-2026');
const outDir = path.join(rootDir, 'src', 'data', 'ugc');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('--- Syncing UGC 2025/2026 Staged Dataset to src/data/ugc ---');

// 1. Copy institutions.json
const instPath = path.join(stagingDir, 'institutions.json');
const instData = JSON.parse(fs.readFileSync(instPath, 'utf8'));
fs.writeFileSync(path.join(outDir, 'institutions.json'), JSON.stringify(instData, null, 2), 'utf8');
console.log(`Synced institutions.json (${instData.length} institutions)`);

// 2. Copy courses.json
const coursesPath = path.join(stagingDir, 'courses.json');
const coursesData = JSON.parse(fs.readFileSync(coursesPath, 'utf8'));
fs.writeFileSync(path.join(outDir, 'courses.json'), JSON.stringify(coursesData, null, 2), 'utf8');
console.log(`Synced courses.json (${coursesData.length} courses: ${coursesData.filter(c => c.status === 'active').length} active + ${coursesData.filter(c => c.status === 'temporarily_suspended').length} suspended)`);

// 3. Copy offerings.json
const offeringsPath = path.join(stagingDir, 'offerings.json');
const offeringsData = JSON.parse(fs.readFileSync(offeringsPath, 'utf8'));
fs.writeFileSync(path.join(outDir, 'offerings.json'), JSON.stringify(offeringsData, null, 2), 'utf8');
console.log(`Synced offerings.json (${offeringsData.length} offerings: ${offeringsData.filter(o => o.is_selectable_unicode_offering).length} selectable + ${offeringsData.filter(o => !o.is_selectable_unicode_offering).length} additional intake aggregate)`);

// 4. Copy eligibility.json
const eligibilityPath = path.join(stagingDir, 'eligibility.json');
const eligibilityData = JSON.parse(fs.readFileSync(eligibilityPath, 'utf8'));
fs.writeFileSync(path.join(outDir, 'eligibility.json'), JSON.stringify(eligibilityData, null, 2), 'utf8');
console.log(`Synced eligibility.json (${eligibilityData.length} records: 1 general + ${eligibilityData.length - 1} course records)`);

// 5. Generate client-optimized historicalCutoffs.json
const cutoffsPath = path.join(stagingDir, 'historical-cutoffs-2024-2025.json');
const cutoffsRaw = JSON.parse(fs.readFileSync(cutoffsPath, 'utf8'));

// District name to ID 1..25 map
const DISTRICT_NAMES_TO_ID = {
  COLOMBO: 1,
  GAMPAHA: 2,
  KALUTARA: 3,
  MATALE: 4,
  KANDY: 5,
  'NUWARA ELIYA': 6,
  GALLE: 7,
  MATARA: 8,
  HAMBANTOTA: 9,
  JAFFNA: 10,
  KILINOCHCHI: 11,
  MANNAR: 12,
  MULLAITIVU: 13,
  VAVUNIYA: 14,
  TRINCOMALEE: 15,
  BATTICALOA: 16,
  AMPARA: 17,
  PUTTALAM: 18,
  KURUNEGALA: 19,
  ANURADHAPURA: 20,
  POLONNARUWA: 21,
  BADULLA: 22,
  MONARAGALA: 23,
  KEGALLE: 24,
  RATNAPURA: 25,
};

const clientCutoffs = {
  dataset_title: cutoffsRaw.dataset_title,
  admission_year: cutoffsRaw.admission_year,
  examination_basis: cutoffsRaw.examination_basis,
  handbook_edition: cutoffsRaw.handbook_edition,
  legend: cutoffsRaw.legend,
  summary_counts: cutoffsRaw.summary_counts,
  source_file: cutoffsRaw.source_file,
  source_section: cutoffsRaw.source_section,
  printed_page_range: cutoffsRaw.printed_page_range,
  columns: cutoffsRaw.columns.map((col) => {
    return {
      column_id: col.column_id,
      admission_year: col.admission_year,
      examination_year: col.examination_year,
      raw_column_header: col.raw_column_header,
      uni_code_2025_2026: col.uni_code_2025_2026,
      course_code_2025_2026: col.course_code_2025_2026,
      institution_id: col.institution_id,
      institution_name_in_header: col.institution_name_in_header,
      course_title_in_header: col.course_title_in_header,
      stream_or_category_qualifier: col.stream_or_category_qualifier,
      all_island_merit_marker: col.all_island_merit_marker,
      practical_or_aptitude_marker: col.practical_or_aptitude_marker,
      mapping_status: col.mapping_status,
      mapping_note: col.mapping_note,
      district_cutoffs: col.districts.map((d) => ({
        district_id: DISTRICT_NAMES_TO_ID[d.district] || 0,
        district_name: d.district,
        z_score: d.z_score,
        is_nqc: d.is_nqc,
        raw_value: d.raw_value,
      })),
    };
  }),
};

fs.writeFileSync(path.join(outDir, 'historicalCutoffs.json'), JSON.stringify(clientCutoffs, null, 2), 'utf8');
console.log(`Synced historicalCutoffs.json (${clientCutoffs.columns.length} columns, ${clientCutoffs.columns.length * 25} district cutoff values)`);

console.log('--- Verification: Verifying zero discrepancy against data-staging ---');

// Verify counts
if (instData.length !== 23) throw new Error(`Institution count mismatch: ${instData.length} !== 23`);
if (coursesData.length !== 129) throw new Error(`Courses count mismatch: ${coursesData.length} !== 129`);
if (offeringsData.length !== 256) throw new Error(`Offerings count mismatch: ${offeringsData.length} !== 256`);
if (eligibilityData.length !== 122) throw new Error(`Eligibility count mismatch: ${eligibilityData.length} !== 122`);
if (clientCutoffs.columns.length !== 266) throw new Error(`Cutoff column count mismatch: ${clientCutoffs.columns.length} !== 266`);

// Verify exact cutoff transcription for negative scores and NQC
let verifiedNumeric = 0;
let verifiedNqc = 0;
let verifiedNegative = 0;

for (let i = 0; i < cutoffsRaw.columns.length; i++) {
  const rawCol = cutoffsRaw.columns[i];
  const clientCol = clientCutoffs.columns[i];
  if (rawCol.column_id !== clientCol.column_id) throw new Error(`Column ID mismatch at ${i}`);
  for (let j = 0; j < 25; j++) {
    const rawD = rawCol.districts[j];
    const clientD = clientCol.district_cutoffs[j];
    if (rawD.z_score !== clientD.z_score) throw new Error(`Z-score mismatch at ${rawCol.column_id} ${rawD.district}`);
    if (rawD.is_nqc !== clientD.is_nqc) throw new Error(`NQC mismatch at ${rawCol.column_id} ${rawD.district}`);
    if (rawD.raw_value !== clientD.raw_value) throw new Error(`Raw value mismatch at ${rawCol.column_id} ${rawD.district}`);
    if (clientD.is_nqc) verifiedNqc++;
    else verifiedNumeric++;
    if (clientD.z_score !== null && clientD.z_score < 0) verifiedNegative++;
  }
}

console.log(`Verification Passed: ${verifiedNumeric} numeric scores (${verifiedNegative} negative scores preserved), ${verifiedNqc} NQC values verified 100% identical.`);
console.log('Client dataset preparation complete.');
