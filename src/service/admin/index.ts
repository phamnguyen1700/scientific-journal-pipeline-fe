import { apiEndpoints } from "@/config/apiEndpoints";
import { deleteRequest, get, put } from "@/service/apiClient";
import type {
  AdminDashboardApiResponse,
  AdminDashboardApiStatus,
  AdminDashboardApiCalls,
  AdminUserActionApiResponse,
  AdminUsersApiResponse,
} from "@/types/admin";

type AdminDashboardApiStatusResponse = {
  succeeded: boolean;
  result: AdminDashboardApiStatus[];
  errors: string[];
};

type AdminDashboardApiCallsResponse = {
  succeeded: boolean;
  result: AdminDashboardApiCalls;
  errors: string[];
};

export const getAdminDashboardService = () =>
  get<AdminDashboardApiResponse>(apiEndpoints.admin.dashboard);

export const getAdminDashboardApiStatusService = () =>
  get<AdminDashboardApiStatusResponse>(apiEndpoints.admin.dashboardApiStatus);

export const getAdminDashboardApiCallsService = () =>
  get<AdminDashboardApiCallsResponse>(apiEndpoints.admin.dashboardApiCalls);

export const getAdminUsersService = (page = 1, size = 10) =>
  get<AdminUsersApiResponse>(apiEndpoints.admin.users, {
    params: { page, size },
  });

export const activateAdminUserService = (userId: string) =>
  put<AdminUserActionApiResponse>(apiEndpoints.admin.activateUser(userId));

export const deactivateAdminUserService = (userId: string) =>
  put<AdminUserActionApiResponse>(apiEndpoints.admin.deactivateUser(userId));

export const deleteAdminUserService = (userId: string) =>
  deleteRequest<AdminUserActionApiResponse>(apiEndpoints.admin.deleteUser(userId));

export const adminService = {
  dashboard: getAdminDashboardService,
  dashboardApiStatus: getAdminDashboardApiStatusService,
  dashboardApiCalls: getAdminDashboardApiCallsService,
  users: getAdminUsersService,
  activateUser: activateAdminUserService,
  deactivateUser: deactivateAdminUserService,
  deleteUser: deleteAdminUserService,
};
