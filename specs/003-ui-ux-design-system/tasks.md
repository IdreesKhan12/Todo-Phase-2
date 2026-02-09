# Tasks: UI & UX Design System

**Input**: Design documents from `/specs/003-ui-ux-design-system/`
**Prerequisites**: plan.md (loaded), spec.md (loaded), research.md (loaded), data-model.md (loaded), contracts/components.md (loaded), quickstart.md (loaded)

**Tests**: No test tasks included — specification does not request automated tests. Verification is visual inspection per quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. Since this is a frontend-only visual redesign, tasks map to file modifications rather than model/service/endpoint patterns.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `frontend/src/` (Next.js App Router)
- **Config**: `frontend/tailwind.config.js`
- **Styles**: `frontend/src/styles/globals.css`

---

## Phase 1: Setup (Design System Foundation)

**Purpose**: Establish the design token system, font loading, and dark mode infrastructure that ALL components consume. No visual output yet — this is pure configuration.

- [x] T001 Configure Tailwind for dark mode, Inter font family, and semantic color tokens in `frontend/tailwind.config.js` — add `darkMode: 'class'`, extend `fontFamily` with `inter: ['Inter', 'sans-serif']`, extend `colors` with semantic tokens mapped to CSS variables (bg-primary, bg-surface, bg-card, text-primary, text-secondary, text-muted, border-default, accent-primary, accent-success, accent-danger, accent-warning) per data-model.md color token table
- [x] T002 Rewrite `frontend/src/styles/globals.css` with design token CSS variables — replace existing `:root` and `@media (prefers-color-scheme)` blocks with `:root` light theme tokens and `.dark` class dark theme tokens per data-model.md; remove `!important` input overrides; add base body styles using token variables; keep `@tailwind base/components/utilities` directives
- [x] T003 Create ThemeContext provider at `frontend/src/context/ThemeContext.tsx` — implement React context with `{ theme: 'light' | 'dark', toggleTheme: () => void }`; read `localStorage('theme')` on mount; toggle `dark` class on `document.documentElement`; default to `'light'`; write to `localStorage` on toggle; per contracts/components.md ThemeProvider spec
- [x] T004 Update `frontend/src/app/layout.tsx` — import Inter from `next/font/google` with subsets `['latin']`; apply Inter's className to `<body>`; wrap `<AuthProvider>` children with `<ThemeProvider>` from ThemeContext; keep existing `'use client'` directive and CSS import

**Checkpoint**: Tailwind config extended, CSS tokens defined for light/dark, ThemeProvider created and wired into layout, Inter font loading. No visual changes visible yet — all foundation-level.

---

## Phase 2: User Story 1 — Professional Dashboard Experience (Priority: P1) 🎯 MVP

**Goal**: Signed-in users see a clean, professional dashboard with consistent typography, spacing, color palette, theme toggle, task summary bar, and "Create Task" CTA. Empty state handled.

**Independent Test**: Sign in → dashboard loads with Inter font, clean header (app name, theme toggle, user email, logout), task summary counts, "Create Task" button. Toggle theme → light/dark switch with no flash. No tasks → empty state message visible. Mobile → responsive layout.

**Maps to**: FR-001 (color palette), FR-002 (Inter typography), FR-004 (modal-based creation), FR-016 (summary bar), SC-001, SC-004, SC-005, SC-007

### Implementation for User Story 1

