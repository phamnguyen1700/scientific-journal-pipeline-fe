import type { PaperAuthor, PaperApiModel } from "@/types/papers";

export type AuthorInstitution = {
  country_code?: string;
  display_name?: string;
  id?: string;
  ror?: string;
  type?: string;
};

export type AuthorAffiliation = {
  institution?: AuthorInstitution;
  years?: number[];
};

export type AuthorTopic = {
  count?: number;
  display_name?: string;
  id?: string;
  value?: number;
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

export type AuthorConcept = {
  display_name?: string;
  id?: string;
  score?: number;
  wikidata?: string;
};

export type AuthorYearCount = {
  year?: number;
  works_count?: number;
  cited_by_count?: number;
  oa_works_count?: number;
};

export type AuthorSourceSpecificData = {
  source_record_id?: string;
  source_record_url?: string;
  raw_author_names?: string[];
  display_name_alternatives?: string[];
  affiliations?: AuthorAffiliation[];
  last_known_institutions?: AuthorInstitution[];
  topics?: AuthorTopic[];
  topic_share?: AuthorTopic[];
  x_concepts?: AuthorConcept[];
  counts_by_year?: AuthorYearCount[];
  works_api_url?: string;
  source_created_date?: string;
  source_updated_date?: string;
};

export type AuthorSourceMapping = {
  sourceRecordId?: string;
  sourceRecordUrl?: string;
  sourceSpecificData?: string | AuthorSourceSpecificData | null;
};

export type AuthorDetail = {
  authorId?: string;
  id?: string;
  displayName?: string;
  fullName?: string | null;
  orcid?: string | null;
  worksCount?: number;
  citedByCount?: number;
  hIndex?: number;
  i10Index?: number;
  twoYearMeanCitedness?: number | null;
  affiliations?: string | AuthorAffiliation[] | null;
  lastKnownInstitutions?: string | AuthorInstitution[] | null;
  authorSourceMappings?: AuthorSourceMapping[];
  paperAuthors?: (PaperAuthor & { paper?: PaperApiModel | null })[];
};

export type AuthorDetailApiResponse =
  | {
      succeeded?: boolean;
      Succeeded?: boolean;
      success?: boolean;
      result?: AuthorDetail | null;
      Result?: AuthorDetail | null;
      data?: AuthorDetail | null;
      errors?: string[];
      Errors?: string[];
    }
  | AuthorDetail;

