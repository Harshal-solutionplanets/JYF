import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";

export default function RequireStaff({ children }) {
  const { user, loading, isStaff } = useAuth();

  if (loading) return null;
  //if (!user) return <Navigate to="/login" replace />;
  //if (!isStaff) return <Navigate to="/" replace />;
  return children;
}

