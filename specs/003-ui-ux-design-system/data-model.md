# Data Model: UI & UX Design System

**Feature**: 003-ui-ux-design-system
**Date**: 2026-02-09

> No database schema changes. This feature is frontend-only. This document describes the UI data structures and design token architecture.

## Design Token Model

### Color Tokens

| Token | Light Value | Dark Value | Usage |
|-------|------------|------------|-------|
| `--bg-primary` | `#FFFFFF` | `#111827` (gray-900) | Page background |
| `--bg-surface` | `#F9FAFB` (gray-50) | `#1F2937` (gray-800) | Content area background |
| `--bg-card` | `#FFFFFF` | `#374151` (gray-700) | Card backgrounds |
| `--text-primary` | `#111827` (gray-900) | `#F9FAFB` (gray-50) | Primary text |
| `--text-secondary` | `#6B7280` (gray-500) | `#9CA3AF` (gray-400) | Secondary text |
| `--text-muted` | `#9CA3AF` (gray-400) | `#6B7280` (gray-500) | Muted text |
| `--border-default` | `#E5E7EB` (gray-200) | `#374151` (gray-700) | Default borders |
| `--accent-primary` | `#2563EB` (blue-600) | `#3B82F6` (blue-500) | Primary actions |
| `--accent-success` | `#16A34A` (green-600) | `#22C55E` (green-500) | Completed state |
| `--accent-danger` | `#DC2626` (red-600) | `#EF4444` (red-500) | Overdue/delete |
| `--accent-warning` | `#F59E0B` (amber-500) | `#FBBF24` (amber-400) | Warning/incomplete |

### Typography Scale

| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| Page title | `text-2xl` (1.5rem) | `font-bold` (700) | "My Tasks" heading |
| Section header | `text-sm` (0.875rem) | `font-semibold` (600) | "Overdue", "Upcoming", "Completed" |
| Card title | `text-base` (1rem) | `font-medium` (500) | Task title |
| Body text | `text-sm` (0.875rem) | `font-normal` (400) | Task description |
| Label/meta | `text-xs` (0.75rem) | `font-medium` (500) | Due date, badges, counts |
| Button text | `text-sm` (0.875rem) | `font-medium` (500) | Action buttons |

### Spacing Scale

| Usage | Desktop | Mobile |
|-------|---------|--------|
| Page max-width | `max-w-3xl` (48rem) | Full width |
| Page padding | `px-6` | `px-4` |
| Section gap | `mb-8` | `mb-6` |
| Card padding | `p-4` | `p-4` |
| Card gap (between items) | `space-y-3` | `space-y-3` |
| Button padding | `px-4 py-2` | `px-4 py-2` |

## Task State Model (Frontend Logic)

```
Task State Machine:
  Input: { completed: boolean, due_date: string | null }

  if completed === true  → "completed" (green)
  if due_date < today     → "overdue"   (red)
  else                    → "upcoming"  (blue)

  Note: completed overrides overdue
```

## Theme State Model

```
Theme State:
  Storage: localStorage key "theme"
  Values: "light" | "dark"
  Default: "light"

  On mount:
    1. Read localStorage("theme")
    2. If "dark" → add class "dark" to <html>
    3. If null → default to "light"

  On toggle:
    1. Flip current value
    2. Update localStorage
    3. Update <html> class
```
