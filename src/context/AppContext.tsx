import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { toast } from "sonner";
import {
  SRI_LANKA_DISTRICTS,
  type DistrictInfo,
} from "../data/sriLankaUgcSnapshot";
import type {
  ProgramCutoffViewRow,
  SavedPreferenceEntry,
} from "../data/ugc/types";
import {
  getProgramCutoffRowsForDistrict,
  migrateSavedPlan,
  acceptSavedPlanSuggestion,
  getOfferingByUniCode,
  type CutoffYear,
} from "../services/ugcAdapter";
import i18n, {
  I18N_DICT,
  normalizeLangCode,
  type LanguageCode,
} from "../lib/i18n";
import {
  emptyAcademicProfile,
  normalizeAcademicProfile,
  STREAMS,
  type AcademicProfile,
} from "../lib/discovery";
import { readLocation, routePath, type ActiveRoute } from "../lib/routes";
import { rememberUgcReturn } from "../lib/navigationMemory";
import { validCatalogueIds, nextComparison } from "../lib/portal";
export type { LanguageCode, ActiveRoute, SavedPreferenceEntry };

function stored<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) ?? fallback) : fallback;
  } catch {
    return fallback;
  }
}
function persist(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* The current session remains usable when storage is unavailable. */
  }
}
const initialLocation = () =>
  typeof window === "undefined"
    ? { route: "home" as ActiveRoute }
    : readLocation(window.location);