- [x] T005 [US1] Redesign `frontend/src/app/dashboard/page.tsx` navbar section — apply design tokens: bg-surface for navbar background, text-primary for app title ("Task Manager" in `text-xl font-bold`), text-secondary for user email, add theme toggle button (sun/moon SVG icon) that calls `toggleTheme()` from ThemeContext, style logout button with accent-danger hover, add `dark:` variants for all colors per data-model.md tokens
- [x] T006 [US1] Redesign `frontend/src/app/dashboard/page.tsx` main content area — apply bg-primary to page background, max-w-3xl centered container with px-6 (px-4 mobile), page heading "My Tasks" in text-2xl font-bold text-primary, summary bar showing overdue/upcoming/completed counts with colored indicators (red/blue/green dots + counts in text-xs font-medium), "Create Task" button styled with accent-primary bg, white text, rounded-lg, px-4 py-2, hover opacity, add `dark:` variants throughout
- [x] T007 [US1] Add empty state to `frontend/src/app/dashboard/page.tsx` — when tasks array is empty, display centered message with clipboard SVG icon, "No tasks yet" in text-secondary, and "Create your first task" CTA linking to create modal, style with design tokens and `dark:` variants
- [x] T008 [US1] Polish `frontend/src/app/login/page.tsx` — apply design tokens to auth page: bg-primary page background, bg-card for login card surface with shadow-lg rounded-xl, border-default borders on inputs, accent-primary for submit button and focus rings, text-primary/text-secondary for headings and labels, add `dark:` variants for all elements, ensure consistent input styling (visible borders, proper padding, focus ring) per FR-003

**Checkpoint**: Dashboard displays professional layout with Inter font, theme toggle works (light/dark), summary bar shows counts, "Create Task" button visible. Login page polished. Both pages support dark mode.

---

## Phase 3: User Story 2 — Task Card Visual States (Priority: P1)

**Goal**: Task cards display distinct visual treatment for upcoming (blue), overdue (red), and completed (green) states with color-coded borders, badges, opacity, and strikethrough.

**Independent Test**: Create tasks in each state → verify blue left border + "Upcoming" badge for upcoming, red left border + "Overdue" badge + red due date for overdue, green left border + "Completed" badge + 60% opacity + strikethrough for completed. Completed overrides overdue.

**Maps to**: FR-005 (card content), FR-006 (color-coded borders), FR-007 (completed styling), FR-008 (overdue styling), SC-001, SC-006

### Implementation for User Story 2

- [x] T009 [US2] Restyle `frontend/src/components/tasks/TaskItem.tsx` card layout — apply bg-card background with rounded-lg shadow-sm, border-default border, p-4 padding; display task title in text-base font-medium text-primary, description (truncated to 2 lines) in text-sm text-secondary, due date in text-xs font-medium; add state-based left border: `border-l-4` with blue-500 (upcoming), red-500 (overdue), green-500 (completed); add `dark:` variants for all colors per data-model.md
- [x] T010 [US2] Implement status badges in `frontend/src/components/tasks/TaskItem.tsx` — add badge element showing "Upcoming" (blue bg, blue text), "Overdue" (red bg, red text), or "Completed" (green bg, green text) using `text-xs font-medium px-2 py-0.5 rounded-full`; completed tasks get `opacity-60` on card and `line-through` on title; overdue tasks get red-colored due date text; ensure completed state overrides overdue per task state model in data-model.md
- [x] T011 [US2] Style action buttons in `frontend/src/components/tasks/TaskItem.tsx` — style expanded action bar with border-t border-default, pt-3 mt-3 spacing; "Mark Complete" button green (accent-success), "Update Task" button blue (accent-primary), "Delete Task" button red (accent-danger); all buttons text-sm font-medium px-3 py-1.5 rounded; add loading state text ("Completing...", "Deleting...") and disabled attribute during API calls per FR-012; add `dark:` variants

**Checkpoint**: Task cards show distinct visual states with colored borders, badges, and proper text styling. Action buttons use semantic colors with loading states.

---

## Phase 4: User Story 3 — Modal-Based Task Creation and Editing (Priority: P2)

**Goal**: Create/edit modal with consistent input styling, focus management, validation messages, and dark mode support.

**Independent Test**: Click "Create Task" → modal appears with backdrop, title/description/due-date fields. Submit without title → error message. Fill and submit → task created, modal closes. Click "Update Task" on existing task → modal pre-filled. Edit and submit → task updated.

