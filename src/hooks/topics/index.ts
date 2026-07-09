"use client";

import { useQuery } from "@tanstack/react-query";

import { getTopicDetailService, getTopicsService } from "@/service/topics";
import type { TagColor } from "@/types/common";
import type { ResearchTopic, TopicTrend } from "@/types/topics";

const topicColors: TagColor[] = ["purple", "blue", "green", "amber", "red", "cyan", "gray"];

export const topicQueryKeys = {
  all: ["topics"] as const,
  list: () => [...topicQueryKeys.all, "list"] as const,
  detail: (id: string) => [...topicQueryKeys.all, "detail", id] as const,
};

export function useTopics() {
  const query = useQuery({
    queryKey: topicQueryKeys.list(),
    queryFn: async () => mapTopics(await getTopicsService()),
  });

  return {
    ...query,
    topics: query.data ?? [],
    loading: query.isPending,
    error: getErrorMessage(query.error),
  };
}

export function useTopic(id: string) {
  const query = useQuery({
    queryKey: topicQueryKeys.detail(id),
    queryFn: async () => mapTopicDetail(await getTopicDetailService(id), id),
    enabled: Boolean(id),
  });

  return {
    ...query,
    topic: query.data ?? null,
    loading: query.isPending,
    error: getErrorMessage(query.error),
  };
}

function mapTopics(response: unknown): ResearchTopic[] {
  return extractArray(response).map((item, index) => {
    const record = asRecord(item);
    const topicId = readString(record, ["topicId", "id"]);
    const name = readString(record, ["name", "topicName", "title", "keyword"]) ?? `Topic ${index + 1}`;
    const growth = readNumber(record, ["growth", "growthRate", "percentageChange", "trend"]) ?? 0;

    return {
      id: topicId ?? index + 1,
      apiId: topicId,
      name,
      description:
        readString(record, ["description", "summary"]) ??
        `Research publications and trend signals related to ${name}.`,
      category:
        readString(record, ["category", "field", "domain"]) ??
        "Research topic",
      color: readTagColor(record, index),
      papers: readNumber(record, ["papers", "paperCount", "count", "total", "volume"]) ?? 0,
      growth,
      trend: readTrend(record, growth),
      followed: readBoolean(record, ["followed", "isFollowed"]) ?? false,
      keywords: readStringArray(record, ["keywords", "tags"]),
    };
  });
}

function mapTopicDetail(response: unknown, fallbackId: string): ResearchTopic {
  const payload = extractPayload(response);
  const record = asRecord(payload);
  const topic = mapTopics({ result: [record ?? payload] })[0];

  return {
    ...topic,
    id: topic.id ?? fallbackId,
    apiId: topic.apiId ?? fallbackId,
  };
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

  const candidates = [record.results, record.items, record.data, record.records, record.topics];
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

function readBoolean(record: Record<string, unknown> | null | undefined, keys: string[]) {
  for (const key of keys) {
    const value = record?.[key];
    if (typeof value === "boolean") return value;
  }

  return undefined;
}

function readStringArray(record: Record<string, unknown> | null | undefined, keys: string[]) {
  for (const key of keys) {
    const value = record?.[key];
    if (Array.isArray(value)) {
      const items = value.filter((item): item is string => typeof item === "string" && Boolean(item.trim()));
      if (items.length) return items;
    }
    if (typeof value === "string" && value.trim()) {
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
  }

  return [];
}

function readTagColor(record: Record<string, unknown> | null | undefined, index: number): TagColor {
  const color = readString(record, ["color"]);
  if (color && topicColors.includes(color as TagColor)) {
    return color as TagColor;
  }

  return topicColors[index % topicColors.length];
}

function readTrend(record: Record<string, unknown> | null | undefined, growth: number): TopicTrend {
  const trend = readString(record, ["trend", "direction"]);
  if (trend === "stable") return "stable";

  return growth > 0 ? "up" : "stable";
}

function getErrorMessage(error: unknown) {
  if (!error) return null;

  return error instanceof Error ? error.message : "Unable to connect to the topic service.";
}
