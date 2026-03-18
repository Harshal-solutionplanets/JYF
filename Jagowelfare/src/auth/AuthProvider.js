import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo(
    () => {
      const user = session?.user;
      // In Supabase, you can store roles in user_metadata or app_metadata
      const isAdmin = user?.app_metadata?.role === 'admin' || user?.user_metadata?.role === 'admin' || false;
      const isStaff = isAdmin || user?.app_metadata?.role === 'staff' || user?.user_metadata?.role === 'staff' || false;

      return {
        user,
        session,
        loading,
        isAdmin,
        isStaff
      };
    },
    [session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