**Maps to**: FR-003 (input styling), FR-004 (modal creation), FR-010 (create/edit modes), FR-011 (date picker), FR-012 (loading states), SC-002, SC-006

### Implementation for User Story 3

- [x] T012 [US3] Restyle `frontend/src/components/tasks/TaskModal.tsx` — apply design tokens: semi-transparent backdrop (bg-black/50), bg-card for modal surface with rounded-xl shadow-xl max-w-md mx-auto, text-primary for heading ("Create Task" / "Edit Task"), border-default borders on all inputs with rounded-md px-3 py-2, accent-primary focus ring (`focus:ring-2 focus:ring-blue-500`), accent-primary submit button, text-secondary cancel button, error messages in accent-danger text-sm; add `dark:` variants for all elements per data-model.md tokens
- [x] T013 [US3] Ensure modal interaction polish in `frontend/src/components/tasks/TaskModal.tsx` — auto-focus title input on open using `useRef` + `useEffect`, close on backdrop click, close on Cancel, show "Creating..." / "Updating..." on submit button during API call with disabled state per FR-012, due date input uses `type="date"` with `min={today}` per FR-011, pre-fill fields in edit mode per contracts/components.md

**Checkpoint**: Modal create/edit fully styled with design tokens, focus management, validation, loading states, and dark mode support.

---

## Phase 5: User Story 4 — Task Interaction and Action Reveal (Priority: P2)

**Goal**: Clicking a task card expands to reveal styled action buttons. Delete requires confirmation.

**Independent Test**: Click task card → expands showing 3 action buttons with semantic colors. Click again → collapses. Click delete → browser confirmation dialog. Double-click protection via disabled buttons during API calls.

**Maps to**: FR-009 (expand/collapse), FR-012 (loading states), FR-015 (delete confirmation), SC-006

### Implementation for User Story 4

- [x] T014 [US4] Verify expand/collapse interaction in `frontend/src/components/tasks/TaskItem.tsx` — ensure click handler toggles expanded state, action bar appears below card content with smooth visual transition (`overflow-hidden`), clicking expanded card collapses it; action bar has border-t separator with `border-default` color; buttons arranged in flex row with gap-2; add cursor-pointer to card; add `dark:` variants for expanded state borders
- [x] T015 [US4] Verify delete confirmation in `frontend/src/components/tasks/TaskItem.tsx` — ensure delete button triggers `window.confirm()` dialog before API call per FR-015; all action buttons disable during their respective API calls to prevent double-submission per FR-012; button text changes to loading variant ("Completing...", "Deleting...")

**Checkpoint**: Task expand/collapse works smoothly, action buttons styled with semantic colors, delete requires confirmation, loading states prevent duplicate submissions.

---

## Phase 6: User Story 5 — Grouped Task Sections (Priority: P3)

**Goal**: Tasks organized into Overdue, Upcoming, Completed sections with colored dot indicators, counts, and proper sorting. Empty sections hidden.

**Independent Test**: Create tasks in each category → sections appear with colored dots and counts. Delete all overdue tasks → Overdue section disappears. Verify sort: overdue oldest-first, upcoming nearest-first (no-date last), completed most-recent-first.

**Maps to**: FR-013 (grouped sections), SC-001

### Implementation for User Story 5

- [x] T016 [US5] Restyle `frontend/src/components/tasks/TaskList.tsx` section headers — apply design tokens to section headers: colored dot indicator (w-2 h-2 rounded-full inline-block) in red (overdue), blue (upcoming), green (completed); section title in text-sm font-semibold text-primary with uppercase tracking; count badge in text-xs text-secondary; mb-3 between header and cards, mb-8 between sections; add `dark:` variants per data-model.md
- [x] T017 [US5] Restyle `frontend/src/components/tasks/TaskList.tsx` empty state — when no tasks exist at all, show centered empty state with clipboard SVG icon (w-12 h-12 text-muted), "No tasks yet" text in text-lg text-secondary, supporting text in text-sm text-muted; ensure empty sections (0 items in a category) are hidden per FR-013; add `dark:` variants

