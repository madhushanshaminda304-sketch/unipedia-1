# UniPedia.lk website audit — 5 November 2026

The central UGC transcription and conservative finder evaluator are a useful foundation. The remaining work is consistency across older screens, truthful product claims, mobile usability, and completion of several prototype features.

This is an audit, not an implementation change. Application source was not edited. The local production build and all 44 tests passed. The generated JavaScript chunk is 3,070.68 kB (332.71 kB gzip). This is a build measurement, not a Lighthouse or Core Web Vitals measurement.

Reviewed: source for all major views, homepage/onboarding, live Moratuwa profile navigation, comparison, unanswered career quiz, calendar, finder, Sinhala switching, drawer focus, and a 390 × 844 phone viewport. No live database policy inspection, original-PDF verification, external form submission, or real WhatsApp delivery test was performed.

**Priority meanings:** P1 = correct before public launch because a student may be misled or a core journey fails; P2 = next usability/reliability iteration; P3 = later product enhancement. Evidence is either observed in the browser or established from the listed code; ideas are identified separately.

**Changes needed before public launch**

| ID | Priority | Finding and evidence | Required change / completion check |
| --- | --- | --- | --- |
| A01 | P1 | Opening Moratuwa from a course produces URL #institution/MRT but heading University of Colombo (UOC). Confirmed in browser. ProfileAndCalendarView.tsx:77–80 searches legacy UGC_INSTITUTIONS using canonical identifiers and falls back to its first record. | Use canonical institution records and explicit alias mapping in profiles, reviews, and location lookup. Every active offering must open its own institution. Unknown IDs must show an honest not-found state. |
| A02 | P1 | Comparison and profile entry rules still read subject_requirements, which the new adapter deliberately no longer flattens. CompareEngineView.tsx:265 and ProfileAndCalendarView.tsx:363 substitute minimum S. | Render actual structured rules and source wording. Medicine must show C/C/S; subject-specific C thresholds must survive. Remove guessed S defaults. |
| A03 | P1 | The comparison says No for aptitude when the dataset says not_stated. CompareEngineView.tsx:273–290. The no-aptitude preset similarly treats a false boolean as evidence of absence. | Preserve required / explicitly not required / not stated across every display and filter. Unknown must not be advertised as no test. |
| A04 | P1 | The drawer includes blanket attendance/principal-endorsement text and a standard six-O/L-passes fallback without per-record evidence. ProgramDetailDrawer.tsx:402,418,444. | Render source-backed general and course conditions. Unknown information must remain unknown; cite every mandatory condition. |
| A05 | P1 | Cutoff-based auto-ordering and warnings treat higher historical cutoff as higher preference. PreferenceSimulatorView.tsx:80–90,130–139; ugcLogic.ts auditPreferenceOrder/optimizePreferenceOrder. | Default to student preference. Offer clearly labeled voluntary sorting with preview and Undo; remove claims that a lower-cutoff preference is inherently a mistake. |
| A06 | P1 | Simulated assignment checks only historical cutoff and suspension. It does not check actual eligibility, aptitude, or current allocation. PreferenceSimulatorView.tsx:90–97. | Label as historical illustration or remove. Do not present a predicted allocation or claim lower choices are permanently eliminated without the relevant official context. |
| A07 | P1 | The career quiz generates results with zero answered questions; unanswered responses are assigned neutral. Unequal numbers of questions per Klimov group bias raw totals. CareerAtlasAndQuizView.tsx:75–89,313,355. Observed generation without answering. | Require deliberate responses or explicitly opt into skipping; handle ties; normalize scoring or adopt a documented instrument. Label as interest exploration unless assessment validity is established. |
| A08 | P1 | The generated list says Degrees You Qualify For, but filters only stream and a historical Z margin of -0.18, admits null cutoffs, and takes the first five records. The selected quiz profile does not select these courses. CareerAtlasAndQuizView.tsx:92–103,380. | Remove the qualification claim and arbitrary margin. Use the shared academic evaluator for academic checks and an explicit interest-to-course mapping for recommendations. Explain each recommendation. |
| A09 | P1 | Career-to-degree mappings retain absent canonical codes: 004B,004F,020A,020B,020E,038T,096G. Static source CAREER_ATLAS in sriLankaUgcSnapshot.ts. | Validate every reference against the current offering catalog during build. Review mappings by course identity, institution, and admission year. |
| A10 | P1 | Calendar labels June 15–July 18, 2026 OPEN NOW and July–September windows UPCOMING on 5 November 2026. Observed in browser; statuses are static records. | Use sourced ISO start/end dates, calculate status in Asia/Colombo, distinguish confirmed versus expected dates, and archive past events. Link specific notices. |
| A11 | P1 | Remind Me on WhatsApp only toggles a React array; the interface then says WhatsApp / Alert Set. ProfileAndCalendarView.tsx:718–724,788–796. | Remove this promise until a real subscription and delivery service exists. An Add to calendar export is a smaller honest alternative. |
| A12 | P1 | State discovery infers IESL/SLMC from names, marks all state offerings as having a hostel, infers internships, and changes unknown duration to four years. PredictorView.tsx:449–480. | Use sourced program/campus fields with unknown states. A filter must never convert an inference into a verified claim. |
| A13 | P1 | Location helpers use legacy IDs and default to Western / Colombo City. Canonical MRT,PDN,UJA and others can receive wrong locations. PredictorView.tsx getInstitutionProvince/getInstitutionCampusHub. | Store campus-specific geography in data; provide Unknown as a filter state; avoid geographic defaults. |
| A14 | P1 | The review form ignores the service's success:false response, clears the form, and closes the modal. ProfileAndCalendarView.tsx:118–140; ugcDataService.ts:266–285. | Inspect returned status; retain entered content on failure; show a specific retryable error. Apply the same contract to Q&A and leads. |
| A15 | P1 | Offline reviews/leads/questions save locally while returning success; no evidence establishes delivery to a counselor or community. Seeded reviews carry verification badges; the app claims every reviewer is verified. | Distinguish device draft, submitted, pending moderation, and published states. Verify email ownership server-side before badges. Clearly mark demonstration content. Do not promise staffed responses without that operation. |
| A16 | P1 | Private pathways and cost views contain broad verified, recognition, loan, salary, and placement claims outside the new handbook validation workflow. | Audit each specific program, awarding body, campus, intake, fee, accreditation, and loan status against its own dated official sources. Treat these as a separate dataset. |

