// Editorial profile information supplements catalogue facts.
type ProfileLink = { label: string; href: string };

interface InstitutionProfileResearch {
  website: string;
  overview: string;
  address: string;
  telephones: string[];
  email?: string;
  admissions: string;
  admissionsLinks: ProfileLink[];
  sources: ProfileLink[];
  reportDate: string;
  cover?: { src: string; srcSet: string; width: number; height: number; alt: string };
}
const colomboSources = {
  contact: { label: "Central university contact directory", href: "https://cmb.ac.lk/contact-us" },
  undergraduate: { label: "University of Colombo undergraduate programmes", href: "https://cmb.ac.lk/undergraduate-programmes" },
  admissions: { label: "Official UGC undergraduate admissions portal", href: "https://admission.ugc.ac.lk/" },
  handbook: { label: "UGC admissions handbook 2025/2026 (PDF)", href: "https://www.ugc.ac.lk/downloads/admissions/Handbook_2025_26/student_handbook_english.pdf" },
};

function undergraduateProfile({
  contact,
  programmes,
  additionalSources = [],
  ...profile
}: Pick<InstitutionProfileResearch, "website" | "overview" | "address" | "telephones" | "email" | "reportDate"> & {
  contact: string;
  programmes: ProfileLink;
  additionalSources?: ProfileLink[];
}): InstitutionProfileResearch {
  const admissionsLinks = [colomboSources.admissions, colomboSources.handbook, programmes];
  return {
    ...profile,
    admissions: "Apply for UGC-listed internal undergraduate programmes through the UGC admissions process. Use the relevant intake's handbook and the programme links above to check subject and grade requirements. Check official university notices for any additional tests or registration instructions for that intake.",
    admissionsLinks,
    sources: [
      { label: "Official university website", href: profile.website },
      { label: "Central university contact directory", href: contact },
      ...admissionsLinks,
      ...additionalSources,
    ],
  };
}

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
  KLN: undergraduateProfile({
    website: "https://www.kln.ac.lk/",
    overview: "The University of Kelaniya is a state university whose main campus is in Dalugama, Kelaniya. It traces its origins to Vidyalankara Pirivena, founded in 1875. Undergraduate study spans humanities, social sciences, science, medicine, commerce and management, and computing and technology.",
    address: "218 Kandy Road, Dalugama, Kelaniya 11600, Sri Lanka",
    telephones: ["+94 11 290 3903"],
    email: "oneuok@kln.ac.lk",
    contact: "https://www.kln.ac.lk/contact",
    programmes: { label: "University of Kelaniya undergraduate portal", href: "https://www.kln.ac.lk/study/undergraduate" },
    reportDate: "2026-11-06",
  }),
  PDN: undergraduateProfile({
    website: "https://www.pdn.ac.lk/",
    overview: "The University of Peradeniya is a public residential university near Kandy. Its campus lies by the Mahaweli River at the foothills of the Hantana range. Its faculties cover agriculture, arts, science, engineering, management, medicine, dental sciences, allied health, and veterinary medicine and animal science.",
    address: "Peradeniya 20400, Sri Lanka",
    telephones: ["+94 81 238 8301"],
    contact: "https://www.pdn.ac.lk/ContactPage",
    programmes: { label: "University of Peradeniya undergraduate admission", href: "https://www.pdn.ac.lk/Undergraduates" },
    reportDate: "2026-11-06",
  }),
  SJP: undergraduateProfile({
    website: "https://www.sjp.ac.lk/",
    overview: "The University of Sri Jayewardenepura is a state university with its main campus in Gangodawila, Nugegoda. Undergraduate study includes humanities and social sciences, management and commerce, applied sciences, health sciences, computing, engineering and technology.",
    address: "Gangodawila, Nugegoda, Sri Lanka",
    telephones: ["+94 11 275 6000", "+94 11 275 8000", "+94 11 280 2022"],
    email: "info@sjp.ac.lk",
    contact: "https://www.sjp.ac.lk/contact-us/",
    programmes: { label: "University of Sri Jayewardenepura undergraduate courses", href: "https://www.sjp.ac.lk/undergraduate-courses/" },
    additionalSources: [{ label: "University overview and general email", href: "https://www.sjp.ac.lk/about-2/" }],
    reportDate: "2026-11-06",
  }),
  RUSL: undergraduateProfile({
    website: "https://www.rjt.ac.lk/",
    overview: "Rajarata University of Sri Lanka is a public university that opened in 1996. Its main campus is in Mihintale, near Anuradhapura. Its faculties cover agriculture, applied sciences, management, medicine and allied sciences, social sciences and humanities, and technology.",
    address: "Mihintale 50300, Sri Lanka",
    telephones: ["+94 25 226 6643"],
    email: "info@rjt.ac.lk",
    contact: "https://www.rjt.ac.lk/contacts-2/",
    programmes: { label: "Rajarata University academic programmes", href: "https://www.rjt.ac.lk/academic-programs/" },
    reportDate: "2026-11-06",
  }),
  UJA: undergraduateProfile({
    website: "https://jfn.ac.lk/",
    overview: "The University of Jaffna began as a campus of the University of Sri Lanka in 1974. Its main campus is in Thirunelvely, with additional premises in the Northern Province, including Kilinochchi. Its fields of study include arts, science, engineering, agriculture, medicine, technology, management, and performing and visual arts.",
    address: "P.O. Box 57, Ramanathan Road, Thirunelvely, Jaffna, Sri Lanka",
    telephones: ["+94 21 221 8100", "+94 21 221 8101"],
    email: "info@univ.jfn.ac.lk",
    contact: "https://jfn.ac.lk/contact-us/",
    programmes: { label: "University of Jaffna degree programmes", href: "https://jfn.ac.lk/degree-programmes/" },
    additionalSources: [{ label: "University switchboard and telephone directory", href: "https://jfn.ac.lk/telephone-directory/" }],
    reportDate: "2026-11-06",
  }),
  SEUSL: undergraduateProfile({
    website: "https://www.seu.ac.lk/",
    overview: "South Eastern University of Sri Lanka is a state university with its main campus at University Park in Oluvil. The Faculty of Applied Sciences is based in Sammanthurai. Its other faculties cover arts and culture, management and commerce, Islamic studies and Arabic language, engineering, and technology.",
    address: "University Park, Oluvil 32360, Sri Lanka",
    telephones: ["+94 67 225 5062", "+94 67 225 5063", "+94 67 225 5064"],
    contact: "https://www.seu.ac.lk/contactus.php",
    programmes: { label: "South Eastern University undergraduate studies", href: "https://www.seu.ac.lk/undergraduate_studies.php" },
    reportDate: "2026-11-06",
  }),
};
