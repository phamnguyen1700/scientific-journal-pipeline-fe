"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  loginService,
  registerService,
  resendConfirmationCodeService,
  verifyRegistrationService,
} from "@/service/auth";
import { useAuthStore } from "@/store/auth";
import {
  mapLoginResultToUser,
  normalizeBackendResponse,
  type AuthUser,
  type ILoginRequest,
  type RegisterPayload,
  type ResendConfirmationCodePayload,
  type VerifyRegistrationPayload,
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

export function useRegister() {
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const response = normalizeBackendResponse(await registerService(payload));

      if (!response.succeeded) {
        throw new Error(response.errors.join(", ") || "Unable to register.");
      }

      return response.result;
    },
  });
}

export function useVerifyRegistration() {
  return useMutation({
    mutationFn: async (payload: VerifyRegistrationPayload) => {
      const response = normalizeBackendResponse(
        await verifyRegistrationService(payload),
      );

      if (!response.succeeded) {
        throw new Error(
          response.errors.join(", ") || "Unable to verify registration.",
        );
      }

      return response.result;
    },
  });
}

export function useResendConfirmationCode() {
  return useMutation({
    mutationFn: async (payload: ResendConfirmationCodePayload) => {
      const response = normalizeBackendResponse(
        await resendConfirmationCodeService(payload),
      );

      if (!response.succeeded) {
        throw new Error(
          response.errors.join(", ") || "Unable to resend confirmation code.",
        );
      }

      return response.result;
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
