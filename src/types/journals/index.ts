import type { PaperApiModel } from "@/types/papers";

export type Journal = {
  id: string | number;
  apiId?: string;
  name: string;
  issnL: string | null;
  issn: string[];
  publisher: string | null;
  homepageUrl: string | null;
  type: string | null;
  countryCode: string | null;
  hostOrganizationName: string | null;
  papers: number;
  openAccessPapers: number | null;
  citations: number;
  hIndex: number | null;
  i10Index: number | null;
  twoYearMeanCitedness: number | null;
  firstPublicationYear: number | null;
  lastPublicationYear: number | null;
  impactFactor: number | null;
  openAccess: boolean | null;
  inDoaj: boolean | null;
  core: boolean | null;
  topics: JournalTopic[];
  countsByYear: JournalYearCount[];
  relatedPapers: PaperApiModel[];
};

export type JournalTopic = {
  id?: string;
  name: string;
  count: number | null;
  topicShare: number | null;
  domain?: string | null;
  field?: string | null;
  subfield?: string | null;
};

export type JournalYearCount = {
  year: number;
  worksCount: number;
  citedByCount: number;
  openAccessWorksCount: number;
};
