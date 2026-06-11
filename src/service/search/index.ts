import { apiEndpoints } from "@/config/apiEndpoints";
import { get } from "@/service/apiClient";
import type { PaperApiModel } from "@/types/papers";
import type {
  PaperSearchApiResponse,
  PaperSearchRequest,
} from "@/types/search";

export const searchPapersService = (request: PaperSearchRequest) =>
  get<PaperSearchApiResponse<PaperApiModel[]> | PaperApiModel[]>(
    apiEndpoints.search.papers,
    { params: request }
  );

export const searchService = {
  papers: searchPapersService,
};
