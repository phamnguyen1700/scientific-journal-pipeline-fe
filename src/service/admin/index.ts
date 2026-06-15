import { apiEndpoints } from "@/config/apiEndpoints";
import { deleteRequest, get, put } from "@/service/apiClient";
import type { AdminUserActionApiResponse, AdminUsersApiResponse } from "@/types/admin";

export const getAdminUsersService = () =>
  get<AdminUsersApiResponse>(apiEndpoints.admin.users);

export const activateAdminUserService = (userId: string) =>
  put<AdminUserActionApiResponse>(apiEndpoints.admin.activateUser(userId));

export const deactivateAdminUserService = (userId: string) =>
  put<AdminUserActionApiResponse>(apiEndpoints.admin.deactivateUser(userId));

export const deleteAdminUserService = (userId: string) =>
  deleteRequest<AdminUserActionApiResponse>(apiEndpoints.admin.deleteUser(userId));

export const adminService = {
  users: getAdminUsersService,
  activateUser: activateAdminUserService,
  deactivateUser: deactivateAdminUserService,
  deleteUser: deleteAdminUserService,
};
