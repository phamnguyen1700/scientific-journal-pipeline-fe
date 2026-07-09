"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getPaperDetailService,
  getPapersByAuthorService,
  getPapersByJournalService,
  getPapersService,
} from "@/service/papers";
import type { PaperApiModel, PaperDetailApiResponse, PaperListApiResponse } from "@/types/papers";

export const paperQueryKeys = {
  all: ["papers"] as const,
  list: () => [...paperQueryKeys.all, "list"] as const,
  detail: (id: string) => [...paperQueryKeys.all, "detail", id] as const,
  byAuthor: (authorId: string) => [...paperQueryKeys.all, "author", authorId] as const,
  byJournal: (journalId: string) => [...paperQueryKeys.all, "journal", journalId] as const,
};

export function usePapers() {
  const query = useQuery({
    queryKey: paperQueryKeys.list(),
    queryFn: async () => normalizePaperListResponse(await getPapersService()),
  });

  return {
    ...query,
    papers: query.data ?? [],
    loading: query.isPending,
    error: getErrorMessage(query.error),
  };
}

export function usePaper(id: string) {
  const listQuery = usePapers();
  const detailQuery = useQuery({
    queryKey: paperQueryKeys.detail(id),
    queryFn: async () => normalizePaperDetailResponse(await getPaperDetailService(id)),
    enabled: Boolean(id) && !isListPosition(id),
  });

  if (isListPosition(id)) {
    const position = Number(id) - 1;
    const paper = listQuery.papers[position] ?? null;

    return {
      ...listQuery,
      paper,
      loading: listQuery.loading,
      error: listQuery.error || (!listQuery.loading && !paper ? "Paper not found." : null),
    };
  }

  return {
    ...detailQuery,
    paper: detailQuery.data ?? null,
    loading: detailQuery.isPending,
    error: getErrorMessage(detailQuery.error),
  };
}

export function usePapersByAuthor(authorId: string) {
  const query = useQuery({
    queryKey: paperQueryKeys.byAuthor(authorId),
    queryFn: async () => normalizePaperListResponse(await getPapersByAuthorService(authorId)),
    enabled: Boolean(authorId),
  });

  return {
    ...query,
    papers: query.data ?? [],
    loading: query.isPending,
    error: getErrorMessage(query.error),
  };
}

export function usePapersByJournal(journalId: string) {
  const query = useQuery({
    queryKey: paperQueryKeys.byJournal(journalId),
    queryFn: async () => normalizePaperListResponse(await getPapersByJournalService(journalId)),
    enabled: Boolean(journalId),
  });

  return {
    ...query,
    papers: query.data ?? [],
    loading: query.isPending,
    error: getErrorMessage(query.error),
  };
}

function normalizePaperListResponse(response: PaperListApiResponse): PaperApiModel[] {
  if (Array.isArray(response)) {
    return response.map(normalizePaper);
  }

  const succeeded = response.success ?? response.succeeded ?? response.Succeeded ?? true;
  const result = response.data ?? response.result ?? response.Result ?? response.items ?? response.papers ?? response.records ?? [];
  const errors = response.errors ?? response.Errors ?? [];

  if (!succeeded) {
    throw new Error(errors.join(", ") || "Unable to load papers.");
  }

  if (Array.isArray(result)) {
    return result.map(normalizePaper);
  }

  return (result.results ?? result.data ?? result.items ?? result.papers ?? result.records ?? []).map(normalizePaper);
}

function normalizePaperDetailResponse(response: PaperDetailApiResponse) {
  const succeeded = response.succeeded ?? response.Succeeded ?? true;
  const result = response.result ?? response.Result ?? null;
  const errors = response.errors ?? response.Errors ?? [];

  if (!succeeded || !result) {
    throw new Error(errors.join(", ") || "Paper not found.");
  }

  return normalizePaper(result);
}

function normalizePaper(paper: PaperApiModel): PaperApiModel {
  return {
    ...paper,
    id: paper.id ?? paper.paperId ?? "",
    paperAuthorResponseModels:
      paper.paperAuthorResponseModels ?? paper.paperAuthors ?? [],
  };
}

function isListPosition(id: string) {
  return /^\d+$/.test(id);
}

function getErrorMessage(error: unknown) {
  if (!error) return null;

  return error instanceof Error ? error.message : "Unable to connect to the paper service.";
}
