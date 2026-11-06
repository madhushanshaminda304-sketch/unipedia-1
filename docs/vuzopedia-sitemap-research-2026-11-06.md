# Vuzopedia public information architecture

Observed on 6 November 2026 using the reverse-engineer-anything skill and REA-controlled public requests. No UniPedia application code was changed.

## Evidence

- REA capture parent: `ev_d40eef65cbd4e53494a2f549893d4fbf282f7cfdd7ede7d48bfe3536819f0ebd`.
- Public targets: `https://vuzopedia.ru/robots.txt` and `https://vuzopedia.ru/`.
- Two retained response bodies, zero dropped events in the final capture. Homepage response body: 777,705 bytes. A five-second delay preceded the homepage request, matching the general crawl delay in robots.txt.
- The homepage was fetched through an owned temporary Chromium session. The provider reported termination of the owned browser. These observations establish public links and HTML, not that every linked feature was exercised.
- The web reader received HTTP 403 on direct pages. Indexed public pages and the user's university-page screenshot corroborate university tabs and the distinction between specialty and programme catalogues.
- Earlier captures had response-body or event-allocation omissions. They were not treated as complete content evidence. The final capture used explicit body/allocation limits sufficient for the homepage response.

## Confirmed main public routes

| Area | Observed entry points |
|---|---|
| Universities | `/vuz`, `/vuzy/gosudartsvennue`, `/vuzy/negosudartsvennue` |
| City discovery | `/city/:slug` |
| Interests | `/sphere-list`, `/sphere/:id` |
| Specialties / fields of study | `/napravlenia/bakalavriat`, `/napravlenia/specialitet`, `/napravlenia/magistratura`, plus basic/specialised higher-education groupings |
| Specific programmes | `/program/bakispec`, `/program/magistratura`, plus basic/specialised higher-education groupings |
| Careers | `/professii`, `/podbor-professii`, `/podbor-professii-po-ege` |
| Teachers | `/teacher` |
| Vocational education | `/spo`, `/spo/programs/spednego-professionalnogo-obrazovania`, `/spo/professii` |
| Selection tools | `/vuzypoege`, `/vuzfilter`, `/vuzfilter/spec`, `/vuzfilter/prog`, `/podbor-programmy` |
| Admission planning | `/admission`, `/traektory`, `/traektory-vuzes`, `/analize-admission`, `/admission-aggregate` |
| Costs | `/stoimost-obucheniya`; robots also names tuition/living-cost destinations |
| Comparisons | `/services/comparevuz`, `/compare/catalog/vo/specialty`, `/compare/specialty/vo`, `/compare/catalog/vo/profession`, `/compare/catalog/vo/sphere` |
| Events | `/kalendar`, `/traektory-vuzes` |
| Exams | `/ege`, `/kalkulator-ege`, `/kakie-ege-nuzhno-sdavat`, exam schedules/minimum scores/conversion pages |
| Career tests | `/proforient`, `/proforient/klimov`, `/proforient/po-predmetam` |
| Guides and support | `/navigator-abiturienta`, `/s-chego-nachat`, `/pravila-priema`, `/slovar-postupayushchego`, `/voprosy-o-postuplenii`, `/presscentr`, `/consult`, `/contact-us`, `/documents` |
| Personal-area entry links | `/admission/auth`, `/lk`, `/lk/favorites`, `/forgot-password`, `/delete-account` |
| Institution representatives | `/vuzam`, `/vuzam/registraciya` |

The homepage also links to examination-related services, admissions-list tracking, recommendation tools, licensing/accreditation checking and employer-sponsored education. Presence of a link is not verification of the service's accuracy or current functionality.

## University-page structure

The supplied university screenshot and indexed public university pages expose overview, specialties, programmes, branches/faculties, professions, teachers, questions, reviews, news, dates and contacts. Programme listings show images, qualification/code, study mode, entry exams, short descriptions, price and admission-related actions.

These are contextual views of shared catalogues. A national specialty can connect to several university-specific programmes. Translating both terms simply as “courses” would conceal an important structural distinction.

## XML sitemap declarations

The observed robots.txt declares separate XML sitemaps for comparisons, profession topics, ratings, profession paths, tuition, student costs, school-certificate information, examination scores, discovery, city catalogues and university admissions. It does not declare a single all-purpose XML sitemap index in the captured text. The XML files themselves were not crawled.

## Boundaries

This is a translated logical information-architecture map, not an exhaustive inventory of every URL. Account workflows, every university subpage, private state, service outcomes and full XML coverage remain unverified. No current catalogue-size claims were inferred from older search-index snapshots. This investigation did not change UniPedia's sitemap or implement Vuzopedia features.
