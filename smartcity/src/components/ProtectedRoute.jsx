import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../services/authService';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isUserAuthenticated = isAuthenticated();
  const userRole = getUserRole();

  if (!isUserAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    switch (userRole) {
      case 'admin':
        return <Navigate to="/da" replace />;
      case 'analyst':
        return <Navigate to="/dl" replace />;
      case 'technicien':
        return <Navigate to="/technicien" replace />;
      default:
        return <Navigate to="/auth" replace />;
    }
  }

  return children;
};

export default ProtectedRoute; 