"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getDashboardHotTopicsService,
  getTrendingTopicsService,
} from "@/service/analytics";
import type { TrendingTopicMetric } from "@/types/topics";

const topicColors = ["#6C4CF1", "#10B981", "#F59E0B", "#EF4444", "#2563EB", "#06B6D4"];

export const trendQueryKeys = {
  all: ["trends"] as const,
  topicMetrics: () => [...trendQueryKeys.all, "topic-metrics"] as const,
};

export function useTrendingTopicMetrics() {
  const query = useQuery({
    queryKey: trendQueryKeys.topicMetrics(),
    queryFn: getTrendingTopicMetrics,
  });

  return {
    ...query,
    topics: query.data ?? [],
    loading: query.isPending,
    error: getErrorMessage(query.error),
  };
}

async function getTrendingTopicMetrics() {
  const [hotTopicsResponse, trendingTopicsResponse] = await Promise.allSettled([
    getDashboardHotTopicsService(),
    getTrendingTopicsService(),
  ]);
  const hotTopics = mapTrendingTopicMetrics(getSettledValue(hotTopicsResponse));

  return hotTopics.length
    ? hotTopics
    : mapTrendingTopicMetrics(getSettledValue(trendingTopicsResponse));
}

function getSettledValue(result: PromiseSettledResult<unknown>) {
  return result.status === "fulfilled" ? result.value : null;
}

function mapTrendingTopicMetrics(response: unknown): TrendingTopicMetric[] {
  return extractArray(response).map((item, index) => {
    const record = asRecord(item);
    const id = readString(record, ["id", "topicId"]) ?? index + 1;
    const growth = readNumber(record, ["growth", "growthRate", "percentageChange", "trend"]) ?? 0;

    return {
      id,
      name:
        readString(record, ["name", "topicName", "topic", "keyword", "title"]) ??
        `Topic ${index + 1}`,
      category:
        readString(record, ["category", "field", "domain"]) ??
        "Research topic",
      color: readString(record, ["color"]) ?? topicColors[index % topicColors.length],
      papers: readNumber(record, ["papers", "paperCount", "count", "total", "volume"]) ?? 0,
      growth,
      citations: readNumber(record, ["citations", "citationCount", "citedByCount"]) ?? 0,
      followers: readNumber(record, ["followers", "followerCount", "followedBy"]) ?? 0,
      sparkline: readNumberArray(record, ["sparkline", "trendPoints", "series"]) ?? buildSparkline(growth),
    };
  });
}

function extractPayload(response: unknown): unknown {
  const record = asRecord(response);
  if (!record) return response;

  return record.data ?? record.result ?? record.Result ?? response;
}

function extractArray(response: unknown): unknown[] {
  const payload = extractPayload(response);
  if (Array.isArray(payload)) return payload;

  const record = asRecord(payload);
  if (!record) return [];

  const candidates = [record.results, record.items, record.data, record.records, record.topics, record.hotTopics];
  const array = candidates.find(Array.isArray);

  return array ?? [];
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function readString(record: Record<string, unknown> | null | undefined, keys: string[]) {
  for (const key of keys) {
    const value = record?.[key];
    if (typeof value === "string" && value.trim()) return value;
  }

  return undefined;
}

function readNumber(record: Record<string, unknown> | null | undefined, keys: string[]) {
  for (const key of keys) {
    const value = record?.[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }

  return undefined;
}

function readNumberArray(record: Record<string, unknown> | null | undefined, keys: string[]) {
  for (const key of keys) {
    const value = record?.[key];
    if (!Array.isArray(value)) continue;

    const items = value
      .map((item) => typeof item === "number" ? item : Number(item))
      .filter(Number.isFinite);
    if (items.length) return items;
  }

  return undefined;
}

function buildSparkline(growth: number) {
  const base = Math.max(8, 48 - Math.round(growth));

  return Array.from({ length: 7 }, (_, index) => base + Math.round((growth / 6) * index));
}

function getErrorMessage(error: unknown) {
  if (!error) return null;

  return error instanceof Error ? error.message : "Unable to connect to the trending topic service.";
}
