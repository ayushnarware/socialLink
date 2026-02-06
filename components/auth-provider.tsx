"use client";

import React, { createContext, useContext, useCallback, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export interface AuthUser {
  _id: string;
  email: string;
  name: string;
  role: "user" | "admin" | "super-admin";
  plan: "free" | "pro" | "business";
  avatar?: string;
  username?: string;
  bio?: string;
  websiteUrl?: string;
  socials?: Array<{ platform: string; url: string }>;
  createdAt: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  login: (email: string, password: string, signal?: AbortSignal) => Promise<any>;
  signup: (email: string, password: string, name: string, signal?: AbortSignal) => Promise<void>;
  logout: () => Promise<void>;
  mutate: (signal?: AbortSignal) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async (signal?: AbortSignal) => {
    try {
      const res = await fetch("/api/auth/me", { signal });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setError(null);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(err instanceof Error ? err : new Error("Failed to fetch user"));
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchUser(controller.signal);
    return () => controller.abort();
  }, [fetchUser]);

  const login = useCallback(
    async (email: string, password: string, signal?: AbortSignal) => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          signal,
        });

        const responseData = await res.json();

        if (!res.ok) {
          throw new Error(responseData.error || "Login failed");
        }

        await fetchUser(signal);
        return responseData;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUser]
  );

  const signup = useCallback(
    async (email: string, password: string, name: string, signal?: AbortSignal) => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
          signal,
        });

        const responseData = await res.json();

        if (!res.ok) {
          throw new Error(responseData.error || "Signup failed");
        }

        await login(email, password, signal);
      } finally {
        setIsLoading(false);
      }
    },
    [login]
  );

  const logout = useCallback(async () => {
    setUser(null);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        error,
        login,
        signup,
        logout,
        mutate: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
