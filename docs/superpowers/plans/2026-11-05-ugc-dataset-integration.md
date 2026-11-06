# UGC 2025/2026 Staging Dataset Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the corrected staged 2025/2026 UGC dataset into UniPedia.lk via a centralized, typed data adapter with conservative eligibility evaluation, exact 2024/2025 cutoff matching, category-split handling, honest unknown value rendering, saved-plan protection, and source traceability.

**Architecture:** Create a client-ready dataset module in `src/data/ugc/` sourced directly from `data-staging/ugc-2025-2026/` (with a build/sync script that verifies 100% fidelity), an authoritative single data adapter in `src/services/ugcAdapter.ts`, an updated `src/lib/ugcLogic.ts` for conservative academic matching and grade-distribution permutations, and update the consuming views (`HomeDiscoveryView`, `PredictorView`, `ProgramChanceCard`, `ProgramDetailDrawer`, `CompareEngineView`, `PreferenceSimulatorView`, `ProfileAndCalendarView`, `AppContext`) to use the adapter with zero synthetic district-offset calculations.

**Tech Stack:** React 19, TypeScript 5.8, Vite 6.4, Vitest, Lucide React, Tailwind CSS / Custom Design Tokens.

**Spec:** User prompt instructions: Scope & Safety, 1. Create a Single Data Adapter, 2. Preserve Years, 3. Handle Cutoffs Correctly, 4. Handle Eligibility Conservatively, 5. Display Unknown Information Honestly, 6. Protect Existing Saved Plans, 7. Add Traceability, 8. Validate the Integration.

## Global Constraints

- Implement and test locally. Do not deploy, push commits, or change remote databases.
- Keep unrelated private/non-state university data (`src/data/sriLankaUgcSnapshot.ts` non-state exports) unchanged.
- Avoid a broad visual redesign during this task.
- Source state UGC information only from `data-staging/ugc-2025-2026/` (`institutions.json`, `courses.json`, `offerings.json`, `eligibility.json`, `historical-cutoffs-2024-2025.json`).
- Remove synthetic district-offset calculations (`colombo_base_z + difficulty_offset`) from production UGC displays and matching.
- Display admission requirements as 2025/2026 and historical cutoffs as 2024/2025. Never present cutoffs as guarantees.
- Do not ship extraction scripts or lengthy markdown reports in the browser bundle. Keep source references available.
- Treat machine-evaluable rules as course-level academic checks, not proof of complete admission eligibility.
- For incomplete rules or missing student information, display "Further checking needed" and keep courses discoverable.
- Exclude the Additional Intake aggregate (`record_type: 'additional_intake_aggregate'`, `is_selectable_unicode_offering: false`) from selectable programs.
- Preserve all published decimal values, including negative scores; keep NQC, missing history, and unavailable distinct.
- Respect stream/category splits for `021L`, `022R`, `022W`, `027D`, and `107L`.

## Review Focus

1. **Synthetic Cutoff Residue:** Ensure no formula calculates or shifts cutoffs with district difficulty offsets; all cutoffs must come strictly from published Section 9 data or return NQC / missing history.
2. **Medicine Grade Distribution Permutations:** Ensure two C's and one S grade are not tied to fixed subject array indices (e.g., Biology=S, Chemistry=C, Physics=C must pass).
3. **Category Split Ambiguity:** When student stream is unknown for `021L`, `022R`, `022W`, `027D`, `107L`, ensure the UI displays labeled category options and requests missing info rather than arbitrarily choosing one.
4. **Saved Plan Identity Mismatches:** Ensure old saved codes (`020S` previously mislabeled Law, `020A`/`020B`/`020E`, `096G`, `140P`) are flagged with recovery notes rather than silently reinterpreted.
5. **Unknown Field Transparency:** Ensure missing degree title, duration, or medium render as "Not stated in this handbook", and credits are displayed separately from years.

---

### Task 1: Client Dataset Preparation & Verification Script

