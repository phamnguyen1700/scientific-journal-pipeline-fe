"use client";

import { useQueries, useQuery } from "@tanstack/react-query";

import {
  getPaperDetailService,
  getPapersByAuthorService,
  getPapersService,
} from "@/service/papers";
import type {
  PaperApiModel,
  PaperDetailApiResponse,
  PaperListApiResponse,
  PagedResponse,
} from "@/types/papers";

export const paperQueryKeys = {
  all: ["papers"] as const,
  list: () => [...paperQueryKeys.all, "list"] as const,
  detail: (id: string) => [...paperQueryKeys.all, "detail", id] as const,
  byAuthor: (authorId: string) => [...paperQueryKeys.all, "author", authorId] as const,
};

export function usePapers() {
  const query = useQuery({
    queryKey: paperQueryKeys.list(),
    queryFn: async () => unwrapPaperListResponse(await getPapersService()),
  });

  return {
    ...query,
    papers: query.data?.results ?? [],
    loading: query.isPending,
    error: getErrorMessage(query.error),
  };
}

export function usePaper(id: string) {
  const query = useQuery({
    queryKey: paperQueryKeys.detail(id),
    queryFn: async () => unwrapPaperDetailResponse(await getPaperDetailService(id)),
    enabled: Boolean(id),
  });

  return {
    ...query,
    paper: query.data ?? null,
    loading: query.isPending,
    error: getErrorMessage(query.error),
  };
}

export function usePaperDetails(ids: string[]) {
  const uniqueIds = Array.from(new Set(ids.filter(Boolean)));
  const queries = useQueries({
    queries: uniqueIds.map((id) => ({
      queryKey: paperQueryKeys.detail(id),
      queryFn: async () => unwrapPaperDetailResponse(await getPaperDetailService(id)),
      enabled: Boolean(id),
    })),
  });

  return {
    ids: uniqueIds,
    queries,
    papers: queries.map((query) => query.data ?? null),
    loading: queries.some((query) => query.isPending),
    error: getErrorMessage(queries.find((query) => query.error)?.error),
  };
}

export function usePapersByAuthor(authorId: string) {
  const query = useQuery({
    queryKey: paperQueryKeys.byAuthor(authorId),
    queryFn: async () => unwrapPaperListResponse(await getPapersByAuthorService(authorId)),
    enabled: Boolean(authorId),
  });

  return {
    ...query,
    papers: query.data?.results ?? [],
    loading: query.isPending,
    error: getErrorMessage(query.error),
  };
}

function unwrapPaperListResponse(response: PaperListApiResponse): PagedResponse<PaperApiModel> {
  if (Array.isArray(response)) {
    return {
      total: response.length,
      page: 1,
      size: response.length,
      totalPages: 1,
      results: response,
    };
  }

  if ("results" in response || "items" in response || "papers" in response || "records" in response) {
    return response;
  }

  const apiResponse = response as Exclude<PaperListApiResponse, PagedResponse<PaperApiModel> | PaperApiModel[]>;
  const succeeded = apiResponse.success ?? apiResponse.succeeded ?? apiResponse.Succeeded ?? true;
  const result = apiResponse.result ?? apiResponse.Result ?? apiResponse.data ?? null;
  const errors = apiResponse.errors ?? apiResponse.Errors ?? [];

  if (!succeeded || !result) {
    throw new Error(errors.join(", ") || "Unable to load papers.");
  }

  if (Array.isArray(result)) {
    return {
      total: result.length,
      page: 1,
      size: result.length,
      totalPages: 1,
      results: result,
    };
  }

  return result;
}

function unwrapPaperDetailResponse(response: PaperDetailApiResponse): PaperApiModel {
  if (!response) {
    throw new Error("Paper not found.");
  }

  if ("id" in response || "paperId" in response) {
    return response as PaperApiModel;
  }

  const apiResponse = response as Exclude<PaperDetailApiResponse, PaperApiModel | null>;
  const succeeded = apiResponse.success ?? apiResponse.succeeded ?? apiResponse.Succeeded ?? true;
  const result = apiResponse.result ?? apiResponse.Result ?? apiResponse.data ?? null;
  const errors = apiResponse.errors ?? apiResponse.Errors ?? [];

  if (!succeeded || !result) {
    throw new Error(errors.join(", ") || "Paper not found.");
  }

  return result;
}

function getErrorMessage(error: unknown) {
  if (!error) return null;

  return error instanceof Error ? error.message : "Unable to connect to the paper service.";
}
