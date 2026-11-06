# UniPedia portal redesign

Implemented the approved discovery portal plan in the existing React/Vite application. The source catalogue is unchanged: 255 UGC offerings and 130 other programmes, grouped into 33 institution identities. Counts describe this directory, not complete national coverage.

## Delivered experience

Search-led homepage, subject browsing, institution previews, dated research additions and four student guides. `/explore` combines both source families with URL-backed search, admission route, qualification, subject, institution, duration and fee-availability filters. `/courses` and `/pathways` remain available.

Imported programmes have `/programmes/:id` permalinks. `/institutions` lists institutions, and `/institutions/:slug` provides direct-entry profiles. Existing `/universities/:code` profiles retain UGC data and now have programme search. Programme details preserve fee basis, currency, registration charges, uncertain awarding bodies, incomplete rules and source notes.

The shortlist has the original ordered UGC preference plan plus saved other programmes. Comparison now accepts up to four programmes across both source families, with aligned common facts and the existing UGC cutoff detail. Comparison selection is coordinated in the main context, including when browser storage is blocked. New storage keys are `unipedia_catalogue_saved_v1` and `unipedia_catalogue_compare_v1`; existing keys remain in use. Startup preserves existing UGC comparison choices before allocating remaining slots to imported programmes.

New screens are lazy-loaded. The sitemap contains 433 public routes; personal shortlist/comparison pages retain noindex. Imported programme IDs retain their case and existing identity. Subject tags are for browsing, never admission decisions. No prices are extrapolated or ranked across incompatible payment periods.

## Design and assets

Shared green/amber palette and Manrope preserved, with root colour/font tokens, sentence-case labels, instant focus styles, reduced-motion support and bounded layouts. `design.md` records the active design system. Older component exports remain available; no component files or datasets were deleted.

The photograph is **University Students Studying before exams**, Japura campus, 2013, credited to Dinesh De Alwis on Wikimedia Commons, under CC BY-SA 3.0. It is resized to 1100 × 829 and converted to a 123,544-byte WebP. Attribution, licence link and transformation notes appear on the homepage and in `public/images/credits.json`. Institution initials are text fallbacks, not reproduced logos; no institution marks were downloaded without established reuse permission.

Navigation, search and the homepage opening respond to EN/SI/TA. Collected research and guides remain English, with explicit language markup and a translated explanation for SI/TA users. This release does not claim full translation of programme facts.

## Verification

- `npm test -- --run`: **92 tests passed**, including all 84 original tests. New cases cover catalogue coverage, variants, filter URLs, mixed comparison limits, saved-state hydration, language handling and preserved source caveats.
- `npm run build`: passed; **433 sitemap routes** generated. The existing large-data-chunk warning remains (main JavaScript approximately 355 KB gzip); no loading-speed score is claimed.
- Hallmark static sweep: **0 FAIL, 0 REFLEX, 3 finish warnings** across the six reviewed portal/style files.
- Hallmark's automated render tier could not run because `puppeteer-core` is unavailable. Rendered checks were performed through the permitted CUA browser tools instead.
- Homepage, unified directory, institution profile, programme page, guide, shortlist and comparison were checked at 390, 768, 1280 and 1920 viewport widths. Document scroll width did not exceed client width. The comparison table scrolls inside its own labelled region on phones.
- At 1280 × 800, the headline, introduction, search and route shortcuts are above the fold. The image loads successfully.
- Browser checks verified grouped search suggestions; ArrowDown and Enter navigation; filter changes and back-navigation restoration; programme reload; institution programme search; saving and mixed comparison persistence; and rejecting a fifth comparison entry. Test additions were removed afterward, preserving the original five UGC preferences and two UGC comparison selections.
- A finish reviewer requested a corrected mobile screenshot, then identified the tablet navigation gap and language-selector regression. Both were corrected: a menu is available throughout the intermediate widths, and existing translated UI copy is restored with explicit English research boundaries. No additional visual blocker was reported.

The three finish warnings are reviewed, not hidden: consistent app containers are retained for functional controls; narrow article/legacy-tool measures are intentional within the 1200px portal cap; and functional rails/sidebar layouts use role-specific gaps. The homepage itself uses varied content treatments rather than repeating a generic card template.

## Review artifacts and limits

`docs/qa/portal-home-1280.jpg`, `portal-home-full.jpg`, `portal-home-390.jpg`, `portal-home-390-full.jpg`, `portal-programme-phone.jpg` and `portal-mixed-comparison.jpg` capture the updated experience. Local `.hallmark/` holds the starting diff/status and prior visual baseline. Existing uncommitted changes were preserved.

REA runtime evidence was not produced because an accessible debugging endpoint was not available. No claim about unobserved competitor behaviour is made. Programme facts remain attributed research, not independently reverified admissions advice. Accounts, community reviews, application submission and a CMS were outside this release. No deployment was performed.
