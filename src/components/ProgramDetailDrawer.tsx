import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Check,
  Plus,
  Scale,
  Building,
  GraduationCap,
  AlertTriangle,
  BookOpen,
  Users,
  Clock,
  Briefcase,
  ShieldCheck,
  FileText,
  Percent,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { ProgramCutoffViewRow, NonStatePathway } from '../data/sriLankaUgcSnapshot';
import { fetchAllDistrictCutoffsForUniCode } from '../services/ugcDataService';

export interface ProgramDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  program?: ProgramCutoffViewRow | null;
  pathway?: NonStatePathway | null;
}

export const ProgramDetailDrawer: React.FC<ProgramDetailDrawerProps> = ({
  isOpen,
  onClose,
  program,
  pathway,
}) => {
  const {
    district,
    planEntries,
    addToPlan,
    removeFromPlan,
    compareList,
    toggleCompare,
  } = useApp();
  const selectedDistrictId = district.district_id;

  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'cutoffs'>('overview');
  const [districtCutoffs, setDistrictCutoffs] = useState<
    { district_id: number; district_name: string; min_z_score: number | null; status: 'QUALIFIED' | 'NQC' }[]
  >([]);
  const [isLoadingCutoffs, setIsLoadingCutoffs] = useState(false);

  // Load 25 district cutoffs when program changes
  useEffect(() => {
    if (program && isOpen) {
      setIsLoadingCutoffs(true);
      fetchAllDistrictCutoffsForUniCode(program.uni_code)
        .then((data) => setDistrictCutoffs(data))
        .catch(() => setDistrictCutoffs([]))
        .finally(() => setIsLoadingCutoffs(false));
    }
  }, [program, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || (!program && !pathway)) return null;

  const isState = Boolean(program);
  const isInPlan = program ? planEntries.some((p) => p.uni_code === program.uni_code) : false;
  const isInCompare = program ? compareList.includes(program.uni_code) : false;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={program ? program.course_name : pathway?.degree_title}
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Slide-Over Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 sm:p-6 bg-slate-900 text-white flex-shrink-0 relative">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close detail drawer"
            >
              <X className="w-5 h-5" />
            </button>

            {isState && program ? (
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-tabular shadow-xs">
                    {program.uni_code}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-slate-800 text-slate-200">
                    {program.stream}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-xs font-extrabold bg-sky-900 text-sky-200">
                    {program.degree_awarded}
                  </span>
                  {program.is_suspended && (
                    <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-rose-900 text-rose-200">
                      ⛔ Intake Suspended
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {program.course_name}
                </h2>

                <p className="text-sm text-slate-300 mt-1.5 flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-amber-300 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5" />
                    {program.institution_name} ({program.institution_code})
                  </span>
                  <span>·</span>
                  <span>{program.faculty}</span>
                  <span>·</span>
                  <span>{program.institution_location}</span>
                </p>

                {program.institution_website && (
                  <div className="mt-3">
                    <a
                      href={program.institution_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-sky-300 hover:text-sky-200 underline"
                    >
                      Visit Official University Portal
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            ) : pathway ? (
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 shadow-xs">
                    {pathway.institute_abbr}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-slate-800 text-slate-200">
                    {pathway.sector === 'MOHE_IFSLS_PRIVATE'
                      ? 'MOHE IFSLS 0% Loan'
                      : pathway.sector === 'STATE_NON_UGC'
                      ? 'State Non-UGC'
                      : 'Foreign Partner Degree'}
                  </span>
                  {pathway.foreign_partner && (
                    <span className="px-2 py-0.5 rounded-md text-xs font-extrabold bg-purple-900 text-purple-200">
                      {pathway.foreign_partner}
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {pathway.degree_title}
                </h2>

                <p className="text-sm text-slate-300 mt-1.5">
                  <strong>{pathway.institute_name}</strong> · {pathway.location}
                </p>
              </div>
            ) : null}
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-extrabold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'border-amber-600 text-amber-900 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Program & Specializations</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('requirements')}
              className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-extrabold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'requirements'
                  ? 'border-amber-600 text-amber-900 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Entry Requirements & Quotas</span>
            </button>

            {isState && (
              <button
                type="button"
                onClick={() => setActiveTab('cutoffs')}
                className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-extrabold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'cutoffs'
                    ? 'border-amber-600 text-amber-900 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Percent className="w-4 h-4" />
                <span>25-District Cutoff Matrix</span>
              </button>
            )}
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* Tab 1: Program Overview & Specializations */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Academic Overview Box */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-amber-600" />
                    Academic & Curriculum Overview
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm leading-relaxed text-slate-800">
                    {program?.overview || program?.course_description || (pathway ? `${pathway.degree_title} at ${pathway.institute_name} provides comprehensive professional preparation with industry training and global accreditation.` : null) || (
                      <p>
                        Comprehensive four-year undergraduate curriculum accredited by the University
                        Grants Commission (UGC) of Sri Lanka and recognized statutory professional
                        bodies.
                      </p>
                    )}
                  </div>
                </div>

                {/* Duration, Medium & Intake Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="text-slate-400 text-xs font-semibold flex items-center justify-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Duration
                    </div>
                    <div className="font-extrabold text-slate-900 text-sm mt-1">
                      {program?.duration_years || pathway?.duration_years || 4} Years
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="text-slate-400 text-xs font-semibold flex items-center justify-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" /> Medium
                    </div>
                    <div className="font-extrabold text-slate-900 text-sm mt-1">
                      {program?.medium?.join(', ') || 'English'}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="text-slate-400 text-xs font-semibold flex items-center justify-center gap-1">
                      <Users className="w-3.5 h-3.5" /> Annual Intake
                    </div>
                    <div className="font-extrabold text-slate-900 text-sm mt-1 font-tabular">
                      {program?.proposed_intake ?? 100} Seats
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="text-slate-400 text-xs font-semibold flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Differently-Abled
                    </div>
                    <div className="font-extrabold text-slate-900 text-sm mt-1 font-tabular">
                      {program?.differently_abled_quota ?? 5} Seats
                    </div>
                  </div>
                </div>

                {/* Specializations / Majors */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    2nd/3rd-Year Specialization Majors
                  </h3>
                  {((program?.specializations && program.specializations.length > 0) ||
                    (pathway?.specializations && pathway.specializations.length > 0)) ? (
                    <div className="flex flex-wrap gap-2">
                      {(program?.specializations || pathway?.specializations || []).map((spec) => (
                        <span
                          key={spec}
                          className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-950 font-bold text-xs border border-amber-200/90"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">
                      Direct degree award with multidisciplinary core modules.
                    </p>
                  )}
                </div>

                {/* Career Outcomes */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                    Top Graduate Career Roles
                  </h3>
                  {program?.career_paths && program.career_paths.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {program.career_paths.map((career) => (
                        <div
                          key={career}
                          className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-950 font-bold flex items-center gap-2"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                          <span>{career}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-600">
                      Graduates enter specialized technical, corporate leadership, public service, and
                      academic research tracks.
                    </div>
                  )}
                </div>

                {/* Non-state tuition note if applicable */}
                {pathway && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                    <div className="font-extrabold text-emerald-950 text-sm">
                      Tuition & Funding Structure
                    </div>
                    <div className="text-emerald-900">{pathway.tuition_note_lkr}</div>
                    {pathway.foreign_partner && (
                      <div className="text-slate-600">
                        Degree Conferred By: <strong>{pathway.foreign_partner}</strong>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Complete Entry Requirements Checklist */}
            {activeTab === 'requirements' && (
              <div className="space-y-6">
                {/* A/L Subject Rules */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-900 text-sm">
                      1. G.C.E. (A/L) Subject Prerequisites & Minimum Grades
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-200 text-slate-800">
                      Section 2.2
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                    {program?.al_requirements_summary ||
                      (pathway ? `Entry Pathway: ${pathway.entry_stage.join(' · ')}` : null) ||
                      'Minimum 3 Ordinary (S) passes in approved A/L subjects at a single sitting.'}
                  </p>
                  <ul className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-200/80">
                    <li>• Must pass at one and the same sitting of G.C.E. (A/L) examination.</li>
                    <li>• Minimum 30% marks in Common General Test (mandatory for UGC registration).</li>
                    <li>• Grade 12/13 attendance record and school principal endorsement required.</li>
                  </ul>
                </div>

                {/* Section 5.3 O/L Requirements */}
                <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-purple-950 text-sm">
                      2. G.C.E. (O/L) Requirements (Handbook Section 5.3, pp. 149–150)
                    </h3>
                    {program?.requires_ol_special ? (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-200 text-purple-900">
                        Special O/L Rule
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-200 text-slate-800">
                        Standard 6 Passes
                      </span>
                    )}
                  </div>

                  {program?.requires_ol_special ? (
                    <div>
                      {program.ol_short_badge && (
                        <div className="inline-block px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-purple-200/90 text-purple-950 mb-2">
                          📋 {program.ol_short_badge}
                        </div>
                      )}
                      <p className="text-xs sm:text-sm text-purple-950 leading-relaxed font-medium">
                        {program.ol_requirements_text}
                      </p>
                      <p className="text-xs text-purple-800 mt-2">
                        ⚠️ Note: A certified true copy of your G.C.E. (O/L) certificate must be
                        attached to the postal confirmation sheet of your UGC application.
                      </p>
                    </div>
                  ) : pathway?.ol_requirement_badge ? (
                    <div className="text-xs sm:text-sm text-purple-950 font-medium">
                      📋 {pathway.ol_requirement_badge}
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-purple-950">
                      Standard G.C.E. (O/L) qualification: at least 6 passes in not more than two
                      sittings with no specific subject grade floors.
                    </p>
                  )}
                </div>

                {/* Section 5.4 Aptitude Test & Physical Rules */}
                {(program?.aptitude_test_required || program?.aptitude_test_info) && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 space-y-2">
                    <div className="flex items-center gap-1.5 font-extrabold text-sm text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                      <span>3. Section 5.4 University Aptitude / Practical Test Requirement</span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed font-medium">
                      {program?.aptitude_test_info ||
                        'Candidate must sit and obtain pass marks in the official University Aptitude / Practical Test conducted by the faculty before final UGC allocation.'}
                    </p>
                    <p className="text-xs text-amber-800">
                      Gazette notices and registration forms are published by the respective university
                      shortly after G.C.E. (A/L) results release.
                    </p>
                  </div>
                )}

                {/* Special Quota Notes */}
                {program?.special_intake_quota_note && (
                  <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-950 space-y-1">
                    <div className="font-extrabold text-sky-900">
                      4. Special Stream Split & National Selection Quota
                    </div>
                    <p className="font-medium">{program.special_intake_quota_note}</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Complete 25-District Cutoff Matrix */}
            {activeTab === 'cutoffs' && isState && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Official Published 2024/2025 District Minimum Cutoff Z-Scores
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">Academic Year 2024/2025</span>
                </div>

                {isLoadingCutoffs ? (
                  <div className="py-12 text-center text-slate-500 text-sm">
                    Loading all 25 districts historical cutoffs...
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {districtCutoffs.map((d) => {
                      const isSelectedDistrict = d.district_id === selectedDistrictId;
                      return (
                        <div
                          key={d.district_id}
                          className={`p-2.5 rounded-xl border text-xs transition-colors flex items-center justify-between ${
                            isSelectedDistrict
                              ? 'bg-amber-50 border-amber-400 font-bold shadow-xs'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <div className="text-slate-600 font-semibold flex items-center gap-1">
                              <span className="text-[10px] font-mono text-slate-400 font-tabular">
                                #{d.district_id}
                              </span>
                              <span>{d.district_name}</span>
                              {isSelectedDistrict && (
                                <span className="text-[9px] px-1 rounded bg-amber-200 text-amber-900 font-extrabold">
                                  YOU
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="font-mono font-black text-right font-tabular">
                            {d.status === 'NQC' || d.min_z_score === null ? (
                              <span className="text-slate-400">NQC</span>
                            ) : (
                              <span className={isSelectedDistrict ? 'text-amber-950' : 'text-slate-900'}>
                                {d.min_z_score.toFixed(4)}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <p className="text-[11px] text-slate-500 italic mt-2">
                  * NQC = No Qualified Candidates admitted from that district in the 2024/2025
                  published intake.
                </p>
              </div>
            )}
          </div>

          {/* Footer Action Bar */}
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 flex-shrink-0">
            {isState && program ? (
              <>
                <button
                  type="button"
                  disabled={program.is_suspended}
                  onClick={() =>
                    isInPlan
                      ? removeFromPlan(program.uni_code)
                      : addToPlan(program.uni_code)
                  }
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold interactive-surface flex items-center justify-center gap-1.5 shadow-xs transition-colors ${
                    program.is_suspended
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : isInPlan
                      ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {program.is_suspended ? (
                    <span>⛔ Intake Suspended</span>
                  ) : isInPlan ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>In My Plan ✓</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-amber-400" />
                      <span>+ Add to My Plan</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => toggleCompare(program.uni_code)}
                  className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold border interactive-surface flex items-center justify-center gap-1.5 transition-colors ${
                    isInCompare
                      ? 'border-amber-500 bg-amber-50 text-amber-950 shadow-xs'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Scale className="w-4 h-4" />
                  <span>{isInCompare ? 'Comparing' : 'Compare'}</span>
                </button>
              </>
            ) : pathway ? (
              <div className="flex items-center gap-2 w-full">
                <a
                  href={pathway.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Apply on {pathway.institute_abbr} Page ↗</span>
                </a>
                {pathway.ifsls_loan_eligible && (
                  <a
                    href="https://studentloans.mohe.gov.lk/loan_application/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center gap-1 shadow-xs"
                  >
                    <span>MOHE 0% Loan ↗</span>
                  </a>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
