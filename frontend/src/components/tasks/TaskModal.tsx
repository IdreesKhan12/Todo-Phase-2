'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
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

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editTask?: Task | null;
}

export default function TaskModal({ isOpen, onClose, onSuccess, editTask }: TaskModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditMode = !!editTask;

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description || '');
      setDueDate(editTask.due_date || '');
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
    }
    setError('');
  }, [editTask, isOpen]);

  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (dueDate && dueDate < getTodayString()) {
      setError('Due date cannot be in the past');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('better-auth-session-token');

      if (isEditMode && editTask) {
        // Update existing task
        const response = await fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.TASKS.UPDATE(editTask.user_id, editTask.id)}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: title.trim(),
              description: description.trim() || null,
              due_date: dueDate || null,
            }),
          }
        );

        if (response.ok) {
          onSuccess();
          onClose();
        } else {
          const data = await response.json();
          setError(data.detail || 'Failed to update task');
        }
      } else {
        // Create new task
        const response = await fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.TASKS.CREATE(user?.id)}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: title.trim(),
              description: description.trim() || null,
              completed: false,
              user_id: user?.id,
              due_date: dueDate || null,
            }),
          }
        );

        if (response.ok) {
          onSuccess();
          onClose();
        } else {
          const data = await response.json();
          setError(data.detail || 'Failed to create task');
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md sm:max-w-md mx-4 bg-bg-card dark:bg-bg-card rounded-xl shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-text-primary dark:text-text-primary">
              {isEditMode ? 'Edit Task' : 'Create Task'}
            </h2>
            <button
              onClick={onClose}
              className="text-text-muted dark:text-text-muted hover:text-text-primary dark:hover:text-text-primary text-xl leading-none"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="modal-title" className="block text-sm font-medium text-text-primary dark:text-text-primary mb-1">
                Title <span className="text-accent-danger dark:text-accent-danger">*</span>
              </label>
              <input
                type="text"
                id="modal-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-border-default dark:border-border-default rounded-md px-3 py-2 text-sm text-text-primary dark:text-text-primary bg-bg-primary dark:bg-bg-primary placeholder-text-muted dark:placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary dark:focus:ring-accent-primary"
                placeholder="What needs to be done?"
                disabled={loading}
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="modal-desc" className="block text-sm font-medium text-text-primary dark:text-text-primary mb-1">
                Description
              </label>
              <textarea
                id="modal-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-border-default dark:border-border-default rounded-md px-3 py-2 text-sm text-text-primary dark:text-text-primary bg-bg-primary dark:bg-bg-primary placeholder-text-muted dark:placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary dark:focus:ring-accent-primary"
                placeholder="Add details (optional)"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="modal-due" className="block text-sm font-medium text-text-primary dark:text-text-primary mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="modal-due"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={getTodayString()}
                className="w-full border border-border-default dark:border-border-default rounded-md px-3 py-2 text-sm text-text-primary dark:text-text-primary bg-bg-primary dark:bg-bg-primary focus:outline-none focus:ring-2 focus:ring-accent-primary dark:focus:ring-accent-primary"
                disabled={loading}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-text-secondary dark:text-text-secondary hover:text-text-primary dark:hover:text-text-primary disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-accent-primary dark:bg-accent-primary rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Task' : 'Create Task')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
