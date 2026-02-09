import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    router.push('/login');
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
