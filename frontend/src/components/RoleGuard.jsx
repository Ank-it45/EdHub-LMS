import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export const RoleGuard = ({ allowedRoles = [], children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen message="Checking permissions..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const effectiveRoles = [user?.role];
  if (user?.instructorRegistered && !effectiveRoles.includes('INSTRUCTOR')) {
    effectiveRoles.push('INSTRUCTOR');
  }

  if (!allowedRoles.some((role) => effectiveRoles.includes(role))) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleGuard;
