# UniPedia.lk UGC Staged Dataset Integration Summary

## Update: official 2025/2026 cutoff release loaded

The website and data-service defaults now use UGC's separate 31 July 2026 cutoff release, based on 2025 A/L results. The 2024/2025 handbook cutoff snapshot is retained as a selectable previous year. There are 73 passing tests. See `docs/cutoff-years-and-advanced-filters-2026-11-05.md` for extraction evidence, source hashes and advanced filter behavior. Older year/default descriptions below describe the previous integration state.

## Local integration repair verification — 5 November 2026

This verification supersedes the earlier implementation and test claims below.

- Finder filters and grid/table results now share the conservative academic evaluator. Missing data and prose-only rules remain discoverable as further checking needed.
- Medicine grade permutations and Pharmacy subject-specific thresholds are preserved. Missing O/L grades are unknown, not failed; language-specific requirements are not inferred from a combined language field.
- Common General Paper uncertainty is not presented as a final admissions rejection. These checks do not establish complete general admission eligibility.
- Unknown/ALL streams require category clarification. Stream changes, including resetting to ALL, synchronize with the cutoff lookup.
- State UGC reads use the bundled 2025/2026 requirements and 2024/2025 cutoff snapshot. Configured legacy remote tables/RPCs and unversioned caches cannot override it. Other connected features retain their existing behavior.
- Removed invented cutoff ranges and the five-seat disability-quota default. Missing quotas remain null; known quotas use the cited offering record.
- Saved codes stay unchanged until explicit acceptance. Moratuwa AI is suggested as 117G; the earlier erroneous 130G migration can also be reviewed and corrected. Ambiguous Mass Media entries no longer default to a Law university. Original backup and restore remain available.
- Existing saved-plan metadata survives cutoff sorting. Duplicate-target suggestions are not silently merged.
- Browser checked: desktop Medicine S/C/C with the academic filter enabled; Information Systems remaining discoverable under manual review; a 390px phone result layout.
- Rendered-card regression tests cover the academic messages. Additional tests cover O/L grades, Technology subject alternatives, missing marks, unknown stream categories, saved-code acceptance, exact all-island cutoffs, null quotas, and isolation from legacy remote data.
- Verification: 44 tests pass; production TypeScript/Vite build succeeds. Screenshot evidence is stored in docs/qa/ugc-medicine-academic-match.png and docs/qa/ugc-phone-further-checking.png.
- Remaining limitations: original-PDF spot checks and prose-rule review remain outstanding. The existing mobile wizard/dock overlaps, some older wording/counts, cutoff-based plan ordering, and large JavaScript bundle need separate work. No deployment or remote database changes were made.

---

## Earlier integration handoff (retained for context)

**Academic Cycles Preserved**:
- **Admission Rules & Proposed Intake**: Academic Year 2025/2026 (UGC Handbook for 2025/2026 Admissions)
- **Historical Minimum Cut-off Z-Scores**: Academic Year 2024/2025 (Section 9, based on 2024 G.C.E. A/L Examination)
- **Dataset Review Status**: `needs_review` (not independently verified; no UGC endorsement or affiliation)

---

## 1. Summary of Changes

