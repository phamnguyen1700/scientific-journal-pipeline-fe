import { apiEndpoints } from "@/config/apiEndpoints";
import { get } from "@/service/apiClient";
import type {
  AnalyticsApiResponse,
  AnalyticsDashboard,
  AnalyticsKeyValue,
  AnalyticsNetwork,
  AnalyticsOpenAccessStat,
  AnalyticsSeries,
  AnalyticsTrend,
  AnalyticsTrendingTopic,
  AvailableTopicForCompare,
  JournalTrackerItem,
  TopicComparison,
} from "@/types/analytics";
import type {
  DashboardApiResponse,
  DashboardHotTopic,
  DashboardPublicationTrend,
  DashboardSummary,
} from "@/types/dashboard";

const withSize = (size: number) => ({ params: { size } });

export const getPapersByYearService = () =>
  get<AnalyticsApiResponse<AnalyticsKeyValue[]>>(apiEndpoints.analytics.papersByYear);

export const getCitationsByYearService = () =>
  get<AnalyticsApiResponse<AnalyticsKeyValue[]>>(apiEndpoints.analytics.citationsByYear);

export const getTopTopicsService = (size = 10) =>
  get<AnalyticsApiResponse<AnalyticsKeyValue[]>>(apiEndpoints.analytics.topTopics, withSize(size));

export const getTopDomainsService = (size = 10) =>
  get<AnalyticsApiResponse<AnalyticsKeyValue[]>>(apiEndpoints.analytics.topDomains, withSize(size));

export const getKeywordsOverTimeService = (keywords: string[]) =>
  get<AnalyticsApiResponse<AnalyticsSeries[]>>(apiEndpoints.analytics.keywordsOverTime, {
    params: { keywords },
    paramsSerializer: { indexes: null },
  });

export const getTopAuthorsByCitationsService = (size = 10) =>
  get<AnalyticsApiResponse<AnalyticsKeyValue[]>>(apiEndpoints.analytics.topAuthorsByCitations, withSize(size));

export const getTopAuthorsByHIndexService = (size = 10) =>
  get<AnalyticsApiResponse<AnalyticsKeyValue[]>>(apiEndpoints.analytics.topAuthorsByHIndex, withSize(size));

export const getAuthorCollaborationNetworkService = (size = 50) =>
  get<AnalyticsApiResponse<AnalyticsNetwork>>(apiEndpoints.analytics.authorCollaborationNetwork, withSize(size));

export const getTopJournalsByPaperCountService = (size = 10) =>
  get<AnalyticsApiResponse<AnalyticsKeyValue[]>>(apiEndpoints.analytics.topJournalsByPaperCount, withSize(size));

export const getTopJournalsByCitationsService = (size = 10) =>
  get<AnalyticsApiResponse<AnalyticsKeyValue[]>>(apiEndpoints.analytics.topJournalsByCitations, withSize(size));

export const getJournalOpenAccessRatioService = () =>
  get<AnalyticsApiResponse<AnalyticsOpenAccessStat[]>>(apiEndpoints.analytics.journalOpenAccessRatio);

export const getKeywordWordCloudService = (size = 50) =>
  get<AnalyticsApiResponse<AnalyticsKeyValue[]>>(apiEndpoints.analytics.keywordWordCloud, withSize(size));

export const getTopKeywordsByYearService = (size = 10) =>
  get<AnalyticsApiResponse<AnalyticsSeries[]>>(apiEndpoints.analytics.topKeywordsByYear, withSize(size));

export const getKeywordCoOccurrenceService = (size = 50) =>
  get<AnalyticsApiResponse<AnalyticsNetwork>>(apiEndpoints.analytics.keywordCoOccurrence, withSize(size));

export const getTopicCoOccurrenceService = (size = 50) =>
  get<AnalyticsApiResponse<AnalyticsNetwork>>(apiEndpoints.analytics.topicCoOccurrence, withSize(size));

export const getKeywordTrendsService = (keyword: string, years = 5) =>
  get<AnalyticsApiResponse<AnalyticsTrend>>(apiEndpoints.analytics.keywordTrends, {
    params: { keyword, years },
  });

export const getTopicTrendsService = (topic: string, years = 5) =>
  get<AnalyticsApiResponse<AnalyticsTrend>>(apiEndpoints.analytics.topicTrends, {
    params: { topic, years },
  });

export const getTrendingTopicsService = (years = 1, topCount = 10) =>
  get<AnalyticsApiResponse<AnalyticsTrendingTopic[]>>(apiEndpoints.analytics.trendingTopics, {
    params: { years, topCount },
  });

export const getKeywordSuggestionsService = (q = "", size = 10) =>
  get<AnalyticsApiResponse<string[]>>(apiEndpoints.keyword.suggestions, {
    params: { q, size },
  });

export const getTopicComparisonService = (topicIds: string[], years = 5) =>
  get<AnalyticsApiResponse<TopicComparison[]>>(apiEndpoints.analytics.topicComparison, {
    params: { topicIds, years },
    paramsSerializer: { indexes: null },
  });

export const getTopicsAvailableForCompareService = (q = "", size = 300) =>
  get<AnalyticsApiResponse<AvailableTopicForCompare[]>>(apiEndpoints.analytics.topicsAvailableForCompare, {
    params: { q, size },
  });

export const getJournalTrackerService = (size = 20, years = 5) =>
  get<AnalyticsApiResponse<JournalTrackerItem[]>>(apiEndpoints.analytics.journalTracker, {
    params: { size, years },
  });

export const getAnalyticsDashboardService = () =>
  get<AnalyticsApiResponse<AnalyticsDashboard>>(apiEndpoints.analytics.dashboard);

export const getDashboardSummaryService = () =>
  get<DashboardApiResponse<DashboardSummary>>(apiEndpoints.dashboard.summary);

export const getPublicationTrendsService = () =>
  get<DashboardApiResponse<DashboardPublicationTrend[]>>(apiEndpoints.dashboard.publicationTrends);

export const getDashboardHotTopicsService = () =>
  get<DashboardApiResponse<DashboardHotTopic[]>>(apiEndpoints.dashboard.hotTopics);

export const analyticsService = {
  papersByYear: getPapersByYearService,
  citationsByYear: getCitationsByYearService,
  topTopics: getTopTopicsService,
  topDomains: getTopDomainsService,
  keywordsOverTime: getKeywordsOverTimeService,
  topAuthorsByCitations: getTopAuthorsByCitationsService,
  topAuthorsByHIndex: getTopAuthorsByHIndexService,
  authorCollaborationNetwork: getAuthorCollaborationNetworkService,
  topJournalsByPaperCount: getTopJournalsByPaperCountService,
  topJournalsByCitations: getTopJournalsByCitationsService,
  journalOpenAccessRatio: getJournalOpenAccessRatioService,
  keywordWordCloud: getKeywordWordCloudService,
  topKeywordsByYear: getTopKeywordsByYearService,
  keywordCoOccurrence: getKeywordCoOccurrenceService,
  topicCoOccurrence: getTopicCoOccurrenceService,
  keywordTrends: getKeywordTrendsService,
  topicTrends: getTopicTrendsService,
  trendingTopics: getTrendingTopicsService,
  keywordSuggestions: getKeywordSuggestionsService,
  topicsAvailableForCompare: getTopicsAvailableForCompareService,
  topicComparison: getTopicComparisonService,
  journalTracker: getJournalTrackerService,
  dashboard: getAnalyticsDashboardService,
  dashboardSummary: getDashboardSummaryService,
  publicationTrends: getPublicationTrendsService,
  dashboardHotTopics: getDashboardHotTopicsService,
};
