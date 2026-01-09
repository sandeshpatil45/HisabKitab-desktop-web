import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../utils/authService';
import Layout from './Layout';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Wrap children in Layout to provide Sidebar + Header
  return <Layout>{children}</Layout>;
};

export default ProtectedRoute;
