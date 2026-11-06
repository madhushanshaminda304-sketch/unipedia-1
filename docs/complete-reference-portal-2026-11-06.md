# Complete reference portal pass

Implemented on 6 November 2026 from the user's complete website mockup.

## Changes

- Applied one white masthead and cap/wordmark lockup across routes, with the established purple identity, white cards, lavender backgrounds and blue route accents. Updated the browser theme colour and favicon.
- Added reference-style UGC and other-institution profiles with factual summaries, sourced location/contact information, programme counts, filterable lists, section navigation and quick links. Existing campus photographs are restricted to their actual institutions and retain visible attribution. Missing assets use a compact text treatment.
- Refined the UGC programme detail page, directories, comparison, ordered shortlist, guide index/articles, notices and information pages. Four guide illustrations are CSS/Phosphor artwork; no stock photography or fake recognition badges were added.
- Added `/tools`, `/tools/budget`, `/contact` and `/sitemap`, keeping them lazy-loaded. Tools link to working destinations. Feedback prepares a local downloadable/copied report; there is no submission backend or account feature.
- Connected the main UGC entry to `/courses`. Homepage route selection survives Back/Forward through URL state. UGC programme links remember a safe local result/browse return URL, restoring query and pagination through Back to courses.
- Preserved UGC/direct-entry separation, all 255 UGC offerings and 130 other programmes, fee periods/caveats, both historical editions and existing saved-state keys. New session storage holds only the UGC return destination.
- Existing handbook telephone numbers are displayed when available. Official website fallbacks for Moratuwa and Peradeniya were checked against their official homepages; the Colombo official domain is also used. Programme dataset JSON files were not modified.
- Created a complete human sitemap and regenerated the XML with 438 deduplicated public URLs. Every sitemap destination was checked against the route/data registries. Personal pages are excluded from XML, and the two institution-directory routes have distinct canonical treatment.

## Verification

- 116 tests across 16 files passed, including safe return destinations, unavailable session storage, homepage scope restoration and human sitemap routing.
- Production build passed. The existing large-chunk warning remains: main JavaScript is approximately 359 KB gzip. New utility/profile screens stay lazy-loaded; the homepage screen chunk is approximately 16 KB gzip.
- Browser checks passed across 27 route variants and 70 desktop/tablet/phone layouts, with key screens checked at 390, 768, 1280 and 1920px. No uncaught page errors, document overflow or escaped main controls were found in those checks.
- Verified primary entry links, scoped search and browser Back, filtered/paginated UGC return links, institution search, saved UGC order/locks, imported saves, populated comparison, budget arithmetic, academic-section shortcuts and local report download.
- Checked all 438 XML URLs: no duplicates, unresolved routes, missing programme pages, XML parse errors or personal-page entries.
- Production smoke checks passed for eight representative routes at 390/1280px, official-link handling, route-specific canonical, personal noindex, keyboard menu, reduced motion and a 640px zoom-equivalent layout viewport.
- CSS token checks passed. Before screenshots from the audit and after screenshots under `docs/qa/complete-*` document the visual changes.

Machine-readable checks are in `docs/qa/complete-portal-checks.json` and `docs/qa/complete-production-checks.json`. Native browser zoom, full screen-reader operation, every contrast pair and a deployed-site crawl were not independently audited. No deployment was performed.

The supplied mockup's account UI, fabricated popularity labels, campus facilities, unverified recognition claims and live application services were not introduced. Source uncertainty remains visible.
