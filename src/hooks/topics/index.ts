"use client";

import { useQuery } from "@tanstack/react-query";

import { getTopicDetailService, getTopicsService } from "@/service/topics";
import type {
  TopicApiModel,
  TopicApiResponse,
  TopicDetailApiResponse,
  TopicListApiResponse,
  TopicListResult,
} from "@/types/topics";

export const topicQueryKeys = {
  all: ["topics"] as const,
  list: () => [...topicQueryKeys.all, "list"] as const,
  detail: (id: string) => [...topicQueryKeys.all, "detail", id] as const,
};

export function useTopics() {
  const query = useQuery({
    queryKey: topicQueryKeys.list(),
    queryFn: async () => unwrapTopicListResponse(await getTopicsService()),
  });

  return {
    ...query,
    topicList: query.data ?? null,
    topics: query.data?.results ?? [],
    loading: query.isPending,
    error: getErrorMessage(query.error),
  };
}

export function useTopic(id: string) {
  const query = useQuery({
    queryKey: topicQueryKeys.detail(id),
    queryFn: async () => unwrapTopicDetailResponse(await getTopicDetailService(id)),
    enabled: Boolean(id),
  });

  return {
    ...query,
    topic: query.data ?? null,
    loading: query.isPending,
    error: getErrorMessage(query.error),
  };
}

function unwrapTopicListResponse(response: TopicListApiResponse): TopicListResult {
  return unwrapTopicApiResponse(response, "Unable to load topics.");
}

function unwrapTopicDetailResponse(response: TopicDetailApiResponse): TopicApiModel {
  const topic = unwrapTopicApiResponse(response, "Topic not found.");

  if (!topic) {
    throw new Error("Topic not found.");
  }

  return topic;
}

function unwrapTopicApiResponse<T>(response: TopicApiResponse<T>, fallbackMessage: string): T {
  if (!response.succeeded || response.result === null) {
    throw new Error(response.errors.join(", ") || fallbackMessage);
  }

  return response.result;
}

function getErrorMessage(error: unknown) {
  if (!error) return null;

  return error instanceof Error ? error.message : "Unable to connect to the topic service.";
}