**Checkpoint**: Task list shows grouped sections with colored dots, counts, proper sorting, and empty state. Empty sections hidden.

---

## Phase 7: User Story 6 — Responsive Layout (Priority: P3)

**Goal**: Application adapts from desktop (1200px+) to mobile (375px) with condensed navigation, stacked cards, and touch-friendly targets.

**Independent Test**: Resize browser from 1400px to 375px → layout adapts at each breakpoint. Mobile: hamburger menu, full-width cards, 44px touch targets. Modal fills mobile viewport width. No horizontal scrolling.

**Maps to**: FR-014 (responsive layout), SC-003 (touch targets), SC-004 (no layout shifts)

### Implementation for User Story 6

- [x] T018 [US6] Apply responsive classes to `frontend/src/app/dashboard/page.tsx` — desktop: max-w-3xl mx-auto px-6; mobile: full-width px-4; navbar: desktop shows all elements inline, mobile (<768px) hides email/logout and shows hamburger MobileNav trigger; summary bar: desktop flex-row, mobile flex-col or grid-cols-3; "Create Task" button: full-width on mobile (w-full md:w-auto); ensure all interactive elements ≥44px height on mobile
- [x] T019 [P] [US6] Style `frontend/src/components/ui/MobileNav.tsx` with design tokens — apply bg-card background, border-default borders, text-primary for links, accent-primary for active states, accent-danger for logout; add `dark:` variants; ensure touch targets ≥44px; slide-in panel with backdrop
- [x] T020 [US6] Verify responsive behavior of `frontend/src/components/tasks/TaskModal.tsx` — on mobile (<640px): modal should use `w-[calc(100%-2rem)]` or `max-w-[calc(100vw-2rem)]` with `mx-4` padding; inputs and buttons full-width; maintain readable font sizes; modal vertically centered

**Checkpoint**: Full responsive behavior — desktop centered layout, mobile full-width with hamburger nav, touch-friendly targets, modal fills mobile viewport.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final visual consistency pass, WCAG compliance, and verification across all components.

- [x] T021 Audit all components for missing `dark:` variants — systematically review each file (dashboard, login, TaskItem, TaskList, TaskModal, MobileNav) to ensure every color, background, border, and text class has a corresponding `dark:` variant; fix any gaps
- [x] T022 Verify WCAG AA contrast ratios — check text-primary on bg-primary (light and dark), text-secondary on bg-card (light and dark), accent colors on their backgrounds; adjust any failing ratios per SC-005 (4.5:1 normal text, 3:1 large text)
- [x] T023 Run quickstart.md verification checklist — execute all 7 verification steps: login page design, dashboard header with theme toggle, theme toggle functionality, upcoming task badge, overdue task badge, completed task badge, mobile responsive layout
- [x] T024 Remove any unused CSS or leftover styles from `frontend/src/styles/globals.css` — ensure no remnant `!important` overrides, no unused `:root` variables, no `@media (prefers-color-scheme)` blocks; clean final state

