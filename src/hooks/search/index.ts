"use client";

import { useQuery } from "@tanstack/react-query";

import { searchAuthorsService, searchPapersService } from "@/service/search";
import type { PaperApiModel } from "@/types/papers";
import type {
  PaperSearchApiPaper,
  PaperSearchFacetItem,
  PaperSearchFacets,
  PaperSearchRequest,
} from "@/types/search";

export const searchQueryKeys = {
  all: ["search"] as const,
  papers: (request: PaperSearchRequest) => [...searchQueryKeys.all, "papers", request] as const,
  authors: (request: Record<string, string | number | boolean | undefined>) => [...searchQueryKeys.all, "authors", request] as const,
};

export function usePaperSearch(initialRequest: PaperSearchRequest = {}, enabled = true) {
  const request = normalizePaperSearchRequest(initialRequest);
  const query = useQuery({
    queryKey: searchQueryKeys.papers(request),
    queryFn: async () => normalizePaperSearchResponse(await searchPapersService(request)),
    enabled,
  });

  return {
    ...query,
    papers: query.data?.papers ?? [],
    total: query.data?.total ?? 0,
    page: query.data?.page ?? request.page ?? 1,
    size: query.data?.size ?? request.size ?? 10,
    facets: query.data?.facets ?? emptyFacets,
    loading: enabled && (query.isPending || query.isFetching),
    error: getErrorMessage(query.error),
  };
}

export function useAuthorSearch(request: Record<string, string | number | boolean | undefined> = {}) {
  const normalizedRequest = normalizePaperSearchRequest(request);
  const query = useQuery({
    queryKey: searchQueryKeys.authors(normalizedRequest),
    queryFn: async () => normalizeAuthorSearchResponse(await searchAuthorsService(normalizedRequest)),
    staleTime: 5 * 60 * 1000,
  });

  return {
    ...query,
    authors: query.data ?? [],
    loading: query.isPending || query.isFetching,
    error: getErrorMessage(query.error),
  };
}

function normalizePaperSearchResponse(
  response: Awaited<ReturnType<typeof searchPapersService>>
): { papers: PaperApiModel[]; total: number; page: number; size: number; facets: PaperSearchFacets } {
  if (Array.isArray(response)) {
    return {
      papers: response,
      total: response.length,
      page: 1,
      size: response.length,
      facets: emptyFacets,
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

function normalizePaperSearchRequest<T extends object>(request: T) {
  return Object.fromEntries(
    Object.entries(request).filter(([, value]) => value !== undefined && value !== null && value !== "")
  ) as T;
}

function getErrorMessage(error: unknown) {
  if (!error) return null;

  return error instanceof Error
    ? error.message
    : "Unable to connect to the search service.";
}

function normalizePaperSearchPayload(
  payload:
    | PaperSearchApiPaper[]
    | PaperApiModel[]
    | {
        total?: number;
        page?: number;
        size?: number;
        results?: PaperSearchApiPaper[] | PaperApiModel[];
        facets?: Partial<PaperSearchFacets>;
        aggregations?: Partial<PaperSearchFacets>;
      }
): { papers: PaperApiModel[]; total: number; page: number; size: number; facets: PaperSearchFacets } {
  if (Array.isArray(payload)) {
    return {
      papers: payload.map(mapSearchPaper),
      total: payload.length,
      page: 1,
      size: payload.length,
      facets: emptyFacets,
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
    facets: normalizeFacets(payload.facets ?? payload.aggregations),
  };
}

const emptyFacets: PaperSearchFacets = {
  years: [],
  topics: [],
  journals: [],
  authors: [],
  types: [],
  openAccess: {
    count: 0,
    total: 0,
  },
};

function normalizeFacets(facets?: Partial<PaperSearchFacets>): PaperSearchFacets {
  if (!facets) return emptyFacets;

  return {
    years: normalizeFacetItems(facets.years),
    topics: normalizeFacetItems(facets.topics),
    journals: normalizeFacetItems(facets.journals),
    authors: normalizeFacetItems(facets.authors),
    types: normalizeFacetItems(facets.types),
    openAccess: {
      count: facets.openAccess?.count ?? 0,
      total: facets.openAccess?.total ?? 0,
    },
  };
}

function normalizeFacetItems(items?: PaperSearchFacetItem[]) {
  return Array.isArray(items)
    ? items
        .filter((item) => item.label && Number.isFinite(item.count))
        .map((item) => ({ label: item.label, count: item.count }))
    : [];
}

function normalizeAuthorSearchResponse(response: unknown): PaperSearchFacetItem[] {
  return extractArray(response)
    .map((item, index) => {
      const record = asRecord(item);
      const label =
        readString(record, ["displayName", "fullName", "name", "authorName", "rawAuthorName", "title"]) ??
        `Author ${index + 1}`;
      const count = readNumber(record, ["paperCount", "papers", "count", "total", "citedByCount", "citations"]) ?? 0;

      return { label, count };
    })
    .filter((item) => item.label)
    .sort((first, second) => second.count - first.count || first.label.localeCompare(second.label))
    .slice(0, 12);
}

function extractArray(response: unknown): unknown[] {
  const payload = extractPayload(response);
  if (Array.isArray(payload)) return payload;

  const record = asRecord(payload);
  if (!record) return [];

  const candidates = [record.results, record.items, record.data, record.records, record.authors, record.papers];
  const array = candidates.find(Array.isArray);

  return array ?? [];
}

function extractPayload(response: unknown): unknown {
  const record = asRecord(response);
  if (!record) return response;

  return record.data ?? record.result ?? record.Result ?? response;
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
