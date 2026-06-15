"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getAnalyticsDashboardService,
  getPublicationTrendsService,
  getTrendingTopicsService,
} from "@/service/analytics";
import {
  getUserBookmarksService,
  getUserFollowingTopicsService,
} from "@/service/user";
import type {
  BookmarkedPaper,
  StudentDashboardData,
  TrendingTopic,
  TrendPoint,
  TrendSeries,
} from "@/types/dashboard";

const topicColors = ["#6C4CF1", "#10B981", "#F59E0B", "#EF4444", "#2563EB"];

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  student: () => [...dashboardQueryKeys.all, "student"] as const,
};

export function useStudentDashboard() {
  const query = useQuery({
    queryKey: dashboardQueryKeys.student(),
    queryFn: getStudentDashboardData,
  });

  return {
    ...query,
    data: query.data ?? emptyStudentDashboardData,
    loading: query.isPending,
    error: getErrorMessage(query.error),
  };
}

async function getStudentDashboardData(): Promise<StudentDashboardData> {
  const [
    bookmarksResponse,
    followingTopicsResponse,
    trendingTopicsResponse,
    publicationTrendsResponse,
    analyticsDashboardResponse,
  ] = await Promise.allSettled([
    getUserBookmarksService(),
    getUserFollowingTopicsService(),
    getTrendingTopicsService(),
    getPublicationTrendsService(),
    getAnalyticsDashboardService(),
  ]);

  const bookmarks = mapBookmarks(getSettledValue(bookmarksResponse));
  const followingTopics = extractArray(getSettledValue(followingTopicsResponse));
  const analyticsDashboard = extractPayload(getSettledValue(analyticsDashboardResponse));
  const analyticsRecord = asRecord(analyticsDashboard);
  const publicationTrends = mapPublicationTrends(getSettledValue(publicationTrendsResponse));

  return {
    bookmarks,
    followedTopicCount:
      readNumber(analyticsRecord, ["followedTopics", "followedTopicCount", "followingTopics"]) ??
      followingTopics.length,
    trendingTopics: mapTrendingTopics(getSettledValue(trendingTopicsResponse)),
    trendData: publicationTrends.data,
    trendSeries: publicationTrends.series,
    stats: {
      bookmarkedPapers:
        readNumber(analyticsRecord, ["bookmarkedPapers", "bookmarkCount", "bookmarks"]) ??
        bookmarks.length,
      followedTopics:
        readNumber(analyticsRecord, ["followedTopics", "followedTopicCount", "followingTopics"]) ??
        followingTopics.length,
      journalAlerts: readNumber(analyticsRecord, ["journalAlerts", "alerts", "unreadAlerts"]),
      newPapers: readNumber(analyticsRecord, ["newPapers", "paperCount", "papers"]),
    },
  };
}

const emptyStudentDashboardData: StudentDashboardData = {
  bookmarks: [],
  followedTopicCount: 0,
  trendingTopics: [],
  trendData: [],
  trendSeries: [],
  stats: {},
};

function getSettledValue(result: PromiseSettledResult<unknown>) {
  return result.status === "fulfilled" ? result.value : null;
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

  const candidates = [record.results, record.items, record.data, record.records, record.topics, record.papers];
  const array = candidates.find(Array.isArray);

  return array ?? [];
}

function mapBookmarks(response: unknown): BookmarkedPaper[] {
  return extractArray(response).slice(0, 4).map((item, index) => {
    const record = asRecord(item);
    const paper = asRecord(record?.paper);
    const journal = asRecord(record?.journal ?? paper?.journal);

    return {
      id: readString(record, ["id", "bookmarkId", "paperId"]) ?? String(index + 1),
      title:
        readString(record, ["title", "paperTitle"]) ??
        readString(paper, ["title", "paperTitle"]) ??
        "Untitled paper",
      journal:
        readString(record, ["journalName", "journal"]) ??
        readString(journal, ["journalName", "name", "title"]) ??
        "Journal information unavailable",
      saved:
        formatSavedDate(readString(record, ["savedAt", "createdAt", "bookmarkedAt"])) ??
        "Saved",
    };
  });
}

function mapTrendingTopics(response: unknown): TrendingTopic[] {
  return extractArray(response).slice(0, 5).map((item, index) => {
    const record = asRecord(item);

    return {
      name:
        readString(record, ["name", "topic", "topicName", "keyword", "title"]) ??
        `Topic ${index + 1}`,
      count: readNumber(record, ["count", "paperCount", "papers", "total", "volume"]) ?? 0,
      growth: readNumber(record, ["growth", "growthRate", "trend", "percentageChange"]) ?? 0,
      color: readString(record, ["color"]) ?? topicColors[index % topicColors.length],
    };
  });
}

function mapPublicationTrends(response: unknown): { data: TrendPoint[]; series: TrendSeries[] } {
  const topics = extractArray(response);
  const rows = new Map<string, TrendPoint & { sortKey: number }>();
  const series: TrendSeries[] = [];

  topics.forEach((item, topicIndex) => {
    const record = asRecord(item);
    const topicName = readString(record, ["topicName", "name", "topic"]) ?? `Topic ${topicIndex + 1}`;
    const key = `topic${topicIndex}`;
    const monthlyCounts = Array.isArray(record?.monthlyCounts) ? record.monthlyCounts : [];

    series.push({
      key,
      name: topicName,
      color: topicColors[topicIndex % topicColors.length],
    });

    monthlyCounts.forEach((monthItem) => {
      const monthRecord = asRecord(monthItem);
      const year = readNumber(monthRecord, ["year"]) ?? 0;
      const monthNumber = readNumber(monthRecord, ["monthNumber"]) ?? topicIndex + 1;
      const month = readString(monthRecord, ["month"]) ?? `M${monthNumber}`;
      const label = year ? `${month} ${year}` : month;
      const row = rows.get(label) ?? {
        month: label,
        sortKey: year * 100 + monthNumber,
      };

      row[key] = readNumber(monthRecord, ["count"]) ?? 0;
      rows.set(label, row);
    });
  });

  const data = Array.from(rows.values())
    .sort((first, second) => first.sortKey - second.sortKey)
    .map((row) => {
      const trendPoint: TrendPoint = { ...row };
      delete trendPoint.sortKey;

      return trendPoint;
    });

  return { data, series };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function readString(record: Record<string, unknown> | null | undefined, keys: string[]) {
  for (const key of keys) {
    const value = record?.[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return undefined;
}

function readNumber(record: Record<string, unknown> | null | undefined, keys: string[]) {
  for (const key of keys) {
    const value = record?.[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string") {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }

  return undefined;
}

function formatSavedDate(value: string | undefined) {
  if (!value) return undefined;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getErrorMessage(error: unknown) {
  if (!error) return null;

  return error instanceof Error
    ? error.message
    : "Unable to connect to the dashboard services.";
}
