import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { GlobalHeader } from './components/GlobalHeader';
import { HomeDiscoveryView } from './components/HomeDiscoveryView';
import { PredictorView } from './components/PredictorView';
import {
  PreferenceSimulatorView,
  PreferenceSimulatorDrawer,
} from './components/PreferenceSimulatorView';
import { CompareEngineView } from './components/CompareEngineView';
import { CareerAtlasAndQuizView } from './components/CareerAtlasAndQuizView';
import {
  InstitutionAndCourseProfileView,
  AdmissionsCalendarView,
} from './components/ProfileAndCalendarView';
import { WelcomeSplashModal } from './components/WelcomeSplashModal';
import { PrivateUniversitiesView } from './components/PrivateUniversitiesView';
import { FloatingActionDock } from './components/FloatingActionDock';
import { Toaster } from 'sonner';

const AppRouterContent: React.FC = () => {
  const { route, district, setRoute, isWelcomeOpen, setIsWelcomeOpen } = useApp();

  useEffect(() => {
    const titles: Record<string, string> = {
      home: `UniPedia.lk (${district.district_name}) — Sri Lanka UGC Cutoff Atlas & Higher Education Portal`,
      predictor: `Course & Cutoff Finder (${district.district_name}) — UniPedia.lk`,
      'my-plan': `My UGC Preference Order Simulator & Conflict Auditor — UniPedia.lk`,
      compare: `4-Way University & UGC uni_code Comparator — UniPedia.lk`,
      careers: `Sri Lanka Career-to-Degree Atlas & LKR Salary Guide — UniPedia.lk`,
      'career-quiz': `3-Minute RIASEC & Klimov Career Compass Quiz — UniPedia.lk`,
      calendar: `Sri Lanka UGC Admissions & Aptitude Test Calendar — UniPedia.lk`,
      'private-unis': `Sri Lanka Private, Foreign & Non-State University Hub (${district.district_name}) — UniPedia.lk`,
      institution: `University Profile & 25-District Cutoffs — UniPedia.lk`,
      course: `UGC uni_code Course Cutoff Matrix & Reviews — UniPedia.lk`,
    };
    document.title = titles[route] ?? titles.home;
  }, [route, district]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-canvas)] text-[var(--color-text-primary)]">
      <GlobalHeader />

      <main className="flex-1">
        {route === 'home' && <HomeDiscoveryView />}
        {route === 'predictor' && <PredictorView />}
        {route === 'my-plan' && <PreferenceSimulatorView />}
        {route === 'compare' && <CompareEngineView />}
        {route === 'careers' && <CareerAtlasAndQuizView initialTab="atlas" />}
        {route === 'career-quiz' && <CareerAtlasAndQuizView initialTab="quiz" />}
        {route === 'calendar' && <AdmissionsCalendarView />}
        {route === 'institution' && <InstitutionAndCourseProfileView mode="institution" />}
        {route === 'course' && <InstitutionAndCourseProfileView mode="course" />}
        {route === 'private-unis' && <PrivateUniversitiesView />}
      </main>

      <PreferenceSimulatorDrawer />
      <FloatingActionDock />
      <WelcomeSplashModal isOpen={isWelcomeOpen} onClose={() => setIsWelcomeOpen(false)} />
      <Toaster richColors position="top-center" />

      {/* Authoritative Footer */}
      <footer className="bg-[var(--primitive-obsidian-900)] text-slate-300 border-t border-slate-800 py-10 px-4 sm:px-6 lg:px-8 no-print">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-xs shrink-0">
                <svg
                  className="w-3.5 h-3.5 text-[#091929]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M6 5.5V14.5C6 16.8 8.7 18.2 12 19.8C15.3 18.2 18 16.8 18 14.5V6.5"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.8 9.2L18 5.5L21.2 9.2"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="font-extrabold text-base text-white">
                Uni<span className="text-amber-400">Pedia</span><span className="text-slate-300 font-semibold text-xs">.lk</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              UniPedia.lk — Sri Lanka's Higher Education Discovery, 25-District Z-Score Cutoff Atlas, UGC Preference Conflict Auditor, and MOHE Interest-Free Loan (IFSLS) Bridge.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="font-bold text-white">Core UGC Admission Tools</div>
            <ul className="space-y-1">
              <li>
                <button type="button" onClick={() => setRoute('predictor')} className="hover:text-amber-300">
                  Course & Cutoff Finder
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setRoute('my-plan')} className="hover:text-amber-300">
                  My UGC Preference Order Simulator
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setRoute('compare')} className="hover:text-amber-300">
                  4-Way Degree & Loan Comparator
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-1.5">
            <div className="font-bold text-white">Pathways & Counseling</div>
            <ul className="space-y-1">
              <li>
                <button type="button" onClick={() => setRoute('careers')} className="hover:text-amber-300">
                  Reverse Career-to-Degree Atlas
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setRoute('career-quiz')} className="hover:text-amber-300">
                  3-Minute RIASEC & Klimov Quiz
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setRoute('private-unis')} className="hover:text-amber-300 text-amber-300 font-semibold">
                  🏛️ Private, Foreign & IFSLS Degrees
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setRoute('private-unis')} className="hover:text-amber-300">
                  MOHE IFSLS & Non-State Admissions ↗
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-1.5">
            <div className="font-bold text-white">Official Sri Lankan Portals</div>
            <ul className="space-y-1">
              <li>
                <a href="https://www.ugc.ac.lk" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300">
                  University Grants Commission (ugc.ac.lk)
                </a>
              </li>
              <li>
                <a href="https://studentloans.mohe.gov.lk" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300">
                  MOHE Interest-Free Student Loans (IFSLS)
                </a>
              </li>
              <li>
                <a href="https://www.doenets.lk" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300">
                  Department of Examinations (doenets.lk)
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppRouterContent />
    </AppProvider>
  );
}

export default App;
