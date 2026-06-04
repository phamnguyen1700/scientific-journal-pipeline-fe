export const apiEndpoints = {
  auth: {
    login: "/Auth/login",
    adminLogin: "/Auth/login",
    me: "/Auth/me",
  },
  papers: {
    list: "/Paper",
    detail: (id: string) => `/Paper/${id}`,
    byAuthor: (authorId: string) => `/Paper/author/${authorId}`,
  },
} as const;
