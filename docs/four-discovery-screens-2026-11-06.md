# Four reference-led discovery screens

Implemented the approved collage-based design on 6 November 2026. The homepage remains intact; its masthead treatment now also appears on the affected discovery screens. No dataset, storage-key migration, accounts feature or deployment was introduced.

## Delivered

- `/courses` opens a compact UGC profile with a historical cutoff edition, stream, admission district and optional Z-score. Academic grades and the existing detailed checks are expandable. Edits remain local drafts until submission.
- `/courses?view=results` shows the committed profile, horizontal programme rows, separate historical-score and academic statuses, refinement filters, sorting, pagination and existing save/compare actions. Edit, reload and browser history retain the expected profile and filter state.
- Existing filter-bearing `/courses` links still open results. `view=profile|results`, page and comparison-filter state are managed separately from the legacy share serializer. Personal Z-scores and grades remain excluded from shared URLs; profile-dependent comparison filters are omitted from shared links too.
- `/pathways` uses a wide filter panel and compact rows retaining fee periods and awarding-body variants. Its 130 entries and study-budget calculator remain available.
- `/programmes/:id` uses a summary header, section anchors, structured facts and fee/awarding-body panels. Full reported fee notes, requirements, duration notes, staged-pathway notes, intake caveats, report dates and source links remain available. Supporting source URLs are displayed when supplied.
- Verified photographs are restricted to their actual institutions, with visible attribution; other institutions use name marks. No recognition badges, estimated fee totals, popularity rankings or live admissions claims were invented.

The existing finder component implementation is retained as `LegacyPredictorView`; the active wrapper uses the new flow. New screens remain within the existing lazy route boundaries. No production dependency or animation library was added. Changes are scoped to the four screens and their header; other directory/profile/guide/saved/comparison layouts are unchanged.

## Verification

- All 104 existing tests plus eight focused tests passed: **112 tests across 15 files**.
- New checks cover profile/results URL interpretation, filter/state round trips, invalid query values, negative/equal/missing scores, unresolved categories, both historical editions, NIBM stage costs and uncertainty, section anchors and imagery fallbacks.
- Production build passed. Existing large-chunk warning remains; main JS gzip is approximately 358 KB. The homepage is still lazy-loaded and did not acquire the new finder or programme-detail screen code.
- No undefined CSS tokens were found. `git diff --check` passed, with existing Windows line-ending notices.
- Isolated Chromium checks passed on all four screens at 390, 768, 1280 and 1920px: 16 rendered layouts. Checks included document overflow and bounds of inputs, actions, rows and section links. Before/after screenshots are saved under `docs/qa/four-*`.
- Browser flow checks covered draft isolation, results reload, Back/Forward, both cutoff editions, score-dependent disabled filters, pagination, programme reload, both search/clear flows, active-filter removal, saved programmes, comparison, the shared four-selection limit and private share payloads.
- Phone checks covered academic inputs, the menu and Escape, expandable sources/fee notes, reduced motion and clearance of the profile action above mobile navigation.
- Checked all four screens at a 640 × 400 viewport as a 200%-equivalent layout width. Native browser zoom itself was not tested.
- Principal text/action colour pairs were calculated at contrast ratios of 4.65:1 or higher. This was not an exhaustive contrast audit or manual screen-reader audit.

Machine-readable rendered and production results: `docs/qa/four-screen-checks.json` and `docs/qa/four-production-checks.json`.
