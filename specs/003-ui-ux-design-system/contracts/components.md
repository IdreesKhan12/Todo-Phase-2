# Component Contracts: UI & UX Design System

**Feature**: 003-ui-ux-design-system
**Date**: 2026-02-09

> No API contract changes. All existing endpoints remain unchanged. This document defines the frontend component interface contracts.

## ThemeProvider

**File**: `frontend/src/context/ThemeContext.tsx`
**Type**: React Context Provider

```
Props: { children: ReactNode }
Provides: { theme: "light" | "dark", toggleTheme: () => void }
Side effects: Reads/writes localStorage("theme"), toggles "dark" class on <html>
```

## TaskModal

**File**: `frontend/src/components/tasks/TaskModal.tsx`
**Type**: Modal dialog component

```
Props: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editTask?: Task | null  // null = create mode, Task = edit mode
}

Behavior:
  - Create mode: empty form, POST to /api/{userId}/tasks
  - Edit mode: pre-filled form, PUT to /api/{userId}/tasks/{taskId}
  - Due date input: min=today, native date picker
  - Closes on backdrop click, Cancel button, or successful submit
  - Shows error messages inline
  - Auto-focuses title input on open
```

## TaskItem

**File**: `frontend/src/components/tasks/TaskItem.tsx`
**Type**: Task card with expandable actions

```
Props: {
  task: Task
  onTaskUpdated: () => void
  onTaskDeleted: () => void
  onEditTask: (task: Task) => void
}

Visual states:
  - upcoming: blue-left-border, normal opacity
  - overdue: red-left-border, red due-date text
  - completed: green-left-border, 60% opacity, strikethrough title

Interaction:
  - Click card → expand/collapse action bar
  - Action bar contains: Mark Complete/Incomplete, Update Task, Delete Task
  - Delete requires confirmation dialog
  - All buttons show loading state during API calls
```

## TaskList

**File**: `frontend/src/components/tasks/TaskList.tsx`
**Type**: Grouped task list with section headers

```
Props: {
  tasks: Task[]
  onTaskUpdated: () => void
  onTaskDeleted: () => void
  onEditTask: (task: Task) => void
}

Sections (rendered in order):
  1. Overdue (red dot, hidden if count=0)
  2. Upcoming (blue dot, hidden if count=0)
  3. Completed (green dot, hidden if count=0)

Sorting:
  - Overdue: oldest due date first
  - Upcoming: nearest due date first, no-date tasks last
  - Completed: most recently updated first

Empty state: centered message with clipboard icon
```

## Navbar

**File**: Inline in `dashboard/page.tsx` (existing)
**Type**: Top navigation bar

```
Elements:
  - App name ("Task Manager")
  - ThemeToggle button (sun/moon icon)
  - User email display
  - Logout button
  - MobileNav (hamburger) for <768px viewports
```
