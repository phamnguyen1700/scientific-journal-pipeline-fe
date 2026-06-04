import { create } from "zustand";

import { env } from "@/config/env";
import type { AuthUser } from "@/types/auth";

const authUserStorageKey = "authUser";

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (payload: { user: AuthUser; token: string }) => void;
  clearAuth: () => void;
};

function readStoredToken() {
  if (typeof window === "undefined") return null;

  return window.localStorage.getItem(env.authTokenStorageKey);
}

function readStoredUser() {
  if (typeof window === "undefined") return null;

  const rawUser = window.localStorage.getItem(authUserStorageKey);
  if (!rawUser) return null;

  try {
    const user = JSON.parse(rawUser) as Partial<AuthUser>;

    if (typeof user.roleName !== "string") {
      window.localStorage.removeItem(authUserStorageKey);
      window.localStorage.removeItem(env.authTokenStorageKey);
      return null;
    }

    return user as AuthUser;
  } catch {
    window.localStorage.removeItem(authUserStorageKey);
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: readStoredUser(),
  token: readStoredToken(),
  isAuthenticated: Boolean(readStoredToken()),
  setAuth: ({ user, token }) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(env.authTokenStorageKey, token);
      window.localStorage.setItem(authUserStorageKey, JSON.stringify(user));
    }

    set({ user, token, isAuthenticated: true });
  },
  clearAuth: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(env.authTokenStorageKey);
      window.localStorage.removeItem(authUserStorageKey);
    }

    set({ user: null, token: null, isAuthenticated: false });
  },
}));
