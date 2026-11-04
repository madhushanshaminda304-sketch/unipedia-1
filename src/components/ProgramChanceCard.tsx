import React, { useState } from 'react';
import {
  Plus,
  Check,
  Scale,
  AlertTriangle,
  Users,
  Clock,
  BookOpen,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { ProgramCutoffViewRow } from '../data/sriLankaUgcSnapshot';
import { classifyProgramMatch, evaluateOlEligibility, type StudentOlGrades } from '../lib/ugcLogic';
import { ProgramDetailDrawer } from './ProgramDetailDrawer';

const MEDIUM_LABELS: Record<string, string> = {
  E: 'English',
  S: 'Sinhala',
  T: 'Tamil',
};

export const ProgramChanceCard: React.FC<{
  program: ProgramCutoffViewRow;
  studentZ?: number | null;
  studentOlGrades?: StudentOlGrades;
  matchesAlSubjects?: boolean;
  onOpenDetail?: (program: ProgramCutoffViewRow) => void;
}> = ({ program, studentZ, studentOlGrades, matchesAlSubjects, onOpenDetail }) => {
  const {
    planEntries,
    addToPlan,
    removeFromPlan,
    compareList,
    toggleCompare,
    openInstitutionProfile,
  } = useApp();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenDetail = () => {
    if (onOpenDetail) {
      onOpenDetail(program);
    } else {
      setIsDrawerOpen(true);
    }
  };

  const match = classifyProgramMatch({
    studentZ: studentZ ?? null,
    minZScore: program.min_z_score,
    status: program.status,
    allIslandMeritOnly: program.all_island_merit_only,
    allIslandZScore: program.all_island_max_z,
  });

  const isInPlan = planEntries.some((p) => p.uni_code === program.uni_code);
  const isInCompare = compareList.includes(program.uni_code);

  const olEvaluation = React.useMemo(() => {
    if (!program.requires_ol_special || !studentOlGrades) return null;
    const hasAnyOl = Boolean(
      (studentOlGrades.english && studentOlGrades.english !== 'NONE') ||
      (studentOlGrades.mathematics && studentOlGrades.mathematics !== 'NONE') ||
      (studentOlGrades.science && studentOlGrades.science !== 'NONE') ||
      (studentOlGrades.sinhala && studentOlGrades.sinhala !== 'NONE') ||
      (studentOlGrades.tamil && studentOlGrades.tamil !== 'NONE') ||
      (studentOlGrades.sinhalaOrTamil && studentOlGrades.sinhalaOrTamil !== 'NONE')
    );
    if (!hasAnyOl) return null;
    return evaluateOlEligibility(studentOlGrades, program.ol_rule);
  }, [program.requires_ol_special, program.ol_rule, studentOlGrades]);

  // Consolidated Cutoff Pill (Anchor 2)
  const renderCutoffPill = () => {
    if (program.status === 'NQC' || match.effectiveCutoff === null) {
      return (
        <span
          title="No candidates from your district met the minimum cutoff threshold in 2024/2025."
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300/80 font-mono"
        >
          ⚪ 2024/25: NQC
        </span>
      );
    }
    if (program.all_island_merit_only) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-50 text-sky-950 border border-sky-300/80 font-mono shadow-xs">
          🌐 All-Island: {match.effectiveCutoff.toFixed(4)}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-950 border border-amber-300/90 font-mono shadow-xs">
        📊 {program.district_name}: {match.effectiveCutoff.toFixed(4)}
      </span>
    );
  };

  return (
    <>
      <article className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card hover:shadow-elevated hover:border-slate-300 transition-all flex flex-col justify-between gap-4">
        <div>
          {/* Top Anchor Row: Authority Tag (Anchor 1) + 2024/25 Cutoff Pill (Anchor 2) */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleOpenDetail}
                className="font-mono font-black text-xs sm:text-sm px-2.5 py-1 rounded-lg bg-[var(--primitive-obsidian-900)] text-amber-300 hover:bg-slate-800 transition-colors shadow-xs"
                title="Inspect Full Program Details & Cutoffs"
              >
                {program.uni_code}
              </button>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                {program.stream}
              </span>
              {program.degree_awarded && (
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-sky-100 text-sky-950 border border-sky-200">
                  {program.degree_awarded}
                </span>
              )}
            </div>
            {renderCutoffPill()}
          </div>

          {/* Title & University */}
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
            <button
              type="button"
              onClick={handleOpenDetail}
              className="text-left hover:text-amber-700 transition-colors"
            >
              {program.course_name}
            </button>
          </h3>

          <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => openInstitutionProfile(program.institution_code)}
              className="font-bold text-slate-800 hover:underline"
            >
              {program.institution_name} ({program.institution_code})
            </button>
            <span>·</span>
            <span>{program.institution_location}</span>
          </p>

          {/* 2-Line Program Overview Snippet */}
          <p className="text-xs text-slate-600 mt-2.5 leading-relaxed line-clamp-2">
            {program.overview || program.course_description}
          </p>

          {/* Specialization / Major Pills */}
          {program.specializations && program.specializations.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {program.specializations.slice(0, 4).map((spec) => (
                <button
                  key={spec}
                  type="button"
                  onClick={handleOpenDetail}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-[10px] font-medium transition-colors"
                >
                  {spec}
                </button>
              ))}
              {program.specializations.length > 4 && (
                <button
                  type="button"
                  onClick={handleOpenDetail}
                  className="px-1.5 py-0.5 rounded-md text-[10px] font-bold text-amber-700 hover:underline"
                >
                  +{program.specializations.length - 4} more
                </button>
              )}
            </div>
          )}

          {/* Key Practical Requirements Alerts (Suspended / Aptitude / Quota) */}
          {(program.is_suspended || program.aptitude_test_required || program.special_intake_quota_note) && (
            <div className="flex flex-wrap gap-1.5 mt-3 text-xs">
              {program.is_suspended && (
                <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 font-bold border border-rose-300">
                  ⛔ Intake Suspended for 2025/26
                </span>
              )}
              {program.aptitude_test_required && (
                <span
                  title={program.aptitude_test_info || 'Pass Aptitude / Practical Test'}
                  className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-950 font-bold border border-amber-300 inline-flex items-center gap-1 text-[11px]"
                >
                  <AlertTriangle className="w-3 h-3 text-amber-700" />
                  🎨 Aptitude Test Required
                </span>
              )}
              {program.special_intake_quota_note && (
                <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-950 font-medium text-[11px] border border-sky-200">
                  📌 {program.special_intake_quota_note}
                </span>
              )}
            </div>
          )}

          {/* 3-Part Requirements Block: A/L Rule + Section 5.3 O/L Rule */}
          <div className="mt-3.5 space-y-2 text-xs">
            {/* A/L Requirement Snippet */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col gap-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                  A/L Requirement:
                </span>
                {matchesAlSubjects !== undefined && (
                  matchesAlSubjects ? (
                    <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                      ✓ Matches Subjects
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                      Check Subjects
                    </span>
                  )
                )}
              </div>
              <p className="text-[11px] text-slate-800 font-medium leading-snug">
                {program.al_requirements_summary || '3 S passes in approved A/L subjects'}
              </p>
            </div>

            {/* Section 5.3 G.C.E. (O/L) Requirements Box */}
            <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200/90 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <span className="font-bold text-purple-950 text-[11px] font-mono">
                  📋 {program.ol_short_badge || 'Standard 6 O/L Passes'}
                </span>
                {olEvaluation && (
                  olEvaluation.meetsOl ? (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300 inline-flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-700" />
                      Your O/L Grades Qualify
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-100 text-rose-900 border border-rose-300 inline-flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-700" />
                      Missing: {olEvaluation.missingOlSubjects.join(' · ')}
                    </span>
                  )
                )}
              </div>
              {program.ol_requirements_text && (
                <p className="text-[11px] text-purple-900/90 mt-1 leading-snug">
                  {program.ol_requirements_text}
                </p>
              )}
            </div>
          </div>

          {/* Factual Cutoff Comparison (When official Z is provided) */}
          {studentZ !== undefined && studentZ !== null && match.effectiveCutoff !== null && (
            <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
              <div className="flex flex-wrap items-center justify-between font-mono text-xs">
                <span className="text-slate-600">Your Z: <strong>{studentZ.toFixed(4)}</strong></span>
                <span className="font-bold">
                  Diff vs 2024/25 Cutoff:{' '}
                  <span className={match.margin !== null && match.margin >= 0 ? 'text-emerald-700' : 'text-amber-700'}>
                    {match.margin !== null && match.margin >= 0 ? `+${match.margin.toFixed(4)}` : match.margin?.toFixed(4)}
                  </span>
                </span>
              </div>
              <p className="text-[10px] text-slate-500 italic">
                Historical 2024/2025 UGC cutoff for reference only; official cutoffs vary each admission year.
              </p>
            </div>
          )}

          {/* Muted Secondary Specs Row */}
          <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {program.duration_years} Years
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-slate-400" />
              {program.medium.map((m) => MEDIUM_LABELS[m] ?? m).join(', ')}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-400" />
              {program.proposed_intake} Seats
            </span>
          </div>

          {/* View Full Overview & 25-District Cutoffs Link */}
          <div className="mt-3.5 pt-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={handleOpenDetail}
              className="text-xs font-extrabold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition-colors group cursor-pointer"
            >
              <span>View Full Overview & All 25 District Cutoffs</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Bottom Action Row: + Plan & ⇄ Compare */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            type="button"
            disabled={program.is_suspended}
            onClick={() => (isInPlan ? removeFromPlan(program.uni_code) : addToPlan(program.uni_code))}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold interactive-surface flex items-center justify-center gap-1.5 shadow-xs transition-colors ${
              program.is_suspended
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : isInPlan
                ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                : 'bg-[var(--primitive-obsidian-900)] text-white hover:bg-slate-800'
            }`}
          >
            {program.is_suspended ? (
              <span>⛔ Suspended</span>
            ) : isInPlan ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>In My Plan ✓</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>+ Add to My Plan</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => toggleCompare(program.uni_code)}
            className={`py-2 px-3 rounded-xl text-xs font-bold border interactive-surface flex items-center justify-center gap-1.5 transition-colors ${
              isInCompare
                ? 'border-amber-500 bg-amber-50 text-amber-950 font-extrabold shadow-xs'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{isInCompare ? 'Comparing' : 'Compare'}</span>
          </button>
        </div>
      </article>

      {/* Program Detail Drawer Modal */}
      {isDrawerOpen && (
        <ProgramDetailDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          program={program}
        />
      )}
    </>
  );
};
