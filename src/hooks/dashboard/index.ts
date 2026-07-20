"use client";

import { useQuery } from "@tanstack/react-query";

import {
  type DashboardHotTopicsParams,
  getDashboardHotTopicsService,
  getDashboardSummaryService,
  getDashboardPublicationTrendsService,
} from "@/service/dashboard";
import type { DashboardApiResponse } from "@/types/dashboard";

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  summary: () => [...dashboardQueryKeys.all, "summary"] as const,
  publicationTrends: () => [...dashboardQueryKeys.all, "publication-trends"] as const,
  hotTopics: (params?: DashboardHotTopicsParams) =>
    [...dashboardQueryKeys.all, "hot-topics", params] as const,
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
        await getDashboardPublicationTrendsService(),
        "Unable to load publication trends.",
      ),
  });
}

export function useDashboardHotTopics(params?: DashboardHotTopicsParams) {
  return useQuery({
    queryKey: dashboardQueryKeys.hotTopics(params),
    queryFn: async () =>
      unwrapDashboardResponse(
        await getDashboardHotTopicsService(params),
        "Unable to load hot topics.",
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
