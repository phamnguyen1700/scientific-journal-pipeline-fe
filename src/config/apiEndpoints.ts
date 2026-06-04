export const apiEndpoints = {
  auth: {
    login: "/Auth/login",
    adminLogin: "/Auth/login",
    me: "/User/profile",
    logout: "/Auth/logout",
  },
  papers: {
    list: "/Paper",
    detail: (id: string) => `/Paper/${id}`,
    byAuthor: (authorId: string) => `/Paper/author/${authorId}`,
  },
} as const;
