import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // const hasAccess = user && allowedRoles.includes(user.role);

  // if (!hasAccess) {
  //   // Smart redirection based on role for unauthorized access
  //   if (user.role === 'superadmin') {
  //     return <Navigate to="/superadmin" replace />;
  //   }
  //   if (user.role === 'admin') {
  //     return <Navigate to="/admin" replace />;
  //   }
  //   // For any other unauthorized user, redirect to home
  //   return <Navigate to="/" replace />;
  // }

  return children;
};

export default ProtectedRoute;