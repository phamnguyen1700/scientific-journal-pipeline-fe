"use client";

import { useQuery } from "@tanstack/react-query";

import { getJournalDetailService, getJournalsService } from "@/service/journals";
import type {
  Journal,
  JournalApiResponse,
  JournalDetailApiResponse,
  JournalListApiResponse,
  JournalListResult,
} from "@/types/journals";

export const journalQueryKeys = {
  all: ["journals"] as const,
  list: () => [...journalQueryKeys.all, "list"] as const,
  detail: (id: string | null) => [...journalQueryKeys.all, "detail", id] as const,
};

const emptyJournalList: JournalListResult = {
  total: 0,
  page: 1,
  size: 0,
  totalPages: 0,
  results: [],
};

export function useJournals() {
  const query = useQuery({
    queryKey: journalQueryKeys.list(),
    queryFn: async () => unwrapJournalListResponse(await getJournalsService()),
    staleTime: 5 * 60 * 1000,
  });

  const journalList = query.data ?? emptyJournalList;

  return {
    ...query,
    journalList,
    journals: journalList.results,
    loading: query.isPending,
    error: getErrorMessage(query.error),
  };
}

export function useJournal(id: string | null) {
  const query = useQuery({
    queryKey: journalQueryKeys.detail(id),
    queryFn: async () => unwrapJournalDetailResponse(await getJournalDetailService(id ?? "")),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });

  return {
    ...query,
    journal: query.data ?? null,
    loading: query.isPending,
    error: getErrorMessage(query.error),
  };
}

function unwrapJournalListResponse(response: JournalListApiResponse): JournalListResult {
  if ("results" in response) {
    return response;
  }

  return unwrapJournalApiResponse(response, "Unable to load journals.") ?? emptyJournalList;
}

function unwrapJournalDetailResponse(response: JournalDetailApiResponse): Journal | null {
  if (!response) return null;
  if ("journalId" in response) return response;

  return unwrapJournalApiResponse(response, "Journal not found.");
}

function unwrapJournalApiResponse<T>(response: JournalApiResponse<T>, fallbackMessage: string): T {
  const succeeded = response.succeeded ?? response.success ?? false;
  const result = response.result ?? response.data ?? null;
  const errors = response.errors ?? [];

  if (!succeeded || !result) {
    throw new Error(errors.join(", ") || fallbackMessage);
  }

  return result;
}

function getErrorMessage(error: unknown) {
  if (!error) return null;

  return error instanceof Error ? error.message : "Unable to connect to the journal service.";
}