"use client";

import { useQuery } from "@tanstack/react-query";

import { searchPapersService } from "@/service/search";
import type {
  PaperSearchApiResponse,
  PaperSearchData,
  PaperSearchRequest,
} from "@/types/search";

export const searchQueryKeys = {
  all: ["search"] as const,
  papers: (request: PaperSearchRequest) =>
    [...searchQueryKeys.all, "papers", request] as const,
};

export function usePaperSearch(request: PaperSearchRequest = {}, enabled = true) {
  const normalizedRequest = normalizeRequest(request);
  const query = useQuery({
    queryKey: searchQueryKeys.papers(normalizedRequest),
    queryFn: async () => unwrapPaperSearchResponse(await searchPapersService(normalizedRequest)),
    enabled,
  });

  return {
    ...query,
    papers: query.data?.results ?? [],
    total: query.data?.total ?? 0,
    page: query.data?.page ?? normalizedRequest.page ?? 1,
    size: query.data?.size ?? normalizedRequest.size ?? 10,
    facets: query.data?.facets,
    loading: enabled && (query.isPending || query.isFetching),
    error: getErrorMessage(query.error),
  };
}

function unwrapPaperSearchResponse(response: PaperSearchApiResponse): PaperSearchData {
  const succeeded = response.succeeded ?? response.Succeeded ?? response.success ?? false;
  const result = response.result ?? response.Result ?? response.data ?? null;
  const errors = response.errors ?? response.Errors ?? [];

  if (!succeeded || !result) {
    throw new Error(errors.join(", ") || "Unable to search papers.");
  }

  return result;
}

function normalizeRequest<T extends object>(request: T) {
  return Object.fromEntries(
    Object.entries(request).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  ) as T;
}

function getErrorMessage(error: unknown) {
  if (!error) return null;

  return error instanceof Error
    ? error.message
    : "Unable to connect to the search service.";
}