'use client';

import React from 'react';
import TaskItem from './TaskItem';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  due_date?: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface TaskListProps {
  tasks: Task[];
  onTaskUpdated: () => void;
  onTaskDeleted: () => void;
  onEditTask: (task: Task) => void;
}

function categorize(tasks: Task[]) {
  const today = new Date().toISOString().split('T')[0];
  const overdue: Task[] = [];
  const upcoming: Task[] = [];
  const completed: Task[] = [];

  for (const task of tasks) {
    if (task.completed) {
      completed.push(task);
    } else if (task.due_date && task.due_date < today) {
      overdue.push(task);
    } else {
      upcoming.push(task);
    }
  }

  // Sort overdue: oldest first
  overdue.sort((a, b) => (a.due_date || '').localeCompare(b.due_date || ''));
  // Sort upcoming: nearest due first, no-date at end
  upcoming.sort((a, b) => {
    if (!a.due_date && !b.due_date) return 0;
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return a.due_date.localeCompare(b.due_date);
  });
  // Sort completed: most recently updated first
  completed.sort((a, b) => b.updated_at.localeCompare(a.updated_at));

  return { overdue, upcoming, completed };
}

function Section({ title, count, color, children }: {
  title: string;
  count: number;
  color: string;
  children: React.ReactNode;
}) {
  if (count === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <h3 className="text-sm font-semibold text-text-primary dark:text-text-primary uppercase tracking-wide">
          {title}
        </h3>
        <span className="text-xs text-text-secondary dark:text-text-secondary">({count})</span>
      </div>
      <ul className="space-y-3">
        {children}
      </ul>
    </div>
  );
}

export default function TaskList({ tasks, onTaskUpdated, onTaskDeleted, onEditTask }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="mx-auto h-12 w-12 text-text-muted dark:text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-3 text-lg font-medium text-text-secondary dark:text-text-secondary">No tasks yet</h3>
        <p className="mt-1 text-sm text-text-muted dark:text-text-muted">Click &quot;Create Task&quot; to get started.</p>
      </div>
    );
  }

  const { overdue, upcoming, completed } = categorize(tasks);

  return (
    <div>
      <Section title="Overdue" count={overdue.length} color="bg-red-500">
        {overdue.map((task) => (
          <TaskItem key={task.id} task={task} onTaskUpdated={onTaskUpdated} onTaskDeleted={onTaskDeleted} onEditTask={onEditTask} />
        ))}
      </Section>

      <Section title="Upcoming" count={upcoming.length} color="bg-blue-500">
        {upcoming.map((task) => (
          <TaskItem key={task.id} task={task} onTaskUpdated={onTaskUpdated} onTaskDeleted={onTaskDeleted} onEditTask={onEditTask} />
        ))}
      </Section>

      <Section title="Completed" count={completed.length} color="bg-green-500">
        {completed.map((task) => (
          <TaskItem key={task.id} task={task} onTaskUpdated={onTaskUpdated} onTaskDeleted={onTaskDeleted} onEditTask={onEditTask} />
        ))}
      </Section>
    </div>
  );
}
