import { apiEndpoints } from "@/config/apiEndpoints";
import { get } from "@/service/apiClient";

export const searchSemanticScholarService = (
  request: Record<string, string | number | boolean | undefined> = {}
) => get<unknown>(apiEndpoints.semanticScholar.search, { params: request });

export const semanticScholarService = {
  search: searchSemanticScholarService,
};
