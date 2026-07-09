import { apiEndpoints } from "@/config/apiEndpoints";
import { get } from "@/service/apiClient";
import type { AuthorDetailApiResponse } from "@/types/authors";

export const getAuthorDetailService = (id: string) =>
  get<AuthorDetailApiResponse>(apiEndpoints.authors.detail(id));

export const authorsService = {
  detail: getAuthorDetailService,
};

