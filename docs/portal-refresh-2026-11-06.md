# UniPedia discovery refresh

Implemented the user's revised direction: UGC programmes and private/other programmes are separate destinations. This supersedes the earlier unified-directory design.

## Changes

- Replaced the large campus-photo opening with a route selector and prominent programme search. Subject links, programme examples, counts and institution previews follow the selected route.
- `/explore` browses UGC offerings; `/courses` retains the advanced UGC finder. `/pathways` contains private and other programmes. The all-route results option is removed from the interface.
- Search suggestions and directory institution filters are limited to the selected route. Old explicit catalogue query links still open catalogue-only results. Unspecified/all-route links default to UGC.
- Institution directories and comparison screens have separate UGC and other views. Existing saved comparison records remain stored; the four-selection total is preserved. The shortlist retains its separate existing UGC preference plan and other-programme section.
- UGC cards now show district/year-labelled historical cutoffs. Other cards retain reported fees and their payment periods. Unknown duration, awarding-body ambiguity, staged qualifications and original detail pages remain intact.
- Added Phosphor icons, a compact responsive header, full-height mobile menu, clearer programme cards, subject shortcuts, institution previews and guide cards. Notifications have a close button and mobile clearance above the navigation.
- Updated `design.md` and added `docs/brand-guidelines.md`. The active refresh styles are `src/styles/portal-next.css`. Previous components, licensed imagery and data files remain available.

## Skill application

Frontend Design, Landing Page Design, Brand and UI UX Pro Max informed the design and implementation. The UI UX design-system searches returned children's learning/entertainment aesthetics that did not fit this higher-education product; these were not adopted or persisted. Applicable keyboard-navigation and React guidance was used instead. Ask Matt provided workflow routing; the established brief supported direct implementation without another intake interview. Ask Sonner informed the existing single-Toaster configuration and mobile positioning. No unrelated tracker setup, animation library or fabricated social proof was added.

This is a multi-intent homepage, not a campaign landing page. It uses a functional route selector rather than adding a marketing funnel, testimonials or decorative scroll reveals.

## Validation

- All **98 tests passed** across 13 files, including the existing 92 tests and six new route-isolation tests. Coverage includes catalogue partitioning, directory results, institution filters, search destinations, default homepage scope and separate comparison presentation.
- Production build passed and generated 433 public sitemap routes. The large existing data chunk warning remains (main JavaScript about 356.5 KB gzip).
- Browser checks covered homepage route selection, private-only search suggestions and search submission, NIBM foundation filters (4 results) and Back restoration (32 results), and keyboard Escape/focus return from the mobile menu.
- Seven routes were inspected at 375, 768, 1280 and 1920 pixels: homepage, both programme directories, both institution views and both comparison views. All 28 checks found no document horizontal overflow or clipped primary cards/controls. Evidence is in `docs/qa/portal-refresh-responsive.json`.
- The existing five UGC preference entries and two UGC comparison entries remained present. No test saves were added to browser storage in this refresh.
- Screenshots: `portal-refresh-ugc-desktop.jpg`, `portal-refresh-other-desktop.jpg`, `portal-refresh-ugc-phone.jpg`, `portal-refresh-other-phone.jpg` and `portal-refresh-full.jpg` in `docs/qa`.

The site was not deployed. Research facts were preserved rather than independently reverified. Full research translation, accounts, applications and a CMS remain outside this change.
