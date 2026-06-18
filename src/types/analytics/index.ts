export type AnalyticsApiResponse<T> = {
  succeeded: boolean;
  result: T;
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
  growthPercentage: number;
  trend: "up" | "down" | "stable" | string;
};

export type AnalyticsDashboard = {
  bookmarkedPapers: number;
  followedTopics: number;
  newPapersInFollowedTopics: number;
  topFollowedTopics: unknown[];
};
