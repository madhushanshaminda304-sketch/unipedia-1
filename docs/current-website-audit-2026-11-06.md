# UniPedia current website audit

Audit date: 6 November 2026. This is a review of the current local website and repository, not an independent verification of every university fact or a certification of a deployed service. No application code was changed during this audit.

## Assessment

UniPedia is a useful working beta with real catalogue records, historical cutoff handling and saved-choice tools. Its principal weakness is an inconsistent student journey: the latest purple discovery screens coexist with older blue pages, important links bypass the new finder, and return navigation can discard the results context. Improving those connections is more valuable than introducing another visual direction.

The current site is strongest at UGC reference browsing and organising options. Direct-entry discovery remains constrained by incomplete fee/requirement records. Institution profiles, consistent navigation and programme facts are the next areas to finish.

## Evidence and limits

- Rendered 23 route variants at 1280px and 390px: 46 route/viewport combinations. These included both directories, both UGC views, programme and institution pages, guides, empty shortlist/comparison views, dates, interests, legal pages and a not-found route.
- No document-level horizontal overflow, escaped main form/action controls or uncaught JavaScript errors were observed in these checks. Inspected images loaded.
- Reproduced homepage admission-route reset on browser Back and UGC detail return-navigation loss. Inspected a populated catalogue comparison and Sinhala navigation.
- Re-ran the full suite: 112 tests across 15 files passed. Re-ran the production build: passed, with the existing large-chunk warning.
- Reviewed runtime catalogue aggregates, stored UGC records, source-review flags, HTML metadata, local storage boundaries, routing, styling and repository documentation.
- No real-device Safari test, full screen-reader audit, exhaustive contrast assessment, live deployment/header audit, Search Console inspection, traffic analysis or independent re-check of all official PDFs was performed.

Evidence files: `docs/qa/current-site-audit.json`, `docs/qa/current-site-audit-followups.json` and screenshots prefixed `docs/qa/audit-`.

## Priority findings

### 1. The main UGC entry bypasses the redesigned finder — high

The homepage's “Explore the UGC pathway” action and main UGC navigation lead to `/explore`. The new profile/results journey lives at `/courses`. Students can reasonably expect the main pathway button to start that journey, but they arrive in the older browse directory instead. The user's difficulty locating the changed screens is consistent with this structure.

Make the primary UGC pathway action open `/courses`. Keep `/explore` as an explicitly labelled browse-without-results destination and retain subject-specific browse links. Give both tools distinct names and visible access from the shared navigation.

Evidence: `src/components/PortalHomeNext.tsx`, `src/components/PortalHeader.tsx`.

### 2. A programme's Back action discards the result context — high

Reproduction: open `/courses?view=results&q=Engineering`, open a programme, then click “Back to courses.” The site opens bare `/courses`, displays the profile form and no longer displays the filtered result list. Browser Back itself can preserve the previous URL; the dedicated page action does not.

Keep a return destination when opening a programme from results. Restore filters, page and results view through the page's Back action; use a safe finder/browse fallback for direct arrivals.

Evidence: `src/components/ProfileAndCalendarView.tsx:41`; reproduced in the browser.

### 3. The site contains two visibly different shells — high

The full white masthead, cap/wordmark lockup and purple treatments appear on the homepage, UGC finder/results, other-programme directory and imported details. `/explore`, institution directories/profiles, UGC programme details, guides, shortlist and comparison retain the older floating blue header. The switch is especially visible when opening a university or comparison from a new screen.

Finish one shared header, brand lockup, page background, type hierarchy, button system and content widths across existing routes. Different admission-route accents can remain. The homepage itself does not need another redesign.

Evidence: `referenceScreen` in `src/components/PortalHeader.tsx`; desktop and phone screenshots.

### 4. Homepage route selection resets after Back — medium

Reproduction: select Private & other programmes, search for software, then use browser Back. The homepage search action becomes `/explore`, resetting to UGC. A subsequent search can therefore use an unintended admission route.

Persist the selected homepage route in URL/history state and restore it on Back/Forward. Preserve the student's typed query where practical. Keep programme suggestions and subject links scoped to that restored route.

Evidence: homepage `useState<DiscoveryScope>("ugc")`; reproduced result recorded in the audit JSON.

### 5. Decision-critical programme facts remain incomplete — high

Runtime imported catalogue, 130 records:

| Field | Present | Missing |
|---|---:|---:|
| Reported fee figure | 89 | 41 |
| Supplied entry requirements | 114 | 16 |
| Report date | 118 | 12 |
| Duration text or years | 129 | 1 |

All 130 imported records are labelled `reported_not_independently_verified`; 109 include fee notes. The reports generally carry 5 November 2026 dates where supplied. A report date is not proof of a current official verification.

In the 255 selectable stored UGC offering records, duration is absent for 93, medium for 164 and degree-programme lists for 30. These counts describe stored metadata, not proof that the official handbook omits the facts. For example, Moratuwa Engineering currently displays an unknown duration because its offering record lacks that value.

Start with the featured Computing, Business and Engineering options. Revisit their cited official sources and fill gaps only when explicitly supported. Keep unknowns and payment periods distinct. Do not generate total-cost rankings from annual/stage/prose fees. Show report date/source availability beside the core decision information.

### 6. Academic checking has intentionally limited coverage — high for positioning

Among 121 course eligibility records, 28 are marked safe for automatic evaluation and 93 require manual review. The implementation correctly returns further-checking states for unsupported rules. The About page also states that original handbook requirement-PDF review remains outstanding.

