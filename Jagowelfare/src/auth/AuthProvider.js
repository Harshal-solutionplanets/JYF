import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, maybeConnectEmulators } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [claims, setClaims] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    maybeConnectEmulators();
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setClaims(null);
        setLoading(false);
        return;
      }
      const tokenResult = await u.getIdTokenResult(true);
      setClaims(tokenResult.claims || {});
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value = useMemo(
    () => ({
      user,
      claims,
      loading,
      isAdmin: !!claims?.admin,
      isStaff: !!claims?.staff || !!claims?.admin
    }),
    [user, claims, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

