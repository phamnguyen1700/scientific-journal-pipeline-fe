"use client";

import { useQuery } from "@tanstack/react-query";

import { getJournalDetailService, getJournalsService } from "@/service/journals";
import type { Journal, JournalTopic, JournalYearCount } from "@/types/journals";

export const journalQueryKeys = {
  all: ["journals"] as const,
  list: () => [...journalQueryKeys.all, "list"] as const,
  detail: (id: string) => [...journalQueryKeys.all, "detail", id] as const,
};

export function useJournals() {
  const query = useQuery({
    queryKey: journalQueryKeys.list(),
    queryFn: async () => mapJournals(await getJournalsService()),
    staleTime: 5 * 60 * 1000,
  });

  return {
    ...query,
    journals: query.data ?? [],
    loading: query.isPending,
    error: getErrorMessage(query.error),
  };
}

export function useJournal(id: string) {
  const query = useQuery({
    queryKey: journalQueryKeys.detail(id),
    queryFn: async () => mapJournalDetail(await getJournalDetailService(id), id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });

  return {
    ...query,
    journal: query.data ?? null,
    loading: query.isPending,
    error: getErrorMessage(query.error),
  };
}

function mapJournals(response: unknown): Journal[] {
  return extractArray(response).map((item, index) => mapJournal(item, index));
}

function mapJournalDetail(response: unknown, fallbackId: string): Journal {
  const payload = extractPayload(response);
  const record = asRecord(payload);
  const detail = record?.journal ?? record?.source ?? payload;

  return mapJournal(detail, 0, fallbackId);
}

function mapJournal(item: unknown, index: number, fallbackId?: string): Journal {
  const record = asRecord(item);
  const sourceMapping = getFirstRecord(record?.journalSourceMappings);
  const sourceData = parseJsonRecord(sourceMapping?.sourceSpecificData);
  const typeRecord = asRecord(record?.journalTypeNavigation);
  const journalId = readString(record, ["journalId", "id"]) ?? fallbackId;
  const name =
    readString(record, ["journalName", "name", "title", "displayName"]) ??
    readString(sourceData, ["display_name"]) ??
    `Journal ${index + 1}`;
  const issnL = readString(record, ["issnL", "issn", "issnl"]) ?? readString(sourceData, ["issn_l"]) ?? null;
  const issn = readStringArray(sourceData, ["issn"]);
  const topics = mapJournalTopics(record?.journalTopics, sourceData?.topics);
  const countsByYear = mapCountsByYear(sourceData?.counts_by_year);

  return {
    id: journalId ?? index + 1,
    apiId: journalId,
    name,
    issnL,
    issn,
    publisher:
      readString(record, ["publisher", "publisherName", "source", "institution"]) ??
      readString(sourceData, ["host_organization_name"]) ??
      null,
    homepageUrl: readString(record, ["homepageUrl", "homepageURL", "url", "website"]) ?? readString(sourceData, ["homepage_url"]) ?? null,
    type: readString(typeRecord, ["displayName", "typeCode"]) ?? readString(sourceData, ["type"]) ?? null,
    countryCode: readString(sourceData, ["country_code"]) ?? null,
    hostOrganizationName: readString(sourceData, ["host_organization_name"]) ?? null,
    papers: readNumber(record, ["papers", "paperCount", "worksCount", "count", "total", "volume"]) ?? readNumber(sourceData, ["works_count"]) ?? 0,
    openAccessPapers: readNumber(sourceData, ["oa_works_count"]) ?? null,
    citations: readNumber(record, ["citations", "citationCount", "citedByCount"]) ?? readNumber(sourceData, ["cited_by_count"]) ?? 0,
    hIndex: readNumber(sourceData, ["h_index"]) ?? readNumber(record, ["hIndex", "hindex"]) ?? null,
    i10Index: readNumber(sourceData, ["i10_index"]) ?? null,
    twoYearMeanCitedness: readNumber(sourceData, ["two_year_mean_citedness"]) ?? null,
    firstPublicationYear: readNumber(sourceData, ["first_publication_year"]) ?? null,
    lastPublicationYear: readNumber(sourceData, ["last_publication_year"]) ?? null,
    impactFactor: readNumber(record, ["impactFactor", "impact_factor", "hIndex", "hindex"]) ?? readNumber(sourceData, ["h_index"]) ?? null,
    openAccess: readBoolean(record, ["isOpenAccess", "openAccess"]) ?? readBoolean(sourceData, ["is_oa"]) ?? null,
    inDoaj: readBoolean(sourceData, ["is_in_doaj"]) ?? null,
    core: readBoolean(record, ["isCore", "core"]) ?? readBoolean(sourceData, ["is_core"]) ?? null,
    topics,
    countsByYear,
  };
}

function extractPayload(response: unknown): unknown {
  const record = asRecord(response);
  if (!record) return response;

  return record.data ?? record.result ?? record.Result ?? response;
}

function extractArray(response: unknown): unknown[] {
  const payload = extractPayload(response);
  if (Array.isArray(payload)) return payload;

  const record = asRecord(payload);
  if (!record) return [];

  const candidates = [record.results, record.items, record.data, record.records, record.journals, record.sources];
  const array = candidates.find(Array.isArray);

  return array ?? [];
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function readString(record: Record<string, unknown> | null | undefined, keys: string[]) {
  for (const key of keys) {
    const value = record?.[key];
    if (typeof value === "string" && value.trim()) return value;
  }

  return undefined;
}

function readStringArray(record: Record<string, unknown> | null | undefined, keys: string[]) {
  for (const key of keys) {
    const value = record?.[key];
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === "string" && Boolean(item.trim()));
    }
  }

  return [];
}

