import type { UserRole } from "@/types/role";

// User Management Types
export type UserStatus = "Active" | "Pending" | "Suspended";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phonenumber?: string;
  role: UserRole;
  status: UserStatus;
  joined: string;
  papers: number;
};

export type AdminUserApiModel = {
  userId: string;
  username: string;
  email: string;
  phonenumber?: string;
  roleName: UserRole;
  isActive: boolean;
  createdAt?: string;
};

export type AdminUsersResult = {
  total: number;
  page: number;
  size: number;
  results: AdminUserApiModel[];
};

export type AdminUsersApiResponse = {
  succeeded: boolean;
  result: AdminUserApiModel[] | AdminUsersResult;
  errors: string[];
};

export type AdminUserActionApiResponse = {
  succeeded?: boolean;
  result?: unknown;
  errors?: string[];
  message?: string;
};

export type UserStats = {
  total: number;
  students: number;
  researchers: number;
  suspended: number;
};

// API Management Types
export type ApiStatus = "Connected" | "Degraded" | "Error";

export type ManagedApi = {
  id: string;
  name: string;
  description: string;
  key: string;
  status: ApiStatus;
  lastSync: string;
  callsToday: number;
  callsLimit: number;
  enabled: boolean;
  latency: string;
};

export type ApiStats = {
  connectedApis: number;
  totalCallsToday: number;
  degraded: number;
  avgLatency: string;
};

// System Config Types
export type SystemConfig = {
  general: {
    appName: string;
    appUrl: string;
    maxUsers: number;
    defaultLanguage: string;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    emailAlerts: boolean;
    weeklyDigest: boolean;
  };
  security: {
    twoFactor: boolean;
    ipWhitelist: boolean;
    sessionTimeout: number;
    passwordPolicy: "Standard" | "Strong" | "Enterprise";
  };
  notifications: {
    pushNotifs: boolean;
    paperAlerts: boolean;
    citationAlerts: boolean;
  };
};

// Dashboard Types
export type AdminDashboardSummary = {
  totalUsers: number;
  activeUsers: number;
  deactivatedUsers: number;
  researchers: number;
  students: number;
  lecturers: number;
  systemAdministrators: number;
  newUsersThisWeek: number;
  newResearchersThisMonth: number;
  apisConnected: number;
  degradedApis: number;
};

export type UserGrowthData = {
  month: string;
  totalUsers: number;
  students: number;
  researchers: number;
  lecturers: number;
  systemAdministrators: number;
};

export type ApiUsageData = {
  month: string;
  calls: number;
};

export type AdminDashboardApiStatus = {
  name: string;
  baseUrl: string;
  status: "Operational" | "Degraded" | "Down";
  latencyMs: number;
  checkedAt: string;
  message: string;
};

export type AdminDashboardRoleBreakdown = {
  roleName: UserRole;
  count: number;
};

export type AdminDashboardRecentUser = {
  userId: string;
  username: string;
  email: string;
  roleName: UserRole;
  isActive: boolean;
  registeredAt: string;
};

export type AdminDashboardApiCalls = {
  trackingEnabled: boolean;
  message: string;
  dataPoints: ApiUsageData[];
};

export type AdminDashboardResult = {
  summary: AdminDashboardSummary;
  userRoleBreakdown: AdminDashboardRoleBreakdown[];
  userGrowth: UserGrowthData[];
  recentUsers: AdminDashboardRecentUser[];
  apiStatuses: AdminDashboardApiStatus[];
  apiCalls: AdminDashboardApiCalls;
};

export type AdminDashboardApiResponse = {
  succeeded: boolean;
  result: AdminDashboardResult;
  errors: string[];
};