**Files:**
- Create: `scripts/sync-ugc-dataset.mjs`
- Create: `src/data/ugc/institutions.json`
- Create: `src/data/ugc/courses.json`
- Create: `src/data/ugc/offerings.json`
- Create: `src/data/ugc/eligibility.json`
- Create: `src/data/ugc/historicalCutoffs.json`
- Create: `src/data/ugc/types.ts`

**Steps:**
- [ ] 1. Write `scripts/sync-ugc-dataset.mjs` to read the 5 staged JSON files in `data-staging/ugc-2025-2026/` and generate client-ready files in `src/data/ugc/`:
  - `institutions.json`: 23 official institutions and campuses.
  - `courses.json`: 129 courses (121 active + 8 temporarily suspended).
  - `offerings.json`: 256 records (255 selectable Uni-Codes + 1 aggregate intake record with `is_selectable_unicode_offering: false`).
  - `eligibility.json`: 122 records (1 general + 121 course records).
  - `historicalCutoffs.json`: Compact representation of all 266 columns and 6,650 district values (5,583 numeric including 64 negative scores, 1,067 NQC, preserving all column metadata and line ranges).
- [ ] 2. Run `node scripts/sync-ugc-dataset.mjs` to generate the client files and verify that total records and values match `data-staging/ugc-2025-2026/` with zero discrepancy.
- [ ] 3. Create `src/data/ugc/types.ts` defining strict TypeScript interfaces for `UgcInstitution`, `UgcCourse`, `UgcOffering`, `UgcEligibility`, `UgcHistoricalCutoffColumn`, `CutoffLookupResult`, `EligibilityEvaluationResult`, and `ProgramCutoffViewRow`.

---

### Task 2: Conservative Academic Eligibility & Multiset Grade Distribution Engine

**Files:**
- Modify: `src/lib/ugcLogic.ts`
- Create: `src/lib/__tests__/ugcLogic.test.ts` (extend with focused tests)

**Steps:**
- [ ] 1. Write failing unit tests in `src/lib/__tests__/ugcLogic.test.ts` testing:
  - Medicine grade permutations: Biology=S, Chem=C, Phys=C (PASS); Biology=C, Chem=S, Phys=C (PASS); Biology=A, Chem=B, Phys=C (PASS); Biology=C, Chem=S, Phys=S (FAIL).
  - Conservative evaluation: `auto_decision_safe: false` courses return `FURTHER_CHECKING_NEEDED` with source requirement text.
  - Missing student grades: returns `FURTHER_CHECKING_NEEDED` without failing the course.
  - O/L prerequisite checks: checks O/L English for courses like Pharmacy (`051`), Data Science (`136`), etc., when grades are entered, or returns `FURTHER_CHECKING_NEEDED` when O/L grades are omitted.
  - Aptitude status handling: `aptitude_or_practical_test.status === 'not_stated'` is never translated to "No aptitude test".
- [ ] 2. Implement multiset grade distribution matching (`matchGradeDistribution`), conservative evaluation, and academic eligibility evaluation in `src/lib/ugcLogic.ts`.
- [ ] 3. Run `npm test` and verify all tests pass.

---

### Task 3: Authoritative Single UGC Data Adapter & Cutoff Engine

**Files:**
- Create: `src/services/ugcAdapter.ts`
- Create: `src/services/__tests__/ugcAdapter.test.ts`
- Modify: `src/services/ugcDataService.ts`

**Steps:**
- [ ] 1. Write failing unit tests in `src/services/__tests__/ugcAdapter.test.ts` verifying:
  - Canonical course and institution mappings (all 255 selectable Uni-Codes map to official 2025/2026 courses).
  - Exact cutoff lookup from Section 9 (preserves all published decimals, including negative scores like `015W` Mullaitivu `-0.0096`).
  - NQC is returned as `status: 'NQC'`, `min_z_score: null`, distinct from missing history.
  - Category-split cutoff selection for `021L`, `022R`, `022W`, `027D`, and `107L`: returns labeled category values and flags `needs_category_clarification: true` when student stream is unknown.
  - Unmapped / new offerings (e.g. `141D`, `142F`, `143B`) return `status: 'NO_HISTORICAL_CUTOFF'`, `min_z_score: null`.
  - Additional Intake aggregate record (`900`) is excluded from selectable programs.
  - Saved-plan migration detects ambiguous old codes (`020S`, `020A`, `096G`, `140P`), provides migration notes and suggested Uni-Codes, and preserves original entries.
