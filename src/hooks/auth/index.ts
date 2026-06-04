"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { loginService } from "@/service/auth";
import { useAuthStore } from "@/store/auth";
import {
  mapLoginResultToUser,
  normalizeBackendResponse,
  type AuthUser,
  type ILoginRequest,
} from "@/types/auth";

type UseLoginResult = {
  user: AuthUser;
  token: string;
};

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (payload: ILoginRequest): Promise<UseLoginResult> => {
      const response = normalizeBackendResponse(await loginService(payload));

      if (!response.succeeded || !response.result) {
        throw new Error(response.errors.join(", ") || "Unable to sign in.");
      }

      const user = mapLoginResultToUser(response.result);
      const token = response.result.token;

      setAuth({ user, token });

      return { user, token };
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return () => {
    void queryClient.cancelQueries();
    queryClient.clear();
    clearAuth();
    router.replace("/login");
  };
}
