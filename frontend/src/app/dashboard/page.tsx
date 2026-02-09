'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import MobileNav from '@/components/ui/MobileNav';
import TaskList from '@/components/tasks/TaskList';
import TaskModal from '@/components/tasks/TaskModal';
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

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (user) loadTasks();
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;
    try {
      setLoadingTasks(true);
      setError('');
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.TASKS.LIST(user.id)}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('better-auth-session-token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.ok) {
        setTasks(await response.json());
      } else {
        setError('Failed to load tasks');
      }
    } catch (err) {
      setError('Error loading tasks');
      console.error(err);
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  // Task summary counts
  const today = new Date().toISOString().split('T')[0];
  const overdueCount = tasks.filter(t => !t.completed && t.due_date && t.due_date < today).length;
  const upcomingCount = tasks.filter(t => !t.completed && (!t.due_date || t.due_date >= today)).length;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-bg-primary dark:bg-bg-primary">
        {/* Navigation */}
        <nav className="bg-bg-surface dark:bg-bg-surface shadow-sm border-b border-border-default dark:border-border-default">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-14">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-text-primary dark:text-text-primary">Task Manager</h1>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={toggleTheme}
                  className="p-2 text-text-secondary dark:text-text-secondary hover:text-text-primary dark:hover:text-text-primary rounded-md"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </button>
                <span className="text-sm text-text-secondary dark:text-text-secondary">{user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-sm font-medium text-text-primary dark:text-text-primary hover:bg-accent-danger dark:hover:bg-accent-danger hover:text-white rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
              <MobileNav userEmail={user?.email} onLogout={handleLogout} />
            </div>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto py-6 px-4 md:px-6">
          {/* Header with Create Task button */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-text-primary dark:text-text-primary">My Tasks</h2>
              {tasks.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-2">
                  {overdueCount > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      <span className="text-xs font-medium text-text-secondary dark:text-text-secondary">
                        {overdueCount} overdue
                      </span>
                    </div>
                  )}
                  {upcomingCount > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span className="text-xs font-medium text-text-secondary dark:text-text-secondary">
                        {upcomingCount} upcoming
                      </span>
                    </div>
                  )}
                  {completedCount > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-xs font-medium text-text-secondary dark:text-text-secondary">
                        {completedCount} completed
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={openCreateModal}
              className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[44px] text-sm font-medium text-white bg-accent-primary dark:bg-accent-primary rounded-lg hover:opacity-90 shadow-sm transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Task
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Task list */}
          {loadingTasks ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-text-muted dark:text-text-muted">Loading tasks...</p>
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              onTaskUpdated={loadTasks}
              onTaskDeleted={loadTasks}
              onEditTask={openEditModal}
            />
          )}
        </main>

        {/* Modal for Create / Edit */}
        <TaskModal
          isOpen={showModal}
          onClose={closeModal}
          onSuccess={loadTasks}
          editTask={editingTask}
        />
      </div>
    </ProtectedRoute>
  );
}
