'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import ProtectedRoute from '@/src/components/auth/ProtectedRoute';
import MobileNav from '@/src/components/ui/MobileNav';
import TaskList from '@/src/components/tasks/TaskList';
import TaskForm from '@/src/components/tasks/TaskForm';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [error, setError] = useState('');

  // Load tasks when authenticated
  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;

    try {
      setLoadingTasks(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user.id}/tasks`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('better-auth-session-token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">Todo Dashboard</h1>
              </div>

              {/* Desktop navigation */}
              <div className="hidden md:flex items-center">
                <span className="text-sm text-gray-700 mr-4">Welcome, {user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="ml-4 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </div>

              {/* Mobile navigation */}
              <MobileNav userEmail={user?.email} onLogout={handleLogout} />
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="pb-5 mb-5 border-b border-gray-200">
              <h2 className="text-2xl font-bold leading-6 text-gray-900">My Tasks</h2>
            </div>

            <TaskForm onTaskCreated={loadTasks} />

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {loadingTasks ? (
              <div className="flex justify-center items-center h-32">
                <p>Loading tasks...</p>
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                onTaskUpdated={loadTasks}
                onTaskDeleted={loadTasks}
              />
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
