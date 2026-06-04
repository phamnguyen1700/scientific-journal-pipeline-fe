import type { UserRole } from "@/types/role";

// User Management Types
export type UserStatus = "Active" | "Pending" | "Suspended";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joined: string;
  papers: number;
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
export type DashboardStats = {
  totalUsers: number;
  researchers: number;
  apisConnected: number;
  systemHealth: number;
};

export type UserGrowthData = {
  month: string;
  students: number;
  researchers: number;
  admins: number;
};

export type ApiUsageData = {
  month: string;
  calls: number;
};

export type ApiStatusItem = {
  name: string;
  status: ApiStatus;
  latency: string;
  calls: number;
};

