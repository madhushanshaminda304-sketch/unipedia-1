# Reference-led UniPedia landing page

Implemented from the user's supplied `UniGuide.lk Sri Lanka University Explorer.png` reference on 6 November 2026.

The homepage now has a full-width white masthead, centred headline and search over a Colombo skyline photograph, separate lavender UGC and blue direct-entry pathway cards, six functional study tools and a four-step planning section. The UniPedia name, Manrope typography, language selector and underlying catalogue remain intact. The existing lower homepage sections remain available. The paper-animation component and stylesheet are retained but no longer imported by the homepage, following the new screenshot direction.

Search retains an explicit admission-route selector. Programme suggestions, subject shortcuts, catalogue previews and comparison links follow that selection. The two major pathway links always remain available. The direct-entry card uses “Private & other programmes” rather than claiming all institutions in the catalogue are privately owned. No sign-in, application service, popularity rankings or deadlines were invented.

Photographs are local assets with a combined size of approximately 600 KB. Their sources, authors, licenses and display modifications are recorded in `public/images/credits.json` and in expandable homepage credits. Campus photographs are individually captioned. No third-party runtime image requests or new production dependencies were added.

Keyboard testing exposed native search-field Escape behaviour clearing the query when closing suggestions. The search handler now prevents that default action while closing its suggestions.

## Verification

- Production build passed. The existing Vite warning about chunks larger than 500 KB remains.
- 104 tests across 14 files passed, including two new homepage pathway/presentation checks. Catalogue tests confirm 255 UGC and 130 other programmes remain separate.
- Isolated Chromium rendered checks passed at 375 × 812, 390 × 844, 768 × 1024, 1280 × 800, 1536 × 1024, 1920 × 1080 and 844 × 390.
- Checked document overflow and bounds of header controls, homepage actions, pathway cards and planning steps. No horizontal escapes were found.
- Both scoped searches submitted to the correct destinations. Tested keyboard suggestion navigation, Escape without query loss, keyboard route switching, mobile menu Escape, image loading and reduced motion.
- A 640 × 400 viewport was checked as a 200%-equivalent layout width; browser-native zoom itself was not tested.
- Before/after desktop and phone screenshots are in `docs/qa/`; rendered checks are recorded in `docs/qa/reference-home-checks.json`.
- No full manual screen-reader audit or exhaustive contrast audit was performed.

Existing datasets, routes, saved-state keys and unrelated uncommitted work were preserved. No deployment was performed.
