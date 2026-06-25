"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/features/auth/services/authService";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { canAccessCms, getHomeRoute } from "@/lib/auth/roles";
import {
  clearAuth,
  getAccessToken,
  getStoredUser,
  setAccessToken,
  setStoredUser,
} from "@/lib/auth/tokenStorage";
import { useTranslation } from "@/providers/preferences-provider";
import type { User } from "@/types/api";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ accessDenied?: boolean }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const res = await authService.me();
      if (!canAccessCms(res.data)) {
        clearAuth();
        setUser(null);
        return;
      }
      setUser(res.data);
      setStoredUser(res.data);
    } catch {
      clearAuth();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const stored = getStoredUser<User>();
    if (stored && canAccessCms(stored)) {
      setUser(stored);
    }
    refreshProfile().finally(() => setIsLoading(false));
  }, [refreshProfile]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authService.login(email, password);
      const { accessToken, user: loggedInUser } = res.data;

      if (!canAccessCms(loggedInUser)) {
        return { accessDenied: true };
      }

      setAccessToken(accessToken);
      setStoredUser(loggedInUser);
      setUser(loggedInUser);
      router.push(getHomeRoute(loggedInUser.role));
      router.refresh();
      return {};
    },
    [router],
  );

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    router.push("/login");
    router.refresh();
  }, [router]);

  const value = useMemo(
    () => ({ user, isLoading, login, logout, refreshProfile }),
    [user, isLoading, login, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useLoginForm() {
  const { login } = useAuth();
  const { dict } = useTranslation();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsSubmitting(true);
    setError("");
    try {
      const result = await login(email, password);
      if (result.accessDenied) {
        setError(dict.auth.accessDenied);
        return;
      }
    } catch (err) {
      setError(getApiErrorMessage(err, dict.errors, dict.auth.invalidCredentials));
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleLogin, error, isSubmitting, setError };
}