- [ ] 2. Implement `src/services/ugcAdapter.ts` with O(1) indexed lookups, exact Section 9 cutoffs, category-split resolution, saved-plan migration, and complete source traceability.
- [ ] 3. Update `src/services/ugcDataService.ts` to delegate all state UGC functions (`fetchProgramCutoffsByDistrict`, `fetchAllDistrictCutoffsForUniCode`, `normalizeProgramCutoffRow`) to `ugcAdapter.ts`, completely removing `buildProgramCutoffRowsForDistrict` and difficulty offsets.
- [ ] 4. Run `npm test` and verify that all adapter tests pass.

---

### Task 4: UI Updates Across Consuming Views

**Files:**
- Modify: `src/context/AppContext.tsx`
- Modify: `src/components/ProgramChanceCard.tsx`
- Modify: `src/components/ProgramDetailDrawer.tsx`
- Modify: `src/components/HomeDiscoveryView.tsx`
- Modify: `src/components/PredictorView.tsx`
- Modify: `src/components/PreferenceSimulatorView.tsx`
- Modify: `src/components/CompareEngineView.tsx`
- Modify: `src/components/ProfileAndCalendarView.tsx`

**Steps:**
- [ ] 1. In `AppContext.tsx`:
  - Run saved-plan migration on initial load of `planEntries`, preserving originals in a pre-migration backup key and flagging ambiguous entries.
  - Expose migration status and action handlers (`acceptPlanMigration`, `dismissPlanMigration`).
- [ ] 2. In `ProgramChanceCard.tsx`:
  - Display 2025/2026 admission rules badge and 2024/2025 historical cutoff pill (`QUALIFIED` with exact decimals / `NQC` / `No 2024/25 Cutoff (New Offering)`).
  - For category-split courses without a selected stream, display labeled category values (e.g. `Arts: 1.4500 | Comm: 1.6200`).
  - Render unknown degree or medium as "Not stated in this handbook".
- [ ] 3. In `ProgramDetailDrawer.tsx`:
  - Display full 2025/2026 admission requirements and 2024/2025 historical cutoffs.
  - Render duration, credits, medium, alternative pathways, and conditional honours entry with honest unknown values ("Not stated in this handbook").
  - Add compact "Handbook Traceability & Source Citation" panel with handbook edition, admission year, historical cutoff year, source section, printed page, and review status.
- [ ] 4. In `HomeDiscoveryView.tsx` & `PredictorView.tsx`:
  - Generate displayed dataset counts directly from actual records (23 institutions, 121 active courses, 255 selectable Uni-Codes, 6,650 Section 9 cutoff points).
  - Show year disclaimers: Admission rules (2025/2026), Cutoffs (2024/2025).
  - Ensure programs with `FURTHER_CHECKING_NEEDED` remain fully discoverable in search and filters.
- [ ] 5. In `PreferenceSimulatorView.tsx`:
  - Display migration warning banner if ambiguous saved entries exist, with clear explanation, original code preservation, and one-click recovery path.
  - Render suspended course notices separately.
- [ ] 6. In `CompareEngineView.tsx` & `ProfileAndCalendarView.tsx`:
  - Render official 2025/2026 course names, institutions, and exact historical cutoffs.

---

### Task 5: End-to-End Verification, Responsive Checks & Summary Report

**Files:**
- Create: `integration-summary.md`

**Steps:**
- [ ] 1. Run all unit tests: `npm test -- --run`.
- [ ] 2. Run production build: `npm run build` (`tsc -b && vite build`).
- [ ] 3. Verify desktop and narrow mobile viewport rendering (ensure no layout overflow, text clipping, or broken tables).
- [ ] 4. Confirm state programs remain discoverable when student eligibility is unknown.
- [ ] 5. Write `integration-summary.md` covering files changed, data sources used, test and build results, remaining limitations, screens checked, and saved-plan migration behavior.
