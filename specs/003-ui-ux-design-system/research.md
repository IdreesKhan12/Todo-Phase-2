# Research: UI & UX Design System

**Feature**: 003-ui-ux-design-system
**Date**: 2026-02-09

## R1: Light vs Dark Theme Strategy

**Decision**: Light theme as default with dark mode toggle via Tailwind `darkMode: 'class'` strategy.

**Rationale**: Light theme is the productivity standard (Todoist, Linear, Asana all default to light). Dark mode is a user preference toggle, not a system-default. The `class` strategy allows runtime switching via a CSS class on `<html>`, which works with Next.js App Router without flash-of-wrong-theme.

**Alternatives considered**:
- `prefers-color-scheme` media query only — rejected: no user control, can't override system preference
- Dark-only theme — rejected: poor readability for most users in productivity apps
- No dark mode — rejected: user explicitly requested dark toggle

## R2: Font Selection — Inter

**Decision**: Use Inter via `next/font/google` built-in loader.

**Rationale**: Inter is optimized for UI readability at small sizes, has excellent variable font support, and is available via Next.js built-in font optimization (zero layout shift, self-hosted). No external CDN dependency.

**Alternatives considered**:
- Poppins — rejected: geometric shapes less readable at small sizes; Inter is more legible for data-heavy UI
- System font stack — rejected: inconsistent across platforms, doesn't deliver "SaaS-quality" visual identity
- Geist (Vercel) — considered but Inter has broader adoption and recognition

## R3: Color Token Architecture

**Decision**: CSS custom properties scoped under `.light` / `.dark` classes, mapped to Tailwind config via `theme.extend.colors`.

**Rationale**: CSS variables enable runtime theme switching without rebuilding. Tailwind's `dark:` variant works with `darkMode: 'class'`. Tokens defined in globals.css, consumed via Tailwind utility classes.

**Color palette**:
- Primary: Blue-600 (#2563EB) — actions, links, focus rings
- Success: Green-600 (#16A34A) — completed state, confirm actions
- Danger: Red-600 (#DC2626) — overdue state, delete actions, errors
- Warning: Amber-500 (#F59E0B) — mark incomplete action
- Neutral: Gray scale (50–900) — backgrounds, text, borders
- Dark surface: Gray-900 (#111827) — dark mode background
- Dark card: Gray-800 (#1F2937) — dark mode card surfaces

## R4: Component Architecture

**Decision**: Single-page dashboard with modal overlays. No additional routes.

**Rationale**: The app has a single primary view (task list). Modals keep users in context and are faster than page navigation. This matches the UX patterns of Todoist, Linear, and Things.

**Component hierarchy**:
```
layout.tsx (Inter font, ThemeProvider, AuthProvider)
├── login/page.tsx (Auth page)
└── dashboard/page.tsx
    ├── Navbar (app name, theme toggle, user, logout)
    ├── TaskSummary (overdue/upcoming/completed counts)
    ├── CreateTaskButton → opens TaskModal(create)
    └── TaskList
        ├── Section "Overdue" → TaskItem[] → expand → actions
        ├── Section "Upcoming" → TaskItem[] → expand → actions
        └── Section "Completed" → TaskItem[] → expand → actions
            └── TaskModal(edit) when "Update" clicked
```

## R5: Tailwind Dark Mode Configuration

**Decision**: Use `darkMode: 'class'` with a `ThemeProvider` context that persists to `localStorage`.

**Rationale**: Class-based dark mode gives explicit user control. `localStorage` persistence avoids flash on page reload. The provider toggles `document.documentElement.classList` between light/dark.

**Implementation pattern**:
1. `ThemeProvider` reads `localStorage('theme')` on mount
2. Applies `dark` class to `<html>` element
3. Provides `theme` state and `toggleTheme()` to children
4. Tailwind `dark:` variants handle all color switching

## R6: Card vs Table Layout

**Decision**: Card-based layout with single-column stacked list.

**Rationale**: Cards provide better visual hierarchy for tasks with mixed content (title, description, due date, status badge). Tables are better for dense tabular data but feel rigid for task management. Cards also adapt naturally to mobile viewports.

**Alternatives considered**:
- Table layout — rejected: poor mobile experience, rigid for variable content
- Kanban board — rejected: out of scope, too complex for this feature
- Two-column grid — considered but single column is cleaner and avoids layout complexity

## R7: Icon Strategy

**Decision**: Inline SVG using Heroicons patterns (already in codebase). No new dependency.

**Rationale**: The existing codebase already uses inline SVG icons in MobileNav, TaskList empty state, and dashboard header. Continuing this pattern avoids adding a dependency and keeps bundle size small.