**Usability and presentation improvements**

| ID | Priority | Finding and evidence | Required change / completion check |
| --- | --- | --- | --- |
| B01 | P1 | At 390px the header action clips, the guided wizard becomes a narrow text column, and the comparison dock overlaps content above bottom navigation. Observed; evidence image below. | Stack wizard content; reduce fixed controls; create explicit safe bottom spacing; make every visible action reachable without horizontal scrolling or overlay obstruction. |
| B02 | P2 | First-time users receive score 1.52, example A/L grades/CGT, four saved choices, and four comparisons. AppContext.tsx:129–198 and PredictorView initial state. | Start unknown/empty. Add a clearly labeled, reversible example mode. Never imply a student supplied example results. |
| B03 | P2 | Full-screen three-part onboarding and a separate finder wizard repeat setup. Both pending-results and official-score choices lead to the same finder without a distinct starting mode. WelcomeSplashModal.tsx. | Use short optional entry choices; collect relevant information inside the chosen journey; preserve progress. |
| B04 | P2 | District controls, My Plan buttons, header navigation, dock, and bottom navigation repeat the same actions. | Keep a simple primary navigation and one contextual shortlist/compare control. Place secondary tools under a clear More menu. |
| B05 | P2 | Homepage displays literal dollar signs before statistics, stale 140+ / 21 / 276 counts in different screens, and calls all 23 referenced institutions central state offerings. | Fix JSX interpolation; derive counts with scope labels. Distinguish 20 participating institutions from three other referenced institutions, course codes from offerings, and active from suspended records. |
| B06 | P2 | Official atlas wording, Zero-Prediction Accuracy, Safe/Target/Reach onboarding, competitor/Russian references, and tier rankings obscure the product and can imply authority or quality rankings. | Use plain student-facing copy; describe independently transcribed official-source data; remove prototype references and unexplained tiers. |
| B07 | P2 | Cards and drawers expose lengthy handbook excerpts and source formatting. Much supporting text is 10–12px and bold. | Show title, campus, academic-check state, historical cutoff, and a few practical facts. Put the readable complete source excerpt behind a detail section. Increase supporting text and reduce badge density. |
| B08 | P2 | Courses marked for manual review can remain unclear to a student; the source text is present but not broken into steps. | Present Passed / Not met / Still needed for each known check, source links, and a short actionable next step. Keep partial checks distinct from full admission eligibility. |
| B09 | P2 | At least two older route surfaces still substitute unknown medium or missing cutoffs with blanks/NQC. The plan's share/print labels also collapse unknown to NQC. | Use one shared formatter for exact cutoff, NQC, missing history, and category clarification; render unknown degree/duration/medium explicitly. |
| B10 | P2 | Comparison is a wide state-only table despite broader degree/loan positioning; presets are verbose. | Offer two-column mobile comparison with pinned labels and expandable criteria. Either enable explicit state/private comparison or accurately label its current scope. |
| B11 | P2 | The shared student O/L language input cannot establish a specific Sinhala requirement; some subject pools group distinct subjects into one option. | Capture actual subjects separately. Preserve the evaluator's unknown result until the required detail is supplied; use explicit subject aliases. |
| B12 | P2 | Clearing Z input converts invalid/empty input into zero. Z/stream and some progress are inconsistent across reloads while plan/language/district persist. | Use nullable inputs; validate range/precision; preserve a versioned student profile with a clear reset. Explain local storage and saved status. |
| B13 | P2 | Share Filtered View copies window.location.href only. Filters live in component state. PredictorView.tsx:859–866. | Serialize shareable filters and restore them on opening; await clipboard success; offer fallback. Keep personal results out of public links by default. |
| B14 | P2 | Sinhala changes the main heading but guided help and many controls remain English. | Translate complete journeys, errors, accessibility labels, and empty states. Retain official course names while adding localized explanations and search aliases. |
| B15 | P2 | Drawer focus remains on the background trigger after opening. Observed focusInsideDialog:false. Escape exists, but no focus containment/restoration was found. | Move focus into the dialog, contain Tab/Shift+Tab, make background inert, restore focus on close, and use accessible tab semantics. Add skip navigation, associated labels, and reduced-motion support. |
| B16 | P2 | Cutoff loading errors are converted to an empty array without a useful error/retry state. Unknown URL identifiers fall back to unrelated records. | Provide explicit loading/empty/error/not-found states and a way back. Avoid silent substitution with a different campus or course. |