export interface AppContextValue {
  district: DistrictInfo;
  setDistrictId: (id: number) => void;
  isDistrictModalOpen: boolean;
  setIsDistrictModalOpen: (value: boolean) => void;
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: Record<string, string>;
  route: ActiveRoute;
  setRoute: (route: ActiveRoute) => void;
  selectedInstitutionCode: string;
  setSelectedInstitutionCode: (code: string) => void;
  selectedUniCode: string;
  setSelectedUniCode: (code: string) => void;
  districtPrograms: ProgramCutoffViewRow[];
  cutoffYear: CutoffYear;
  setCutoffYear: (year: CutoffYear) => void;
  studentZScore: number | null;
  setStudentZScore: (z: number | null) => void;
  studentStream: string;
  setStudentStream: (stream: string) => void;
  academicProfile: AcademicProfile;
  setAcademicProfile: React.Dispatch<React.SetStateAction<AcademicProfile>>;
  planEntries: SavedPreferenceEntry[];
  replaceSavedPlan: (entries: SavedPreferenceEntry[]) => void;
  addToPlan: (code: string) => void;
  removeFromPlan: (code: string) => void;
  movePlanItem: (index: number, direction: "up" | "down") => void;
  toggleLockPlanItem: (code: string) => void;
  isPlanDrawerOpen: boolean;
  setIsPlanDrawerOpen: (open: boolean) => void;
  compareList: string[];
  catalogueCompareList: string[];
  toggleCatalogueCompare: (id: string) => void;
  toggleCompare: (code: string) => void;
  setComparePreset: (codes: string[]) => void;
  openInstitutionProfile: (code: string) => void;
  openCourseProfile: (code: string) => void;
  isWelcomeOpen: boolean;
  setIsWelcomeOpen: (open: boolean) => void;
  resetStudentProfile: () => void;
  planMigrationInfo: {
    hasModifications: boolean;
    flaggedCount: number;
    hasBackup: boolean;
  };
  acceptPlanMigration: (code: string) => void;
  dismissPlanMigrationFlag: (code: string) => void;
  restorePreMigrationPlan: () => void;
}
const AppContext = createContext<AppContextValue | undefined>(undefined);
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [route, setRouteState] = useState<ActiveRoute>(
    () => initialLocation().route,
  );
  const [selectedInstitutionCode, setSelectedInstitutionCode] = useState(
    () => initialLocation().code || "MRT",
  );
  const [selectedUniCode, setSelectedUniCode] = useState(
    () => initialLocation().code || "008G",
  );
  const [districtId, setDistrictIdState] = useState(() =>
    stored("unipedia_district_id", 1),
  );
  const [lang, setLangState] = useState<LanguageCode>(
    () => normalizeLangCode(i18n.language).toUpperCase() as LanguageCode,
  );
  const profile = useMemo(
    () =>
      stored<{ z: number | null; stream: string; academic: AcademicProfile }>(
        "unipedia_student_v2",
        { z: null, stream: "ALL", academic: emptyAcademicProfile() },
      ),
    [],
  );
  const [studentZScore, setStudentZScoreState] = useState<number | null>(() =>
    typeof profile.z === "number" && Number.isFinite(profile.z)
      ? profile.z
      : null,
  );
  const [studentStream, setStudentStream] = useState(
    STREAMS.includes(profile.stream) ? profile.stream : "ALL",
  );
  const [academicProfile, setAcademicProfile] = useState<AcademicProfile>(() =>
    normalizeAcademicProfile(profile.academic),
  );
  const [planEntries, setPlanEntries] = useState<SavedPreferenceEntry[]>(() => {
    const existing = stored<SavedPreferenceEntry[]>(
      "unipedia_plan_entries",
      stored("lankavuz_plan_entries", []),
    );
    const migrated = migrateSavedPlan(
      Array.isArray(existing)
        ? existing.filter((e) => e && typeof e.uni_code === "string")
        : [],
    );
    if (
      migrated.hasModifications &&
      !stored("unipedia_pre_migration_backup", null)
    )
      persist("unipedia_pre_migration_backup", existing);
    return migrated.migratedEntries;
  });
  const [compareList, setCompareList] = useState<string[]>(() => {
    const saved = stored<string[]>("unipedia_compare_v2", []);
    return Array.isArray(saved)
      ? [...new Set(saved)]
          .filter((code) => !!getOfferingByUniCode(code))
          .slice(0, 4)
      : [];
  });
  const [isDistrictModalOpen, setIsDistrictModalOpen] = useState(false);
  const [catalogueCompareList, setCatalogueCompareList] = useState(() =>
    validCatalogueIds(stored("unipedia_catalogue_compare_v1", [])).slice(
      0,
      Math.max(0, 4 - compareList.length),
    ),
  );
  const [isPlanDrawerOpen, setIsPlanDrawerOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [cutoffYear, setCutoffYear] = useState<CutoffYear>(() =>
    stored<string>("unipedia_cutoff_year", "2025/2026") === "2024/2025"
      ? "2024/2025"
      : "2025/2026",
  );
  useEffect(() => persist("unipedia_cutoff_year", cutoffYear), [cutoffYear]);
  const district =
    SRI_LANKA_DISTRICTS.find((d) => d.district_id === districtId) ||
    SRI_LANKA_DISTRICTS[0];
  const districtPrograms = useMemo(
    () =>
      getProgramCutoffRowsForDistrict(
        district.district_id,
        studentStream,
        cutoffYear,
      ),
    [district.district_id, studentStream, cutoffYear],
  );
  const setDistrictId = useCallback((id: number) => {
    const d = SRI_LANKA_DISTRICTS.find((item) => item.district_id === id);
    if (d) {
      setDistrictIdState(id);
      toast.info(`Switched to ${d.district_name} District`, {
        description: "Minimum cutoff Z-scores updated.",
        id: "district-change",
        duration: 2500,
      });
    }
  }, []);
  const setStudentZScore = useCallback(
    (z: number | null) =>
      setStudentZScoreState(z !== null && Number.isFinite(z) ? z : null),
    [],
  );
  const setLang = useCallback((value: LanguageCode) => {
    const normalized = normalizeLangCode(value);
    setLangState(normalized.toUpperCase() as LanguageCode);
    i18n.changeLanguage(normalized);
  }, []);
  useEffect(() => {
    document.documentElement.lang = normalizeLangCode(lang);
  }, [lang]);
  useEffect(
    () =>
      persist("unipedia_student_v2", {
        z: studentZScore,
        stream: studentStream,
        academic: academicProfile,
      }),
    [studentZScore, studentStream, academicProfile],
  );
  useEffect(
    () => persist("unipedia_district_id", district.district_id),
    [district],
  );
  useEffect(() => persist("unipedia_plan_entries", planEntries), [planEntries]);
  useEffect(() => persist("unipedia_compare_v2", compareList), [compareList]);
  useEffect(
    () => persist("unipedia_catalogue_compare_v1", catalogueCompareList),
    [catalogueCompareList],
  );
  useEffect(() => {
    const sync = () => {
      const next = readLocation(window.location);
      setRouteState(next.route);
      if (next.route === "course") setSelectedUniCode(next.code || "");
      if (next.route === "institution")
        setSelectedInstitutionCode(next.code || "");
    };
    if (
      /^#(home|predictor|my-plan|compare|careers|career-quiz|calendar|institution|course|private-unis|about|privacy|terms)(?:[/?]|$)/.test(
        window.location.hash,
      )
    ) {
      const next = readLocation(window.location);
      window.history.replaceState(null, "", routePath(next.route, next.code));
    }
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, []);
  const navigate = (next: ActiveRoute, code?: string) => {
    setRouteState(next);
    window.history.pushState(null, "", routePath(next, code));
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const setRoute = (next: ActiveRoute) =>
    navigate(
      next,
      next === "course"
        ? selectedUniCode
        : next === "institution"
          ? selectedInstitutionCode
          : undefined,
    );
  const openCourseProfile = (code: string) => {
    if (["/courses", "/explore"].includes(window.location.pathname))
      rememberUgcReturn(window.location.pathname + window.location.search);
    setSelectedUniCode(code);
    navigate("course", code);
  };
  const openInstitutionProfile = (code: string) => {
    setSelectedInstitutionCode(code);
    navigate("institution", code);
  };
  const addToPlan = (code: string) => {
    const offering = getOfferingByUniCode(code);
    if (!offering) {
      toast.error("This course is not available in the current catalog.");
      return;
    }
    if (planEntries.some((p) => p.uni_code === code)) return;
    if (planEntries.length >= 125) {
      toast.error("Your shortlist has reached 125 choices.");
      return;
    }
    toast.success(
      `Added ${offering.course_title_unicode_table} (${code}) to shortlist`,
      {
        action: {
          label: "Undo",
          onClick: () => removeFromPlan(code),
        },
        id: `plan-${code}`,
        duration: 4000,
      },
    );
    setPlanEntries((prev) => [...prev, { uni_code: code, locked: false }]);
  };
  const removeFromPlan = (code: string) => {
    const offering = getOfferingByUniCode(code);
    if (offering) {
      toast(`Removed ${offering.course_title_unicode_table} from shortlist`, {
        action: {
          label: "Undo",
          onClick: () => addToPlan(code),
        },
        id: `plan-${code}`,
        duration: 4000,
      });
    }
    setPlanEntries((prev) => prev.filter((p) => p.uni_code !== code));
  };
  const movePlanItem = (index: number, direction: "up" | "down") =>
    setPlanEntries((prev) => {
      const to = index + (direction === "up" ? -1 : 1);
      if (to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[to]] = [next[to], next[index]];
      return next;
    });
  const toggleLockPlanItem = (code: string) =>
    setPlanEntries((prev) =>
      prev.map((p) => (p.uni_code === code ? { ...p, locked: !p.locked } : p)),
    );
  const toggleCompare = (code: string) => {
    if (!getOfferingByUniCode(code)) return;
    if (
      !compareList.includes(code) &&
      compareList.length + catalogueCompareList.length >= 4
    ) {
      toast.info(
        "You can compare four programmes. Remove one to add another.",
        { id: "comparison-limit" },
      );
      return;
    }
    setCompareList((prev) =>
      nextComparison(prev, code, catalogueCompareList.length),
    );
  };
  const toggleCatalogueCompare = (id: string) => {
    if (!validCatalogueIds([id]).length) return;
    if (
      !catalogueCompareList.includes(id) &&
      catalogueCompareList.length + compareList.length >= 4
    ) {
      toast.info(
        "You can compare four programmes. Remove one to add another.",
        { id: "comparison-limit" },
      );
      return;
    }
    setCatalogueCompareList((prev) =>
      nextComparison(prev, id, compareList.length),
    );
  };
  const setComparePreset = (codes: string[]) =>
    setCompareList(
      [...new Set(codes)]
        .filter((code) => !!getOfferingByUniCode(code))
        .slice(0, Math.max(0, 4 - catalogueCompareList.length)),
    );
  const acceptPlanMigration = (code: string) =>
    setPlanEntries((prev) => acceptSavedPlanSuggestion(prev, code));
  const dismissPlanMigrationFlag = (code: string) =>
    setPlanEntries((prev) =>
      prev.map((p) =>
        p.uni_code === code
          ? {
              ...p,
              migrationStatus: "valid",
              migrationReviewedFor: "2025/2026",
            }
          : p,
      ),
    );
  const restorePreMigrationPlan = () => {
    const backup = stored<SavedPreferenceEntry[]>(
      "unipedia_pre_migration_backup",
      planEntries,
    );
    if (Array.isArray(backup))
      setPlanEntries(
        migrateSavedPlan(
          backup.filter((e) => e && typeof e.uni_code === "string"),
        ).migratedEntries,
      );
  };
  const flaggedCount = planEntries.filter(
    (p) => p.migrationStatus && p.migrationStatus !== "valid",
  ).length;
  const resetStudentProfile = () => {
    setStudentZScore(null);
    setStudentStream("ALL");
    setAcademicProfile(emptyAcademicProfile());
  };
  return (
    <AppContext.Provider
      value={{
        district,
        setDistrictId,
        isDistrictModalOpen,
        setIsDistrictModalOpen,
        lang,
        setLang,
        t: I18N_DICT[
          normalizeLangCode(lang).toUpperCase() as "EN" | "SI" | "TA"
        ],
        route,
        setRoute,
        selectedInstitutionCode,
        setSelectedInstitutionCode,
        selectedUniCode,
        setSelectedUniCode,
        districtPrograms,
        cutoffYear,
        setCutoffYear,
        studentZScore,
        setStudentZScore,
        studentStream,
        setStudentStream,
        academicProfile,
        setAcademicProfile,
        planEntries,
        replaceSavedPlan: setPlanEntries,
        addToPlan,
        removeFromPlan,
        movePlanItem,
        toggleLockPlanItem,
        isPlanDrawerOpen,
        setIsPlanDrawerOpen,
        compareList,
        catalogueCompareList,
        toggleCatalogueCompare,
        toggleCompare,
        setComparePreset,
        openInstitutionProfile,
        openCourseProfile,
        isWelcomeOpen,
        setIsWelcomeOpen,
        planMigrationInfo: {
          hasModifications: flaggedCount > 0,
          flaggedCount,
          hasBackup: Array.isArray(
            stored("unipedia_pre_migration_backup", null),
          ),
        },
        acceptPlanMigration,
        dismissPlanMigrationFlag,
        restorePreMigrationPlan,
        resetStudentProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
}
