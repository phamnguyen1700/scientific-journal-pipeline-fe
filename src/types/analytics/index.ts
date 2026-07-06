export type AnalyticsApiResponse<T> = {
  succeeded: boolean;
  result: T | null;
  errors: string[];
};

export type AnalyticsKeyValue = {
  key: string;
  value: number;
};

export type AnalyticsSeries = {
  seriesName: string;
  dataPoints: AnalyticsKeyValue[];
};

export type AnalyticsNetworkNode = {
  id: string;
  label: string;
  size: number;
  group: string;
};

export type AnalyticsNetworkEdge = {
  source: string;
  target: string;
  weight?: number;
};

export type AnalyticsNetwork = {
  nodes: AnalyticsNetworkNode[];
  edges: AnalyticsNetworkEdge[];
};

export type AnalyticsYearlyCount = {
  year: number;
  count: number;
};

export type AnalyticsTrend = {
  keyword?: string;
  topicName?: string;
  yearlyCounts: AnalyticsYearlyCount[];
};

export type AnalyticsTrendingTopic = {
  topicName: string;
  paperCount: number;
  previousPaperCount?: number;
  growthPercentage: number;
  trend: "up" | "down" | "stable" | string;
  currentYear?: number;
  previousYear?: number;
  years?: number;
};

export type AnalyticsDashboard = {
  bookmarkedPapers: number;
  followedTopics: number;
  newPapersInFollowedTopics: number;
  topFollowedTopics: Array<{
    topicName: string;
    recentPaperCount: number;
  }>;
};

export type TopicComparison = {
  topicId: string;
  topicName: string;
  paperCount: number;
  citationCount: number;
  journalCount: number;
  topicHIndex: number;
  growthPercentage: number;
  startYear: number;
  endYear: number;
  yearlyCounts: AnalyticsYearlyCount[];
};

export type JournalTrackerItem = {
  journalId: string;
  journalName: string;
  publisher: string;
  homepageUrl: string;
  isOpenAccess: boolean;
  paperCount: number;
  citationCount: number;
  growthPercentage: number;
  lastPublicationYear: number | null;
  topKeywords: string[];
};
