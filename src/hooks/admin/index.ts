"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  activateAdminUserService,
  deactivateAdminUserService,
  deleteAdminUserService,
  getAdminUsersService,
} from "@/service/admin";
import type {
  AdminUser,
  AdminUserActionApiResponse,
  AdminUserApiModel,
  AdminUsersApiResponse,
} from "@/types/admin";

export const adminQueryKeys = {
  all: ["admin"] as const,
  users: () => [...adminQueryKeys.all, "users"] as const,
};

export function useAdminUsers() {
  const query = useQuery({
    queryKey: adminQueryKeys.users(),
    queryFn: async () => normalizeAdminUsersResponse(await getAdminUsersService()),
  });

  return {
    ...query,
    users: query.data ?? [],
    loading: query.isPending,
    error: getErrorMessage(query.error),
  };
}

export function useActivateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) =>
      normalizeAdminUserActionResponse(await activateAdminUserService(userId)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() });
    },
  });
}

export function useDeactivateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) =>
      normalizeAdminUserActionResponse(await deactivateAdminUserService(userId)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() });
    },
  });
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) =>
      normalizeAdminUserActionResponse(await deleteAdminUserService(userId)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() });
    },
  });
}

function normalizeAdminUsersResponse(response: AdminUsersApiResponse): AdminUser[] {
  if (!response.succeeded) {
    throw new Error(response.errors.join(", ") || "Unable to load users.");
  }

  return response.result.map(mapAdminUser);
}

function normalizeAdminUserActionResponse(response?: AdminUserActionApiResponse) {
  if (!response) {
    return response;
  }

  if (response.succeeded === false) {
    throw new Error(response.errors?.join(", ") || response.message || "Unable to update user.");
  }

  return response;
}

function mapAdminUser(user: AdminUserApiModel): AdminUser {
  return {
    id: user.userId,
    name: user.username,
    email: user.email,
    phonenumber: user.phonenumber,
    role: user.roleName,
    status: user.isActive ? "Active" : "Suspended",
    joined: "-",
    papers: 0,
  };
}

function getErrorMessage(error: unknown) {
  if (!error) return null;

  return error instanceof Error
    ? error.message
    : "Unable to connect to the admin user service.";
}
