import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const userData = useSelector((s) => s.user.userData);
  const location = useLocation();

  if (!userData) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return children;
}
