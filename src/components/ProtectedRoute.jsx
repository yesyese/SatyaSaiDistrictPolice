// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

/**
 * A wrapper component for routes that require authentication.
 * If the user is not authenticated, they are redirected to the login page.
 */
function ProtectedRoute({ isAuthenticated }) {
  if (!isAuthenticated) {
    //toast.info('Please log in to access this page.');
    return <Navigate to="/login" replace />;
  }
  return <Outlet />; // Renders the child route components
}

export default ProtectedRoute;
