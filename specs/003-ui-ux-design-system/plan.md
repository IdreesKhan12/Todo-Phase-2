# Implementation Plan: UI & UX Design System

**Branch**: `003-ui-ux-design-system` | **Date**: 2026-02-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/003-ui-ux-design-system/spec.md`

## Summary

Redesign the Todo application frontend to achieve production-ready SaaS visual quality. Introduce a design token system with light/dark theme support, Inter typography, consistent color palette, polished task card states, modal interactions, and responsive layout. No backend changes. All existing CRUD operations and authentication remain intact.

## Technical Context

**Language/Version**: TypeScript (Next.js 14, React 18)
**Primary Dependencies**: Next.js 14.0.4, React 18.2, Tailwind CSS 3.3, next/font/google (Inter)
**Storage**: N/A (frontend-only — data in Neon PostgreSQL via existing API)
**Testing**: Visual inspection, responsive testing, WCAG contrast checks
**Target Platform**: Web (desktop-first, responsive to 375px mobile)
**Project Type**: Web application (frontend layer only)
**Performance Goals**: No layout shift on theme toggle, instant visual feedback on actions
**Constraints**: No backend changes, no new npm dependencies, reuse existing API contracts
**Scale/Scope**: 10 frontend files modified/created, 1 new context provider

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-Driven | PASS | Spec approved at `specs/003-ui-ux-design-system/spec.md` |
| II. Agentic Execution | PASS | All code generated via Claude Code |
| III. Deterministic Development | PASS | Same spec input produces same component structure |
| IV. Security-First | PASS | No auth/security changes; JWT flow untouched |
| V. Separation of Concerns | PASS | Frontend-only changes; backend untouched |
| VI. Reviewability | PASS | Each component is independently reviewable |

**Post-Phase 1 Re-check**: PASS — No violations. Design artifacts confirm frontend-only scope with no backend coupling.

## Project Structure

### Documentation (this feature)

```text
specs/003-ui-ux-design-system/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Design decisions and rationale
├── data-model.md        # Design tokens, typography, spacing
├── quickstart.md        # Setup and verification guide
├── contracts/
│   └── components.md    # Component interface contracts
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
frontend/
├── tailwind.config.js        # MODIFIED: dark mode, Inter font, extended colors
├── src/
│   ├── styles/
│   │   └── globals.css        # MODIFIED: design tokens, dark mode variables
│   ├── app/
│   │   ├── layout.tsx         # MODIFIED: Inter font, ThemeProvider
│   │   ├── login/page.tsx     # MODIFIED: polished auth UI, dark mode
│   │   └── dashboard/page.tsx # MODIFIED: redesigned layout, theme toggle
│   ├── context/
│   │   ├── AuthContext.jsx    # UNCHANGED
│   │   └── ThemeContext.tsx   # NEW: theme toggle provider
│   ├── components/
│   │   ├── tasks/
│   │   │   ├── TaskModal.tsx  # MODIFIED: styled modal, dark mode
│   │   │   ├── TaskItem.tsx   # MODIFIED: styled cards, dark mode
│   │   │   └── TaskList.tsx   # MODIFIED: styled sections, dark mode
│   │   └── ui/
│   │       └── MobileNav.tsx  # MODIFIED: dark mode support
│   └── config/
│       └── api.js             # UNCHANGED
```

**Structure Decision**: Web application, frontend layer only. Follows existing Next.js App Router structure. No new routes or pages — all changes are within existing component files plus one new context provider.

## Implementation Phases

### Phase 1: Design Foundation (Tailwind + Tokens + Font)

**Goal**: Establish the design system foundation that all components will consume.

**Changes**:
1. **`tailwind.config.js`**: Add `darkMode: 'class'`, extend `fontFamily` with Inter, extend `colors` with semantic tokens
2. **`globals.css`**: Replace current CSS with design token variables (light/dark), remove `!important` input overrides, add proper dark mode CSS variable scoping
3. **`layout.tsx`**: Import Inter from `next/font/google`, apply to `<body>`, wrap children with `ThemeProvider`

**Depends on**: Nothing (foundation layer)

### Phase 2: Theme Infrastructure

**Goal**: Runtime theme switching with persistence.

**Changes**:
1. **`ThemeContext.tsx`** (NEW): Create context provider that reads `localStorage('theme')`, toggles `dark` class on `<html>`, and provides `{ theme, toggleTheme }` to descendants

**Depends on**: Phase 1 (dark mode class strategy must be configured)

### Phase 3: Auth Page Polish

**Goal**: Professional login/signup page with dark mode support.

**Changes**:
1. **`login/page.tsx`**: Apply design tokens to all elements — card surface, input borders, focus rings, button colors, text hierarchy. Add `dark:` variants for all colors.

**Depends on**: Phase 1 (tokens), Phase 2 (theme context)

### Phase 4: Dashboard + Navbar Redesign

**Goal**: Clean dashboard shell with theme toggle and task summary.

**Changes**:
1. **`dashboard/page.tsx`**: Redesign navbar (add theme toggle icon), apply design tokens to page background, header typography, summary counts, and "Create Task" button. Add `dark:` variants throughout.

**Depends on**: Phase 2 (ThemeProvider for toggle), Phase 1 (tokens)

### Phase 5: Task Components Polish

**Goal**: Production-quality task cards, sections, and modal with full dark mode support.

**Changes**:
1. **`TaskItem.tsx`**: Apply design tokens to card backgrounds, borders, text colors, badges, action buttons. Add `dark:` variants. Ensure state-based styling (overdue red, upcoming blue, completed green) works in both themes.
2. **`TaskList.tsx`**: Apply design tokens to section headers, dot indicators, empty state. Add `dark:` variants.
3. **`TaskModal.tsx`**: Apply design tokens to modal backdrop, card, inputs, buttons. Add `dark:` variants. Ensure focus management.

**Depends on**: Phase 1 (tokens), Phase 4 (dashboard shell)

### Phase 6: Mobile + Responsive Polish

**Goal**: Ensure all components work cleanly at mobile viewports.

**Changes**:
1. **`MobileNav.tsx`**: Apply design tokens to mobile menu panel, buttons. Add `dark:` variants.
2. **All components**: Verify responsive behavior, adjust spacing/sizing for mobile breakpoints.

**Depends on**: All previous phases

## Complexity Tracking

> No constitution violations. No complexity justifications needed.

## Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Dark mode strategy | `darkMode: 'class'` | Runtime toggle, no flash, localStorage persistence |
| Font loading | `next/font/google` (Inter) | Zero layout shift, self-hosted, no external CDN |
| Color architecture | CSS variables + Tailwind `dark:` | Runtime switching without rebuild |
| Theme persistence | `localStorage` | Survives page reload, no server dependency |
| Component layout | Single-column cards | Best for mixed content, mobile-friendly |
| Icon approach | Inline SVG (existing pattern) | No new dependency, matches codebase |
| New dependencies | None | Inter via next/font (built-in), all else from Tailwind |

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Flash of wrong theme on page load | Medium | Low | ThemeProvider reads localStorage before first render |
| Tailwind dark: classes missing on some elements | Medium | Low | Systematic review of each component |
| Input field visibility regression (previous bug) | Low | Medium | Remove `!important` overrides, use proper token-based styling |
