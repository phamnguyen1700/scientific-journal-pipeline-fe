export type JournalApiResponse<T> = {
  succeeded?: boolean;
  success?: boolean;
  result?: T;
  data?: T;
  errors?: string[];
};

export type JournalListResult = {
  total: number;
  page: number;
  size: number;
  totalPages?: number;
  results: Journal[];
};

export type Journal = {
  journalId: string;
  journalName: string;
  normalizedName: string | null;
  journalType: string | null;
  journalTypeId: string | null;
  worksCount: number;
  citedByCount: number;
  oaWorksCount: number | null;
  hIndex: number | null;
  i10Index: number | null;
  twoYearMeanCitedness: number | null;
  isOpenAccess: boolean;
  isInDoaj: boolean;
  isCore: boolean;
  firstPublicationYear: number | null;
  lastPublicationYear: number | null;
  countsByYear: string | JournalYearCount[] | null;
  sourceCreatedDate: string | null;
  sourceUpdatedDate: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  journalTypeNavigation: JournalTypeNavigation | null;
  topics: JournalTopic[];
  papers?: JournalPaper[];
};

export type JournalTypeNavigation = {
  journalTypeId: string;
  typeCode: string;
  displayName: string;
  createdAt: string | null;
};

export type JournalTopic = {
  journalTopicId: string;
  topicId: string;
  topicName: string;
  worksCount?: number | null;
  topicShare?: number | null;
};

export type JournalYearCount = {
  year: number;
  works_count?: number;
  worksCount?: number;
  cited_by_count?: number;
  citedByCount?: number;
  oa_works_count?: number;
  oaWorksCount?: number;
};

export type JournalPaper = {
  paperId: string;
  doi: string | null;
  title: string;
  abstract: string | null;
  publicationYear: number | null;
  publicationDate: string | null;
  paperType: string | null;
  language: string | null;
  citedByCount: number;
  referenceCount: number;
  page: string | null;
  isOpenAccess: boolean;
  isRetracted: boolean;
  journalId: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  paperAuthors?: JournalPaperAuthor[];
  paperTopics?: JournalPaperTopic[];
  paperKeywords?: JournalPaperKeyword[];
  userBookmarks?: unknown[];
};

export type JournalPaperAuthor = {
  authorId?: string;
  authorName?: string;
  rawAuthorName?: string;
  authorOrder?: number;
};

export type JournalPaperTopic = {
  topicId?: string;
  topicName?: string;
};

export type JournalPaperKeyword = {
  keywordId?: string;
  keywordName?: string;
};

export type JournalListApiResponse = JournalApiResponse<JournalListResult> | JournalListResult;
export type JournalDetailApiResponse = JournalApiResponse<Journal | null> | Journal | null;