export const apiEndpoints = {
  auth: {
    login: "/Auth/login",
    adminLogin: "/Auth/login",
    me: "/Auth/me",
  },
  admin: {
    users: "/Admin/users",
    activateUser: (userId: string) => `/Admin/users/${userId}/activate`,
    deactivateUser: (userId: string) => `/Admin/users/${userId}/deactivate`,
    deleteUser: (userId: string) => `/Admin/users/${userId}`,
  },
  papers: {
    list: "/Paper",
    detail: (id: string) => `/Paper/${id}`,
    byAuthor: (authorId: string) => `/Paper/author/${authorId}`,
  },
  search: {
    papers: "/Search/papers",
  },
} as const;
