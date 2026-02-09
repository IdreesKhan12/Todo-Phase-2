'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  React.useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to Todo App
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to manage your tasks
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!isAuthenticated ? (
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => router.push('/login')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer" onClick={() => router.push('/login')}>
                  Sign up
                </span>
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg text-gray-700">Redirecting to dashboard...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