### Architecture & Single Data Adapter
- Created [src/services/ugcAdapter.ts](file:///c:/Users/DELL/Downloads/srilakan%20vuzopedia/src/services/ugcAdapter.ts) as the single authoritative state higher-education data layer.
- All state UGC views (Homepage, Finder / Predictor, Detail Drawer, Institutional & Course Profiles, Compare Engine, and Preference Simulator) now source directly from typed models and indexed datasets.
- Completely removed synthetic district-offset calculations (`colombo_base_z + difficulty_offset`). Every displayed cutoff is an exact published decimal from Section 9.

### Synchronized Client-Ready Datasets
- Created build sync script [scripts/sync-ugc-dataset.mjs](file:///c:/Users/DELL/Downloads/srilakan%20vuzopedia/scripts/sync-ugc-dataset.mjs) generating clean JSON files under `src/data/ugc/`:
  - `institutions.json`: 23 state universities and campuses.
  - `courses.json`: 129 courses (121 active + 8 suspended).
  - `offerings.json`: 256 records (255 selectable Uni-Codes + 1 additional intake aggregate).
  - `eligibility.json`: 122 course eligibility rule specifications.
  - `historicalCutoffs.json`: 266 Section 9 cutoff columns (6,650 district cutoff cells).

### Cutoff Precision & Category Splits
- Preserved all decimals and 64 negative minimum Z-score cutoffs (e.g., `015W` Mullaitivu: `-0.0096`).
- Distinct statuses maintained:
  - `QUALIFIED`: Numeric published minimum Z-score.
  - `NQC`: No Quota Allocated / No Qualified Candidate.
  - `NO_HISTORICAL_CUTOFF`: New 2025/2026 offering with no historical 2024/2025 cutoff published.
- Split-stream offerings (`021L`, `022R`, `022W`, `027D`, `107L`) resolve based on student's A/L stream, or display labeled options requesting clarification if stream is unknown.
- Ambiguous Kelaniya sports cutoff mapping is **not** attached to `141D`.

### Conservative Academic Eligibility & Permutation Invariance
- Implemented `matchGradeDistribution` in [src/lib/ugcLogic.ts](file:///c:/Users/DELL/Downloads/srilakan%20vuzopedia/src/lib/ugcLogic.ts) supporting multiset permutation matching (e.g. Medicine's requirement of 2 C's and 1 S grade is valid regardless of subject order).
- Conservative evaluation marks rules without automated execution as `FURTHER_CHECKING_NEEDED`, keeping courses discoverable while citing verbatim handbook requirements.
- "Not stated" aptitude status is strictly distinguished from "No aptitude test required".

### Honest Value Formatting & Separation of Duration vs Credits
- Unstated degree awards, duration, or medium format as `"Not stated in this handbook"`.
- Academic credit points (e.g. 120 / 128 credits) are kept separate from duration in years.
- Additional intake aggregate record (900 intake) is excluded from student-selectable programs.
- 8 suspended courses remain accessible for historical reference with clear suspension notices.

### Saved Plan Protection & Migration
- Detected ambiguous legacy codes (`020S` mislabeled Law, `020A`/`020B`/`020E`, `096G`, `140P`).
- Preserved user plans without silent destructive overrides.
- Added pre-migration backup in `localStorage` (`unipedia_pre_migration_backup`), review banner in [PreferenceSimulatorView.tsx](file:///c:/Users/DELL/Downloads/srilakan%20vuzopedia/src/components/PreferenceSimulatorView.tsx), and 1-click update/restore actions.

---

## 2. Test & Build Verification Results

| Verification Suite | Commands Executed | Result |
| :--- | :--- | :--- |
| **Unit & Integration Tests** | `npx vitest run` | **3 passed (3), 29 passed (29 tests)** |
| **TypeScript Compilation** | `tsc -b` | **0 errors, clean exit** |
| **Production Vite Build** | `vite build` | **Built in 6.17s** (`dist/` generated cleanly) |

### Key Test Coverage
- `ugcAdapter.test.ts`:
  1. Exact dataset counts (23 institutions, 121 active courses, 8 suspended, 255 selectable offerings, 6,650 cutoff cells).
  2. Exclusion of additional intake aggregate (900 seats).
  3. Canonical Medicine (`001A`) retrieval.
  4. Exact negative score preservation (`015W` Mullaitivu: `-0.0096`).
  5. Distinction of `NQC` vs `NO_HISTORICAL_CUTOFF` vs `QUALIFIED`.
  6. Prevention of sports cutoff attachment to `141D`.
  7. Category-split handling for `021L`, `022R`, `022W`, `027D`, `107L`.
  8. Honest unknown rendering (`"Not stated in this handbook"`).
  9. Saved plan migration and flag detection (`020S`, `020A`, `096G`, `140P`).
  10. Compact source reference metadata on every row.
- `ugcLogic.test.ts`:
  1. Multiset permutation grade matching (2 C's + 1 S for Medicine passes for all 3 permutations).
  2. Conservative course academic eligibility (`ELIGIBLE`, `NOT_ELIGIBLE`, `FURTHER_CHECKING_NEEDED`).
  3. Zero probability guessing / factual cutoff matching with negative scores.

---

## 3. UI Screens Checked & Verified

1. **Home Discovery Screen** ([HomeDiscoveryView.tsx](file:///c:/Users/DELL/Downloads/srilakan%20vuzopedia/src/components/HomeDiscoveryView.tsx)):
   - Live summary counts: 23 state universities/campuses, 121 active courses, 255 selectable offerings, 6,650 cutoff data points.
   - Dual-year clarity banner: 2025/2026 admission rules vs 2024/2025 historical cutoff basis.
2. **Course & Cutoff Finder** ([PredictorView.tsx](file:///c:/Users/DELL/Downloads/srilakan%20vuzopedia/src/components/PredictorView.tsx)):
   - Cards and table mode both consume `ugcAdapter` rows.
   - Category-split tags and qualification status.
3. **Program Detail Drawer** ([ProgramDetailDrawer.tsx](file:///c:/Users/DELL/Downloads/srilakan%20vuzopedia/src/components/ProgramDetailDrawer.tsx)):
   - Dedicated "Source & Traceability" tab with handbook edition, line ranges, printed pages, and `needs_review` badge.
   - Clear tabs for Degree Pathways, Honours Entry, and 25-district cutoff table with negative scores and NQC.
4. **My Preference Plan** ([PreferenceSimulatorView.tsx](file:///c:/Users/DELL/Downloads/srilakan%20vuzopedia/src/components/PreferenceSimulatorView.tsx)):
   - Code migration review banner with 1-click update, dismiss, or restore original backup.
   - Conflict auditor and auto-optimizer by descending historical Z-score.
5. **Compare Engine** ([CompareEngineView.tsx](file:///c:/Users/DELL/Downloads/srilakan%20vuzopedia/src/components/CompareEngineView.tsx)):
   - Multi-course comparison showing exact published cutoffs and honest unknown values.
6. **Institutional & Course Profiles** ([ProfileAndCalendarView.tsx](file:///c:/Users/DELL/Downloads/srilakan%20vuzopedia/src/components/ProfileAndCalendarView.tsx)):
   - All 23 institutions and 129 courses with official names and campuses.

---

## 4. Remaining Limitations
- **Private / Non-State Pathways**: Unrelated non-state university datasets (`NON_STATE_IFSLS_PATHWAYS`) were kept strictly untouched as instructed.
- **Complex Prose Admission Conditions**: Complex non-machine-evaluable prose rules remain marked as `FURTHER_CHECKING_NEEDED` and display verbatim handbook text to prevent premature false eligibility assertions.
