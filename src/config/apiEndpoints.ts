export const apiEndpoints = {
  auth: {
    login: "/auth/login",
    adminLogin: "/auth/admin/login",
    me: "/auth/me",
    logout: "/auth/logout",
  },
} as const;
