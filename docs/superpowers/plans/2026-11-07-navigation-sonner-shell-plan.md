# Navigation Context, Sonner Feedback & Brand Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix search return-navigation context loss, add rich Sonner toast micro-interactions (UGC code copy, shortlist undo, district change alert), and unify the brand shell across all routes.

**Architecture:** Extend `navigationMemory.ts` to preserve full search queries (`/courses?view=results&...`), augment `AppContext.tsx` and `UgcOpportunityRow.tsx` with Sonner toast triggers and clipboard actions, and eliminate legacy blue header overrides in `app.css`.

**Tech Stack:** React 19, TypeScript 5.7, Tailwind CSS 4, Sonner 2.0.8, Phosphor Icons, Vitest.

**Spec:** [`docs/superpowers/specs/2026-11-07-navigation-sonner-shell-design.md`](file:///c:/Users/DELL/Downloads/blabla%20new/unipedia-1/docs/superpowers/specs/2026-11-07-navigation-sonner-shell-design.md)

## Global Constraints

- Preserve all existing 112 unit and integration test contracts.
- Respect trilingual UI support (`EN`, `SI`, `TA`).
- No external routing libraries; rely on lightweight `window.history` and `sessionStorage`.
- Touch target sizes must remain $\ge 44\text{px}$.

## Review Focus

1. **Empty / Corrupt `sessionStorage` Return URL**: Clicking "Back to courses" when arriving directly from an external link must safely fall back to `/courses?view=results` without throwing.
2. **Duplicate Toast Suppression**: Sonner must not duplicate toasts on rapid repeated clicks.
3. **Clipboard API in Non-Secure Contexts**: Clipboard copying of UGC codes must have a fallback or try/catch so it never crashes in legacy browsers or non-HTTPS previews.
4. **Active Route Indication**: The unified masthead must highlight the active route correctly for both state UGC and non-state catalogue paths.
5. **No Layout Shifts on Mobile Viewports**: Header controls must wrap cleanly on 390px phone screens.

---

### Task 1: Fix Return-Navigation & Query Persistence

**Files:**
- Modify: `src/lib/navigationMemory.ts:1-28`
- Modify: `src/components/ProfileAndCalendarView.tsx:43-49`
- Modify: `src/components/UgcOpportunityRow.tsx:35-43`
- Test: `src/lib/__tests__/navigationMemory.test.ts`

**Interfaces:**
- Consumes: `safeUgcReturn(value: unknown): string`, `rememberUgcReturn(value: string): void`, `ugcReturnDestination(): string`.
- Produces: Enhanced `safeUgcReturn` preserving exact query strings and hashes for `/courses` and `/explore`.

- [ ] **Step 1: Write test for query preservation in `src/lib/__tests__/navigationMemory.test.ts`**

```typescript
it("preserves complex search queries and view parameters on return", () => {
  const queryUrl = "/courses?view=results&stream=PHYSICAL&district=1&z=1.85&page=2";
  rememberUgcReturn(queryUrl);
  expect(ugcReturnDestination()).toBe(queryUrl);
});
```

- [ ] **Step 2: Run test to verify behavior**

Run: `npx vitest run src/lib/__tests__/navigationMemory.test.ts`
Expected: Ensure existing tests run.

- [ ] **Step 3: Update `src/lib/navigationMemory.ts`**

Update `safeUgcReturn` to accept query strings and prevent stripping search parameters:
```typescript
export function safeUgcReturn(value: unknown): string {
  if (typeof value !== "string" || !/^\/(courses|explore)(?:[?#]|$)/.test(value)) {
    return "/courses?view=results";
  }
  try {
    const url = new URL(value, "https://unipedia.lk");
    return url.pathname + url.search + url.hash;
  } catch {
    return "/courses?view=results";
  }
}
```

- [ ] **Step 4: Update `src/components/ProfileAndCalendarView.tsx` and `UgcOpportunityRow.tsx`**

Ensure clicking a course captures `window.location.pathname + window.location.search`, and "Back to courses" links to `ugcReturnDestination()`.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/lib/__tests__/navigationMemory.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/lib/navigationMemory.ts src/components/ProfileAndCalendarView.tsx src/components/UgcOpportunityRow.tsx src/lib/__tests__/navigationMemory.test.ts
git commit -m "fix(nav): preserve search query and filter context on course return navigation"
```

---

### Task 2: Sonner Micro-Interactions (UGC Code Copy, Plan Undo & District Switcher)

**Files:**
- Modify: `src/context/AppContext.tsx:280-330`
- Modify: `src/components/UgcOpportunityRow.tsx:48-53`
- Modify: `src/components/CourseDetails.tsx` (or UGC code badge views)
- Test: `src/context/AppContext.test.tsx`

**Interfaces:**
- Consumes: `toast` from `sonner`.
- Produces: `copyUgcCode(code: string, label?: string)` helper; interactive `toast.success` with `action: { label: "Undo", onClick }` in `addToPlan` and `removeFromPlan`.

- [ ] **Step 1: Write test for toast trigger in `src/context/AppContext.test.tsx`**

Test that adding and removing plan entries invokes toast notifications and exposes undo capability.

- [ ] **Step 2: Run test to verify it fails/passes**

Run: `npx vitest run src/context/AppContext.test.tsx`

- [ ] **Step 3: Implement Sonner calls in `src/context/AppContext.tsx`**

In `addToPlan`:
```typescript
toast.success(`Added ${offering.course_name} (${code}) to your shortlist`, {
  action: {
    label: "Undo",
    onClick: () => removeFromPlan(code),
  },
  duration: 4000,
});
```

In `removeFromPlan`:
```typescript
toast(`Removed ${offering.course_name} from your shortlist`, {
  action: {
    label: "Undo",
    onClick: () => addToPlan(code),
  },
  duration: 4000,
});
```

In `setDistrictId`:
```typescript
const d = SRI_LANKA_DISTRICTS.find((item) => item.district_id === id);
if (d) {
  toast.info(`District changed to ${d.district_name_en}`, {
    description: "Recalculated district quota minimum Z-scores.",
    duration: 2500,
  });
}
```

- [ ] **Step 4: Implement 1-click UGC code copy in `src/components/UgcOpportunityRow.tsx`**

Add copy action to `p.uni_code`:
```tsx
<button
  type="button"
  className="code-copy-pill"
  title="Click to copy UGC code"
  onClick={(e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(p.uni_code);
    toast.success(`Copied UGC code ${p.uni_code}`, {
      description: `${p.course_name} - ${p.institution_name}`,
      duration: 3000,
    });
  }}
>
  <code>{p.uni_code}</code>
</button>
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/context/AppContext.tsx src/components/UgcOpportunityRow.tsx src/context/AppContext.test.tsx
git commit -m "feat(ui): add Sonner toasts for UGC code copy, plan undo, and district change"
```

---

### Task 3: Unified Brand Shell & CSS Consistency

**Files:**
- Modify: `src/styles/app.css:225-260`
- Modify: `src/styles/portal.css`
- Modify: `src/components/PortalHeader.tsx`
- Test: `src/components/sitePresentation.test.tsx`

**Interfaces:**
- Consumes: Clean `.portal-header.reference-header` class.
- Produces: Consistent white masthead and uniform max-width across all routes.

- [ ] **Step 1: Write/update test in `src/components/sitePresentation.test.tsx`**

Verify that `PortalHeader` renders `.reference-header` with expected brand elements.

- [ ] **Step 2: Clean up legacy header overrides in `src/styles/app.css`**

Remove conflicting `background: var(--retained-colour-2)` on `.site-header` so `.portal-header.reference-header` cleanly controls header appearance across all routes.

- [ ] **Step 3: Align container widths & padding**

Ensure secondary views (`/explore`, `/institutions`, `/compare`, `/shortlist`) share standard 1200px container width and 32px/16px gutters.

- [ ] **Step 4: Run full test suite and build**

Run:
```bash
npm test
npm run build
```
Expected: All tests pass; Vite build succeeds cleanly with 0 type errors.

- [ ] **Step 5: Commit**

```bash
git add src/styles/app.css src/styles/portal.css src/components/PortalHeader.tsx src/components/sitePresentation.test.tsx
git commit -m "style(shell): unify reference masthead and page container styling"
```
