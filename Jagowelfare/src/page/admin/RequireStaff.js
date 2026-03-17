import { useAuth } from "../../auth/AuthProvider";

export default function RequireStaff({ children }) {
  const { loading } = useAuth();

  if (loading) return null;
  //if (!user) return <Navigate to="/login" replace />;
  //if (!isStaff) return <Navigate to="/" replace />;
  return children;
}

