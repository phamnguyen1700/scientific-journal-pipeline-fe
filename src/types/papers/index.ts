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
    journalId?: string;
    name?: string;
    title?: string;
    journalName?: string;
    issnL?: string | null;
    homepageUrl?: string | null;
    isOpenAccess?: boolean;
    isCore?: boolean;
  } | null;
  paperAuthors?: PaperAuthor[];
  paperAuthorResponseModels?: PaperAuthor[];
  paperTopics?: PaperTopic[];
  paperKeywords?: PaperKeyword[];
  paperSourceMappings?: PaperSourceMapping[];
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
