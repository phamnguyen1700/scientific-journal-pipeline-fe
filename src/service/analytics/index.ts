import { apiEndpoints } from "@/config/apiEndpoints";
import { get } from "@/service/apiClient";

export const getKeywordTrendsService = () =>
  get<unknown>(apiEndpoints.analytics.keywordTrends);

export const getTopicTrendsService = () =>
  get<unknown>(apiEndpoints.analytics.topicTrends);

export const getTrendingTopicsService = () =>
  get<unknown>(apiEndpoints.analytics.trendingTopics);

export const getAnalyticsDashboardService = () =>
  get<unknown>(apiEndpoints.analytics.dashboard);

export const getPublicationTrendsService = () =>
  get<unknown>(apiEndpoints.dashboard.publicationTrends);

export const analyticsService = {
  keywordTrends: getKeywordTrendsService,
  topicTrends: getTopicTrendsService,
  trendingTopics: getTrendingTopicsService,
  dashboard: getAnalyticsDashboardService,
  publicationTrends: getPublicationTrendsService,
};
