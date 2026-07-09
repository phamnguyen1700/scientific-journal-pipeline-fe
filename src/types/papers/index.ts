export type PaperAuthor = {
  authorId?: string;
  id?: string;
  name?: string;
  authorName?: string;
  rawAuthorName?: string;
  authorOrder?: number;
  author?: {
    authorId?: string;
    id?: string;
    displayName?: string;
    fullName?: string | null;
  } | null;
};

export type PaperApiModel = {
  id: string;
  paperId?: string;
  doi: string | null;
  title: string;
  abstract: string | null;
  publicationYear: number;
  publicationDate: string | null;
  paperType: string | null;
  language: string | null;
  citedByCount: number;
  referenceCount: number;
  volume: string | null;
  issue: string | null;
  page: string | null;
  isOpenAccess: boolean;
  isRetracted: boolean;
  highlight?: {
    title?: string[];
    abstract?: string[];
  } | null;
  journalId: string | null;
  journal: {
    name?: string;
    title?: string;
    journalName?: string;
  } | null;
  paperAuthors?: PaperAuthor[];
  paperAuthorResponseModels?: PaperAuthor[];
};

export type PaperListApiResponse = {
  succeeded?: boolean;
  Succeeded?: boolean;
  success?: boolean;
  data?: PaperApiModel[] | PaperListResult;
  result?: PaperApiModel[] | PaperListResult;
  Result?: PaperApiModel[] | PaperListResult;
  items?: PaperApiModel[];
  papers?: PaperApiModel[];
  records?: PaperApiModel[];
  errors?: string[];
  Errors?: string[];
} | PaperApiModel[];

export type PaperDetailApiResponse = {
  succeeded?: boolean;
  Succeeded?: boolean;
  result?: PaperApiModel | null;
  Result?: PaperApiModel | null;
  errors?: string[];
  Errors?: string[];
};

export type PaperListResult = {
  results?: PaperApiModel[];
  data?: PaperApiModel[];
  items?: PaperApiModel[];
  papers?: PaperApiModel[];
  records?: PaperApiModel[];
};
