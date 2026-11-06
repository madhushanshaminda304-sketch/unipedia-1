import type { ProgramCutoffViewRow } from './ugc/types';
export type { ProgramCutoffViewRow };
import type { SubjectRequirementsSpec } from '../lib/ugcLogic';

export interface DistrictInfo {
  district_id: number;
  district_name: string;
  name_si: string;
  name_ta: string;
  province: string;
  difficulty_offset: number;
}

export const SRI_LANKA_DISTRICTS: DistrictInfo[] = [
  { district_id: 1, district_name: 'Colombo', name_si: 'කොළඹ', name_ta: 'கொழும்பு', province: 'Western', difficulty_offset: 0.0 },
  { district_id: 2, district_name: 'Gampaha', name_si: 'ගම්පහ', name_ta: 'கம்பஹா', province: 'Western', difficulty_offset: -0.035 },
  { district_id: 3, district_name: 'Kalutara', name_si: 'කළුතර', name_ta: 'களுத்துறை', province: 'Western', difficulty_offset: -0.045 },
  { district_id: 4, district_name: 'Matale', name_si: 'මාතලේ', name_ta: 'மாத்தளை', province: 'Central', difficulty_offset: -0.095 },
  { district_id: 5, district_name: 'Kandy', name_si: 'මහනුවර', name_ta: 'கண்டி', province: 'Central', difficulty_offset: -0.025 },
  { district_id: 6, district_name: 'Nuwara Eliya', name_si: 'නුවරඑළිය', name_ta: 'நுவரெலியா', province: 'Central', difficulty_offset: -0.185 },
  { district_id: 7, district_name: 'Galle', name_si: 'ගාල්ල', name_ta: 'காலி', province: 'Southern', difficulty_offset: -0.015 },
  { district_id: 8, district_name: 'Matara', name_si: 'මාතර', name_ta: 'மாத்தறை', province: 'Southern', difficulty_offset: -0.01 },
  { district_id: 9, district_name: 'Hambantota', name_si: 'හම්බන්තොට', name_ta: 'அம்பாந்தோட்டை', province: 'Southern', difficulty_offset: -0.065 },
  { district_id: 10, district_name: 'Jaffna', name_si: 'යාපනය', name_ta: 'யாழ்ப்பாணம்', province: 'Northern', difficulty_offset: -0.02 },
  { district_id: 11, district_name: 'Kilinochchi', name_si: 'කිලිනොච්චිය', name_ta: 'கிளிநොச்சி', province: 'Northern', difficulty_offset: -0.21 },
  { district_id: 12, district_name: 'Mannar', name_si: 'මන්නාරම', name_ta: 'மன்னார்', province: 'Northern', difficulty_offset: -0.195 },
  { district_id: 13, district_name: 'Mullaitivu', name_si: 'මුලතිව්', name_ta: 'முல்லைத்தீவு', province: 'Northern', difficulty_offset: -0.24 },
  { district_id: 14, district_name: 'Vavuniya', name_si: 'වවුනියාව', name_ta: 'வவுனியா', province: 'Northern', difficulty_offset: -0.14 },
  { district_id: 15, district_name: 'Trincomalee', name_si: 'ත්‍රිකුණාමලය', name_ta: 'திருகோணமலை', province: 'Eastern', difficulty_offset: -0.165 },
  { district_id: 16, district_name: 'Batticaloa', name_si: 'මඩකලපුව', name_ta: 'மட்டக்களப்பு', province: 'Eastern', difficulty_offset: -0.11 },
  { district_id: 17, district_name: 'Ampara', name_si: 'අම්පාර', name_ta: 'அம்பாறை', province: 'Eastern', difficulty_offset: -0.125 },
  { district_id: 18, district_name: 'Puttalam', name_si: 'පුත්තලම', name_ta: 'புத்தளம்', province: 'North Western', difficulty_offset: -0.135 },
  { district_id: 19, district_name: 'Kurunegala', name_si: 'කුරුණෑගල', name_ta: 'குருநாகல்', province: 'North Western', difficulty_offset: -0.03 },
  { district_id: 20, district_name: 'Anuradhapura', name_si: 'අනුරාධපුරය', name_ta: 'அனுராதபுரம்', province: 'North Central', difficulty_offset: -0.085 },
  { district_id: 21, district_name: 'Polonnaruwa', name_si: 'පොළොන්නරුව', name_ta: 'பொலன்னறுவை', province: 'North Central', difficulty_offset: -0.145 },
  { district_id: 22, district_name: 'Badulla', name_si: 'බදුල්ල', name_ta: 'பதுளை', province: 'Uva', difficulty_offset: -0.09 },
  { district_id: 23, district_name: 'Monaragala', name_si: 'මොණරාගල', name_ta: 'மொனராகலை', province: 'Uva', difficulty_offset: -0.175 },
  { district_id: 24, district_name: 'Kegalle', name_si: 'කෑගල්ල', name_ta: 'கேகாலை', province: 'Sabaragamuwa', difficulty_offset: -0.05 },
  { district_id: 25, district_name: 'Ratnapura', name_si: 'රත්නපුර', name_ta: 'இரத்தினபுரி', province: 'Sabaragamuwa', difficulty_offset: -0.055 },
];

export interface InstitutionRecord {
  institution_code: string;
  ugc_letter: string;
  name: string;
  type: 'University' | 'Campus' | 'Institute';
  location: string;
  website: string;
  established: number;
  hostel_monthly_lkr: number;
}

export const UGC_INSTITUTIONS: InstitutionRecord[] = [
  { institution_code: 'UOC', ugc_letter: 'A', name: 'University of Colombo', type: 'University', location: 'Colombo 03', website: 'https://cmb.ac.lk', established: 1921, hostel_monthly_lkr: 1500 },
  { institution_code: 'UOP', ugc_letter: 'B', name: 'University of Peradeniya', type: 'University', location: 'Peradeniya, Kandy', website: 'https://pdn.ac.lk', established: 1942, hostel_monthly_lkr: 1200 },
  { institution_code: 'UOM', ugc_letter: 'G', name: 'University of Moratuwa', type: 'University', location: 'Katubedda, Moratuwa', website: 'https://uom.lk', established: 1972, hostel_monthly_lkr: 1800 },
  { institution_code: 'USJP', ugc_letter: 'C', name: 'University of Sri Jayewardenepura', type: 'University', location: 'Gangodawila, Nugegoda', website: 'https://sjp.ac.lk', established: 1959, hostel_monthly_lkr: 1600 },
  { institution_code: 'UOK', ugc_letter: 'D', name: 'University of Kelaniya', type: 'University', location: 'Dalugama, Kelaniya', website: 'https://kln.ac.lk', established: 1959, hostel_monthly_lkr: 1500 },
  { institution_code: 'UOJ', ugc_letter: 'E', name: 'University of Jaffna', type: 'University', location: 'Thirunelveli, Jaffna', website: 'https://jfn.ac.lk', established: 1974, hostel_monthly_lkr: 1100 },
  { institution_code: 'UOR', ugc_letter: 'F', name: 'University of Ruhuna', type: 'University', location: 'Wellamadama, Matara', website: 'https://ruh.ac.lk', established: 1978, hostel_monthly_lkr: 1250 },
  { institution_code: 'EUSL', ugc_letter: 'H', name: 'Eastern University, Sri Lanka', type: 'University', location: 'Vantharumoolai, Batticaloa', website: 'https://esn.ac.lk', established: 1986, hostel_monthly_lkr: 1000 },
  { institution_code: 'SEUSL', ugc_letter: 'J', name: 'South Eastern University of Sri Lanka', type: 'University', location: 'Oluvil, Ampara', website: 'https://seu.ac.lk', established: 1995, hostel_monthly_lkr: 1000 },
  { institution_code: 'RUSL', ugc_letter: 'K', name: 'Rajarata University of Sri Lanka', type: 'University', location: 'Mihintale, Anuradhapura', website: 'https://rjt.ac.lk', established: 1996, hostel_monthly_lkr: 1050 },
  { institution_code: 'SUSL', ugc_letter: 'L', name: 'Sabaragamuwa University of Sri Lanka', type: 'University', location: 'Belihuloya, Ratnapura', website: 'https://sab.ac.lk', established: 1996, hostel_monthly_lkr: 1100 },
  { institution_code: 'WUSL', ugc_letter: 'M', name: 'Wayamba University of Sri Lanka', type: 'University', location: 'Kuliyapitiya & Makandura', website: 'https://wyb.ac.lk', established: 1999, hostel_monthly_lkr: 1150 },
  { institution_code: 'UWU', ugc_letter: 'U', name: 'Uva Wellassa University of Sri Lanka', type: 'University', location: 'Passara Road, Badulla', website: 'https://uwu.ac.lk', established: 2005, hostel_monthly_lkr: 1150 },
  { institution_code: 'UVPA', ugc_letter: 'Z', name: 'University of the Visual & Performing Arts', type: 'University', location: 'Horton Place, Colombo 07', website: 'https://vpa.ac.lk', established: 2005, hostel_monthly_lkr: 1650 },
  { institution_code: 'GWUIM', ugc_letter: 'P', name: 'Gampaha Wickramarachchi University of Indigenous Medicine', type: 'University', location: 'Yakkala, Gampaha', website: 'https://gwu.ac.lk', established: 2021, hostel_monthly_lkr: 1300 },
  { institution_code: 'UOV', ugc_letter: 'R', name: 'University of Vavuniya', type: 'University', location: 'Pampaimadu, Vavuniya', website: 'https://vau.ac.lk', established: 2021, hostel_monthly_lkr: 1000 },
  { institution_code: 'IIM', ugc_letter: 'A', name: 'Institute of Indigenous Medicine', type: 'Institute', location: 'Rajagiriya, Colombo', website: 'https://iim.cmb.ac.lk', established: 1977, hostel_monthly_lkr: 1450 },
  { institution_code: 'UCSC', ugc_letter: 'T', name: 'University of Colombo School of Computing', type: 'Institute', location: 'Reid Avenue, Colombo 07', website: 'https://ucsc.cmb.ac.lk', established: 2002, hostel_monthly_lkr: 1700 },
  { institution_code: 'SPC', ugc_letter: 'S', name: 'Sri Palee Campus', type: 'Campus', location: 'Wewala, Horana', website: 'https://spc.cmb.ac.lk', established: 1996, hostel_monthly_lkr: 1200 },
  { institution_code: 'TC', ugc_letter: 'W', name: 'Trincomalee Campus, Eastern University', type: 'Campus', location: 'Konesapuri, Trincomalee', website: 'https://tc.esn.ac.lk', established: 1993, hostel_monthly_lkr: 1050 },
  { institution_code: 'SVIAS', ugc_letter: 'Y', name: 'Swami Vipulananda Institute of Aesthetic Studies', type: 'Institute', location: 'Kallady, Batticaloa', website: 'https://svias.esn.ac.lk', established: 2005, hostel_monthly_lkr: 1000 },
];


export type OlGrade = 'A' | 'B' | 'C' | 'S' | 'W' | 'NONE';

export interface OlRequirementRule {
  course_code: string;
  uni_codes: string[];
  english?: 'B' | 'C' | 'S';
  mathematics?: 'B' | 'C' | 'S';
  science?: 'C' | 'S';
  sinhala?: 'C';
  sinhala_or_tamil?: 'B' | 'C';
  alt_al_rule?: string;
  special_note?: string;
  short_badge: string;      // Shown directly on ProgramChanceCard
  full_description: string; // Shown in tooltip / detail drawer / compare table & SQL
}

export const OL_REQUIREMENTS_BY_COURSE_CODE: Record<string, OlRequirementRule> = {
  '011': {
    course_code: '011',
    uni_codes: ['011G'],
    english: 'C',
    mathematics: 'C',
    science: 'S',
    short_badge: 'O/L Required: English (C) · Maths (C) · Science (S)',
    full_description: 'At least a Credit (C) pass in English, Credit (C) pass in Mathematics, and Ordinary (S) pass in Science at G.C.E. (O/L).'
  },
  '020': {
    course_code: '020',
    uni_codes: ['020S'],
    english: 'S',
    short_badge: 'O/L Required: English (S)',
    full_description: 'At least an Ordinary (S) pass in English at G.C.E. (O/L) + Pass Practical/Aptitude Test.'
  },
  '041': {
    course_code: '041',
    uni_codes: ['041S'],
    english: 'S',
    short_badge: 'O/L Required: English (S)',
    full_description: 'At least an Ordinary (S) pass in English at G.C.E. (O/L) + Pass Practical/Aptitude Test.'
  },
  '023': {
    course_code: '023',
    uni_codes: ['023G'],
    english: 'S',
    mathematics: 'C',
    alt_al_rule: 'Or at least an Ordinary (S) pass in Mathematics at G.C.E. (A/L)',
    short_badge: 'O/L Required: English (S) · Maths (C) (or A/L Maths S)',
    full_description: 'At least an Ordinary (S) pass in English and a Credit (C) pass in Mathematics at G.C.E. (O/L) (unless passed G.C.E. A/L Mathematics with at least S) + Pass Aptitude Test.'
  },
  '024': {
    course_code: '024',
    uni_codes: ['024G'],
    english: 'S',
    mathematics: 'C',
    science: 'C',
    alt_al_rule: 'Or at least an Ordinary (S) pass in Mathematics at G.C.E. (A/L)',
    short_badge: 'O/L Required: English (S) · Maths (C) · Science (C)',
    full_description: 'At least an Ordinary (S) pass in English, Credit (C) pass in Mathematics (or A/L Maths S), and Credit (C) pass in Science at G.C.E. (O/L) + Pass Aptitude Test.'
  },
  '025': {
    course_code: '025',
    uni_codes: ['025A', '025B', '025E'],
    english: 'C',
    sinhala_or_tamil: 'C',
    short_badge: 'O/L Required: English (C) + Sinhala OR Tamil (C)',
    full_description: 'At least a Credit (C) pass in English AND at least a Credit (C) pass in Sinhala Language & Literature OR Tamil Language & Literature at G.C.E. (O/L).'
  },
  '027': {
    course_code: '027',
    uni_codes: ['027D'],
    english: 'C',
    mathematics: 'B',
    short_badge: 'O/L Required: Maths (B) · English (C)',
    full_description: 'At least a Very Good (B) pass in Mathematics AND at least a Credit (C) pass in English at G.C.E. (O/L).'
  },
  '029': {
    course_code: '029',
    uni_codes: ['029W'],
    english: 'C',
    short_badge: 'O/L Required: English (C)',
    full_description: 'At least a Credit (C) pass in English at G.C.E. (O/L).'
  },
  '030': {
    course_code: '030',
    uni_codes: ['030G'],
    english: 'B',
    mathematics: 'C',
    short_badge: 'O/L Required: English (B) · Maths (C)',
    full_description: 'At least a Very Good (B) pass in English AND at least a Credit (C) pass in Mathematics at G.C.E. (O/L).'
  },
  '034': {
    course_code: '034',
    uni_codes: ['034G'],
    english: 'C',
    mathematics: 'C',
    science: 'C',
    short_badge: 'O/L Required: English (C) · Maths (C) · Science (C)',
    full_description: 'At least a Credit (C) pass in English, Credit (C) pass in Mathematics, and Credit (C) pass in Science at G.C.E. (O/L) + Pass Aptitude Test.'
  },
  '037': {
    course_code: '037',
    uni_codes: ['037A', '037B', '037C', '037E', '037F', '037H'],
    english: 'S',
    special_note: 'Minimum height 4\' 10" (147.3 cm) and no physical deformity (Section 5.3 Note 1)',
    short_badge: 'O/L Required: English (S) + Min Height 4\'10"',
    full_description: 'At least an Ordinary (S) pass in English at G.C.E. (O/L). Note 1: Candidate must be at least 4\' 10" (147.3 cm) in height without physical deformity.'
  },
  '038': {
    course_code: '038',
    uni_codes: ['038K', '038R'],
    english: 'C',
    mathematics: 'C',
    short_badge: 'O/L Required: English (C) · Maths (C)',
    full_description: 'At least a Credit (C) pass in English AND at least a Credit (C) pass in Mathematics at G.C.E. (O/L).'
  },
  '051': {
    course_code: '051',
    uni_codes: ['051B', '051C', '051E', '051F'],
    english: 'S',
    short_badge: 'O/L Required: English (S)',
    full_description: 'At least an Ordinary (S) pass in English at G.C.E. (O/L).'
  },
  '052': {
    course_code: '052',
    uni_codes: ['052B', '052C', '052E', '052F'],
    english: 'S',
    short_badge: 'O/L Required: English (S)',
    full_description: 'At least an Ordinary (S) pass in English at G.C.E. (O/L).'
  },
  '053': {
    course_code: '053',
    uni_codes: ['053B'],
    english: 'S',
    short_badge: 'O/L Required: English (S)',
    full_description: 'At least an Ordinary (S) pass in English at G.C.E. (O/L).'
  },
  '054': {
    course_code: '054',
    uni_codes: ['054A', '054B'],
    english: 'S',
    short_badge: 'O/L Required: English (S)',
    full_description: 'At least an Ordinary (S) pass in English at G.C.E. (O/L).'
  },
  '056': {
    course_code: '056',
    uni_codes: ['056G'],
    english: 'C',
    mathematics: 'C',
    science: 'C',
    short_badge: 'O/L Required: English (C) · Maths (C) · Science (C)',
    full_description: 'At least a Credit (C) pass in English, Credit (C) pass in Mathematics, and Credit (C) pass in Science at G.C.E. (O/L).'
  },
  '075': {
    course_code: '075',
    uni_codes: ['075U'],
    english: 'C',
    mathematics: 'C',
    short_badge: 'O/L Required: English (C) · Maths (C)',
    full_description: 'At least a Credit (C) pass in English AND at least a Credit (C) pass in Mathematics at G.C.E. (O/L).'
  },
  '083': {
    course_code: '083',
    uni_codes: ['083D'],
    english: 'S',
    short_badge: 'O/L Required: English (S)',
    full_description: 'At least an Ordinary (S) pass in English at G.C.E. (O/L).'
  },
  '091': {
    course_code: '091',
    uni_codes: ['091G'],
    english: 'C',
    mathematics: 'C',
    short_badge: 'O/L Required: English (C) · Maths (C)',
    full_description: 'At least a Credit (C) pass in English AND at least a Credit (C) pass in Mathematics at G.C.E. (O/L).'
  },
  '095': {
    course_code: '095',
    uni_codes: ['095F'],
    english: 'C',
    short_badge: 'O/L Required: English (C)',
    full_description: 'At least a Credit (C) pass in English at G.C.E. (O/L).'
  },
  '096': {
    course_code: '096',
    uni_codes: ['096C', '096L', '096T'],
    english: 'C',
    mathematics: 'C',
    short_badge: 'O/L Required: English (C) · Maths (C)',
    full_description: 'At least a Credit (C) pass in English AND at least a Credit (C) pass in Mathematics at G.C.E. (O/L) + Pass Aptitude Test.'
  },
  '097': {
    course_code: '097',
    uni_codes: ['097G'],
    english: 'S',
    mathematics: 'C',
    alt_al_rule: 'Or at least an Ordinary (S) pass in Mathematics at G.C.E. (A/L)',
    short_badge: 'O/L Required: English (S) · Maths (C) (or A/L Maths S)',
    full_description: 'At least an Ordinary (S) pass in English and a Credit (C) pass in Mathematics at G.C.E. (O/L) (or S in A/L Mathematics) + Pass Aptitude Test.'
  },
  '098': {
    course_code: '098',
    uni_codes: ['098D', '098E', '098H', '098L'],
    english: 'B',
    sinhala_or_tamil: 'B',
    alt_al_rule: 'Or at least an Ordinary (S) pass in English Language (Subject 73) at G.C.E. (A/L)',
    short_badge: 'O/L Required: English (B) + Sinhala/Tamil (B) (or A/L English S)',
    full_description: 'At least Very Good (B) passes in English AND (Sinhala Language & Lit. OR Tamil Language & Lit.) at G.C.E. (O/L), OR at least an S pass in A/L English + Pass Aptitude Test.'
  },
  '107': {
    course_code: '107',
    uni_codes: ['107L'],
    english: 'C',
    mathematics: 'C',
    science: 'C',
    short_badge: 'O/L Required: English (C) · Maths (C) · Science (C)',
    full_description: 'At least a Credit (C) pass in English, Credit (C) pass in Mathematics, and Credit (C) pass in Science at G.C.E. (O/L).'
  },
  '109': {
    course_code: '109',
    uni_codes: ['109G'],
    mathematics: 'C',
    short_badge: 'O/L Required: Maths (C)',
    full_description: 'At least a Credit (C) pass in Mathematics at G.C.E. (O/L).'
  },
  '110': {
    course_code: '110',
    uni_codes: ['110D'],
    english: 'C',
    mathematics: 'C',
    short_badge: 'O/L Required: English (C) · Maths (C)',
    full_description: 'At least a Credit (C) pass in English AND at least a Credit (C) pass in Mathematics at G.C.E. (O/L).'
  },
  '128': {
    course_code: '128',
    uni_codes: ['128C'],
    mathematics: 'C',
    short_badge: 'O/L Required: Maths (C)',
    full_description: 'At least a Credit (C) pass in Mathematics at G.C.E. (O/L).'
  },
  '132': {
    course_code: '132',
    uni_codes: ['132U'],
    english: 'C',
    mathematics: 'C',
    short_badge: 'O/L Required: English (C) · Maths (C)',
    full_description: 'At least a Credit (C) pass in English AND at least a Credit (C) pass in Mathematics at G.C.E. (O/L).'
  },
  '136': {
    course_code: '136',
    uni_codes: ['136L'],
    english: 'C',
    short_badge: 'O/L Required: English (C)',
    full_description: 'At least a Credit (C) pass in English at G.C.E. (O/L).'
  },
  '137': {
    course_code: '137',
    uni_codes: ['137A'],
    sinhala: 'C',
    english: 'S',
    mathematics: 'C',
    science: 'C',
    short_badge: 'O/L Required: Sinhala (C) · English (S) · Maths (C) · Science (C)',
    full_description: 'At least a Credit (C) pass in Sinhala Language & Literature, Ordinary (S) pass in English, Credit (C) pass in Mathematics, and Credit (C) pass in Science at G.C.E. (O/L).'
  }
};

export interface CourseMasterOverview {
  course_code: string;
  degree_awarded: string;
  overview: string;
  al_requirements_summary: string;
  specializations: string[];
  special_intake_quota_note?: string | null;
  aptitude_test_info?: string | null;
  career_paths: string[];
  total_national_intake?: number;
  differently_abled_quota?: number;
}

