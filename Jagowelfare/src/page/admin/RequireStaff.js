import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";

export default function RequireStaff({ children }) {
  const { user, isStaff, loading } = useAuth();

  if (loading) return null;

  // 1. If not logged in at all, go to Admin Login
  if (!user) return <Navigate to="/admin/login" replace />;

  // 2. If logged in but NOT an admin/staff, go to home (Unauthorized)
  if (!isStaff) return <Navigate to="/" replace />;

  // 3. Authorized access
  return children;
}
