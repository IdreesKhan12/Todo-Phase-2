'use client';

import React, { useState } from 'react';
import { API_CONFIG } from '@/config/api';

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

type TaskState = 'upcoming' | 'overdue' | 'completed';

interface TaskItemProps {
  task: Task;
  onTaskUpdated: () => void;
  onTaskDeleted: () => void;
  onEditTask: (task: Task) => void;
}

function getTaskState(task: Task): TaskState {
  if (task.completed) return 'completed';
  if (task.due_date) {
    const today = new Date().toISOString().split('T')[0];
    if (task.due_date < today) return 'overdue';
  }
  return 'upcoming';
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function TaskItem({ task, onTaskUpdated, onTaskDeleted, onEditTask }: TaskItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const state = getTaskState(task);
  const token = typeof window !== 'undefined' ? localStorage.getItem('better-auth-session-token') : '';

  const toggleCompletion = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsToggling(true);
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.TASKS.TOGGLE(task.user_id, task.id)}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ completed: !task.completed }),
        }
      );
      if (response.ok) onTaskUpdated();
    } catch (error) {
      console.error('Error toggling task:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const deleteTask = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.TASKS.DELETE(task.user_id, task.id)}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.ok) onTaskDeleted();
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Visual styling per state
  const borderColor = state === 'overdue' ? 'border-l-red-500' :
                      state === 'completed' ? 'border-l-green-500' :
                      'border-l-blue-500';

  const cardOpacity = state === 'completed' ? 'opacity-60' : '';

  const stateBadge = state === 'overdue' ? (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
      Overdue
    </span>
  ) : state === 'completed' ? (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
      Completed
    </span>
  ) : (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
      Upcoming
    </span>
  );

  return (
    <li
      className={`bg-bg-card dark:bg-bg-card rounded-lg shadow-sm border border-border-default dark:border-border-default border-l-4 ${borderColor} ${cardOpacity} cursor-pointer hover:shadow-md transition-shadow`}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Main row */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className={`text-base font-medium truncate ${
                state === 'completed' ? 'line-through text-text-muted dark:text-text-muted' : 'text-text-primary dark:text-text-primary'
              }`}>
                {task.title}
              </p>
              {stateBadge}
            </div>

            {task.description && (
              <p className={`text-sm mt-1 line-clamp-2 ${
                state === 'completed' ? 'text-text-muted dark:text-text-muted' : 'text-text-secondary dark:text-text-secondary'
              }`}>
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-3 mt-2 text-xs font-medium">
              {task.due_date && (
                <span className={state === 'overdue' ? 'text-red-500 dark:text-red-400 font-medium' : 'text-text-secondary dark:text-text-secondary'}>
                  Due: {formatDate(task.due_date)}
                </span>
              )}
              {!task.due_date && (
                <span className="text-text-muted dark:text-text-muted">No due date</span>
              )}
            </div>
          </div>

          {/* Expand indicator */}
          <svg
            className={`w-5 h-5 text-text-muted dark:text-text-muted flex-shrink-0 ml-2 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded actions */}
      {expanded && (
        <div className="border-t border-border-default dark:border-border-default px-4 pt-3 pb-3 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={toggleCompletion}
            disabled={isToggling}
            className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded ${
              task.completed
                ? 'text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                : 'text-white bg-accent-success dark:bg-accent-success hover:opacity-90'
            } disabled:opacity-50 transition-opacity`}
          >
            {isToggling ? (task.completed ? 'Completing...' : 'Completing...') : task.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onEditTask(task); }}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded text-white bg-accent-primary dark:bg-accent-primary hover:opacity-90 transition-opacity"
          >
            Update Task
          </button>

          <button
            onClick={deleteTask}
            disabled={isDeleting}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded text-white bg-accent-danger dark:bg-accent-danger hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isDeleting ? 'Deleting...' : 'Delete Task'}
          </button>
        </div>
      )}
    </li>
  );
}
