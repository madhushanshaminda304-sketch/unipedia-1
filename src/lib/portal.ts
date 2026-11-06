import { NON_STATE_CATALOG, type BasicProgramme } from "./nonStateCatalog";
import { getProgramCutoffRowsForDistrict } from "../services/ugcAdapter";
import type { ProgramCutoffViewRow } from "../data/ugc/types";

export type ProgrammeRef = { kind: "ugc" | "catalogue"; id: string };
export const SUBJECTS = [
  "Computing",
  "Business",
  "Engineering",
  "Health",
  "Science",
  "Arts & Design",
  "Education",
  "Other",
] as const;
export type Subject = (typeof SUBJECTS)[number];
// Browsing taxonomy only. Never used to evaluate admission eligibility.
const SUBJECT_RULES: [Subject, RegExp][] = [
  ["Engineering", /biomedical engineering/],
  [
    "Science",
    /agricultur|biotechnology|food.*(?:science|technology)|sports science/,
  ],
  ["Education", /education|teaching|tesol/],
  [
    "Health",
    /medicine|medical|nurs|pharmacy|physiotherap|health|dental|ayurveda/,
  ],
  [
    "Computing",
    /comput|software|data science|information (technology|systems)|information and communication technology|cyber|artificial intelligence|network|ict|\bit\b/,
  ],
  [
    "Engineering",
    /engineer|quantity survey|construction|architecture|built environment|technology/,
  ],
  [
    "Business",
    /business|management|commerce|account|financ|econom|logistic|transport|marketing|banking|tourism|hospitality/,
  ],
  [
    "Arts & Design",
    /arts|design|multimedia|music|dance|drama|cinema|language|english|translation|communication|humanit|law|social/,
  ],
  [
    "Science",
    /science|mathematics|statistic|agricultur|chemistry|physics|biolog|psychology|animal|food/,
  ],
];
export function subjectFor(title: string): Subject {
  return (
    SUBJECT_RULES.find(([, r]) => r.test(title.toLowerCase()))?.[0] || "Other"
  );
}
export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export function catalogueYears(p: BasicProgramme) {
  const months = p.duration_display?.match(/^(\d+) Months?(?:\s*\([^)]*\))?$/i);
  return p.duration_years ?? (months ? Number(months[1]) / 12 : null);
}
export interface DiscoveryProgramme {
  ref: ProgrammeRef;
  key: string;
  title: string;
  institution: string;
  institutionId: string;
  href: string;
  institutionHref: string;
  level: string;
  subject: Subject;
  duration: string;
  years: number | null;
  fee: string;
  hasFee: boolean;
  award: string;
  requirements: string;
  campus: string;
  source?: BasicProgramme;
  ugc?: ProgramCutoffViewRow;
}
export function discoveryProgrammes(
  rows = getProgramCutoffRowsForDistrict(1),
): DiscoveryProgramme[] {
  return [
    ...rows.map((p) => ({
      ref: { kind: "ugc" as const, id: p.uni_code },
      key: `ugc:${p.uni_code}`,
      title: p.course_name,
      institution: p.institution_name,
      institutionId: p.institution_code,
      href: `/courses/${p.uni_code}`,
      institutionHref: `/universities/${p.institution_code}`,
      level: "Degree",
      subject: subjectFor(p.course_name),
      duration: p.duration_display || "Not stated",
      years: p.duration_years,
      fee: "Check official UGC programme information",
      hasFee: false,
      award: p.degree_display,
      requirements: p.al_requirements_summary,
      campus: p.institution_location,
      ugc: p,
    })),
    ...NON_STATE_CATALOG.map((p) => ({
      ref: { kind: "catalogue" as const, id: p.id },
      key: `catalogue:${p.id}`,
      title: p.title,
      institution: p.institution,
      institutionId: slugify(p.institution),
      href: `/programmes/${p.id}`,
      institutionHref: `/institutions/${slugify(p.institution)}`,
      level: p.level,
      subject: subjectFor(p.title),
      duration:
        p.duration_display ||
        (p.duration_years
          ? `${p.duration_years} years`
          : "Contact institution"),
      years: catalogueYears(p),
      fee: p.reported_fee || "Contact institution",
      hasFee: !!p.reported_fee,
      award: p.awarding_body || "Contact institution",
      requirements:
        p.requirements ||
        "Contact the institution for complete entry requirements.",
      campus: p.campus_mode || "Contact institution",
      source: p,
    })),
  ];
}
export function discoveryInstitutions(programmes: DiscoveryProgramme[]) {
  return Array.from(new Set(programmes.map((p) => p.institutionHref)))
    .map((href) => {
      const rows = programmes.filter((p) => p.institutionHref === href),
        first = rows[0];
      return {
        id: first.institutionId,
        name: first.institution,
        href,
        count: rows.length,
        kind: first.ref.kind,
        subjects: Array.from(new Set(rows.map((p) => p.subject))),
        website:
          first.ugc?.institution_website || first.source?.source_url || "",
        location: first.ugc?.institution_location || "",
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
export interface ExploreFilters {
  q: string;
  route: string;
  level: string;
  subject: string;
  institution: string;
  duration: string;
  fees: string;
  page: number;
}
export const EMPTY_EXPLORE: ExploreFilters = {
  q: "",
  route: "all",
  level: "",
  subject: "",
  institution: "",
  duration: "",
  fees: "",
  page: 1,
};
export function readExplore(params: URLSearchParams): ExploreFilters {
  const one = (name: string, values: string[], fallback = "") =>
    values.includes(params.get(name) || "") ? params.get(name)! : fallback;
  return {
    q: params.get("q") || "",
    route: one("route", ["all", "ugc", "catalogue"], "all"),
    level: one("level", ["Degree", "Diploma", "Foundation"]),
    subject: one("subject", [...SUBJECTS]),
    institution: params.get("institution") || "",
    duration: one("duration", ["short", "four", "long", "unknown"]),
    fees: one("fees", ["reported", "unknown"]),
    page: Math.max(1, Math.min(1000, Number(params.get("page")) || 1)),
  };
}
export function writeExplore(filters: ExploreFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v && v !== EMPTY_EXPLORE[k as keyof ExploreFilters])
      params.set(k, String(v));
  });
  return params.toString();
}
export function filterDiscovery(rows: DiscoveryProgramme[], f: ExploreFilters) {
  const terms = f.q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return rows
    .filter(
      (p) =>
        terms.every((q) =>
          `${p.title} ${p.institution} ${p.award} ${p.subject} ${p.ref.id}`
            .toLowerCase()
            .includes(q),
        ) &&
        (f.route === "all" || p.ref.kind === f.route) &&
        (!f.level || p.level === f.level) &&
        (!f.subject || p.subject === f.subject) &&
        (!f.institution || p.institutionId === f.institution) &&
        (!f.fees || (f.fees === "reported" ? p.hasFee : !p.hasFee)) &&
        (!f.duration ||
          (f.duration === "unknown"
            ? p.years === null
            : p.years !== null &&
              (f.duration === "short"
                ? p.years <= 3
                : f.duration === "four"
                  ? p.years === 4
                  : p.years > 4))),
    )
    .sort(
      (a, b) =>
        a.title.localeCompare(b.title) ||
        a.institution.localeCompare(b.institution),
    );
}
export function validCatalogueIds(value: unknown): string[] {
  return Array.isArray(value)
    ? [
        ...new Set(
          value.filter(
            (id): id is string =>
              typeof id === "string" &&
              NON_STATE_CATALOG.some((p) => p.id === id),
          ),
        ),
      ]
    : [];
}
export function nextComparison(
  current: string[],
  id: string,
  otherCount: number,
) {
  return current.includes(id)
    ? current.filter((x) => x !== id)
    : current.length + otherCount < 4
      ? [...current, id]
      : current;
}

export const GUIDES = [
  {
    slug: "understanding-z-scores",
    title: "What does your Z-score tell you?",
    description:
      "Use district cutoffs as a reference when exploring state degrees.",
    sections: [
      [
        "Start with the right admission year",
        "A cutoff is a historical selection result for an admission year, district and sometimes a subject category. Select the edition in the UGC finder before comparing your score.",
      ],
      [
        "Check the requirements too",
        "Your Z-score alone does not establish eligibility. Subject combinations, grades, O/L requirements and aptitude tests may also apply. Use the course requirements alongside the cutoff.",
      ],
      [
        "Keep your preferences personal",
        "A previous cutoff does not guarantee admission. Put courses in the order you want to study them and check current official UGC instructions before applying.",
      ],
    ],
    source: "https://www.ugc.ac.lk/",
    sourceName: "University Grants Commission",
    action: "/courses",
    actionLabel: "Open the UGC course finder",
  },
  {
    slug: "degree-or-hnd",
    title: "Degree, diploma or HND?",
    description: "Understand the qualification and the route before choosing.",
    sections: [
      [
        "Look at the award, not just the title",
        "Check who teaches the programme and who awards the qualification. A diploma and a degree delivered at the same institution may have different awarding bodies.",
      ],
      [
        "Ask how progression works",
        "Some programmes form a staged pathway. NIBM research, for example, describes diploma and HND stages before partner-awarded degree stages. Progression can have further entry conditions and fees.",
      ],
      [
        "Compare the full journey",
        "Check duration, the qualification at each exit point, top-up requirements and costs for each stage. Do not assume that every HND guarantees entry to every degree.",
      ],
    ],
    source: "https://nibm.ac.lk/programme/degree-programmes",
    sourceName: "NIBM degree programme directory",
    action: "/pathways?level=Diploma",
    actionLabel: "Explore diplomas and HNDs",
  },
  {
    slug: "foundation-routes",
    title: "Your options after O/Ls",
    description: "Find foundation routes and understand what comes next.",
    sections: [
      [
        "Check the subjects and grades",
        "Foundation entry rules differ by programme and stream. English, Mathematics or Science requirements can apply even when a programme accepts O/L entrants.",
      ],
      [
        "Check the destination degree",
        "Ask which degrees accept the foundation, whether a test or additional subject requirement applies, and whether progression is conditional.",
      ],
      [
        "Budget for both stages",
        "A foundation fee usually covers the foundation, not the following degree. Compare the length and fees of the whole pathway before deciding.",
      ],
    ],
    source:
      "https://www.nsbm.ac.lk/course/foundation-programme-for-bachelors-degree/",
    sourceName: "NSBM foundation programme",
    action: "/pathways?level=Foundation",
    actionLabel: "Explore foundation programmes",
  },
  {
    slug: "planning-study-costs",
    title: "What will studying really cost?",
    description: "Separate tuition, registration and everyday costs.",
    sections: [
      [
        "Keep the payment basis visible",
        "A semester price, annual price and whole-programme fee describe different things. If only one stage is priced, ask for the remaining stages.",
      ],
      [
        "List the additional costs",
        "Check registration, examinations, library charges, repeat modules, equipment, travel and accommodation. Overseas partner or transfer fees may use a different currency.",
      ],
      [
        "Use your own estimates",
        "Write down confirmed tuition, months of study, monthly living costs and other costs. The budget planner uses these inputs without assuming a scholarship or loan approval.",
      ],
    ],
    source: "https://www.cinec.edu/",
    sourceName: "CINEC official programme information",
    action: "/pathways#study-budget",
    actionLabel: "Open the study budget planner",
  },
];
