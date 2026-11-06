// Editorial profile information supplements catalogue facts; it never changes offerings or eligibility.
interface InstitutionProfileResearch {
  website: string;
  overview: string;
  address: string;
  telephones: string[];
  admissions: string;
  admissionsLinks: { label: string; href: string }[];
  sources: { label: string; href: string }[];
  reportDate: string;
  cover: { src: string; srcSet: string; width: number; height: number; alt: string };
}
const colomboSources = {
  contact: { label: "Central university contact directory", href: "https://cmb.ac.lk/contact-us" },
  undergraduate: { label: "University of Colombo undergraduate programmes", href: "https://cmb.ac.lk/undergraduate-programmes" },
  admissions: { label: "Official UGC undergraduate admissions portal", href: "https://admission.ugc.ac.lk/" },
  handbook: { label: "UGC admissions handbook 2025/2026 (PDF)", href: "https://www.ugc.ac.lk/downloads/admissions/Handbook_2025_26/student_handbook_english.pdf" },
};
export const INSTITUTION_PROFILES: Readonly<Record<string, InstitutionProfileResearch>> = {
  CMB: {
    website: "https://cmb.ac.lk/",
    overview: "The University of Colombo is a state university in Colombo, Sri Lanka, offering undergraduate study across arts, education, law, management and finance, medicine, nursing, science, technology and indigenous medicine. Its central administration is based at College House in Colombo 03. UniPedia lists the University of Colombo School of Computing (UCSC) and Sri Palee Campus separately.",
    address: "College House, 94, Cumaratunga Munidasa Mawatha, Colombo 03, Sri Lanka",
    telephones: ["+94 11 258 1835", "+94 11 258 4695", "+94 11 258 5509"],
    admissions: "Admission to full-time internal undergraduate programmes is coordinated by the University Grants Commission (UGC). Consult the relevant admissions handbook and official notices, then submit your course preferences through the UGC admissions process. General eligibility does not establish eligibility for every programme: use the programme links above to check subject and grade requirements and any additional conditions. Historical district cutoffs are a reference, not an admission guarantee.",
    admissionsLinks: [colomboSources.admissions, colomboSources.handbook, colomboSources.undergraduate],
    sources: [
      { label: "University of Colombo official website", href: "https://cmb.ac.lk/" },
      colomboSources.contact, colomboSources.undergraduate,
      colomboSources.admissions, colomboSources.handbook,
    ],
    reportDate: "2026-11-06",
    cover: {
      src: "/images/colombo-profile-597.webp",
      srcSet: "/images/colombo-profile-400.webp 400w, /images/colombo-profile-597.webp 597w",
      width: 597, height: 335,
      alt: "White university building with a central tower and red-tiled roofs, with trees and a lawn in front",
    },
  },
};