**Checkpoint**: All components visually consistent, dark mode complete, WCAG compliant, responsive, verification checklist passed.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — starts immediately. T001→T002→T003→T004 (sequential, each builds on previous)
- **User Story 1 (Phase 2)**: Depends on Phase 1 completion (needs tokens, font, ThemeProvider)
- **User Story 2 (Phase 3)**: Depends on Phase 1 (tokens). Can run in parallel with US1 (different files)
- **User Story 3 (Phase 4)**: Depends on Phase 1 (tokens). Can run in parallel with US1/US2 (different file)
- **User Story 4 (Phase 5)**: Depends on US2 completion (TaskItem.tsx must be styled first)
- **User Story 5 (Phase 6)**: Depends on Phase 1 (tokens). Can run in parallel with US1-US3 (different file)
- **User Story 6 (Phase 7)**: Depends on all previous phases (responsive pass over all styled components)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (Dashboard)**: Phase 1 only → `dashboard/page.tsx`, `login/page.tsx`
- **US2 (Task Cards)**: Phase 1 only → `TaskItem.tsx`
- **US3 (Modal)**: Phase 1 only → `TaskModal.tsx`
- **US4 (Interactions)**: US2 (TaskItem styled) → `TaskItem.tsx` (same file as US2, sequential)
- **US5 (Sections)**: Phase 1 only → `TaskList.tsx`
- **US6 (Responsive)**: All previous → `dashboard/page.tsx`, `MobileNav.tsx`, `TaskModal.tsx`

### Within Each User Story

- Apply design tokens (colors, typography, spacing) first
- Add `dark:` variants second
- Add interaction polish (loading states, focus management) last

### Parallel Opportunities

- **After Phase 1 completes**: US1 (dashboard), US2 (TaskItem), US3 (TaskModal), US5 (TaskList) can ALL run in parallel — they touch different files
- **Within Phase 1**: T001 and T003 are independent (different files), but T002 depends on T001, T004 depends on T003
- **US4**: Must wait for US2 (same file: TaskItem.tsx)
- **US6**: Must wait for all previous (responsive pass over all files)

---

## Parallel Example: After Phase 1

```bash
# All four can run simultaneously — each touches a different file:
Task T005-T008: US1 — dashboard/page.tsx + login/page.tsx
Task T009-T011: US2 — TaskItem.tsx
Task T012-T013: US3 — TaskModal.tsx
Task T016-T017: US5 — TaskList.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 + Setup)

1. Complete Phase 1: Setup (T001-T004) — design tokens, font, ThemeProvider
2. Complete Phase 2: US1 (T005-T008) — dashboard + login polished
3. **STOP and VALIDATE**: Theme toggle works, dashboard looks professional, login polished
4. This alone delivers visible SaaS-quality improvement

### Incremental Delivery

1. Phase 1 (Setup) → Foundation ready
2. US1 (Dashboard) → Professional first impression (MVP!)
3. US2 (Task Cards) → Visual state distinction
4. US3 (Modal) → Polished create/edit flow
5. US4 (Interactions) → Action button polish
6. US5 (Sections) → Grouped task organization
7. US6 (Responsive) → Mobile support
8. Polish → Final consistency pass
9. Each story adds visual quality without breaking previous stories

### Single Developer Strategy (Recommended)

Since all changes are frontend-only and many touch the same or related files:

1. Phase 1 (Setup) — sequential, foundation
2. US1 → US2 → US4 (Dashboard → Cards → Interactions) — builds naturally
3. US3 → US5 (Modal → Sections) — independent components
4. US6 (Responsive) — final pass over all
5. Phase 8 (Polish) — audit and verify

---

## Summary

| Metric | Value |
|--------|-------|
| Total tasks | 24 |
| Phase 1 (Setup) | 4 tasks |
| US1 (Dashboard) P1 | 4 tasks |
| US2 (Task Cards) P1 | 3 tasks |
| US3 (Modal) P2 | 2 tasks |
| US4 (Interactions) P2 | 2 tasks |
| US5 (Sections) P3 | 2 tasks |
| US6 (Responsive) P3 | 3 tasks |
| Polish | 4 tasks |
| Parallel opportunities | 4 stories can run in parallel after Phase 1 |
| Files modified | 9 (+ 1 new ThemeContext.tsx) |
| MVP scope | Phase 1 + US1 (8 tasks) |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No automated tests — verification is visual per quickstart.md
- Commit after each phase or logical group
- Stop at any checkpoint to validate story independently
- **No backend changes** — all tasks are frontend-only
- **No new npm dependencies** — Inter via next/font (built-in), all else from Tailwind
