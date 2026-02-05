"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

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

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch user"));
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Login failed");
      }

      await fetchUser();
      router.push("/dashboard");
      return responseData;
    },
    [fetchUser, router]
  );

  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Signup failed");
      }

      // Automatically log in the user after successful signup
      await login(email, password);
    },
    [login]
  );

  const logout = useCallback(async () => {
    setUser(null);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }, [router]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    error,
    login,
    signup,
    logout,
    mutate: fetchUser,
  };
}
