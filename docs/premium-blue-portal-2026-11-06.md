# UniPedia premium blue portal

Implemented the approved whole-site navy, blue, white and restrained orange direction. UGC and private/other programmes remain separate. Programme research and admissions logic were not rewritten.

## Design and implementation

| Before | After | Why |
| --- | --- | --- |
| Green branding and rainbow subject backgrounds | Navy structure, blue actions, restrained orange guide icons | A distinct identity with consistent hierarchy |
| Palette overrides across portal stylesheets | Primitive, semantic and component tokens in `src/styles/design-tokens.css` | One active palette for new and retained screens |
| Centred opening and repeated card treatments | Navy introduction beside white scoped search; compact subject strip; institution lists and concise guides | Different information has a distinct visual role |
| Staggered menu entrance | Immediate keyboard interaction, native focus behaviour and brief pointer feedback | Repeated actions stay responsive |
| Hidden active filter state | Removable filter chips preserving other query parameters | Filters are understandable and shareable |
| Generic loading text and modal-style standalone course heading | Shaped loading placeholders and a proper standalone UGC main heading | Better loading hierarchy and page semantics |

The active portal rules are consolidated into `src/styles/portal.css`; `portal-next.css` is retained but no longer imported. Raw palette colours live in the token file. Legacy colour variables map to semantic roles; success remains green. The existing type sizes were normalised to the approved scale. The wordmark and favicon now use navy and blue. Shared controls, profiles, programme details, tables, saved choices, guides, older UGC screens, footer and dialogs use the same system.

The heading is “Find your course in Sri Lanka.” Route selection changes search suggestions, subject links, real counts, examples and institution previews together. Subjects without listings have a non-link “No listings yet” state. UGC cards keep district/year-labelled historical cutoffs; other cards retain fees and payment periods. All 255 UGC offerings and 130 other programme variants remain covered by the catalogue tests.

## Validation

- **102 tests passed**, including all 98 existing tests, three new filter-control tests and a standalone UGC heading regression check.
- **Production build passed**, with 433 sitemap routes. Existing large-data-chunk warning remains: main JavaScript approximately 356.8 KB gzip; CSS approximately 14.0 KB gzip. No animation library or production dependency was added in this change.
- **36 responsive checks passed**: nine representative screens at 375, 768, 1280 and 1920 pixels. These checked actual bounds of primary cards/controls as well as document horizontal overflow. No page errors were recorded. Results: `docs/qa/premium-responsive.json`.
- Verified both programme routes through search, filters, pagination/reload and saving. Removing an individual filter preserves the admission route, other filters and unrelated query parameters. Browser Back restores the preceding state.
- Synthetic saved UGC ordering and locks survived, imported saves survived reload, comparisons remained separate and a fifth total selection was rejected. Both historical cutoff editions remained selectable.
- Verified keyboard search, mobile menu focus trapping, Escape closure and focus restoration. Reduced motion disables transitions and movement. Phone landscape passed without horizontal overflow.
- A 200% browser-zoom layout equivalent was checked at 640 CSS pixels within a 1280px window. This is responsive-layout emulation, not a claim of a manual native browser-zoom test.
- Representative text contrast measurements ranged from **5.71:1 to 15.04:1**, covering the hero heading, supporting text, primary button, section link and programme fact text. This is not a complete independent accessibility audit.
- Detailed results: `docs/qa/premium-flow-results.json` and `premium-extra-results.json`.

## Browser verification and preservation

The previous in-app browser control became unavailable during the session. Automatic approval review rejected reading a general Chrome window because it might expose unrelated private tabs. Verification instead used headless Chrome with a fresh isolated Playwright context, restricted to localhost and public font resources. Synthetic storage belonged only to that context; the user's normal browser storage was not read or modified. The QA dependency is confined to the ignored `.hallmark/qa` folder.

The current working diff/status and prior styles were recorded in `.hallmark/premium-baseline`. Before screenshots were retained from the preceding rendered version. After screenshots are actual browser renders: `premium-home-desktop.png`, `premium-home-phone.png`, `premium-home-full.png`, `premium-other-phone.png`, `premium-directory-desktop.png`, `premium-comparison.png`, `premium-ugc-detail.png` and `premium-zoom-layout.png` in `docs/qa`.

No routes, datasets or component files were deleted. Existing uncommitted work, saved-state keys, cutoff editions, fee caveats and language boundaries remain in place. No deployment was performed.
