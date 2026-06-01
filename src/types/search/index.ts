export type PaperSearchFilters = {
  keywords: string;
  author: string;
  journal: string;
  year: string;
  openAccessOnly: boolean;
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