Keep positioning this as supported academic checks and historical comparisons. Explain the limit near the form and results, not solely in source methodology. Extend machine evaluation only after reviewing the actual rules and their source evidence. This audit did not independently reverify the official cutoff PDFs or handbook.

Historical editions should remain separate. Keeping the latest loaded 2025/2026 cutoff edition as default and 2024/2025 as a historical option is useful.

### 7. Search metadata is generic across the site — medium/high before public growth

The 23 inspected routes use the same meta description. Programme-specific titles are inserted after JavaScript runs. Fetching a programme URL from the production preview returns the generic HTML shell without its programme title or an `og:image`.

Give institution/programme/guide pages unique descriptions and appropriate social-preview metadata. Consider pre-rendering the public detail pages while retaining the current React/Vite application. Google supports JavaScript-generated metadata; this finding does not mean the pages cannot be indexed. Its documentation recommends unique descriptive titles and descriptions: [Google JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).

The institution directory also strips the route query from its canonical URL, so the distinct UGC and other-institution views share `/institutions`. Define canonical identity deliberately for those two primary content views. Keep personal shortlist/comparison views excluded from indexing.

### 8. Initial JavaScript is large — medium/high

The current build emits a main JavaScript asset of 3,757,634 bytes, approximately 358 KB gzip. Browsers still need to parse the uncompressed code/data. The site contains large bundled eligibility, offering and historical-cutoff JSON records.

Generate a lean runtime catalogue, load historical editions and full handbook excerpts on demand, and keep optional tools out of the initial discovery path. Preserve the separate full source records for traceability. Measure the result on a slower phone/network before choosing a precise performance target. This audit did not measure deployed Core Web Vitals.

### 9. Mobile readability and target sizing need a focused pass — medium

Phone layouts did not show page-level horizontal overflow in the checked routes. However, helper text, source text and some programme actions use 9–12px sizing, and many phone inputs/selects remain below 16px. Some standalone Back buttons render only 20px high.

Use larger decision text, readable field text and comfortable touch padding. Assess small targets with their surrounding spacing before declaring a WCAG failure: [W3C target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) includes exceptions. Check actual phone/browser zoom and screen-reader navigation rather than relying on viewport screenshots alone.

### 10. Trust and maintenance need visible ownership — medium

The About page offers a correction template but no connected submission service. Its confirmation refers to an existing contact channel that the current page does not identify. A student who spots a wrong requirement has no clear next step.

Publish one real project contact/correction destination, explain the review process and separate “report supplied,” “official source checked” and “last checked” dates. Add concise, sourced institution summaries. Verified logos/campus imagery can improve identity where available; use text fallbacks elsewhere.

### 11. Several tools are useful but need better integration — medium

- Comparison preserves route separation and fee periods. Match its layout/header to the discovery screens, keep the shared four-slot count clear, and make long fee/requirement cells easier to scan on a phone.
- Shortlist preserves UGC order and separates other programmes. Add a coherent visual summary and retain its ordering/lock behaviour. Consider a local export/import backup because choices are device/browser-specific; accounts are not required for that improvement.
- The dates page honestly states that no confirmed deadlines are supplied. Keep it labelled as official notices/resources until there is a maintained calendar.
- The budget tool is a user-estimate calculator. Keep that positioning. Make it easier to reach from fee sections and distinguish total tuition from annual/stage amounts.
- Guides offer a useful starting point but are short and visually sparse. Add focused examples and source dates after the core journey is consistent.
- Sinhala/Tamil selection translates navigation while much of the new tool interface and research remain English. The site discloses English research; align common tool labels with the advertised language support and retain clear language boundaries.

### 12. Repository documentation describes a different product — medium maintenance priority

README still uses LankaVuz branding and describes old prediction tiers, automatic preference optimisation, verified badges, reviews, counselling and a live calendar. These do not describe the current interface and should not guide future implementation or public claims. The HTML theme colour is also still green despite the new purple/blue identity.

Update the README to the actual local-dataset architecture, active routes, supported features, verification limits and deployment requirements. Archive misleading legacy descriptions. Consolidate repeated style rules as pages are migrated; avoid adding another override layer.

## Page-level direction

| Area | Keep | Next improvement |
|---|---|---|
| Homepage | Two route cards, scoped search, real tools | Direct UGC entry, route restoration, clearer search journey |
| UGC profile/results | Two-step flow, explicit edition/district, separate checks | Reliable return navigation, clearer scope of academic checks |
| UGC browse | Full catalogue and URL filters | Shared shell and clear “browse” identity |
| Other directory | Compact rows, fee basis and caveats | Fill key facts and make missing information easy to identify |
| Imported details | Anchored sections, stages, sources | Improve scannability of long fee/award notes |
| UGC details | Requirements, historical matrix and source references | Bring into the new detail layout and restore results context |
| Institution pages | Real names and derived programme counts | Sourced identity summary, coherent branding and programme layout |
| Compare/shortlist | Working saved state and route separation | Consistent design, clearer summaries, readable phone comparisons |
| Guides/notices | Honest content and official links | More useful examples; maintain dates before presenting a calendar |

## Recommended implementation order

1. Fix primary UGC navigation, detail return context and homepage Back behaviour.
2. Finish the shared shell across existing routes, then restyle UGC details, institution profiles, comparison and shortlist.
3. Complete decision-critical facts for featured programmes and make verification/report dates clearer.
4. Improve public-page metadata and initial-bundle loading.
5. Refine phone text/targets, common translations, correction contact and repository documentation.

Keep working search, saved preferences, programme separation, both cutoff editions, unknown-value handling, honest fee periods and source caveats. Fake reviews/popularity, decorative animation, unsupported recognition badges, accounts and counselling services are not needed to address the findings above.
