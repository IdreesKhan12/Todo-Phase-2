'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [isLogin, setIsLogin] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(email, password);

        if (result.success) {
          router.push('/dashboard');
        } else {
          setError(result.error || 'Login failed');
        }
      } else {
        const result = await signup(email, password, name);

        if (result.success) {
          router.push('/dashboard');
        } else {
          setError(result.error || 'Signup failed');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary dark:bg-bg-primary flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary dark:text-text-primary">
          {isLogin ? 'Sign in to your account' : 'Create a new account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-bg-card dark:bg-bg-card py-8 px-4 shadow-lg rounded-xl sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-primary dark:text-text-primary">
                  Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required={!isLogin}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-border-default dark:border-border-default rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-text-primary dark:text-text-primary bg-bg-primary dark:bg-bg-primary focus:outline-none focus:ring-2 focus:ring-accent-primary dark:focus:ring-accent-primary sm:text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary dark:text-text-primary">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-border-default dark:border-border-default rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-text-primary dark:text-text-primary bg-bg-primary dark:bg-bg-primary focus:outline-none focus:ring-2 focus:ring-accent-primary dark:focus:ring-accent-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary dark:text-text-primary">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-border-default dark:border-border-default rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-text-primary dark:text-text-primary bg-bg-primary dark:bg-bg-primary focus:outline-none focus:ring-2 focus:ring-accent-primary dark:focus:ring-accent-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-primary dark:bg-accent-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary dark:focus:ring-accent-primary disabled:opacity-50 transition-opacity"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Sign up')}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-sm text-text-secondary dark:text-text-secondary hover:text-accent-primary dark:hover:text-accent-primary"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
