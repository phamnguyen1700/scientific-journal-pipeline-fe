"use client";

import { useQuery } from "@tanstack/react-query";

import { getAuthorDetailService } from "@/service/authors";
import type { AuthorDetail, AuthorDetailApiResponse } from "@/types/authors";

export const authorQueryKeys = {
  all: ["authors"] as const,
  detail: (id: string) => [...authorQueryKeys.all, "detail", id] as const,
};

export function useAuthor(id: string) {
  const query = useQuery({
    queryKey: authorQueryKeys.detail(id),
    queryFn: async () => normalizeAuthorDetailResponse(await getAuthorDetailService(id)),
    enabled: Boolean(id),
  });

  return {
    ...query,
    author: query.data ?? null,
    loading: query.isPending,
    error: getErrorMessage(query.error),
  };
}

function normalizeAuthorDetailResponse(response: AuthorDetailApiResponse): AuthorDetail {
  if (isAuthorDetail(response)) {
    return response;
  }

  const succeeded = response.success ?? response.succeeded ?? response.Succeeded ?? true;
  const result = response.result ?? response.Result ?? response.data ?? null;
  const errors = response.errors ?? response.Errors ?? [];

  if (!succeeded || !result) {
    throw new Error(errors.join(", ") || "Author not found.");
  }

  return result;
}

function isAuthorDetail(response: AuthorDetailApiResponse): response is AuthorDetail {
  return "authorId" in response || "displayName" in response || "fullName" in response;
}

function getErrorMessage(error: unknown) {
  if (!error) return null;

  return error instanceof Error ? error.message : "Unable to connect to the author service.";
}