export const COURSE_MASTER_OVERVIEWS: Record<string, CourseMasterOverview> = {
  "100": {
    "course_code": "100",
    "degree_awarded": "BSc (Hons) in Food Business Management",
    "overview": "Commercial food chain economics, global agribusiness logistics, food quality certification, and retail brand management at Sabaragamuwa University.",
    "al_requirements_summary": "Minimum 3 'S' passes in any stream + Pass Food Business Aptitude Test.",
    "specializations": [
      "Agri-Food Retail Marketing",
      "International Food Supply Chains",
      "Food Product Innovation",
      "Food Regulatory Compliance"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Business comprehension, food industry awareness, and commercial aptitude exam conducted by Sabaragamuwa University.",
    "career_paths": [
      "Food Brand Director",
      "Food Retail Operations Executive",
      "FMCG Supply Chain Specialist",
      "Agribusiness Consultant"
    ],
    "total_national_intake": 70
  },
  "101": {
    "course_code": "101",
    "degree_awarded": "BSc (Hons) in Information Technology",
    "overview": "Comprehensive academic curriculum in Information Technology (UWU) preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Physical Science stream.",
    "specializations": [
      "Applied Information Technology (UWU)",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Information Technology (UWU) Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "102": {
    "course_code": "102",
    "degree_awarded": "BET (Hons)",
    "overview": "Four-year technological degree emphasizing hands-on mechanical, automotive, civil, and electrical engineering technology with intensive industrial workshop training.",
    "al_requirements_summary": "Minimum 3 'S' passes in Engineering Technology (ET), Science for Technology (SFT), and an approved third Technology subject.",
    "specializations": [
      "Mechanical & Manufacturing Technology",
      "Automobile Engineering Technology",
      "Construction Technology",
      "Electrical & Electronic Technology"
    ],
    "career_paths": [
      "Engineering Technologist (IESL Registered)",
      "Automotive Manufacturing Plant Engineer",
      "Construction Project Engineer",
      "Industrial Plant Maintenance Engineer"
    ],
    "total_national_intake": 1450
  },
  "103": {
    "course_code": "103",
    "degree_awarded": "BBST (Hons)",
    "overview": "Modern technology curriculum in post-harvest processing, bio-fertilizers, pharmaceutical bio-technology, food processing, and environmental monitoring.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biosystems Technology (BST), Science for Technology (SFT), and an approved third Technology subject.",
    "specializations": [
      "Bio-Processing & Food Technology",
      "Agricultural Systems Technology",
      "Environmental Biosystems",
      "Industrial Bio-Resource Management"
    ],
    "career_paths": [
      "Biosystems Technologist",
      "Food Processing Plant Executive",
      "Bio-Fertilizer Quality Specialist",
      "Environmental Technology Analyst"
    ],
    "total_national_intake": 1100
  },
  "104": {
    "course_code": "104",
    "degree_awarded": "BICT (Hons)",
    "overview": "Industry-certified technology degree for Technology stream students covering network engineering, enterprise web systems, software testing, and embedded devices.",
    "al_requirements_summary": "Minimum 3 'S' passes in A/L Technology stream including Information Communication Technology (ICT), Science for Technology (SFT), or an approved 3rd subject.",
    "specializations": [
      "Network & Systems Engineering",
      "Enterprise Software Development",
      "Embedded Systems & IoT",
      "Database & Cloud Solutions"
    ],
    "career_paths": [
      "Network Infrastructure Engineer",
      "Web Applications Developer",
      "IoT Systems Specialist",
      "IT Operations Engineer"
    ],
    "total_national_intake": 850
  },
  "105": {
    "course_code": "105",
    "degree_awarded": "BA (Hons) in TESL / BEd (Hons) in TESL",
    "overview": "Applied linguistics, phonetics, second language acquisition pedagogy, syllabus design, and English teacher education at USJP, SUSL, and EUSL.",
    "al_requirements_summary": "At least an 'S' pass in A/L English (Subject 73) and passes in any two other A/L subjects + Pass Aptitude Test.",
    "specializations": [
      "Language Teaching Methodology",
      "Curriculum & Materials Design",
      "Applied English Linguistics",
      "Educational Assessment & Testing"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: English grammatical competence, essay composition, reading comprehension, and spoken viva interview conducted by the respective university.",
    "career_paths": [
      "English Language Teacher / Lecturer",
      "Curriculum Development Specialist (NIE)",
      "Corporate Language Trainer",
      "Educational Materials Editor"
    ],
    "total_national_intake": 240
  },
  "106": {
    "course_code": "106",
    "degree_awarded": "BSc (Hons) in Agricultural Technology",
    "overview": "Comprehensive academic curriculum in Agricultural Technology preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Technology stream.",
    "specializations": [
      "Applied Agricultural Technology",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Agricultural Technology Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "107": {
    "course_code": "107",
    "degree_awarded": "BSc (Hons) in Food Business Management",
    "overview": "Commercial agribusiness and food technology crossover program at Sabaragamuwa University covering food marketing, export supply chains, packaging, and retail management.",
    "al_requirements_summary": "Minimum 3 'S' passes in Bio Science, Physical Science, Commerce, or Technology + O/L English 'C', Maths 'C', Science 'C'.",
    "specializations": [
      "Food Supply Chain & Logistics",
      "Food Marketing & Brand Economics",
      "Agri-Food Entrepreneurship",
      "Food Safety & Compliance Management"
    ],
    "career_paths": [
      "Food Supply Chain Manager",
      "FMCG Brand Executive",
      "Agribusiness Export Manager",
      "Food Retail Operations Executive"
    ],
    "total_national_intake": 80
  },
  "108": {
    "course_code": "108",
    "degree_awarded": "BA (Hons) in Financial Economics",
    "overview": "Comprehensive academic curriculum in Financial Economics preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Arts stream.",
    "specializations": [
      "Applied Financial Economics",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Financial Economics Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "109": {
    "course_code": "109",
    "degree_awarded": "BSc (Hons) in Business Science",
    "overview": "Highly quantitative business curriculum at University of Moratuwa focused on financial analytics, algorithmic trading, business analytics, and supply chain mathematics.",
    "al_requirements_summary": "Minimum 3 'S' passes in Physical Science or Commerce with Combined Maths/Economics/Statistics + O/L Maths 'C'.",
    "specializations": [
      "Financial Analytics & Quantitative Trading",
      "Business Analytics & Data Modeling",
      "Supply Chain Analytics & Optimization",
      "FinTech & Digital Business"
    ],
    "career_paths": [
      "Quantitative Business Analyst",
      "Investment / Trading Strategist",
      "Supply Chain Analytics Specialist",
      "Fintech Risk Modeler"
    ],
    "total_national_intake": 120
  },
  "110": {
    "course_code": "110",
    "degree_awarded": "BSc (Hons) in Financial Engineering",
    "overview": "University of Kelaniya flagship degree combining financial derivatives, stochastic calculus, risk modeling, and algorithmic trading.",
    "al_requirements_summary": "Minimum 3 'S' passes in Physical Science (Combined Maths) or Commerce (Statistics/Maths) + O/L English 'C', Maths 'C'.",
    "specializations": [
      "Derivatives Pricing & Financial Math",
      "Financial Risk Modeling (VaR)",
      "Algorithmic & High-Frequency Trading",
      "Corporate Financial Strategy"
    ],
    "career_paths": [
      "Financial Engineer",
      "Risk Management Officer (Banks/Treasury)",
      "Derivatives & Portfolio Analyst",
      "Investment Banker"
    ],
    "total_national_intake": 60
  },
  "111": {
    "course_code": "111",
    "degree_awarded": "BSc (Hons) in Accounting & Finance",
    "overview": "Comprehensive academic curriculum in Accounting & Finance preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Commerce stream.",
    "specializations": [
      "Applied Accounting & Finance",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Accounting & Finance Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "112": {
    "course_code": "112",
    "degree_awarded": "BSc (Hons) in Business Analytics",
    "overview": "Comprehensive academic curriculum in Business Analytics preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Commerce stream.",
    "specializations": [
      "Applied Business Analytics",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Business Analytics Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "113": {
    "course_code": "113",
    "degree_awarded": "BSc (Hons) in Data Science & AI",
    "overview": "Comprehensive academic curriculum in Data Science & Artificial Intelligence preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Physical Science stream.",
    "specializations": [
      "Applied Data Science & Artificial Intelligence",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Data Science & Artificial Intelligence Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "114": {
    "course_code": "114",
    "degree_awarded": "BSc (Hons) in Cyber Security",
    "overview": "Comprehensive academic curriculum in Cyber Security preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Physical Science stream.",
    "specializations": [
      "Applied Cyber Security",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Cyber Security Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "115": {
    "course_code": "115",
    "degree_awarded": "BSc (Hons) in Occupational Therapy",
    "overview": "Four-year clinical rehabilitation program at University of Kelaniya covering pediatric developmental therapy, neuro-rehabilitation, mental health, and assistive technology.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics at G.C.E. (A/L) at a single sitting.",
    "specializations": [
      "Paediatric Occupational Therapy",
      "Neurological Rehabilitation",
      "Mental Health & Psychosocial OT",
      "Geriatric & Ergonomic Care"
    ],
    "career_paths": [
      "Occupational Therapist (SLMC)",
      "Rehabilitation Center Director",
      "Ergonomics & Assistive Tech Specialist",
      "Paediatric Therapy Consultant"
    ],
    "total_national_intake": 45
  },
  "116": {
    "course_code": "116",
    "degree_awarded": "BSc (Hons) in Optometry",
    "overview": "Four-year clinical eye care degree at University of Peradeniya covering refractive correction, ocular pharmacology, contact lens fitting, binocular vision, and low vision aids.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics at G.C.E. (A/L) at a single sitting.",
    "specializations": [
      "Clinical Refraction & Contact Lenses",
      "Ocular Pathology & Diagnostics",
      "Binocular Vision & Orthoptics",
      "Low Vision Rehabilitation"
    ],
    "career_paths": [
      "Optometrist (SLMC)",
      "Refractive Clinic Director",
      "Ophthalmic Diagnostic Specialist",
      "Optical Instrumentation Consultant"
    ],
    "total_national_intake": 40
  },
  "117": {
    "course_code": "117",
    "degree_awarded": "BSc (Hons) in Artificial Intelligence",
    "overview": "Cutting-edge degree at University of Moratuwa covering deep learning, natural language processing, computer vision, autonomous robotics, and ethics of AI.",
    "al_requirements_summary": "At least a 'C' pass in Combined Mathematics, Higher Mathematics, or Physics AND 'S' passes in two other approved Physical Science / ICT subjects.",
    "specializations": [
      "Deep Learning & Neural Networks",
      "Computer Vision & Autonomous Systems",
      "Natural Language Processing & LLMs",
      "AI Robotics & Control"
    ],
    "career_paths": [
      "AI / Machine Learning Engineer",
      "Deep Learning Research Scientist",
      "Computer Vision Engineer",
      "NLP / Generative AI Specialist"
    ],
    "total_national_intake": 75
  },
  "118": {
    "course_code": "118",
    "degree_awarded": "BSc (Hons) in Financial Mathematics",
    "overview": "Comprehensive academic curriculum in Financial Mathematics preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Physical Science stream.",
    "specializations": [
      "Applied Financial Mathematics",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Financial Mathematics Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "119": {
    "course_code": "119",
    "degree_awarded": "BSc (Hons) in Electronics & Computer Science",
    "overview": "Four-year honors curriculum in digital VLSI design, embedded firmware, real-time operating systems, and computer hardware architecture at University of Kelaniya.",
    "al_requirements_summary": "At least a 'C' pass in Combined Maths or Physics + 2 other passes in Physical Science / ICT.",
    "specializations": [
      "VLSI & Semiconductor Design",
      "Embedded Systems & Robotics",
      "Hardware Architecture",
      "IoT & Sensor Networks"
    ],
    "career_paths": [
      "Embedded Systems Engineer",
      "VLSI Design Engineer",
      "Hardware Architect",
      "Robotics Systems Specialist"
    ],
    "total_national_intake": 60
  },
  "120": {
    "course_code": "120",
    "degree_awarded": "BET (Hons) in Biomedical Technology",
    "overview": "Comprehensive academic curriculum in Biomedical Technology preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Technology stream.",
    "specializations": [
      "Applied Biomedical Technology",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Biomedical Technology Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "121": {
    "course_code": "121",
    "degree_awarded": "BET (Hons) in Mechatronics Technology",
    "overview": "Comprehensive academic curriculum in Mechatronics Technology preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Technology stream.",
    "specializations": [
      "Applied Mechatronics Technology",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Mechatronics Technology Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "122": {
    "course_code": "122",
    "degree_awarded": "BET (Hons) in Automation Technology",
    "overview": "Comprehensive academic curriculum in Automation Technology preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Technology stream.",
    "specializations": [
      "Applied Automation Technology",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Automation Technology Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "123": {
    "course_code": "123",
    "degree_awarded": "BBST (Hons) in Food Production & Technology",
    "overview": "Comprehensive academic curriculum in Food Production & Technology preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Technology stream.",
    "specializations": [
      "Applied Food Production & Technology",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Food Production & Technology Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "124": {
    "course_code": "124",
    "degree_awarded": "BBST (Hons) in Aquatic Bioresources",
    "overview": "Comprehensive academic curriculum in Aquatic Bioresources preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Technology stream.",
    "specializations": [
      "Applied Aquatic Bioresources",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Aquatic Bioresources Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "125": {
    "course_code": "125",
    "degree_awarded": "BBST (Hons) in Urban Bioresources",
    "overview": "Comprehensive academic curriculum in Urban Bioresources preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Technology stream.",
    "specializations": [
      "Applied Urban Bioresources",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Urban Bioresources Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "126": {
    "course_code": "126",
    "degree_awarded": "BSc (Hons) in Applied Chemistry",
    "overview": "Comprehensive academic curriculum in Applied Chemistry preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Physical Science stream.",
    "specializations": [
      "Applied Applied Chemistry",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Applied Chemistry Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "127": {
    "course_code": "127",
    "degree_awarded": "BSc (Hons) in Health Promotion",
    "overview": "Comprehensive academic curriculum in Health Promotion preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Biological Science stream.",
    "specializations": [
      "Applied Health Promotion",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Health Promotion Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "128": {
    "course_code": "128",
    "degree_awarded": "BA (Hons) in Information Technology",
    "overview": "Unique blend of social science research, computational linguistics, digital humanities, and web design at University of Sri Jayewardenepura.",
    "al_requirements_summary": "Minimum 3 'S' passes in Arts stream + O/L Maths 'C'.",
    "specializations": [
      "Computational Social Science",
      "Digital Humanities & Media Tech",
      "Web Design & Content Systems",
      "Information Systems for Public Sector"
    ],
    "career_paths": [
      "Digital Media Officer",
      "Web Systems Specialist",
      "Social Data Analyst",
      "Public Sector IT Officer"
    ],
    "total_national_intake": 120
  },
  "129": {
    "course_code": "129",
    "degree_awarded": "BSc (Hons) in Plantation Management",
    "overview": "Comprehensive academic curriculum in Plantation Management & Technology preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Biological Science stream.",
    "specializations": [
      "Applied Plantation Management & Technology",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Plantation Management & Technology Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "130": {
    "course_code": "130",
    "degree_awarded": "BSc (Hons) in Agro-Environmental Science",
    "overview": "Comprehensive academic curriculum in Agro-Environmental Science preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Biological Science stream.",
    "specializations": [
      "Applied Agro-Environmental Science",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Agro-Environmental Science Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "131": {
    "course_code": "131",
    "degree_awarded": "BDes (Hons)",
    "overview": "Comprehensive academic curriculum in Creative Arts & Design preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Arts stream. + Pass Aptitude Test.",
    "specializations": [
      "Applied Creative Arts & Design",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Creative Arts & Design Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Creative design aptitude examination.",
    "total_national_intake": 80
  },
  "132": {
    "course_code": "132",
    "degree_awarded": "BA (Hons) in English Language & Applied Linguistics",
    "overview": "Four-year honors program at Uva Wellassa University covering sociolinguistics, discourse analysis, English for Specific Purposes (ESP), and corporate communication.",
    "al_requirements_summary": "Minimum 3 'S' passes in any stream + O/L English 'C' · Maths 'C' + Pass Aptitude Test.",
    "specializations": [
      "Applied Linguistics & Discourse",
      "English for Specific Purposes (ESP)",
      "Corporate & International Communications",
      "Language Teaching Methodology"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Written paper testing advanced English grammar, reading analysis, essay writing, and oral communication interview conducted by UWU.",
    "career_paths": [
      "Corporate Communications Manager",
      "International Public Relations Officer",
      "Linguistic Specialist",
      "English Lecturer / Educator"
    ],
    "total_national_intake": 70
  },
  "133": {
    "course_code": "133",
    "degree_awarded": "BA (Hons) in Archaeology",
    "overview": "Comprehensive academic curriculum in Archaeology & Heritage Management preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Arts stream.",
    "specializations": [
      "Applied Archaeology & Heritage Management",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Archaeology & Heritage Management Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "134": {
    "course_code": "134",
    "degree_awarded": "BSW (Hons) in Social Work",
    "overview": "Professional social work degree covering clinical case work, community development, child protection, disaster rehabilitation, and psychiatric social work.",
    "al_requirements_summary": "Minimum 3 'S' passes in any stream + Pass Social Work Aptitude Test.",
    "specializations": [
      "Community Social Work",
      "Child Protection & Family Welfare",
      "Psychiatric & Medical Social Work",
      "Disaster & Refugee Rehabilitation"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Social awareness, situational empathy, analytical writing, and personal interview conducted by Faculty of Arts, University of Colombo.",
    "career_paths": [
      "Certified Social Worker",
      "Child Welfare Officer",
      "NGO Program Director",
      "Community Development Specialist"
    ],
    "total_national_intake": 80
  },
  "135": {
    "course_code": "135",
    "degree_awarded": "BSc (Hons) in Marine Science",
    "overview": "Comprehensive academic curriculum in Marine Science & Technology preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Physical Science stream.",
    "specializations": [
      "Applied Marine Science & Technology",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Marine Science & Technology Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "136": {
    "course_code": "136",
    "degree_awarded": "BSc (Hons) in Data Science",
    "overview": "Four-year intensive degree in big data engineering, predictive machine learning, mathematical statistics, cloud analytics, and business intelligence at Sabaragamuwa University.",
    "al_requirements_summary": "At least a 'C' pass in Combined Maths, Higher Maths, or Physics + 2 other passes in Physical Science / ICT + O/L English 'C'.",
    "specializations": [
      "Machine Learning & Predictive Modeling",
      "Big Data Engineering & Cloud Pipelines",
      "Business Analytics & Data Mining",
      "Statistical Modeling & Inference"
    ],
    "career_paths": [
      "Data Scientist",
      "Machine Learning Engineer",
      "Big Data Architect",
      "Business Intelligence Developer"
    ],
    "total_national_intake": 70
  },
  "137": {
    "course_code": "137",
    "degree_awarded": "BEd (Hons) in Primary Education",
    "overview": "Faculty of Education, University of Colombo professional teaching degree in child psychology, curriculum pedagogy, STEM in primary education, and classroom management.",
    "al_requirements_summary": "Minimum 3 'S' passes in any stream + O/L Sinhala 'C', English 'S', Maths 'C', Science 'C' + Pass Aptitude Test.",
    "specializations": [
      "Primary Curriculum & Pedagogy",
      "Child Psychology & Development",
      "Special Needs & Inclusive Education",
      "STEM Education in Primary Schools"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Written examination on general knowledge, analytical thinking, language skills, and a teaching aptitude interview conducted by Faculty of Education, University of Colombo.",
    "career_paths": [
      "Primary School Teacher / Sectional Head",
      "Curriculum Development Officer (Ministry of Education)",
      "Child Education Consultant",
      "Primary Educational Researcher"
    ],
    "total_national_intake": 120
  },
  "138": {
    "course_code": "138",
    "degree_awarded": "BSc (Hons) in Medical Imaging Technology",
    "overview": "Advanced four-year healthcare imaging curriculum in specialized vascular imaging, interventional ultrasound, radiation oncology imaging, and digital radiography physics.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics at G.C.E. (A/L) at a single sitting.",
    "specializations": [
      "Interventional Imaging Technology",
      "Radiation Oncology Physics & Imaging",
      "Clinical Ultrasound Diagnostics",
      "Nuclear Medicine Imaging"
    ],
    "career_paths": [
      "Medical Imaging Technologist (SLMC)",
      "Radiation Oncology Imaging Specialist",
      "Ultrasound Imaging Consultant",
      "Diagnostic Center Imaging Manager"
    ],
    "total_national_intake": 45
  },
  "139": {
    "course_code": "139",
    "degree_awarded": "BSc (Hons) in Nano Science Technology",
    "overview": "Comprehensive academic curriculum in Nano Science Technology preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Physical Science stream.",
    "specializations": [
      "Applied Nano Science Technology",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Nano Science Technology Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "140": {
    "course_code": "140",
    "degree_awarded": "BA (Hons) in International Relations",
    "overview": "Four-year honors curriculum in foreign policy analysis, international treaty law, security studies, global trade governance, and diplomatic history at University of Colombo.",
    "al_requirements_summary": "Minimum 3 'S' passes in Arts, Commerce, or Science stream with approved subjects.",
    "specializations": [
      "Diplomacy & Foreign Policy",
      "International Political Economy",
      "Global Security & Strategic Studies",
      "International Organizations & Law"
    ],
    "career_paths": [
      "Diplomatic Foreign Service Officer (SLFS)",
      "International Policy Analyst",
      "UN / Global Agency Program Officer",
      "Geopolitical Risk Analyst"
    ],
    "total_national_intake": 85
  },
  "141": {
    "course_code": "141",
    "degree_awarded": "BSc (Hons) in Sports Science",
    "overview": "Comprehensive sports science, physiological exercise diagnostics, athletic talent identification, and physical conditioning at University of Kelaniya.",
    "al_requirements_summary": "Minimum 3 'S' passes in any stream + Pass Physical Fitness & Sports Aptitude Assessment.",
    "specializations": [
      "Exercise Physiology & Fitness",
      "Sports Biomechanics & Video Analysis",
      "Talent Identification & Development",
      "Conditioning Program Design"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Certified sports achievement portfolio review + practical physical fitness endurance assessment conducted by University of Kelaniya.",
    "career_paths": [
      "Sports Scientist",
      "National Team Fitness Coach",
      "Exercise Physiologist",
      "Athletic Development Director"
    ],
    "total_national_intake": 70
  },
  "142": {
    "course_code": "142",
    "degree_awarded": "BPA (Hons) in Music Technology",
    "overview": "Comprehensive academic curriculum in Creative Music Technology preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Arts stream. + Pass Aptitude Test.",
    "specializations": [
      "Applied Creative Music Technology",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Creative Music Technology Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Audio production & musical aptitude audition.",
    "total_national_intake": 80
  },
  "001": {
    "course_code": "001",
    "degree_awarded": "MBBS",
    "overview": "Five-year clinical medical program comprising pre-clinical, para-clinical, and intensive clinical hospital professorial appointments. Graduates qualify for provisional registration as Medical Officers under the Sri Lanka Medical Council (SLMC).",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics at G.C.E. (A/L) at a single sitting.",
    "specializations": [
      "Clinical Medicine",
      "General Surgery",
      "Paediatrics",
      "Obstetrics & Gynaecology",
      "Psychiatry"
    ],
    "career_paths": [
      "Medical Officer (Ministry of Health)",
      "Consultant Physician / Surgeon",
      "Medical Researcher",
      "Healthcare Administrator"
    ],
    "total_national_intake": 2155,
    "differently_abled_quota": 10
  },
  "002": {
    "course_code": "002",
    "degree_awarded": "BDS",
    "overview": "Five-year comprehensive dental curriculum including craniofacial anatomy, operative dentistry, orthodontics, oral and maxillofacial surgery, and hospital clinical clerkships leading to SLMC Dental Practitioner registration.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics at G.C.E. (A/L) at a single sitting.",
    "specializations": [
      "Oral & Maxillofacial Surgery",
      "Orthodontics",
      "Restorative Dentistry",
      "Periodontology",
      "Community Dentistry"
    ],
    "career_paths": [
      "Dental Surgeon (Govt/Private Hospitals)",
      "Orthodontist Specialist",
      "Oral Pathologist",
      "Dental Public Health Officer"
    ],
    "total_national_intake": 175,
    "differently_abled_quota": 3
  },
  "003": {
    "course_code": "003",
    "degree_awarded": "BVSc",
    "overview": "Five-year veterinary medical program covering domestic animal health, veterinary pathology, surgical interventions, dairy livestock management, and wildlife conservation leading to Veterinary Council registration.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics at G.C.E. (A/L) at a single sitting.",
    "specializations": [
      "Veterinary Clinical Medicine",
      "Farm Animal Health",
      "Wildlife & Zoo Medicine",
      "Animal Reproduction & Genetics"
    ],
    "career_paths": [
      "Veterinary Surgeon (DAPH)",
      "Livestock Production Manager",
      "Wildlife Veterinarian",
      "Animal Nutrition Specialist"
    ],
    "total_national_intake": 140,
    "differently_abled_quota": 2
  },
  "004": {
    "course_code": "004",
    "degree_awarded": "BSc (Hons) in Agricultural Technology & Management",
    "overview": "Four-year multidisciplinary degree covering agricultural biology, soil science, crop economics, post-harvest engineering, and precision farming with a mandatory 6-month farm internship.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and either Physics or Agricultural Science at G.C.E. (A/L).",
    "specializations": [
      "Crop Science",
      "Soil & Water Management",
      "Agricultural Economics",
      "Animal Science",
      "Food Science & Tech"
    ],
    "career_paths": [
      "Agricultural Officer (DOA)",
      "Plantation Superintendent",
      "Agribusiness Consultant",
      "Crop Research Scientist"
    ],
    "total_national_intake": 1100,
    "differently_abled_quota": 15
  },
  "005": {
    "course_code": "005",
    "degree_awarded": "BSc (Hons) in Agricultural Technology & Management",
    "overview": "Technology-driven agricultural program integrating smart automated irrigation, hydroponics, agricultural robotics, and commercial farm supply chain systems.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics or Agricultural Science at G.C.E. (A/L).",
    "specializations": [
      "Farm Mechanization",
      "Soil & Environmental Sciences",
      "Agro-Enterprise Systems",
      "Post-Harvest Technology"
    ],
    "career_paths": [
      "Smart Agriculture Specialist",
      "Farm Automation Manager",
      "Agri-Supply Chain Director",
      "Agronomist"
    ],
    "total_national_intake": 320
  },
  "006": {
    "course_code": "006",
    "degree_awarded": "BSc (Hons) in Food Science & Technology",
    "overview": "Four-year industrial science program focusing on food chemistry, thermal processing, sensory evaluation, packaging engineering, and ISO/HACCP food safety certifications.",
    "al_requirements_summary": "Minimum 3 'S' passes in Chemistry, Physics, and Biology (or Agricultural Science) at G.C.E. (A/L).",
    "specializations": [
      "Food Chemistry & Analysis",
      "Food Processing & Preservation",
      "Food Quality Assurance",
      "Product Development & Sensory"
    ],
    "career_paths": [
      "Food Quality Assurance Manager",
      "R&D Food Technologist",
      "Food Safety Auditor (HACCP/ISO)",
      "Production Executive"
    ],
    "total_national_intake": 260
  },
  "007": {
    "course_code": "007",
    "degree_awarded": "BSc (Hons) in Animal Science",
    "overview": "Specialized study in livestock breeding, dairy farm management, poultry production, animal genetics, and feed biotechnology to strengthen national animal protein production.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics or Agricultural Science at G.C.E. (A/L).",
    "specializations": [
      "Dairy Science & Technology",
      "Poultry Science",
      "Animal Genetics & Breeding",
      "Meat Science & Processing"
    ],
    "career_paths": [
      "Livestock Development Officer",
      "Dairy Processing Executive",
      "Poultry Production Manager",
      "Feed Formulation Scientist"
    ],
    "total_national_intake": 180
  },
  "008": {
    "course_code": "008",
    "degree_awarded": "BScEng (Hons)",
    "overview": "Four-year Washington Accord-accredited professional engineering program with intensive engineering design, laboratory practica, and 6-month industrial internship accredited by IESL.",
    "al_requirements_summary": "Minimum 3 'S' passes in Combined Mathematics, Physics, and Chemistry at G.C.E. (A/L).",
    "specializations": [
      "Computer Science & Engineering",
      "Civil Engineering",
      "Electrical & Electronic Engineering",
      "Mechanical Engineering",
      "Chemical & Process Engineering",
      "Materials Science",
      "Biomedical Engineering"
    ],
    "career_paths": [
      "Chartered Engineer (IESL)",
      "Software / Systems Architect",
      "Civil Structural Consultant",
      "Power & Energy Specialist"
    ],
    "total_national_intake": 2350,
    "differently_abled_quota": 20
  },
  "009": {
    "course_code": "009",
    "degree_awarded": "BScEng (Hons) in Earth Resources Engineering",
    "overview": "Specialized engineering curriculum at University of Moratuwa covering mineral exploration, petroleum geomechanics, GIS/remote sensing, tunnelling, and quarry engineering.",
    "al_requirements_summary": "Minimum 3 'S' passes in Combined Mathematics, Physics, and Chemistry at G.C.E. (A/L).",
    "specializations": [
      "Mining Engineering",
      "Mineral Processing",
      "Ocean Resources Engineering",
      "Petroleum Geotechnology"
    ],
    "career_paths": [
      "Mining Engineer",
      "Geotechnical Consultant",
      "Petroleum Reservoir Specialist",
      "Tunnel & Dam Engineer"
    ],
    "total_national_intake": 60
  },
  "010": {
    "course_code": "010",
    "degree_awarded": "BScEng (Hons) in Textile & Apparel Engineering",
    "overview": "Textile polymers, smart technical fabrics, automated garment manufacturing, supply chain optimization, and sustainable dyeing technologies at University of Moratuwa.",
    "al_requirements_summary": "Minimum 3 'S' passes in Combined Mathematics, Physics, and Chemistry at G.C.E. (A/L).",
    "specializations": [
      "Textile Manufacturing & Polymers",
      "Apparel Engineering & Automation",
      "Technical & Medical Textiles",
      "Garment Wet Processing"
    ],
    "career_paths": [
      "Textile / Apparel Engineer",
      "Production & Lean Manufacturing Manager",
      "Technical Textile Technologist",
      "Apparel Operations Director"
    ],
    "total_national_intake": 65
  },
  "011": {
    "course_code": "011",
    "degree_awarded": "BSc (Hons) in Quantity Surveying",
    "overview": "RICS and IQSSL internationally accredited degree covering construction economics, BIM-enabled cost estimation, contract law, procurement strategy, and arbitration.",
    "al_requirements_summary": "At least 'S' passes in Combined Mathematics (or Higher Maths) and two other approved Physical Science / ICT / Accounting / Economics subjects + O/L English 'C', Maths 'C', Science 'S'.",
    "specializations": [
      "Commercial Management",
      "Construction Contract Law & Arbitration",
      "Cost Planning & BIM Estimation",
      "Infrastructure Procurement"
    ],
    "career_paths": [
      "Chartered Quantity Surveyor (RICS/IQSSL)",
      "Commercial Manager",
      "Construction Claims & Arbitration Consultant",
      "Project Cost Controller"
    ],
    "total_national_intake": 140
  },
  "012": {
    "course_code": "012",
    "degree_awarded": "BSc (Hons) in Computer Science",
    "overview": "Rigorous academic computer science program emphasizing algorithm design, compiler theory, distributed computing, artificial intelligence, and operating systems with mandatory capstone research.",
    "al_requirements_summary": "At least a 'C' pass in Combined Mathematics, Higher Mathematics, or Physics AND 'S' passes in two other approved Physical Science / ICT subjects.",
    "specializations": [
      "Artificial Intelligence & Machine Learning",
      "Cloud & Distributed Systems",
      "Cyber Security",
      "Theoretical Computer Science",
      "Software Systems"
    ],
    "career_paths": [
      "Lead Software Engineer",
      "AI / ML Engineer",
      "Systems Architect",
      "Security Operations Engineer"
    ],
    "total_national_intake": 380
  },
  "013": {
    "course_code": "013",
    "degree_awarded": "BSc / BSc (Hons) in Physical Science",
    "overview": "Three-year general or four-year honours degree offering specialized research streams in Applied Mathematics, Physics, Statistics, and Scientific Computing with broad industry applications.",
    "al_requirements_summary": "Minimum 3 'S' passes in Combined Mathematics, Physics, and Chemistry / ICT at G.C.E. (A/L).",
    "specializations": [
      "Applied Mathematics",
      "Nuclear & Applied Physics",
      "Industrial Statistics",
      "Scientific Computing",
      "Data Analytics"
    ],
    "career_paths": [
      "Data Analyst / Scientist",
      "Actuarial Analyst",
      "Research Physicist",
      "Operations Research Analyst"
    ],
    "total_national_intake": 2300
  },
  "014": {
    "course_code": "014",
    "degree_awarded": "BSc / BSc (Hons) in Biological Science",
    "overview": "Comprehensive biological training in molecular genetics, microbiology, botany, zoology, biochemistry, and ecology preparing graduates for healthcare diagnostics and environmental stewardship.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics (or Agricultural Science) at G.C.E. (A/L).",
    "specializations": [
      "Molecular Biology & Biotechnology",
      "Microbiology",
      "Plant Sciences",
      "Zoology & Wildlife Biology",
      "Biochemistry"
    ],
    "career_paths": [
      "Biotechnologist",
      "Diagnostic Laboratory Specialist",
      "Environmental Conservationist",
      "Pharmaceutical QC Analyst"
    ],
    "total_national_intake": 2100
  },
  "015": {
    "course_code": "015",
    "degree_awarded": "BSc (Hons) in Applied Sciences",
    "overview": "Industry-aligned applied science curriculum integrating environmental biology, microbial biotechnology, industrial chemistry, and computational biology with industrial internships.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics / Agricultural Science at G.C.E. (A/L).",
    "specializations": [
      "Industrial Microbiology",
      "Environmental Technology",
      "Natural Products Chemistry",
      "Food Quality Assessment"
    ],
    "career_paths": [
      "Applied Science Researcher",
      "Environmental Consultant",
      "Microbiology Laboratory Manager",
      "Bio-Process Scientist"
    ],
    "total_national_intake": 350
  },
  "016": {
    "course_code": "016",
    "degree_awarded": "BSc (Hons) in Business Administration",
    "overview": "Prestigious business curriculum covering financial accounting, strategic management, marketing analytics, HR organizational behavior, and supply chains accredited by CA Sri Lanka and CIMA.",
    "al_requirements_summary": "Minimum 3 'S' passes in Commerce stream subjects (Accounting, Business Studies, Economics, or Business Statistics).",
    "specializations": [
      "Accounting & Finance",
      "Human Resource Management",
      "Marketing Management",
      "Business Economics",
      "Supply Chain Management",
      "Business Information Systems"
    ],
    "career_paths": [
      "Financial Analyst / Auditor",
      "Brand Manager",
      "HR Business Partner",
      "Management Consultant"
    ],
    "total_national_intake": 4800
  },
  "017": {
    "course_code": "017",
    "degree_awarded": "BCom (Hons)",
    "overview": "Focused study in international trade finance, corporate auditing, taxation systems, macroeconomic forecasting, and commercial banking operations.",
    "al_requirements_summary": "Minimum 3 'S' passes in Commerce stream subjects including Accounting or Economics.",
    "specializations": [
      "Commerce & International Trade",
      "Financial Management",
      "Business Information Systems",
      "Taxation & Auditing"
    ],
    "career_paths": [
      "Chartered Accountant",
      "Tax Advisor",
      "Commercial Banker",
      "Treasury & Investment Analyst"
    ],
    "total_national_intake": 850
  },
  "018": {
    "course_code": "018",
    "degree_awarded": "BSc (Hons) in Real Estate Management & Valuation",
    "overview": "Specialized four-year program at USJP producing certified government and corporate real estate valuers, property asset managers, and land economists.",
    "al_requirements_summary": "Minimum 3 'S' passes in Commerce, Physical Science, or Arts stream with Economics/Accounting/Maths.",
    "specializations": [
      "Property Valuation & Taxation",
      "Real Estate Asset Management",
      "Land Economics & Urban Development",
      "Property Investment Analysis"
    ],
    "career_paths": [
      "Government / Licensed Property Valuer",
      "Real Estate Portfolio Manager",
      "Urban Land Economist",
      "Property Asset Consultant"
    ],
    "total_national_intake": 90
  },
  "019": {
    "course_code": "019",
    "degree_awarded": "BA / BAHons",
    "overview": "Broad humanities curriculum in sociology, economics, history, languages, international relations, and political science fostering critical thinking and civic leadership.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved Arts subjects (Selected 100% on All-Island Merit rank).",
    "specializations": [
      "Economics",
      "Sociology & Social Policy",
      "Political Science",
      "History & Archaeology",
      "Sinhala / Tamil / English Literature"
    ],
    "special_intake_quota_note": "100% All-Island Merit Selection (No District Quotas)",
    "career_paths": [
      "Sri Lanka Administrative Service (SLAS)",
      "Diplomat / Foreign Service Officer",
      "Social Policy Analyst",
      "Journalist / Media Director"
    ],
    "total_national_intake": 9500
  },
  "020": {
    "course_code": "020",
    "degree_awarded": "BAHons in Mass Media",
    "overview": "Four-year program at Sripalee Campus covering investigative broadcast journalism, digital cinematography, media ethics, and public relations.",
    "al_requirements_summary": "Minimum 3 'S' passes in any stream + O/L English 'S' + Pass Practical/Aptitude Test.",
    "specializations": [
      "Broadcast Journalism",
      "Digital Content Creation",
      "Public Relations & Corporate Comms",
      "Television & Radio Production"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Written paper assessing media awareness, creative writing, and current social affairs conducted by Sripalee Campus, University of Colombo.",
    "career_paths": [
      "Journalist / News Anchor",
      "Corporate Communications Director",
      "Digital Media Producer",
      "PR Campaign Manager"
    ],
    "total_national_intake": 140
  },
  "021": {
    "course_code": "021",
    "degree_awarded": "BAHons in Social Sciences & Languages",
    "overview": "Sabaragamuwa University arts program blending modern languages (German, Japanese, Chinese, Hindi), economics, statistics, and geography.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved Arts or Commerce subjects.",
    "specializations": [
      "Foreign Languages & Linguistics",
      "Economics & Statistics",
      "Geography & Environmental Management",
      "Social Sciences"
    ],
    "career_paths": [
      "International Trade Officer",
      "Tourism & Cultural Attaché",
      "Linguist / Language Specialist",
      "Socio-Economic Researcher"
    ],
    "total_national_intake": 320
  },
  "022": {
    "course_code": "022",
    "degree_awarded": "BSc (Hons) in Information Technology",
    "overview": "Software engineering, database architecture, network security, and enterprise solutions development aligned with CSSL industry standards.",
    "al_requirements_summary": "Minimum 3 'S' passes in any stream or ICT + approved maths/science subjects.",
    "specializations": [
      "Software Architecture",
      "Network & Cloud Security",
      "Data Engineering",
      "Web & Mobile App Engineering"
    ],
    "career_paths": [
      "Full Stack Software Engineer",
      "Cloud Infrastructure Engineer",
      "Database Administrator",
      "IT Project Manager"
    ],
    "total_national_intake": 250
  },
  "023": {
    "course_code": "023",
    "degree_awarded": "BArch (Hons)",
    "overview": "Five-year RIBA Part I and SLIA accredited professional architectural program with design studios, sustainable bioclimatic building, urban design, and heritage conservation.",
    "al_requirements_summary": "Minimum 3 'S' passes in any stream + O/L English 'S' · Maths 'C' (or A/L Maths S) + Pass Spatial Aptitude Test.",
    "specializations": [
      "Sustainable Architecture",
      "Urban Design & Landscape",
      "Architectural Conservation",
      "Interior Architecture"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Rigorous spatial perception, freehand drawing, design aesthetics, and critical reasoning exam conducted by Faculty of Architecture, University of Moratuwa.",
    "career_paths": [
      "Chartered Architect (SLIA/RIBA)",
      "Urban Spatial Designer",
      "Sustainable Design Consultant",
      "Heritage Conservation Architect"
    ],
    "total_national_intake": 90
  },
  "024": {
    "course_code": "024",
    "degree_awarded": "BDes (Hons)",
    "overview": "Four-year industrial design, graphic design, and UI/UX degree teaching design thinking, 3D prototyping, ergonomic engineering, and creative branding at UOM.",
    "al_requirements_summary": "Minimum 3 'S' passes in any stream + O/L English 'S' · Maths 'C' · Science 'C' + Pass Creative Aptitude Test.",
    "specializations": [
      "Industrial & Product Design",
      "Graphic Communication Design",
      "Fashion & Lifestyle Design",
      "Interaction & UI/UX Design"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Creative visualization, lateral thinking, aesthetic judgment, and technical sketching exam conducted by University of Moratuwa.",
    "career_paths": [
      "Industrial Product Designer",
      "UI/UX Product Designer",
      "Creative Brand Director",
      "Design Strategist"
    ],
    "total_national_intake": 60
  },
  "025": {
    "course_code": "025",
    "degree_awarded": "LLB (Hons)",
    "overview": "Prestigious four-year legal program covering constitutional law, commercial arbitration, criminal jurisprudence, and human rights, leading to Sri Lanka Law College Bar exams.",
    "al_requirements_summary": "Minimum 3 'S' passes in Bio Science, Physical Science, Commerce, or approved Arts baskets + O/L English 'C' and Sinhala OR Tamil 'C'.",
    "specializations": [
      "Commercial & Corporate Law",
      "Constitutional & Administrative Law",
      "Criminal Law & Procedure",
      "International Human Rights & Environmental Law"
    ],
    "career_paths": [
      "Attorney-at-Law (Bar Association of Sri Lanka)",
      "Corporate Legal Counsel",
      "Judicial Service Magistrate / Judge",
      "Legal Policy Advisor"
    ],
    "total_national_intake": 320
  },
  "026": {
    "course_code": "026",
    "degree_awarded": "BSc (Hons) in Information Technology",
    "overview": "Flagship University of Moratuwa computing degree with world-class faculty, software engineering hackathons, 6-month industrial internships, and high tech company placements.",
    "al_requirements_summary": "At least a 'C' pass in Combined Maths, Higher Maths, Mathematics, or Physics + 2 other 'S' passes.",
    "specializations": [
      "Software Systems Engineering",
      "Cyber Security & Forensic Computing",
      "Cloud & DevOps Engineering",
      "Data Science & Big Data"
    ],
    "career_paths": [
      "Senior Software Engineer",
      "DevOps & Cloud Architect",
      "Security Analyst",
      "Tech Lead / CTO"
    ],
    "total_national_intake": 350
  },
  "027": {
    "course_code": "027",
    "degree_awarded": "BSc (Hons) in Management and Information Technology",
    "overview": "Unique blend of business strategy and cutting-edge computing at University of Kelaniya, designed to produce tech entrepreneurs, ERP consultants, and enterprise architects.",
    "al_requirements_summary": "At least a 'C' pass in Combined Maths, Higher Maths, or Physics + 2 'S' passes in Bio/Physical Science or ICT + O/L Maths 'B' and O/L English 'C'.",
    "specializations": [
      "Business Analytics & Enterprise Systems",
      "Software Engineering & IT Architecture",
      "Operations & Supply Chain Management",
      "Information Systems Security"
    ],
    "special_intake_quota_note": "40% Biological Science / 60% Physical Science & ICT split",
    "career_paths": [
      "ERP / SAP Solutions Consultant",
      "Business Systems Analyst",
      "Product Manager (Tech)",
      "Fintech Specialist"
    ],
    "total_national_intake": 120
  },
  "028": {
    "course_code": "028",
    "degree_awarded": "BA (Hons) in Peace & Conflict Resolution",
    "overview": "Interdisciplinary program in international diplomacy, restorative justice, humanitarian intervention, and reconciliation studies at University of Kelaniya.",
    "al_requirements_summary": "Minimum 3 'S' passes in any stream with approved Arts/Social Sciences subjects.",
    "specializations": [
      "Conflict Analysis & Mediation",
      "Humanitarian Governance",
      "Human Rights & Transitional Justice",
      "Diplomatic Studies"
    ],
    "career_paths": [
      "UN / NGO Humanitarian Officer",
      "Peace Mediation Specialist",
      "Foreign Policy Analyst",
      "Reconciliation Officer"
    ],
    "total_national_intake": 75
  },
  "029": {
    "course_code": "029",
    "degree_awarded": "BA (Hons) in Communication Studies",
    "overview": "Trincomalee Campus program in mass communication, digital publishing, media linguistics, and strategic development communication.",
    "al_requirements_summary": "Minimum 3 'S' passes in any stream + O/L English 'C'.",
    "specializations": [
      "Media Studies & Production",
      "Development Communication",
      "Corporate Public Relations",
      "Digital Journalism"
    ],
    "career_paths": [
      "Media Planner & Strategist",
      "Corporate Communications Executive",
      "Digital Journalist",
      "Advertising Copywriter"
    ],
    "total_national_intake": 110
  },
  "030": {
    "course_code": "030",
    "degree_awarded": "BSc (Hons) in Town & Country Planning",
    "overview": "Accredited by the Institute of Town Planners Sri Lanka (ITPSL) and RTPI UK, teaching GIS spatial modeling, master planning, traffic engineering, and resilient smart city design at UOM.",
    "al_requirements_summary": "Minimum 3 'S' passes in any stream + O/L English 'B' and Maths 'C'.",
    "specializations": [
      "Smart Cities & GIS Spatial Analytics",
      "Urban Infrastructure & Transport Planning",
      "Environmental & Disaster Management",
      "Regional Economic Planning"
    ],
    "career_paths": [
      "Chartered Urban / Town Planner (ITPSL)",
      "GIS Spatial Analyst",
      "Urban Transportation Specialist",
      "Disaster Mitigation Consultant"
    ],
    "total_national_intake": 80
  },
  "031": {
    "course_code": "031",
    "degree_awarded": "BA (Hons) in Islamic Studies",
    "overview": "Comprehensive degree in Islamic theology, comparative religion, Islamic banking jurisprudence, Arabic classical literature, and Islamic law at SEUSL.",
    "al_requirements_summary": "Minimum 3 'S' passes in Arts stream with Islamic Civilisation or Arabic.",
    "specializations": [
      "Islamic Banking & Jurisprudence",
      "Quranic Sciences & Hadith",
      "Islamic History & Civilisation",
      "Islamic Commercial Law"
    ],
    "career_paths": [
      "Islamic Banking Shariah Advisor",
      "Islamic Educator",
      "Community Mediator",
      "Cultural Researcher"
    ],
    "total_national_intake": 220
  },
  "032": {
    "course_code": "032",
    "degree_awarded": "BAMS (Bachelor of Ayurveda Medicine & Surgery)",
    "overview": "Six-year holistic medical program including one-year hospital clinical internship, covering Dravyaguna (herbal pharmacology), Panchakarma therapy, and classical pathology leading to Ayurvedic Medical Council registration.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics at G.C.E. (A/L).",
    "specializations": [
      "Panchakarma Clinical Therapy",
      "Dravyaguna (Herbal Pharmacology)",
      "Shalya Tantra (Surgical Traditions)",
      "Kaumarbhritya (Paediatrics)"
    ],
    "career_paths": [
      "Ayurvedic Medical Officer (Govt/Private)",
      "Herbal Drug Formulation Scientist",
      "Wellness Resort Medical Director",
      "Panchakarma Specialist"
    ],
    "total_national_intake": 280
  },
  "033": {
    "course_code": "033",
    "degree_awarded": "BUMS (Bachelor of Unani Medicine & Surgery)",
    "overview": "Six-year Greco-Arabic clinical medical curriculum including pathology, Ilmul Advia (pharmacology), Moalajat (therapeutics), and hospital clinical residency.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics at G.C.E. (A/L).",
    "specializations": [
      "Kulliyat (Principles of Medicine)",
      "Ilmul Advia (Unani Pharmacology)",
      "Moalajat (Clinical Medicine)",
      "Jarahat (Unani Surgery)"
    ],
    "career_paths": [
      "Unani Medical Officer",
      "Natural Therapeutics Consultant",
      "Herbal Formulation Technologist",
      "Clinical Researcher"
    ],
    "total_national_intake": 80
  },
  "034": {
    "course_code": "034",
    "degree_awarded": "BDes (Hons) in Fashion Design & Product Development",
    "overview": "University of Moratuwa high-fashion and garment technical degree in creative collection development, pattern engineering, 3D CLO software, and export apparel merchandise.",
    "al_requirements_summary": "Minimum 3 'S' passes in any stream + O/L English 'C', Maths 'C', Science 'C' + Pass Fashion Aptitude Test.",
    "specializations": [
      "Apparel Collection Design",
      "Textile Print & Surface Ornamentation",
      "Fashion Merchandising & Branding",
      "Technical Activewear & Footwear"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Fashion illustration, 2D-to-3D garment form creation, color sensitivity, and written creative brief test conducted by University of Moratuwa.",
    "career_paths": [
      "Fashion Apparel Designer",
      "Creative Garment Merchandiser",
      "Apparel Brand Manager",
      "Textile Print Designer"
    ],
    "total_national_intake": 60
  },
  "035": {
    "course_code": "035",
    "degree_awarded": "BSc (Hons) in Food Science & Nutrition",
    "overview": "Wayamba University degree covering clinical dietetics, public health nutrition, biochemical toxicology, and specialized functional foods development.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics or Agricultural Science at G.C.E. (A/L).",
    "specializations": [
      "Clinical Dietetics & Nutritional Therapy",
      "Applied Food Science & Tech",
      "Community Health Nutrition",
      "Sports Nutrition & Metabolism"
    ],
    "career_paths": [
      "Hospital Clinical Dietitian",
      "Nutrition Policy Consultant",
      "Food Industry Quality Specialist",
      "Wellness / Sports Nutritionist"
    ],
    "total_national_intake": 180
  },
  "036": {
    "course_code": "036",
    "degree_awarded": "BSMS (Bachelor of Siddha Medicine & Surgery)",
    "overview": "Six-year ancient Dravidian medical curriculum including Siddha pharmacology, Gunapadam, Varmam manual therapy, and clinical hospital clerkships at Jaffna and Eastern Universities.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics at G.C.E. (A/L).",
    "specializations": [
      "Gunapadam (Siddha Pharmacology)",
      "Sirappu Maruthuvam (Special Medicine)",
      "Varmam Therapy & Orthopaedics",
      "Noi Naadal (Siddha Pathology)"
    ],
    "career_paths": [
      "Siddha Medical Officer",
      "Varmam & Musculoskeletal Specialist",
      "Natural Medicine Researcher",
      "Traditional Drug Quality Officer"
    ],
    "total_national_intake": 140
  },
  "037": {
    "course_code": "037",
    "degree_awarded": "BSc (Hons) in Nursing",
    "overview": "Four-year clinical nursing degree in hospital wards, intensive care, oncology, paediatrics, and community health leading to Sri Lanka Medical Council / Sri Lanka Nursing Council registration.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics at G.C.E. (A/L) + O/L English 'S' + Min Height 4' 10\" (147.3 cm) without physical deformity.",
    "specializations": [
      "Critical Care & Trauma Nursing",
      "Paediatric & Neonatal Nursing",
      "Oncology Nursing",
      "Community & Public Health Nursing"
    ],
    "special_intake_quota_note": "Minimum height requirement 4' 10\" (147.3 cm) strictly enforced at physical medical checkup.",
    "career_paths": [
      "Registered Nursing Sister / Officer (SLNC)",
      "Critical Care / ICU Specialist Nurse",
      "International Healthcare Nurse (UK/Aus)",
      "Nursing Lecturer / Researcher"
    ],
    "total_national_intake": 450
  },
  "038": {
    "course_code": "038",
    "degree_awarded": "BSc (Hons) in Information and Communication Technology",
    "overview": "Software applications, cloud infrastructure, network routing, and information system management at Rajarata University and University of Vavuniya.",
    "al_requirements_summary": "At least a 'C' pass in Combined Maths, Physics, or ICT + 2 other 'S' passes + O/L English 'C' and Maths 'C'.",
    "specializations": [
      "Cloud Computing & Virtualization",
      "Cyber Security Systems",
      "Data Engineering",
      "Web Systems Engineering"
    ],
    "career_paths": [
      "ICT Systems Administrator",
      "Cloud Systems Engineer",
      "Software Developer",
      "Network Security Engineer"
    ],
    "total_national_intake": 220
  },
  "039": {
    "course_code": "039",
    "degree_awarded": "BSc (Hons) in Agricultural Resource Management & Technology",
    "overview": "Four-year agricultural science program at University of Ruhuna focusing on sustainable agro-ecosystems, water resource management, and commercial biotechnology.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics or Agricultural Science at G.C.E. (A/L).",
    "specializations": [
      "Agro-Environmental Systems",
      "Crop Protection & Pathology",
      "Soil & Water Engineering",
      "Agricultural Economics"
    ],
    "career_paths": [
      "Agro-Resource Consultant",
      "Plantation Technical Officer",
      "Crop Protection Specialist",
      "Environmental Manager"
    ],
    "total_national_intake": 140
  },
  "040": {
    "course_code": "040",
    "degree_awarded": "BSc (Hons) in Agribusiness Management",
    "overview": "Commercial farm management, agricultural commodity marketing, value addition chains, and farm financial management at Sabaragamuwa University.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biological Science or Commerce with Economics/Business Studies.",
    "specializations": [
      "Agricultural Commodity Marketing",
      "Agro-Enterprise Finance",
      "Farm Management",
      "Value Chain Logistics"
    ],
    "career_paths": [
      "Agribusiness Manager",
      "Commodity Trading Analyst",
      "Farm Finance Officer",
      "Agricultural Marketing Executive"
    ],
    "total_national_intake": 85
  },
  "041": {
    "course_code": "041",
    "degree_awarded": "BPAHons in Performing Arts",
    "overview": "Four-year performing arts curriculum in classical dance, theatrical direction, music composition, and ethnochoreology at Sripalee Campus, University of Colombo.",
    "al_requirements_summary": "Minimum 3 'S' passes in any stream + O/L English 'S' + Pass Practical Performing Arts Test.",
    "specializations": [
      "Kandyan & Traditional Dance",
      "Oriental & Contemporary Music",
      "Theatrical Acting & Directing",
      "Choreography & Stage Production"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Practical audition evaluating rhythm, pitch accuracy, bodily flexibility, and theatrical performance conducted by Sripalee Campus.",
    "career_paths": [
      "Performing Artist / Choreographer",
      "Theatrical Director",
      "Performing Arts Educator",
      "Cultural Ambassador"
    ],
    "total_national_intake": 120
  },
  "051": {
    "course_code": "051",
    "degree_awarded": "BPharm (Hons)",
    "overview": "Four-year clinical pharmacy program in pharmaceutical chemistry, industrial drug formulation, pharmacokinetics, and hospital dispensing accredited by SLMC.",
    "al_requirements_summary": "At least a 'C' pass in Chemistry AND 'S' passes in Biology and Physics at G.C.E. (A/L) + O/L English 'S'.",
    "specializations": [
      "Industrial Pharmaceutical Manufacturing",
      "Clinical & Hospital Pharmacy",
      "Quality Control & Regulatory Affairs",
      "Medicinal Chemistry & Drug Discovery"
    ],
    "career_paths": [
      "SLMC Registered Pharmacist",
      "Pharmaceutical QC/QA Manager",
      "Clinical Hospital Pharmacist",
      "Regulatory Affairs Specialist"
    ],
    "total_national_intake": 160
  },
  "052": {
    "course_code": "052",
    "degree_awarded": "BSc (Hons) in Medical Laboratory Sciences",
    "overview": "Clinical diagnostic pathology, hematology, medical microbiology, histopathology, and clinical chemistry in tertiary teaching hospitals leading to SLMC registration.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics at G.C.E. (A/L) + O/L English 'S'.",
    "specializations": [
      "Clinical Haematology & Blood Transfusion",
      "Diagnostic Microbiology & Virology",
      "Chemical Pathology",
      "Histopathology & Cytology"
    ],
    "career_paths": [
      "Medical Laboratory Scientist (SLMC)",
      "Diagnostic Laboratory Manager",
      "Transfusion Medicine Technologist",
      "Biomedical Research Scientist"
    ],
    "total_national_intake": 160
  },
  "053": {
    "course_code": "053",
    "degree_awarded": "BSc (Hons) in Radiography",
    "overview": "Four-year clinical diagnostic imaging curriculum at University of Peradeniya covering MRI, CT scanning, fluoroscopy, radiation physics, and nuclear medicine.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics at G.C.E. (A/L) + O/L English 'S'.",
    "specializations": [
      "Diagnostic Magnetic Resonance Imaging (MRI)",
      "Computed Tomography (CT)",
      "Radiation Safety & Protection",
      "Interventional Radiography"
    ],
    "career_paths": [
      "Licensed Radiographer (SLMC)",
      "Chief MRI / CT Imaging Specialist",
      "Radiation Safety Officer",
      "Medical Imaging Systems Specialist"
    ],
    "total_national_intake": 50
  },
  "054": {
    "course_code": "054",
    "degree_awarded": "BSc (Hons) in Physiotherapy",
    "overview": "Four-year physical rehabilitation science program at UOC and UOP covering musculoskeletal manual therapy, neurorehabilitation, cardiopulmonary ICU physiotherapy, and sports medicine.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics at G.C.E. (A/L) + O/L English 'S'.",
    "specializations": [
      "Orthopaedic & Musculoskeletal Therapy",
      "Neurological Rehabilitation",
      "Sports Injury Rehabilitation",
      "Cardiopulmonary Physical Therapy"
    ],
    "career_paths": [
      "Chartered / Licensed Physiotherapist (SLMC)",
      "Sports Team Rehabilitation Specialist",
      "Hospital ICU Physical Therapist",
      "Private Clinic Director"
    ],
    "total_national_intake": 75
  },
  "056": {
    "course_code": "056",
    "degree_awarded": "BSc (Hons) in Facilities Management",
    "overview": "Accredited by RICS and IWFM UK at University of Moratuwa, teaching commercial building lifecycle economics, HVAC energy management, smart IoT facilities, and workplace strategy.",
    "al_requirements_summary": "At least 'C' passes in English, Maths, and Science at O/L + 3 passes in Physical Science / ICT at G.C.E. (A/L).",
    "specializations": [
      "Smart Building Asset Management",
      "Energy & Sustainability Engineering",
      "Workplace Strategy & Space Economics",
      "Health, Safety & Environmental Operations"
    ],
    "career_paths": [
      "Facilities Manager (Hotels/Airports/Commercial Towers)",
      "Energy Audit Director",
      "Corporate Asset Strategist",
      "BIM Operations Manager"
    ],
    "total_national_intake": 60
  },
  "057": {
    "course_code": "057",
    "degree_awarded": "BSc (Hons) in Transport & Logistics Management",
    "overview": "CILT UK accredited program at UOM covering aviation operations, maritime shipping economics, multi-modal supply chains, and freight transportation modeling.",
    "al_requirements_summary": "Minimum 3 'S' passes in Combined Mathematics, Physics, and Chemistry at G.C.E. (A/L).",
    "specializations": [
      "Maritime Logistics & Port Operations",
      "Aviation Systems & Airline Economics",
      "Supply Chain Analytics & Optimization",
      "Urban Public Transport Engineering"
    ],
    "career_paths": [
      "Supply Chain Director",
      "Port Operations & Maritime Manager",
      "Airline Network Logistics Analyst",
      "Freight Forwarding Executive"
    ],
    "total_national_intake": 70
  },
  "058": {
    "course_code": "058",
    "degree_awarded": "BSc (Hons) in Molecular Biology & Plant Biotechnology",
    "overview": "Recombinant DNA technology, CRISPR gene editing, agricultural pathogen resistance, and tissue culture genetics at University of Colombo.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics at G.C.E. (A/L).",
    "specializations": [
      "Genetic Engineering & CRISPR",
      "Plant Tissue Culture",
      "Molecular Diagnostics",
      "Genomics & Bioinformatics"
    ],
    "career_paths": [
      "Molecular Biologist",
      "Biotechnology Research Scientist",
      "Crop Genetics Officer",
      "Genomics Analyst"
    ],
    "total_national_intake": 50
  },
  "059": {
    "course_code": "059",
    "degree_awarded": "BSc (Hons) in Industrial Statistics & Mathematical Finance",
    "overview": "Quantitative mathematical finance, stochastic calculus, actuarial science, statistical quality control, and predictive machine learning at University of Colombo.",
    "al_requirements_summary": "At least a 'C' pass in Combined Maths or Higher Maths + 2 other approved Physical Science subjects.",
    "specializations": [
      "Actuarial Science & Insurance Math",
      "Mathematical Finance & Risk Analysis",
      "Industrial Statistical Quality Control",
      "Machine Learning & Predictive Modeling"
    ],
    "career_paths": [
      "Actuary / Risk Modeler",
      "Financial Quantitative Analyst",
      "Data Scientist",
      "Statistical Operations Analyst"
    ],
    "total_national_intake": 90
  },
  "060": {
    "course_code": "060",
    "degree_awarded": "BSc (Hons) in Statistics & Operations Research",
    "overview": "University of Peradeniya program in linear programming, operations research modeling, Bayesian statistics, and industrial quality management.",
    "al_requirements_summary": "At least a 'C' pass in Combined Mathematics + 2 other Physical Science subjects.",
    "specializations": [
      "Operations Research Optimization",
      "Applied Econometrics",
      "Biostatistics",
      "Supply Chain Modeling"
    ],
    "career_paths": [
      "Operations Research Analyst",
      "Supply Chain Optimization Engineer",
      "Biostatistician",
      "Quantitative Modeler"
    ],
    "total_national_intake": 60
  },
  "061": {
    "course_code": "061",
    "degree_awarded": "BSc (Hons) in Computation & Management",
    "overview": "Unique degree blending computer algorithms, relational databases, financial accounting, and organizational leadership at University of Peradeniya.",
    "al_requirements_summary": "Passes in Combined Maths, Higher Maths, or Physics + Economics/Accounting/Chemistry.",
    "specializations": [
      "Enterprise Management Information Systems",
      "Computational Finance",
      "E-Commerce & Digital Strategy",
      "Software Project Management"
    ],
    "career_paths": [
      "IT Business Analyst",
      "Software Project Manager",
      "Fintech Specialist",
      "Enterprise IT Consultant"
    ],
    "total_national_intake": 50
  },
  "062": {
    "course_code": "062",
    "degree_awarded": "BSc (Hons) in Fisheries & Marine Sciences",
    "overview": "Oceanography, aquaculture engineering, marine bio-diversity, commercial fish stock assessment, and marine biotechnology at University of Ruhuna.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics or Agricultural Science at G.C.E. (A/L).",
    "specializations": [
      "Aquaculture & Hatchery Management",
      "Oceanography & Marine Ecology",
      "Post-Harvest Fishery Tech",
      "Limnology & Aquatic Resources"
    ],
    "career_paths": [
      "Marine Biologist / Oceanographer",
      "Commercial Aquaculture Manager",
      "Fisheries Development Officer (NAQDA)",
      "Marine Environmental Consultant"
    ],
    "total_national_intake": 120
  },
  "063": {
    "course_code": "063",
    "degree_awarded": "BSc (Hons) in Marine & Freshwater Sciences",
    "overview": "Aquatic ecology, wetland conservation, environmental water testing, and marine coastal ecosystem preservation at University of Ruhuna.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics or Agricultural Science at G.C.E. (A/L).",
    "specializations": [
      "Marine Environmental Science",
      "Freshwater Conservation",
      "Water Quality Monitoring",
      "Coastal Zone Management"
    ],
    "career_paths": [
      "Aquatic Environmental Officer",
      "Marine Park Conservator",
      "Hydrological Researcher",
      "Water Quality Analyst"
    ],
    "total_national_intake": 60
  },
  "064": {
    "course_code": "064",
    "degree_awarded": "BSc (Hons) in Information Systems",
    "overview": "Enterprise systems analysis, database design, cybersecurity policy, and IT service governance at UCSC and Rajarata University.",
    "al_requirements_summary": "Minimum 3 'S' passes in any stream + O/L Maths 'C' and English 'C'.",
    "specializations": [
      "IT Governance & Audit",
      "Enterprise Architecture",
      "Business Systems Analysis",
      "Database Administration"
    ],
    "career_paths": [
      "IT Systems Analyst",
      "IT Auditor",
      "Database Administrator",
      "Solutions Consultant"
    ],
    "total_national_intake": 120
  },
  "065": {
    "course_code": "065",
    "degree_awarded": "BSc (Hons) in Software Engineering",
    "overview": "Software construction, cloud deployment pipelines, automated testing, and agile methodologies at University of Kelaniya.",
    "al_requirements_summary": "At least a 'C' pass in Combined Maths, Higher Maths, or Physics + 2 other approved subjects.",
    "specializations": [
      "Cloud Software Engineering",
      "Mobile Architecture",
      "Software Security & Testing",
      "Microservices Architecture"
    ],
    "career_paths": [
      "Software Engineer",
      "Cloud Developer",
      "Test Automation Engineer",
      "DevOps Specialist"
    ],
    "total_national_intake": 90
  },
  "068": {
    "course_code": "068",
    "degree_awarded": "BSc (Hons) in Sports Science & Management",
    "overview": "Sports biomechanics, exercise physiology, sports psychology, athlete nutrition, and commercial sports organization management at USJP, SUSL, and UOK.",
    "al_requirements_summary": "Minimum 3 'S' passes in any stream + Pass Practical Physical & Sports Aptitude Test.",
    "specializations": [
      "Sports Biomechanics & Performance Analysis",
      "Sports Management & Marketing",
      "Exercise Physiology & Rehabilitation",
      "Coaching Pedagogy"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Practical physical endurance trial (400m run, push-ups, agility shuttle) + certified sports achievement score conducted by SUSL, USJP, and UOK.",
    "career_paths": [
      "Sports High-Performance Director",
      "Strength & Conditioning Coach",
      "Sports Event & Venue Manager",
      "National Team Biomechanist"
    ],
    "total_national_intake": 180
  },
  "069": {
    "course_code": "069",
    "degree_awarded": "BSc (Hons) in Physical Education",
    "overview": "Physical education pedagogy, sports science, school athletics coaching, and recreation management at Sabaragamuwa and Jaffna Universities.",
    "al_requirements_summary": "Minimum 3 'S' passes in any stream + Pass Physical Fitness Aptitude Test.",
    "specializations": [
      "School Physical Education Curriculum",
      "Track & Field Coaching",
      "Recreational Sports Administration",
      "Adapted Physical Activity"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Practical sports skills assessment and physical endurance test conducted by Sabaragamuwa University and University of Jaffna.",
    "career_paths": [
      "Physical Education Director / Teacher",
      "Athletic Coach",
      "Community Fitness Director",
      "Sports Development Officer"
    ],
    "total_national_intake": 110
  },
  "070": {
    "course_code": "070",
    "degree_awarded": "BSc (Hons) in Speech & Hearing Sciences",
    "overview": "Four-year clinical audiology and speech therapy degree at University of Kelaniya covering pediatric language delays, cochlear implants, and neurogenic communication disorders.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics + Pass Spoken Aptitude Assessment.",
    "specializations": [
      "Audiology",
      "Speech Language Pathology",
      "Swallowing Disorders",
      "Paediatric Hearing Screening"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Oral communication assessment and hearing awareness evaluation conducted by Faculty of Medicine, University of Kelaniya.",
    "career_paths": [
      "Audiologist (SLMC)",
      "Speech Language Therapist",
      "Hearing Aid Specialist",
      "Clinical Researcher"
    ],
    "total_national_intake": 60
  },
  "071": {
    "course_code": "071",
    "degree_awarded": "BA (Hons) in Translation Studies",
    "overview": "Trilingual interpretation and literary, technical, and legal translation at University of Kelaniya and Sabaragamuwa University.",
    "al_requirements_summary": "Minimum 3 'S' passes in Arts stream + Pass Translation Aptitude Test.",
    "specializations": [
      "Legal Translation",
      "Conference Interpretation",
      "Literary Translation",
      "Technical Localization"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Written translation exam testing syntactic agility and vocabulary translation across Sinhala, Tamil, and English conducted by UOK and SUSL.",
    "career_paths": [
      "Court / Legal Translator",
      "Conference Interpreter",
      "Publishing House Editor",
      "Government Translator"
    ],
    "total_national_intake": 60
  },
  "072": {
    "course_code": "072",
    "degree_awarded": "BA (Hons) in Film & Television Studies",
    "overview": "Screenplay writing, cinematography, audio design, digital editing, and cinema studies at University of Kelaniya.",
    "al_requirements_summary": "Minimum 3 'S' passes in any stream + Pass Creative Film Aptitude Test.",
    "specializations": [
      "Directing & Screenwriting",
      "Cinematography & Lighting",
      "Film Editing & Sound Design",
      "Film Theory & Criticism"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Visual storytelling paper, storyboard sequencing, and creative film script writing test conducted by University of Kelaniya.",
    "career_paths": [
      "Film / Television Director",
      "Cinematographer",
      "Post-Production Editor",
      "Screenwriter"
    ],
    "total_national_intake": 50
  },
  "073": {
    "course_code": "073",
    "degree_awarded": "BSc (Hons) in Animal Science & Fisheries",
    "overview": "Animal nutrition, poultry science, aquaculture management, and veterinary parasitology at University of Peradeniya.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics or Agricultural Science at G.C.E. (A/L).",
    "specializations": [
      "Aquaculture & Aquatic Resources",
      "Dairy Production Technology",
      "Poultry Science",
      "Livestock Breeding"
    ],
    "career_paths": [
      "Livestock Production Officer",
      "Commercial Fish Hatchery Manager",
      "Animal Feed Formulator",
      "Dairy Plant Supervisor"
    ],
    "total_national_intake": 80
  },
  "074": {
    "course_code": "074",
    "degree_awarded": "BSc (Hons) in Export Agriculture",
    "overview": "Commercial cultivation and value-addition of tea, rubber, coconut, cinnamon, pepper, and cardamom at Uva Wellassa University and Sabaragamuwa University.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics or Agricultural Science at G.C.E. (A/L).",
    "specializations": [
      "Spice & Beverage Crops",
      "Agricultural Product Processing",
      "Export Commodity Marketing",
      "Post-Harvest Pathology"
    ],
    "career_paths": [
      "Export Plantation Manager",
      "Spices & Essential Oils Chemist",
      "Commodity Broker",
      "Agri-Export Quality Specialist"
    ],
    "total_national_intake": 120
  },
  "075": {
    "course_code": "075",
    "degree_awarded": "BSc (Hons) in Industrial Information Technology",
    "overview": "Four-year honors degree at Uva Wellassa University bridging industrial manufacturing, ERP, IoT industrial automation, and enterprise database systems.",
    "al_requirements_summary": "At least a 'C' pass in Combined Maths, Physics, or ICT + 2 other 'S' passes + O/L English 'C' and Maths 'C'.",
    "specializations": [
      "Industrial IoT & Automation",
      "Enterprise Software Systems",
      "Manufacturing Data Analytics",
      "Applied Network Infrastructure"
    ],
    "career_paths": [
      "Industrial Automation Engineer",
      "ERP Technical Specialist",
      "Manufacturing IT Manager",
      "Enterprise Database Engineer"
    ],
    "total_national_intake": 80
  },
  "076": {
    "course_code": "076",
    "degree_awarded": "BSc (Hons) in Mineral Resources and Technology",
    "overview": "Mineral exploration, gemology, ceramic raw materials, mineral processing, and geotechnical surveying at Uva Wellassa University.",
    "al_requirements_summary": "Minimum 3 'S' passes in Combined Maths, Physics, and Chemistry at G.C.E. (A/L).",
    "specializations": [
      "Mineral Processing Technology",
      "Applied Geology & Exploration",
      "Ceramics & Glass Technology",
      "Gemology & Jewelry Arts"
    ],
    "career_paths": [
      "Geoscientist / Mining Geologist",
      "Gemologist (NGJA)",
      "Ceramics Technologist",
      "Geotechnical Surveyor"
    ],
    "total_national_intake": 75
  },
  "077": {
    "course_code": "077",
    "degree_awarded": "BSc (Hons) in Science and Technology",
    "overview": "Multidisciplinary materials science, mechatronics, polymer engineering, and biotechnology at Uva Wellassa University.",
    "al_requirements_summary": "Minimum 3 'S' passes in Physical Science or Biological Science stream.",
    "specializations": [
      "Materials & Polymer Technology",
      "Mechatronics & Robotics",
      "Food Engineering",
      "Bioprocess Technology"
    ],
    "career_paths": [
      "Materials Engineer",
      "Industrial Automation Specialist",
      "R&D Scientist",
      "Quality Systems Engineer"
    ],
    "total_national_intake": 90
  },
  "078": {
    "course_code": "078",
    "degree_awarded": "BSc (Hons) in Computer Science and Technology",
    "overview": "Four-year computing curriculum at Uva Wellassa University focusing on software engineering, cloud architecture, machine learning, and mobile computing.",
    "al_requirements_summary": "At least a 'C' pass in Combined Mathematics or Physics + 2 other approved subjects.",
    "specializations": [
      "Software Engineering",
      "Intelligent Systems & AI",
      "Computer Networks & Security",
      "Enterprise Cloud Systems"
    ],
    "career_paths": [
      "Software Engineer",
      "Systems Architect",
      "Cloud DevOps Specialist",
      "Security Analyst"
    ],
    "total_national_intake": 80
  },
  "079": {
    "course_code": "079",
    "degree_awarded": "BBMHons in Entrepreneurship and Management",
    "overview": "Business incubation, venture capital, startup development, small business management, and strategic marketing at Uva Wellassa University.",
    "al_requirements_summary": "Minimum 3 'S' passes in Commerce, Arts, or Science streams.",
    "specializations": [
      "Venture Capital & Startups",
      "SME Business Strategy",
      "Digital Marketing",
      "Corporate Innovation"
    ],
    "career_paths": [
      "Startup Founder / Entrepreneur",
      "Business Development Manager",
      "Venture Capital Analyst",
      "Innovation Consultant"
    ],
    "total_national_intake": 90
  },
  "080": {
    "course_code": "080",
    "degree_awarded": "BSc (Hons) in Tea Technology and Value Addition",
    "overview": "Ceylon tea biochemistry, tea processing automation, sensory tasting, international auction trading, and tea value addition at UWU.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics or Agricultural Science.",
    "specializations": [
      "Tea Agronomy & Processing",
      "Tea Tasting & Sensory Analysis",
      "Tea Value Addition & Marketing",
      "Quality Standards & ISO"
    ],
    "career_paths": [
      "Tea Factory General Manager",
      "Professional Tea Taster / Broker",
      "Tea Export Marketing Director",
      "Tea Research Scientist (TRI)"
    ],
    "total_national_intake": 60
  },
  "081": {
    "course_code": "081",
    "degree_awarded": "BSc (Hons) in Industrial Raw Material Technology",
    "overview": "Rubber polymer compounding, minerals, ceramics, timber, and sustainable industrial raw material extraction at Uva Wellassa University.",
    "al_requirements_summary": "Minimum 3 'S' passes in Physical Science or Biological Science + Pass Practical Aptitude Test.",
    "specializations": [
      "Polymer & Rubber Processing",
      "Ceramics & Refractory Materials",
      "Industrial Minerals",
      "Material Quality Testing"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Technical aptitude and analytical reasoning exam conducted by Uva Wellassa University.",
    "career_paths": [
      "Raw Material Quality Manager",
      "Polymer Technologist",
      "Ceramics Plant Specialist",
      "Procurement Specialist"
    ],
    "total_national_intake": 50
  },
  "082": {
    "course_code": "082",
    "degree_awarded": "BSc (Hons) in Palm & Latex Technology & Value Addition",
    "overview": "Rubber latex tapping, centrifugation, dipped goods manufacturing, coconut oil value addition, and palm oil processing at UWU.",
    "al_requirements_summary": "Minimum 3 'S' passes in Science stream + Pass Technical Aptitude Test.",
    "specializations": [
      "Latex Centrifugation & Dipped Products",
      "Coconut & Palm Oil Processing",
      "Rubber Compounding",
      "Export Value Chain Management"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Technical evaluation paper conducted by Uva Wellassa University.",
    "career_paths": [
      "Latex Factory Manager",
      "Rubber Products Chemist",
      "Palm Oil Processing Specialist",
      "Commodity Export Officer"
    ],
    "total_national_intake": 50
  },
  "083": {
    "course_code": "083",
    "degree_awarded": "BSc (Hons) in Speech & Hearing Sciences",
    "overview": "Specialized four-year clinical rehabilitation program at University of Kelaniya producing clinical audiologists and speech-language pathologists for teaching hospitals.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics at G.C.E. (A/L) + O/L English 'S'.",
    "specializations": [
      "Speech Language Therapy",
      "Clinical Audiology & Cochlear Implants",
      "Paediatric Communication Disorders",
      "Neurogenic Speech Rehabilitation"
    ],
    "career_paths": [
      "Clinical Speech-Language Pathologist (SLMC)",
      "Audiologist / Hearing Aid Specialist",
      "Voice Rehabilitation Consultant",
      "Paediatric Hearing Therapist"
    ],
    "total_national_intake": 65
  },
  "084": {
    "course_code": "084",
    "degree_awarded": "BSc (Hons) in Hospitality, Tourism & Events Management",
    "overview": "Luxury hotel operations, sustainable destination planning, global MICE events, and culinary management at Uva Wellassa University.",
    "al_requirements_summary": "Minimum 3 'S' passes in any stream + O/L English 'C'.",
    "specializations": [
      "Luxury Hotel Management",
      "MICE & Event Production",
      "Sustainable Eco-Tourism",
      "Food & Beverage Operations"
    ],
    "career_paths": [
      "Hotel General Manager",
      "MICE Event Director",
      "Tourism Development Officer (SLTDA)",
      "Resort Operations Manager"
    ],
    "total_national_intake": 75
  },
  "085": {
    "course_code": "085",
    "degree_awarded": "BSc (Hons) in Tourism & Hospitality Management",
    "overview": "Eco-tourism, travel agency management, airline ticketing, hotel finance, and resort leadership at Sabaragamuwa and Rajarata Universities.",
    "al_requirements_summary": "Minimum 3 'S' passes in Commerce, Arts, or Science + Pass Tourism Aptitude Test.",
    "specializations": [
      "Eco-Tourism & Heritage Conservation",
      "Hotel Operations & Finance",
      "Travel & Airline Operations",
      "Destination Branding"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: General tourism knowledge, English fluency, and hospitality situational judgment interview conducted by SUSL and RUSL.",
    "career_paths": [
      "Resort General Manager",
      "Tourism Marketing Specialist",
      "Travel Operations Director",
      "Hospitality Consultant"
    ],
    "total_national_intake": 140
  },
  "086": {
    "course_code": "086",
    "degree_awarded": "BSc (Hons) in Aquatic Resources Technology",
    "overview": "Inland aquaculture, ornamental fish export, reservoir fisheries, seaweed farming, and post-harvest aquatic value addition at UWU.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics or Agricultural Science.",
    "specializations": [
      "Ornamental Fish Breeding & Export",
      "Inland Aquaculture Engineering",
      "Seaweed & Microalgae Culture",
      "Aquatic Food Processing"
    ],
    "career_paths": [
      "Ornamental Fish Farm Director",
      "Aquaculture Technical Officer",
      "Aquatic Products Exporter",
      "Marine Resource Officer"
    ],
    "total_national_intake": 60
  },
  "087": {
    "course_code": "087",
    "degree_awarded": "BSc (Hons) in Forestry & Environmental Science",
    "overview": "Silviculture, wildlife ecology, GIS forest remote sensing, carbon sequestration, and biodiversity management at University of Sri Jayewardenepura.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biology, Chemistry, and Physics or Agricultural Science.",
    "specializations": [
      "Forest Ecology & Silviculture",
      "Wildlife Conservation & Parks",
      "GIS & Satellite Remote Sensing",
      "Carbon Accounting & Climate Policy"
    ],
    "career_paths": [
      "Forest Conservator (Forest Department)",
      "Wildlife Officer (DWC)",
      "Carbon Project Developer",
      "Environmental Impact Consultant"
    ],
    "total_national_intake": 95
  },
  "088": {
    "course_code": "088",
    "degree_awarded": "BSc (Hons) in EcoBusiness Management",
    "overview": "Corporate environmental sustainability, circular economy, renewable energy financing, and green marketing at Sabaragamuwa University.",
    "al_requirements_summary": "Minimum 3 'S' passes in Commerce, Biological Science, or Physical Science.",
    "specializations": [
      "Circular Economy & Zero Waste",
      "Green Marketing & Eco-Branding",
      "Corporate Sustainability Reporting",
      "Renewable Energy Economics"
    ],
    "career_paths": [
      "Corporate Sustainability Director",
      "Environmental ESG Auditor",
      "Green Supply Chain Specialist",
      "Eco-Business Strategist"
    ],
    "total_national_intake": 60
  },
  "091": {
    "course_code": "091",
    "degree_awarded": "BSc (Hons) in Information Technology & Management",
    "overview": "Interdisciplinary program combining software technology, IT governance, corporate finance, and enterprise product management at University of Moratuwa.",
    "al_requirements_summary": "3 passes with at least 'C' in two of: Combined Maths, Higher Maths, Maths, Physics, Chemistry, Accounting, Business Statistics, or ICT + O/L English 'C', Maths 'C'.",
    "specializations": [
      "FinTech & Digital Banking",
      "Business Intelligence & Big Data",
      "IT Governance & Enterprise Architecture",
      "Digital Marketing & Product Management"
    ],
    "career_paths": [
      "Fintech Product Manager",
      "IT Business Consultant",
      "Business Intelligence Analyst",
      "Enterprise Solutions Architect"
    ],
    "total_national_intake": 120
  },
  "095": {
    "course_code": "095",
    "degree_awarded": "BSc (Hons) in Green Technology",
    "overview": "Sustainable technology, waste-to-energy conversion, carbon footprint auditing, and environmental compliance at University of Ruhuna.",
    "al_requirements_summary": "Minimum 3 'S' passes in Biological Science or Physical Science stream + O/L English 'C'.",
    "specializations": [
      "Renewable Energy Technologies",
      "Waste Resource Management",
      "Environmental Auditing & Carbon Accounting",
      "Eco-Design & Life Cycle Assessment"
    ],
    "career_paths": [
      "Green Energy Project Engineer",
      "Sustainability & Carbon Auditor",
      "Environmental Compliance Officer",
      "Renewable Energy Consultant"
    ],
    "total_national_intake": 75
  },
  "096": {
    "course_code": "096",
    "degree_awarded": "BSc (Hons) in Information Systems",
    "overview": "Curriculum covering enterprise architecture, IT strategy, business intelligence, database security, and cloud system implementation.",
    "al_requirements_summary": "Minimum 3 'S' passes in any stream + O/L English 'C' and Maths 'C' + Pass Aptitude Test (60% Physical Science intake quota applies from 2028/29).",
    "specializations": [
      "Enterprise Information Systems",
      "Data Analytics & Business Intelligence",
      "Information Security Management",
      "Cloud Computing & Digital Transformation"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Analytical thinking, mathematical logic, basic computing awareness, and English comprehension test conducted jointly by UCSC, USJP, and SUSL.",
    "special_intake_quota_note": "60% Combined Mathematics & Physics intake quota rule takes effect from 2028/2029.",
    "career_paths": [
      "Information Systems Analyst",
      "IT Strategy Consultant",
      "Business Intelligence Architect",
      "Cybersecurity Governance Manager"
    ],
    "total_national_intake": 180
  },
  "097": {
    "course_code": "097",
    "degree_awarded": "BLA (Hons)",
    "overview": "Accredited by the Sri Lanka Institute of Landscape Architects (SLILA), teaching urban parks design, eco-restoration, botanical design, and stormwater management at UOM.",
    "al_requirements_summary": "Minimum 3 'S' passes in any stream + O/L English 'S' · Maths 'C' (or A/L Maths S) + Pass Spatial & Aesthetic Aptitude Test.",
    "specializations": [
      "Urban Landscape Design",
      "Ecological Restoration & Watersheds",
      "Heritage & Botanical Garden Design",
      "Recreational Landscape Architecture"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Landscape spatial comprehension, ecological visualization, freehand sketching, and design perception exam conducted by University of Moratuwa.",
    "career_paths": [
      "Chartered Landscape Architect (SLILA)",
      "Urban Green Infrastructure Consultant",
      "Parks & Recreation Director",
      "Environmental Site Planner"
    ],
    "total_national_intake": 50
  },
  "098": {
    "course_code": "098",
    "degree_awarded": "BA (Hons) in Translation Studies",
    "overview": "Four-year professional translator training in trilingual legal, diplomatic, medical, and literary translation across Sinhala, Tamil, and English with computer-assisted translation (CAT).",
    "al_requirements_summary": "3 passes with at least 'C' in Sinhala or Tamil at A/L + O/L 'B' in English and 'B' in Sinhala/Tamil (or A/L English 'S') + Pass Aptitude Test.",
    "specializations": [
      "Legal & Constitutional Translation",
      "Simultaneous & Consecutive Interpretation",
      "Literary & Media Translation",
      "Scientific & Technical Translation"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Language proficiency, syntax conversion, reading comprehension, and written translation paper across English/Sinhala/Tamil conducted by UOK, UOJ, EUSL, and SUSL.",
    "career_paths": [
      "Sworn / High Court Translator",
      "Simultaneous Conference Interpreter",
      "Diplomatic Translator (Ministry of Foreign Affairs)",
      "Media Localization Specialist"
    ],
    "total_national_intake": 120
  },
  "099": {
    "course_code": "099",
    "degree_awarded": "BSc (Hons) in Software Engineering",
    "overview": "Dedicated software engineering curriculum covering large-scale distributed architectures, mobile and web technologies, DevOps CI/CD, and quality assurance.",
    "al_requirements_summary": "At least a 'C' pass in Combined Maths, Higher Maths, or Physics + 2 other 'S' passes.",
    "specializations": [
      "Enterprise Software Architecture",
      "Mobile & Web Platforms",
      "DevOps & Quality Engineering",
      "Cloud Native Systems"
    ],
    "career_paths": [
      "Full Stack Software Engineer",
      "DevOps Engineer",
      "Software QA Lead",
      "Solutions Architect"
    ],
    "total_national_intake": 140
  },
  "042": {
    "course_code": "042",
    "degree_awarded": "BPA (Hons) in Drama & Theatre",
    "overview": "Comprehensive academic curriculum in Drama & Theatre preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Arts stream. + Pass Aptitude Test.",
    "specializations": [
      "Applied Drama & Theatre",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Drama & Theatre Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Audition in dramatic performance & speech.",
    "total_national_intake": 80
  },
  "043": {
    "course_code": "043",
    "degree_awarded": "BFA (Hons) in Visual Arts",
    "overview": "Comprehensive academic curriculum in Visual Arts preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Arts stream. + Pass Aptitude Test.",
    "specializations": [
      "Applied Visual Arts",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Visual Arts Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Drawing & compositional visual aptitude test.",
    "total_national_intake": 80
  },
  "044": {
    "course_code": "044",
    "degree_awarded": "BPA (Hons) in Music",
    "overview": "Comprehensive academic curriculum in Music preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Arts stream. + Pass Aptitude Test.",
    "specializations": [
      "Applied Music",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Music Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Vocal/instrumental pitch and rhythm practical audition.",
    "total_national_intake": 80
  },
  "045": {
    "course_code": "045",
    "degree_awarded": "BPA (Hons) in Dance",
    "overview": "Comprehensive academic curriculum in Dance preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Arts stream. + Pass Aptitude Test.",
    "specializations": [
      "Applied Dance",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Dance Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Practical classical dance audition and rhythm test.",
    "total_national_intake": 80
  },
  "046": {
    "course_code": "046",
    "degree_awarded": "BDes (Hons)",
    "overview": "Comprehensive academic curriculum in Art & Design preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Arts stream. + Pass Aptitude Test.",
    "specializations": [
      "Applied Art & Design",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Art & Design Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Creative design and sketching test.",
    "total_national_intake": 80
  },
  "047": {
    "course_code": "047",
    "degree_awarded": "BA (Hons) in English",
    "overview": "Comprehensive academic curriculum in English (Arts) preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Arts stream.",
    "specializations": [
      "Applied English (Arts)",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "English (Arts) Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "048": {
    "course_code": "048",
    "degree_awarded": "BDes (Hons) in Graphic Design",
    "overview": "Comprehensive academic curriculum in Graphic Design preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Arts stream. + Pass Aptitude Test.",
    "specializations": [
      "Applied Graphic Design",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Graphic Design Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Visual graphics and typography practical test.",
    "total_national_intake": 80
  },
  "049": {
    "course_code": "049",
    "degree_awarded": "BFA (Hons) in Printmaking",
    "overview": "Comprehensive academic curriculum in Printmaking preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Arts stream. + Pass Aptitude Test.",
    "specializations": [
      "Applied Printmaking",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Printmaking Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: Graphic printmaking and etching aptitude test.",
    "total_national_intake": 80
  },
  "050": {
    "course_code": "050",
    "degree_awarded": "BFA (Hons) in Sculpture",
    "overview": "Comprehensive academic curriculum in Sculpture preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Arts stream. + Pass Aptitude Test.",
    "specializations": [
      "Applied Sculpture",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Sculpture Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": "Section 5.4 Aptitude Test: 3D spatial sculpture and clay modelling test.",
    "total_national_intake": 80
  },
  "055": {
    "course_code": "055",
    "degree_awarded": "BSc (Hons) in Environmental Conservation & Management",
    "overview": "Comprehensive academic curriculum in Environmental Conservation & Management preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Biological Science stream.",
    "specializations": [
      "Applied Environmental Conservation & Management",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Environmental Conservation & Management Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "066": {
    "course_code": "066",
    "degree_awarded": "BSc (Hons) in Business Information Systems",
    "overview": "Comprehensive academic curriculum in Business Information Systems preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Commerce stream.",
    "specializations": [
      "Applied Business Information Systems",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Business Information Systems Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "067": {
    "course_code": "067",
    "degree_awarded": "BSc (Hons) in Financial Mathematics & Industrial Statistics",
    "overview": "Comprehensive academic curriculum in Financial Mathematics & Industrial Statistics preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Physical Science stream.",
    "specializations": [
      "Applied Financial Mathematics & Industrial Statistics",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Financial Mathematics & Industrial Statistics Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "089": {
    "course_code": "089",
    "degree_awarded": "BSc (Hons) in Human Resource Development",
    "overview": "Comprehensive academic curriculum in Human Resource Development preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Commerce stream.",
    "specializations": [
      "Applied Human Resource Development",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Human Resource Development Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "090": {
    "course_code": "090",
    "degree_awarded": "BSc (Hons) in Banking & Insurance",
    "overview": "Comprehensive academic curriculum in Banking & Insurance preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Commerce stream.",
    "specializations": [
      "Applied Banking & Insurance",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Banking & Insurance Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "092": {
    "course_code": "092",
    "degree_awarded": "BSc (Hons) in Project Management",
    "overview": "Comprehensive academic curriculum in Project Management preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Commerce stream.",
    "specializations": [
      "Applied Project Management",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Project Management Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "093": {
    "course_code": "093",
    "degree_awarded": "BSc (Hons) in Green Technology",
    "overview": "Comprehensive academic curriculum in Green Technology (Bio) preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Technology stream.",
    "specializations": [
      "Applied Green Technology (Bio)",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Green Technology (Bio) Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  },
  "094": {
    "course_code": "094",
    "degree_awarded": "BSc (Hons) in Animal Production & Food Technology",
    "overview": "Comprehensive academic curriculum in Animal Production & Food Technology preparing graduates for specialized public and private sector employment, research, and professional certification.",
    "al_requirements_summary": "Minimum 3 'S' passes in approved G.C.E. (A/L) subjects in the Biological Science stream.",
    "specializations": [
      "Applied Animal Production & Food Technology",
      "Research & Development",
      "Industry Systems",
      "Advanced Analytics"
    ],
    "career_paths": [
      "Animal Production & Food Technology Specialist",
      "Research Officer",
      "Industry Consultant",
      "Senior Analyst"
    ],
    "aptitude_test_info": null,
    "total_national_intake": 80
  }
};


export interface CourseRecord {
  course_code: string;
  name: string;
  stream: 'Biological Science' | 'Physical Science' | 'Commerce' | 'Arts' | 'Technology' | 'Other';
  faculty: string;
  degree_awarded: string;
  subject_requirements: SubjectRequirementsSpec;
  description: string;
  career_category: string;
}

export const UGC_COURSES: CourseRecord[] = [
  {
    course_code: '001',
    name: 'Medicine',
    stream: 'Biological Science',
    faculty: 'Faculty of Medicine',
    degree_awarded: 'MBBS',
    subject_requirements: {
      required_subjects: ['Biology', 'Chemistry', 'Physics'],
      min_grade: 'C',
      notes: 'Requires minimum 2 C passes and 1 S pass in Biology, Chemistry, Physics at a single sitting.',
    },
    description: 'Five-year clinical degree leading to registration with the Sri Lanka Medical Council (SLMC) as a Medical Officer.',
    career_category: 'Medicine & Allied Health',
  },
  {
    course_code: '002',
    name: 'Dental Surgery',
    stream: 'Biological Science',
    faculty: 'Faculty of Dental Sciences',
    degree_awarded: 'BDS',
    subject_requirements: {
      required_subjects: ['Biology', 'Chemistry', 'Physics'],
      min_grade: 'S',
    },
    description: 'Five-year clinical Dental Surgery degree producing SLMC-registered Dental Surgeons.',
    career_category: 'Medicine & Allied Health',
  },
  {
    course_code: '004',
    name: 'Agriculture',
    stream: 'Biological Science',
    faculty: 'Faculty of Agriculture',
    degree_awarded: 'BSc (Hons) in Agricultural Technology & Management',
    subject_requirements: {
      required_subjects: ['Biology', 'Chemistry'],
      any_of_subjects: ['Physics', 'Agricultural Science'],
      min_grade: 'S',
    },
    description: 'Four-year honors program in agronomy, food security, agribusiness, and crop technology.',
    career_category: 'Agriculture & Food Science',
  },
  {
    course_code: '008',
    name: 'Engineering',
    stream: 'Physical Science',
    faculty: 'Faculty of Engineering',
    degree_awarded: 'BSc (Hons) in Engineering',
    subject_requirements: {
      required_subjects: ['Combined Mathematics', 'Physics', 'Chemistry'],
      min_grade: 'C',
      notes: 'Requires at least 2 C passes and 1 S pass in Combined Mathematics, Physics, and Chemistry.',
    },
    description: 'IESL-accredited Washington Accord 4-year honors engineering degree covering Computer, Civil, Electrical, Mechanical, and Electronic specializations.',
    career_category: 'Engineering & Tech',
  },
  {
    course_code: '010',
    name: 'Quantity Surveying',
    stream: 'Physical Science',
    faculty: 'Faculty of Architecture',
    degree_awarded: 'BSc (Hons) in Quantity Surveying',
    subject_requirements: {
      required_subjects: ['Combined Mathematics'],
      any_of_subjects: ['Physics', 'Chemistry', 'Information & Communication Technology'],
      min_grade: 'S',
    },
    description: 'IQSSL and RICS accredited construction cost management, contract administration, and project economics degree.',
    career_category: 'Architecture & Design',
  },
  {
    course_code: '012',
    name: 'Computer Science',
    stream: 'Physical Science',
    faculty: 'School of Computing / Faculty of Science',
    degree_awarded: 'BSc (Hons) in Computer Science',
    subject_requirements: {
      required_subjects: ['Combined Mathematics'],
      any_of_subjects: ['Physics', 'Chemistry', 'Information & Communication Technology'],
      min_grade: 'C',
      notes: 'Requires at least a C grade in Combined Mathematics or Higher Mathematics.',
    },
    description: 'Flagship computer science degree covering algorithms, AI/ML, distributed systems, and software engineering.',
    career_category: 'IT & Computing',
  },
  {
    course_code: '013',
    name: 'Physical Science',
    stream: 'Physical Science',
    faculty: 'Faculty of Science',
    degree_awarded: 'BSc / BSc (Hons) in Physical Science',
    subject_requirements: {
      required_subjects: ['Combined Mathematics', 'Physics'],
      any_of_subjects: ['Chemistry', 'Information & Communication Technology'],
      min_grade: 'S',
    },
    description: 'Core Physical Science degree offering honors specializations in Applied Mathematics, Statistics, Physics, Data Science, and Computer Science.',
    career_category: 'Physical & Natural Sciences',
  },
  {
    course_code: '016',
    name: 'Management',
    stream: 'Commerce',
    faculty: 'Faculty of Management Studies & Commerce',
    degree_awarded: 'BSc (Hons) in Business Administration / BBM',
    subject_requirements: {
      any_of_subjects: ['Accounting', 'Business Studies', 'Economics', 'Information & Communication Technology'],
      min_grade: 'S',
    },
    description: 'Flagship management and commerce program covering Finance, Accounting, Marketing, HR, and Business Analytics.',
    career_category: 'Business & Finance',
  },
  {
    course_code: '019',
    name: 'Arts',
    stream: 'Arts',
    faculty: 'Faculty of Arts & Humanities',
    degree_awarded: 'BA / BA (Hons)',
    subject_requirements: {
      min_grade: 'S',
      notes: 'Open to candidates passing 3 approved Arts stream subjects at G.C.E. A/L.',
    },
    description: 'Comprehensive Humanities and Social Sciences degree spanning Economics, International Relations, Sociology, Geography, and Languages.',
    career_category: 'Humanities & Languages',
  },
  {
    course_code: '020',
    name: 'Law',
    stream: 'Other',
    faculty: 'Faculty of Law',
    degree_awarded: 'LLB (Hons)',
    subject_requirements: {
      min_grade: 'C',
      notes: 'Open to Arts, Commerce, Biological & Physical Science streams subject to UGC Law subject rules.',
    },
    description: 'Four-year Bachelor of Laws honors degree preparing graduates for Sri Lanka Law College bar admission and corporate legal practice.',
    career_category: 'Law & Governance',
  },
  {
    course_code: '023',
    name: 'Architecture',
    stream: 'Other',
    faculty: 'Faculty of Architecture',
    degree_awarded: 'BArch (Hons)',
    subject_requirements: {
      min_grade: 'S',
      notes: 'Must pass the University of Moratuwa Architecture Aptitude Test.',
    },
    description: 'SLIA-accredited five-year professional Architecture degree blending spatial design, structural engineering, and urban sustainability.',
    career_category: 'Architecture & Design',
  },
  {
    course_code: '026',
    name: 'Information Technology (IT)',
    stream: 'Other',
    faculty: 'Faculty of Information Technology',
    degree_awarded: 'BSc (Hons) in Information Technology',
    subject_requirements: {
      min_grade: 'C',
      notes: 'Open to Physical Science, Biological Science, Commerce, and ICT candidates with minimum C pass in high-priority subjects.',
    },
    description: 'Industry-aligned 4-year IT honors degree focusing on cloud engineering, enterprise software, cybersecurity, and full-stack development.',
    career_category: 'IT & Computing',
  },
  {
    course_code: '038',
    name: 'Information Systems',
    stream: 'Other',
    faculty: 'School of Computing',
    degree_awarded: 'BSc (Hons) in Information Systems',
    subject_requirements: {
      min_grade: 'C',
    },
    description: 'Bridges software engineering, enterprise systems architecture, product management, and digital business transformation.',
    career_category: 'IT & Computing',
  },
  {
    course_code: '096',
    name: 'Artificial Intelligence',
    stream: 'Physical Science',
    faculty: 'Faculty of Information Technology',
    degree_awarded: 'BSc (Hons) in Artificial Intelligence',
    subject_requirements: {
      required_subjects: ['Combined Mathematics', 'Physics'],
      any_of_subjects: ['Chemistry', 'Information & Communication Technology'],
      min_grade: 'C',
    },
    description: 'Specialized 4-year degree in deep learning, computer vision, natural language processing, and autonomous systems.',
    career_category: 'IT & Computing',
  },
  {
    course_code: '102',
    name: 'Engineering Technology (ET)',
    stream: 'Technology',
    faculty: 'Faculty of Technology',
    degree_awarded: 'BET (Hons)',
    subject_requirements: {
      required_subjects: ['Engineering Technology', 'Science for Technology'],
      min_grade: 'S',
    },
    description: 'Four-year Sydney Accord-aligned Bachelor of Engineering Technology honors degree in electromechanical, automotive, and civil technology.',
    career_category: 'Engineering & Tech',
  },
  {
    course_code: '103',
    name: 'Biosystems Technology (BST)',
    stream: 'Technology',
    faculty: 'Faculty of Technology',
    degree_awarded: 'BBST (Hons)',
    subject_requirements: {
      required_subjects: ['Biosystems Technology', 'Science for Technology'],
      min_grade: 'S',
    },
    description: 'Four-year honors program in food bioprocessing, environmental technology, and smart agricultural automation.',
    career_category: 'Agriculture & Food Science',
  },
  {
    course_code: '136',
    name: 'Data Science',
    stream: 'Physical Science',
    faculty: 'Faculty of Applied Sciences',
    degree_awarded: 'BSc (Hons) in Data Science',
    subject_requirements: {
      required_subjects: ['Combined Mathematics'],
      any_of_subjects: ['Physics', 'Chemistry', 'Information & Communication Technology'],
      min_grade: 'C',
    },
    description: 'Interdisciplinary degree in statistical modeling, machine learning, big data analytics, and computational data science.',
    career_category: 'IT & Computing',
  },
  {
    course_code: '011',
    name: 'Quantity Surveying',
    stream: 'Physical Science',
    faculty: 'Faculty of Architecture',
    degree_awarded: 'BSc (Hons) in Quantity Surveying',
    subject_requirements: {
      required_subjects: ['Combined Mathematics'],
      min_grade: 'S',
      notes: 'Requires O/L English (C), Maths (C), Science (S) under Section 5.3',
    },
    description: 'Premier construction cost engineering and contract management degree accredited by PAQS, RICS, and AIQS.',
    career_category: 'Built Environment',
  },
  {
    course_code: '020',
    name: 'Arts (SP) - Mass Media',
    stream: 'Arts',
    faculty: 'Sri Palee Campus',
    degree_awarded: 'BA (Special) in Mass Media',
    subject_requirements: {
      min_grade: 'S',
      notes: 'Requires O/L English (S) + Pass Sripalee Practical/Aptitude Test',
    },
    description: 'Specialized 3-year media arts degree focusing on journalism, broadcast television, digital media production, and mass communication.',
    career_category: 'Arts & Media',
  },
  {
    course_code: '041',
    name: 'Arts (SP) - Performing Arts',
    stream: 'Arts',
    faculty: 'Sri Palee Campus',
    degree_awarded: 'BPA (Special) in Performing Arts',
    subject_requirements: {
      min_grade: 'S',
      notes: 'Requires O/L English (S) + Pass Sripalee Practical/Aptitude Test',
    },
    description: 'Four-year specialized degree in theatre, film, dance, and creative performance direction.',
    career_category: 'Arts & Media',
  },
  {
    course_code: '023',
    name: 'Architecture',
    stream: 'Other',
    faculty: 'Faculty of Architecture',
    degree_awarded: 'B.Arch (Hons)',
    subject_requirements: {
      min_grade: 'S',
      notes: 'Requires O/L English (S), Maths (C) + Moratuwa Architecture Aptitude Test',
    },
    description: 'Five-year professional architectural degree accredited by the Sri Lanka Institute of Architects (SLIA) and RIBA.',
    career_category: 'Built Environment',
  },
  {
    course_code: '024',
    name: 'Design',
    stream: 'Other',
    faculty: 'Faculty of Architecture',
    degree_awarded: 'B.Des (Hons)',
    subject_requirements: {
      min_grade: 'S',
      notes: 'Requires O/L English (S), Maths (C), Science (C) + Aptitude Test',
    },
    description: 'Four-year industrial, graphic, and spatial design honours degree at Moratuwa.',
    career_category: 'Built Environment',
  },
  {
    course_code: '025',
    name: 'Law',
    stream: 'Arts',
    faculty: 'Faculty of Law',
    degree_awarded: 'Bachelor of Laws (LLB Hons)',
    subject_requirements: {
      min_grade: 'S',
      notes: 'Requires O/L English (C) + Sinhala or Tamil (C) at G.C.E. O/L under Section 5.3',
    },
    description: 'Four-year professional legal education qualifying graduates for direct admission to the Sri Lanka Law College Final Examination.',
    career_category: 'Law & Public Policy',
  },
  {
    course_code: '027',
    name: 'Management and Information Technology (MIT)',
    stream: 'Physical Science',
    faculty: 'Faculty of Science',
    degree_awarded: 'BSc (Hons) in MIT',
    subject_requirements: {
      required_subjects: ['Combined Mathematics', 'Physics'],
      min_grade: 'S',
      notes: 'Requires O/L Mathematics (B) and English (C) under Section 5.3',
    },
    description: 'Elite 4-year degree bridging computer science, corporate information systems, enterprise architecture, and quantitative management.',
    career_category: 'IT & Computing',
  },
  {
    course_code: '029',
    name: 'Communication Studies',
    stream: 'Arts',
    faculty: 'Faculty of Communication and Business Studies',
    degree_awarded: 'BA in Communication Studies',
    subject_requirements: {
      min_grade: 'S',
      notes: 'Requires O/L English (C)',
    },
    description: 'Intercultural communication, public relations, television production, and digital journalism at Eastern University Trincomalee Campus.',
    career_category: 'Arts & Media',
  },
  {
    course_code: '030',
    name: 'Urban Informatics and Planning',
    stream: 'Other',
    faculty: 'Faculty of Architecture',
    degree_awarded: 'BSc (Hons) in Town & Country Planning',
    subject_requirements: {
      min_grade: 'S',
      notes: 'Requires O/L English (B) and Maths (C) under Section 5.3',
    },
    description: 'Four-year spatial data analysis, smart city informatics, urban GIS, and territorial planning degree.',
    career_category: 'Built Environment',
  },
  {
    course_code: '034',
    name: 'Fashion Design & Product Development',
    stream: 'Other',
    faculty: 'Faculty of Engineering',
    degree_awarded: 'B.Des (Hons) in Fashion Design',
    subject_requirements: {
      min_grade: 'S',
      notes: 'Requires O/L English (C), Maths (C), Science (C) + Moratuwa Aptitude Test',
    },
    description: 'World-renowned 4-year apparel engineering, sustainable fashion design, and global supply chain innovation program.',
    career_category: 'Built Environment',
  },
  {
    course_code: '037',
    name: 'Nursing',
    stream: 'Biological Science',
    faculty: 'Faculty of Allied Health Sciences',
    degree_awarded: 'BSc (Hons) in Nursing',
    subject_requirements: {
      required_subjects: ['Biology', 'Chemistry'],
      min_grade: 'S',
      notes: 'Requires O/L English (S) + Minimum height 4ft 10in (Section 5.3)',
    },
    description: 'Four-year professional clinical nursing degree qualifying graduates for SLMC/SLNC registration as Nursing Officers.',
    career_category: 'Medicine & Allied Health',
  },
  {
    course_code: '051',
    name: 'Pharmacy',
    stream: 'Biological Science',
    faculty: 'Faculty of Allied Health Sciences',
    degree_awarded: 'B.Pharm (Hons)',
    subject_requirements: {
      required_subjects: ['Biology', 'Chemistry'],
      min_grade: 'S',
      notes: 'Requires O/L English (S) under Section 5.3',
    },
    description: 'Four-year clinical pharmacy, pharmaceutical formulation, and pharmacology honours degree.',
    career_category: 'Medicine & Allied Health',
  },
  {
    course_code: '052',
    name: 'Medical Laboratory Sciences',
    stream: 'Biological Science',
    faculty: 'Faculty of Allied Health Sciences',
    degree_awarded: 'BSc (Hons) in MLS',
    subject_requirements: {
      required_subjects: ['Biology', 'Chemistry'],
      min_grade: 'S',
      notes: 'Requires O/L English (S) under Section 5.3',
    },
    description: 'Diagnostic pathology, haematology, clinical biochemistry, and molecular biology medical laboratory degree.',
    career_category: 'Medicine & Allied Health',
  },
  {
    course_code: '053',
    name: 'Radiography',
    stream: 'Biological Science',
    faculty: 'Faculty of Allied Health Sciences',
    degree_awarded: 'BSc (Hons) in Radiography',
    subject_requirements: {
      required_subjects: ['Biology', 'Physics'],
      min_grade: 'S',
      notes: 'Requires O/L English (S) under Section 5.3',
    },
    description: 'Medical imaging, CT, MRI, ultrasound, and radiotherapy technology clinical degree.',
    career_category: 'Medicine & Allied Health',
  },
  {
    course_code: '054',
    name: 'Physiotherapy',
    stream: 'Biological Science',
    faculty: 'Faculty of Allied Health Sciences',
    degree_awarded: 'BSc (Hons) in Physiotherapy',
    subject_requirements: {
      required_subjects: ['Biology', 'Physics'],
      min_grade: 'S',
      notes: 'Requires O/L English (S) under Section 5.3',
    },
    description: 'Musculoskeletal rehabilitation, neurological physiotherapy, and sports medicine clinical honours degree.',
    career_category: 'Medicine & Allied Health',
  },
  {
    course_code: '056',
    name: 'Facilities Management',
    stream: 'Other',
    faculty: 'Faculty of Architecture',
    degree_awarded: 'BSc (Hons) in Facilities Management',
    subject_requirements: {
      min_grade: 'S',
      notes: 'Requires O/L English (C), Maths (C), Science (C)',
    },
    description: 'High-earning 4-year degree managing commercial corporate real estate, energy systems, and built asset infrastructure.',
    career_category: 'Built Environment',
  },
  {
    course_code: '075',
    name: 'Industrial Information Technology',
    stream: 'Other',
    faculty: 'Faculty of Applied Sciences',
    degree_awarded: 'B.Tech (Hons) in IIT',
    subject_requirements: {
      min_grade: 'S',
      notes: 'Requires O/L English (C) and Maths (C)',
    },
    description: 'Four-year technology degree in embedded systems, industrial robotics, enterprise software, and smart factory IoT.',
    career_category: 'IT & Computing',
  },
  {
    course_code: '083',
    name: 'Speech and Hearing Sciences',
    stream: 'Biological Science',
    faculty: 'Faculty of Medicine',
    degree_awarded: 'BSc (Hons) in SHS',
    subject_requirements: {
      required_subjects: ['Biology'],
      min_grade: 'S',
      notes: 'Requires O/L English (S) under Section 5.3',
    },
    description: 'Audiology and speech-language therapy clinical degree at University of Kelaniya Ragama Medical Faculty.',
    career_category: 'Medicine & Allied Health',
  },
  {
    course_code: '091',
    name: 'Information Technology & Management',
    stream: 'Other',
    faculty: 'Faculty of Information Technology',
    degree_awarded: 'BSc (Hons) in IT & M',
    subject_requirements: {
      min_grade: 'C',
      notes: 'Requires O/L English (C) and Maths (C) under Section 5.3',
    },
    description: 'Moratuwa IT faculty flagship blending software engineering with tech entrepreneurship and corporate product leadership.',
    career_category: 'IT & Computing',
  },
  {
    course_code: '095',
    name: 'Green Technology',
    stream: 'Technology',
    faculty: 'Faculty of Technology',
    degree_awarded: 'B.Tech (Hons) in Green Technology',
    subject_requirements: {
      min_grade: 'S',
      notes: 'Requires O/L English (C)',
    },
    description: 'Renewable energy, circular economy, waste valorization, and sustainable environmental technology honours program at Ruhuna.',
    career_category: 'Engineering & Tech',
  },
  {
    course_code: '097',
    name: 'Landscape Architecture',
    stream: 'Other',
    faculty: 'Faculty of Architecture',
    degree_awarded: 'B.LA (Hons)',
    subject_requirements: {
      min_grade: 'S',
      notes: 'Requires O/L English (S), Maths (C) + Aptitude Test',
    },
    description: 'Four-year landscape urbanism, ecological design, and urban open space architecture degree at Moratuwa.',
    career_category: 'Built Environment',
  },
  {
    course_code: '098',
    name: 'Translation Studies',
    stream: 'Arts',
    faculty: 'Faculty of Humanities',
    degree_awarded: 'BA (Hons) in Translation Studies',
    subject_requirements: {
      min_grade: 'S',
      notes: 'Requires O/L English (B) + Sinhala or Tamil (B) + Aptitude Test',
    },
    description: 'High-demand trilingual professional translation, conference interpretation, and computational linguistics honours degree.',
    career_category: 'Arts & Media',
  },
  {
    course_code: '107',
    name: 'Food Business Management',
    stream: 'Commerce',
    faculty: 'Faculty of Agricultural Sciences',
    degree_awarded: 'BSc (Hons) in Food Business Management',
    subject_requirements: {
      min_grade: 'S',
      notes: 'Requires O/L English (C), Maths (C), Science (C)',
    },
    description: 'Four-year degree at Sabaragamuwa University in agri-food supply chains, commercial food processing, and food trade economics.',
    career_category: 'Agriculture & Food Science',
  },
  {
    course_code: '109',
    name: 'Business Science',
    stream: 'Commerce',
    faculty: 'Faculty of Business',
    degree_awarded: 'BBSc (Hons)',
    subject_requirements: {
      min_grade: 'S',
      notes: 'Requires O/L Mathematics (C) under Section 5.3',
    },
    description: 'Moratuwa business analytics, financial engineering, actuarial mathematics, and quantitative supply chain modeling degree.',
    career_category: 'Business & Finance',
  },
  {
    course_code: '110',
    name: 'Financial Engineering',
    stream: 'Physical Science',
    faculty: 'Faculty of Science',
    degree_awarded: 'BSc (Hons) in Financial Engineering',
    subject_requirements: {
      required_subjects: ['Combined Mathematics'],
      min_grade: 'S',
      notes: 'Requires O/L English (C) and Maths (C)',
    },
    description: 'Quantitative computational finance, stochastic calculus, derivatives pricing, and algorithmic trading at Kelaniya.',
    career_category: 'Business & Finance',
  },
  {
    course_code: '128',
    name: 'Arts - Information Technology',
    stream: 'Arts',
    faculty: 'Faculty of Humanities and Social Sciences',
    degree_awarded: 'BA (Hons) in Information Technology',
    subject_requirements: {
      min_grade: 'S',
      notes: 'Requires O/L Mathematics (C) under Section 5.3',
    },
    description: 'Bridging digital humanities, human-computer interaction, web technologies, and computational social sciences at Sri Jayewardenepura.',
    career_category: 'IT & Computing',
  },
  {
    course_code: '132',
    name: 'English Language & Applied Linguistics',
    stream: 'Arts',
    faculty: 'Faculty of Applied Sciences',
    degree_awarded: 'BA (Hons) in English & Applied Linguistics',
    subject_requirements: {
      min_grade: 'S',
      notes: 'Requires O/L English (C) and Maths (C)',
    },
    description: 'Applied linguistics, computational discourse analysis, TESL, and corporate communication at Uva Wellassa University.',
    career_category: 'Arts & Media',
  },
  {
    course_code: '137',
    name: 'Primary Education',
    stream: 'Arts',
    faculty: 'Faculty of Education',
    degree_awarded: 'B.Ed (Hons) in Primary Education',
    subject_requirements: {
      min_grade: 'S',
      notes: 'Requires O/L Sinhala (C), English (S), Maths (C), Science (C)',
    },
    description: 'Professional 4-year early childhood education and primary pedagogical leadership degree at University of Colombo.',
    career_category: 'Arts & Media',
  },
  {
    course_code: '140',
    name: 'Service Management',
    stream: 'Other',
    faculty: 'Faculty of Indigenous Health Sciences & Technology',
    degree_awarded: 'BSc (Hons) in Service Management',
    subject_requirements: {
      min_grade: 'S',
      notes: 'Open to all A/L streams subject to UGC general admission criteria.',
    },
    description: 'Healthcare administration, indigenous wellness service management, and hospital operations.',
    career_category: 'Management & Administration',
  },
];

export interface AdmissionOptionSeed {
  uni_code: string;
  course_code: string;
  institution_code: string;
  duration_years: number;
  medium: ('E' | 'S' | 'T')[];
  proposed_intake: number;
  aptitude_test_required: boolean;
  all_island_merit_only: boolean;
  colombo_base_z: number;
  nqc_districts?: number[];
  requires_ol_special?: boolean;
  is_suspended?: boolean;
  ol_rule?: OlRequirementRule | null;
  ol_requirements_text?: string | null;
  ol_short_badge?: string | null;
  overview?: string;
  al_requirements_summary?: string;
  specializations?: string[];
  special_intake_quota_note?: string | null;
  aptitude_test_info?: string | null;
  career_paths?: string[];
  total_national_intake?: number;
  differently_abled_quota?: number;
}

export const ADMISSION_OPTIONS_SEED: AdmissionOptionSeed[] = [

  // --- Section 5.3 Specific Admission Options Seed ---
  { uni_code: '011G', course_code: '011', institution_code: 'UOM', duration_years: 4, medium: ['E'], proposed_intake: 155, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.5240, requires_ol_special: true },
  { uni_code: '020S', course_code: '020', institution_code: 'SPC', duration_years: 3, medium: ['E', 'S'], proposed_intake: 95, aptitude_test_required: true, all_island_merit_only: false, colombo_base_z: 1.2150, requires_ol_special: true },
  { uni_code: '041S', course_code: '041', institution_code: 'SPC', duration_years: 4, medium: ['S'], proposed_intake: 80, aptitude_test_required: true, all_island_merit_only: false, colombo_base_z: 1.1540, requires_ol_special: true },
  { uni_code: '023G', course_code: '023', institution_code: 'UOM', duration_years: 5, medium: ['E'], proposed_intake: 75, aptitude_test_required: true, all_island_merit_only: false, colombo_base_z: 1.6210, requires_ol_special: true },
  { uni_code: '024G', course_code: '024', institution_code: 'UOM', duration_years: 4, medium: ['E'], proposed_intake: 60, aptitude_test_required: true, all_island_merit_only: false, colombo_base_z: 1.4890, requires_ol_special: true },
  { uni_code: '025A', course_code: '025', institution_code: 'UOC', duration_years: 4, medium: ['E', 'S', 'T'], proposed_intake: 260, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.9420, requires_ol_special: true },
  { uni_code: '025B', course_code: '025', institution_code: 'UOP', duration_years: 4, medium: ['E'], proposed_intake: 110, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.8650, requires_ol_special: true },
  { uni_code: '025E', course_code: '025', institution_code: 'UOJ', duration_years: 4, medium: ['E', 'T'], proposed_intake: 120, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.7450, requires_ol_special: true },
  { uni_code: '027D', course_code: '027', institution_code: 'UOK', duration_years: 4, medium: ['E'], proposed_intake: 80, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.7120, requires_ol_special: true },
  { uni_code: '029W', course_code: '029', institution_code: 'TC', duration_years: 3, medium: ['E'], proposed_intake: 85, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3450, requires_ol_special: true },
  { uni_code: '030G', course_code: '030', institution_code: 'UOM', duration_years: 4, medium: ['E'], proposed_intake: 60, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.4850, requires_ol_special: true },
  { uni_code: '034G', course_code: '034', institution_code: 'UOM', duration_years: 4, medium: ['E'], proposed_intake: 55, aptitude_test_required: true, all_island_merit_only: false, colombo_base_z: 1.4250, requires_ol_special: true },
  { uni_code: '037A', course_code: '037', institution_code: 'UOC', duration_years: 4, medium: ['E'], proposed_intake: 125, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.5850, requires_ol_special: true },
  { uni_code: '037B', course_code: '037', institution_code: 'UOP', duration_years: 4, medium: ['E'], proposed_intake: 110, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.5120, requires_ol_special: true },
  { uni_code: '037C', course_code: '037', institution_code: 'USJP', duration_years: 4, medium: ['E'], proposed_intake: 95, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.5450, requires_ol_special: true },
  { uni_code: '037E', course_code: '037', institution_code: 'UOJ', duration_years: 4, medium: ['E'], proposed_intake: 90, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3980, requires_ol_special: true },
  { uni_code: '037F', course_code: '037', institution_code: 'UOR', duration_years: 4, medium: ['E'], proposed_intake: 100, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.4650, requires_ol_special: true },
  { uni_code: '037H', course_code: '037', institution_code: 'EUSL', duration_years: 4, medium: ['E'], proposed_intake: 75, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3850, requires_ol_special: true },
  { uni_code: '038K', course_code: '038', institution_code: 'RUSL', duration_years: 3, medium: ['E'], proposed_intake: 120, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.4520, requires_ol_special: true },
  { uni_code: '038R', course_code: '038', institution_code: 'UOV', duration_years: 3, medium: ['E'], proposed_intake: 95, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3420, requires_ol_special: true },
  { uni_code: '051B', course_code: '051', institution_code: 'UOP', duration_years: 4, medium: ['E'], proposed_intake: 65, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.6450, requires_ol_special: true },
  { uni_code: '051C', course_code: '051', institution_code: 'USJP', duration_years: 4, medium: ['E'], proposed_intake: 70, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.6850, requires_ol_special: true },
  { uni_code: '051E', course_code: '051', institution_code: 'UOJ', duration_years: 4, medium: ['E'], proposed_intake: 55, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.5120, requires_ol_special: true },
  { uni_code: '051F', course_code: '051', institution_code: 'UOR', duration_years: 4, medium: ['E'], proposed_intake: 60, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.5950, requires_ol_special: true },
  { uni_code: '052B', course_code: '052', institution_code: 'UOP', duration_years: 4, medium: ['E'], proposed_intake: 60, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.6120, requires_ol_special: true },
  { uni_code: '052C', course_code: '052', institution_code: 'USJP', duration_years: 4, medium: ['E'], proposed_intake: 65, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.6450, requires_ol_special: true },
  { uni_code: '052E', course_code: '052', institution_code: 'UOJ', duration_years: 4, medium: ['E'], proposed_intake: 50, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.4850, requires_ol_special: true },
  { uni_code: '052F', course_code: '052', institution_code: 'UOR', duration_years: 4, medium: ['E'], proposed_intake: 55, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.5650, requires_ol_special: true },
  { uni_code: '053B', course_code: '053', institution_code: 'UOP', duration_years: 4, medium: ['E'], proposed_intake: 55, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.5890, requires_ol_special: true },
  { uni_code: '054A', course_code: '054', institution_code: 'UOC', duration_years: 4, medium: ['E'], proposed_intake: 50, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.6250, requires_ol_special: true },
  { uni_code: '054B', course_code: '054', institution_code: 'UOP', duration_years: 4, medium: ['E'], proposed_intake: 50, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.5840, requires_ol_special: true },
  { uni_code: '056G', course_code: '056', institution_code: 'UOM', duration_years: 4, medium: ['E'], proposed_intake: 60, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.4650, requires_ol_special: true },
  { uni_code: '075U', course_code: '075', institution_code: 'UWU', duration_years: 4, medium: ['E'], proposed_intake: 85, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.4120, requires_ol_special: true },
  { uni_code: '083D', course_code: '083', institution_code: 'UOK', duration_years: 4, medium: ['E'], proposed_intake: 45, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.5420, requires_ol_special: true },
  { uni_code: '091G', course_code: '091', institution_code: 'UOM', duration_years: 4, medium: ['E'], proposed_intake: 75, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.7850, requires_ol_special: true },
  { uni_code: '095F', course_code: '095', institution_code: 'UOR', duration_years: 4, medium: ['E'], proposed_intake: 60, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3850, requires_ol_special: true },
  { uni_code: '096C', course_code: '096', institution_code: 'USJP', duration_years: 3, medium: ['E'], proposed_intake: 90, aptitude_test_required: true, all_island_merit_only: false, colombo_base_z: 1.6240, requires_ol_special: true },
  { uni_code: '096L', course_code: '096', institution_code: 'SUSL', duration_years: 3, medium: ['E'], proposed_intake: 75, aptitude_test_required: true, all_island_merit_only: false, colombo_base_z: 1.4850, requires_ol_special: true },
  { uni_code: '096T', course_code: '096', institution_code: 'UCSC', duration_years: 3, medium: ['E'], proposed_intake: 95, aptitude_test_required: true, all_island_merit_only: false, colombo_base_z: 1.6950, requires_ol_special: true },
  { uni_code: '097G', course_code: '097', institution_code: 'UOM', duration_years: 4, medium: ['E'], proposed_intake: 45, aptitude_test_required: true, all_island_merit_only: false, colombo_base_z: 1.4120, requires_ol_special: true },
  { uni_code: '098D', course_code: '098', institution_code: 'UOK', duration_years: 4, medium: ['E', 'S'], proposed_intake: 55, aptitude_test_required: true, all_island_merit_only: false, colombo_base_z: 1.4950, requires_ol_special: true },
  { uni_code: '098E', course_code: '098', institution_code: 'UOJ', duration_years: 4, medium: ['E', 'T'], proposed_intake: 50, aptitude_test_required: true, all_island_merit_only: false, colombo_base_z: 1.3650, requires_ol_special: true },
  { uni_code: '098H', course_code: '098', institution_code: 'EUSL', duration_years: 4, medium: ['E', 'T'], proposed_intake: 45, aptitude_test_required: true, all_island_merit_only: false, colombo_base_z: 1.3250, requires_ol_special: true },
  { uni_code: '098L', course_code: '098', institution_code: 'SUSL', duration_years: 4, medium: ['E', 'S'], proposed_intake: 50, aptitude_test_required: true, all_island_merit_only: false, colombo_base_z: 1.4120, requires_ol_special: true },
  { uni_code: '107L', course_code: '107', institution_code: 'SUSL', duration_years: 4, medium: ['E'], proposed_intake: 60, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3450, requires_ol_special: true },
  { uni_code: '109G', course_code: '109', institution_code: 'UOM', duration_years: 4, medium: ['E'], proposed_intake: 65, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.6450, requires_ol_special: true },
  { uni_code: '110D', course_code: '110', institution_code: 'UOK', duration_years: 4, medium: ['E'], proposed_intake: 60, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.6850, requires_ol_special: true },
  { uni_code: '128C', course_code: '128', institution_code: 'USJP', duration_years: 3, medium: ['E', 'S'], proposed_intake: 75, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.4250, requires_ol_special: true },
  { uni_code: '132U', course_code: '132', institution_code: 'UWU', duration_years: 4, medium: ['E'], proposed_intake: 65, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3850, requires_ol_special: true },
  { uni_code: '137A', course_code: '137', institution_code: 'UOC', duration_years: 4, medium: ['S'], proposed_intake: 70, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3120, requires_ol_special: true },

  // Medicine (001) - Official UGC Letters: A=UOC, B=UOP, C=USJP, D=UOK, E=UOJ, F=UOR, G=UOM, H=EUSL, K=RUSL, L=SUSL, M=WUSL, U=UWU
  { uni_code: '001A', course_code: '001', institution_code: 'UOC', duration_years: 5, medium: ['E'], proposed_intake: 215, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 2.4125, requires_ol_special: true },
  { uni_code: '001B', course_code: '001', institution_code: 'UOP', duration_years: 5, medium: ['E'], proposed_intake: 220, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 2.2450, requires_ol_special: true },
  { uni_code: '001C', course_code: '001', institution_code: 'USJP', duration_years: 5, medium: ['E'], proposed_intake: 185, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 2.2850, requires_ol_special: true },
  { uni_code: '001D', course_code: '001', institution_code: 'UOK', duration_years: 5, medium: ['E'], proposed_intake: 190, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 2.1980, requires_ol_special: true },
  { uni_code: '001E', course_code: '001', institution_code: 'UOJ', duration_years: 5, medium: ['E'], proposed_intake: 180, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 2.0110, requires_ol_special: true },
  { uni_code: '001F', course_code: '001', institution_code: 'UOR', duration_years: 5, medium: ['E'], proposed_intake: 205, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 2.1140, requires_ol_special: true },
  { uni_code: '001G', course_code: '001', institution_code: 'UOM', duration_years: 5, medium: ['E'], proposed_intake: 100, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 2.3850, requires_ol_special: true },
  { uni_code: '001H', course_code: '001', institution_code: 'EUSL', duration_years: 5, medium: ['E'], proposed_intake: 120, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.9540, requires_ol_special: true },
  { uni_code: '001K', course_code: '001', institution_code: 'RUSL', duration_years: 5, medium: ['E'], proposed_intake: 180, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.9950, requires_ol_special: true },
  { uni_code: '001L', course_code: '001', institution_code: 'SUSL', duration_years: 5, medium: ['E'], proposed_intake: 150, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.9820, requires_ol_special: true },
  { uni_code: '001M', course_code: '001', institution_code: 'WUSL', duration_years: 5, medium: ['E'], proposed_intake: 140, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 2.0450, requires_ol_special: true },
  { uni_code: '001U', course_code: '001', institution_code: 'UWU', duration_years: 5, medium: ['E'], proposed_intake: 100, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.9420, requires_ol_special: true },

  // Dental Surgery (002)
  { uni_code: '002B', course_code: '002', institution_code: 'UOP', duration_years: 5, medium: ['E'], proposed_intake: 110, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.9450, requires_ol_special: true },

  // Agriculture (004)
  { uni_code: '004B', course_code: '004', institution_code: 'UOP', duration_years: 4, medium: ['E'], proposed_intake: 260, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.5420 },
  { uni_code: '004F', course_code: '004', institution_code: 'UOR', duration_years: 4, medium: ['E'], proposed_intake: 210, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3850 },
  { uni_code: '004E', course_code: '004', institution_code: 'UOJ', duration_years: 4, medium: ['E'], proposed_intake: 180, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.2950 },

  // Engineering (008) - Official UGC Letters: G=UOM, B=UOP, F=UOR, E=UOJ, C=USJP, J=SEUSL
  { uni_code: '008G', course_code: '008', institution_code: 'UOM', duration_years: 4, medium: ['E'], proposed_intake: 900, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.9850, requires_ol_special: true },
  { uni_code: '008B', course_code: '008', institution_code: 'UOP', duration_years: 4, medium: ['E'], proposed_intake: 465, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.7620, requires_ol_special: true },
  { uni_code: '008F', course_code: '008', institution_code: 'UOR', duration_years: 4, medium: ['E'], proposed_intake: 525, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.5940, requires_ol_special: true },
  { uni_code: '008E', course_code: '008', institution_code: 'UOJ', duration_years: 4, medium: ['E'], proposed_intake: 245, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.4610, requires_ol_special: true },
  { uni_code: '008C', course_code: '008', institution_code: 'USJP', duration_years: 4, medium: ['E'], proposed_intake: 180, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.7150, requires_ol_special: true },
  { uni_code: '008J', course_code: '008', institution_code: 'SEUSL', duration_years: 4, medium: ['E'], proposed_intake: 160, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3890, requires_ol_special: true },

  // Quantity Surveying (010)
  { uni_code: '010G', course_code: '010', institution_code: 'UOM', duration_years: 4, medium: ['E'], proposed_intake: 155, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.5240, requires_ol_special: true },

  // Computer Science (012) - Official UGC Letters: T=UCSC, C=USJP, D=UOK, E=UOJ, F=UOR, W=TC
  { uni_code: '012T', course_code: '012', institution_code: 'UCSC', duration_years: 3, medium: ['E'], proposed_intake: 255, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.7240, requires_ol_special: true },
  { uni_code: '012C', course_code: '012', institution_code: 'USJP', duration_years: 4, medium: ['E'], proposed_intake: 120, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.6450, requires_ol_special: true },
  { uni_code: '012D', course_code: '012', institution_code: 'UOK', duration_years: 4, medium: ['E'], proposed_intake: 95, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.5680, requires_ol_special: true },
  { uni_code: '012E', course_code: '012', institution_code: 'UOJ', duration_years: 4, medium: ['E'], proposed_intake: 140, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3920, requires_ol_special: true },
  { uni_code: '012F', course_code: '012', institution_code: 'UOR', duration_years: 4, medium: ['E'], proposed_intake: 110, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.4810, requires_ol_special: true },
  { uni_code: '012W', course_code: '012', institution_code: 'TC', duration_years: 3, medium: ['E'], proposed_intake: 95, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.2840, nqc_districts: [11, 14], requires_ol_special: true },

  // Physical Science (013)
  { uni_code: '013A', course_code: '013', institution_code: 'UOC', duration_years: 3, medium: ['E', 'S'], proposed_intake: 325, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.4850 },
  { uni_code: '013B', course_code: '013', institution_code: 'UOP', duration_years: 3, medium: ['E', 'S'], proposed_intake: 340, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3100 },
  { uni_code: '013C', course_code: '013', institution_code: 'USJP', duration_years: 3, medium: ['E', 'S'], proposed_intake: 360, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3650 },
  { uni_code: '013D', course_code: '013', institution_code: 'UOK', duration_years: 3, medium: ['E', 'S'], proposed_intake: 310, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.2450 },
  { uni_code: '013E', course_code: '013', institution_code: 'UOJ', duration_years: 3, medium: ['E', 'T'], proposed_intake: 250, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 0.9850, nqc_districts: [23] },
  { uni_code: '013F', course_code: '013', institution_code: 'UOR', duration_years: 3, medium: ['E', 'S'], proposed_intake: 290, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.1420 },

  // Management (016)
  { uni_code: '016A', course_code: '016', institution_code: 'UOC', duration_years: 4, medium: ['E'], proposed_intake: 615, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.8120 },
  { uni_code: '016C', course_code: '016', institution_code: 'USJP', duration_years: 4, medium: ['E', 'S'], proposed_intake: 1210, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.8640 },
  { uni_code: '016D', course_code: '016', institution_code: 'UOK', duration_years: 4, medium: ['E', 'S'], proposed_intake: 680, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.6950 },
  { uni_code: '016B', course_code: '016', institution_code: 'UOP', duration_years: 4, medium: ['E'], proposed_intake: 260, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.6520 },

  // Arts (019) — All-Island Merit Only per UGC rules
  { uni_code: '019A', course_code: '019', institution_code: 'UOC', duration_years: 3, medium: ['E', 'S', 'T'], proposed_intake: 720, aptitude_test_required: false, all_island_merit_only: true, colombo_base_z: 1.5420 },
  { uni_code: '019B', course_code: '019', institution_code: 'UOP', duration_years: 3, medium: ['E', 'S', 'T'], proposed_intake: 950, aptitude_test_required: false, all_island_merit_only: true, colombo_base_z: 1.4880 },
  { uni_code: '019D', course_code: '019', institution_code: 'UOK', duration_years: 3, medium: ['E', 'S'], proposed_intake: 890, aptitude_test_required: false, all_island_merit_only: true, colombo_base_z: 1.4410 },

  // Law (020)
  { uni_code: '020A', course_code: '020', institution_code: 'UOC', duration_years: 4, medium: ['E', 'S', 'T'], proposed_intake: 315, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.9120, requires_ol_special: true },
  { uni_code: '020B', course_code: '020', institution_code: 'UOP', duration_years: 4, medium: ['E'], proposed_intake: 110, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.8250, requires_ol_special: true },
  { uni_code: '020E', course_code: '020', institution_code: 'UOJ', duration_years: 4, medium: ['E', 'T'], proposed_intake: 105, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.7410, requires_ol_special: true },

  // Architecture (023) — Aptitude Test Required
  { uni_code: '023G', course_code: '023', institution_code: 'UOM', duration_years: 5, medium: ['E'], proposed_intake: 100, aptitude_test_required: true, all_island_merit_only: false, colombo_base_z: 1.4250, requires_ol_special: true },

  // Information Technology (026)
  { uni_code: '026G', course_code: '026', institution_code: 'UOM', duration_years: 4, medium: ['E'], proposed_intake: 250, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.6890, requires_ol_special: true },

  // Information Systems (038)
  { uni_code: '038T', course_code: '038', institution_code: 'UCSC', duration_years: 3, medium: ['E'], proposed_intake: 120, aptitude_test_required: true, all_island_merit_only: false, colombo_base_z: 1.5120, requires_ol_special: true },
  { uni_code: '038C', course_code: '038', institution_code: 'USJP', duration_years: 4, medium: ['E'], proposed_intake: 115, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.4950, requires_ol_special: true },

  // Artificial Intelligence (096)
  { uni_code: '096G', course_code: '096', institution_code: 'UOM', duration_years: 4, medium: ['E'], proposed_intake: 75, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.8150, nqc_districts: [12, 14], requires_ol_special: true },

  // Data Science (136)
  { uni_code: '136L', course_code: '136', institution_code: 'SUSL', duration_years: 4, medium: ['E'], proposed_intake: 80, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.6250, requires_ol_special: true },

  // Engineering Technology (102)
  { uni_code: '102A', course_code: '102', institution_code: 'UOC', duration_years: 4, medium: ['E'], proposed_intake: 125, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.6850 },
  { uni_code: '102C', course_code: '102', institution_code: 'USJP', duration_years: 4, medium: ['E'], proposed_intake: 205, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.6420 },
  { uni_code: '102D', course_code: '102', institution_code: 'UOK', duration_years: 4, medium: ['E'], proposed_intake: 165, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.5480 },
  { uni_code: '102E', course_code: '102', institution_code: 'UOJ', duration_years: 4, medium: ['E'], proposed_intake: 140, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3450 },
  { uni_code: '102F', course_code: '102', institution_code: 'UOR', duration_years: 4, medium: ['E'], proposed_intake: 175, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.4620 },
  { uni_code: '102K', course_code: '102', institution_code: 'RUSL', duration_years: 4, medium: ['E'], proposed_intake: 150, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3180, nqc_districts: [1, 14] },
  { uni_code: '102L', course_code: '102', institution_code: 'SUSL', duration_years: 4, medium: ['E'], proposed_intake: 130, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3520 },
  { uni_code: '102M', course_code: '102', institution_code: 'WUSL', duration_years: 4, medium: ['E'], proposed_intake: 160, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3840 },
  { uni_code: '102U', course_code: '102', institution_code: 'UWU', duration_years: 4, medium: ['E'], proposed_intake: 120, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.2950 },

  // Biosystems Technology (103)
  { uni_code: '103A', course_code: '103', institution_code: 'UOC', duration_years: 4, medium: ['E'], proposed_intake: 110, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.5450 },
  { uni_code: '103C', course_code: '103', institution_code: 'USJP', duration_years: 4, medium: ['E'], proposed_intake: 140, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.5120 },
  { uni_code: '103E', course_code: '103', institution_code: 'UOJ', duration_years: 4, medium: ['E'], proposed_intake: 115, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3120 },
  { uni_code: '103F', course_code: '103', institution_code: 'UOR', duration_years: 4, medium: ['E'], proposed_intake: 135, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3740 },
  { uni_code: '103H', course_code: '103', institution_code: 'EUSL', duration_years: 4, medium: ['E'], proposed_intake: 110, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.2450 },
  { uni_code: '103J', course_code: '103', institution_code: 'SEUSL', duration_years: 4, medium: ['E'], proposed_intake: 105, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.2210 },
  { uni_code: '103K', course_code: '103', institution_code: 'RUSL', duration_years: 4, medium: ['E'], proposed_intake: 125, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.2650 },
  { uni_code: '103L', course_code: '103', institution_code: 'SUSL', duration_years: 4, medium: ['E'], proposed_intake: 120, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.2810 },
  { uni_code: '103M', course_code: '103', institution_code: 'WUSL', duration_years: 4, medium: ['E'], proposed_intake: 130, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3150 },
  { uni_code: '103U', course_code: '103', institution_code: 'UWU', duration_years: 4, medium: ['E'], proposed_intake: 115, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.2720 },

  // Suspended Course (GWUIM 140P) for Section 5.3 & Suspension Guards
  { uni_code: '140P', course_code: '140', institution_code: 'GWUIM', duration_years: 4, medium: ['E'], proposed_intake: 0, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.1500, is_suspended: true },
];

// ProgramCutoffViewRow is re-exported from ./ugc/types

export function buildProgramCutoffRowsForDistrict(districtId: number): ProgramCutoffViewRow[] {
  const district = SRI_LANKA_DISTRICTS.find((d) => d.district_id === districtId) ?? SRI_LANKA_DISTRICTS[0];

  return (ADMISSION_OPTIONS_SEED.map((opt) => {
    const course = UGC_COURSES.find((c) => c.course_code === opt.course_code)!;
    const inst = UGC_INSTITUTIONS.find((i) => i.institution_code === opt.institution_code)!;
    const isNqc = opt.nqc_districts?.includes(districtId) ?? false;

    const computedZ = opt.all_island_merit_only
      ? opt.colombo_base_z
      : Number((opt.colombo_base_z + district.difficulty_offset).toFixed(4));

    return {
      uni_code: opt.uni_code,
      course_code: opt.course_code,
      course_name: course.name,
      stream: course.stream,
      faculty: course.faculty,
      degree_awarded: course.degree_awarded,
      subject_requirements: course.subject_requirements,
      course_description: course.description,
      career_category: course.career_category,
      institution_code: inst.institution_code,
      institution_name: inst.name,
      institution_type: inst.type,
      institution_location: inst.location,
      institution_website: inst.website,
      duration_years: opt.duration_years,
      medium: opt.medium,
      proposed_intake: opt.proposed_intake,
      aptitude_test_required: opt.aptitude_test_required,
      all_island_merit_only: opt.all_island_merit_only,
      district_id: district.district_id,
      district_name: district.district_name,
      academic_year: '2024/2025',
      min_z_score: isNqc ? null : computedZ,
      status: isNqc ? 'NQC' : 'QUALIFIED',
      all_island_min_z: Number((opt.colombo_base_z - 0.24).toFixed(4)),
      all_island_max_z: opt.colombo_base_z,
      requires_ol_special: Boolean(OL_REQUIREMENTS_BY_COURSE_CODE[opt.course_code]) || (opt.requires_ol_special ?? false),
      is_suspended: opt.is_suspended ?? false,
      ol_rule: OL_REQUIREMENTS_BY_COURSE_CODE[opt.course_code] ?? null,
      ol_requirements_text: OL_REQUIREMENTS_BY_COURSE_CODE[opt.course_code]?.full_description ?? null,
      ol_short_badge: OL_REQUIREMENTS_BY_COURSE_CODE[opt.course_code]?.short_badge ?? null,
      overview: COURSE_MASTER_OVERVIEWS[opt.course_code]?.overview || course.description,
      al_requirements_summary: COURSE_MASTER_OVERVIEWS[opt.course_code]?.al_requirements_summary || (course.subject_requirements.notes || '3 S passes in approved A/L subjects'),
      specializations: COURSE_MASTER_OVERVIEWS[opt.course_code]?.specializations || [],
      special_intake_quota_note: COURSE_MASTER_OVERVIEWS[opt.course_code]?.special_intake_quota_note ?? null,
      aptitude_test_info: COURSE_MASTER_OVERVIEWS[opt.course_code]?.aptitude_test_info ?? (opt.aptitude_test_required ? 'Pass University Aptitude / Practical Test' : null),
      career_paths: COURSE_MASTER_OVERVIEWS[opt.course_code]?.career_paths || [],
      total_national_intake: COURSE_MASTER_OVERVIEWS[opt.course_code]?.total_national_intake ?? 120,
      differently_abled_quota: COURSE_MASTER_OVERVIEWS[opt.course_code]?.differently_abled_quota ?? 5,
    };
  }) as unknown as ProgramCutoffViewRow[]);
}

export type HigherEdTier =
  | 'TIER_2_STATE_NON_UGC'
  | 'TIER_3_MOHE_DAI_IFSLS'
  | 'TIER_4_FOREIGN_AFFILIATED';

export type EntryQualification =
  | 'AL_PASS'           // 3 A/L Passes (Any Stream)
  | 'PENDING_AL'        // Pending A/L Results
  | 'POST_OL_FOUNDATION'// Post-O/L (Foundation Track)
  | 'NVQ_TOPUP';        // NVQ Level 5 / HND Top-Up

export type FinancialAidType =
  | 'IFSLS_LOAN'        // MOHE 0% Interest Loan
  | 'TUITION_FREE_STATE'// Free State non-UGC
  | 'MERIT_SCHOLARSHIP' // A/L Merit Scholarship (3A / 2A 1B)
  | 'INSTALLMENTS';     // Semester / Monthly installment

export interface PrivateAndAlternativeProgram {
  id: string;
  tier: HigherEdTier;
  tier_name: string;
  institute_code: string;
  institute_name: string;
  institute_abbr: string;
  degree_title: string;
  awarding_body: string;
  country_of_award: string;
  duration_years: number;
  entry_qualifications: EntryQualification[];
  financial_aid_types: FinancialAidType[];
  tuition_total_lkr: number | null;
  tuition_note: string;
  intake_months: string[];
  mandatory_internship: boolean;
  internship_note?: string;
  mohe_approved: boolean;
  ugc_recognized_foreign: boolean;
  iesl_accredited: boolean;
  slmc_recognized: boolean;
  tvec_nvq_level?: 'NVQ Level 6' | 'NVQ Level 7' | null;
  state_equivalent_uni_code?: string;
  state_equivalent_name?: string;
  location: string;
  website: string;
}

export const PRIVATE_AND_ALTERNATIVE_PROGRAMS: PrivateAndAlternativeProgram[] = [
  // ==========================================
  // TIER 2: State Non-UGC & Direct Government
  // ==========================================
  {
    id: 'tier2-ousl-it',
    tier: 'TIER_2_STATE_NON_UGC',
    tier_name: 'State Non-UGC (Direct Entry)',
    institute_code: 'OUSL',
    institute_name: 'Open University of Sri Lanka',
    institute_abbr: 'OUSL',
    degree_title: 'Bachelor of Science (Hons) in Information Technology',
    awarding_body: 'Open University of Sri Lanka (State University)',
    country_of_award: 'Sri Lanka',
    duration_years: 4,
    entry_qualifications: ['AL_PASS', 'PENDING_AL'],
    financial_aid_types: ['INSTALLMENTS'],
    tuition_total_lkr: 420000,
    tuition_note: 'Approx. LKR 52,500/semester (Highly subsidized state open education)',
    intake_months: ['January', 'August'],
    mandatory_internship: true,
    internship_note: '6-month industrial internship in Year 4',
    mohe_approved: true,
    ugc_recognized_foreign: false,
    iesl_accredited: false,
    slmc_recognized: false,
    state_equivalent_uni_code: '012T',
    state_equivalent_name: 'UCSC Information Technology',
    location: 'Nawala, Nugegoda (Island-wide regional centers)',
    website: 'https://ou.ac.lk',
  },
  {
    id: 'tier2-ousl-law',
    tier: 'TIER_2_STATE_NON_UGC',
    tier_name: 'State Non-UGC (Direct Entry)',
    institute_code: 'OUSL',
    institute_name: 'Open University of Sri Lanka',
    institute_abbr: 'OUSL',
    degree_title: 'Bachelor of Laws (LLB Hons)',
    awarding_body: 'Open University of Sri Lanka (State University)',
    country_of_award: 'Sri Lanka',
    duration_years: 4,
    entry_qualifications: ['AL_PASS'],
    financial_aid_types: ['INSTALLMENTS'],
    tuition_total_lkr: 480000,
    tuition_note: 'Affordable modular state tuition (Qualifies for Sri Lanka Law College direct entry)',
    intake_months: ['March', 'October'],
    mandatory_internship: false,
    mohe_approved: true,
    ugc_recognized_foreign: false,
    iesl_accredited: false,
    slmc_recognized: false,
    state_equivalent_uni_code: '019A',
    state_equivalent_name: 'UOC Law (019A)',
    location: 'Nawala, Colombo & Kandy Regional Center',
    website: 'https://ou.ac.lk',
  },
  {
    id: 'tier2-kdu-eng',
    tier: 'TIER_2_STATE_NON_UGC',
    tier_name: 'State Non-UGC (Direct Entry)',
    institute_code: 'KDU',
    institute_name: 'General Sir John Kotelawala Defence University (Day Scholars)',
    institute_abbr: 'KDU',
    degree_title: 'BSc (Hons) in Engineering (Civil / Mechanical / Mechatronics)',
    awarding_body: 'Kotelawala Defence University (Chartered State Defense University)',
    country_of_award: 'Sri Lanka',
    duration_years: 4,
    entry_qualifications: ['AL_PASS'],
    financial_aid_types: ['INSTALLMENTS', 'MERIT_SCHOLARSHIP'],
    tuition_total_lkr: 2400000,
    tuition_note: 'Direct admission via kdu.ac.lk aptitude test & interview for civilian day scholars',
    intake_months: ['January', 'September'],
    mandatory_internship: true,
    internship_note: '6-month military/industrial tech training & lab exposure',
    mohe_approved: true,
    ugc_recognized_foreign: false,
    iesl_accredited: true,
    slmc_recognized: false,
    state_equivalent_uni_code: '008G',
    state_equivalent_name: 'Moratuwa Engineering (008G)',
    location: 'Kandawala Estate, Ratmalana',
    website: 'https://kdu.ac.lk',
  },
  {
    id: 'tier2-kdu-cs',
    tier: 'TIER_2_STATE_NON_UGC',
    tier_name: 'State Non-UGC (Direct Entry)',
    institute_code: 'KDU',
    institute_name: 'General Sir John Kotelawala Defence University (Day Scholars)',
    institute_abbr: 'KDU',
    degree_title: 'BSc (Hons) in Computer Science & Software Engineering',
    awarding_body: 'Kotelawala Defence University',
    country_of_award: 'Sri Lanka',
    duration_years: 4,
    entry_qualifications: ['AL_PASS', 'PENDING_AL'],
    financial_aid_types: ['INSTALLMENTS'],
    tuition_total_lkr: 1850000,
    tuition_note: 'Direct entry for civilian day scholars via KDU written test',
    intake_months: ['January', 'September'],
    mandatory_internship: true,
    mohe_approved: true,
    ugc_recognized_foreign: false,
    iesl_accredited: false,
    slmc_recognized: false,
    state_equivalent_uni_code: '026G',
    state_equivalent_name: 'Moratuwa IT (026G)',
    location: 'Ratmalana, Western Province',
    website: 'https://kdu.ac.lk',
  },
  {
    id: 'tier2-uovt-software',
    tier: 'TIER_2_STATE_NON_UGC',
    tier_name: 'State Non-UGC (Direct Entry)',
    institute_code: 'UOVT',
    institute_name: 'University of Vocational Technology',
    institute_abbr: 'UoVT',
    degree_title: 'Bachelor of Technology (BTech) in Software Technology (NVQ Level 7)',
    awarding_body: 'University of Vocational Technology (State University)',
    country_of_award: 'Sri Lanka',
    duration_years: 4,
    entry_qualifications: ['AL_PASS', 'NVQ_TOPUP'],
    financial_aid_types: ['TUITION_FREE_STATE'],
    tuition_total_lkr: 0,
    tuition_note: '100% Free Government Tuition for Weekday Students + Mahapola Eligibility',
    intake_months: ['February'],
    mandatory_internship: true,
    internship_note: '1-year continuous industrial internship under TVEC supervision',
    mohe_approved: true,
    ugc_recognized_foreign: false,
    iesl_accredited: false,
    slmc_recognized: false,
    tvec_nvq_level: 'NVQ Level 7',
    state_equivalent_uni_code: '026G',
    state_equivalent_name: 'Moratuwa Information Technology',
    location: 'Ratmalana',
    website: 'https://uovt.ac.lk',
  },
  {
    id: 'tier2-sliate-hndit',
    tier: 'TIER_2_STATE_NON_UGC',
    tier_name: 'State Non-UGC (Direct Entry)',
    institute_code: 'SLIATE',
    institute_name: 'Sri Lanka Institute of Advanced Technological Education',
    institute_abbr: 'SLIATE',
    degree_title: 'Higher National Diploma in Information Technology (HNDIT - NVQ Level 6)',
    awarding_body: 'SLIATE (Ministry of Higher Education Statutory Body)',
    country_of_award: 'Sri Lanka',
    duration_years: 3,
    entry_qualifications: ['AL_PASS'],
    financial_aid_types: ['TUITION_FREE_STATE'],
    tuition_total_lkr: 0,
    tuition_note: '100% Tuition-Free State Higher Diploma with Mahapola/Bursary allowance across 19 ATIs',
    intake_months: ['March'],
    mandatory_internship: true,
    internship_note: '6-month NAITA accredited software industry training',
    mohe_approved: true,
    ugc_recognized_foreign: false,
    iesl_accredited: false,
    slmc_recognized: false,
    tvec_nvq_level: 'NVQ Level 6',
    state_equivalent_uni_code: '012T',
    state_equivalent_name: 'UCSC Information Technology',
    location: '19 Campuses Island-wide (Colombo, Kandy, Galle, Jaffna, Kurunegala)',
    website: 'http://www.sliate.ac.lk',
  },

  // ==========================================
  // TIER 3: MOHE DAIs & IFSLS Loan Partners
  // ==========================================
  {
    id: 'tier3-sliit-se',
    tier: 'TIER_3_MOHE_DAI_IFSLS',
    tier_name: 'MOHE Degree Awarding Institute (DAI)',
    institute_code: 'SLIIT',
    institute_name: 'Sri Lanka Institute of Information Technology',
    institute_abbr: 'SLIIT',
    degree_title: 'BSc (Hons) in Information Technology (Software Engineering / AI / Cyber)',
    awarding_body: 'SLIIT (MOHE Approved Non-State Degree Awarding Institute)',
    country_of_award: 'Sri Lanka',
    duration_years: 4,
    entry_qualifications: ['AL_PASS', 'PENDING_AL', 'POST_OL_FOUNDATION', 'NVQ_TOPUP'],
    financial_aid_types: ['IFSLS_LOAN', 'MERIT_SCHOLARSHIP', 'INSTALLMENTS'],
    tuition_total_lkr: 2850000,
    tuition_note: 'LKR 0 Upfront under MOHE IFSLS Government Loan (84-mo repayment post-grad) or LKR 355k/sem',
    intake_months: ['February', 'June', 'October'],
    mandatory_internship: true,
    internship_note: '6-to-12 month paid corporate industry training in Year 3/4',
    mohe_approved: true,
    ugc_recognized_foreign: false,
    iesl_accredited: false,
    slmc_recognized: false,
    state_equivalent_uni_code: '012T',
    state_equivalent_name: 'UCSC Information Technology (012T)',
    location: 'Malabe Campus / Colombo Metro / Kandy / Kurunegala / Jaffna',
    website: 'https://www.sliit.lk',
  },
  {
    id: 'tier3-sliit-eng',
    tier: 'TIER_3_MOHE_DAI_IFSLS',
    tier_name: 'MOHE Degree Awarding Institute (DAI)',
    institute_code: 'SLIIT',
    institute_name: 'Sri Lanka Institute of Information Technology',
    institute_abbr: 'SLIIT',
    degree_title: 'BSc (Hons) in Engineering (Civil / Electrical / Mechanical)',
    awarding_body: 'SLIIT (MOHE Approved · IESL Recognized)',
    country_of_award: 'Sri Lanka',
    duration_years: 4,
    entry_qualifications: ['AL_PASS', 'PENDING_AL'],
    financial_aid_types: ['IFSLS_LOAN', 'MERIT_SCHOLARSHIP', 'INSTALLMENTS'],
    tuition_total_lkr: 3600000,
    tuition_note: 'Eligible for MOHE IFSLS Government Student Loan (Full tuition funded upfront by Bank of Ceylon)',
    intake_months: ['February', 'October'],
    mandatory_internship: true,
    internship_note: '6-month IESL-supervised practical engineering internship',
    mohe_approved: true,
    ugc_recognized_foreign: false,
    iesl_accredited: true,
    slmc_recognized: false,
    state_equivalent_uni_code: '008G',
    state_equivalent_name: 'Moratuwa Engineering (008G)',
    location: 'Malabe Campus, Colombo',
    website: 'https://www.sliit.lk',
  },
  {
    id: 'tier3-nsbm-cs',
    tier: 'TIER_3_MOHE_DAI_IFSLS',
    tier_name: 'MOHE Degree Awarding Institute (DAI)',
    institute_code: 'NSBM',
    institute_name: 'NSBM Green University',
    institute_abbr: 'NSBM',
    degree_title: 'BSc (Hons) in Computer Science & Data Science',
    awarding_body: 'NSBM Green University (Government-Owned State-Sponsored DAI)',
    country_of_award: 'Sri Lanka',
    duration_years: 4,
    entry_qualifications: ['AL_PASS', 'PENDING_AL', 'POST_OL_FOUNDATION'],
    financial_aid_types: ['IFSLS_LOAN', 'MERIT_SCHOLARSHIP', 'INSTALLMENTS'],
    tuition_total_lkr: 2200000,
    tuition_note: '100% MOHE Interest-Free Student Loan Eligible (Zero upfront fee + LKR 300,000 living stipend)',
    intake_months: ['March', 'October'],
    mandatory_internship: true,
    internship_note: '1-year industry placement with leading tech partners (WSO2, IFS, Virtusa)',
    mohe_approved: true,
    ugc_recognized_foreign: false,
    iesl_accredited: false,
    slmc_recognized: false,
    state_equivalent_uni_code: '026G',
    state_equivalent_name: 'Moratuwa Information Technology',
    location: 'Pitipana, Homagama',
    website: 'https://www.nsbm.ac.lk',
  },
  {
    id: 'tier3-cinec-eng',
    tier: 'TIER_3_MOHE_DAI_IFSLS',
    tier_name: 'MOHE Degree Awarding Institute (DAI)',
    institute_code: 'CINEC',
    institute_name: 'CINEC Campus',
    institute_abbr: 'CINEC',
    degree_title: 'BSc (Hons) in Engineering (Civil / Automotive / Mechatronics / Maritime)',
    awarding_body: 'CINEC Campus (MOHE Approved Degree Awarding Institute)',
    country_of_award: 'Sri Lanka',
    duration_years: 4,
    entry_qualifications: ['AL_PASS', 'PENDING_AL'],
    financial_aid_types: ['IFSLS_LOAN', 'INSTALLMENTS'],
    tuition_total_lkr: 2600000,
    tuition_note: 'MOHE IFSLS Government Loan Partner (0% Interest, backed by People’s Bank)',
    intake_months: ['January', 'July'],
    mandatory_internship: true,
    internship_note: 'Simulator labs and practical shipyard/industrial tech exposure',
    mohe_approved: true,
    ugc_recognized_foreign: false,
    iesl_accredited: true,
    slmc_recognized: false,
    state_equivalent_uni_code: '008G',
    state_equivalent_name: 'Moratuwa Engineering',
    location: 'Millennium Drive, Malabe',
    website: 'https://www.cinec.edu',
  },
  {
    id: 'tier3-horizon-biotech',
    tier: 'TIER_3_MOHE_DAI_IFSLS',
    tier_name: 'MOHE Degree Awarding Institute (DAI)',
    institute_code: 'HORIZON',
    institute_name: 'Horizon Campus',
    institute_abbr: 'Horizon',
    degree_title: 'BSc (Hons) in Biotechnology',
    awarding_body: 'Horizon Campus (MOHE Approved Degree Awarding Institute)',
    country_of_award: 'Sri Lanka',
    duration_years: 4,
    entry_qualifications: ['AL_PASS', 'PENDING_AL'],
    financial_aid_types: ['IFSLS_LOAN', 'INSTALLMENTS'],
    tuition_total_lkr: 1950000,
    tuition_note: '100% Covered under MOHE Interest-Free Student Loan Scheme',
    intake_months: ['February', 'September'],
    mandatory_internship: true,
    mohe_approved: true,
    ugc_recognized_foreign: false,
    iesl_accredited: false,
    slmc_recognized: false,
    state_equivalent_uni_code: '013A',
    state_equivalent_name: 'UOC Biological Sciences',
    location: 'Knowledge City, Malabe',
    website: 'https://horizoncampus.edu.lk',
  },
  {
    id: 'tier3-sanasa-finance',
    tier: 'TIER_3_MOHE_DAI_IFSLS',
    tier_name: 'MOHE Degree Awarding Institute (DAI)',
    institute_code: 'SANASA',
    institute_name: 'SANASA Campus',
    institute_abbr: 'SANASA',
    degree_title: 'BSc (Hons) in Regional Science & Planning / Banking & Finance',
    awarding_body: 'SANASA Campus (MOHE Approved DAI)',
    country_of_award: 'Sri Lanka',
    duration_years: 4,
    entry_qualifications: ['AL_PASS'],
    financial_aid_types: ['IFSLS_LOAN', 'TUITION_FREE_STATE'],
    tuition_total_lkr: 1100000,
    tuition_note: 'Fully covered by MOHE IFSLS LKR 1.1M Loan allowance',
    intake_months: ['March', 'October'],
    mandatory_internship: true,
    mohe_approved: true,
    ugc_recognized_foreign: false,
    iesl_accredited: false,
    slmc_recognized: false,
    state_equivalent_uni_code: '019A',
    state_equivalent_name: 'UOC Arts / Economics',
    location: 'Paragammana, Kegalle',
    website: 'https://www.sanasacampus.lk',
  },

  // ==========================================
  // TIER 4: Foreign University Affiliated
  // ==========================================
  {
    id: 'tier4-iit-se',
    tier: 'TIER_4_FOREIGN_AFFILIATED',
    tier_name: 'Foreign University Affiliated (Direct UK Degree)',
    institute_code: 'IIT',
    institute_name: 'Informatics Institute of Technology',
    institute_abbr: 'IIT',
    degree_title: 'BEng (Hons) Software Engineering (University of Westminster, UK)',
    awarding_body: 'University of Westminster (United Kingdom)',
    country_of_award: 'United Kingdom',
    duration_years: 4,
    entry_qualifications: ['AL_PASS', 'PENDING_AL', 'POST_OL_FOUNDATION'],
    financial_aid_types: ['MERIT_SCHOLARSHIP', 'INSTALLMENTS'],
    tuition_total_lkr: 3400000,
    tuition_note: 'Internationally recognized UK internal degree + Includes 1-Year Paid Corporate Placement in Year 3',
    intake_months: ['January', 'September'],
    mandatory_internship: true,
    internship_note: 'Famous 1-Year Industry Placement (IP) where students earn LKR 45,000–80,000/mo while studying',
    mohe_approved: false,
    ugc_recognized_foreign: true,
    iesl_accredited: false,
    slmc_recognized: false,
    state_equivalent_uni_code: '008G',
    state_equivalent_name: 'Moratuwa Computer Science & Engineering',
    location: 'Ramakrishna Road, Wellawatte, Colombo 06',
    website: 'https://www.iit.ac.lk',
  },
  {
    id: 'tier4-iit-cs',
    tier: 'TIER_4_FOREIGN_AFFILIATED',
    tier_name: 'Foreign University Affiliated (Direct UK Degree)',
    institute_code: 'IIT',
    institute_name: 'Informatics Institute of Technology',
    institute_abbr: 'IIT',
    degree_title: 'BSc (Hons) Computer Science & Artificial Intelligence (Robert Gordon University, UK)',
    awarding_body: 'Robert Gordon University (United Kingdom)',
    country_of_award: 'United Kingdom',
    duration_years: 4,
    entry_qualifications: ['AL_PASS', 'PENDING_AL', 'POST_OL_FOUNDATION'],
    financial_aid_types: ['MERIT_SCHOLARSHIP', 'INSTALLMENTS'],
    tuition_total_lkr: 3200000,
    tuition_note: 'Direct British internal degree + Post-O/L International Foundation Pathway available',
    intake_months: ['January', 'September'],
    mandatory_internship: true,
    internship_note: '1-year corporate placement with IFS, MillenniumIT, London Stock Exchange Group',
    mohe_approved: false,
    ugc_recognized_foreign: true,
    iesl_accredited: false,
    slmc_recognized: false,
    state_equivalent_uni_code: '096G',
    state_equivalent_name: 'Moratuwa Artificial Intelligence (096G)',
    location: 'Wellawatte, Colombo 06',
    website: 'https://www.iit.ac.lk',
  },
  {
    id: 'tier4-apiit-computing',
    tier: 'TIER_4_FOREIGN_AFFILIATED',
    tier_name: 'Foreign University Affiliated (Direct UK Degree)',
    institute_code: 'APIIT',
    institute_name: 'Asia Pacific Institute of Information Technology',
    institute_abbr: 'APIIT',
    degree_title: 'BSc (Hons) in Computing / Cyber Security (Staffordshire University, UK)',
    awarding_body: 'Staffordshire University (United Kingdom)',
    country_of_award: 'United Kingdom',
    duration_years: 3,
    entry_qualifications: ['AL_PASS', 'PENDING_AL', 'POST_OL_FOUNDATION'],
    financial_aid_types: ['INSTALLMENTS'],
    tuition_total_lkr: 3100000,
    tuition_note: 'Complete 3-year UK honours degree in Colombo or 2+1 UK transfer option',
    intake_months: ['February', 'June', 'October'],
    mandatory_internship: true,
    mohe_approved: false,
    ugc_recognized_foreign: true,
    iesl_accredited: false,
    slmc_recognized: false,
    state_equivalent_uni_code: '012T',
    state_equivalent_name: 'UCSC Computer Science',
    location: 'Union Place, Colombo 02',
    website: 'https://www.apiit.lk',
  },
  {
    id: 'tier4-curtin-eng',
    tier: 'TIER_4_FOREIGN_AFFILIATED',
    tier_name: 'Foreign University Affiliated (Direct Australian Degree)',
    institute_code: 'CURTIN',
    institute_name: 'Curtin Colombo Campus',
    institute_abbr: 'Curtin',
    degree_title: 'Bachelor of Engineering (Hons) Mechatronic Engineering',
    awarding_body: 'Curtin University (Perth, Australia — Global Top 1% University)',
    country_of_award: 'Australia',
    duration_years: 4,
    entry_qualifications: ['AL_PASS', 'PENDING_AL'],
    financial_aid_types: ['MERIT_SCHOLARSHIP', 'INSTALLMENTS'],
    tuition_total_lkr: 4200000,
    tuition_note: 'Direct Australian degree delivered in Colombo at 1/4th the cost of Australian onshore study',
    intake_months: ['March', 'July'],
    mandatory_internship: true,
    internship_note: 'Engineers Australia (EA) & Washington Accord certified curriculum',
    mohe_approved: false,
    ugc_recognized_foreign: true,
    iesl_accredited: true,
    slmc_recognized: false,
    state_equivalent_uni_code: '008G',
    state_equivalent_name: 'Moratuwa Engineering',
    location: 'Nawam Mawatha, Colombo 02',
    website: 'https://curtinsolutions.lk',
  },
];

export interface NonStatePathway {
  id: string;
  institute_name: string;
  institute_abbr: string;
  degree_title: string;
  stream_eligible: string[];
  duration_years: number;
  ifsls_loan_eligible: boolean;
  ugc_recognized: boolean;
  mohe_dai: boolean;
  tvec_nvq_level: string | null;
  tuition_note_lkr: string;
  location: string;
  website: string;
  program_url: string;
  apply_url: string;
  loan_portal_url: string;
  sector: 'MOHE_IFSLS_PRIVATE' | 'DIRECT_PRIVATE_FOREIGN' | 'STATE_NON_UGC';
  entry_stage: ('3_AL_PASSES' | 'PENDING_AL' | 'AFTER_OL_FOUNDATION' | 'NVQ_HND_TOPUP')[];
  study_mode: ('FULL_TIME_WEEKDAY' | 'WEEKEND_PART_TIME' | 'DISTANCE_ONLINE')[];
  tuition_band: 'FREE_STATE' | 'IFSLS_ZERO_UPFRONT' | 'UNDER_500K' | '500K_TO_1_5M' | '1_5M_TO_3_5M';
  total_fee_lkr: number;
  ol_requirement_badge?: string;
  has_merit_scholarship: boolean;
  has_internship: boolean;
  foreign_partner: string | null;
  specializations: string[];
  province: string;
  campus_hub: string;
}

export const NON_STATE_IFSLS_PATHWAYS: NonStatePathway[] = [
  {
    id: 'ifsls-sliit-it',
    institute_name: 'Sri Lanka Institute of Information Technology (SLIIT)',
    institute_abbr: 'SLIIT',
    degree_title: 'BSc (Hons) in Information Technology (Software Engineering / AI / Cyber / Data Science)',
    stream_eligible: ['Physical Science', 'Biological Science', 'Commerce', 'Technology', 'Arts'],
    duration_years: 4,
    ifsls_loan_eligible: true,
    ugc_recognized: true,
    mohe_dai: true,
    tvec_nvq_level: null,
    tuition_note_lkr: 'LKR 0 Upfront under MOHE IFSLS (Repaid over 7 yrs post-grad) or LKR 355k/sem',
    location: 'Malabe / Colombo / Kandy / Kurunegala / Jaffna',
    website: 'https://www.sliit.lk',
    program_url: 'https://www.sliit.lk/academic/faculty-of-computing',
    apply_url: 'https://www.sliit.lk/study/find-a-program',
    loan_portal_url: 'https://studentloans.mohe.gov.lk/loan_application/',
    sector: 'MOHE_IFSLS_PRIVATE',
    entry_stage: ['3_AL_PASSES', 'PENDING_AL', 'AFTER_OL_FOUNDATION', 'NVQ_HND_TOPUP'],
    study_mode: ['FULL_TIME_WEEKDAY', 'WEEKEND_PART_TIME'],
    tuition_band: 'IFSLS_ZERO_UPFRONT',
    total_fee_lkr: 2850000,
    ol_requirement_badge: 'O/L: 6 Passes incl. Credit (C) in Maths & English',
    has_merit_scholarship: true,
    has_internship: true,
    foreign_partner: null,
    specializations: ['Software Engineering', 'Artificial Intelligence', 'Cyber Security', 'Data Science', 'Cloud Computing'],
    province: 'Western',
    campus_hub: 'Malabe Tech Corridor',
  },
  {
    id: 'ifsls-sliit-eng',
    institute_name: 'Sri Lanka Institute of Information Technology (SLIIT)',
    institute_abbr: 'SLIIT',
    degree_title: 'BSc (Hons) in Engineering (Civil / Electrical & Electronic / Mechanical / Mechatronics)',
    stream_eligible: ['Physical Science', 'Technology'],
    duration_years: 4,
    ifsls_loan_eligible: true,
    ugc_recognized: true,
    mohe_dai: true,
    tvec_nvq_level: null,
    tuition_note_lkr: 'Eligible for MOHE IFSLS Govt Loan (Full tuition funded by Bank of Ceylon at 0% interest)',
    location: 'Malabe Campus, Colombo',
    website: 'https://www.sliit.lk',
    program_url: 'https://www.sliit.lk/study/find-a-program',
    apply_url: 'https://www.sliit.lk/study/new-students',
    loan_portal_url: 'https://studentloans.mohe.gov.lk/loan_application/',
    sector: 'MOHE_IFSLS_PRIVATE',
    entry_stage: ['3_AL_PASSES', 'PENDING_AL'],
    study_mode: ['FULL_TIME_WEEKDAY'],
    tuition_band: '1_5M_TO_3_5M',
    total_fee_lkr: 3600000,
    ol_requirement_badge: 'O/L: 6 Passes incl. Credit (C) in Science & Maths',
    has_merit_scholarship: true,
    has_internship: true,
    foreign_partner: null,
    specializations: ['Civil Engineering', 'Electrical & Electronic', 'Mechanical Engineering', 'Mechatronics'],
    province: 'Western',
    campus_hub: 'Malabe Tech Corridor',
  },
  {
    id: 'ifsls-sliit-bus',
    institute_name: 'SLIIT Business School',
    institute_abbr: 'SLIIT',
    degree_title: 'BBA (Hons) in Business Management (Finance / Business Analytics / Logistics / Marketing)',
    stream_eligible: ['Commerce', 'Physical Science', 'Biological Science', 'Arts', 'Technology'],
    duration_years: 4,
    ifsls_loan_eligible: true,
    ugc_recognized: true,
    mohe_dai: true,
    tvec_nvq_level: null,
    tuition_note_lkr: '100% MOHE Interest-Free Student Loan Eligible (Zero upfront tuition fee)',
    location: 'Malabe / Metro Campus Colombo',
    website: 'https://www.sliit.lk',
    program_url: 'https://www.sliit.lk/academic/sliit-business-school',
    apply_url: 'https://www.sliit.lk/study/find-a-program',
    loan_portal_url: 'https://studentloans.mohe.gov.lk/loan_application/',
    sector: 'MOHE_IFSLS_PRIVATE',
    entry_stage: ['3_AL_PASSES', 'PENDING_AL', 'AFTER_OL_FOUNDATION'],
    study_mode: ['FULL_TIME_WEEKDAY', 'WEEKEND_PART_TIME'],
    tuition_band: 'IFSLS_ZERO_UPFRONT',
    total_fee_lkr: 2200000,
    ol_requirement_badge: 'O/L: 6 Passes incl. Credit (C) in Maths or English',
    has_merit_scholarship: true,
    has_internship: true,
    foreign_partner: null,
    specializations: ['Accounting & Finance', 'Business Analytics', 'Logistics & Supply Chain', 'Marketing'],
    province: 'Western',
    campus_hub: 'Malabe Tech Corridor',
  },
  {
    id: 'ifsls-nsbm-cs',
    institute_name: 'NSBM Green University',
    institute_abbr: 'NSBM',
    degree_title: 'BSc (Hons) in Computer Science / Software Engineering / Data Science',
    stream_eligible: ['Physical Science', 'Biological Science', 'Commerce', 'Technology'],
    duration_years: 4,
    ifsls_loan_eligible: true,
    ugc_recognized: true,
    mohe_dai: true,
    tvec_nvq_level: null,
    tuition_note_lkr: 'Eligible for LKR 1.1M MOHE Interest-Free Loan + LKR 300,000 living stipend',
    location: 'Pitipana, Homagama',
    website: 'https://www.nsbm.ac.lk',
    program_url: 'https://www.nsbm.ac.lk/faculty-of-computing/',
    apply_url: 'https://www.nsbm.ac.lk/degree-programmes/',
    loan_portal_url: 'https://studentloans.mohe.gov.lk/loan_application/',
    sector: 'MOHE_IFSLS_PRIVATE',
    entry_stage: ['3_AL_PASSES', 'PENDING_AL', 'AFTER_OL_FOUNDATION'],
    study_mode: ['FULL_TIME_WEEKDAY'],
    tuition_band: 'IFSLS_ZERO_UPFRONT',
    total_fee_lkr: 2200000,
    ol_requirement_badge: 'O/L: 6 Passes incl. Credit (C) in Maths & English',
    has_merit_scholarship: true,
    has_internship: true,
    foreign_partner: 'Plymouth University (UK)',
    specializations: ['Computer Science', 'Software Engineering', 'Data Science', 'Computer Networks'],
    province: 'Western',
    campus_hub: 'Homagama / Pitipana',
  },
  {
    id: 'ifsls-nsbm-bus',
    institute_name: 'NSBM Green University',
    institute_abbr: 'NSBM',
    degree_title: 'BBM (Hons) in Accounting, Finance & International Business',
    stream_eligible: ['Commerce', 'Physical Science', 'Biological Science', 'Arts', 'Technology'],
    duration_years: 4,
    ifsls_loan_eligible: true,
    ugc_recognized: true,
    mohe_dai: true,
    tvec_nvq_level: null,
    tuition_note_lkr: '100% MOHE 0% Interest Loan Approved (Bank of Ceylon / People’s Bank backed)',
    location: 'Pitipana, Homagama',
    website: 'https://www.nsbm.ac.lk',
    program_url: 'https://www.nsbm.ac.lk/faculty-of-business/',
    apply_url: 'https://www.nsbm.ac.lk/degree-programmes/',
    loan_portal_url: 'https://studentloans.mohe.gov.lk/loan_application/',
    sector: 'MOHE_IFSLS_PRIVATE',
    entry_stage: ['3_AL_PASSES', 'PENDING_AL'],
    study_mode: ['FULL_TIME_WEEKDAY'],
    tuition_band: 'IFSLS_ZERO_UPFRONT',
    total_fee_lkr: 1950000,
    ol_requirement_badge: 'O/L: 6 Passes incl. Credit (C) in Maths or English',
    has_merit_scholarship: true,
    has_internship: true,
    foreign_partner: 'Victoria University (Australia)',
    specializations: ['Accounting & Finance', 'International Business', 'Human Resource Management'],
    province: 'Western',
    campus_hub: 'Homagama / Pitipana',
  },
  {
    id: 'ifsls-nsbm-bio',
    institute_name: 'NSBM Green University',
    institute_abbr: 'NSBM',
    degree_title: 'BSc (Hons) in Biomedical Science, Nutrition & Pharmaceutical Science',
    stream_eligible: ['Biological Science'],
    duration_years: 4,
    ifsls_loan_eligible: true,
    ugc_recognized: true,
    mohe_dai: true,
    tvec_nvq_level: null,
    tuition_note_lkr: 'Eligible for MOHE IFSLS Government Student Loan with modern science laboratories',
    location: 'Pitipana, Homagama',
    website: 'https://www.nsbm.ac.lk',
    program_url: 'https://www.nsbm.ac.lk/faculty-of-science/',
    apply_url: 'https://www.nsbm.ac.lk/degree-programmes/',
    loan_portal_url: 'https://studentloans.mohe.gov.lk/loan_application/',
    sector: 'MOHE_IFSLS_PRIVATE',
    entry_stage: ['3_AL_PASSES', 'PENDING_AL'],
    study_mode: ['FULL_TIME_WEEKDAY'],
    tuition_band: '1_5M_TO_3_5M',
    total_fee_lkr: 2400000,
    ol_requirement_badge: 'O/L: 6 Passes incl. Credit (C) in Science & English',
    has_merit_scholarship: true,
    has_internship: true,
    foreign_partner: null,
    specializations: ['Biomedical Science', 'Nutrition & Health', 'Pharmaceutical Science'],
    province: 'Western',
    campus_hub: 'Homagama / Pitipana',
  },
  {
    id: 'foreign-iit-se',
    institute_name: 'Informatics Institute of Technology (IIT)',
    institute_abbr: 'IIT',
    degree_title: 'BEng (Hons) Software Engineering (University of Westminster UK)',
    stream_eligible: ['Physical Science', 'Technology', 'Biological Science', 'Commerce', 'Arts'],
    duration_years: 4,
    ifsls_loan_eligible: false,
    ugc_recognized: true,
    mohe_dai: false,
    tvec_nvq_level: null,
    tuition_note_lkr: 'Direct UK Honours Degree + Famous 1-Year Paid Corporate Placement (earn LKR 45k–80k/mo)',
    location: 'Ramakrishna Road, Colombo 06',
    website: 'https://www.iit.ac.lk',
    program_url: 'https://www.iit.ac.lk/course/beng-software-engineering/',
    apply_url: 'https://www.iit.ac.lk/admission/',
    loan_portal_url: 'https://studentloans.mohe.gov.lk/loan_application/',
    sector: 'DIRECT_PRIVATE_FOREIGN',
    entry_stage: ['3_AL_PASSES', 'PENDING_AL', 'AFTER_OL_FOUNDATION'],
    study_mode: ['FULL_TIME_WEEKDAY'],
    tuition_band: '1_5M_TO_3_5M',
    total_fee_lkr: 3400000,
    ol_requirement_badge: 'O/L: 6 Passes incl. Credit (C) in Maths & English',
    has_merit_scholarship: true,
    has_internship: true,
    foreign_partner: 'University of Westminster (UK)',
    specializations: ['Software Engineering', 'Enterprise Systems', 'Full-Stack Architecture'],
    province: 'Western',
    campus_hub: 'Colombo City',
  },
  {
    id: 'foreign-iit-cs',
    institute_name: 'Informatics Institute of Technology (IIT)',
    institute_abbr: 'IIT',
    degree_title: 'BSc (Hons) Computer Science & AI (Westminster / RGU UK)',
    stream_eligible: ['Physical Science', 'Technology', 'Biological Science', 'Commerce', 'Arts'],
    duration_years: 4,
    ifsls_loan_eligible: false,
    ugc_recognized: true,
    mohe_dai: false,
    tvec_nvq_level: null,
    tuition_note_lkr: 'Awarded directly by Robert Gordon University (UK) & Westminster (UK) with year-long internship',
    location: 'Wellawatte, Colombo 06',
    website: 'https://www.iit.ac.lk',
    program_url: 'https://www.iit.ac.lk/course/bsc-computer-science/',
    apply_url: 'https://www.iit.ac.lk/admission/',
    loan_portal_url: 'https://studentloans.mohe.gov.lk/loan_application/',
    sector: 'DIRECT_PRIVATE_FOREIGN',
    entry_stage: ['3_AL_PASSES', 'PENDING_AL', 'AFTER_OL_FOUNDATION'],
    study_mode: ['FULL_TIME_WEEKDAY'],
    tuition_band: '1_5M_TO_3_5M',
    total_fee_lkr: 3200000,
    ol_requirement_badge: 'O/L: 6 Passes incl. Credit (C) in Maths & English',
    has_merit_scholarship: true,
    has_internship: true,
    foreign_partner: 'Robert Gordon University (UK)',
    specializations: ['Artificial Intelligence', 'Data Science', 'Machine Learning', 'Cyber Security'],
    province: 'Western',
    campus_hub: 'Colombo City',
  },
  {
    id: 'foreign-iit-foundation',
    institute_name: 'Informatics Institute of Technology (IIT)',
    institute_abbr: 'IIT',
    degree_title: 'International Foundation Certificate (Post-O/L & Pending A/L Track)',
    stream_eligible: ['Physical Science', 'Biological Science', 'Commerce', 'Technology', 'Arts', 'Other'],
    duration_years: 1,
    ifsls_loan_eligible: false,
    ugc_recognized: true,
    mohe_dai: false,
    tvec_nvq_level: null,
    tuition_note_lkr: 'Direct 1-year bridge from G.C.E. O/L into Westminster / RGU UK 3-year degrees (save 2 years)',
    location: 'Colombo 06',
    website: 'https://www.iit.ac.lk',
    program_url: 'https://www.iit.ac.lk/foundation/',
    apply_url: 'https://www.iit.ac.lk/admission/',
    loan_portal_url: 'https://studentloans.mohe.gov.lk/loan_application/',
    sector: 'DIRECT_PRIVATE_FOREIGN',
    entry_stage: ['AFTER_OL_FOUNDATION', 'PENDING_AL'],
    study_mode: ['FULL_TIME_WEEKDAY'],
    tuition_band: 'UNDER_500K',
    total_fee_lkr: 480000,
    ol_requirement_badge: 'O/L: 5 Passes incl. Ordinary (S) in English & Maths',
    has_merit_scholarship: false,
    has_internship: false,
    foreign_partner: 'University of Westminster (UK)',
    specializations: ['Computing Foundation', 'Business Foundation', 'Academic English & Maths'],
    province: 'Western',
    campus_hub: 'Colombo City',
  },
  {
    id: 'ifsls-cinec-eng',
    institute_name: 'CINEC Campus',
    institute_abbr: 'CINEC',
    degree_title: 'BSc (Hons) in Engineering (Civil / Automotive / Mechatronics) & Maritime Sciences',
    stream_eligible: ['Physical Science', 'Technology'],
    duration_years: 4,
    ifsls_loan_eligible: true,
    ugc_recognized: true,
    mohe_dai: true,
    tvec_nvq_level: 'NVQ Level 7',
    tuition_note_lkr: '100% Interest-Free Government Loan via studentloans.mohe.gov.lk (IESL accredited)',
    location: 'Millennium Drive, Malabe',
    website: 'https://www.cinec.edu',
    program_url: 'https://www.cinec.edu/course-list/undergraduate.html',
    apply_url: 'https://www.cinec.edu/course-list/a-z-courses.html',
    loan_portal_url: 'https://studentloans.mohe.gov.lk/loan_application/',
    sector: 'MOHE_IFSLS_PRIVATE',
    entry_stage: ['3_AL_PASSES', 'PENDING_AL'],
    study_mode: ['FULL_TIME_WEEKDAY'],
    tuition_band: 'IFSLS_ZERO_UPFRONT',
    total_fee_lkr: 2600000,
    ol_requirement_badge: 'O/L: 6 Passes incl. Credit (C) in Science & Maths',
    has_merit_scholarship: true,
    has_internship: true,
    foreign_partner: 'Wolverhampton University (UK)',
    specializations: ['Civil Engineering', 'Mechatronics', 'Automotive Engineering', 'Marine Engineering'],
    province: 'Western',
    campus_hub: 'Malabe Tech Corridor',
  },
  {
    id: 'ifsls-cinec-logistics',
    institute_name: 'CINEC Campus',
    institute_abbr: 'CINEC',
    degree_title: 'BSc (Hons) in International Transportation, Logistics & Supply Chain',
    stream_eligible: ['Commerce', 'Physical Science', 'Biological Science', 'Technology', 'Arts'],
    duration_years: 4,
    ifsls_loan_eligible: true,
    ugc_recognized: true,
    mohe_dai: true,
    tvec_nvq_level: null,
    tuition_note_lkr: 'Chartered Institute of Logistics & Transport (CILT) accredited + MOHE IFSLS eligible',
    location: 'Malabe, Colombo',
    website: 'https://www.cinec.edu',
    program_url: 'https://www.cinec.edu/academic/faculty-of-management-and-social-sciences.html',
    apply_url: 'https://www.cinec.edu/course-list/undergraduate.html',
    loan_portal_url: 'https://studentloans.mohe.gov.lk/loan_application/',
    sector: 'MOHE_IFSLS_PRIVATE',
    entry_stage: ['3_AL_PASSES', 'PENDING_AL'],
    study_mode: ['FULL_TIME_WEEKDAY'],
    tuition_band: 'IFSLS_ZERO_UPFRONT',
    total_fee_lkr: 1850000,
    ol_requirement_badge: 'O/L: 6 Passes incl. Credit (C) in English & Maths',
    has_merit_scholarship: true,
    has_internship: true,
    foreign_partner: null,
    specializations: ['Logistics & Supply Chain', 'Aviation & Port Management', 'Customs Clearance'],
    province: 'Western',
    campus_hub: 'Malabe Tech Corridor',
  },
  {
    id: 'state-ousl-degrees',
    institute_name: 'Open University of Sri Lanka (OUSL)',
    institute_abbr: 'OUSL',
    degree_title: 'BSc (Hons) in IT / BSE Software Engineering / LLB (Hons) Law',
    stream_eligible: ['Physical Science', 'Biological Science', 'Commerce', 'Technology', 'Arts', 'Other'],
    duration_years: 4,
    ifsls_loan_eligible: false,
    ugc_recognized: true,
    mohe_dai: true,
    tvec_nvq_level: null,
    tuition_note_lkr: 'Highly affordable modular state tuition (Approx LKR 50k–65k/semester across 28 regional centers)',
    location: 'Nawala, Nugegoda & 28 Island-Wide Regional Centers',
    website: 'https://ou.ac.lk',
    program_url: 'https://ou.ac.lk/find-a-programme/',
    apply_url: 'https://apply.lmsousl.lk/',
    loan_portal_url: 'https://studentloans.mohe.gov.lk/loan_application/',
    sector: 'STATE_NON_UGC',
    entry_stage: ['3_AL_PASSES', 'PENDING_AL', 'NVQ_HND_TOPUP'],
    study_mode: ['DISTANCE_ONLINE', 'WEEKEND_PART_TIME'],
    tuition_band: 'UNDER_500K',
    total_fee_lkr: 440000,
    ol_requirement_badge: 'O/L: 6 Passes with 3 A/L Passes or Foundation',
    has_merit_scholarship: false,
    has_internship: true,
    foreign_partner: null,
    specializations: ['Information Technology', 'Software Engineering', 'Law (LLB)', 'Nursing'],
    province: 'Western',
    campus_hub: 'Nawala / Island-Wide',
  },
  {
    id: 'state-uovt-btech',
    institute_name: 'University of Vocational Technology (UoVT)',
    institute_abbr: 'UoVT',
    degree_title: 'BTech (Hons) in Software, Building Services & Food Tech (NVQ Level 7)',
    stream_eligible: ['Technology', 'Physical Science', 'Biological Science'],
    duration_years: 4,
    ifsls_loan_eligible: false,
    ugc_recognized: true,
    mohe_dai: true,
    tvec_nvq_level: 'NVQ Level 7',
    tuition_note_lkr: '100% Free Weekday State Higher Education for A/L & NVQ Level 5 Diplomates',
    location: 'Ratmalana',
    website: 'https://uovt.ac.lk',
    program_url: 'https://uovt.ac.lk/',
    apply_url: 'https://uovt.ac.lk/',
    loan_portal_url: 'https://studentloans.mohe.gov.lk/loan_application/',
    sector: 'STATE_NON_UGC',
    entry_stage: ['3_AL_PASSES', 'NVQ_HND_TOPUP'],
    study_mode: ['FULL_TIME_WEEKDAY', 'WEEKEND_PART_TIME'],
    tuition_band: 'FREE_STATE',
    total_fee_lkr: 0,
    ol_requirement_badge: 'O/L: 6 Passes with 3 A/L Passes or NVQ Level 5',
    has_merit_scholarship: false,
    has_internship: true,
    foreign_partner: null,
    specializations: ['Software Technology', 'Building Services Engineering', 'Food Process Technology'],
    province: 'Western',
    campus_hub: 'Moratuwa / Ratmalana',
  },
  {
    id: 'state-sliate-hndit',
    institute_name: 'Sri Lanka Institute of Advanced Technological Education (SLIATE)',
    institute_abbr: 'SLIATE',
    degree_title: 'Higher National Diplomas (HNDIT / HNDE / HNDA — Free State NVQ Level 6)',
    stream_eligible: ['Physical Science', 'Biological Science', 'Commerce', 'Technology', 'Arts'],
    duration_years: 3,
    ifsls_loan_eligible: false,
    ugc_recognized: false,
    mohe_dai: true,
    tvec_nvq_level: 'NVQ Level 6',
    tuition_note_lkr: '100% Free State Higher National Diploma with Mahapola/Bursary allowance across 19 ATIs',
    location: 'Dehiwala, Colombo, Kandy, Galle, Jaffna, Kurunegala (19 ATIs)',
    website: 'http://www.sliate.ac.lk',
    program_url: 'http://www.sliate.ac.lk/',
    apply_url: 'http://www.sliate.ac.lk/',
    loan_portal_url: 'https://studentloans.mohe.gov.lk/loan_application/',
    sector: 'STATE_NON_UGC',
    entry_stage: ['3_AL_PASSES'],
    study_mode: ['FULL_TIME_WEEKDAY'],
    tuition_band: 'FREE_STATE',
    total_fee_lkr: 0,
    ol_requirement_badge: 'O/L: 6 Passes with Ordinary (S) in English & Maths',
    has_merit_scholarship: false,
    has_internship: true,
    foreign_partner: null,
    specializations: ['Information Technology (HNDIT)', 'Engineering (HNDE)', 'Accountancy (HNDA)'],
    province: 'Western',
    campus_hub: 'Island-Wide Regional Centers',
  },
];

export interface CareerAtlasItem {
  id: string;
  role_title: string;
  category: string;
  klimov_type: 'Human-Tech' | 'Human-Sign/Data' | 'Human-Nature' | 'Human-Human' | 'Human-Art';
  riasec_code: string;
  entry_salary_lkr: string;
  mid_salary_lkr: string;
  demand_trend: 'High Growth' | 'Stable Core' | 'Global Remote & Local';
  state_uni_codes: string[];
  backup_pathways: string[];
  summary: string;
}

export const CAREER_ATLAS: CareerAtlasItem[] = [
  {
    id: 'software-engineer',
    role_title: 'Software Engineer / Cloud Architect',
    category: 'IT & Computing',
    klimov_type: 'Human-Sign/Data',
    riasec_code: 'IRC',
    entry_salary_lkr: 'LKR 140,000 – 260,000 / mo',
    mid_salary_lkr: 'LKR 450,000 – 950,000 / mo',
    demand_trend: 'Global Remote & Local',
    state_uni_codes: ['012T', '008G', '026G', '012C', '038T'],
    backup_pathways: ['SLIIT BSc (Hons) SE (IFSLS)', 'NSBM BSc CS (IFSLS)', 'SLIATE HNDIT (NVQ 6)'],
    summary: 'Designs and builds distributed applications, fintech platforms, and cloud systems for Colombo tech exporters and global engineering teams.',
  },
  {
    id: 'ai-data-scientist',
    role_title: 'AI & Machine Learning Engineer',
    category: 'IT & Computing',
    klimov_type: 'Human-Sign/Data',
    riasec_code: 'IRA',
    entry_salary_lkr: 'LKR 165,000 – 310,000 / mo',
    mid_salary_lkr: 'LKR 520,000 – 1,100,000 / mo',
    demand_trend: 'High Growth',
    state_uni_codes: ['096G', '012T', '008G', '136L', '013A'],
    backup_pathways: ['NSBM BSc Data Science (IFSLS)', 'SLIIT BSc AI & Data Science'],
    summary: 'Builds predictive models, LLM agents, and computer vision pipelines across healthcare, banking, and export software.',
  },
  {
    id: 'medical-officer',
    role_title: 'Medical Officer / Consultant Specialist',
    category: 'Medicine & Allied Health',
    klimov_type: 'Human-Human',
    riasec_code: 'ISR',
    entry_salary_lkr: 'LKR 165,000 – 240,000 / mo',
    mid_salary_lkr: 'LKR 380,000 – 850,000+ / mo',
    demand_trend: 'Stable Core',
    state_uni_codes: ['001A', '001B', '001C', '001D', '001E', '001F', '001G'],
    backup_pathways: ['KDU MBBS (Fee-levying)', 'Horizon BSc Biotechnology (IFSLS)'],
    summary: 'SLMC-registered clinical physician serving in Ministry of Health teaching hospitals and private specialist practice.',
  },
  {
    id: 'chartered-engineer',
    role_title: 'Chartered Engineer (Civil / Electrical / Mechanical)',
    category: 'Engineering & Tech',
    klimov_type: 'Human-Tech',
    riasec_code: 'RIC',
    entry_salary_lkr: 'LKR 115,000 – 195,000 / mo',
    mid_salary_lkr: 'LKR 320,000 – 650,000 / mo',
    demand_trend: 'High Growth',
    state_uni_codes: ['008G', '008B', '008F', '008C', '102A'],
    backup_pathways: ['CINEC BSc Engineering (IFSLS)', 'UoVT BTech (NVQ 7)', 'SLIATE HNDE'],
    summary: 'Plans and executes national renewable energy grids, infrastructure, industrial automation, and manufacturing systems.',
  },
  {
    id: 'quantity-surveyor',
    role_title: 'Chartered Quantity Surveyor',
    category: 'Architecture & Design',
    klimov_type: 'Human-Sign/Data',
    riasec_code: 'CEI',
    entry_salary_lkr: 'LKR 110,000 – 185,000 / mo',
    mid_salary_lkr: 'LKR 350,000 – 900,000 / mo (MENA/SL)',
    demand_trend: 'Global Remote & Local',
    state_uni_codes: ['010G', '023G'],
    backup_pathways: ['SLIIT BSc Quantity Surveying', 'CINEC Construction Management'],
    summary: 'Manages construction contracts, cost estimation, and arbitration in Sri Lanka and Middle East/UK infrastructure projects.',
  },
  {
    id: 'chartered-accountant-fin',
    role_title: 'Financial Analyst / Chartered Accountant',
    category: 'Business & Finance',
    klimov_type: 'Human-Sign/Data',
    riasec_code: 'CEI',
    entry_salary_lkr: 'LKR 95,000 – 160,000 / mo',
    mid_salary_lkr: 'LKR 290,000 – 620,000 / mo',
    demand_trend: 'Stable Core',
    state_uni_codes: ['016C', '016A', '016D', '016B'],
    backup_pathways: ['CA Sri Lanka / CIMA / ACCA', 'NSBM BBM Finance (IFSLS)'],
    summary: 'Leads corporate finance, investment banking, auditing, and treasury operations across CSE-listed conglomerates.',
  },
  {
    id: 'agritech-food-scientist',
    role_title: 'Food Technologist & Biosystems Specialist',
    category: 'Agriculture & Food Science',
    klimov_type: 'Human-Nature',
    riasec_code: 'IRS',
    entry_salary_lkr: 'LKR 90,000 – 145,000 / mo',
    mid_salary_lkr: 'LKR 240,000 – 480,000 / mo',
    demand_trend: 'High Growth',
    state_uni_codes: ['004B', '004F', '103A', '103C'],
    backup_pathways: ['Horizon BSc Biotechnology (IFSLS)', 'UoVT BTech Food Process Technology'],
    summary: 'Drives value-added food export quality, tea/spice biotechnology, and precision agriculture.',
  },
  {
    id: 'legal-counsel',
    role_title: 'Attorney-at-Law & Corporate Legal Counsel',
    category: 'Law & Governance',
    klimov_type: 'Human-Human',
    riasec_code: 'ESC',
    entry_salary_lkr: 'LKR 95,000 – 170,000 / mo',
    mid_salary_lkr: 'LKR 310,000 – 750,000 / mo',
    demand_trend: 'Stable Core',
    state_uni_codes: ['020A', '020B', '020E', '019A'],
    backup_pathways: ['Sri Lanka Law College Direct Entrance Exam', 'OUSL LLB (Hons)'],
    summary: 'Represents clients in commercial litigation, intellectual property, constitutional law, and corporate governance.',
  },
];

export interface CampusReviewItem {
  id: string;
  institution_code: string;
  uni_code: string;
  student_name: string;
  student_email: string;
  academic_rating: number;
  hostel_cost_lkr: number;
  mahapola_rating: number;
  campus_life_rating: number;
  employability_rating: number;
  comment: string;
  verified_ac_lk: boolean;
  created_at: string;
}

export const INITIAL_CAMPUS_REVIEWS: CampusReviewItem[] = [
  {
    id: 'rev-1',
    institution_code: 'UOM',
    uni_code: '008G',
    student_name: 'Kavindu Perera',
    student_email: 'kavindu.21@cse.mrt.ac.lk',
    academic_rating: 5,
    hostel_cost_lkr: 1800,
    mahapola_rating: 5,
    campus_life_rating: 5,
    employability_rating: 5,
    comment: 'CSE and ENTC industry placements are unmatched in Sri Lanka. Internal hostels cost under LKR 2,000/yr while outside boarding in Katubedda averages LKR 12,000–16,000/month.',
    verified_ac_lk: true,
    created_at: '2026-09-14',
  },
  {
    id: 'rev-2',
    institution_code: 'UCSC',
    uni_code: '012T',
    student_name: 'Tharushi Wijesinghe',
    student_email: '2022cs142@stu.ucsc.cmb.ac.lk',
    academic_rating: 5,
    hostel_cost_lkr: 1700,
    mahapola_rating: 4,
    campus_life_rating: 5,
    employability_rating: 5,
    comment: 'Located right at Reid Avenue in Colombo 07. Strong hackathon culture and 3rd-year industrial training places almost 100% of the batch before graduation.',
    verified_ac_lk: true,
    created_at: '2026-10-02',
  },
  {
    id: 'rev-3',
    institution_code: 'UOP',
    uni_code: '013B',
    student_name: 'Nadeesha Ekanayake',
    student_email: 's19412@sci.pdn.ac.lk',
    academic_rating: 5,
    hostel_cost_lkr: 1200,
    mahapola_rating: 5,
    campus_life_rating: 5,
    employability_rating: 4,
    comment: 'Almost 85% of outstation students receive residential hall facilities inside Peradeniya campus at nominal cost. Ideal environment for Statistics and CS honors.',
    verified_ac_lk: true,
    created_at: '2026-10-19',
  },
  {
    id: 'rev-4',
    institution_code: 'USJP',
    uni_code: '016C',
    student_name: 'Shenal Fernando',
    student_email: 'mgt21890@sjp.ac.lk',
    academic_rating: 5,
    hostel_cost_lkr: 1600,
    mahapola_rating: 4,
    campus_life_rating: 4,
    employability_rating: 5,
    comment: 'FMSC Jayewardenepura has direct exemptions for CA Sri Lanka, CIMA, and ACCA. Balancing degree lectures with professional exams in Year 3 is very well supported.',
    verified_ac_lk: true,
    created_at: '2026-10-25',
  },
];

export interface QnAThreadItem {
  id: string;
  institution_code: string;
  uni_code: string;
  asked_by: string;
  question: string;
  answer: string;
  answered_by_role: string;
  verified_ambassador: boolean;
  created_at: string;
}

export const INITIAL_QNA_THREADS: QnAThreadItem[] = [
  {
    id: 'qna-1',
    institution_code: 'UOM',
    uni_code: '008G',
    asked_by: 'A/L 2025 Physical Science Student (Gampaha)',
    question: 'How is the Engineering specialization (CSE vs ENTC vs Civil) decided at Moratuwa?',
    answer: 'All 008G students complete a common Semester 1 foundation. Field selection at the end of Semester 1 is 100% merit-based on your Semester 1 GPA, not your A/L Z-score!',
    answered_by_role: 'Final Year CSE Undergrad · UOM Campus Rep',
    verified_ambassador: true,
    created_at: '2026-10-12',
  },
  {
    id: 'qna-2',
    institution_code: 'UCSC',
    uni_code: '012T',
    asked_by: 'A/L Physical Science Applicant (Kandy)',
    question: 'Does UCSC 012T award a 3-year general degree or a 4-year Honors degree?',
    answer: 'Everyone enters the 3-year BSc in Computer Science track first. Based on your Year 1 & Year 2 GPA (typically top 40–50%), you are selected for the 4th-year BSc (Hons) in Computer Science or Software Engineering.',
    answered_by_role: '4th Year CS (Hons) Undergrad · UCSC Ambassador',
    verified_ambassador: true,
    created_at: '2026-10-20',
  },
  {
    id: 'qna-3',
    institution_code: 'UOC',
    uni_code: '013A',
    asked_by: 'A/L Student (Matara)',
    question: 'Why did the simulator warn me when I put 013B (Peradeniya) above 013A (Colombo)?',
    answer: 'Because the UGC computer algorithm checks your #1 choice first! If your Z-score clears 013B (#1), it assigns you to 013B immediately and never checks #2 (013A), even if your Z-score was high enough for Colombo.',
    answered_by_role: 'Senior Science Mentor · UOC Faculty of Science',
    verified_ambassador: true,
    created_at: '2026-10-28',
  },
];

export interface AdmissionsCalendarEvent {
  id: string;
  title: string;
  organization: string;
  window_date: string;
  status: 'OPEN_NOW' | 'UPCOMING' | 'COMPLETED';
  category: 'Exam & Results' | 'UGC Application' | 'Aptitude Test' | 'Cutoffs & Appeals' | 'IFSLS Loan';
  description: string;
  official_url: string;
}

export const ADMISSIONS_CALENDAR_EVENTS: AdmissionsCalendarEvent[] = [
  {
    id: 'cal-1',
    title: 'G.C.E. A/L Examination Results & Official Z-Score Release',
    organization: 'Department of Examinations (doenets.lk)',
    window_date: 'May – June 2026',
    status: 'COMPLETED',
    category: 'Exam & Results',
    description: 'Official release of G.C.E. Advanced Level grades, district rank, island rank, and standardized Z-score.',
    official_url: 'https://www.doenets.lk',
  },
  {
    id: 'cal-2',
    title: 'UGC University Admissions Handbook & Online Application Window',
    organization: 'University Grants Commission (ugc.ac.lk)',
    window_date: 'June 15 – July 18, 2026',
    status: 'OPEN_NOW',
    category: 'UGC Application',
    description: 'Mandatory 3-week window to submit your ordered uni_code preference list online via ugc.ac.lk.',
    official_url: 'https://www.ugc.ac.lk',
  },
  {
    id: 'cal-3',
    title: 'UOM Architecture (023G), Design & Fashion Aptitude Tests',
    organization: 'University of Moratuwa',
    window_date: 'July 25 – August 10, 2026',
    status: 'UPCOMING',
    category: 'Aptitude Test',
    description: 'Mandatory on-campus aptitude exams required in addition to Z-score qualification.',
    official_url: 'https://uom.lk/admissions',
  },
  {
    id: 'cal-4',
    title: 'Official 1st Round 25-District UGC Cutoff Marks Release',
    organization: 'University Grants Commission (ugc.ac.lk)',
    window_date: 'September 2026',
    status: 'UPCOMING',
    category: 'Cutoffs & Appeals',
    description: 'Release of 25-district minimum Z-score cutoffs across all 129 degree programs.',
    official_url: 'https://www.ugc.ac.lk/cutoffs',
  },
  {
    id: 'cal-5',
    title: 'MOHE Interest-Free Student Loan Scheme (IFSLS) Intake 9',
    organization: 'Ministry of Higher Education (studentloans.mohe.gov.lk)',
    window_date: 'October – November 2026',
    status: 'UPCOMING',
    category: 'IFSLS Loan',
    description: 'Government 100% interest-free loan scheme for students who missed state university cutoffs (up to LKR 1.1M + LKR 300K stipend).',
    official_url: 'https://studentloans.mohe.gov.lk',
  },
  {
    id: 'cal-6',
    title: 'UGC 2nd Round Vacancy Promotion & Registration Deadlines',
    organization: 'University Grants Commission & All State Universities',
    window_date: 'November – December 2026',
    status: 'UPCOMING',
    category: 'Cutoffs & Appeals',
    description: 'Automatic upgrading to higher preference courses based on dropouts and vacancy allocations.',
    official_url: 'https://www.ugc.ac.lk',
  },
];
