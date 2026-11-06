# UniPedia brand guidelines

UniPedia helps Sri Lankan students understand their study options and make their own choices. It is an independent guide, not an admissions authority.

## Voice

Be practical, welcoming and specific. Use familiar student language: programmes, entry requirements, fees, duration and saved choices. Keep labels consistent across navigation and actions. Avoid motivational filler, invented rankings, popularity claims and admissions guarantees.

## Identity

Preserve the UniPedia.lk wordmark and Manrope. Sinhala and Tamil text use the existing Noto fallbacks. The approved identity replaces the former green brand with navy `#14254B`, action blue `#2457DB`, restrained orange `#C2410C`, background `#F6F8FC`, white `#FFFFFF`, ink `#17233B` and muted text `#53627A`. Both admission routes share this identity. Orange highlights supporting content; green is reserved for factual success states. Subject illustrations use a consistent blue treatment rather than rainbow tiles.

The three token layers live in `src/styles/design-tokens.css`: primitive values, semantic purpose aliases, then component roles. `src/styles/app.css` retains the admission-tool structure and `src/styles/portal.css` is the single active portal stylesheet. `portal-next.css` remains as a historical reference and is not imported. Use the shared spacing scale, 8px controls, 12px cards and the established type sizes. Keep the portal container capped at 1,200px. Interfaces have instant visible focus, pointer press feedback, readable contrast and reduced motion support. Repeated keyboard actions do not animate.

## Programme routes

UGC and other programmes occupy separate directories, search scopes, institution views and comparison views. `/explore` is UGC browsing, `/courses` is the advanced UGC finder, and `/pathways` is private and other programmes. Do not add an all-route results option. Some institutions outside central UGC admissions are government institutions, so use “Private & other programmes” rather than labelling every listing private.

Preserve qualification variants and awarding bodies. Subject tags help browsing; they do not establish eligibility. Display historical cutoffs with district and admission year. Keep annual, semester, stage and whole-programme fee periods intact. Preserve source uncertainty next to the affected fact.

## Imagery and marks

Use only properly sourced, licensed assets. Institution initials are text fallbacks, not official logos. The former student photograph and its licence record remain available but are not used in the refreshed homepage. Avoid generic campus imagery or visual endorsement claims.
