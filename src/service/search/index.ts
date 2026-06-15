import { apiEndpoints } from "@/config/apiEndpoints";
import { deleteRequest, get, post } from "@/service/apiClient";
import type { PaperApiModel } from "@/types/papers";
import type {
  PaperSearchApiResponse,
  PaperSearchApiPaper,
  PaperSearchRequest,
} from "@/types/search";

export const searchPapersService = (request: PaperSearchRequest) =>
  get<PaperSearchApiResponse<PaperSearchApiPaper[]> | PaperApiModel[]>(
    apiEndpoints.search.papers,
    { params: request }
  );

export const searchAuthorsService = (request: Record<string, string | number | boolean | undefined> = {}) =>
  get<unknown>(apiEndpoints.search.authors, { params: request });

export const reindexPapersService = () =>
  post<unknown>(apiEndpoints.search.paperReindex);

export const reindexPapersBackgroundService = () =>
  post<unknown>(apiEndpoints.search.paperReindexBackground);

export const deletePaperIndexService = () =>
  deleteRequest<unknown>(apiEndpoints.search.paperIndex);

export const recreatePaperIndexService = () =>
  post<unknown>(apiEndpoints.search.paperIndexRecreate);

export const recreatePaperIndexBackgroundService = () =>
  post<unknown>(apiEndpoints.search.paperIndexRecreateBackground);

export const reindexAuthorsService = () =>
  post<unknown>(apiEndpoints.search.authorReindex);

export const reindexAuthorsBackgroundService = () =>
  post<unknown>(apiEndpoints.search.authorReindexBackground);

export const deleteAuthorIndexService = () =>
  deleteRequest<unknown>(apiEndpoints.search.authorIndex);

export const recreateAuthorIndexService = () =>
  post<unknown>(apiEndpoints.search.authorIndexRecreate);

export const recreateAuthorIndexBackgroundService = () =>
  post<unknown>(apiEndpoints.search.authorIndexRecreateBackground);

export const searchService = {
  papers: searchPapersService,
  authors: searchAuthorsService,
  reindexPapers: reindexPapersService,
  reindexPapersBackground: reindexPapersBackgroundService,
  deletePaperIndex: deletePaperIndexService,
  recreatePaperIndex: recreatePaperIndexService,
  recreatePaperIndexBackground: recreatePaperIndexBackgroundService,
  reindexAuthors: reindexAuthorsService,
  reindexAuthorsBackground: reindexAuthorsBackgroundService,
  deleteAuthorIndex: deleteAuthorIndexService,
  recreateAuthorIndex: recreateAuthorIndexService,
  recreateAuthorIndexBackground: recreateAuthorIndexBackgroundService,
};
