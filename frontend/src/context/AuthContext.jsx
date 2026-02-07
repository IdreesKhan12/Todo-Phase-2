'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from '@better-auth/react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { data: session, isPending } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending) {
      setUser(session?.user || null);
      setLoading(false);
    }
  }, [session, isPending]);

  const login = () => {
    // Better Auth handles login through its components/hooks
  };

  const logout = () => {
    // Better Auth handles logout through its components/hooks
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
