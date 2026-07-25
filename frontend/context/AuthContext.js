"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { auth } from "../lib/api";
import { tokenStore } from "../lib/http";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate the session from a stored token on mount.
  useEffect(() => {
    let active = true;
    (async () => {
      if (!tokenStore.get()) {
        setLoading(false);
        return;
      }
      try {
        const me = await auth.me();
        if (active) setUser(me);
      } catch {
        tokenStore.clear();
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const { token, user: u } = await auth.login({ email, password });
    tokenStore.set(token);
    setUser(u);
    return u;
  }, []);

  const signup = useCallback(async (name, email, password) => {
    const { token, user: u } = await auth.register({ name, email, password });
    tokenStore.set(token);
    setUser(u);
    return u;
  }, []);

  const applyToken = useCallback((token, u) => {
    tokenStore.set(token);
    setUser(u);
  }, []);

  const logout = useCallback(async () => {
    try {
      await auth.logout();
    } catch {
      /* ignore */
    }
    tokenStore.clear();
    setUser(null);
  }, []);

  const value = { user, loading, login, signup, logout, applyToken };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
