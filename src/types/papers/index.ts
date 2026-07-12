export type ApiResult<T> = {
  succeeded?: boolean;
  Succeeded?: boolean;
  success?: boolean;
  result?: T;
  Result?: T;
  data?: T;
  errors?: string[];
  Errors?: string[];
};

export type PagedResponse<T> = {
  total?: number;
  page?: number;
  size?: number;
  totalPages?: number;
  results?: T[];
  items?: T[];
  data?: T[];
  papers?: T[];
  records?: T[];
};

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

export type PaperTopic = {
  paperTopicId?: string;
  topicId?: string;
  score?: number | null;
  topicName?: string;
  topic?: {
    topicId?: string;
    topicName?: string;
    normalizedName?: string;
  } | null;
};

export type PaperKeyword = {
  paperKeywordId?: string;
  keywordId?: string;
  score?: number | null;
  keywordName?: string;
  keyword?: {
    keywordId?: string;
    keywordName?: string;
    normalizedName?: string;
  } | null;
};

export type PaperSourceMapping = {
  paperSourceMappingId?: string;
  sourceRecordId?: string;
  sourceRecordUrl?: string;
  sourceSpecificData?: string | PaperSourceSpecificData | null;
};

export type PaperSourceSpecificData = {
  primary_topic?: {
    source_record_id?: string;
    display_name?: string;
    score?: number | null;
    domain?: {
      display_name?: string;
    };
    field?: {
      display_name?: string;
    };
    subfield?: {
      display_name?: string;
    };
  };
};

export type PaperJournalSummary = {
  journalId?: string;
  id?: string;
  name?: string;
  title?: string;
  journalName?: string;
  issnL?: string | null;
  homepageUrl?: string | null;
  isOpenAccess?: boolean;
  isCore?: boolean;
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
  createdAt?: string | null;
  updatedAt?: string | null;
  highlight?: {
    title?: string[];
    abstract?: string[];
  } | null;
  journalId: string | null;
  journal: PaperJournalSummary | null;
  paperAuthors?: PaperAuthor[];
  paperAuthorResponseModels?: PaperAuthor[];
  paperTopics?: PaperTopic[];
  paperKeywords?: PaperKeyword[];
  paperSourceMappings?: PaperSourceMapping[];
};

export type PaperListApiResponse =
  | ApiResult<PagedResponse<PaperApiModel> | PaperApiModel[]>
  | PagedResponse<PaperApiModel>
  | PaperApiModel[];

export type PaperDetailApiResponse =
  | ApiResult<PaperApiModel | null>
  | PaperApiModel
  | null;

export type PaperListResult = PagedResponse<PaperApiModel>;
