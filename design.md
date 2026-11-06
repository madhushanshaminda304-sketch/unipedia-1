# UniPedia design system

Active styles: `src/styles/design-tokens.css` is the source for primitive, semantic and component tokens; `src/styles/app.css` retains the existing admission-tool structure; `src/styles/portal.css` consolidates the active portal styles. `portal-next.css` and the older `tokens.css` are retained but not imported. Current identity and route boundaries are documented in `docs/brand-guidelines.md`.

Use Manrope with the existing Noto Sinhala and Tamil fallbacks. Preserve the wordmark, recoloured navy and blue. Navy #14254B establishes hierarchy; action blue #2457DB identifies primary controls; restrained orange #C2410C highlights supporting content; ink #17233B and muted #53627A sit on white or #F6F8FC surfaces. Green is reserved for success states. Spacing uses the shared space scale. One centred 1,200px container, 32px desktop gutters and 16px phone gutters. Keep functional screens denser than the homepage.

Homepage: flat navy opening with left-aligned introductory copy and a white UGC/other route selector and search panel alongside it; stack on phones. Follow with planning tools, compact subject shortcuts, scoped programme examples, institution lists, concise guides and saved choices. Counters always refer to the selected route. Subjects without listings are non-links labelled “No listings yet.” No new photography, decorative numbering, artificial activity or invented testimonials. Phosphor icons accompany labels. Institution initials are text fallbacks, not official logos.

Directory filters are URL state. Source data remains immutable. Unknown fees remain unknown; never combine semester, annual, whole-course or pathway-stage prices. Browsing subjects do not establish academic eligibility. Preserve UGC requirement and cutoff editions, special categories, NQC and incomplete-rule handling.

Keyboard focus is instant and visible. Touch targets are at least 44px. Motion is limited to state changes and respects reduced motion. Body overflow is clipped horizontally; comparison tables may scroll inside labelled focusable regions. Native links, forms and disclosures remain usable without decorative JavaScript.

Language-aware navigation, search and the homepage opening retain EN/SI/TA support. Collected programme research and new guides are English content, marked with the correct language and a translated explanatory note for SI/TA users.
