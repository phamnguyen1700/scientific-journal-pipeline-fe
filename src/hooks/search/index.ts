"use client";

import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { searchPapersService } from "@/service/search";
import type { PaperApiModel } from "@/types/papers";
import type { PaperSearchApiPaper, PaperSearchRequest } from "@/types/search";

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
    papers: query.data?.papers ?? [],
    total: query.data?.total ?? 0,
    page: query.data?.page ?? request.page ?? 1,
    size: query.data?.size ?? request.size ?? 10,
    loading: query.isPending || query.isFetching,
    error: getErrorMessage(query.error),
    search,
  };
}

function normalizePaperSearchResponse(
  response: Awaited<ReturnType<typeof searchPapersService>>
): { papers: PaperApiModel[]; total: number; page: number; size: number } {
  if (Array.isArray(response)) {
    return {
      papers: response,
      total: response.length,
      page: 1,
      size: response.length,
    };
  }

  const succeeded = response.success ?? response.succeeded ?? response.Succeeded ?? true;
  const data = response.data;
  const result = response.result ?? response.Result ?? [];
  const errors = response.errors ?? response.Errors ?? [];

  if (!succeeded) {
    throw new Error(errors.join(", ") || "Unable to search papers.");
  }

  return normalizePaperSearchPayload(data ?? result);
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

function normalizePaperSearchPayload(
  payload: PaperSearchApiPaper[] | PaperApiModel[] | { total?: number; page?: number; size?: number; results?: PaperSearchApiPaper[] | PaperApiModel[] }
): { papers: PaperApiModel[]; total: number; page: number; size: number } {
  if (Array.isArray(payload)) {
    return {
      papers: payload.map(mapSearchPaper),
      total: payload.length,
      page: 1,
      size: payload.length,
    };
  }

  const papers = Array.isArray(payload.results)
    ? payload.results.map(mapSearchPaper)
    : [];

  return {
    papers,
    total: payload.total ?? papers.length,
    page: payload.page ?? 1,
    size: payload.size ?? papers.length,
  };
}

function mapSearchPaper(paper: PaperSearchApiPaper | PaperApiModel): PaperApiModel {
  const paperId = "paperId" in paper ? paper.paperId : undefined;

  return {
    id: paper.id ?? paperId ?? "",
    doi: paper.doi ?? null,
    title: paper.title ?? "Untitled paper",
    abstract: paper.abstract ?? null,
    publicationYear: paper.publicationYear ?? 0,
    publicationDate: paper.publicationDate ?? null,
    paperType: paper.paperType ?? null,
    language: paper.language ?? null,
    citedByCount: paper.citedByCount ?? 0,
    referenceCount: paper.referenceCount ?? 0,
    volume: "volume" in paper ? paper.volume : null,
    issue: "issue" in paper ? paper.issue : null,
    page: "page" in paper ? paper.page : null,
    isOpenAccess: paper.isOpenAccess ?? false,
    isRetracted: paper.isRetracted ?? false,
    journalId: "journalId" in paper ? paper.journalId : null,
    journal: paper.journal ?? null,
    paperAuthorResponseModels: paper.paperAuthorResponseModels ?? [],
    highlight: paper.highlight ?? null,
  };
}
