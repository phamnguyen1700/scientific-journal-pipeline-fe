export type PaperSearchFilters = {
  from: string;
  to: string;
  language: string;
  isOpenAccess: "" | "true" | "false";
};

export type PaperSearchResult = {
  id: string;
  apiId: string;
  doi: string | null;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  citations: number;
  abstract: string;
  tags: string[];
  openAccess: boolean;
  bookmarked: boolean;
  publicationDate: string | null;
  paperType: string | null;
  language: string | null;
  referenceCount: number;
  retracted: boolean;
  highlight?: PaperSearchHighlight | null;
};

export type PaperSearchRequest = {
  q?: string;
  page?: number;
  size?: number;
  from?: number;
  to?: number;
  language?: string;
  isOpenAccess?: boolean;
};

export type PaperSearchHighlight = {
  title?: string[];
  abstract?: string[];
};

export type PaperSearchApiPaper = {
  paperId?: string;
  id?: string;
  doi?: string | null;
  title?: string;
  abstract?: string | null;
  publicationYear?: number;
  publicationDate?: string | null;
  citedByCount?: number;
  referenceCount?: number;
  paperType?: string | null;
  language?: string | null;
  isOpenAccess?: boolean;
  isRetracted?: boolean;
  journal?: {
    name?: string;
    title?: string;
    journalName?: string;
  } | null;
  paperAuthorResponseModels?: import("@/types/papers").PaperAuthor[];
  highlight?: PaperSearchHighlight | null;
};

export type PaperSearchData<T> = {
  total?: number;
  page?: number;
  size?: number;
  results?: T;
};

export type PaperSearchApiResponse<T> = {
  success?: boolean;
  data?: PaperSearchData<T> | T;
  succeeded?: boolean;
  Succeeded?: boolean;
  result?: PaperSearchData<T> | T;
  Result?: PaperSearchData<T> | T;
  errors?: string[];
  Errors?: string[];
};
