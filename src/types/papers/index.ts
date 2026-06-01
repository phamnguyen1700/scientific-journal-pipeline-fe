export type PaperAuthor = {
  id?: string;
  name?: string;
  authorName?: string;
  rawAuthorName?: string;
  authorOrder?: number;
  author?: {
    displayName?: string;
    fullName?: string | null;
  } | null;
};

export type PaperApiModel = {
  id: string;
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
  journalId: string | null;
  journal: {
    name?: string;
    title?: string;
    journalName?: string;
  } | null;
  paperAuthorResponseModels: PaperAuthor[];
};

export type PaperListApiResponse = {
  succeeded: boolean;
  result: PaperApiModel[];
  errors: string[];
};

export type PaperDetailApiResponse = {
  succeeded: boolean;
  result: PaperApiModel | null;
  errors: string[];
};
