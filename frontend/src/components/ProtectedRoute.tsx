import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: React.ReactElement;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<Props> = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return React.createElement(Navigate, { to: '/login', replace: true });
  if (adminOnly && user?.role !== 'admin') return React.createElement(Navigate, { to: '/dashboard', replace: true });

  return children;
};

export default ProtectedRoute;