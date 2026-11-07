# UniPedia UX Polish Design: Navigation Context, Sonner Feedback & Brand Shell

- **Date**: 2026-11-07
- **Status**: Pending Approval
- **Scope**: Approach A (In-Place Enhancements)

---

## 1. Intent and Why

UniPedia is designed to guide Sri Lankan A/L students through central UGC state university admissions and non-state higher education options. While the underlying Z-score matching, quota logic, and catalog datasets are robust and tested, students currently encounter three friction points:
1. **Context Loss on Return Navigation**: When reviewing matching degree programs from the finder/results, clicking on a course and subsequently clicking "Back to courses" resets active search filters and Z-score state, forcing students to re-enter their data.
2. **Missing Micro-Interactions**: Students lack quick copy affordances for 4-character UGC codes (`001A`, `117G`) and lack tactile toast feedback with undo capabilities when managing their preference shortlist.
3. **Inconsistent Brand Shell**: Older legacy header styles and page wrapper treatments cause visual discrepancies between the modern purple/white homepage masthead and secondary pages.

Solving these three problems creates a seamless, polished, and trustworthy user experience without bloating the codebase or disturbing the existing 112 passing tests.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- **G1**: Clicking "Back to courses" from any UGC course profile returns the student to their exact previous search state (stream, district, Z-score, filters, and page).
- **G2**: Provide instant 1-click clipboard copying for UGC codes with a rich Sonner toast confirmation.
- **G3**: Enhance shortlist additions/removals with Sonner toasts featuring an interactive "Undo" action.
- **G4**: Display a clear feedback toast when students switch administrative districts in the global header.
- **G5**: Unify header styling across all routes so every page displays the clean white reference masthead with the cap icon, eliminating legacy blue header overrides.

### Non-Goals
- Automated or forced templating of university profiles: The site author will continue to handcraft deep, bespoke editorial profiles (like Colombo) for each university.
- Introducing a third-party router library (e.g. React Router); we stay on the existing lightweight history API and `sessionStorage` architecture.
- Re-architecting state into Redux/Zustand; `AppContext` remains the single store.

### Anti-Goals
- Breaking any of the 112 existing unit or integration tests.
- Resetting student preferences or local storage data without consent.
- Introducing heavy animation libraries or decorative bloat.

---

## 3. Constraints

- **React 19 & Tailwind CSS 4**: Components must conform to React 19 standards and use active design tokens.
- **Sonner 2.0.8**: Utilize the existing `<Toaster richColors position="bottom-right" />` instance mounted in `src/App.tsx`.
- **Trilingual Support**: All user-facing strings must have English, Sinhala, and Tamil variants or use locale keys where applicable.

---

## 4. Approaches Considered

### Approach A: In-Place Enhancements (Selected by User)
- **Navigation**: Capture the complete query string (`/courses?view=results&stream=...&district=...&page=...`) in `sessionStorage` via `rememberUgcReturn` and ensure `UgcFinder` restores the student draft state on popstate and back navigation.
- **Sonner**: Augment `AppContext.tsx` (`addToPlan`, `removeFromPlan`, `setDistrictId`) and `UgcOpportunityRow.tsx` / `CourseDetails.tsx` with Sonner toasts and clipboard triggers.
- **Shell**: Remove `.site-header` overrides in `app.css` to standardize on `.portal-header.reference-header`.
- **Why Selected**: Smallest diff, zero architectural churn, preserves all test contracts.

### Approach B: Global App Router & State Architecture Rewrite (Rejected)
- Overhaul navigation with a full URL query serializer and nested router layouts.
- **Why Rejected**: Unnecessary complexity, high risk of regressions across 15 test suites.

---

## 5. Detailed Design & Changes

### 5.1 Return Navigation State (`navigationMemory.ts`, `UgcOpportunityRow.tsx`, `ProfileAndCalendarView.tsx`, `UgcFinder.tsx`)
1. **Capturing Search URL**:
   - In `UgcOpportunityRow.tsx`, ensure clicking the course link executes `openCourseProfile(p.uni_code)` or calls `rememberUgcReturn(window.location.pathname + window.location.search)`.
   - Update `safeUgcReturn` in `src/lib/navigationMemory.ts` to strictly retain query parameters (e.g. `?view=results&stream=PHYSICAL&district=1&page=2`).
2. **Restoring State in UgcFinder**:
   - When returning to `/courses?view=results`, read parameters directly from `window.location.search` and synchronize `studentZScore`, `studentStream`, and `district` without resetting to defaults.
3. **Dedicated "Back to courses" Button**:
   - In `ProfileAndCalendarView.tsx`, the breadcrumb "Back to courses" link will use `ugcReturnDestination()` with an `onClick` fallback to `window.history.back()` if the previous history entry matches.

### 5.2 Sonner Micro-Interactions (`AppContext.tsx`, `UgcOpportunityRow.tsx`, `PortalPrimitives.tsx`)
1. **UGC Code Copying**:
   - Add a clickable pill or copy icon next to `uni_code` badges (e.g. `001A`, `117G`).
   - On click, copy to clipboard via `navigator.clipboard.writeText` and trigger:
     ```tsx
     toast.success(`Copied UGC Code: ${code}`, {
       description: `${courseName} (${institutionName})`,
       duration: 3000,
     });
     ```
2. **Shortlist Add / Remove with Undo**:
   - In `AppContext.tsx`:
     ```tsx
     // On Add:
     toast.success(`Added ${course.course_name} to your shortlist`, {
       action: {
         label: "Undo",
         onClick: () => removeFromPlan(code),
       },
     });
     // On Remove:
     toast(`Removed ${course.course_name} from your shortlist`, {
       action: {
         label: "Undo",
         onClick: () => addToPlan(code),
       },
     });
     ```
3. **District Switcher Feedback**:
   - In `setDistrictId` inside `AppContext.tsx`, trigger:
     ```tsx
     toast.info(`District changed to ${district.name_en}`, {
       description: "Minimum cutoff Z-scores and quota allocations updated.",
       duration: 2500,
     });
     ```

### 5.3 Unified Brand Shell (`PortalHeader.tsx`, `app.css`, `portal.css`)
1. **Retire Dark Header CSS**:
   - Clean up `.site-header` in `app.css` so it never forces `var(--retained-colour-2)` (dark blue) over the `.portal-header.reference-header`.
2. **Universal Masthead**:
   - Ensure every page renders the reference masthead (white surface, cap badge, clear navigation links, language dropdown, shortlist counter, compare counter).
   - Ensure content containers across `/explore`, `/institutions`, and `/compare` use uniform max-width (1200px) and padding.

---

## 6. What's Left to the Builder

- Verify clipboard API accessibility fallbacks (e.g., when running in insecure contexts or legacy webviews).
- Run the full test suite (`npm run test`) and ensure all tests continue to pass.
- Verify production build (`npm run build`).
