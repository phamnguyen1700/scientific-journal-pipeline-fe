"use client";

import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { searchPapersService } from "@/service/search";
import type { PaperApiModel } from "@/types/papers";
import type { PaperSearchRequest } from "@/types/search";

export const searchQueryKeys = {
  all: ["search"] as const,
  papers: (request: PaperSearchRequest) => [...searchQueryKeys.all, "papers", request] as const,
};

export function usePaperSearch(initialRequest: PaperSearchRequest = {}) {
  const [request, setRequest] = useState(() => normalizePaperSearchRequest(initialRequest));
  const query = useQuery({
    queryKey: searchQueryKeys.papers(request),
    queryFn: async () => normalizePaperSearchResponse(await searchPapersService(request)),
  });

  const search = useCallback(async (nextRequest: PaperSearchRequest) => {
    setRequest(normalizePaperSearchRequest(nextRequest));
  }, []);

  return {
    ...query,
    papers: query.data ?? [],
    loading: query.isPending || query.isFetching,
    error: getErrorMessage(query.error),
    search,
  };
}

function normalizePaperSearchResponse(
  response: Awaited<ReturnType<typeof searchPapersService>>
): PaperApiModel[] {
  if (Array.isArray(response)) {
    return response;
  }

  const succeeded = response.succeeded ?? response.Succeeded ?? true;
  const result = response.result ?? response.Result ?? [];
  const errors = response.errors ?? response.Errors ?? [];

  if (!succeeded) {
    throw new Error(errors.join(", ") || "Unable to search papers.");
  }

  return Array.isArray(result) ? result : [];
}

function normalizePaperSearchRequest(request: PaperSearchRequest) {
  return Object.fromEntries(
    Object.entries(request).filter(([, value]) => value !== undefined && value !== null && value !== "")
  ) as PaperSearchRequest;
}

function getErrorMessage(error: unknown) {
  if (!error) return null;

  return error instanceof Error
    ? error.message
    : "Unable to connect to the search service.";
}
