# Official 2025/2026 cutoffs and advanced filters

## Year correction

The attached `ugc9.md`, Section 9, explicitly covers admission year **2024/2025**, based on **2024 A/L results after re-scrutiny**. The enclosing handbook is the **2025/2026 edition**. Those are different dates and the older table must not be relabelled.

A separate official UGC release dated **31 July 2026** now provides **2025/2026 selection cutoffs based on 2025 A/L results after re-scrutiny**:

https://www.ugc.ac.lk/downloads/admissions/cutoff_2026/COP_2025_2026-ENGLISH_Final.pdf

The website now loads this newer snapshot by default, retains the older snapshot as a selectable year, and uses the selected year consistently in the finder, detail matrix, comparison, shortlist and source labels. A user's explicit year selection persists on their device. Adapter/service defaults also use the new year.

## Extraction and mapping evidence

- Source PDF: `data-staging/cutoffs-2025-2026/official-cutoffs.pdf`.
- SHA-256: `e1914bfbd287774c7879b7758eff9349c7a4ea40df4ca2ae9db92ac605e88ba0`.
- Repeatable extraction: `scripts/extract-cutoffs-2025-2026.py`, using the bundled Python runtime's pdfplumber.
- Exactly 10 PDF pages, 260 populated cutoff columns, 25 districts per column and 6,500 cells.
- 5,474 numeric values, including 55 negative scores; 1,026 NQC cells.
- Each score is checked using the table extractor and a separate character extraction within that cell's geometry. Empty or unexpected numeric formats fail extraction.
- 257 headings match the older table by exact normalized text. Three explicit current title/institution mappings cover `141D` Sports Science at Kelaniya, `142F` Geographical Information Systems at Ruhuna, and `143B` Electronic and Intelligent Systems Engineering at Peradeniya. These three headings and their first district values were also checked visually against rendered PDF columns.
- One entirely empty trailing cell on page 10 is excluded. No populated cell is dropped.
- All 255 selectable offerings are mapped. The extra five columns are stream/category splits. There are no unresolved mappings in this release.
- Source PDF, extracted JSON and mapping report remain under staging. The client snapshot is `src/data/ugc/cutoffs2025.json`.
- The original 2024/2025 JSON is unchanged. The ambiguous older Kelaniya Sports Science & Management heading remains unassigned to `141D` in that year; the explicit newer Sports Science heading is mapped only in the new year.

## Browsing and academic eligibility

Z scores compare/rank candidates, but do not replace course-specific entry requirements. Some programmes accept broad subject combinations; others require named A/L subjects, specific grades, O/L conditions or aptitude tests. General admission and registration conditions also apply.

The finder now lets students browse all programmes without entering subjects. Selecting an A/L stream chooses the relevant cutoff category where needed. It no longer automatically hides other handbook stream sections. A separate checkbox explicitly enables section restriction. Academic checks and hiding confirmed academic mismatches remain optional; uncertain cases remain discoverable.

A new expandable handbook guide explains these distinctions and links to the official handbook. Its requirement transcription is still subject to the original handbook PDF review documented previously; importing the separate cutoff PDF does not complete that work.

## Added filters

- Cutoff admission year, with both A/L examination bases labelled.
- University/campus, published medium and explicitly stated duration.
- Aptitude/practical test status: required or not stated, preserving uncertainty.
- Numeric cutoff, NQC, unresolved stream category or absent-history status.
- Optional comparison with the student's official Z score: at/above or below the selected published cutoff. NQC and unresolved categories cannot pass a numeric comparison. Clearing the score restores unrestricted browsing.
- Sorting by course name, cutoff ascending/descending, stated duration or proposed intake. Unknown values sort after numeric values.
- Shared links restore browsing filters, year, district and category stream. They exclude the student's score, grades and personal eligibility filters.

## Verification

- **73 automated tests pass**, including all 6,500 cells queried through the adapter under the right course, district, category and year; year separation; previous-year ambiguity; filter combinations; missing values; sorting and URL round trips.
- Production TypeScript/Vite build passes. The large initial-data bundle warning remains; no performance score is claimed.
- Browser: Colombo Medicine changes from 2.2721 (2025/2026) to 2.3517 (2024/2025); selecting Arts still leaves all 255 offerings discoverable by default; university/duration/sort/score filters combine; clearing the score restores results; source PDF links and the selected-year district matrix work.
- Expanded mobile advanced filters were checked at 390 × 844 with no horizontal overflow.
- Screenshots are under `docs/qa/latest-cutoffs-and-advanced-filters.jpg` and `docs/qa/advanced-filters-2025-cutoffs-desktop.jpg`.
- Temporary numeric score and stream changes were cleared; existing saved plans were not changed.

No deployment or remote database change was performed.