**Content and operational improvements**

| ID | Priority | Finding and evidence | Required change / completion check |
| --- | --- | --- | --- |
| C01 | P1 | ROI calculator calls values actual while using fixed living expenses, salaries, support, tuition, scholarship discount, and internship earnings. DegreeRoiCalculator.tsx:20–83. | Rename as an illustrative cost planner, make assumptions editable, source/date defaults, show ranges, and make awards/earnings opt-in scenarios. Separate tuition, living expenses, loan proceeds, and repayments. |
| C02 | P2 | Career salary ranges and demand labels lack visible dated evidence; entry-level and advanced professional careers are grouped. | Show region, experience level, source/date, uncertainty, and further training requirements. Avoid implying related degrees lead to the same regulated role. |
| C03 | P2 | No visible About, methodology, corrections, privacy, terms, or responsible contact pages in App routing/footer. | Publish concise operational pages explaining ownership, source review status, storage/submission behavior, and how to report a wrong record. |
| C04 | P1 | The checked-in database schema lacks RLS setup, and service/table names differ in places (lead_applications versus student_applications). Live deployment was not inspected. | Before enabling public submissions, verify deployed tables, grants, ownership policies, moderation, rate limits, and secret handling. No conclusion about live exposure is made by this audit. |
| C05 | P2 | Suspended records and original-PDF review tasks exist in staging but are not clearly navigable as a historical archive. | Keep active offerings distinct from historical/suspended records; retain exact source years and unresolved mapping notices. Finish the documented PDF spot checks. |
| C06 | P2 | Data sync is a separate script, outside the standard build, and raw handbook content is duplicated across client datasets. | Use a validated reproducible generation step, a dataset version/checksum, and a small client projection. Keep raw extraction and editorial review artifacts outside the main app bundle. |

