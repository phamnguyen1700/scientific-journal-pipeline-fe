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
    paperReindex: "/Search/papers/reindex",
    paperReindexBackground: "/Search/papers/reindex/background",
    paperIndex: "/Search/papers/index",
    paperIndexRecreate: "/Search/papers/index/recreate",
    paperIndexRecreateBackground: "/Search/papers/index/recreate/background",
    authors: "/Search/authors",
    authorReindex: "/Search/authors/reindex",
    authorReindexBackground: "/Search/authors/reindex/background",
    authorIndex: "/Search/authors/index",
    authorIndexRecreate: "/Search/authors/index/recreate",
    authorIndexRecreateBackground: "/Search/authors/index/recreate/background",
  },
  semanticScholar: {
    search: "/SemanticScholar/search",
  },
  user: {
    profile: "/User/profile",
    legacyProfile: "/profile",
    bookmarks: "/User/bookmarks",
    bookmark: (paperId: string) => `/User/bookmarks/${paperId}`,
    followingTopics: "/User/following/topics",
    followingTopic: (topicId: string) => `/User/following/topics/${topicId}`,
  },
  topics: {
    list: "/Topic",
    detail: (id: string) => `/Topic/${id}`,
  },
  analytics: {
    keywordTrends: "/Analytics/keyword-trends",
    topicTrends: "/Analytics/topic-trends",
    trendingTopics: "/Analytics/trending-topics",
    dashboard: "/Analytics/dashboard",
  },
  dashboard: {
    publicationTrends: "/Dashboard/publication-trends",
  },
} as const;
