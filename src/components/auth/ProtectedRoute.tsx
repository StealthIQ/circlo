
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login',
  requireAdmin = false
}) => {
  const { isAuthenticated, isLoading, user, profile } = useAuth();
  const location = useLocation();

  // Check if user is admin when required
  const isAdmin = profile?.isAdmin || false;
  const hasAccess = requireAdmin ? (isAuthenticated && isAdmin) : isAuthenticated;

  if (isLoading) {
    // Show a loading spinner or skeleton while checking auth status
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  if (requireAdmin && !isAdmin) {
    // Redirect to home if admin access is required but user is not admin
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};