function readNumber(record: Record<string, unknown> | null | undefined, keys: string[]) {
  for (const key of keys) {
    const value = record?.[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }

  return undefined;
}

function readBoolean(record: Record<string, unknown> | null | undefined, keys: string[]) {
  for (const key of keys) {
    const value = record?.[key];
    if (typeof value === "boolean") return value;
  }

  return undefined;
}

function getFirstRecord(value: unknown) {
  return Array.isArray(value) ? asRecord(value[0]) : null;
}

function parseJsonRecord(value: unknown) {
  if (!value) return null;
  if (typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  if (typeof value !== "string") return null;

  try {
    return asRecord(JSON.parse(value));
  } catch {
    return null;
  }
}

function mapJournalTopics(journalTopics: unknown, sourceTopics: unknown): JournalTopic[] {
  const fromJournalTopics = Array.isArray(journalTopics)
    ? journalTopics.map((item): JournalTopic | null => {
        const record = asRecord(item);
        const topic = asRecord(record?.topic);
        const name = readString(topic, ["topicName", "name", "displayName"]) ?? readString(record, ["topicName", "display_name"]);

        if (!name) return null;

        return {
          id: readString(topic, ["topicId", "id"]) ?? readString(record, ["topicId", "id"]),
          name,
          count: readNumber(record, ["worksCount", "count"]) ?? null,
          topicShare: readNumber(record, ["topicShare", "topic_share"]) ?? null,
        };
      }).filter((topic): topic is JournalTopic => Boolean(topic))
    : [];

  if (fromJournalTopics.length) return fromJournalTopics;

  return Array.isArray(sourceTopics)
    ? sourceTopics.map((item): JournalTopic | null => {
        const record = asRecord(item);
        const domain = asRecord(record?.domain);
        const field = asRecord(record?.field);
        const subfield = asRecord(record?.subfield);
        const name = readString(record, ["display_name", "topicName", "name"]);

        if (!name) return null;

        return {
          id: readString(record, ["source_record_id", "id"]),
          name,
          count: readNumber(record, ["count"]) ?? null,
          topicShare: readNumber(record, ["topic_share"]) ?? null,
          domain: readString(domain, ["display_name"]) ?? null,
          field: readString(field, ["display_name"]) ?? null,
          subfield: readString(subfield, ["display_name"]) ?? null,
        };
      }).filter((topic): topic is JournalTopic => Boolean(topic))
    : [];
}

function mapCountsByYear(value: unknown): JournalYearCount[] {
  if (!Array.isArray(value)) return [];

  return value.map((item) => {
    const record = asRecord(item);
    const year = readNumber(record, ["year"]);

    if (!year) return null;

    return {
      year,
      worksCount: readNumber(record, ["works_count"]) ?? 0,
      citedByCount: readNumber(record, ["cited_by_count"]) ?? 0,
      openAccessWorksCount: readNumber(record, ["oa_works_count"]) ?? 0,
    };
  }).filter((count): count is JournalYearCount => Boolean(count));
}

function getErrorMessage(error: unknown) {
  if (!error) return null;

  return error instanceof Error ? error.message : "Unable to connect to the journal service.";
}
