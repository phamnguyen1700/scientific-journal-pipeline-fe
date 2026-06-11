"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getPaperDetailService,
  getPapersByAuthorService,
  getPapersService,
} from "@/service/papers";
import type { PaperDetailApiResponse, PaperListApiResponse } from "@/types/papers";

export const paperQueryKeys = {
  all: ["papers"] as const,
  list: () => [...paperQueryKeys.all, "list"] as const,
  detail: (id: string) => [...paperQueryKeys.all, "detail", id] as const,
  byAuthor: (authorId: string) => [...paperQueryKeys.all, "author", authorId] as const,
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

function normalizePaperListResponse(response: PaperListApiResponse) {
  if (!response.succeeded) {
    throw new Error(response.errors.join(", ") || "Unable to load papers.");
  }

  return response.result;
}

function normalizePaperDetailResponse(response: PaperDetailApiResponse) {
  if (!response.succeeded || !response.result) {
    throw new Error(response.errors.join(", ") || "Paper not found.");
  }

  return response.result;
}

function isListPosition(id: string) {
  return /^\d+$/.test(id);
}

function getErrorMessage(error: unknown) {
  if (!error) return null;

  return error instanceof Error ? error.message : "Unable to connect to the paper service.";
}
