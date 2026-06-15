"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminUsersService } from "@/service/admin";
import type { AdminUser, AdminUserApiModel, AdminUsersApiResponse } from "@/types/admin";

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

function normalizeAdminUsersResponse(response: AdminUsersApiResponse): AdminUser[] {
  if (!response.succeeded) {
    throw new Error(response.errors.join(", ") || "Unable to load users.");
  }

  return response.result.map(mapAdminUser);
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
