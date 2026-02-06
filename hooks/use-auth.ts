"use client";

import { useAuthContext } from "@/components/auth-provider";

export type { AuthUser } from "@/components/auth-provider";

export function useAuth() {
  return useAuthContext();
}
