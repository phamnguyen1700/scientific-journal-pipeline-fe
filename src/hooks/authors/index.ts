"use client";

import { useQuery } from "@tanstack/react-query";

import { getAuthorDetailService, getAuthorsService } from "@/service/authors";
import type {
  AuthorDetail,
  AuthorDetailApiResponse,
  AuthorListApiResponse,
  AuthorListResult,
} from "@/types/authors";

export const authorQueryKeys = {
  all: ["authors"] as const,
  list: (page: number, size: number) => [...authorQueryKeys.all, "list", page, size] as const,
  detail: (id: string | null) => [...authorQueryKeys.all, "detail", id] as const,
};

const emptyAuthorList: AuthorListResult = {
  total: 0,
  page: 1,
  size: 0,
  totalPages: 0,
  results: [],
};

export function useAuthors(page = 1, size = 10) {
  const query = useQuery({
    queryKey: authorQueryKeys.list(page, size),
    queryFn: async () => unwrapAuthorListResponse(await getAuthorsService(page, size)),
    staleTime: 5 * 60 * 1000,
  });

  const authorList = query.data ?? emptyAuthorList;

  return {
    ...query,
    authorList,
    authors: authorList.results,
    loading: query.isPending,
    error: getErrorMessage(query.error),
  };
}

export function useAuthor(id: string | null) {
  const query = useQuery({
    queryKey: authorQueryKeys.detail(id),
    queryFn: async () => unwrapAuthorDetailResponse(await getAuthorDetailService(id ?? "")),
    enabled: Boolean(id),
  });

  return {
    ...query,
    author: query.data ?? null,
    loading: query.isPending,
    error: getErrorMessage(query.error),
  };
}

function unwrapAuthorDetailResponse(response: AuthorDetailApiResponse): AuthorDetail {
  if ("authorId" in response || "displayName" in response || "fullName" in response) {
    return response;
  }

  const apiResponse = response as Exclude<AuthorDetailApiResponse, AuthorDetail>;
  const succeeded = apiResponse.success ?? apiResponse.succeeded ?? apiResponse.Succeeded ?? false;
  const result = apiResponse.result ?? apiResponse.Result ?? apiResponse.data ?? null;
  const errors = apiResponse.errors ?? apiResponse.Errors ?? [];

  if (!succeeded || !result) {
    throw new Error(errors.join(", ") || "Author not found.");
  }

  return result;
}

function getErrorMessage(error: unknown) {
  if (!error) return null;

  return error instanceof Error ? error.message : "Unable to connect to the author service.";
}

function unwrapAuthorListResponse(response: AuthorListApiResponse): AuthorListResult {
  if ("results" in response) {
    return response;
  }

  const succeeded = response.succeeded ?? response.Succeeded ?? response.success ?? false;
  const result = response.result ?? response.Result ?? response.data ?? null;
  const errors = response.errors ?? response.Errors ?? [];

  if (!succeeded || !result) {
    throw new Error(errors.join(", ") || "Unable to load authors.");
  }

  return result;
}
