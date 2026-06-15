export const apiEndpoints = {
  auth: {
    login: "/Auth/login",
    adminLogin: "/Auth/login",
    me: "/Auth/me",
  },
  admin: {
    users: "/Admin/users",
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
