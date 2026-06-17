"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { dashboardQueryKeys } from "@/hooks/dashboard";
import {
  addUserBookmarkService,
  getUserBookmarksService,
  getUserFollowingTopicsService,
  removeUserBookmarkService,
  unfollowTopicService,
} from "@/service/user";
import type { SavedPaper, FollowedTopic } from "@/types/library";

export const userQueryKeys = {
  all: ["user"] as const,
  bookmarks: () => [...userQueryKeys.all, "bookmarks"] as const,
  followingTopics: () => [...userQueryKeys.all, "following", "topics"] as const,
};

export function useUserBookmarks() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: userQueryKeys.bookmarks(),
    queryFn: async () => mapBookmarks(await getUserBookmarksService()),
  });

  const addBookmark = useMutation({
    mutationFn: addUserBookmarkService,
    onSuccess: () => invalidateBookmarkQueries(queryClient),
  });
  const removeBookmark = useMutation({
    mutationFn: removeUserBookmarkService,
    onSuccess: () => invalidateBookmarkQueries(queryClient),
  });

  return {
    ...query,
    papers: query.data ?? [],
    loading: query.isPending,
    error: getErrorMessage(query.error),
    addBookmark: addBookmark.mutate,
    removeBookmark: removeBookmark.mutate,
    saving: addBookmark.isPending || removeBookmark.isPending,
  };
}

export function useUserFollowingTopics() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: userQueryKeys.followingTopics(),
    queryFn: async () => mapFollowedTopics(await getUserFollowingTopicsService()),
  });

  const unfollowTopic = useMutation({
    mutationFn: (id: string | number) => unfollowTopicService(String(id)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.followingTopics() });
      void queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.student() });
    },
  });

  return {
    ...query,
    topics: query.data ?? [],
    loading: query.isPending,
    error: getErrorMessage(query.error),
    unfollowTopic: unfollowTopic.mutate,
    saving: unfollowTopic.isPending,
  };
}

function invalidateBookmarkQueries(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: userQueryKeys.bookmarks() });
  void queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.student() });
}

function mapBookmarks(response: unknown): SavedPaper[] {
  return extractArray(response).map((item, index) => {
    const record = asRecord(item);
    const paper = asRecord(record?.paper);
    const journal = asRecord(record?.journal ?? paper?.journal);
    const paperId = readString(record, ["paperId", "id"]) ?? readString(paper, ["paperId", "id"]);

    return {
      id: paperId ?? index + 1,
      apiId: paperId,
      title:
        readString(record, ["title", "paperTitle"]) ??
        readString(paper, ["title", "paperTitle"]) ??
        "Untitled paper",
      authors:
        readString(record, ["authors", "authorNames"]) ??
        mapAuthorNames(record?.paperAuthorResponseModels ?? paper?.paperAuthorResponseModels),
      journal:
        readString(record, ["journalName", "journal"]) ??
        readString(journal, ["journalName", "name", "title"]) ??
        "Journal information unavailable",
      year: readNumber(record, ["publicationYear", "year"]) ?? readNumber(paper, ["publicationYear", "year"]) ?? 0,
      citations: readNumber(record, ["citedByCount", "citations"]) ?? readNumber(paper, ["citedByCount", "citations"]) ?? 0,
      savedAt:
        formatDate(readString(record, ["savedAt", "createdAt", "bookmarkedAt"])) ??
        "recently",
      abstract:
        readString(record, ["abstract"]) ??
        readString(paper, ["abstract"]) ??
        "No abstract is available for this paper.",
      tags: [
        readString(record, ["paperType"]) ?? readString(paper, ["paperType"]),
        readString(record, ["language"]) ?? readString(paper, ["language"]),
      ].filter((tag): tag is string => Boolean(tag)),
    };
  });
}

function mapFollowedTopics(response: unknown): FollowedTopic[] {
  return extractArray(response).map((item, index) => {
    const record = asRecord(item);
    const topic = asRecord(record?.topic);
    const topicId = readString(record, ["topicId", "id"]) ?? readString(topic, ["topicId", "id"]);

    return {
      id: topicId ?? index + 1,
      apiId: topicId,
      name:
        readString(record, ["name", "topicName", "title"]) ??
        readString(topic, ["name", "topicName", "title"]) ??
        `Topic ${index + 1}`,
      category:
        readString(record, ["category", "field"]) ??
        readString(topic, ["category", "field"]) ??
        "Research topic",
      papers: readNumber(record, ["papers", "paperCount", "count"]) ?? readNumber(topic, ["papers", "paperCount", "count"]) ?? 0,
      growth: readNumber(record, ["growth", "growthRate"]) ?? readNumber(topic, ["growth", "growthRate"]) ?? 0,
      alertOn: readBoolean(record, ["alertOn", "alertsEnabled", "notificationEnabled"]) ?? true,
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

  const candidates = [record.results, record.items, record.data, record.records, record.papers, record.topics];
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

function mapAuthorNames(value: unknown) {
  const authors = Array.isArray(value) ? value : [];
  const names = authors
    .map((author) => {
      const record = asRecord(author);
      const nestedAuthor = asRecord(record?.author);

      return (
        readString(nestedAuthor, ["displayName", "fullName"]) ??
        readString(record, ["rawAuthorName", "name", "authorName"])
      );
    })
    .filter((author): author is string => Boolean(author));

  return names.length ? names.join(", ") : "Author information unavailable";
}

function formatDate(value: string | undefined) {
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

  return error instanceof Error ? error.message : "Unable to connect to the user service.";
}
