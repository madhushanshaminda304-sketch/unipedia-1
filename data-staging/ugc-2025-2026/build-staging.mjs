#!/usr/bin/env node
/**
 * Repeatable extraction & staging builder for UGC 2025/2026 Student Handbook dataset.
 * Reads ONLY the 10 supplied Markdown files and writes structured outputs to data-staging/ugc-2025-2026/.
 * Does NOT modify any application source, existing datasets, or databases.
 */

import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve('c:/Users/DELL/Downloads/srilakan vuzopedia/data-staging/ugc-2025-2026');
fs.mkdirSync(OUT_DIR, { recursive: true });

const SOURCE_FILES = [
  { id: 'ugc1.md', path: 'C:/Users/DELL/.codex/attachments/e74567f9-98fb-4fa7-9023-3870290723e4/ugc1.md' },
  { id: 'ugc2.md', path: 'C:/Users/DELL/.codex/attachments/e74567f9-98fb-4fa7-9023-3870290723e4/ugc2.md' },
  { id: 'ugc3.md', path: 'C:/Users/DELL/.codex/attachments/e74567f9-98fb-4fa7-9023-3870290723e4/ugc3.md' },
  { id: 'ugc4.md', path: 'C:/Users/DELL/.codex/attachments/e74567f9-98fb-4fa7-9023-3870290723e4/ugc4.md' },
  { id: 'ugc5.md', path: 'C:/Users/DELL/.codex/attachments/e74567f9-98fb-4fa7-9023-3870290723e4/ugc5.md' },
  { id: 'ugc6.md', path: 'C:/Users/DELL/.codex/attachments/e74567f9-98fb-4fa7-9023-3870290723e4/ugc6.md' },
  { id: 'ugc7.md', path: 'C:/Users/DELL/.codex/attachments/e74567f9-98fb-4fa7-9023-3870290723e4/ugc7.md' },
  { id: 'ugc8.md', path: 'C:/Users/DELL/.codex/attachments/e74567f9-98fb-4fa7-9023-3870290723e4/ugc8.md' },
  { id: 'ugc9.md', path: 'C:/Users/DELL/Downloads/ugc9.md' },
  { id: 'ugc10.md', path: 'C:/Users/DELL/Downloads/ugc10.md' },
];

const filesContent = new Map();
const filesLines = new Map();

for (const f of SOURCE_FILES) {
  const raw = fs.readFileSync(f.path, 'utf8');
  filesContent.set(f.id, raw);
  filesLines.set(f.id, raw.split(/\r?\n/));
}

// ---------------------------------------------------------------------------
// 1. Parse Section 2 TOC from ugc1.md (lines 245-377) for printed_page mapping
// ---------------------------------------------------------------------------
const section2PrintedPages = new Map();
const section2TocTitles = new Map();
const ugc1Lines = filesLines.get('ugc1.md');
for (let i = 240; i < 385; i++) {
  const line = ugc1Lines[i] || '';
  const m = line.match(/^\*\s+(2\.2\.\d+(?:\.\d+)?)\s+(.+?)\s+-\s+(\d+)\s*$/) ||
            line.match(/^\*\*(2\.2\.7)\s+(.+?)\s+-\s+(\d+)\*\*\s*$/);
  if (m) {
    const sec = m[1].trim() === '2.2.7' ? '2.2.7.1' : m[1].trim();
    const title = m[2].trim();
    const page = Number(m[3]);
    section2PrintedPages.set(sec, page);
    section2TocTitles.set(sec, title);
  } else {
    const subArtToc = line.match(/^\*\s+(\d{1,2})\s+(.+?)\s+-\s+(\d+)\s*$/);
    if (subArtToc) {
      const sec = `2.2.1.1.${subArtToc[1].trim()}`;
      const title = subArtToc[2].trim();
      const page = Number(subArtToc[3]);
      section2PrintedPages.set(sec, page);
      section2TocTitles.set(sec, title);
    }
  }
}

// ---------------------------------------------------------------------------
// 2. Build institutions.json
// ---------------------------------------------------------------------------
// Extracted from ugc1.md (Abbreviations lines 4-28, Section 1.6(8) lines 161-181, Section 1.6(9)-(10) lines 182-185),
// ugc9.md (Section 7 lines 178-201), and ugc10.md (Annex (b) lines 315-700, Annex (c) lines 701-733).

const institutions = [
  {
    institution_id: 'CMB',
    official_abbreviation: 'CMB',
    uni_code_suffix: 'A',
    official_name: 'University of Colombo',
    institution_type: 'National University',
    ugc_admission_participating: true,
    parent_institution_id: null,
    academic_year: '2025/2026',
    postal_address: '“College House”, 94, Cumaratunga Munidasa Mawatha, Colombo 03.',
    telephone_numbers: ['011 - 2581835', '2584695', '2585509'],
    faculty_contacts_in_annex_c: [
      {
        unit_name: 'Faculty of Medicine, University of Colombo',
        postal_address: 'No. 25, P.O. Box 271, Kynsey Road, Colombo 08.',
        telephone_numbers: ['011 - 2695300', '2696243', '2688748', '2688749'],
        source_line: 707
      }
    ],
    annex_b_proposed_total_intake: 3554,
    accreditation: null,
    salaries: null,
    fees: null,
    scholarships: null,
    internships: null,
    careers: null,
    verification_status: 'needs_review',
    source_file: 'ugc1.md',
    source_section: 'Abbreviations & Section 1.6(8)',
    source_table: null,
    source_line_start: 7,
    source_line_end: 162,
    printed_page: null,
    additional_sources: [
      { source_file: 'ugc9.md', source_section: 'Section 7', source_line_start: 180, source_line_end: 180, printed_page: null },
      { source_file: 'ugc10.md', source_section: 'Annex (b) & Annex (c)', source_line_start: 317, source_line_end: 707, printed_page: null }
    ]
  },
  {
    institution_id: 'PDN',
    official_abbreviation: 'PDN',
    uni_code_suffix: 'B',
    official_name: 'University of Peradeniya',
    institution_type: 'National University',
    ugc_admission_participating: true,
    parent_institution_id: null,
    academic_year: '2025/2026',
    postal_address: 'Peradeniya.',
    telephone_numbers: ['081 - 2388301', '2388302', '2388303', '2388304', '2388305', '2392000'],
    faculty_contacts_in_annex_c: [],
    annex_b_proposed_total_intake: 3343,
    accreditation: null,
    salaries: null,
    fees: null,
    scholarships: null,
    internships: null,
    careers: null,
    verification_status: 'needs_review',
    source_file: 'ugc1.md',
    source_section: 'Abbreviations & Section 1.6(8)',
    source_table: null,
    source_line_start: 8,
    source_line_end: 163,
    printed_page: null,
    additional_sources: [
      { source_file: 'ugc9.md', source_section: 'Section 7', source_line_start: 181, source_line_end: 181, printed_page: null },
      { source_file: 'ugc10.md', source_section: 'Annex (b) & Annex (c)', source_line_start: 340, source_line_end: 709, printed_page: null }
    ]
  },
  {
    institution_id: 'SJP',
    official_abbreviation: 'SJP',
    uni_code_suffix: 'C',
    official_name: 'University of Sri Jayewardenepura',
    institution_type: 'National University',
    ugc_admission_participating: true,
    parent_institution_id: null,
    academic_year: '2025/2026',
    postal_address: 'Gangodawila, Nugegoda.',
    telephone_numbers: ['011 - 2802022', '2801024', '2758000', '2801025'],
    faculty_contacts_in_annex_c: [],
    annex_b_proposed_total_intake: 4763,
    accreditation: null,
    salaries: null,
    fees: null,
    scholarships: null,
    internships: null,
    careers: null,
    verification_status: 'needs_review',
    source_file: 'ugc1.md',
    source_section: 'Abbreviations & Section 1.6(8)',
    source_table: null,
    source_line_start: 9,
    source_line_end: 164,
    printed_page: null,
    additional_sources: [
      { source_file: 'ugc9.md', source_section: 'Section 7', source_line_start: 182, source_line_end: 182, printed_page: null },
      { source_file: 'ugc10.md', source_section: 'Annex (b) & Annex (c)', source_line_start: 367, source_line_end: 710, printed_page: null }
    ]
  },
  {
    institution_id: 'KLN',
    official_abbreviation: 'KLN',
    uni_code_suffix: 'D',
    official_name: 'University of Kelaniya',
    institution_type: 'National University',
    ugc_admission_participating: true,
    parent_institution_id: null,
    academic_year: '2025/2026',
    postal_address: 'Kandy Road, Dalugama, Kelaniya.',
    telephone_numbers: ['011 - 2903903'],
    faculty_contacts_in_annex_c: [
      {
        unit_name: 'Faculty of Medicine, University of Kelaniya',
        postal_address: 'Talagolla Road, Ragama.',
        telephone_numbers: ['011 - 2961000'],
        source_line: 712
      }
    ],
    annex_b_proposed_total_intake: 4277,
    accreditation: null,
    salaries: null,
    fees: null,
    scholarships: null,
    internships: null,
    careers: null,
    verification_status: 'needs_review',
    source_file: 'ugc1.md',
    source_section: 'Abbreviations & Section 1.6(8)',
    source_table: null,
    source_line_start: 10,
    source_line_end: 165,
    printed_page: null,
    additional_sources: [
      { source_file: 'ugc9.md', source_section: 'Section 7', source_line_start: 183, source_line_end: 183, printed_page: null },
      { source_file: 'ugc10.md', source_section: 'Annex (b) & Annex (c)', source_line_start: 416, source_line_end: 712, printed_page: null }
    ]
  },
  {
    institution_id: 'MRT',
    official_abbreviation: 'MRT',
    uni_code_suffix: 'G',
    official_name: 'University of Moratuwa',
    institution_type: 'National University',
    ugc_admission_participating: true,
    parent_institution_id: null,
    academic_year: '2025/2026',
    postal_address: 'Bandaranayake Mawatha, Moratuwa.',
    telephone_numbers: ['011 - 2650301', '2640051'],
    faculty_contacts_in_annex_c: [],
    annex_b_proposed_total_intake: 2358,
    accreditation: null,
    salaries: null,
    fees: null,
    scholarships: null,
    internships: null,
    careers: null,
    verification_status: 'needs_review',
    source_file: 'ugc1.md',
    source_section: 'Abbreviations & Section 1.6(8)',
    source_table: null,
    source_line_start: 11,
    source_line_end: 166,
    printed_page: null,
    additional_sources: [
      { source_file: 'ugc9.md', source_section: 'Section 7', source_line_start: 184, source_line_end: 184, printed_page: null },
      { source_file: 'ugc10.md', source_section: 'Annex (b) & Annex (c)', source_line_start: 519, source_line_end: 713, printed_page: null }
    ]
  },
  {
    institution_id: 'UJA',
    official_abbreviation: 'UJA',
    uni_code_suffix: 'E',
    official_name: 'University of Jaffna',
    institution_type: 'National University',
    ugc_admission_participating: true,
    parent_institution_id: null,
    academic_year: '2025/2026',
    postal_address: 'P.O. Box 57, Thirunelvely, Jaffna.',
    telephone_numbers: ['021 - 2222294', '2218101'],
    faculty_contacts_in_annex_c: [],
    annex_b_proposed_total_intake: 3456,
    accreditation: null,
    salaries: null,
    fees: null,
    scholarships: null,
    internships: null,
    careers: null,
    verification_status: 'needs_review',
    source_file: 'ugc1.md',
    source_section: 'Abbreviations & Section 1.6(8)',
    source_table: null,
    source_line_start: 12,
    source_line_end: 167,
    printed_page: null,
    additional_sources: [
      { source_file: 'ugc9.md', source_section: 'Section 7', source_line_start: 185, source_line_end: 185, printed_page: null },
      { source_file: 'ugc10.md', source_section: 'Annex (b) & Annex (c)', source_line_start: 467, source_line_end: 714, printed_page: null }
    ]
  },
  {
    institution_id: 'RUH',
    official_abbreviation: 'RUH',
    uni_code_suffix: 'F',
    official_name: 'University of Ruhuna',
    institution_type: 'National University',
    ugc_admission_participating: true,
    parent_institution_id: null,
    academic_year: '2025/2026',
    postal_address: 'Wellamadama, Matara.',
    telephone_numbers: ['041 - 2222681', '2222682', '2227001-4'],
    faculty_contacts_in_annex_c: [
      {
        unit_name: 'Faculty of Medicine, University of Ruhuna',
        postal_address: 'Karapitiya, Galle.',
        telephone_numbers: ['091 - 2234801', '2234803'],
        source_line: 717
      },
      {
        unit_name: 'Faculty of Agriculture, University of Ruhuna',
        postal_address: 'Mapalana, Kamburupitiya.',
        telephone_numbers: ['041 - 2292200', '2292382'],
        source_line: 718
      },
      {
        unit_name: 'Faculty of Engineering, University of Ruhuna',
        postal_address: 'Hapugala, Galle.',
        telephone_numbers: ['091 - 2245765', '2245766'],
        source_line: 719
      }
    ],
    annex_b_proposed_total_intake: 4028,
    accreditation: null,
    salaries: null,
    fees: null,
    scholarships: null,
    internships: null,
    careers: null,
    verification_status: 'needs_review',
    source_file: 'ugc1.md',
    source_section: 'Abbreviations & Section 1.6(8)',
    source_table: null,
    source_line_start: 13,
    source_line_end: 168,
    printed_page: null,
    additional_sources: [
      { source_file: 'ugc9.md', source_section: 'Section 7', source_line_start: 186, source_line_end: 186, printed_page: null },
      { source_file: 'ugc10.md', source_section: 'Annex (b) & Annex (c)', source_line_start: 541, source_line_end: 719, printed_page: null }
    ]
  },
  {
    institution_id: 'EUSL',
    official_abbreviation: 'EUSL',
    uni_code_suffix: 'H',
    official_name: 'Eastern University, Sri Lanka',
    institution_type: 'National University',
    ugc_admission_participating: true,
    parent_institution_id: null,
    academic_year: '2025/2026',
    postal_address: 'Vantharamoolai, Chenkalady.',
    telephone_numbers: ['065 - 2240490', '2240590', '2240580', '2240730'],
    faculty_contacts_in_annex_c: [],
    annex_b_proposed_total_intake: 1914,
    accreditation: null,
    salaries: null,
    fees: null,
    scholarships: null,
    internships: null,
    careers: null,
    verification_status: 'needs_review',
    source_file: 'ugc1.md',
    source_section: 'Abbreviations & Section 1.6(8)',
    source_table: null,
    source_line_start: 14,
    source_line_end: 169,
    printed_page: null,
    additional_sources: [
      { source_file: 'ugc9.md', source_section: 'Section 7', source_line_start: 187, source_line_end: 187, printed_page: null },
      { source_file: 'ugc10.md', source_section: 'Annex (b) & Annex (c)', source_line_start: 603, source_line_end: 720, printed_page: null }
    ]
  },
  {
    institution_id: 'SEUSL',
    official_abbreviation: 'SEUSL',
    uni_code_suffix: 'J',
    official_name: 'South Eastern University of Sri Lanka',
    institution_type: 'National University',
    ugc_admission_participating: true,
    parent_institution_id: null,
    academic_year: '2025/2026',
    postal_address: 'University Park, Oluvil.',
    telephone_numbers: ['067 - 2255062', '2255063', '2255064'],
    faculty_contacts_in_annex_c: [],
    annex_b_proposed_total_intake: 2148,
    accreditation: null,
    salaries: null,
    fees: null,
    scholarships: null,
    internships: null,
    careers: null,
    verification_status: 'needs_review',
    source_file: 'ugc1.md',
    source_section: 'Abbreviations & Section 1.6(8)',
    source_table: null,
    source_line_start: 15,
    source_line_end: 170,
    printed_page: null,
    additional_sources: [
      { source_file: 'ugc9.md', source_section: 'Section 7', source_line_start: 188, source_line_end: 188, printed_page: null },
      { source_file: 'ugc10.md', source_section: 'Annex (b) & Annex (c)', source_line_start: 620, source_line_end: 727, printed_page: null }
    ]
  },
  {
    institution_id: 'RUSL',
    official_abbreviation: 'RUSL',
    uni_code_suffix: 'K',
    official_name: 'Rajarata University of Sri Lanka',
    institution_type: 'National University',
    ugc_admission_participating: true,
    parent_institution_id: null,
    academic_year: '2025/2026',
    postal_address: 'Mihintale.',
    telephone_numbers: ['025 - 2266643'],
    faculty_contacts_in_annex_c: [],
    annex_b_proposed_total_intake: 2327,
    accreditation: null,
    salaries: null,
    fees: null,
    scholarships: null,
    internships: null,
    careers: null,
    verification_status: 'needs_review',
    source_file: 'ugc1.md',
    source_section: 'Abbreviations & Section 1.6(8)',
    source_table: null,
    source_line_start: 16,
    source_line_end: 171,
    printed_page: null,
    additional_sources: [
      { source_file: 'ugc9.md', source_section: 'Section 7', source_line_start: 189, source_line_end: 189, printed_page: null },
      { source_file: 'ugc10.md', source_section: 'Annex (b) & Annex (c)', source_line_start: 449, source_line_end: 723, printed_page: null }
    ]
  },
  {
    institution_id: 'SUSL',
    official_abbreviation: 'SUSL',
    uni_code_suffix: 'L',
    official_name: 'Sabaragamuwa University of Sri Lanka',
    institution_type: 'National University',
    ugc_admission_participating: true,
    parent_institution_id: null,
    academic_year: '2025/2026',
    postal_address: 'P.O. Box 02, Pambahinna, Belihuloya.',
    telephone_numbers: ['045 - 2280014', '2280087'],
    faculty_contacts_in_annex_c: [],
    annex_b_proposed_total_intake: 2575,
    accreditation: null,
    salaries: null,
    fees: null,
    scholarships: null,
    internships: null,
    careers: null,
    verification_status: 'needs_review',
    source_file: 'ugc1.md',
    source_section: 'Abbreviations & Section 1.6(8)',
    source_table: null,
    source_line_start: 17,
    source_line_end: 172,
    printed_page: null,
    additional_sources: [
      { source_file: 'ugc9.md', source_section: 'Section 7', source_line_start: 190, source_line_end: 190, printed_page: null },
      { source_file: 'ugc10.md', source_section: 'Annex (b) & Annex (c)', source_line_start: 494, source_line_end: 726, printed_page: null }
    ]
  },
  {
    institution_id: 'WUSL',
    official_abbreviation: 'WUSL',
    uni_code_suffix: 'M',
    official_name: 'Wayamba University of Sri Lanka',
    institution_type: 'National University',
    ugc_admission_participating: true,
    parent_institution_id: null,
    academic_year: '2025/2026',
    postal_address: 'Lionel Jayathilake Mawatha, Kanadulla, Kuliyapitiya.',
    telephone_numbers: ['037 - 2281414', '2281412', '2283614'],
    faculty_contacts_in_annex_c: [
      {
        unit_name: 'Faculty of Agriculture & Plantation Management, Wayamba University of Sri Lanka',
        postal_address: 'Makandura, Gonawila.',
        telephone_numbers: ['031 - 2299704'],
        source_line: 725
      }
    ],
    annex_b_proposed_total_intake: 1929,
    accreditation: null,
    salaries: null,
    fees: null,
    scholarships: null,
    internships: null,
    careers: null,
    verification_status: 'needs_review',
    source_file: 'ugc1.md',
    source_section: 'Abbreviations & Section 1.6(8)',
    source_table: null,
    source_line_start: 18,
    source_line_end: 173,
    printed_page: null,
    additional_sources: [
      { source_file: 'ugc9.md', source_section: 'Section 7', source_line_start: 191, source_line_end: 191, printed_page: null },
      { source_file: 'ugc10.md', source_section: 'Annex (b) & Annex (c)', source_line_start: 589, source_line_end: 725, printed_page: null }
    ]
  },
  {
    institution_id: 'UWU',
    official_abbreviation: 'UWU',
    uni_code_suffix: 'U',
    official_name: 'Uva Wellassa University of Sri Lanka',
    institution_type: 'National University',
    ugc_admission_participating: true,
    parent_institution_id: null,
    academic_year: '2025/2026',
    postal_address: '2nd Milepost, Passara Road, Badulla.',
    telephone_numbers: ['055 - 2226622'],
    faculty_contacts_in_annex_c: [],
    annex_b_proposed_total_intake: 1689,
    accreditation: null,
    salaries: null,
    fees: null,
    scholarships: null,
    internships: null,
    careers: null,
    verification_status: 'needs_review',
    source_file: 'ugc1.md',
    source_section: 'Abbreviations & Section 1.6(8)',
    source_table: null,
    source_line_start: 19,
    source_line_end: 174,
    printed_page: null,
    additional_sources: [
      { source_file: 'ugc9.md', source_section: 'Section 7', source_line_start: 192, source_line_end: 192, printed_page: null },
      { source_file: 'ugc10.md', source_section: 'Annex (b) & Annex (c)', source_line_start: 567, source_line_end: 728, printed_page: null }
    ]
  },
  {
    institution_id: 'UVPA',
    official_abbreviation: 'UVPA',
    uni_code_suffix: 'Z',
    official_name: 'University of the Visual & Performing Arts',
    institution_type: 'National University',
    ugc_admission_participating: true,
    parent_institution_id: null,
    academic_year: '2025/2026',
    postal_address: '21, Albert Crescent, Colombo 07.',
    telephone_numbers: ['011 - 2033710'],
    faculty_contacts_in_annex_c: [],
    annex_b_proposed_total_intake: 794,
    accreditation: null,
    salaries: null,
    fees: null,
    scholarships: null,
    internships: null,
    careers: null,
    verification_status: 'needs_review',
    source_file: 'ugc1.md',
    source_section: 'Abbreviations & Section 1.6(8)',
    source_table: null,
    source_line_start: 20,
    source_line_end: 175,
    printed_page: null,
    additional_sources: [
      { source_file: 'ugc9.md', source_section: 'Section 7', source_line_start: 193, source_line_end: 193, printed_page: null },
      { source_file: 'ugc10.md', source_section: 'Annex (b) & Annex (c)', source_line_start: 406, source_line_end: 729, printed_page: null }
    ]
  },
  {
    institution_id: 'GWUIM',
    official_abbreviation: 'GWUIM',
    uni_code_suffix: 'P',
    official_name: 'Gampaha Wickramarachchi University of Indigenous Medicine, Sri Lanka',
    institution_type: 'National University',
    ugc_admission_participating: true,
    parent_institution_id: null,
    academic_year: '2025/2026',
    postal_address: 'Yakkala.',
    telephone_numbers: ['033 - 2222748'],
    faculty_contacts_in_annex_c: [],
    annex_b_proposed_total_intake: 176,
    accreditation: null,
    salaries: null,
    fees: null,
    scholarships: null,
    internships: null,
    careers: null,
    verification_status: 'needs_review',
    source_file: 'ugc1.md',
    source_section: 'Abbreviations & Section 1.6(8)',
    source_table: null,
    source_line_start: 21,
    source_line_end: 176,
    printed_page: null,
    additional_sources: [
      { source_file: 'ugc9.md', source_section: 'Section 7', source_line_start: 194, source_line_end: 194, printed_page: null },
      { source_file: 'ugc10.md', source_section: 'Annex (b) & Annex (c)', source_line_start: 637, source_line_end: 732, printed_page: null }
    ]
  },
  {
    institution_id: 'UOV',
    official_abbreviation: 'UOV',
    uni_code_suffix: 'R',
    official_name: 'University of Vavuniya, Sri Lanka',
    institution_type: 'National University',
    ugc_admission_participating: true,
    parent_institution_id: null,
    academic_year: '2025/2026',
    postal_address: 'Pampaaimadu, Vavuniya.',
    telephone_numbers: ['024 - 2222265', '2222264'],
    faculty_contacts_in_annex_c: [],
    annex_b_proposed_total_intake: 927,
    accreditation: null,
    salaries: null,
    fees: null,
    scholarships: null,
    internships: null,
    careers: null,
    verification_status: 'needs_review',
    source_file: 'ugc1.md',
    source_section: 'Abbreviations & Section 1.6(8)',
    source_table: null,
    source_line_start: 22,
    source_line_end: 177,
    printed_page: null,
    additional_sources: [
      { source_file: 'ugc9.md', source_section: 'Section 7', source_line_start: 195, source_line_end: 195, printed_page: null },
      { source_file: 'ugc10.md', source_section: 'Annex (b) & Annex (c)', source_line_start: 644, source_line_end: 715, printed_page: null }
    ]
  },
  {
    institution_id: 'SP',
    official_abbreviation: 'SP',
    uni_code_suffix: 'S',
    official_name: 'Sripalee Campus, University of Colombo',
    institution_type: 'Campus',
    ugc_admission_participating: true,
    parent_institution_id: 'CMB',
    academic_year: '2025/2026',
    postal_address: 'Wewala, Horana.',
    telephone_numbers: ['034 - 2263616'],
    faculty_contacts_in_annex_c: [],
    annex_b_proposed_total_intake: 220,
    accreditation: null,
    salaries: null,
    fees: null,
    scholarships: null,
    internships: null,
    careers: null,
    verification_status: 'needs_review',
    source_file: 'ugc1.md',
    source_section: 'Abbreviations & Section 1.6(8)',
    source_table: null,
    source_line_start: 24,
    source_line_end: 178,
    printed_page: null,
    additional_sources: [
      { source_file: 'ugc9.md', source_section: 'Section 7', source_line_start: 196, source_line_end: 196, printed_page: null },
      { source_file: 'ugc10.md', source_section: 'Annex (b) & Annex (c)', source_line_start: 657, source_line_end: 706, printed_page: null }
    ]
  },
  {
    institution_id: 'TRINCO',
    official_abbreviation: 'TRINCO',
    uni_code_suffix: 'W',
    official_name: 'Trincomalee Campus, Eastern University, Sri Lanka',
    institution_type: 'Campus',
    ugc_admission_participating: true,
    parent_institution_id: 'EUSL',
    academic_year: '2025/2026',
    postal_address: 'Konesapuri, Nilavely, Trincomalee.',
    telephone_numbers: ['026 - 2227410'],
    faculty_contacts_in_annex_c: [],
    annex_b_proposed_total_intake: 815,
    accreditation: null,
    salaries: null,
    fees: null,
    scholarships: null,
    internships: null,
    careers: null,
    verification_status: 'needs_review',
    source_file: 'ugc1.md',
    source_section: 'Abbreviations & Section 1.6(8)',
    source_table: null,
    source_line_start: 25,
    source_line_end: 179,
    printed_page: null,
    additional_sources: [
      { source_file: 'ugc9.md', source_section: 'Section 7', source_line_start: 197, source_line_end: 197, printed_page: null },
      { source_file: 'ugc10.md', source_section: 'Annex (b) & Annex (c)', source_line_start: 665, source_line_end: 721, printed_page: null }
    ]
  },
  {
    institution_id: 'UCSC',
    official_abbreviation: 'UCSC',
    uni_code_suffix: 'T',
    official_name: 'University of Colombo School of Computing',
    institution_type: 'Institute',
    ugc_admission_participating: true,
    parent_institution_id: 'CMB',
    academic_year: '2025/2026',
    postal_address: 'No 35, Reid Avenue, Colombo 07.',
    telephone_numbers: ['011 - 2581245', '2581247'],
    faculty_contacts_in_annex_c: [],
    annex_b_proposed_total_intake: 350,
    accreditation: null,
    salaries: null,
    fees: null,
    scholarships: null,
    internships: null,
    careers: null,
    verification_status: 'needs_review',
    source_file: 'ugc1.md',
    source_section: 'Abbreviations & Section 1.6(8)',
    source_table: null,
    source_line_start: 26,
    source_line_end: 180,
    printed_page: null,
    additional_sources: [
      { source_file: 'ugc9.md', source_section: 'Section 7', source_line_start: 198, source_line_end: 198, printed_page: null },
      { source_file: 'ugc10.md', source_section: 'Annex (b) & Annex (c)', source_line_start: 676, source_line_end: 708, printed_page: null }
    ]
  },
  {
    institution_id: 'SVIAS',
    official_abbreviation: 'SVIAS',
    uni_code_suffix: 'Y',
    official_name: 'Swamy Vipulananda Institute of Aesthetic Studies, Eastern University, Sri Lanka',
    institution_type: 'Institute',
    ugc_admission_participating: true,
    parent_institution_id: 'EUSL',
    academic_year: '2025/2026',
    postal_address: 'Kallady, Batticaloa.',
    telephone_numbers: ['065 - 2225689'],
    faculty_contacts_in_annex_c: [],
    annex_b_proposed_total_intake: 394,
    accreditation: null,
    salaries: null,
    fees: null,
    scholarships: null,
    internships: null,
    careers: null,
    verification_status: 'needs_review',
    source_file: 'ugc1.md',
    source_section: 'Abbreviations & Section 1.6(8)',
    source_table: null,
    source_line_start: 27,
    source_line_end: 181,
    printed_page: null,
    additional_sources: [
      { source_file: 'ugc9.md', source_section: 'Section 7', source_line_start: 199, source_line_end: 199, printed_page: null },
      { source_file: 'ugc10.md', source_section: 'Annex (b) & Annex (c)', source_line_start: 684, source_line_end: 722, printed_page: null }
    ]
  },
  {
    institution_id: 'OUSL',
    official_abbreviation: 'OUSL',
    uni_code_suffix: null,
    official_name: 'The Open University of Sri Lanka',
    institution_type: 'Open University (Separate Admission under Universities Act)',
    ugc_admission_participating: false,
    parent_institution_id: null,
    academic_year: '2025/2026',
    postal_address: 'Nawala, Nugegoda.',
    telephone_numbers: ['011 - 2853777', '2881000'],
    faculty_contacts_in_annex_c: [],
    annex_b_proposed_total_intake: null,
    accreditation: null,
    salaries: null,
    fees: null,
    scholarships: null,
    internships: null,
    careers: null,
    verification_status: 'needs_review',
    source_file: 'ugc1.md',
    source_section: 'Abbreviations & Section 1.6(9)',
    source_table: null,
    source_line_start: 23,
    source_line_end: 182,
    printed_page: null,
    additional_sources: [
      { source_file: 'ugc10.md', source_section: 'Annex (c)', source_line_start: 730, source_line_end: 730, printed_page: null }
    ]
  },
  {
    institution_id: 'IHRA',
    official_abbreviation: 'IHRA',
    uni_code_suffix: null,
    official_name: 'Institute of Human Resource Advancement, University of Colombo',
    institution_type: 'Institute (Separate Admission under Section 1.6(10))',
    ugc_admission_participating: false,
    parent_institution_id: 'CMB',
    academic_year: '2025/2026',
    postal_address: 'P.O.Box 1557, 275, Bauddhaloka Mawatha, Colombo 07.',
    telephone_numbers: ['011 - 2503393', '2554724'],
    faculty_contacts_in_annex_c: [],
    annex_b_proposed_total_intake: null,
    accreditation: null,
    salaries: null,
    fees: null,
    scholarships: null,
    internships: null,
    careers: null,
    verification_status: 'needs_review',
    source_file: 'ugc1.md',
    source_section: 'Section 1.6(10)',
    source_table: null,
    source_line_start: 183,
    source_line_end: 184,
    printed_page: null,
    additional_sources: [
      { source_file: 'ugc10.md', source_section: 'Annex (c)', source_line_start: 731, source_line_end: 731, printed_page: null }
    ]
  },
  {
    institution_id: 'ITUM',
    official_abbreviation: null,
    uni_code_suffix: null,
    official_name: 'Institute of Technology, University of Moratuwa',
    institution_type: 'Institute (Separate Admission under Section 1.6(10))',
    ugc_admission_participating: false,
    parent_institution_id: 'MRT',
    academic_year: '2025/2026',
    postal_address: null,
    telephone_numbers: [],
    faculty_contacts_in_annex_c: [],
    annex_b_proposed_total_intake: null,
    accreditation: null,
    salaries: null,
    fees: null,
    scholarships: null,
    internships: null,
    careers: null,
    verification_status: 'needs_review',
    source_file: 'ugc1.md',
    source_section: 'Section 1.6(10)',
    source_table: null,
    source_line_start: 183,
    source_line_end: 185,
    printed_page: null,
    additional_sources: []
  }
];

