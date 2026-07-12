import { apiEndpoints } from "@/config/apiEndpoints";
import { deleteRequest, get, post } from "@/service/apiClient";
import type {
  PaperSearchApiResponse,
  PaperSearchRequest,
} from "@/types/search";

export const searchPapersService = (request: PaperSearchRequest) =>
  get<PaperSearchApiResponse>(apiEndpoints.search.papers, {
    params: toPaperSearchParams(request),
  });


function toPaperSearchParams(request: PaperSearchRequest) {
  const params = new URLSearchParams();

  appendParam(params, "Q", request.q);
  appendParam(params, "Page", request.page);
  appendParam(params, "Size", request.size);
  appendParam(params, "From", request.from);
  appendParam(params, "To", request.to);
  appendParam(params, "Language", request.language);
  appendParam(params, "IsOpenAccess", request.isOpenAccess);
  appendArrayParam(params, "FilterJournal", request.filterJournal);
  appendArrayParam(params, "FilterAuthor", request.filterAuthor);
  appendArrayParam(params, "FilterKeyword", request.filterKeyword);
  appendArrayParam(params, "FilterYear", request.filterYear);

  return params;
}

function appendParam(
  params: URLSearchParams,
  key: string,
  value: string | number | boolean | undefined,
) {
  if (value === undefined || value === "") return;

  params.append(key, String(value));
}

function appendArrayParam(
  params: URLSearchParams,
  key: string,
  values: Array<string | number> | undefined,
) {
  values?.forEach((value) => appendParam(params, key, value));
}

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
