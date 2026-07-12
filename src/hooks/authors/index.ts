"use client";

import { useQuery } from "@tanstack/react-query";

import { getAuthorDetailService } from "@/service/authors";
import type { AuthorDetail, AuthorDetailApiResponse } from "@/types/authors";

export const authorQueryKeys = {
  all: ["authors"] as const,
  detail: (id: string | null) => [...authorQueryKeys.all, "detail", id] as const,
};

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