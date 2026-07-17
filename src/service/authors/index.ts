import { apiEndpoints } from "@/config/apiEndpoints";
import { get } from "@/service/apiClient";
import type { AuthorDetailApiResponse, AuthorListApiResponse } from "@/types/authors";

export const getAuthorsService = (page = 1, size = 10) =>
  get<AuthorListApiResponse>(apiEndpoints.authors.list, {
    params: { Page: page, Size: size },
  });

export const getAuthorDetailService = (id: string) =>
  get<AuthorDetailApiResponse>(apiEndpoints.authors.detail(id));

export const authorsService = {
  list: getAuthorsService,
  detail: getAuthorDetailService,
};

