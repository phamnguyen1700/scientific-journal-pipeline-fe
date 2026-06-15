import { apiEndpoints } from "@/config/apiEndpoints";
import { get } from "@/service/apiClient";
import type { AdminUsersApiResponse } from "@/types/admin";

export const getAdminUsersService = () =>
  get<AdminUsersApiResponse>(apiEndpoints.admin.users);

export const adminService = {
  users: getAdminUsersService,
};
