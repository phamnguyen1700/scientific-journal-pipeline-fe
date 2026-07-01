"use client";

import { useQuery } from "@tanstack/react-query";

import { getJournalsService } from "@/service/journals";
import type { Journal } from "@/types/journals";

export const journalQueryKeys = {
  all: ["journals"] as const,
  list: () => [...journalQueryKeys.all, "list"] as const,
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

function mapJournals(response: unknown): Journal[] {
  return extractArray(response).map((item, index) => {
    const record = asRecord(item);
    const journalId = readString(record, ["journalId", "id"]);
    const name =
      readString(record, ["journalName", "name", "title", "displayName"]) ??
      `Journal ${index + 1}`;

    return {
      id: journalId ?? index + 1,
      apiId: journalId,
      name,
      issnL: readString(record, ["issnL", "issn", "issnl"]) ?? null,
      publisher: readString(record, ["publisher", "publisherName", "source", "institution"]) ?? null,
      homepageUrl: readString(record, ["homepageUrl", "homepageURL", "url", "website"]) ?? null,
      papers: readNumber(record, ["papers", "paperCount", "worksCount", "count", "total", "volume"]) ?? 0,
      citations: readNumber(record, ["citations", "citationCount", "citedByCount"]) ?? 0,
      impactFactor: readNumber(record, ["impactFactor", "impact_factor", "hIndex", "hindex"]) ?? null,
      openAccess: readBoolean(record, ["isOpenAccess", "openAccess"]) ?? null,
      core: readBoolean(record, ["isCore", "core"]) ?? null,
    };
  });
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

function getErrorMessage(error: unknown) {
  if (!error) return null;

  return error instanceof Error ? error.message : "Unable to connect to the journal service.";
}
