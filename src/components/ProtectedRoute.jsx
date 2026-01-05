import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false, userOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  // Prevent admins from accessing user-only routes (like dashboard)
  if (userOnly && user.role === 'admin') return <Navigate to="/admin" replace />;
  
  // Prevent users from accessing admin-only routes
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  
  return children;
};

export default ProtectedRoute; 