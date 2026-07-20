import { apiEndpoints } from "@/config/apiEndpoints";
import { get } from "@/service/apiClient";
import type {
  DashboardApiResponse,
  DashboardHotTopic,
  DashboardPublicationTrend,
  DashboardSummary,
} from "@/types/dashboard";

export type DashboardHotTopicsParams = {
  endYear?: number;
  startYear?: number;
};

export const getDashboardSummaryService = () =>
  get<DashboardApiResponse<DashboardSummary>>(apiEndpoints.dashboard.summary);

export const getDashboardPublicationTrendsService = () =>
  get<DashboardApiResponse<DashboardPublicationTrend[]>>(
    apiEndpoints.dashboard.publicationTrends,
  );

export const getDashboardHotTopicsService = (
  params?: DashboardHotTopicsParams,
) =>
  get<DashboardApiResponse<DashboardHotTopic[]>>(
    apiEndpoints.dashboard.hotTopics,
    { params },
  );

export const dashboardService = {
  summary: getDashboardSummaryService,
  publicationTrends: getDashboardPublicationTrendsService,
  hotTopics: getDashboardHotTopicsService,
};
