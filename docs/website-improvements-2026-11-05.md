# UniPedia implementation report — 5 November 2026

This implementation follows the website audit. It changes the local website only. No deployment, database migration, account changes or outbound submissions were made.

## Implemented

**Later update:** the official 2025/2026 cutoff release has now been added as the default, with 2024/2025 retained for comparison, and advanced filters have been implemented. See [the cutoff-year update](cutoff-years-and-advanced-filters-2026-11-05.md). The earlier single-year limitation below is superseded; handbook requirement PDF review remains outstanding.

| Area                    | Result                                                                                                                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Homepage and navigation | Clear student journey, dataset counts derived from canonical records, direct institution links, compact navigation, mobile navigation with reserved space.                                                                |
| Finder                  | Search, admission district, stream, published medium, optional official Z score, optional academic details, pagination and useful empty states. Mobile filters collapse.                                                  |
| First visit             | No fabricated score, grades, General Paper mark, shortlist or comparison choices. Existing saved plans are retained.                                                                                                      |
| Academic checks         | Existing conservative evaluator retained. Missing information and unsupported rules remain uncertain. Historical cutoffs are separate from academic checks.                                                               |
| Course requirements     | Readable requirement preview, full extracted section on demand, actual degree/duration/medium/intake, conditional honours information and accurate unknown values.                                                        |
| Historical cutoffs      | Exact numeric scores, negative scores, NQC, absent history and stream categories stay distinct. Split matrices require a stream. NQC explanation includes its different handbook causes.                                  |
| Institution profiles    | Canonical identifiers and separate campus identities. Moratuwa opens Moratuwa. Unknown records get a missing-record page rather than a Colombo fallback.                                                                  |
| Shortlist               | Manual ordering, removal, persistence and printing. Code migration suggestions require explicit acceptance; backup restoration remains available after review. No automatic cutoff-based ranking or predicted assignment. |
| Comparison              | Up to four actual state UGC offerings. Requirements come from source text. Unstated aptitude information is not displayed as “No”. Adding a fifth course does not silently discard an existing choice.                    |
| Interests               | Explicit interest selection and transparent course-title matching replace the unvalidated personality quiz and arbitrary eligibility roadmap.                                                                             |
| Dates                   | No static “open now” dates or nonfunctional alert subscriptions. Official notice resources and a clear absence-of-confirmed-deadlines message.                                                                            |
| Other pathways          | Official provider/funding resources and a course-specific verification checklist replace the unverified private-program directory in the visible UI. Existing underlying datasets remain in the repository.               |
| Cost planning           | All estimates come from the user. Empty inputs do not produce an invented total. No assumed salary, fee, grant, internship or loan approval.                                                                              |
| Trust and privacy       | About/source methodology, limitations, privacy/device storage explanation, confirmed device-data clearing, terms and a correction-template copier with no false submission success.                                       |
| Accessibility           | Native modal dialogs, focus containment/restoration, Escape dismissal, form labels, route focus, skip link, keyboard actions and current-page navigation markers.                                                         |
| Sharing and URLs        | Browsing-filter links restore query, district, stream and medium. Grades and Z scores are excluded. Real paths retain old hash bookmark compatibility. Public sitemap generated from the catalog.                         |
| Loading                 | Page components load on demand. Loading and error states are present. The large underlying dataset still loads initially; see remaining work.                                                                             |
| Language                | Common navigation and finder controls support English, Sinhala and Tamil. Detailed guidance and handbook content remain English; the About page states this limitation.                                                   |

## Removed from visible user flows

- Inferred hostel availability, accreditation, internship guarantees, location filters and default four-year durations.
- Seeded verified-looking community reviews and Q&A submission flows without trustworthy publication behavior.
- Career salary claims, fabricated eligibility recommendations and a quiz that generated results without answers.
- False WhatsApp/reminder success and past deadlines presented as current.
- Automatic preference ordering and admission certainty based on historical cutoffs.

## Validation

- Production TypeScript/Vite build passes.
- 61 automated tests cover admission logic, dataset isolation, exact mapping behavior, unknown values, first-visit defaults, blocked/malformed browser storage, migration review, real/legacy routes and misleading-claim regressions.
- Browser checks at 1440 × 1000 and 390 × 844: canonical Moratuwa profile; course search; requirements dialog; keyboard containment/Escape/focus restoration; actual Medicine S/C/C form result; saved-plan reload; manual reorder; comparison; filtered URL copying/restoration; Sinhala/Tamil headings and mobile overflow.
- Temporary test academic data, saved Medicine choice and comparison entry were removed. The four previously saved choices were restored in their original order.
- Screenshots: `docs/qa/redesign-desktop-home.jpg` and `docs/qa/redesign-mobile-finder.jpg`.

## Remaining work before stronger public claims

1. **Original PDF verification.** AI extraction plus Markdown checks cannot certify the handbook values. Check the unresolved staging issues against the original PDF; continue to display `needs_review` until that work is actually complete.
2. **Additional cutoff years.** The available historical dataset is 2024/2025. Do not label it 2025/2026 or invent an older-year toggle. Add another edition only after extracting and validating its actual cutoff tables.
3. **Program-specific private data.** Reintroduce the private-program directory only with official course sources for award, recognition, full fees, location, entry requirements and funding conditions.
4. **Full translation.** Professionally review Sinhala/Tamil controls and translate the remaining guidance. Preserve official English names and requirement text alongside any translation.
5. **Further performance work.** Route UI is split into small chunks, but the source-rich dataset remains in the initial JavaScript bundle (approximately 2.78 MB before compression, 273 kB gzip). Vite still emits its large-chunk warning. Move long source excerpts and detailed historical tables into demand-loaded data before claiming mobile performance targets. No Lighthouse/Core Web Vitals score is claimed.
6. **Hosting and SEO.** Keep SPA fallback routing for direct `/courses/...` and `/universities/...` refreshes. The existing `public/_redirects` supplies this on compatible hosts. Server rendering or prerendering remains necessary for dependable non-JavaScript/social previews. The sitemap assumes the existing `unipedia.lk` production domain.
7. **Backend/community services.** A real moderated review/correction/deadline service, verified timestamps, authentication and database RLS review remain separate work. No live database policies were inspected or changed here.

The redesigned tools keep the 2025/2026 requirements and 2024/2025 historical cutoffs explicitly separate. They do not make an official admission decision.
