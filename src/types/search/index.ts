export type PaperSearchFilters = {
  from: string;
  to: string;
  language: string;
  isOpenAccess: "" | "true" | "false";
  filterJournal: string;
  filterAuthor: string;
  filterKeyword: string;
  filterYear: string;
  filterTopic: string;
};

export type PaperSearchHighlight = {
  title?: string[];
  abstract?: string[];
};

export type PaperSearchPaper = {
  paperId: string;
  title: string;
  abstract: string | null;
  doi: string | null;
  publicationYear: number;
  citedByCount: number;
  authors: string[];
  keywords: string[];
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
  filterJournal?: string[];
  filterAuthor?: string[];
  filterKeyword?: string[];
  filterYear?: number[];
  filterTopic?: string[];
};

export type PaperSearchFacetItem = {
  label: string;
  value?: string;
  count: number;
};

export type PaperSearchFacets = {
  years: PaperSearchFacetItem[];
  topics: PaperSearchFacetItem[];
  journals: PaperSearchFacetItem[];
  authors: PaperSearchFacetItem[];
  keywords: PaperSearchFacetItem[];
  openAccess: {
    count: number;
    total: number;
  };
};

export type PaperSearchApiFacetItem = {
  value: string;
  count: number;
};

export type PaperSearchApiFacets = {
  years?: PaperSearchApiFacetItem[];
  journals?: PaperSearchApiFacetItem[];
  authors?: PaperSearchApiFacetItem[];
  keywords?: PaperSearchApiFacetItem[];
  topics?: PaperSearchApiFacetItem[];
};

export type PaperSearchData = {
  total: number;
  page: number;
  size: number;
  totalPages: number;
  results: PaperSearchPaper[];
  facets?: PaperSearchApiFacets;
};

export type PaperSearchApiResponse = {
  succeeded?: boolean;
  Succeeded?: boolean;
  success?: boolean;
  result?: PaperSearchData;
  Result?: PaperSearchData;
  data?: PaperSearchData;
  errors?: string[];
  Errors?: string[];
};