fs.writeFileSync(path.join(OUT_DIR, 'institutions.json'), JSON.stringify(institutions, null, 2) + '\n', 'utf8');
console.log(`Wrote institutions.json (${institutions.length} records).`);

// ---------------------------------------------------------------------------
// 3. Parse Section 2.2 subsections across ugc2.md, ugc3.md, ugc4.md, ugc5.md, ugc6.md
// ---------------------------------------------------------------------------
const section2Subsections = [];
const sec2Files = ['ugc2.md', 'ugc3.md', 'ugc4.md', 'ugc5.md', 'ugc6.md'];

let currentSec = null;
for (const fileId of sec2Files) {
  const lines = filesLines.get(fileId);
  for (let idx = 0; idx < lines.length; idx++) {
    const lineNum = idx + 1;
    const line = lines[idx];
    // Skip markdown wrapper fences (lines 1-3 in ugc1.md..ugc8.md)
    if (lineNum <= 3 && !['ugc9.md', 'ugc10.md'].includes(fileId)) {
      continue;
    }
    if (line.trim() === '```' && idx === lines.length - 1) {
      continue;
    }
    // Stop when Section 3 starts in ugc6.md
    if (fileId === 'ugc6.md' && line.startsWith('# SECTION 3')) {
      if (currentSec) {
        currentSec.segments[currentSec.segments.length - 1].line_end = lineNum - 1;
        section2Subsections.push(currentSec);
        currentSec = null;
      }
      break;
    }

    const headingMatch = line.match(/^#{3,4}\s+(2\.2\.\d+\.\d+)\s+(.+)$/) ||
      line.match(/^\*\*(2\.2\.2\.\d+)\s+(.+?)\*\*\s*$/) ||
      (line.startsWith('### 2.2.7 ') ? [line, '2.2.7.1', line.replace(/^###\s+2\.2\.7\s+/, '').trim()] : null);
    const subArtMatch = (fileId === 'ugc2.md' && lineNum >= 500 && lineNum <= 687)
      ? line.match(/^\*\*(\d{1,2})\.\s+(Course(?:s)? of Study in .+?)\*\*$/)
      : null;

    if (headingMatch || subArtMatch) {
      if (currentSec) {
        currentSec.segments[currentSec.segments.length - 1].line_end =
          currentSec.segments[currentSec.segments.length - 1].file === fileId ? lineNum - 1 : filesLines.get(currentSec.segments[currentSec.segments.length - 1].file).length;
        section2Subsections.push(currentSec);
      }
      const secCode = headingMatch ? headingMatch[1].trim() : `2.2.1.1.${subArtMatch[1].trim()}`;
      const secTitle = headingMatch ? headingMatch[2].trim() : subArtMatch[2].trim();
      currentSec = {
        section_code: secCode,
        section_title: secTitle,
        printed_page: section2PrintedPages.get(secCode) ?? null,
        segments: [
          {
            file: fileId,
            line_start: lineNum,
            line_end: lines.length,
            lines: [line]
          }
        ]
      };
    } else if (currentSec) {
      const lastSeg = currentSec.segments[currentSec.segments.length - 1];
      if (lastSeg.file !== fileId) {
        currentSec.segments.push({
          file: fileId,
          line_start: lineNum,
          line_end: lines.length,
          lines: [line]
        });
      } else {
        lastSeg.line_end = lineNum;
        lastSeg.lines.push(line);
      }
    }
  }
}
if (currentSec) {
  section2Subsections.push(currentSec);
}

// Note: Sections 2.2.2.1 (016), 2.2.2.2 (028), 2.2.2.3 (017), and 2.2.2.4 (018) share a single
// common eligibility/duration block in ugc2.md (lines 767-788) and degree list in ugc3.md (lines 4-108).
const sec2224 = section2Subsections.find(s => s.section_code === '2.2.2.4');
if (sec2224) {
  const sharedUgc2Lines = filesLines.get('ugc2.md').slice(766, 788);
  const sharedUgc3Seg = sec2224.segments.find(seg => seg.file === 'ugc3.md');
  for (const code of ['2.2.2.1', '2.2.2.2', '2.2.2.3']) {
    const s = section2Subsections.find(x => x.section_code === code);
    if (s) {
      s.segments[0].line_end = 788;
      s.segments[0].lines.push('', ...sharedUgc2Lines);
      if (sharedUgc3Seg) {
        s.segments.push({
          file: sharedUgc3Seg.file,
          line_start: sharedUgc3Seg.line_start,
          line_end: sharedUgc3Seg.line_end,
          lines: [...sharedUgc3Seg.lines]
        });
      }
    }
  }
}

console.log(`Parsed ${section2Subsections.length} Section 2.2 subsections.`);
for (const s of section2Subsections) {
  const fullText = s.segments.map(seg => seg.lines.join('\n')).join('\n');
  const headText = s.segments[0].lines.slice(0, 12).join('\n');
  const courseCodeMatches = [
    ...[...headText.matchAll(/Course Code\s*[-–:]\s*(\d{3})/gi)].map(m => m[1]),
    ...[...fullText.matchAll(/Course Codes\s*:\s*([^\n)]+)/gi)].flatMap(m => [...m[1].matchAll(/\b(\d{3})\b/g)].map(x => x[1]))
  ];
  const intakeMatches = [
    ...[...headText.matchAll(/Proposed Intake\s*[-–:]\s*(\d+)/gi)].map(m => Number(m[1]))
  ];
  s.course_codes_explicit = [...new Set(courseCodeMatches)];
  s.intakes_explicit = intakeMatches;
  s.full_text = fullText;
}

// ---------------------------------------------------------------------------
// 4. Parse Annex (a) in ugc10.md (lines 190-313)
// ---------------------------------------------------------------------------
const annexACourses = [];
const ugc10Lines = filesLines.get('ugc10.md');
for (let i = 185; i < 316; i++) {
  const line = ugc10Lines[i] || '';
  const m = line.match(/^\|\s*(\d{3})\s*\|\s*(.+?)\s*\|\s*(\d+)\s*\|$/);
  if (m) {
    annexACourses.push({
      course_code: m[1].trim(),
      title_annex_a: m[2].trim(),
      proposed_intake_annex_a: Number(m[3]),
      source_file: 'ugc10.md',
      source_section: 'Annex (a)',
      source_table: 'Annex (a): Places Available for Admission (Academic Year 2025/2026)',
      source_line_start: i + 1,
      source_line_end: i + 1,
      printed_page: null
    });
  }
}
console.log(`Parsed ${annexACourses.length} courses from Annex (a) in ugc10.md.`);

// ---------------------------------------------------------------------------
// 5. Parse Uni-Codes table in ugc7.md (lines 374-458) & ugc8.md (lines 4-177)
// ---------------------------------------------------------------------------
const uniCodeRows = [];
for (const fileId of ['ugc7.md', 'ugc8.md']) {
  const lines = filesLines.get(fileId);
  const startIdx = fileId === 'ugc7.md' ? 373 : 3;
  const endIdx = fileId === 'ugc7.md' ? 458 : 178;
  for (let i = startIdx; i < endIdx; i++) {
    const line = lines[i] || '';
    const m = line.match(/^\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*\*\*([0-9]{3}[A-Z])\*\*\s*\|$/);
    if (m) {
      const uniCode = m[3].trim();
      uniCodeRows.push({
        uni_code: uniCode,
        course_code: uniCode.slice(0, 3),
        uni_code_suffix: uniCode.slice(3),
        course_title_unicode_table: m[1].trim(),
        institution_name_unicode_table: m[2].trim(),
        source_file: fileId,
        source_section: 'Section 5 — “Uni-Codes” Assigned for each Course of Study of University',
        source_table: 'Uni-Codes Assigned for each Course of Study of University (Handbook pp. 142-148)',
        source_line_start: i + 1,
        source_line_end: i + 1,
        printed_page: null // Note in Section 3.1/5.2 says list is on pages 142-148, exact page per row not explicitly marked
      });
    }
  }
}
console.log(`Parsed ${uniCodeRows.length} Uni-Code rows from ugc7.md & ugc8.md.`);

// ---------------------------------------------------------------------------
// 6. Parse Section 2.2.1.8-11 Aesthetic subsections and map all 121 courses
// ---------------------------------------------------------------------------
// Let's inspect how Section 2.2 subsections map to the 121 course codes in Annex (a).
const courseToSection2 = new Map(); // course_code -> array of subsection objects

for (const s of section2Subsections) {
  for (const code of s.course_codes_explicit) {
    if (!courseToSection2.has(code)) courseToSection2.set(code, []);
    courseToSection2.get(code).push(s);
  }
  // Check Aesthetic table-based course codes in 2.2.1.8, 2.2.1.9, 2.2.1.10, 2.2.1.11
  for (const seg of s.segments) {
    for (let i = 0; i < seg.lines.length; i++) {
      const l = seg.lines[i];
      // Table rows like: | Music | 068 | 300 |
      const tm = l.match(/^\|\s*([^|]+?)\s*\|\s*(068|069|070|071|072|085)\s*\|\s*(\d+)\s*\|$/);
      if (tm) {
        const cCode = tm[2].trim();
        if (!courseToSection2.has(cCode)) courseToSection2.set(cCode, []);
        if (!courseToSection2.get(cCode).includes(s)) {
          courseToSection2.get(cCode).push(s);
        }
      }
      // Also 2.2.1.11 Music at SJP: "Course Code corresponding to Music is 068"
      if (l.includes('Course Code corresponding to Music is 068')) {
        if (!courseToSection2.has('068')) courseToSection2.set('068', []);
        if (!courseToSection2.get('068').includes(s)) {
          courseToSection2.get('068').push(s);
        }
      }
    }
  }
}

console.log(`Mapped ${courseToSection2.size} distinct course codes to Section 2.2 subsections.`);
for (const a of annexACourses) {
  if (!courseToSection2.has(a.course_code)) {
    console.warn(`WARNING: Annex (a) course ${a.course_code} (${a.title_annex_a}) not mapped to Section 2.2!`);
  }
}

// ---------------------------------------------------------------------------
// 7. Build courses.json (121 active 2025/2026 courses + 8 suspended GWUIM courses)
// ---------------------------------------------------------------------------
function getStreamCategory(secCode) {
  if (secCode.startsWith('2.2.1')) return 'Arts Stream';
  if (secCode.startsWith('2.2.2')) return 'Commerce Stream';
  if (secCode.startsWith('2.2.3')) return 'Biological Science Stream';
  if (secCode.startsWith('2.2.4')) return 'Physical Science Stream';
  if (secCode.startsWith('2.2.5')) return 'Engineering Technology Stream';
  if (secCode.startsWith('2.2.6')) return 'Biosystems Technology Stream';
  if (secCode.startsWith('2.2.7')) return 'Information Communication Technology (ICT) Stream';
  if (secCode.startsWith('2.2.8')) return 'Courses of Study for which Students from Different Streams are Eligible';
  return null;
}

const unicodeTitlesByCourse = new Map();
const unicodeListByCourse = new Map();
for (const row of uniCodeRows) {
  if (!unicodeTitlesByCourse.has(row.course_code)) {
    unicodeTitlesByCourse.set(row.course_code, new Set());
    unicodeListByCourse.set(row.course_code, []);
  }
  unicodeTitlesByCourse.get(row.course_code).add(row.course_title_unicode_table);
  unicodeListByCourse.get(row.course_code).push(row.uni_code);
}

const courses = [];

for (const a of annexACourses) {
  const secs = courseToSection2.get(a.course_code) || [];
  // Prefer the subsection that isn't a shared 2.2.1.1 sub-block when a dedicated subsection exists
  const primarySec = secs.find(s => !s.section_code.startsWith('2.2.1.1.')) || secs[0];
  const primarySeg = primarySec.segments[0];
  const lastSeg = primarySec.segments[primarySec.segments.length - 1];

  // Determine Section 2 title and proposed intake
  let sec2Title = primarySec.section_title;
  let sec2Intake = primarySec.intakes_explicit.length === 1 ? primarySec.intakes_explicit[0] : null;
  if (a.course_code === '020') {
    sec2Title = 'Arts (SP) - Mass Media';
    sec2Intake = 110;
  } else if (a.course_code === '041') {
    sec2Title = 'Arts (SP) - Performing Arts';
    sec2Intake = 110;
  } else if (a.course_code === '068') {
    sec2Title = 'Music';
    sec2Intake = 300 + 117 + 103 + 50; // UVPA 300 + UJA 117 + SVIAS 103 + SJP 50 = 570
  } else if (a.course_code === '069') {
    sec2Title = 'Dance';
    sec2Intake = 300 + 101 + 93; // UVPA 300 + UJA 101 + SVIAS 93 = 494
  } else if (a.course_code === '070') {
    sec2Title = 'Art & Design';
    sec2Intake = 50; // UJA 50
  } else if (a.course_code === '071') {
    sec2Title = 'Drama & Theatre';
    sec2Intake = 74 + 104; // UVPA 74 + SVIAS 104 = 178
  } else if (a.course_code === '072') {
    sec2Title = 'Visual & Technological Arts';
    sec2Intake = 94; // SVIAS 94
  } else if (a.course_code === '085') {
    sec2Title = 'Visual Arts';
    sec2Intake = 120; // UVPA 120
  }

  const unicodeTitleSet = unicodeTitlesByCourse.get(a.course_code) || new Set();
  const isNewCourse = primarySec.section_title.includes('(New)') || a.title_annex_a.includes('(New)');

  courses.push({
    course_code: a.course_code,
    official_title: a.title_annex_a.replace(/\s*\(including Additional Intake\)$/i, ''),
    title_variants: {
      section_2_heading: primarySec.section_title,
      section_2_course_title: sec2Title,
      section_5_unicode_table_titles: [...unicodeTitleSet],
      annex_a_title: a.title_annex_a
    },
    admission_year: '2025/2026',
    examination_year: '2025',
    status: 'active',
    is_new_in_2025_2026: isNewCourse,
    stream_section: primarySec.section_code,
    stream_category: getStreamCategory(primarySec.section_code),
    proposed_intake_2025_2026: a.proposed_intake_annex_a,
    proposed_intake_section_2: sec2Intake,
    includes_additional_intake_note: a.course_code === '019' ? 'Annex (a) and Section 2.2.1.1 note Proposed Intake 6983 includes Additional Intake (900 in Annex (b)).' : null,
    uni_codes: unicodeListByCourse.get(a.course_code) || [],
    accreditation: null,
    salaries: null,
    fees: null,
    scholarships: null,
    internships: null,
    careers: null,
    verification_status: 'needs_review',
    source_file: primarySeg.file,
    source_section: `Section ${primarySec.section_code}`,
    source_table: null,
    source_line_start: primarySeg.line_start,
    source_line_end: primarySeg.line_end,
    printed_page: primarySec.printed_page,
    additional_sources: [
      ...secs.flatMap(sec => sec.segments.map(seg => ({
        source_file: seg.file,
        source_section: `Section ${sec.section_code}`,
        source_line_start: seg.line_start,
        source_line_end: seg.line_end,
        printed_page: sec.printed_page
      }))),
      {
        source_file: a.source_file,
        source_section: a.source_section,
        source_table: a.source_table,
        source_line_start: a.source_line_start,
        source_line_end: a.source_line_end,
        printed_page: a.printed_page
      }
    ]
  });
}

// Add the 8 temporarily suspended GWUIM courses explicitly documented in ugc3.md, ugc4.md, and ugc6.md
// Note: These courses have no 2025/2026 course_code assigned in Section 2/5/Annex (a), though they appear in Section 9 (2024/2025 cutoffs).
const suspendedGwuimCourses = [
  {
    official_title: 'Service Management',
    stream_section: '2.2.2',
    stream_category: 'Commerce Stream (Temporarily Suspended for 2025/2026)',
    source_file: 'ugc3.md',
    source_section: 'Section 2.2.2 (Important Note after 2.2.2.8)',
    source_line_start: 197,
    source_line_end: 199,
    historical_2024_2025_table: 'Table 9.4'
  },
  {
    official_title: 'Indigenous Medicinal Resources',
    stream_section: '2.2.3',
    stream_category: 'Biological Science Stream (Temporarily Suspended for 2025/2026)',
    source_file: 'ugc4.md',
    source_section: 'Section 2.2.3 (Important Note after 2.2.3.36)',
    source_line_start: 93,
    source_line_end: 95,
    historical_2024_2025_table: 'Table 9.6'
  },
  {
    official_title: 'Health Information and Communication Technology',
    stream_section: '2.2.8',
    stream_category: 'Courses of Study for which Students from Different Streams are Eligible (Temporarily Suspended for 2025/2026)',
    source_file: 'ugc6.md',
    source_section: 'Section 2.2.8 (Important Note after 2.2.8.43)',
    source_line_start: 227,
    source_line_end: 231,
    historical_2024_2025_table: 'Table 9.6'
  },
  {
    official_title: 'Health Tourism and Hospitality Management',
    stream_section: '2.2.8',
    stream_category: 'Courses of Study for which Students from Different Streams are Eligible (Temporarily Suspended for 2025/2026)',
    source_file: 'ugc6.md',
    source_section: 'Section 2.2.8 (Important Note after 2.2.8.43)',
    source_line_start: 227,
    source_line_end: 232,
    historical_2024_2025_table: 'Table 9.6'
  },
  {
    official_title: 'Biomedical Technology',
    stream_section: '2.2.8',
    stream_category: 'Courses of Study for which Students from Different Streams are Eligible (Temporarily Suspended for 2025/2026)',
    source_file: 'ugc6.md',
    source_section: 'Section 2.2.8 (Important Note after 2.2.8.43)',
    source_line_start: 227,
    source_line_end: 233,
    historical_2024_2025_table: 'Table 9.6'
  },
  {
    official_title: 'Indigenous Pharmaceutical Technology',
    stream_section: '2.2.8',
    stream_category: 'Courses of Study for which Students from Different Streams are Eligible (Temporarily Suspended for 2025/2026)',
    source_file: 'ugc6.md',
    source_section: 'Section 2.2.8 (Important Note after 2.2.8.43)',
    source_line_start: 227,
    source_line_end: 234,
    historical_2024_2025_table: 'Table 9.6'
  },
  {
    official_title: 'Yoga and Parapsychology',
    stream_section: '2.2.8',
    stream_category: 'Courses of Study for which Students from Different Streams are Eligible (Temporarily Suspended for 2025/2026)',
    source_file: 'ugc6.md',
    source_section: 'Section 2.2.8 (Important Note after 2.2.8.43)',
    source_line_start: 227,
    source_line_end: 235,
    historical_2024_2025_table: 'Table 9.6'
  },
  {
    official_title: 'Social Studies in Indigenous Knowledge',
    stream_section: '2.2.8',
    stream_category: 'Courses of Study for which Students from Different Streams are Eligible (Temporarily Suspended for 2025/2026)',
    source_file: 'ugc6.md',
    source_section: 'Section 2.2.8 (Important Note after 2.2.8.43)',
    source_line_start: 227,
    source_line_end: 236,
    historical_2024_2025_table: 'Table 9.6'
  }
];

for (const sc of suspendedGwuimCourses) {
  courses.push({
    course_code: null,
    official_title: sc.official_title,
    title_variants: {
      section_2_heading: null,
      section_2_course_title: sc.official_title,
      section_5_unicode_table_titles: [],
      annex_a_title: null
    },
    admission_year: '2025/2026',
    examination_year: '2025',
    status: 'temporarily_suspended',
    suspension_reason: 'Temporarily suspended for Academic Year 2025/2026 due to ongoing curriculum review at Gampaha Wickramarachchi University of Indigenous Medicine, Sri Lanka.',
    is_new_in_2025_2026: false,
    stream_section: sc.stream_section,
    stream_category: sc.stream_category,
    proposed_intake_2025_2026: 0,
    proposed_intake_section_2: 0,
    includes_additional_intake_note: null,
    uni_codes: [],
    accreditation: null,
    salaries: null,
    fees: null,
    scholarships: null,
    internships: null,
    careers: null,
    verification_status: 'needs_review',
    source_file: sc.source_file,
    source_section: sc.source_section,
    source_table: null,
    source_line_start: sc.source_line_start,
    source_line_end: sc.source_line_end,
    printed_page: null,
    additional_sources: [
      {
        source_file: 'ugc9.md',
        source_section: 'Section 9 (2024/2025 Historical Cutoffs)',
        source_table: sc.historical_2024_2025_table,
        source_line_start: sc.historical_2024_2025_table === 'Table 9.4' ? 310 : 370,
        source_line_end: sc.historical_2024_2025_table === 'Table 9.4' ? 338 : 398,
        printed_page: sc.historical_2024_2025_table === 'Table 9.4' ? 177 : 179
      }
    ]
  });
}

fs.writeFileSync(path.join(OUT_DIR, 'courses.json'), JSON.stringify(courses, null, 2) + '\n', 'utf8');
console.log(`Wrote courses.json (${courses.length} records: 121 active + 8 suspended).`);

// ---------------------------------------------------------------------------
// 8. Build offerings.json
// ---------------------------------------------------------------------------
// Map suffix -> institution object
const instBySuffix = new Map();
const instById = new Map();
for (const inst of institutions) {
  instById.set(inst.institution_id, inst);
  if (inst.uni_code_suffix) {
    instBySuffix.set(inst.uni_code_suffix, inst);
  }
}

// Parse Annex (b) rows from ugc10.md (lines 317-700)
const annexBHeadingToInstId = {
  'University of Colombo': 'CMB',
  'University of Peradeniya': 'PDN',
  'University of Sri Jayewardenapura': 'SJP',
  'University of the Visual & Performing Arts': 'UVPA',
  'University of Kelaniya': 'KLN',
  'Rajarata University of Sri Lanka': 'RUSL',
  'University of Jaffna': 'UJA',
  'Sabaragamuwa University of Sri Lanka': 'SUSL',
  'University of Moratuwa': 'MRT',
  'University of Ruhuna': 'RUH',
  'Uva Wellassa University of Sri Lanka': 'UWU',
  'Wayamba University of Sri Lanka': 'WUSL',
  'Eastern University, Sri Lanka': 'EUSL',
  'South Eastern University of Sri Lanka': 'SEUSL',
  'Gampaha Wickramarachchi University of Indigenous Medicine, Sri Lanka': 'GWUIM',
  'University of Vavuniya, Sri Lanka': 'UOV',
  'Sripalee Campus, University of Colombo': 'SP',
  'Trincomalee Campus, Eastern University, Sri Lanka': 'TRINCO',
  'University of Colombo School of Computing': 'UCSC',
  'Swamy Vipulananda Institute of Aesthetic Studies, Eastern University, Sri Lanka': 'SVIAS',
  'Additional Intake': 'ADDITIONAL_INTAKE'
};

const annexBRows = [];
let currentAnnexBInst = null;
let currentAnnexBHeading = null;
for (let i = 316; i < 701; i++) {
  const line = ugc10Lines[i] || '';
  const hm = line.match(/^###\s+(.+)$/);
  if (hm) {
    currentAnnexBHeading = hm[1].trim();
    currentAnnexBInst = annexBHeadingToInstId[currentAnnexBHeading];
    if (!currentAnnexBInst) {
      throw new Error(`Unknown Annex (b) institution heading: ${currentAnnexBHeading}`);
    }
    continue;
  }
  const rm = line.match(/^\|\s*([^|]+?)\s*\|\s*(\d+|\*\*\d+\*\*)\s*\|$/);
  if (rm && currentAnnexBInst) {
    const cName = rm[1].trim();
    const valStr = rm[2].replace(/\*/g, '').trim();
    if (cName.includes('**Total**')) continue;
    annexBRows.push({
      institution_id: currentAnnexBInst,
      institution_heading_annex_b: currentAnnexBHeading,
      course_title_annex_b: cName,
      proposed_intake: Number(valStr),
      source_file: 'ugc10.md',
      source_section: 'Annex (b)',
      source_table: `Annex (b) — ${currentAnnexBHeading}`,
      source_line_start: i + 1,
      source_line_end: i + 1,
      printed_page: null
    });
  }
}
console.log(`Parsed ${annexBRows.length} Annex (b) course rows (including Additional Intake).`);

function normalizeCourseNameForMatch(s) {
  return s
    .replace(/^¹/, '')
    .toLowerCase()
    .replace(/\s*\(new\)\s*/gi, ' ')
    .replace(/\bbio\s+resources\b/g, 'bioresources')
    .replace(/\bagri\s+business\b/g, 'agribusiness')
    .replace(/\btech\./g, 'technology')
    .replace(/\b(?:bio\.|biological)\s*sc\.?/g, 'biological science')
    .replace(/\b(?:phy\.|physical)\s*sc\.?/g, 'physical science')
    .replace(/\bmgt\./g, 'management')
    .replace(/^arts\s*\(sp\)\s*[-/]\s*/i, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// Match Annex (b) rows to Uni-Codes
const annexBByUniCode = new Map();
for (const ab of annexBRows) {
  if (ab.institution_id === 'ADDITIONAL_INTAKE') continue;
  const candidates = uniCodeRows.filter(u => {
    const inst = instBySuffix.get(u.uni_code_suffix);
    return inst && inst.institution_id === ab.institution_id && !annexBByUniCode.has(u.uni_code);
  });
  const normAB = normalizeCourseNameForMatch(ab.course_title_annex_b);
  let matched = candidates.find(u => normalizeCourseNameForMatch(u.course_title_unicode_table) === normAB);
  if (!matched) {
    // Secondary match for known abbreviations in Annex (b)
    matched = candidates.find(u => {
      const normU = normalizeCourseNameForMatch(u.course_title_unicode_table);
      return normU.includes(normAB) || normAB.includes(normU);
    });
  }
  if (!matched) {
    throw new Error(`Could not match Annex (b) row "${ab.course_title_annex_b}" at ${ab.institution_id}`);
  }
  annexBByUniCode.set(matched.uni_code, ab);
}
console.log(`Matched ${annexBByUniCode.size} of ${uniCodeRows.length} Uni-Codes to Annex (b) rows.`);

// Parse Section 6.1 Blind and Differently Abled table in ugc9.md (lines 15-60)
const specialProvision61ByUniCode = new Map();
const ugc9Lines = filesLines.get('ugc9.md');
for (let i = 15; i < 61; i++) {
  const line = ugc9Lines[i] || '';
  const m = line.match(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([0-9]{3}[A-Z])\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|$/);
  if (m) {
    const uCode = m[3].trim();
    const diffRaw = m[4].trim();
    const blindRaw = m[5].trim();
    specialProvision61ByUniCode.set(uCode, {
      differently_abled_seats: diffRaw === '-' ? 0 : (diffRaw === '' ? null : Number(diffRaw)),
      blind_braille_seats: blindRaw === '-' ? 0 : (blindRaw === '' ? null : Number(blindRaw)),
      differently_abled_raw: diffRaw,
      blind_braille_raw: blindRaw,
      source_file: 'ugc9.md',
      source_section: 'Section 6.1',
      source_table: 'Blind and Differently Abled Candidates Table',
      source_line_start: i + 1,
      source_line_end: i + 1,
      printed_page: 164
    });
  }
}
console.log(`Parsed ${specialProvision61ByUniCode.size} rows from Section 6.1 Special Provision table.`);

// Helper to normalize duration text to standard form (e.g. "04 years" -> "4 years")
function normalizeDurationText(raw) {
  if (!raw) return null;
  return raw
    .replace(/\b0(\d)\s+years?\b/gi, '$1 years')
    .replace(/\bfour\s*\(0?4\)\s*years\b/gi, '4 years')
    .replace(/\bthree\s*\(0?3\)\s*years\b/gi, '3 years')
    .replace(/\bfive\s*\(0?5\)\s*years\b/gi, '5 years')
    .replace(/\s+/g, ' ')
    .trim();
}

// Parse Commerce university degree blocks in ugc3.md (lines 6-107) for 016, 017, 018, 028
const ugc3Lines = filesLines.get('ugc3.md');
const commerceDegreesByInstId = new Map();
let currentCommerceInstId = null;
for (let i = 5; i < 108; i++) {
  const t = (ugc3Lines[i] || '').trim();
  const hm = t.match(/^###\s+(.+)$/);
  if (hm) {
    const name = hm[1].toLowerCase();
    if (name.includes('colombo')) currentCommerceInstId = 'CMB';
    else if (name.includes('jayewardenepura')) currentCommerceInstId = 'SJP';
    else if (name.includes('kelaniya')) currentCommerceInstId = 'KLN';
    else if (name.includes('jaffna')) currentCommerceInstId = 'UJA';
    else if (name.includes('ruhuna')) currentCommerceInstId = 'RUH';
    else if (name.includes('eastern university') && !name.includes('south')) currentCommerceInstId = 'EUSL';
    else if (name.includes('south eastern')) currentCommerceInstId = 'SEUSL';
    else if (name.includes('rajarata')) currentCommerceInstId = 'RUSL';
    else if (name.includes('wayamba')) currentCommerceInstId = 'WUSL';
    else if (name.includes('sabaragamuwa')) currentCommerceInstId = 'SUSL';
    else if (name.includes('peradeniya')) currentCommerceInstId = 'PDN';
    if (currentCommerceInstId && !commerceDegreesByInstId.has(currentCommerceInstId)) {
      commerceDegreesByInstId.set(currentCommerceInstId, []);
    }
    continue;
  }
  const bm = t.match(/^\*\s+(.+)$/);
  if (bm && currentCommerceInstId) {
    commerceDegreesByInstId.get(currentCommerceInstId).push(bm[1].replace(/\*+$/g, '').trim());
  }
}

// Parse Management Studies (TV) (022) university degree blocks in ugc3.md (lines 124-139)
const mgtTvDegreesByInstId = new Map([
  ['UOV', []],
  ['TRINCO', []]
]);
let currentTvInstId = null;
for (let i = 123; i < 140; i++) {
  const t = (ugc3Lines[i] || '').trim();
  if (t.startsWith('**University of Vavuniya')) currentTvInstId = 'UOV';
  else if (t.startsWith('**Trincomalee Campus')) currentTvInstId = 'TRINCO';
  else if (t.startsWith('* ') && currentTvInstId) {
    mgtTvDegreesByInstId.get(currentTvInstId).push(t.slice(2).trim());
  }
}

// Parse Medicine (001), Dental Surgery (002), Veterinary Science (003) faculty/location lines in ugc3.md (lines 251-310)
const medFacultyByUniCode = new Map();
for (const [cCode, startLine, endLine] of [['001', 251, 276], ['002', 289, 294], ['003', 307, 310]]) {
  const uRows = uniCodeRows.filter(u => u.course_code === cCode);
  for (let i = startLine; i < endLine; i++) {
    const t = (ugc3Lines[i] || '').trim();
    if (t.startsWith('* Faculty of')) {
      const facLine = t.slice(2).trim();
      const locLine = (ugc3Lines[i + 1] || '').trim();
      const combined = locLine.startsWith('(Location') ? `${facLine} ${locLine}` : facLine;
      const lower = facLine.toLowerCase();
      const matched = uRows.find(u => {
        const inst = instBySuffix.get(u.uni_code_suffix);
        if (!inst) return false;
        if (lower.includes('colombo') && inst.institution_id === 'CMB') return true;
        if (lower.includes('peradeniya') && inst.institution_id === 'PDN') return true;
        if (lower.includes('jaffna') && inst.institution_id === 'UJA') return true;
        if (lower.includes('ruhuna') && inst.institution_id === 'RUH') return true;
        if (lower.includes('kelaniya') && inst.institution_id === 'KLN') return true;
        if (lower.includes('jayewardenepura') && inst.institution_id === 'SJP') return true;
        if (lower.includes('rajarata') && inst.institution_id === 'RUSL') return true;
        if (lower.includes('eastern') && inst.institution_id === 'EUSL') return true;
        if (lower.includes('wayamba') && inst.institution_id === 'WUSL') return true;
        if (lower.includes('sabaragamuwa') && inst.institution_id === 'SUSL') return true;
        if (lower.includes('moratuwa') && inst.institution_id === 'MRT') return true;
        if (lower.includes('uva wellassa') && inst.institution_id === 'UWU') return true;
        return false;
      });
      if (matched) {
        medFacultyByUniCode.set(matched.uni_code, [combined]);
      }
    }
  }
}

// Parse Engineering (008) specialization streams per university in ugc4.md (lines 149-193)
const ugc4Lines = filesLines.get('ugc4.md');
const engSpecsByInstId = new Map();
let currentEngInstId = null;
for (let i = 148; i < 194; i++) {
  const t = (ugc4Lines[i] || '').trim();
  if (t.startsWith('**University of Peradeniya')) currentEngInstId = 'PDN';
  else if (t.startsWith('**University of Moratuwa')) currentEngInstId = 'MRT';
  else if (t.startsWith('**University of Ruhuna')) currentEngInstId = 'RUH';
  else if (t.startsWith('**University of Jaffna')) currentEngInstId = 'UJA';
  else if (t.startsWith('**South Eastern University')) currentEngInstId = 'SEUSL';
  else if (t.startsWith('**University of Sri Jayewardenepura')) currentEngInstId = 'SJP';
  else if (t.startsWith('* ') && currentEngInstId) {
    if (!engSpecsByInstId.has(currentEngInstId)) engSpecsByInstId.set(currentEngInstId, []);
    engSpecsByInstId.get(currentEngInstId).push(t.slice(2).trim());
  }
}

// Parse generic course-level bullets/prose for all Section 2.2 subsections
function extractSubsectionSharedDetails(sec) {
  const lines = sec.full_text.split(/\r?\n/).map(l => l.trim());
  const degrees = [];
  const durations = [];
  const mediums = [];
  const specs = [];
  let curriculumCredits = null;
  let conditionalEntry = null;

  let inDegreeList = false;
  let inSpecList = false;

  for (let i = 0; i < lines.length; i++) {
    const t = lines[i];

    // Check for 120 credit curriculum prose (Nursing, Pharmacy, MLS, Radiography, Physiotherapy, Technology stream)
    const creditMatch = t.match(/offers?\s+a\s+(120\s+credit\s+curriculum)\s+leading\s+to\s+a\s+(Bachelor of Science in [^.;:]+)/i);
    if (creditMatch) {
      curriculumCredits = creditMatch[1].trim();
      const deg = creditMatch[2].trim();
      if (!degrees.includes(deg)) degrees.push(deg);
    }
    if (/All these courses contain a minimum of 120 credits/i.test(t)) {
      curriculumCredits = 'Minimum 120 credits';
    }

    // Check for prose degree / duration / medium (e.g. 2.2.1.1.4, 2.2.1.1.5, 2.2.1.1.6, 2.2.1.1.7, 2.2.1.2, 2.2.1.3)
    const proseDeg = t.match(/^(?:Name of the degree programme is|The degree programme offered is)\s+(.+?)\.$/i);
    if (proseDeg) {
      const d = proseDeg[1].trim();
      if (!degrees.includes(d)) degrees.push(d);
    }
    const proseDurMed = t.match(/The duration of (?:the|both) degree programmes? (?:is|are) ([^.]+?) and the medium of instructions? is ([A-Za-z]+)\./i);
    if (proseDurMed) {
      const dur = normalizeDurationText(proseDurMed[1]);
      if (dur && !durations.includes(dur)) durations.push(dur);
      const med = proseDurMed[2].trim();
      if (med && !mediums.includes(med)) mediums.push(med);
    }
    const proseDurOnly = t.match(/^(?:Duration of the degree programme is|Durations of the degree programmes are|The duration of the degree programme is)\s+([^.]+?)(?:\s+and the medium.*)?\.$/i);
    if (proseDurOnly && !proseDurMed) {
      const dur = normalizeDurationText(proseDurOnly[1]);
      if (dur && !durations.includes(dur)) durations.push(dur);
    }
    const proseMedOnly = t.match(/^The mediums? of instructions? (?:for this degree programme )?(?:is|are)\s+([^.]+)\.$/i);
    if (proseMedOnly) {
      const parts = proseMedOnly[1].split(/\s+and\s+|,\s*/i).map(x => x.trim()).filter(Boolean);
      for (const p of parts) {
        if (!mediums.includes(p)) mediums.push(p);
      }
    }

    // Check for standard bullets: * **Degree Programme:** / **Duration:** / **Medium:**
    const singleDegBullet = t.match(/^\*\s*\*\*Degree Programme\s*:\*\*\s*(.+)$/i);
    if (singleDegBullet) {
      const d = singleDegBullet[1].trim();
      if (d && !degrees.includes(d)) degrees.push(d);
      inDegreeList = false;
      inSpecList = false;
      continue;
    }

    if (/^\*\s*\*\*Degree Programmes(?:\s*&\s*Durations)?\s*:\*\*\s*$/i.test(t)) {
      inDegreeList = true;
      inSpecList = false;
      continue;
    }

    if (/^\*\s*\*\*Fields of [Ss]pecialization\s*:\*\*\s*$/i.test(t)) {
      inSpecList = true;
      inDegreeList = false;
      continue;
    }

    const durBullet = t.match(/^(?:\*\s*)?\*\*Duration\s*:\*\*\s*(.+)$/i);
    if (durBullet) {
      const d = normalizeDurationText(durBullet[1]);
      if (d && !durations.includes(d)) durations.push(d);
      inDegreeList = false;
      inSpecList = false;
      continue;
    }

    const medBullet = t.match(/^(?:\*\s*)?\*\*Medium\s*:\*\*\s*(.+)$/i);
    if (medBullet) {
      const rawMed = medBullet[1].trim();
      if (rawMed) {
        const parts = rawMed.split(/\s*\/\s*|\s*,\s*/).map(x => x.trim()).filter(Boolean);
        for (const p of parts) {
          if (!mediums.includes(p)) mediums.push(p);
        }
      }
      inDegreeList = false;
      inSpecList = false;
      continue;
    }

    if (inDegreeList) {
      if (t.startsWith('* **')) {
        inDegreeList = false;
      } else if (t.startsWith('* Duration') || t.startsWith('* **Duration')) {
        const dm = t.match(/Duration\s*:\s*(.+)$/i);
        if (dm && degrees.length > 0) {
          const normD = normalizeDurationText(dm[1]);
          degrees[degrees.length - 1] = `${degrees[degrees.length - 1]} (${normD})`;
          if (normD && !durations.includes(normD)) durations.push(normD);
        }
      } else if (t.startsWith('* ')) {
        const degText = t.slice(2).trim();
        const inlineDur = degText.match(/\((0?\d\s+years)\)/i);
        if (inlineDur) {
          const normD = normalizeDurationText(inlineDur[1]);
          if (normD && !durations.includes(normD)) durations.push(normD);
        }
        if (degText && !degrees.includes(degText)) degrees.push(degText);
      } else if (t === '' || t.startsWith('###') || t.startsWith('---')) {
        inDegreeList = false;
      }
    }

    if (inSpecList) {
      if (t.startsWith('* **')) {
        inSpecList = false;
      } else if (t.startsWith('* ')) {
        specs.push(t.slice(2).trim());
      } else if (t === '' || t.startsWith('###') || t.startsWith('---')) {
        inSpecList = false;
      }
    }

    if (/selected to follow|may proceed to (?:the )?fourth year|selected for one of the following specialization|selection for a particular/i.test(t)) {
      const cleanCond = t.replace(/^\*+|\*+$/g, '').replace(/^>\s*\*+/, '').trim();
      if (!conditionalEntry) conditionalEntry = cleanCond;
    }
  }

  return {
    degree_programmes: degrees.length > 0 ? degrees : null,
    duration: durations.length > 0 ? durations.join(' / ') : null,
    medium_of_instruction: mediums.length > 0 ? mediums : null,
    specialization_streams: specs.length > 0 ? specs : null,
    curriculum_credits: curriculumCredits,
    conditional_honours_entry: conditionalEntry
  };
}

// Parse Section 2.2 markdown tables (e.g. 019 Arts medium table in ugc2.md lines 473-483)
const sec2TableDetailsByUniCode = new Map();
for (const a of annexACourses) {
  const secs = courseToSection2.get(a.course_code) || [];
  const uRowsForCourse = uniCodeRows.filter(u => u.course_code === a.course_code);

  for (const sec of secs) {
    const fullLines = sec.segments.flatMap(seg => seg.lines.map((text, idx) => ({
      text,
      file: seg.file,
      lineNum: seg.line_start + idx
    })));

    let inTable = false;
    let headerCols = [];
    for (let i = 0; i < fullLines.length; i++) {
      const { text, file, lineNum } = fullLines[i];
      const t = text.trim();
      if (t.startsWith('|') && t.endsWith('|')) {
        const cols = t.slice(1, -1).split('|').map(c => c.trim());
        if (!inTable) {
          headerCols = cols;
          inTable = true;
        } else if (cols.every(c => /^:?-{2,}:?$/.test(c))) {
          continue;
        } else {
          const col0 = cols[0].replace(/\*\*/g, '').trim();
          if (headerCols[0] && /University|Institute|Campus/i.test(headerCols[0])) {
            const matchedURow = uRowsForCourse.find(u => {
              const inst = instBySuffix.get(u.uni_code_suffix);
              if (!inst) return false;
              const n0 = col0.toLowerCase();
              const nOfficial = inst.official_name.toLowerCase();
              if (n0 === nOfficial) return true;
              if (n0.includes('jayewardenepura') && inst.institution_id === 'SJP') return true;
              if (n0.includes('visual') && inst.institution_id === 'UVPA') return true;
              if (n0.includes('colombo school of computing') && inst.institution_id === 'UCSC') return true;
              if (n0.includes('sripalee') && inst.institution_id === 'SP') return true;
              if (n0.includes('trincomalee') && inst.institution_id === 'TRINCO') return true;
              if (n0.includes('vipulananda') && inst.institution_id === 'SVIAS') return true;
              if (n0.includes('wickramarachchi') && inst.institution_id === 'GWUIM') return true;
              if (n0.includes('vavuniya') && inst.institution_id === 'UOV') return true;
              if (n0.includes('eastern university') && !n0.includes('south') && !n0.includes('trincomalee') && !n0.includes('vipulananda') && inst.institution_id === 'EUSL') return true;
              if (n0.includes('south eastern') && inst.institution_id === 'SEUSL') return true;
              if (n0.includes('rajarata') && inst.institution_id === 'RUSL') return true;
              if (n0.includes('sabaragamuwa') && inst.institution_id === 'SUSL') return true;
              if (n0.includes('wayamba') && inst.institution_id === 'WUSL') return true;
              if (n0.includes('uva wellassa') && inst.institution_id === 'UWU') return true;
              if (n0.includes('peradeniya') && inst.institution_id === 'PDN') return true;
              if (n0.includes('kelaniya') && inst.institution_id === 'KLN') return true;
              if (n0.includes('moratuwa') && inst.institution_id === 'MRT') return true;
              if (n0.includes('jaffna') && inst.institution_id === 'UJA') return true;
              if (n0.includes('ruhuna') && inst.institution_id === 'RUH') return true;
              if (n0.includes('colombo') && !n0.includes('school of computing') && !n0.includes('sripalee') && inst.institution_id === 'CMB') return true;
              return false;
            });

            if (matchedURow) {
              const prev = sec2TableDetailsByUniCode.get(matchedURow.uni_code) || {
                degree_programmes: [],
                durations: [],
                mediums: [],
                locations_or_faculties: [],
                table_rows: []
              };
              const rowObj = {};
              headerCols.forEach((h, idx) => {
                const key = h.replace(/\*\*/g, '').trim() || `col_${idx}`;
                rowObj[key] = (cols[idx] || '').replace(/\*\*/g, '').trim();
              });
              prev.table_rows.push({
                header: headerCols.map(h => h.replace(/\*\*/g, '').trim()),
                values: cols.map(c => c.replace(/\*\*/g, '').trim()),
                row_map: rowObj,
                source_file: file,
                source_line: lineNum
              });

              for (let cIdx = 1; cIdx < headerCols.length; cIdx++) {
                const h = headerCols[cIdx].toLowerCase();
                const val = (cols[cIdx] || '').replace(/\*\*/g, '').trim();
                if (!val) continue;
                if (h.includes('degree') || h.includes('programme')) {
                  if (!prev.degree_programmes.includes(val)) prev.degree_programmes.push(val);
                } else if (h.includes('duration')) {
                  if (!prev.durations.includes(val)) prev.durations.push(val);
                } else if (h.includes('medium')) {
                  const mParts = val.split(/\s*,\s*/).map(x => x.trim()).filter(Boolean);
                  for (const mp of mParts) {
                    if (!prev.mediums.includes(mp)) prev.mediums.push(mp);
                  }
                } else if (h.includes('location')) {
                  if (!prev.locations_or_faculties.includes(val)) prev.locations_or_faculties.push(val);
                }
              }
              sec2TableDetailsByUniCode.set(matchedURow.uni_code, prev);
            }
          }
        }
      } else {
        inTable = false;
        headerCols = [];
      }
    }
  }
}

// Resolve offering-level facts for all 255 Uni-Codes, strictly separating course_shared vs institution_specific facts
function resolveOfferingDetails(uRow, inst, primarySec) {
  const uCode = uRow.uni_code;
  const cCode = uRow.course_code;
  const instId = inst.institution_id;
  const shared = primarySec ? extractSubsectionSharedDetails(primarySec) : {
    degree_programmes: null,
    duration: null,
    medium_of_instruction: null,
    specialization_streams: null,
    curriculum_credits: null,
    conditional_honours_entry: null
  };
  const tableInfo = sec2TableDetailsByUniCode.get(uCode) || {
    degree_programmes: [],
    durations: [],
    mediums: [],
    locations_or_faculties: [],
    table_rows: []
  };

  let courseShared = {
    degree_programmes: shared.degree_programmes,
    duration: shared.duration,
    medium_of_instruction: shared.medium_of_instruction
  };
  let instSpecific = {
    degree_programmes: tableInfo.degree_programmes.length > 0 ? tableInfo.degree_programmes : null,
    duration: tableInfo.durations.length > 0 ? tableInfo.durations.join(' / ') : null,
    medium_of_instruction: tableInfo.mediums.length > 0 ? tableInfo.mediums : null,
    location_or_faculty: tableInfo.locations_or_faculties.length > 0 ? tableInfo.locations_or_faculties : null,
    specialization_streams: null
  };
  let altPathways = null;
  let condEntry = shared.conditional_honours_entry;
  let currCredits = shared.curriculum_credits;

  // Handle multi-university and special subsections where facts are institution-specific:
  if (cCode === '019') {
    // 2.2.1.1 Arts: medium is per-university from the table; degree and duration are not stated in 2.2.1.1
    courseShared = { degree_programmes: null, duration: null, medium_of_instruction: null };
  } else if (uCode === '020S') {
    // 2.2.1.1.1 Arts (SP) - Mass Media (ugc2.md lines 501-528)
    courseShared = { degree_programmes: null, duration: '4 years', medium_of_instruction: ['Sinhala'] };
    instSpecific.degree_programmes = ['Bachelor of Arts Honours in Mass Media'];
    instSpecific.location_or_faculty = ['Sripalee Campus, University of Colombo, Horana'];
  } else if (uCode === '041S') {
    // 2.2.1.1.1 Arts (SP) - Performing Arts (ugc2.md lines 501-528)
    courseShared = { degree_programmes: null, duration: '4 years', medium_of_instruction: ['Sinhala'] };
    instSpecific.degree_programmes = ['Bachelor of Arts Honours in Performing Arts'];
    instSpecific.location_or_faculty = ['Sripalee Campus, University of Colombo, Horana'];
  } else if (uCode === '021L') {
    // 2.2.1.1.2 Arts (SAB) (ugc2.md lines 530-555)
    courseShared = { degree_programmes: null, duration: null, medium_of_instruction: null };
    instSpecific.degree_programmes = ['Bachelor of Arts Honours (04 years)', 'Bachelor of Arts (03 years)'];
    instSpecific.duration = '3 years / 4 years';
    instSpecific.medium_of_instruction = [
      'English and Sinhala (Economics, Statistics, Geography, Sociology, Political Science)',
      'English only (Information & Communication Technology)'
    ];
    altPathways = ['Bachelor of Arts (03 years)', 'Bachelor of Arts Honours (04 years)'];
    condEntry = 'Students are selected for the four-year Honours degree programme at the end of the first year based on their performance in the first year examinations.';
  } else if (uCode === '029W') {
    // 2.2.1.1.3 Communication Studies (ugc2.md lines 557-574)
    courseShared = { degree_programmes: null, duration: null, medium_of_instruction: null };
    instSpecific.degree_programmes = ['Bachelor of Arts in Communication Studies', 'Bachelor of Arts in Languages'];
    instSpecific.duration = '3 years (with optional 4th year)';
    instSpecific.medium_of_instruction = ['English'];
    instSpecific.location_or_faculty = ['Faculty of Communication and Business Studies, Trincomalee Campus, Eastern University, Sri Lanka'];
    altPathways = [
      'Bachelor of Arts in Communication Studies (3 years, with optional 4th year)',
      'Bachelor of Arts in Languages (3 years, with optional 4th year)'
    ];
    condEntry = 'Students admitted to a three year degree programme may proceed to fourth year if they so desire and satisfy the requirements of the university.';
  } else if (['068Z', '069Z', '071Z', '085Z'].includes(uCode)) {
    // 2.2.1.1.8 Aesthetic courses at UVPA (ugc2.md lines 607-626): medium is Sinhala, duration not stated
    courseShared = { degree_programmes: null, duration: null, medium_of_instruction: null };
    instSpecific.medium_of_instruction = ['Sinhala'];
    if (uCode === '085Z') {
      instSpecific.degree_programmes = ['Bachelor of Visual Arts Honours'];
      instSpecific.location_or_faculty = ['Faculty of Visual Arts, University of the Visual and Performing Arts'];
    } else if (uCode === '068Z') {
      instSpecific.degree_programmes = ['Bachelor of Performing Arts - Music Honours'];
      instSpecific.location_or_faculty = ['Faculty of Music, University of the Visual and Performing Arts'];
    } else {
      instSpecific.degree_programmes = ['Bachelor of Performing Arts - Dance and Drama Honours'];
      instSpecific.location_or_faculty = ['Faculty of Dance and Drama, University of the Visual and Performing Arts'];
    }
  } else if (['068E', '069E', '070E'].includes(uCode)) {
    // 2.2.1.1.9 Aesthetic courses at UJA (ugc2.md lines 628-647): medium is Tamil, duration not stated
    courseShared = { degree_programmes: null, duration: null, medium_of_instruction: null };
    instSpecific.medium_of_instruction = ['Tamil'];
    instSpecific.location_or_faculty = ['University of Jaffna'];
    if (uCode === '068E') instSpecific.degree_programmes = ['Bachelor of Fine Arts (Music)'];
    else if (uCode === '069E') instSpecific.degree_programmes = ['Bachelor of Fine Arts (Dance)'];
    else if (uCode === '070E') instSpecific.degree_programmes = ['Bachelor of Fine Arts (Art & Design)'];
  } else if (['068Y', '069Y', '071Y', '072Y'].includes(uCode)) {
    // 2.2.1.1.10 Aesthetic courses at SVIAS (ugc2.md lines 649-669): medium is Tamil, duration not stated
    courseShared = { degree_programmes: null, duration: null, medium_of_instruction: null };
    instSpecific.medium_of_instruction = ['Tamil'];
    instSpecific.location_or_faculty = ['Swamy Vipulananda Institute of Aesthetic Studies, Eastern University, Sri Lanka'];
    if (uCode === '068Y') instSpecific.degree_programmes = ['Bachelor of Fine Arts Honours in Music'];
    else if (uCode === '069Y') instSpecific.degree_programmes = ['Bachelor of Fine Arts Honours in Dance'];
    else if (uCode === '071Y') instSpecific.degree_programmes = ['Bachelor of Fine Arts Honours in Drama & Theatre'];
    else if (uCode === '072Y') instSpecific.degree_programmes = ['Bachelor of Fine Arts Honours in Visual & Technological Arts'];
  } else if (uCode === '068C') {
    // 2.2.1.1.11 Music at SJP (ugc2.md lines 671-686): duration not stated, mediums Sinhala and English
    courseShared = { degree_programmes: null, duration: null, medium_of_instruction: null };
    instSpecific.degree_programmes = ['Bachelor of Arts Honours in Music [BAHons (Mus)]'];
    instSpecific.medium_of_instruction = ['Sinhala', 'English'];
    instSpecific.location_or_faculty = ['University of Sri Jayewardenepura'];
  } else if (['016', '017', '018', '028'].includes(cCode)) {
    // 2.2.2.1-2.2.2.4 Management, Management & Public Policy, Real Estate, Commerce (ugc2.md line 788 + ugc3.md lines 6-107)
    courseShared = { degree_programmes: null, duration: '4 years', medium_of_instruction: null };
    const allInstDegrees = commerceDegreesByInstId.get(instId) || [];
    if (cCode === '028') {
      instSpecific.degree_programmes = allInstDegrees.filter(d => /Management and Public Policy/i.test(d));
    } else if (cCode === '017') {
      instSpecific.degree_programmes = allInstDegrees.filter(d => /Real Estate Management and Valuation/i.test(d));
    } else if (cCode === '018') {
      instSpecific.degree_programmes = allInstDegrees.filter(d => /Bachelor of Commerce/i.test(d));
    } else if (cCode === '016') {
      instSpecific.degree_programmes = allInstDegrees.filter(
        d => !/Bachelor of Commerce|Management and Public Policy|Real Estate Management and Valuation/i.test(d)
      );
    }
    if (instSpecific.degree_programmes && instSpecific.degree_programmes.length > 1) {
      altPathways = instSpecific.degree_programmes;
    }
    condEntry = 'The relevant Faculty of the University to which the student has been admitted will make selection for a particular field of specialization within Management, Commerce and Management Studies (TV) on a criterion determined by them.';
  } else if (cCode === '022') {
    // 2.2.2.5 Management Studies (TV) (022R UOV, 022W TRINCO, ugc3.md lines 110-139)
    courseShared = { degree_programmes: null, duration: '3 years / 4 years', medium_of_instruction: null };
    instSpecific.degree_programmes = mgtTvDegreesByInstId.get(instId) || null;
    altPathways = instSpecific.degree_programmes;
    condEntry = 'Students admitted to a three year degree programme may proceed to the fourth year if they so desire and satisfy the requirements of the University.';
  } else if (['001', '002', '003'].includes(cCode)) {
    // Medicine, Dental Surgery, Veterinary Science: 5 years duration + institution-specific faculty/location
    courseShared = { degree_programmes: null, duration: '5 years', medium_of_instruction: null };
    instSpecific.location_or_faculty = medFacultyByUniCode.get(uCode) || null;
  } else if (cCode === '004') {
    // 2.2.3.5 Agriculture: SUSL offers BSc in Agriculture; EUSL/UJA/RUSL/WUSL offer BSc Honours in Agriculture
    courseShared = { degree_programmes: null, duration: '4 years', medium_of_instruction: null };
    instSpecific.degree_programmes = instId === 'SUSL'
      ? ['Bachelor of Science in Agriculture']
      : ['Bachelor of Science Honours in Agriculture'];
  } else if (cCode === '036') {
    // 2.2.3.13 Siddha Medicine and Surgery: UJA is Tamil, TRINCO is English
    courseShared = {
      degree_programmes: ['Bachelor of Siddha Medicine and Surgery (B.S.M.S.)'],
      duration: '6 years [05 academic years and 01-year (final) internship]',
      medium_of_instruction: null
    };
    instSpecific.medium_of_instruction = instId === 'UJA' ? ['Tamil'] : ['English'];
  } else if (cCode === '007') {
    // 2.2.3.15 Applied Sciences (Biological Science): per-university degrees and 3/4 year durations
    courseShared = { degree_programmes: null, duration: null, medium_of_instruction: null };
    if (instId === 'SUSL') {
      instSpecific.degree_programmes = [
        'Bachelor of Science (Applied Sciences) in Environmental Sciences and Natural Resources Management (03 years)',
        'Bachelor of Science (Applied Sciences) Honours in Environmental Sciences and Natural Resources Management (04 years)'
      ];
      instSpecific.duration = '3 years / 4 years';
    } else if (instId === 'RUSL') {
      instSpecific.degree_programmes = [
        'Bachelor of Science in Applied Sciences (03 years)',
        'Bachelor of Science Honours in Applied Sciences (04 years)',
        'Bachelor of Science (Joint Major) in Applied Sciences (04 years)',
        'Bachelor of Science Honours in Applied Biology (04 years)',
        'Bachelor of Science Honours in Chemistry (04 years)'
      ];
      instSpecific.duration = '3 years / 4 years';
    } else if (instId === 'UOV') {
      instSpecific.degree_programmes = [
        'Bachelor of Science in Environmental Science (03 years)',
        'Bachelor of Science Honours in Environmental Science (04 years)'
      ];
      instSpecific.duration = '3 years / 4 years';
    }
    altPathways = instSpecific.degree_programmes;
  } else if (cCode === '008') {
    // 2.2.4.1 Engineering: specialization streams per university
    courseShared = { degree_programmes: null, duration: null, medium_of_instruction: null };
    instSpecific.specialization_streams = engSpecsByInstId.get(instId) || null;
    condEntry = 'Selection for a particular field of specialization specified above would be done by the University to which the candidate has been admitted.';
  } else if (cCode === '012') {
    // 2.2.4.6 Computer Science: 3-year BSc at UCSC/UJA/RUH/TRINCO vs 4-year Honours at UCSC/KLN/UJA/SJP
    courseShared = { degree_programmes: null, duration: null, medium_of_instruction: ['English'] };
    if (instId === 'UCSC') {
      instSpecific.degree_programmes = [
        'Bachelor of Science in Computer Science (03 years)',
        'Bachelor of Science Honours in Computer Science (04 years)',
        'Bachelor of Science Honours in Software Engineering (04 years)'
      ];
      instSpecific.duration = '3 years / 4 years';
      altPathways = instSpecific.degree_programmes;
    } else if (instId === 'UJA') {
      instSpecific.degree_programmes = [
        'Bachelor of Science in Computer Science (03 years)',
        'Bachelor of Science Honours in Computer Science [BScHons (Computer Science)] (04 years)'
      ];
      instSpecific.duration = '3 years / 4 years';
      altPathways = instSpecific.degree_programmes;
    } else if (instId === 'RUH' || instId === 'TRINCO') {
      instSpecific.degree_programmes = ['Bachelor of Science in Computer Science'];
      instSpecific.duration = '3 years';
    } else if (instId === 'KLN') {
      instSpecific.degree_programmes = ['Bachelor of Science Honours in Computer Science [BScHons (ComputerSc)]'];
      instSpecific.duration = '4 years';
    } else if (instId === 'SJP') {
      instSpecific.degree_programmes = ['Bachelor of Computing Honours in Computer Science [BCompHons (Comp Sc)]'];
      instSpecific.duration = '4 years';
    }
  } else if (cCode === '015') {
    // 2.2.4.7 Applied Sciences (Physical Science): per-university degrees, durations, and WUSL English medium
    courseShared = { degree_programmes: null, duration: null, medium_of_instruction: null };
    if (instId === 'RUSL') {
      instSpecific.degree_programmes = [
        'Bachelor of Science in Applied Sciences (03 years)',
        'Bachelor of Science Honours in Applied Sciences (04 years)',
        'Bachelor of Science Honours (Joint Major) in Applied Sciences (04 years)',
        'Bachelor of Science Honours in Industrial Mathematics (04 years)',
        'Bachelor of Science Honours in Chemistry (04 years)'
      ];
      instSpecific.duration = '3 years / 4 years';
    } else if (instId === 'SUSL') {
      instSpecific.degree_programmes = [
        'Bachelor of Science (Applied Sciences) Honours in Chemical Technology',
        'Bachelor of Science (Applied Sciences) Honours in Computer Science & Technology',
        'Bachelor of Science (Applied Sciences) Honours in Applied Physics',
        'Bachelor of Science (Applied Sciences) in Physical Sciences'
      ];
      instSpecific.duration = null;
    } else if (instId === 'UOV') {
      instSpecific.degree_programmes = [
        'Bachelor of Science in Applied Mathematics & Computing (03 years)',
        'Bachelor of Science Honours in Computer Science (04 years)'
      ];
      instSpecific.duration = '3 years / 4 years';
    } else if (instId === 'TRINCO') {
      instSpecific.degree_programmes = [
        'Bachelor of Science in Applied Physics and Electronics',
        'Bachelor of Science Honours in Applied Physics',
        'Bachelor of Science Honours in Electronics'
      ];
      instSpecific.duration = null;
    } else if (instId === 'WUSL') {
      instSpecific.degree_programmes = [
        'Bachelor of Science (03 years)',
        'Bachelor of Science (Joint Major) in Major 1 and Major 2 (04 years)',
        'Bachelor of Science Honours in Applied Electronics (04 years)',
        'Bachelor of Science Honours in Industrial Management (04 years)',
        'Bachelor of Science Honours in Mathematics with Statistics (04 years)'
      ];
      instSpecific.duration = '3 years / 4 years';
      instSpecific.medium_of_instruction = ['English'];
      instSpecific.specialization_streams = [
        'Computing & Information Systems',
        'Electronics',
        'Industrial Management',
        'Mathematics & Mathematical Modeling',
        'Statistics'
      ];
    }
    altPathways = instSpecific.degree_programmes;
  } else if (cCode === '108') {
    // 2.2.4.10 Physical Science - ICT: KLN vs SJP degree titles
    courseShared = { degree_programmes: null, duration: '3 years', medium_of_instruction: null };
    instSpecific.degree_programmes = instId === 'KLN'
      ? ['Bachelor of Science in Physics and Electronics']
      : ['Bachelor of Science in Physics and ICT [BSc (PICT)]'];
    condEntry = 'The respective Faculties of the University to which the student has been admitted will do the selection for a particular degree programme within a University.';
  } else if (cCode === '102') {
    // 2.2.5.1 Engineering Technology (ET)
    courseShared = { degree_programmes: null, duration: null, medium_of_instruction: null };
    if (instId === 'UWU') {
      instSpecific.degree_programmes = ['Bachelor of Engineering Technology Honours in Mechanical Engineering Technology'];
    } else if (instId === 'CMB') {
      instSpecific.degree_programmes = ['Bachelor of Engineering Technology Honours in Instrumentation and Automation'];
    } else {
      instSpecific.degree_programmes = ['Bachelor of Engineering Technology Honours [BET(Hons)]'];
    }
  } else if (cCode === '103') {
    // 2.2.6.1 Biosystems Technology (BST)
    courseShared = { degree_programmes: null, duration: null, medium_of_instruction: null };
    if (instId === 'UJA') {
      instSpecific.degree_programmes = [
        'Bachelor of Biosystems Technology Honours in Commercial Green Farming',
        'Bachelor of Biosystems Technology Honours in Food Production'
      ];
      altPathways = instSpecific.degree_programmes;
    } else if (instId === 'EUSL') {
      instSpecific.degree_programmes = ['Bachelor of Biosystems Technology Honours in Agricultural Technology and Entrepreneurship'];
    } else if (instId === 'SEUSL') {
      instSpecific.degree_programmes = ['Bachelor of Biosystems Technology Honours in Agricultural Technology'];
    } else if (instId === 'CMB') {
      instSpecific.degree_programmes = [
        'Bachelor of Biosystems Technology Honours in Environmental Technology',
        'Bachelor of Biosystems Technology Honours in Agriculture'
      ];
      altPathways = instSpecific.degree_programmes;
    } else {
      instSpecific.degree_programmes = ['Bachelor of Biosystems Technology Honours [BBST(Hons)]'];
    }
  } else if (cCode === '104') {
    // 2.2.7 Information Communication Technology
    courseShared = {
      degree_programmes: ['Bachelor of Information and Communication Technology Honours [BICT(Hons)]'],
      duration: null,
      medium_of_instruction: null
    };
  } else if (cCode === '027') {
    // 2.2.8.2 Management and Information Technology (MIT) at KLN
    courseShared = { degree_programmes: null, duration: null, medium_of_instruction: null };
    instSpecific.degree_programmes = [
      'Bachelor of Science Honours in Management & Information Technology',
      'Bachelor of Science Honours in Information Technology'
    ];
    instSpecific.duration = '4 years';
    altPathways = instSpecific.degree_programmes;
    condEntry = 'At the end of 1st year of study, students are selected to follow either Bachelor of Science Honours in Management and Information Technology or Bachelor of Science Honours in Information Technology based on their preference and performance.';
  } else if (cCode === '064') {
    // 2.2.8.13 Science and Technology at UWU
    instSpecific.specialization_streams = [
      'Food Engineering and Bioprocess Technology [BScHons (Science Tec) (FEBT)]',
      'Materials Science and Technology [BScHons (Science Tec) (MST)]',
      'Mechatronics [BScHons (Science Tec) (Mechatronics)]'
    ];
    condEntry = 'Students will be selected for one of the following specializations at the beginning of the third academic year.';
  } else if (cCode === '076') {
    // 2.2.8.17 Mineral Resources and Technology at UWU
    instSpecific.specialization_streams = [
      'Mineral Processing Technology [BScHons (MRT) (MPT)]',
      'Water Science and Technology [BScHons (MRT) (WST)]'
    ];
    condEntry = 'Students will be selected for one of the following specializations at the beginning of the third academic year.';
  } else if (cCode === '081') {
    // 2.2.8.19 Physical Education (SUSL vs UJA)
    courseShared = { degree_programmes: null, duration: '4 years', medium_of_instruction: ['English'] };
    instSpecific.degree_programmes = instId === 'UJA'
      ? ['Bachelor of Science Honours in Physical Education [BScHons (Physical Ed)]']
      : ['Bachelor of Science Honours in Physical Education'];
  } else if (cCode === '082') {
    // 2.2.8.20 Sports Science & Management (SUSL vs SJP)
    courseShared = { degree_programmes: null, duration: '4 years', medium_of_instruction: ['English'] };
    instSpecific.degree_programmes = instId === 'SJP'
      ? ['Bachelor of Science Honours in Sports Science & Management [BScHons (SSM)]']
      : ['Bachelor of Science Honours in Sports Science & Management'];
  } else if (cCode === '092') {
    // 2.2.8.23 Tourism & Hospitality Management (SUSL vs RUSL)
    courseShared = { degree_programmes: null, duration: '4 years', medium_of_instruction: ['English'] };
    instSpecific.degree_programmes = instId === 'SUSL'
      ? ['Bachelor of Science Honours in Tourism Management', 'Bachelor of Science Honours in Hospitality Management']
      : ['Bachelor of Science Honours in Tourism Management', 'Bachelor of Science Honours in Tourism & Hospitality Management'];
    altPathways = instSpecific.degree_programmes;
  } else if (cCode === '096') {
    // 2.2.8.24 Information Systems (UCSC 3yr + conditional 4yr vs SJP 4yr vs SUSL 4yr)
    courseShared = { degree_programmes: null, duration: null, medium_of_instruction: ['English'] };
    if (instId === 'UCSC') {
      instSpecific.degree_programmes = [
        'Bachelor of Science in Information Systems (03 years)',
        'Bachelor of Science Honours in Information Systems (04 years)'
      ];
      instSpecific.duration = '3 years / 4 years';
      altPathways = instSpecific.degree_programmes;
      condEntry = 'Based on the performance and preference of students, a selected number of students will be able to follow a four year degree course at the UCSC leading to the degree of Bachelor of Science Honours in Information Systems.';
    } else if (instId === 'SJP') {
      instSpecific.degree_programmes = ['Bachelor of Computing Honours in Information Systems [BCompHons (Inf Sys)]'];
      instSpecific.duration = '4 years';
    } else if (instId === 'SUSL') {
      instSpecific.degree_programmes = ['Bachelor of Science Honours in Information Systems [BScHons (Inf Sys)]'];
      instSpecific.duration = '4 years';
    }
  } else if (cCode === '098') {
    // 2.2.8.25 Translation Studies (KLN/SUSL English/Sinhala vs UJA/EUSL English/Tamil)
    courseShared = { degree_programmes: null, duration: '4 years', medium_of_instruction: null };
    if (instId === 'KLN' || instId === 'SUSL') {
      instSpecific.degree_programmes = ['Bachelor of Arts Honours in Translation Studies (English / Sinhala)'];
      instSpecific.medium_of_instruction = ['English', 'Sinhala'];
    } else {
      instSpecific.degree_programmes = ['Bachelor of Arts Honours in Translation Studies (English / Tamil)'];
      instSpecific.medium_of_instruction = ['English', 'Tamil'];
    }
  } else if (cCode === '038') {
    // 2.2.8.28 ICT (RUSL & UOV 3yr + conditional 4yr Honours)
    courseShared = { degree_programmes: null, duration: '3 years / 4 years', medium_of_instruction: ['English'] };
    instSpecific.degree_programmes = instId === 'RUSL'
      ? [
          'Bachelor of Science in Information Technology [BSc (IT)] (03 years)',
          'Bachelor of Science Honours in Information Technology [BScHons (IT)] (04 years)'
        ]
      : [
          'Bachelor of Science in Information Technology (03 years)',
          'Bachelor of Science Honours in Information Technology (04 years)'
        ];
    altPathways = instSpecific.degree_programmes;
    condEntry = 'Based on the performance and preference of students, a selected number of students will be able to offer an extra (fourth) year leading to the Bachelor of Science Honours in Information Technology degree.';
  } else if (cCode === '099') {
    // 2.2.8.29 Software Engineering (KLN/SUSL BScHons vs SJP BCompHons)
    courseShared = { degree_programmes: null, duration: '4 years', medium_of_instruction: ['English'] };
    instSpecific.degree_programmes = instId === 'SJP'
      ? ['Bachelor of Computing Honours in Software Engineering [BCompHons (Soft Eng)]']
      : ['Bachelor of Science Honours in Software Engineering'];
  }

  // For single-university courses where shared extraction found facts, classify them as institution_specific if only 1 university offers the course
  const offeringsForCourseCount = uniCodeRows.filter(u => u.course_code === cCode).length;
  if (offeringsForCourseCount === 1) {
    if (courseShared.degree_programmes && !instSpecific.degree_programmes) {
      instSpecific.degree_programmes = courseShared.degree_programmes;
      courseShared.degree_programmes = null;
    }
    if (courseShared.duration && !instSpecific.duration) {
      instSpecific.duration = courseShared.duration;
      courseShared.duration = null;
    }
    if (courseShared.medium_of_instruction && !instSpecific.medium_of_instruction) {
      instSpecific.medium_of_instruction = courseShared.medium_of_instruction;
      courseShared.medium_of_instruction = null;
    }
    if (shared.specialization_streams && !instSpecific.specialization_streams) {
      instSpecific.specialization_streams = shared.specialization_streams;
    }
  }

  const finalDegrees = instSpecific.degree_programmes || courseShared.degree_programmes || null;
  const finalDuration = instSpecific.duration || courseShared.duration || null;
  const finalMedium = instSpecific.medium_of_instruction || courseShared.medium_of_instruction || null;
  const finalSpecs = instSpecific.specialization_streams || shared.specialization_streams || null;

  if (!altPathways && finalDegrees && finalDegrees.length > 1) {
    altPathways = finalDegrees;
  }

  const secLabel = primarySec ? `Section ${primarySec.section_code}` : 'Section 2.2';
  const factScope = {
    degree_programmes: instSpecific.degree_programmes
      ? 'institution_specific'
      : (courseShared.degree_programmes ? 'course_shared' : 'not_stated'),
    duration: instSpecific.duration
      ? 'institution_specific'
      : (courseShared.duration ? 'course_shared' : 'not_stated'),
    medium_of_instruction: instSpecific.medium_of_instruction
      ? 'institution_specific'
      : (courseShared.medium_of_instruction ? 'course_shared' : 'not_stated')
  };

  const nullReasons = {
    degree_programmes: finalDegrees
      ? null
      : (cCode === '019'
          ? `Not explicitly stated in ${secLabel} (Arts general/special degree titles vary by university faculty rules and are not listed in ${secLabel}).`
          : (['001', '002', '003'].includes(cCode)
              ? `Not explicitly stated in ${secLabel} (${secLabel} lists participating faculties, locations, and 05 Years duration, without printing the formal degree title).`
              : (cCode === '008'
                  ? `Not explicitly stated in ${secLabel} (${secLabel} lists Engineering fields of specialization by university without printing a formal degree title).`
                  : `Not explicitly stated in ${secLabel}.`))),
    duration: finalDuration
      ? null
      : (currCredits
          ? `Duration in years is not stated in ${secLabel}; source specifies credit requirement ("${currCredits}").`
          : (cCode === '015' && (instId === 'SUSL' || instId === 'TRINCO')
              ? `Duration in years is not explicitly stated for ${inst.official_name} in ${secLabel} (unlike RUSL, UOV, and WUSL in the same section).`
              : `Duration in years is not explicitly stated in ${secLabel}.`)),
    medium_of_instruction: finalMedium
      ? null
      : `Medium of instruction is not explicitly stated in ${secLabel}.`
  };

  return {
    degree_programmes: finalDegrees,
    duration: finalDuration,
    curriculum_credits: currCredits,
    medium_of_instruction: finalMedium,
    location_or_faculty: instSpecific.location_or_faculty,
    specialization_streams: finalSpecs,
    alternative_degree_pathways: altPathways,
    conditional_honours_entry: condEntry,
    course_level_shared_facts: courseShared,
    institution_specific_facts: instSpecific,
    fact_scope: factScope,
    null_reasons: nullReasons,
    table_rows: tableInfo.table_rows
  };
}

const offerings = [];
for (const uRow of uniCodeRows) {
  const inst = instBySuffix.get(uRow.uni_code_suffix);
  const ab = annexBByUniCode.get(uRow.uni_code);
  const sp61 = specialProvision61ByUniCode.get(uRow.uni_code) || null;
  const secs = courseToSection2.get(uRow.course_code) || [];
  const primarySec = secs.find(s => {
    if (uRow.uni_code === '068Z' || uRow.uni_code === '069Z' || uRow.uni_code === '071Z' || uRow.uni_code === '085Z') return s.section_code === '2.2.1.1.8';
    if (uRow.uni_code === '068E' || uRow.uni_code === '069E' || uRow.uni_code === '070E') return s.section_code === '2.2.1.1.9';
    if (uRow.uni_code === '068Y' || uRow.uni_code === '069Y' || uRow.uni_code === '071Y' || uRow.uni_code === '072Y') return s.section_code === '2.2.1.1.10';
    if (uRow.uni_code === '068C') return s.section_code === '2.2.1.1.11';
    return !s.section_code.startsWith('2.2.1.1.') || secs.length === 1;
  }) || secs[0];

  const resolved = resolveOfferingDetails(uRow, inst, primarySec);

  offerings.push({
    record_type: 'selectable_unicode_offering',
    is_selectable_unicode_offering: true,
    uni_code: uRow.uni_code,
    course_code: uRow.course_code,
    institution_id: inst.institution_id,
    institution_official_name: inst.official_name,
    course_title_unicode_table: uRow.course_title_unicode_table,
    course_title_annex_b: ab ? ab.course_title_annex_b : null,
    admission_year: '2025/2026',
    examination_year: '2025',
    proposed_intake: ab ? ab.proposed_intake : null,
    degree_programmes: resolved.degree_programmes,
    duration: resolved.duration,
    curriculum_credits: resolved.curriculum_credits,
    medium_of_instruction: resolved.medium_of_instruction,
    location_or_faculty: resolved.location_or_faculty,
    specialization_streams: resolved.specialization_streams,
    alternative_degree_pathways: resolved.alternative_degree_pathways,
    conditional_honours_entry: resolved.conditional_honours_entry,
    course_level_shared_facts: resolved.course_level_shared_facts,
    institution_specific_facts: resolved.institution_specific_facts,
    fact_scope: resolved.fact_scope,
    null_reasons: resolved.null_reasons,
    institution_specific_footnote: uRow.uni_code === '108D'
      ? 'Annex (b) Footnote 1 & Section 2.2.4.10: At University of Kelaniya, Physical Science - ICT degree programme is offered as Bachelor of Science in Physics and Electronics (B.Sc. in Physics and Electronics).'
      : null,
    special_provision_6_1_quotas: sp61
      ? {
          differently_abled_seats: sp61.differently_abled_seats,
          blind_braille_seats: sp61.blind_braille_seats,
          differently_abled_raw: sp61.differently_abled_raw,
          blind_braille_raw: sp61.blind_braille_raw,
          source_line: sp61.source_line_start
        }
      : null,
    section_2_table_rows: resolved.table_rows,
    accreditation: null,
    salaries: null,
    fees: null,
    scholarships: null,
    internships: null,
    careers: null,
    verification_status: 'needs_review',
    source_file: uRow.source_file,
    source_section: uRow.source_section,
    source_table: uRow.source_table,
    source_line_start: uRow.source_line_start,
    source_line_end: uRow.source_line_end,
    printed_page: uRow.printed_page,
    additional_sources: [
      ...(ab ? [{
        source_file: ab.source_file,
        source_section: ab.source_section,
        source_table: ab.source_table,
        source_line_start: ab.source_line_start,
        source_line_end: ab.source_line_end,
        printed_page: ab.printed_page
      }] : []),
      ...(primarySec ? primarySec.segments.map(seg => ({
        source_file: seg.file,
        source_section: `Section ${primarySec.section_code}`,
        source_line_start: seg.line_start,
        source_line_end: seg.line_end,
        printed_page: primarySec.printed_page
      })) : []),
      ...(sp61 ? [{
        source_file: sp61.source_file,
        source_section: sp61.source_section,
        source_table: sp61.source_table,
        source_line_start: sp61.source_line_start,
        source_line_end: sp61.source_line_end,
        printed_page: sp61.printed_page
      }] : [])
    ]
  });
}

// Add the explicit Annex (b) "Additional Intake — Arts (900)" aggregate record (kept separate from selectable Uni-Code offerings)
const additionalIntakeRow = annexBRows.find(r => r.institution_id === 'ADDITIONAL_INTAKE');
if (additionalIntakeRow) {
  offerings.push({
    record_type: 'additional_intake_aggregate',
    is_selectable_unicode_offering: false,
    uni_code: null,
    course_code: '019',
    institution_id: null,
    institution_official_name: 'Additional Intake (Allocated under Section 6.7 / Annex (b))',
    course_title_unicode_table: 'ARTS',
    course_title_annex_b: additionalIntakeRow.course_title_annex_b,
    admission_year: '2025/2026',
    examination_year: '2025',
    proposed_intake: additionalIntakeRow.proposed_intake,
    degree_programmes: null,
    duration: null,
    curriculum_credits: null,
    medium_of_instruction: null,
    location_or_faculty: null,
    specialization_streams: null,
    alternative_degree_pathways: null,
    conditional_honours_entry: null,
    course_level_shared_facts: { degree_programmes: null, duration: null, medium_of_instruction: null },
    institution_specific_facts: { degree_programmes: null, duration: null, medium_of_instruction: null, location_or_faculty: null, specialization_streams: null },
    fact_scope: { degree_programmes: 'not_stated', duration: 'not_stated', medium_of_instruction: 'not_stated' },
    null_reasons: {
      degree_programmes: 'Aggregate Additional Intake quota (Section 6.7 / Annex (b)); not a university-specific selectable Uni-Code offering.',
      duration: 'Aggregate Additional Intake quota (Section 6.7 / Annex (b)); not a university-specific selectable Uni-Code offering.',
      medium_of_instruction: 'Aggregate Additional Intake quota (Section 6.7 / Annex (b)); not a university-specific selectable Uni-Code offering.'
    },
    institution_specific_footnote: 'Annex (b) lists 900 places for Arts under Additional Intake (see also Section 6.7 in ugc9.md lines 173-176 and Annex (a) Arts total 6,983 = 6,083 regular + 900 Additional Intake).',
    special_provision_6_1_quotas: null,
    section_2_table_rows: [],
    accreditation: null,
    salaries: null,
    fees: null,
    scholarships: null,
    internships: null,
    careers: null,
    verification_status: 'needs_review',
    source_file: additionalIntakeRow.source_file,
    source_section: additionalIntakeRow.source_section,
    source_table: additionalIntakeRow.source_table,
    source_line_start: additionalIntakeRow.source_line_start,
    source_line_end: additionalIntakeRow.source_line_end,
    printed_page: null,
    additional_sources: [
      {
        source_file: 'ugc9.md',
        source_section: 'Section 6.7 Additional Intake',
        source_line_start: 173,
        source_line_end: 176,
        printed_page: 170
      }
    ]
  });
}

fs.writeFileSync(path.join(OUT_DIR, 'offerings.json'), JSON.stringify(offerings, null, 2) + '\n', 'utf8');
console.log(`Wrote offerings.json (${offerings.length} records: 255 selectable Uni-Codes + 1 Additional Intake Arts aggregate record).`);

// ---------------------------------------------------------------------------
// 9. Build eligibility.json
// ---------------------------------------------------------------------------
// Parse Section 5 O/L requirements table (ugc8.md lines 185-225)
const ugc8Lines = filesLines.get('ugc8.md');
const olTableByCourseCode = new Map();
for (let i = 187; i <= 219; i++) {
  const line = ugc8Lines[i] || '';
  if (!line.trim().startsWith('|')) continue;
  const cols = line.trim().slice(1, -1).split('|').map(c => c.trim());
  if (cols.length < 7) continue;
  const uniCodesRaw = cols[0];
  const courseNameRaw = cols[1];
  const sinLang = cols[2] || null;
  const engLang = cols[3] || null;
  const maths = cols[4] || null;
  const science = cols[5] || null;
  const tamLang = cols[6] || null;
  const uCodes = [...uniCodesRaw.matchAll(/([0-9]{3}[A-Z])/g)].map(m => m[1]);
  const cCode = uCodes[0] ? uCodes[0].slice(0, 3) : null;
  if (cCode) {
    olTableByCourseCode.set(cCode, {
      uni_codes_listed: uCodes,
      course_title_in_table: courseNameRaw,
      ordinary_level_grades: {
        sinhala_language_and_literature: sinLang,
        english: engLang,
        mathematics: maths,
        science: science,
        tamil_language_and_literature: tamLang,
        asterisk_note: (sinLang && sinLang.includes('*')) || (tamLang && tamLang.includes('*'))
          ? 'It is sufficient to obtain relevant grades in only one of these two subjects (Sinhala Language & Lit. OR Tamil Language & Lit.) in the G.C.E. (Ordinary Level) Examination.'
          : null,
        nursing_physical_note: courseNameRaw.includes('Note 1')
          ? "Note 1: The candidate should be a minimum of 4' 10\" in height and should not have any kind of deformity in order to be eligible for the course of study in Nursing."
          : null
      },
      source_file: 'ugc8.md',
      source_section: 'Section 5 — G.C.E. (Ordinary Level) Examination Requirements',
      source_table: 'G.C.E. (Ordinary Level) Examination Requirements Table',
      source_line_start: i + 1,
      source_line_end: i + 1,
      printed_page: null
    });
  }
}
console.log(`Parsed ${olTableByCourseCode.size} courses from Section 5 G.C.E. (O/L) Requirements table.`);

// Parse Section 5 Practical/Aptitude Test table (ugc8.md lines 232-258)
const aptitudeTableByCourseCode = new Map();
for (let i = 233; i <= 258; i++) {
  const line = ugc8Lines[i] || '';
  const m = line.match(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*\*\*([0-9]{3}[A-Z])\*\*\s*\|$/);
  if (m) {
    const uCode = m[3].trim();
    const cCode = uCode.slice(0, 3);
    if (!aptitudeTableByCourseCode.has(cCode)) {
      aptitudeTableByCourseCode.set(cCode, []);
    }
    aptitudeTableByCourseCode.get(cCode).push({
      uni_code: uCode,
      course_title_in_table: m[1].trim(),
      institution_in_table: m[2].trim(),
      source_file: 'ugc8.md',
      source_section: 'Section 5 — Requirement to Pass the Practical/Aptitude Test',
      source_table: 'Requirement to Pass the Practical/Aptitude Test Table',
      source_line_start: i + 1,
      source_line_end: i + 1,
      printed_page: null
    });
  }
}
console.log(`Parsed ${aptitudeTableByCourseCode.size} distinct course codes from Section 5 Practical/Aptitude Test table.`);

// Known simple fixed 3-subject A/L combinations that are 100% machine-evaluable when no aptitude/physical/prose-only rules exist
const exactFixedAlSubjectRulesByCourse = new Map([
  ['001', { operator: 'AND', required_subjects: ['Biology', 'Chemistry', 'Physics'], minimum_grades_distribution: ['C', 'C', 'S'] }],
  ['002', { operator: 'AND', required_subjects: ['Chemistry', 'Physics', 'Biology'], minimum_grades_distribution: ['S', 'S', 'S'] }],
  ['003', { operator: 'AND', required_subjects: ['Chemistry', 'Physics', 'Biology'], minimum_grades_distribution: ['S', 'S', 'S'] }],
  ['035', { operator: 'AND', required_subjects: ['Chemistry', 'Physics', 'Biology'], minimum_grades_distribution: ['S', 'S', 'S'] }],
  ['032', { operator: 'AND', required_subjects: ['Chemistry', 'Physics', 'Biology'], minimum_grades_distribution: ['S', 'S', 'S'] }],
  ['033', { operator: 'AND', required_subjects: ['Chemistry', 'Physics', 'Biology'], minimum_grades_distribution: ['S', 'S', 'S'] }],
  ['036', { operator: 'AND', required_subjects: ['Chemistry', 'Physics', 'Biology'], minimum_grades_distribution: ['S', 'S', 'S'] }],
  ['051', { operator: 'AND', required_subjects: ['Chemistry', 'Physics', 'Biology'], subject_minimum_grades: { Chemistry: 'C', Physics: 'S', Biology: 'S' } }],
  ['052', { operator: 'AND', required_subjects: ['Chemistry', 'Physics', 'Biology'], minimum_grades_distribution: ['S', 'S', 'S'] }],
  ['053', { operator: 'AND', required_subjects: ['Chemistry', 'Physics', 'Biology'], minimum_grades_distribution: ['S', 'S', 'S'] }],
  ['058', { operator: 'AND', required_subjects: ['Chemistry', 'Physics', 'Biology'], minimum_grades_distribution: ['S', 'S', 'S'] }],
  ['062', { operator: 'AND', required_subjects: ['Chemistry', 'Physics', 'Biology'], minimum_grades_distribution: ['S', 'S', 'S'] }],
  ['115', { operator: 'AND', required_subjects: ['Physics', 'Biology', 'Chemistry'], minimum_grades_distribution: ['S', 'S', 'S'] }],
  ['116', { operator: 'AND', required_subjects: ['Chemistry', 'Physics', 'Biology'], minimum_grades_distribution: ['S', 'S', 'S'] }],
  ['138', { operator: 'AND', required_subjects: ['Physics', 'Biology', 'Chemistry'], minimum_grades_distribution: ['S', 'S', 'S'] }],
  ['083', { operator: 'AND', required_subjects: ['Biology', 'Physics', 'Chemistry'], minimum_grades_distribution: ['S', 'S', 'S'] }],
  ['008', { operator: 'AND', required_subjects: ['Chemistry', 'Combined Mathematics', 'Physics'], minimum_grades_distribution: ['S', 'S', 'S'] }],
  ['009', { operator: 'AND', required_subjects: ['Chemistry', 'Combined Mathematics', 'Physics'], minimum_grades_distribution: ['S', 'S', 'S'] }],
  ['010', { operator: 'AND', required_subjects: ['Chemistry', 'Combined Mathematics', 'Physics'], minimum_grades_distribution: ['S', 'S', 'S'] }],
  ['057', { operator: 'AND', required_subjects: ['Chemistry', 'Combined Mathematics', 'Physics'], minimum_grades_distribution: ['S', 'S', 'S'] }],
  ['108', { operator: 'AND', required_subjects: ['Combined Mathematics', 'Physics', 'Information & Communication Technology'], minimum_grades_distribution: ['S', 'S', 'S'] }],
  ['143', { operator: 'AND', required_subjects: ['Combined Mathematics', 'Physics', 'Chemistry'], minimum_grades_distribution: ['S', 'S', 'S'] }],
  ['104', { operator: 'AND', required_subjects: ['Information & Communication Technology (ICT)', 'Science for Technology (SFT)'], third_subject_one_of: ['Engineering Technology (ET)', 'Biosystems Technology (BST)'], minimum_grades_distribution: ['S', 'S', 'S'] }],
  ['079', { operator: 'ANY_THREE_APPROVED_AL_SUBJECTS', minimum_grades_distribution: ['S', 'S', 'S'] }],
  ['114', { operator: 'ANY_THREE_APPROVED_AL_SUBJECTS', minimum_grades_distribution: ['S', 'S', 'S'] }],
  ['132', { operator: 'ANY_THREE_APPROVED_AL_SUBJECTS', minimum_grades_distribution: ['S', 'S', 'S'] }],
  ['134', { operator: 'ANY_THREE_APPROVED_AL_SUBJECTS', minimum_grades_distribution: ['S', 'S', 'S'] }],
  ['137', { operator: 'ANY_THREE_APPROVED_AL_SUBJECTS', minimum_grades_distribution: ['S', 'S', 'S'] }]
]);

// Helper to parse structured A/L & O/L conditions from Section 2.2 text and Section 5 tables
function buildStructuredConditions(courseCode, secs, olEntry, aptEntries) {
  const fullText = secs.map(s => s.full_text).join('\n\n');
  const lines = fullText.split(/\r?\n/);

  // Extract explicit Minimum Eligibility Requirements paragraphs
  const minReqParagraphs = [];
  let capturing = false;
  for (const l of lines) {
    const t = l.trim();
    if (
      /^\*\*Minimum Eligibility Requirements/i.test(t) ||
      /^Minimum Eligibility Requirements/i.test(t) ||
      /^\*\*Admission Requirements/i.test(t) ||
      /^\*\*Guidance for selection of subjects/i.test(t)
    ) {
      capturing = true;
      minReqParagraphs.push(t);
    } else if (capturing) {
      if (t.startsWith('| University') || t.startsWith('**Note:') || t.startsWith('> **Note') || /^#{2,4}\s+/.test(t)) {
        if (/^#{2,4}\s+/.test(t)) {
          capturing = false;
        } else {
          minReqParagraphs.push(t);
        }
      } else if (t.length > 0) {
        minReqParagraphs.push(t);
      }
    }
  }

  // Check for O/L mentions in Section 2.2 text
  const olMentionsInSec2 = lines.filter(l => /Ordinary Level|G\.C\.E\.\s*\(O\/L\)/i.test(l)).map(l => l.trim());

  // Check for Aptitude/Practical test mentions in Section 2.2 text, excluding the misplaced duplicate Sports Science blockquote in 2.2.8.22 (091)
  const aptitudeMentionsInSec2 = lines
    .filter(l => {
      if (courseCode === '091' && /Sports Science/i.test(l)) return false;
      return /aptitude test|practical test/i.test(l);
    })
    .map(l => l.trim());

  const hasAptitudeInSec2 = aptitudeMentionsInSec2.length > 0;
  const hasAptitudeInSec5 = Boolean(aptEntries && aptEntries.length > 0);
  // Note: No course in Section 2.2 contains an explicit sentence stating "no aptitude test is required";
  // courses either explicitly require a Practical/Aptitude test ("required") or make no mention of one ("not_stated").
  const aptitudeStatus = (hasAptitudeInSec2 || hasAptitudeInSec5) ? 'required' : 'not_stated';

  // Check for future effective year changes (e.g. 2028/2029 in 096 Information Systems, ugc5.md line 720)
  const effectiveYearChanges = lines
    .filter(l => /With effect from the Academic Year|from the \d{4}\/\d{4} academic year onwards/i.test(l))
    .map(l => l.trim());

  // Classify summary-table condensations (where Section 2.2 includes an alternative A/L pass waiver not shown in the condensed Section 5 O/L table)
  const summaryTableCondensations = [];
  if (['023', '024', '097'].includes(courseCode)) {
    summaryTableCondensations.push(
      'Section 2.2 states that the G.C.E. (O/L) Credit Pass (C) in Mathematics is satisfied alternatively by obtaining at least an Ordinary Pass (S) in Mathematics at the G.C.E. (A/L) Examination; the condensed Section 5 O/L summary table (ugc8.md) lists only the O/L "C" grade column.'
    );
  }
  if (courseCode === '098') {
    summaryTableCondensations.push(
      'Section 2.2.8.25 (ugc5.md lines 734-738) states that the G.C.E. (O/L) Very Good Passes (B) in Sinhala/Tamil and English are satisfied alternatively by obtaining at least a Simple Pass (S) in English Language at the G.C.E. (A/L) Examination; the condensed Section 5 O/L summary table (ugc8.md line 211) lists only the O/L "B*"/"B" grade columns.'
    );
  }

  // Separate machine-evaluable rules from prose-only conditions
  const fixedAlRule = exactFixedAlSubjectRulesByCourse.get(courseCode) || null;
  const proseOnlyConditions = [];
  const manualReviewReasons = [];

  if (!fixedAlRule) {
    proseOnlyConditions.push({
      type: 'complex_al_subject_basket_or_combination_rule',
      description: 'Section 2.2 specifies multi-option subject combinations, subject baskets, stream quotas, or minimum subject count rules in prose that require full subject-basket AST encoding before automated eligibility decisions.',
      verbatim_excerpt: minReqParagraphs.length > 0 ? minReqParagraphs.join('\n') : fullText.trim()
    });
    manualReviewReasons.push('Complex A/L subject combination, basket, or stream-quota rules in Section 2.2 prose.');
  }

  if (aptitudeStatus === 'required') {
    proseOnlyConditions.push({
      type: 'practical_or_aptitude_test_pass_required',
      description: 'Candidate must pass the university-conducted Practical / Aptitude Test in addition to academic grades.',
      section_5_table_entries: aptEntries || [],
      section_2_clauses: aptitudeMentionsInSec2
    });
    manualReviewReasons.push('Requires passing a university-conducted Practical / Aptitude Test.');
  }

  if (courseCode === '037') {
    proseOnlyConditions.push({
      type: 'mandatory_physical_eligibility_condition',
      description: "Mandatory Nursing Council physical requirement: minimum height of 4' 10\" and no deformity (Section 2.2.3.17, ugc3.md line 607 & Section 5 Note 1, ugc8.md line 222)."
    });
    manualReviewReasons.push("Requires mandatory physical eligibility verification (minimum height 4' 10\" and no deformity).");
  }

  if (summaryTableCondensations.length > 0) {
    proseOnlyConditions.push({
      type: 'al_pass_waiver_for_ol_requirement',
      description: summaryTableCondensations.join(' ')
    });
    manualReviewReasons.push('Includes an A/L subject pass waiver alternative for an O/L grade requirement.');
  }

  if (effectiveYearChanges.length > 0) {
    manualReviewReasons.push('Contains a future academic year rule change note (2028/2029 onwards).');
  }

  const autoDecisionSafe = proseOnlyConditions.length === 0;
  const evaluationReadiness = autoDecisionSafe ? 'machine_evaluable' : 'requires_manual_review';

  return {
    general_al_rule_ref: 'At least Simple Passes (S) in all three approved G.C.E. (A/L) subjects at one and the same sitting (within a maximum of three attempts) and a minimum mark of 30% for the Common General Paper (Section 1.2, ugc1.md lines 100-109).',
    evaluation_readiness: evaluationReadiness,
    auto_decision_safe: autoDecisionSafe,
    manual_review_reasons: manualReviewReasons,
    machine_evaluable_conditions: {
      general_admission_rule_id: 'GENERAL-ADMISSION-2025-2026',
      al_fixed_subject_rule: fixedAlRule,
      ol_minimum_grades: olEntry ? olEntry.ordinary_level_grades : null,
      is_complete_for_auto_decision: autoDecisionSafe
    },
    prose_only_conditions: proseOnlyConditions,
    al_requirement_summary: minReqParagraphs.length > 0 ? minReqParagraphs.join('\n') : fullText.trim(),
    ol_requirement_from_section_5_table: olEntry ? olEntry.ordinary_level_grades : null,
    ol_clauses_in_section_2_text: olMentionsInSec2,
    aptitude_or_practical_test: {
      status: aptitudeStatus,
      required_in_section_2: hasAptitudeInSec2,
      listed_in_section_5_table: hasAptitudeInSec5,
      uni_codes_in_section_5_table: aptEntries ? aptEntries.map(a => a.uni_code) : [],
      section_5_table_entries: aptEntries || [],
      section_2_clauses: aptitudeMentionsInSec2
    },
    effective_year: '2025/2026',
    future_effective_year_changes: effectiveYearChanges.length > 0
      ? effectiveYearChanges.map(text => ({
          effective_academic_year: (text.match(/(\d{4}\/\d{4})/) || [null, 'future'])[1],
          verbatim_rule: text
        }))
      : [],
    summary_table_condensations: summaryTableCondensations,
    cross_section_discrepancies: [],
    requires_manual_review: !autoDecisionSafe
  };
}

const eligibilityRecords = [
  {
    record_id: 'GENERAL-ADMISSION-2025-2026',
    record_type: 'general_admission_criteria',
    course_code: null,
    official_course_title: 'General Admission Criteria for All Undergraduate Courses (Academic Year 2025/2026)',
    uni_codes: [],
    admission_year: '2025/2026',
    examination_year: '2025',
    effective_year: '2025/2026',
    evaluation_readiness: 'requires_manual_review',
    auto_decision_safe: false,
    conditions: {
      operator: 'AND',
      evaluation_readiness: 'requires_manual_review',
      auto_decision_safe: false,
      machine_evaluable_rules: [
        {
          rule_id: 'AL_THREE_SUBJECTS_SINGLE_SITTING',
          description: 'At least Simple Passes (S) in all three (03) approved subjects at the G.C.E. (Advanced Level) Examination in year 2025 held in Sri Lanka, at one and the same sitting, within a maximum of three attempts (Section 1.2(a), ugc1.md lines 102-103).'
        },
        {
          rule_id: 'COMMON_GENERAL_PAPER_30_PERCENT',
          description: 'A mark of not less than 30% for the Common General Paper (candidate may re-use a 30%+ pass from a previous sitting within three attempts, or sit the Common General Paper again in a subsequent attempt if only that requirement was missed; Section 1.2(b), ugc1.md lines 105-109).'
        }
      ],
      prose_only_disqualifications: 'Refer to Section 1.7 (ugc1.md lines 188-223) for the 9 categories of candidates who are NOT eligible for admission to a course of study in a university or higher educational institute.'
    },
    verbatim_text: ugc1Lines.slice(99, 223).join('\n'),
    requires_manual_review: true,
    verification_status: 'needs_review',
    source_file: 'ugc1.md',
    source_section: 'Sections 1.2, 1.3, 1.4, 1.5, 1.6 & 1.7',
    source_table: null,
    source_line_start: 100,
    source_line_end: 223,
    printed_page: null
  }
];

for (const a of annexACourses) {
  const secs = courseToSection2.get(a.course_code) || [];
  // Prefer the dedicated subsection when a course is also mentioned in a shared sub-block
  const primarySec = secs.find(s => !s.section_code.startsWith('2.2.1.1.')) || secs[0];
  const primarySeg = primarySec.segments[0];
  const lastSeg = primarySec.segments[primarySec.segments.length - 1];
  const olEntry = olTableByCourseCode.get(a.course_code) || null;
  const aptEntries = aptitudeTableByCourseCode.get(a.course_code) || null;
  const structured = buildStructuredConditions(a.course_code, secs, olEntry, aptEntries);

  eligibilityRecords.push({
    record_id: `COURSE-${a.course_code}-2025-2026`,
    record_type: 'course_eligibility',
    course_code: a.course_code,
    official_course_title: a.title_annex_a.replace(/\s*\(including Additional Intake\)$/i, ''),
    uni_codes: unicodeListByCourse.get(a.course_code) || [],
    admission_year: '2025/2026',
    examination_year: '2025',
    effective_year: structured.effective_year,
    stream_section: primarySec.section_code,
    stream_category: getStreamCategory(primarySec.section_code),
    evaluation_readiness: structured.evaluation_readiness,
    auto_decision_safe: structured.auto_decision_safe,
    conditions: structured,
    verbatim_section_2_text: secs.map(s => s.full_text).join('\n\n---\n\n'),
    requires_manual_review: structured.requires_manual_review,
    verification_status: 'needs_review',
    source_file: primarySeg.file,
    source_section: secs.map(s => `Section ${s.section_code}`).join(', '),
    source_table: olEntry ? olEntry.source_table : (aptEntries ? aptEntries[0].source_table : null),
    source_line_start: primarySeg.line_start,
    source_line_end: primarySeg.line_end,
    printed_page: primarySec.printed_page,
    additional_sources: [
      ...secs.flatMap(sec => sec.segments.map(seg => ({
        source_file: seg.file,
        source_section: `Section ${sec.section_code}`,
        source_line_start: seg.line_start,
        source_line_end: seg.line_end,
        printed_page: sec.printed_page
      }))),
      ...(olEntry ? [{
        source_file: olEntry.source_file,
        source_section: olEntry.source_section,
        source_table: olEntry.source_table,
        source_line_start: olEntry.source_line_start,
        source_line_end: olEntry.source_line_end,
        printed_page: olEntry.printed_page
      }] : []),
      ...(aptEntries ? aptEntries.map(ap => ({
        source_file: ap.source_file,
        source_section: ap.source_section,
        source_table: ap.source_table,
        source_line_start: ap.source_line_start,
        source_line_end: ap.source_line_end,
        printed_page: ap.printed_page
      })) : [])
    ]
  });
}

fs.writeFileSync(path.join(OUT_DIR, 'eligibility.json'), JSON.stringify(eligibilityRecords, null, 2) + '\n', 'utf8');
console.log(`Wrote eligibility.json (${eligibilityRecords.length} records: 1 general + 121 courses).`);

// ---------------------------------------------------------------------------
// 10. Build historical-cutoffs-2024-2025.json from Section 9 (ugc9.md lines 220-519)
// ---------------------------------------------------------------------------
const section9Tables = [];
let currentTable9 = null;

for (let i = 219; i < 520; i++) {
  const line = ugc9Lines[i] || '';
  const tm = line.match(/^####\s+(Table\s+9\.\d+)\s*\(Handbook Page\s+(\d+)\)/i);
  if (tm) {
    if (currentTable9) section9Tables.push(currentTable9);
    currentTable9 = {
      table_id: tm[1].trim(),
      printed_page: Number(tm[2]),
      line_start: i + 1,
      line_end: i + 1,
      headers: [],
      rows: []
    };
    continue;
  }
  if (!currentTable9) continue;
  const t = line.trim();
  if (t.startsWith('|') && t.endsWith('|')) {
    currentTable9.line_end = i + 1;
    const cols = t.slice(1, -1).split('|').map(c => c.trim());
    if (cols[0] === 'District') {
      currentTable9.headers = cols;
    } else if (cols.every(c => /^:?-{2,}:?$/.test(c))) {
      continue;
    } else {
      currentTable9.rows.push({
        line_number: i + 1,
        district: cols[0].replace(/\*\*/g, '').trim(),
        cells: cols.slice(1)
      });
    }
  }
}
if (currentTable9) section9Tables.push(currentTable9);

console.log(`Parsed ${section9Tables.length} Section 9 cutoff tables.`);

// Helper to map Section 9 column header to 2025/2026 Uni-Code (without forcing ambiguous mappings)
const suspendedGwuimHeaderNames = new Set([
  'SERVICE MANAGEMENT',
  'INDIGENOUS MEDICINAL RESOURCES',
  'HEALTH INFORMATION AND COMMUNICATION TECHNOLOGY',
  'HEALTH TOURISM AND HOSPITALITY MANAGEMENT',
  'BIOMEDICAL TECHNOLOGY',
  'INDIGENOUS PHARMACEUTICAL TECHNOLOGY',
  'YOGA AND PARAPSYCHOLOGY',
  'SOCIAL STUDIES IN INDIGENOUS KNOWLEDGE'
]);

function mapSection9HeaderToUniCode(rawHeader) {
  // Parse markers * and #
  const allIslandMerit = rawHeader.includes('*');
  const practicalOrAptitudeTest = rawHeader.includes('#');

  // Extract university in last parentheses
  const lastParenMatch = rawHeader.match(/^(.*)\(([^()]+)\)\s*$/);
  if (!lastParenMatch) {
    throw new Error(`Cannot parse university from Section 9 header: ${rawHeader}`);
  }
  let coursePart = lastParenMatch[1].trim();
  const uniPart = lastParenMatch[2].trim();

  // Check for stream/category qualifier in brackets or parentheses inside coursePart
  let streamOrCategoryQualifier = null;
  const bracketMatch = coursePart.match(/\[([^\]]+)\]/);
  if (bracketMatch) {
    streamOrCategoryQualifier = bracketMatch[1].trim();
    coursePart = coursePart.replace(/\[[^\]]+\]/, '').trim();
  }
  const mitStreamMatch = coursePart.match(/\((BIO SCIENCE STREAM|OTHER STREAM)\)$/i);
  if (mitStreamMatch) {
    streamOrCategoryQualifier = mitStreamMatch[1].trim();
    coursePart = coursePart.replace(/\((BIO SCIENCE STREAM|OTHER STREAM)\)$/i, '').trim();
  }

  // Strip * and # and category suffixes "- A" / "- B" for base course title comparison
  const cleanCoursePart = coursePart
    .replace(/[*#]/g, '')
    .replace(/\s+-\s+[AB]\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Identify institution_id from uniPart
  let instId = null;
  const uLower = uniPart.toLowerCase();
  if (uLower === 'university of colombo') instId = 'CMB';
  else if (uLower === 'university of peradeniya') instId = 'PDN';
  else if (uLower.includes('jayewardenepura')) instId = 'SJP';
  else if (uLower === 'university of kelaniya') instId = 'KLN';
  else if (uLower === 'university of moratuwa') instId = 'MRT';
  else if (uLower === 'university of jaffna') instId = 'UJA';
  else if (uLower === 'university of ruhuna') instId = 'RUH';
  else if (uLower === 'eastern university, sri lanka') instId = 'EUSL';
  else if (uLower === 'south eastern university of sri lanka') instId = 'SEUSL';
  else if (uLower === 'rajarata university of sri lanka') instId = 'RUSL';
  else if (uLower === 'sabaragamuwa university of sri lanka') instId = 'SUSL';
  else if (uLower === 'wayamba university of sri lanka') instId = 'WUSL';
  else if (uLower === 'uva wellassa university of sri lanka') instId = 'UWU';
  else if (uLower.includes('visual & performing arts')) instId = 'UVPA';
  else if (uLower.includes('wickramarachchi')) instId = 'GWUIM';
  else if (uLower.includes('vavuniya')) instId = 'UOV';
  else if (uLower.includes('sri palee') || uLower.includes('sripalee')) instId = 'SP';
  else if (uLower.includes('trincomalee')) instId = 'TRINCO';
  else if (uLower.includes('colombo school of computing')) instId = 'UCSC';
  else if (uLower.includes('vipulananda')) instId = 'SVIAS';

  if (!instId) {
    throw new Error(`Unknown institution "${uniPart}" in Section 9 header: ${rawHeader}`);
  }

  // Check if this is one of the 8 suspended GWUIM courses
  if (instId === 'GWUIM' && suspendedGwuimHeaderNames.has(cleanCoursePart.toUpperCase())) {
    return {
      uni_code_2025_2026: null,
      course_code_2025_2026: null,
      institution_id: instId,
      institution_name_in_header: uniPart,
      course_title_in_header: cleanCoursePart,
      stream_or_category_qualifier: streamOrCategoryQualifier,
      all_island_merit_marker: allIslandMerit,
      practical_or_aptitude_marker: practicalOrAptitudeTest,
      mapping_status: 'unmapped_suspended_in_2025_2026',
      mapping_note: 'Course offered in 2024/2025 at GWUIM; temporarily suspended for 2025/2026 due to curriculum review (no 2025/2026 Uni-Code assigned).'
    };
  }

  // Check for the Kelaniya Sports Science title difference in Table 9.8:
  // In Table 9.8: "SPORTS SCIENCE & MANAGEMENT # (University of Kelaniya)" -> in 2025/2026 Kelaniya offers "141D" ("SPORTS SCIENCE")
  if (instId === 'KLN' && cleanCoursePart.toUpperCase() === 'SPORTS SCIENCE & MANAGEMENT') {
    return {
      uni_code_2025_2026: null,
      candidate_uni_code_2025_2026: '141D',
      course_code_2025_2026: '141',
      institution_id: instId,
      institution_name_in_header: uniPart,
      course_title_in_header: cleanCoursePart,
      stream_or_category_qualifier: streamOrCategoryQualifier,
      all_island_merit_marker: allIslandMerit,
      practical_or_aptitude_marker: practicalOrAptitudeTest,
      mapping_status: 'title_changed_between_2024_2025_and_2025_2026',
      mapping_note: 'In Section 9 (2024/2025), University of Kelaniya is listed as "SPORTS SCIENCE & MANAGEMENT # (University of Kelaniya)", whereas in 2025/2026 University of Kelaniya is assigned Course Code 141 / Uni-Code 141D under the title "SPORTS SCIENCE" (while 082C SJP and 082L SUSL remain "SPORTS SCIENCE & MANAGEMENT"). Reported as title discrepancy rather than silently merged.'
    };
  }

  // Find matching 2025/2026 Uni-Code at this institution
  const candidates = uniCodeRows.filter(u => {
    const inst = instBySuffix.get(u.uni_code_suffix);
    return inst && inst.institution_id === instId;
  });

  const normClean = normalizeCourseNameForMatch(cleanCoursePart.replace(/\s*\/\s*/g, ' - '));
  const matched = candidates.find(u => normalizeCourseNameForMatch(u.course_title_unicode_table) === normClean);

  if (!matched) {
    throw new Error(`Could not map Section 9 column header "${rawHeader}" (clean: "${cleanCoursePart}", norm: "${normClean}") at ${instId}`);
  }

  const isMultiColumnSplit = Boolean(streamOrCategoryQualifier);
  return {
    uni_code_2025_2026: matched.uni_code,
    course_code_2025_2026: matched.course_code,
    institution_id: instId,
    institution_name_in_header: uniPart,
    course_title_in_header: cleanCoursePart,
    stream_or_category_qualifier: streamOrCategoryQualifier,
    all_island_merit_marker: allIslandMerit,
    practical_or_aptitude_marker: practicalOrAptitudeTest,
    mapping_status: isMultiColumnSplit ? 'mapped_with_stream_or_category_split' : 'exact_1_to_1_match',
    mapping_note: isMultiColumnSplit
      ? `One of two stream/category-specific 2024/2025 cutoff columns for Uni-Code ${matched.uni_code} (${streamOrCategoryQualifier}).`
      : null
  };
}

const cutoffColumns = [];
let totalCutoffCells = 0;
let totalNumericCells = 0;
let totalNqcCells = 0;

for (const tbl of section9Tables) {
  const courseHeaders = tbl.headers.slice(1);
  for (let colIdx = 0; colIdx < courseHeaders.length; colIdx++) {
    const rawHeader = courseHeaders[colIdx];
    const mapped = mapSection9HeaderToUniCode(rawHeader);
    const districtCutoffs = [];

    for (const row of tbl.rows) {
      const rawCell = row.cells[colIdx];
      const isNqc = rawCell === 'NQC';
      const numVal = isNqc ? null : Number(rawCell);
      if (!isNqc && Number.isNaN(numVal)) {
        throw new Error(`Invalid cutoff cell "${rawCell}" in ${tbl.table_id} row ${row.district} col ${rawHeader}`);
      }
      totalCutoffCells++;
      if (isNqc) totalNqcCells++;
      else totalNumericCells++;

      districtCutoffs.push({
        district: row.district,
        raw_value: rawCell,
        z_score: numVal,
        is_nqc: isNqc,
        source_line: row.line_number
      });
    }

    cutoffColumns.push({
      column_id: `${tbl.table_id.replace(/\s+/g, '_')}_COL_${String(colIdx + 1).padStart(2, '0')}`,
      admission_year: '2024/2025',
      examination_year: '2024 (after re-scrutiny)',
      raw_column_header: rawHeader,
      ...mapped,
      district_count: districtCutoffs.length,
      districts: districtCutoffs,
      verification_status: 'needs_review',
      source_file: 'ugc9.md',
      source_section: 'Section 9 — ‘Cut-off’ Marks of the Previous Year (Academic Year 2024/2025)',
      source_table: tbl.table_id,
      source_line_start: tbl.line_start,
      source_line_end: tbl.line_end,
      printed_page: tbl.printed_page
    });
  }
}

const historicalCutoffsPayload = {
  dataset_title: 'University Admission — Academic Year 2024/2025 Minimum "Z" Scores by District',
  admission_year: '2024/2025',
  examination_basis: 'Based on the results of the G.C.E. (Advanced Level) Examination 2024 (after re-scrutiny)',
  handbook_edition: '2025/2026 UGC Student Handbook — Section 9 (Handbook Pages 174–183)',
  legend: {
    '*': 'Selection 100% on an all Island Merit Basis',
    '#': 'Courses of Study for which the subject oriented Practical Tests / Aptitude Tests were conducted.',
    'NQC': 'No Qualified Candidates (1. District quota filled; 2. University places filled by higher Z-scores from other districts; or 3. No candidates satisfied minimum requirements from that district).'
  },
  summary_counts: {
    tables_count: section9Tables.length,
    total_course_university_columns: cutoffColumns.length,
    districts_per_column: 25,
    total_district_cutoff_cells: totalCutoffCells,
    numeric_z_score_cells: totalNumericCells,
    nqc_cells: totalNqcCells
  },
  verification_status: 'needs_review',
  source_file: 'ugc9.md',
  source_section: 'Section 9',
  source_line_start: 207,
  source_line_end: 528,
  printed_page_range: '174-183',
  columns: cutoffColumns
};

fs.writeFileSync(path.join(OUT_DIR, 'historical-cutoffs-2024-2025.json'), JSON.stringify(historicalCutoffsPayload, null, 2) + '\n', 'utf8');
console.log(`Wrote historical-cutoffs-2024-2025.json (${cutoffColumns.length} columns, ${totalCutoffCells} district cells: ${totalNumericCells} numeric + ${totalNqcCells} NQC).`);

// ---------------------------------------------------------------------------
// 11. Build source-inventory.md
// ---------------------------------------------------------------------------
const sourceInventoryMd = `# UGC 2025/2026 Source Inventory (\`source-inventory.md\`)

> **Verification Status:** \`needs_review\` (Extracted from supplied Markdown files only; not independently verified against printed PDF).

---

## 1. File-by-File Inventory & Admission Year Mapping

| File | Total Lines | Wrapper Fence Present? | Sections Covered | Key Tables & Content | Printed Pages Explicitly Stated | Admission Year(s) & Exam Year(s) |
| :--- | ---: | :--- | :--- | :--- | :--- | :--- |
| \`ugc1.md\` | 570 | Yes (lines 1–3, 570) | Abbreviations; **Section 1** (\`1.1\`–\`1.9\`); **Section 2** TOC & \`2.1\` (\`2.1.1\`–\`2.1.6\`) | Abbreviations list (lines 6–27); Section 2 Table of Contents (lines 245–377); Arts Subject Baskets 01–04 & Technology Subject Lists (lines 384–569) | TOC maps Section 2 (\`2.1\`–\`2.2.8.43\`) to printed pages \`19\`–\`109\` | Admission Year: **2025/2026**; G.C.E. (A/L) Exam Year: **2025** |
| \`ugc2.md\` | 789 | Yes (lines 1–3, 789) | **Section 2.1.7**; **Section 2.2** intro; **Section 2.2.1** Arts Stream (\`2.2.1.1\` including sub-courses \`1\`–\`11\`, \`2.2.1.2\`–\`2.2.1.3\`); **Section 2.2.2** Commerce Stream (\`2.2.2.1\`–\`2.2.2.4\` intro & shared rules) | District/All-Island merit quota rules (\`2.1.7\`); Arts (\`019\`), Mass Media (\`020\`), Performing Arts (\`041\`), Arts (SAB) (\`021\`), Communication Studies (\`029\`), Peace & Conflict Resolution (\`031\`), Islamic Studies (\`063\`), Arabic Language (\`084\`), TESL (\`105\`), Music (\`068\`), Dance (\`069\`), Art & Design (\`070\`), Drama & Theatre (\`071\`), Visual & Technological Arts (\`072\`), Visual Arts (\`085\`), Social Work (\`112\`), Arts-IT (\`128\`); Management (\`016\`), Management & Public Policy (\`028\`), Real Estate (\`017\`), Commerce (\`018\`) | \`23\`–\`44\` (via Section 2 TOC) | Admission Year: **2025/2026**; G.C.E. (A/L) Exam Year: **2025** |
| \`ugc3.md\` | 867 | Yes (lines 1–3, 867) | **Section 2.2.2.1**–**2.2.2.4** (cont., university degree lists); **Section 2.2.2.5**–**2.2.2.8** (+ GWUIM suspension note); **Section 2.2.3** Biological Science Stream (\`2.2.3.1\`–\`2.2.3.30\`) | University degree programmes for \`016\`/\`017\`/\`018\`/\`028\` (lines 4–108); Management Studies (TV) (\`022\`), BIS (\`077\`), Accounting Info Systems (\`127\`), Banking & Insurance (\`133\`), suspended Service Management; Medicine (\`001\`), Dental Surgery (\`002\`), Veterinary Science (\`003\`), Agriculture (\`039\`, \`004\`, \`093\`, \`094\`, \`095\`), Food Science (\`005\`, \`035\`), Indigenous Medicine (\`032\`, \`033\`, \`036\`), Biological Science (\`006\`), Applied Sciences Bio (\`007\`), Health Promotion (\`050\`), Nursing (\`037\`), Pharmacy (\`051\`), MLS (\`052\`), Radiography (\`053\`), Physiotherapy (\`054\`), Biochemistry (\`058\`), Fisheries (\`062\`), Env. Conservation (\`055\`), Animal Science (\`086\`, \`067\`), Food Prod. (\`087\`), Export Agri (\`073\`), Aquatic Resources (\`088\`), Occupational Therapy (\`115\`) | \`44\`–\`65\` (via Section 2 TOC) | Admission Year: **2025/2026**; G.C.E. (A/L) Exam Year: **2025** |
| \`ugc4.md\` | 756 | Yes (lines 1–3, 756) | **Section 2.2.3.31**–**2.2.3.36** (+ GWUIM suspension note); **Section 2.2.4** Physical Science Stream (\`2.2.4.1\`–\`2.2.4.14\`); **Section 2.2.5** Engineering Tech (\`102\`); **Section 2.2.6** Biosystems Tech (\`103\`); **Section 2.2.7** ICT (\`104\`); **Section 2.2.8.1**–**2.2.8.2** (part 1) | Optometry (\`116\`), Applied Chemistry (\`118\`), Aquatic Bioresources (\`129\`), Urban Bioresources (\`130\`), Medical Imaging Tech (\`138\`), Speech & Hearing Sciences (\`083\`), suspended Indigenous Medicinal Resources; Engineering (\`008\`, \`009\`, \`010\`, \`057\`, \`143\`), Physical Science (\`013\`), Computer Science (\`012\`), Applied Sciences Phy. Sc. (\`015\`), Statistics (\`059\`, \`060\`), Physical Science-ICT (\`108\`), AI (\`117\`), Electronics & CS (\`119\`), Data Science (\`136\`); ET (\`102\`), BST (\`103\`), ICT (\`104\`); IT (\`026\`), MIT (\`027\`) | \`65\`–\`83\` (via Section 2 TOC) | Admission Year: **2025/2026**; G.C.E. (A/L) Exam Year: **2025** |
| \`ugc5.md\` | 864 | Yes (lines 1–3, 864) | **Section 2.2.8.2** (cont.)–**2.2.8.30** (part 1) | MIT (\`027\` closing), Quantity Surveying (\`011\`), Surveying Science (\`014\`), Urban Informatics (\`030\`), Architecture (\`023\`), Fashion Design (\`034\`), Landscape Architecture (\`097\`), Design (\`024\`), Law (\`025\`), Facilities Management (\`056\`), MIT (SEUSL) (\`079\`), Science & Tech (\`064\`), CST (\`065\`), Entrepreneurship (\`066\`), IIT (\`075\`), Mineral Resources (\`076\`), HTEM (\`090\`), Physical Education (\`081\`), Sports Science & Mgt (\`082\`), Sports Science (\`141\`), IT&M (\`091\`), THM (\`092\`), Information Systems (\`096\`), Translation Studies (\`098\`), Film & TV (\`100\`), Project Management (\`101\`), ICT (\`038\`), Software Engineering (\`099\`), Food Business Management (\`107\`) | \`83\`–\`103\` (via Section 2 TOC) | Admission Year: **2025/2026**; G.C.E. (A/L) Exam Year: **2025** (plus **2028/2029** effective rule note in \`2.2.8.24\` for \`096\`) |
| \`ugc6.md\` | 502 | Yes (lines 1–3, 502) | **Section 2.2.8.30** (cont.)–**2.2.8.43** (+ GWUIM 6-course suspension note); **Section 3** (\`3.1\`–\`3.2\`); **Section 4** (\`4.1\`–\`4.6\`) | Food Business Mgt (\`107\` closing), Marine & Freshwater Sciences (\`106\`), Business Science (\`109\`), Financial Engineering (\`110\`), GIS (\`111\`), Financial Maths & Ind. Stats (\`113\`), HRD (\`114\`), Financial Economics (\`131\`), English Language & Applied Linguistics (\`132\`), Creative Music Tech (\`134\`), Plantation Mgt (\`135\`), Primary Education (\`137\`), Polymer Science (\`139\`), GIS (New) (\`142\`), 6 suspended GWUIM courses; Section 3 Uni-Code explanation & specimen preference tables; Section 4 general instructions (\`4.1\`–\`4.6\`) | \`103\`–\`109\` (via Section 2 TOC); Section 3.1 references pp. \`142\`–\`148\` | Admission Year: **2025/2026**; G.C.E. (A/L) Exam Year: **2025** |
| \`ugc7.md\` | 459 | Yes (lines 1–3, 459) | **Section 4.7**–**4.8**; **Section 5** online application guide (\`(A)\`, \`(B)\` Steps 1–4) & **Uni-Codes Table (Part 1)** | Online registration & application instructions; **Uni-Codes Assigned for each Course of Study of University** Part 1 (\`001A\` to \`019E\`, 83 rows, lines 374–458) | Section 5.2 references pp. \`142\`–\`148\` for Uni-Code table | Admission Year: **2025/2026**; G.C.E. (A/L) Exam Year: **2025** |
| \`ugc8.md\` | 912 | Yes (lines 1–3, 912) | **Section 5** **Uni-Codes Table (Part 2)**, **G.C.E. (O/L) Table**, **Practical/Aptitude Test Table**, printing/changing preferences, OUSL R&SC & ITDLH tables; **Section 6** TOC | **Uni-Codes Table** Part 2 (\`019F\` to \`143B\`, 172 rows, lines 4–177); **G.C.E. (O/L) Requirements Table** (31 rows, lines 185–225); **Practical/Aptitude Test Table** (24 rows, lines 232–258); OUSL Regional & Study Centres (lines 382–627); ITDLH Centres (lines 633–898); Section 6 TOC (lines 902–911) | Section 6 TOC maps \`6.1\`–\`6.7\` to printed pages \`164\`–\`170\` | Admission Year: **2025/2026**; G.C.E. (A/L) Exam Year: **2025** |
| \`ugc9.md\` | 528 | No | **Section 6** (\`6.1\`–\`6.7\`); **Section 7**; **Section 8**; **Section 9** (\`Table 9.1\`–\`Table 9.10\`) | **Section 6.1 Blind & Differently Abled Quotas Table** (43 rows, lines 15–60); Extra-curricular, Sports, Armed Forces, Foreign, Teachers (10 places at CMB), Additional Intake; Section 7 & 8 external handbook links; **Section 9 Minimum "Z" Scores by District Tables 9.1–9.10** (266 columns × 25 districts = 6,650 cells, lines 220–519) | \`164\`–\`170\` (Section 6); \`174\`–\`183\` (Tables 9.1–9.10 explicitly labeled) | Sections 6–8: **2025/2026** (A/L **2025**); **Section 9: Academic Year 2024/2025** based on G.C.E. (A/L) **2024 (after re-scrutiny)** |
| \`ugc10.md\` | 741 | No | **Section 10** Specimen Forms (\`Annex - I\` to \`Annex - III\`); **Annex (a)**; **Annex (b)**; **Annex (c)**; Back Cover | Specimen Application Checklist, Appeal Form, Blind/Differently Abled Form; **Annex (a): Places Available for Admission 2025/2026** (121 courses, Total = 42,937, lines 190–313); **Annex (b): Distribution of Places by University** (20 institutions + Additional Intake 900, lines 315–700); **Annex (c): Addresses & Telephone Numbers** (lines 701–733) | None explicitly stated on Annex pages | Admission Year: **2025/2026**; G.C.E. (A/L) Exam Year: **2025** |

---

## 2. Cross-File Continuations (Mid-Section Splits)

1. \`ugc1.md\` → \`ugc2.md\`: **Section 2.1** splits after \`2.1.6\` (\`ugc1.md\` line 569) and resumes at \`2.1.7\` (\`ugc2.md\` line 4).
2. \`ugc2.md\` → \`ugc3.md\`: **Section 2.2.2.1–2.2.2.4** (Management \`016\`, Management and Public Policy \`028\`, Real Estate Management and Valuation \`017\`, Commerce \`018\`) states the shared eligibility and 4-year duration rules at the end of \`ugc2.md\` (lines 751–788) and continues with the university-by-university degree programme lists at the top of \`ugc3.md\` (lines 4–108).
3. \`ugc3.md\` → \`ugc4.md\`: **Section 2.2.3** splits after \`2.2.3.30 Occupational Therapy (115)\` (\`ugc3.md\` line 866) and resumes at \`2.2.3.31 Optometry (116)\` (\`ugc4.md\` line 4).
4. \`ugc4.md\` → \`ugc5.md\`: **Section 2.2.8.2** (\`Management and Information Technology (MIT) (027)\`) starts at the end of \`ugc4.md\` (lines 736–755) and finishes its closing notes at the top of \`ugc5.md\` (lines 4–7).
5. \`ugc5.md\` → \`ugc6.md\`: **Section 2.2.8.30** (\`Food Business Management (107)\`) starts at the end of \`ugc5.md\` (lines 844–863) and finishes its O/L certificate submission sentence at the top of \`ugc6.md\` (line 4).
6. \`ugc6.md\` → \`ugc7.md\`: **Section 4** splits after \`4.6\` (\`ugc6.md\` line 501) and resumes at \`4.7\` (\`ugc7.md\` line 4).
7. \`ugc7.md\` → \`ugc8.md\`: **Section 5 Uni-Codes Table** splits after \`019E\` (\`ugc7.md\` line 458, 83 rows) and continues at \`019F\` (\`ugc8.md\` line 6, 172 rows; total = 255 rows).
8. \`ugc8.md\` → \`ugc9.md\`: **Section 6** heading and Table of Contents appear at the end of \`ugc8.md\` (lines 902–911), while the body of Section 6 starts in \`ugc9.md\` (line 3).

---

## 3. Missing Sections, External Links & Conversion Wrappers

- **Markdown Conversion Wrapper Fences**: Files \`ugc1.md\` through \`ugc8.md\` begin with \`Here is the converted Markdown...\` + \`\`\`\`markdown\` on lines 1–3 and end with a closing \`\`\`\` fence on the final line. \`ugc9.md\` and \`ugc10.md\` do not have wrapper fences.
- **Section 7 (Descriptions of Universities and Institutes)**: In \`ugc9.md\` (lines 178–201), Section 7 lists the 20 participating universities/campuses/institutes and directs readers to \`https://ugc.ac.lk/handbook\` for detailed institutional profiles.
- **Section 8 (FAQs)**: In \`ugc9.md\` (lines 203–206), Section 8 is a single external pointer to \`https://ugc.ac.lk/handbook\`.
- **Printed Page Numbers**:
  - Explicitly available in **Section 2 TOC** (\`ugc1.md\` lines 245–377, pages \`19\`–\`109\`), **Section 6 TOC** (\`ugc8.md\` lines 904–911, pages \`164\`–\`170\`), and **Section 9 table headers** (\`ugc9.md\` lines 220–490, pages \`174\`–\`183\`).
  - Referenced as a range (\`pages 142 to 148\`) for the Uni-Codes list in \`ugc6.md\` line 253 and \`ugc7.md\` line 213, without per-row page breaks.
  - Not stated on Section 1, Section 3, Section 4, Section 10, or Annexes (a), (b), (c); recorded as \`null\` per the non-invention rule.

---

## 4. Repeated Content & Ambiguous Formatting Identified

1. **Duplicate Sports Science Practical Test Blockquote in \`ugc5.md\`**:
   - Under \`2.2.8.19 Physical Education (Course Code - 081)\` (\`ugc5.md\` lines 590–593) and \`2.2.8.21 Sports Science (Course Code - 141)\` (\`ugc5.md\` lines 629–632), a blockquote states: *"Please note that if a candidate wishes to apply for the courses of study in ‘Sports Science & Management’, ‘Sports Science’ and ‘Physical Education’, it is sufficient to apply and appear in the practical test conducted in one of the above universities."*
   - This blockquote is **repeated** at the end of \`2.2.8.22 Information Technology & Management (Course Code - 091)\` (\`ugc5.md\` lines 661–664), where it is unrelated to IT & Management.
2. **Embedded Bold Sub-Courses Inside \`2.2.1.1 Arts\` (\`ugc2.md\` lines 501–686)**:
   - Unlike other Section 2.2 courses which have \`### 2.2.x.y\` or \`#### 2.2.x.y\` headings, 11 subsections are nested inside \`2.2.1.1 Arts (Course Code - 019)\` using bold numbered headers \`**1. Course of Study in Arts (SP) - Mass Media ...**\` through \`**11. Course of Study in Music at the University of Sri Jayewardenepura**\`, covering course codes \`020\`, \`041\`, \`021\`, \`029\`, \`031\`, \`063\`, \`084\`, \`105\`, \`068\`, \`069\`, \`070\`, \`071\`, \`072\`, and \`085\`.
3. **Footnote Symbol Prefix in Annex (b) (\`ugc10.md\` line 436)**:
   - Under University of Kelaniya in Annex (b), the row is written \`| ¹Physical Science - ICT | 76 |\` with footnote \`*¹ Degree programme is offered as B.Sc. in Physics and Electronics.*\`, matching Section 2.2.4.10 (\`ugc4.md\` lines 399–400).
4. **Spelling & Punctuation Variants Across Sections**:
   - \`URBAN BIO RESOURCES\` (Section 5 Uni-Codes \`130C\`) vs \`Urban Bioresources\` (Section 2.2.3.34, Annex (a), Annex (b), Section 9 Table 9.4).
   - \`AGRI BUSINESS MANAGEMENT\` (Section 9 Table 9.8) vs \`Agribusiness Management\` (Section 2.2.3.7, Section 5 \`094F\`, Annex (a), Annex (b)).
   - \`PHYSICAL SCIENCE -ICT\` (Section 5 \`108C\`/\`108D\`, Section 9 Table 9.10) vs \`Physical Science - ICT\` (Section 2.2.4.10, Annex (a), Annex (b)).
   - \`Sabaragamuwa University of Sri Lanaka\` (typo in Section 2.2.4.13 Data Science, \`ugc4.md\` line 465) vs \`Sabaragamuwa University of Sri Lanka\`.
   - \`University of Sri Jayewardenapura\` (Annex (b) heading in \`ugc10.md\` line 367) vs \`University of Sri Jayewardenepura\` (all other tables).
   - \`SOCIAL WORK * (University of Jayewardenepura)\` (Section 9 Table 9.5 header in \`ugc9.md\` line 342) vs \`University of Sri Jayewardenepura\`.
   - \`University of Colombo - Sri Palee Campus\` (Section 9 Table 9.4 header) vs \`Sripalee Campus, University of Colombo\`.
   - \`Swami Vipulananda Institute of Aesthetic Studies\` (Section 9 Table 9.10 header) vs \`Swamy Vipulananda Institute of Aesthetic Studies, Eastern University, Sri Lanka\`.
`;

fs.writeFileSync(path.join(OUT_DIR, 'source-inventory.md'), sourceInventoryMd, 'utf8');
console.log('Wrote source-inventory.md.');



