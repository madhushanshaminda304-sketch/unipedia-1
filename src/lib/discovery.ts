import {
  evaluateCourseAcademicEligibility,
  type ALGrade,
  type StudentOlGrades,
} from "./ugcLogic";
import type { ProgramCutoffViewRow } from "../data/ugc/types";

export interface AcademicProfile {
  subjects: { subject: string; grade: ALGrade | "" }[];
  commonGeneralScore: number | null;
  ol: StudentOlGrades;
}
export const emptyAcademicProfile = (): AcademicProfile => ({
  subjects: Array.from({ length: 3 }, () => ({ subject: "", grade: "" })),
  commonGeneralScore: null,
  ol: {},
});
export function normalizeAcademicProfile(value: unknown): AcademicProfile {
  const profile = emptyAcademicProfile();
  if (!value || typeof value !== "object") return profile;
  const raw = value as Partial<AcademicProfile>;
  if (Array.isArray(raw.subjects))
    profile.subjects = profile.subjects.map((_, i) => ({
      subject:
        typeof raw.subjects?.[i]?.subject === "string"
          ? raw.subjects[i].subject
          : "",
      grade: ["A", "B", "C", "S", "F"].includes(raw.subjects?.[i]?.grade || "")
        ? raw.subjects![i].grade
        : "",
    }));
  if (
    typeof raw.commonGeneralScore === "number" &&
    Number.isFinite(raw.commonGeneralScore) &&
    raw.commonGeneralScore >= 0 &&
    raw.commonGeneralScore <= 100
  )
    profile.commonGeneralScore = raw.commonGeneralScore;
  for (const key of [
    "english",
    "mathematics",
    "science",
    "sinhala",
    "tamil",
  ] as (keyof StudentOlGrades)[]) {
    const grade = raw.ol?.[key];
    if (grade && ["A", "B", "C", "S", "W", "NONE"].includes(grade))
      profile.ol[key] = grade;
  }
  return profile;
}
export function academicCheck(courseCode: string, profile?: AcademicProfile) {
  return evaluateCourseAcademicEligibility({
    courseCode,
    studentSubjects: profile?.subjects.filter(
      (s): s is { subject: string; grade: ALGrade } => !!s.subject && !!s.grade,
    ),
    commonGeneralScore: profile?.commonGeneralScore,
    studentOlGrades: profile?.ol,
  });
}
export function plainHandbook(text = "") {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*/g, "")
    .replace(/^---\s*$/gm, "")
    .trim();
}
export function requirementPreview(text = "") {
  const clean = plainHandbook(text);
  return clean
    .split(
      /\n(?:(?:\* )?(?:Degree Programme|Available Universit|Duration|Medium|The course of study|Fields of specialization)|Names of the universities)/i,
    )[0]
    .trim();
}
export function cutoffLabel(
  row: Pick<
    ProgramCutoffViewRow,
    "needs_category_clarification" | "min_z_score" | "status"
  >,
) {
  if (row.needs_category_clarification) return "Select stream to view category";
  if (row.min_z_score !== null) return row.min_z_score.toFixed(4);
  return row.status === "NQC" ? "NQC" : "No published history";
}
export const STREAMS = [
  "Physical Science",
  "Biological Science",
  "Commerce",
  "Technology",
  "Arts",
];
export const SUBJECTS = [
  "Biology",
  "Chemistry",
  "Physics",
  "Combined Mathematics",
  "Higher Mathematics",
  "Mathematics",
  "Information & Communication Technology",
  "Engineering Technology",
  "Biosystems Technology",
  "Science for Technology",
  "Agricultural Science",
  "Accounting",
  "Business Studies",
  "Business Statistics",
  "Economics",
  "Sinhala",
  "Tamil",
  "English",
  "Geography",
  "History",
  "Political Science",
  "Logic & Scientific Method",
  "Buddhist Civilization",
  "Hindu Civilization",
  "Islamic Civilization",
  "Christian Civilization",
  "Communication & Media Studies",
  "Art",
  "Music",
  "Dancing",
  "French",
  "German",
  "Japanese",
  "Chinese",
  "Korean",
  "Arabic",
  "Pali",
  "Sanskrit",
  "Home Economics",
];
