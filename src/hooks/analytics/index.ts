"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getAnalyticsDashboardService,
  getAuthorCollaborationNetworkService,
  getCitationsByYearService,
  getJournalOpenAccessRatioService,
  getKeywordCoOccurrenceService,
  getKeywordTrendsService,
  getKeywordsOverTimeService,
  getKeywordWordCloudService,
  getPapersByYearService,
  getTopAuthorsByCitationsService,
  getTopAuthorsByHIndexService,
  getTopDomainsService,
  getTopJournalsByCitationsService,
  getTopJournalsByPaperCountService,
  getTopKeywordsByYearService,
  getTopTopicsService,
  getTopicTrendsService,
  getTrendingTopicsService,
} from "@/service/analytics";
import type { AnalyticsApiResponse } from "@/types/analytics";

export const analyticsQueryKeys = {
  all: ["analytics"] as const,
  named: (name: string, params?: unknown) => [...analyticsQueryKeys.all, name, params] as const,
};

function unwrapAnalytics<T>(response: AnalyticsApiResponse<T>) {
  if (!response.succeeded) {
    throw new Error(response.errors?.join(", ") || "Unable to load analytics data.");
  }
  return response.result;
}

function useAnalyticsQuery<T>(name: string, queryFn: () => Promise<AnalyticsApiResponse<T>>, params?: unknown, enabled = true) {
  return useQuery({
    queryKey: analyticsQueryKeys.named(name, params),
    queryFn: async () => unwrapAnalytics(await queryFn()),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalyticsDashboard() {
  return useAnalyticsQuery("dashboard", getAnalyticsDashboardService);
}

export function usePapersByYear() {
  return useAnalyticsQuery("papers-by-year", getPapersByYearService);
}

export function useCitationsByYear() {
  return useAnalyticsQuery("citations-by-year", getCitationsByYearService);
}

export function useTopTopics(size = 10) {
  return useAnalyticsQuery("top-topics", () => getTopTopicsService(size), { size });
}

export function useTopDomains(size = 10) {
  return useAnalyticsQuery("top-domains", () => getTopDomainsService(size), { size });
}

export function useKeywordsOverTime(keywords: string[]) {
  const normalized = keywords.map((keyword) => keyword.trim()).filter(Boolean);
  return useAnalyticsQuery(
    "keywords-over-time",
    () => getKeywordsOverTimeService(normalized),
    { keywords: normalized },
    normalized.length > 0
  );
}

export function useTopAuthorsByCitations(size = 10) {
  return useAnalyticsQuery("authors-top-citations", () => getTopAuthorsByCitationsService(size), { size });
}

export function useTopAuthorsByHIndex(size = 10) {
  return useAnalyticsQuery("authors-top-hindex", () => getTopAuthorsByHIndexService(size), { size });
}

export function useAuthorCollaborationNetwork(size = 50) {
  return useAnalyticsQuery("author-collaboration-network", () => getAuthorCollaborationNetworkService(size), { size });
}

export function useTopJournalsByPaperCount(size = 10) {
  return useAnalyticsQuery("journals-top-paper-count", () => getTopJournalsByPaperCountService(size), { size });
}

export function useTopJournalsByCitations(size = 10) {
  return useAnalyticsQuery("journals-top-citations", () => getTopJournalsByCitationsService(size), { size });
}

export function useJournalOpenAccessRatio() {
  return useAnalyticsQuery("journals-open-access-ratio", getJournalOpenAccessRatioService);
}

export function useKeywordWordCloud(size = 50) {
  return useAnalyticsQuery("keyword-word-cloud", () => getKeywordWordCloudService(size), { size });
}

export function useTopKeywordsByYear(size = 10) {
  return useAnalyticsQuery("keywords-top-by-year", () => getTopKeywordsByYearService(size), { size });
}

export function useKeywordCoOccurrence(size = 50) {
  return useAnalyticsQuery("keyword-co-occurrence", () => getKeywordCoOccurrenceService(size), { size });
}

export function useKeywordTrend(keyword: string, years = 5) {
  const normalized = keyword.trim();
  return useAnalyticsQuery(
    "keyword-trend",
    () => getKeywordTrendsService(normalized, years),
    { keyword: normalized, years },
    normalized.length > 0
  );
}

export function useTopicTrend(topic: string, years = 5) {
  const normalized = topic.trim();
  return useAnalyticsQuery(
    "topic-trend",
    () => getTopicTrendsService(normalized, years),
    { topic: normalized, years },
    normalized.length > 0
  );
}

export function useTrendingTopics() {
  return useAnalyticsQuery("trending-topics", getTrendingTopicsService);
}
