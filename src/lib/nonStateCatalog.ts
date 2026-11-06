import sliit from "../data/nonState/sliit-basic.json";
import cinec from "../data/nonState/cinec-basic.json";
import nsbm from "../data/nonState/nsbm-basic.json";
import nibm from "../data/nonState/nibm-basic.json";
import { PRIVATE_AND_ALTERNATIVE_PROGRAMS } from "../data/sriLankaUgcSnapshot";
export interface BasicProgramme {
  id: string;
  institution: string;
  title: string;
  awarding_body: string | null;
  level: string;
  subject_area: string;
  duration_years: number | null;
  duration_display?: string;
  duration_notes?: string | null;
  programme_notes?: string | null;
  campus_mode?: string | null;
  reported_intake?: string | null;
  reported_fee: string | null;
  fee_notes: string | null;
  requirements: string | null;
  source_url: string;
  source_document: string;
  supporting_urls?: string[];
  source_row?: number;
  report_date: string | null;
  verification_status: string;
}
const previous: BasicProgramme[] = PRIVATE_AND_ALTERNATIVE_PROGRAMS.filter(
  (p) =>
    p.institute_code !== "SLIIT" &&
    !/cinec/i.test(`${p.institute_code} ${p.institute_name}`) &&
    !/nsbm/i.test(`${p.institute_code} ${p.institute_name}`) &&
    !/nibm|national institute of business management/i.test(
      `${p.institute_code} ${p.institute_name}`,
    ) &&
    !p.institute_name
      .toLowerCase()
      .includes("sri lanka institute of information technology"),
).map((p) => ({
  id: p.id,
  institution: p.institute_name,
  title: p.degree_title,
  awarding_body: p.awarding_body || null,
  level: /foundation/i.test(p.degree_title)
    ? "Foundation"
    : /diploma|hnd/i.test(p.degree_title)
      ? "Diploma"
      : "Degree",
  subject_area:
    p.tier === "TIER_2_STATE_NON_UGC"
      ? "Direct entry public programmes"
      : "Other programmes",
  duration_years: p.duration_years || null,
  reported_fee:
    p.tuition_total_lkr && p.tuition_total_lkr > 0
      ? `LKR ${p.tuition_total_lkr.toLocaleString("en-LK")} total (earlier research estimate)`
      : null,
  fee_notes: p.tuition_note || null,
  requirements: null,
  source_url: p.website,
  source_document: "Existing UniPedia programme research",
  report_date: null,
  verification_status: "reported_not_independently_verified",
}));
export const NON_STATE_CATALOG: BasicProgramme[] = [
  ...(sliit as BasicProgramme[]),
  ...(cinec as BasicProgramme[]),
  ...(nsbm as BasicProgramme[]),
  ...(nibm as BasicProgramme[]),
  ...previous,
];
export function searchNonStateProgrammes(
  query: string,
  institution = "",
  level = "",
) {
  const q = query.trim().toLowerCase();
  return NON_STATE_CATALOG.filter(
    (p) =>
      (!q ||
        `${p.title} ${p.institution} ${p.awarding_body || ""} ${p.subject_area}`
          .toLowerCase()
          .includes(q)) &&
      (!institution || p.institution === institution) &&
      (!level || p.level === level),
  ).sort(
    (a, b) =>
      a.title.localeCompare(b.title) ||
      a.institution.localeCompare(b.institution),
  );
}
