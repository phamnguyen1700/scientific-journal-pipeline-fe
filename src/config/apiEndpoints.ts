export const apiEndpoints = {
  auth: {
    login: "/auth/login",
    adminLogin: "/auth/admin/login",
    me: "/auth/me",
    logout: "/auth/logout",
  },
  papers: {
    list: "/Paper",
    detail: (id: string) => `/Paper/${id}`,
    byAuthor: (authorId: string) => `/Paper/author/${authorId}`,
  },
} as const;
