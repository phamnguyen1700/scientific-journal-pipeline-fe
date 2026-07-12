"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getAnalyticsDashboardService,
  getDashboardHotTopicsService,
  getDashboardSummaryService,
  getPublicationTrendsService,
  getTrendingTopicsService,
} from "@/service/analytics";
import type { AnalyticsApiResponse } from "@/types/analytics";
import type { DashboardApiResponse } from "@/types/dashboard";

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  summary: () => [...dashboardQueryKeys.all, "summary"] as const,
  publicationTrends: () => [...dashboardQueryKeys.all, "publication-trends"] as const,
  hotTopics: () => [...dashboardQueryKeys.all, "hot-topics"] as const,
  analytics: () => [...dashboardQueryKeys.all, "analytics"] as const,
  trendingTopics: () => [...dashboardQueryKeys.all, "trending-topics"] as const,
};

export function useDashboardSummary() {
  return useQuery({
    queryKey: dashboardQueryKeys.summary(),
    queryFn: async () =>
      unwrapDashboardResponse(
        await getDashboardSummaryService(),
        "Unable to load dashboard summary.",
      ),
  });
}

export function useDashboardPublicationTrends() {
  return useQuery({
    queryKey: dashboardQueryKeys.publicationTrends(),
    queryFn: async () =>
      unwrapDashboardResponse(
        await getPublicationTrendsService(),
        "Unable to load publication trends.",
      ),
  });
}

export function useDashboardHotTopics() {
  return useQuery({
    queryKey: dashboardQueryKeys.hotTopics(),
    queryFn: async () =>
      unwrapDashboardResponse(
        await getDashboardHotTopicsService(),
        "Unable to load hot topics.",
      ),
  });
}

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: dashboardQueryKeys.analytics(),
    queryFn: async () =>
      unwrapAnalyticsResponse(
        await getAnalyticsDashboardService(),
        "Unable to load dashboard analytics.",
      ),
  });
}

export function useDashboardTrendingTopics() {
  return useQuery({
    queryKey: dashboardQueryKeys.trendingTopics(),
    queryFn: async () =>
      unwrapAnalyticsResponse(
        await getTrendingTopicsService(),
        "Unable to load trending topics.",
      ),
  });
}

export function getDashboardErrorMessage(error: unknown) {
  if (!error) return null;

  return error instanceof Error
    ? error.message
    : "Unable to connect to the dashboard services.";
}

function unwrapDashboardResponse<T>(
  response: DashboardApiResponse<T>,
  fallbackMessage: string,
): T {
  if (!response.succeeded || response.result === null) {
    throw new Error(response.errors.join(", ") || fallbackMessage);
  }

  return response.result;
}

function unwrapAnalyticsResponse<T>(
  response: AnalyticsApiResponse<T>,
  fallbackMessage: string,
): T {
  if (!response.succeeded || response.result === null) {
    throw new Error(response.errors.join(", ") || fallbackMessage);
  }

  return response.result;
}