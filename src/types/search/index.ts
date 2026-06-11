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

export type PaperSearchApiResponse<T> = {
  succeeded?: boolean;
  Succeeded?: boolean;
  result?: T;
  Result?: T;
  errors?: string[];
  Errors?: string[];
};
