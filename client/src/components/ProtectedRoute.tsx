import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireDeveloper?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = false,
  requireDeveloper = false,
  redirectTo = '/'
}) => {
  const { user, isAuthenticated, isDeveloper, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If developer access is required but user is not a developer
  if (requireDeveloper && !isDeveloper) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If user is authenticated but trying to access auth pages, redirect to appropriate dashboard
  if (isAuthenticated) {
    if (location.pathname === '/login' || location.pathname === '/signup') {
      return <Navigate to="/home" replace />;
    }
    if (location.pathname === '/admin/login' && isDeveloper) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute; 