**Technical improvements**

| ID | Priority | Finding and evidence | Required change / completion check |
| --- | --- | --- | --- |
| D01 | P2 | Production JavaScript is about 3.07 MB minified / 333 KB gzip; all major views and large JSON datasets import eagerly. | Split routes; lazy-load detailed source/eligibility tables; prune duplicate prose; paginate or progressively render results. Measure production loading on slower phones before selecting a performance budget. |
| D02 | P2 | Public profiles use hash routing, sitemap entries contain fragments, navigation uses buttons, and canonical URL points to the homepage. | Give universities/courses real crawlable paths and anchor links. Generate a clean sitemap, per-page title/description/canonical, social images, and suitable prerendering. |
| D03 | P2 | There is no dedicated invalid-route/record experience; initial profile data can be undefined while loading. | Validate route parameters, provide a real not-found state, guard initial loading, and test direct links, refresh, and Back navigation. |
| D04 | P2 | The 44 tests focus on data logic and rendered cards and miss actual campus identity, reminders, quiz validity, and cross-screen requirement consistency. | Add browser-level tests for these journeys, mobile overflow, keyboard focus, sharing restoration, form failures, and first-visit empty states. Test every view against canonical identities and source states. |
| D05 | P3 | There is no measured evidence of where students abandon the core journey. | Track privacy-conscious aggregate events: discovery started, filters applied, detail opened, comparison added, shortlist saved/exported. Use lightweight student usability sessions to prioritize later work. |

**Remove or hide until implemented correctly**

- Cutoff ordering described as an optimal student preference plan.
- Qualification claims from the current career roadmap and unvalidated psychometric branding.
- WhatsApp reminder confirmation without actual scheduled delivery.
- Unsourced accreditation/hostel/internship badges and financial guarantees.
- Verified-review labels without ownership verification and moderation.
- Sample personal results and saved choices in the default live journey.
- Prototype competitor names, unexplained tier rankings, stale counts, and literal currency signs in statistics.
- Generic S-grade, six-O/L-pass, four-year, or geographic fallbacks presented as facts.

**What to retain**

- Exact historical district cutoff lookup, preserved decimals/NQC, category clarification, and separate year labels.
- Canonical course/offerings data and source traceability.
- Conservative academic matching and explicit review states.
- Optional shortlist and comparison, including deliberate saved-code migration.
- A clear navy/amber identity and Sinhala/Tamil font support.

**Suggested sequence**

1. Correct campus identity, requirement displays, inferred facts, career qualification claims, and false reminders. Add regression tests for these outcomes.
2. Fix mobile overlays and first-visit defaults, simplify discovery, and finish source/state formatting across cards, profiles, comparisons, and plans.
3. Validate private/career/finance content, complete translation, and make forms, privacy, and community verification operationally truthful.
4. Reduce the bundle, improve crawlable public pages, finish accessibility and original-PDF checks, then test with students before launch.

Later product ideas: a sourced cutoff-history comparison, a printable family shortlist with personal notes, an editable total-study-cost comparison, and real opt-in deadline notifications. These are proposals, not current functionality.

**Evidence and authoritative guidance**

- Observed mobile layout: ![Mobile finder with cramped wizard and overlapping dock](</C:/Users/DELL/Downloads/srilakan vuzopedia/docs/qa/audit-mobile-finder-2026-11-05.png>)
- Observed Moratuwa URL with a Colombo profile: ![Incorrect campus identity](</C:/Users/DELL/Downloads/srilakan vuzopedia/docs/qa/audit-campus-mismatch-2026-11-05.png>)
- [Google JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) recommends real navigable URLs and crawlable links for separate content.
- [W3C modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) describes focus entry, containment, and return behavior.
- [Supabase RLS guidance](https://supabase.com/docs/guides/database/postgres/row-level-security) explains the separate grant and row-policy checks needed for exposed tables.
