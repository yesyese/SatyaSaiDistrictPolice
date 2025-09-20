// src/components/SuperAdminRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

/**
 * A wrapper component for routes that require SuperAdmin role.
 * Assumes the user is already authenticated.
 * If the user is not a SuperAdmin, they are redirected to the dashboard.
 */
function SuperAdminRoute({ user }) {
  // Ensure user is not null and has a role property
  if (!user || user.role !== 'SuperAdmin') {
    toast.error('You do not have permission to access this page.');
    return <Navigate to="/dashboard" replace />; // Redirect to dashboard
  }
  return <Outlet />; // Renders the child route components
}

export default SuperAdminRoute;
