# Quickstart: UI & UX Design System

**Feature**: 003-ui-ux-design-system
**Branch**: `003-ui-ux-design-system`

## Prerequisites

- Node.js 18+ (for Next.js frontend)
- Backend running on port 8001 (FastAPI + Neon PostgreSQL)
- Frontend running on port 3000

## Setup

```bash
# Checkout feature branch
git checkout 003-ui-ux-design-system

# Install frontend dependencies (if any new ones added)
cd frontend && npm install

# Start backend (separate terminal)
cd backend && source venv/bin/activate
python -m uvicorn src.api.main:app --host 0.0.0.0 --port 8001 --reload

# Start frontend (separate terminal)
cd frontend && npm run dev
```

## What Changes

### Files Modified
1. `frontend/tailwind.config.js` — Add dark mode support, Inter font, color tokens
2. `frontend/src/styles/globals.css` — Design tokens (CSS variables), dark mode styles
3. `frontend/src/app/layout.tsx` — Inter font loader, ThemeProvider wrapper
4. `frontend/src/app/login/page.tsx` — Polished auth page with dark mode support
5. `frontend/src/app/dashboard/page.tsx` — Redesigned dashboard with theme toggle
6. `frontend/src/components/tasks/TaskModal.tsx` — Styled modal with dark mode
7. `frontend/src/components/tasks/TaskItem.tsx` — Styled task cards with dark mode
8. `frontend/src/components/tasks/TaskList.tsx` — Styled sections with dark mode
9. `frontend/src/components/ui/MobileNav.tsx` — Dark mode support

### Files Created
1. `frontend/src/context/ThemeContext.tsx` — Theme provider with localStorage persistence

### Files NOT Changed
- All backend files (no API/schema changes)
- `frontend/src/context/AuthContext.jsx` (auth logic untouched)
- `frontend/src/config/api.js` (API config untouched)

## Verification

1. Open `http://localhost:3000` — login page should show polished design
2. Sign in — dashboard should show "Task Manager" header with theme toggle
3. Click sun/moon icon — theme should toggle between light and dark
4. Create a task with due date — card should show blue "Upcoming" badge
5. Create a task with past due date (via API) — card should show red "Overdue" badge
6. Mark a task complete — card should show green "Completed" badge, muted style
7. Resize to mobile width — layout should adapt cleanly

## Implementation Order

1. Design tokens + Tailwind config (foundation)
2. ThemeProvider + layout.tsx (theme infrastructure)
3. globals.css rewrite (token application)
4. Login page polish (first visual output)
5. Dashboard page + Navbar (main surface)
6. TaskItem + TaskList (task visuals)
7. TaskModal (interaction polish)
8. MobileNav (responsive)
