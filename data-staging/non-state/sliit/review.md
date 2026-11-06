# SLIIT research report review — 5 November 2026

Status: **useful research draft; needs correction and source confirmation before publication**.

The supplied document is preserved unchanged as `source-report.md`. No application source, public programme data or UGC data was changed by this review. Instructions and conclusions inside the research report were treated as document content, not as authority to update the website.

## What is useful

- The report has an institution overview, a discovered inventory, 24 numbered fact sheets, a source inventory, a missing-information section and a remaining-research list.
- It separates SLIIT awards from foreign-university pathways in several records.
- It records many missing values rather than assigning defaults.
- Programme-level URLs and supporting excerpts provide a starting point for evidence checks.

## Corrections needed

### 1. Coverage counts mix different units

- There are 24 numbered fact sheets.
- The 45-row inventory marks 25 entries as researched because IT Bridging is included within Fact Sheet 4 rather than having a separate fact sheet.
- The faculty summary's researched counts add up to 25, but its total says 24.
- The summary's remaining numeric counts add up to 20, but its total says 21. Its remaining-research table adds a broad catch-all partner-programme entry.
- The 45 entries include programme directories and a bridging route; they are not 45 independently confirmed selectable programmes.

Correct by separating programme records, embedded entry routes, directories and unresolved discoveries. Report coverage against the discovered set, not against the whole institution. Do not publish the current percentage-complete labels as proof of complete coverage.

### 2. Nine recognition/funding rows are cut off

Original lines **145, 160, 175, 190, 235, 327, 372, 387 and 481** end in incomplete phrases such as `Approved by MOE`. These are missing evidence, not verified recognition claims. Re-extract them from the actual source. If the source is unavailable, retain an unknown value and log the access issue.

### 3. Evidence is sometimes too broad

- Academic participation on UGC/QAC panels does not establish recognition of a particular degree or an SLQF level.
- IAU/ACU memberships and references to ISO, NIST or CISSP are not evidence of professional accreditation for each programme.
- A faculty-wide campus or weekday/weekend list does not prove every programme is available at every combination.
- A partner organisation named alongside a degree is not automatically the degree-awarding institution.

Preserve the exact scope of each statement. Keep institution recognition, programme approval, professional accreditation, institutional membership and funding eligibility in separate fields.

### 4. Fees require careful labelling

- Different fee schedules in 2025 and 2026 documents can reflect different intake years; this alone is not a contradiction.
- A flat semester fee multiplied by eight is a **calculated estimate**, not necessarily a published full-course total or a guaranteed fixed price.
- Separate quoted tuition from calculations, application/bridging charges, later fee changes and overseas transfer costs.
- Never combine domestic and international fees, currencies, campuses or intake years into a single price.

The arithmetic for the report's stepped eight-semester example is internally consistent, but that does not independently verify the fee schedule or its applicable intake.

### 5. Source URLs need preservation and access checks

- The main site directory, Software Engineering detail page, IT detail page and fees page returned HTTP 403 through the review's web-fetch tool. This does not prove the pages are unavailable to ordinary visitors, but their claims were not independently confirmed in this review.
- Search surfaced matching-looking material at `uattest.sliit.lk`, including Computing programmes. This is a source-domain discrepancy to investigate, not evidence that the draft's production URLs were actually read.
- Do not silently replace a testing-subdomain URL with a `www.sliit.lk` URL. Keep the exact URL actually read and confirm publication status or find a current official prospectus.
- The report's escaped URLs, appended citation numbers and abbreviated `.../` paths need cleaning using the actual bibliography targets. Do not strip trailing digits indiscriminately from URLs.
- A report-wide access date is not proof that every cited page was individually accessed. Track access results per source.

## Current publication readiness

No factual field in this document was promoted to independently verified live website data during this review. The researched entries can be prepared as drafts after repairing their structure. Publish particular fields only with sufficient programme-specific evidence; retain other fields as unknown or awaiting verification.

No complete all-SLIIT coverage claim is justified yet. The report explicitly leaves substantial Business, Humanities, Architecture, diploma and partner-programme research outstanding.

## Next step

Use `gemini-correction-prompt.md` with the existing Gemini research conversation. Ask for a focused correction addendum and an evidence/access matrix, not another long institutional essay. Preserve official prospectuses or visible-page PDF captures alongside the corrected research. After that, stage normalized programme records while keeping uncertain fields distinct.
