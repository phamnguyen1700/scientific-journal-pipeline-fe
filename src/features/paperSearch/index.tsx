"use client";

import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import {
  PaperResultCard,
  PaperSearchFilters,
  PaperSearchHeader,
  PaperSearchInsights,
  PaperSearchPagination,
  PaperSearchToolbar,
} from "@/features/paperSearch/components";
import { toPaperSearchResult } from "@/features/paperSearch/paperMapper";
import {
  useJournalOpenAccessRatio,
  useKeywordWordCloud,
  usePapersByYear,
  useTopAuthorsByCitations,
  useTopJournalsByPaperCount,
  useTopTopics,
} from "@/hooks/analytics";
import { useJournals } from "@/hooks/journals";
import { usePapers } from "@/hooks/papers";
import { useAuthorSearch, usePaperSearch } from "@/hooks/search";
import { useTopics } from "@/hooks/topics";
import { useUserBookmarks } from "@/hooks/user";
import type { AnalyticsKeyValue } from "@/types/analytics";
import type { Journal } from "@/types/journals";
import type {
  PaperSearchFilters as PaperSearchFiltersValue,
  PaperSearchFacetItem,
  PaperSearchFacets,
  PaperSearchResult,
} from "@/types/search";

const initialFilters: PaperSearchFiltersValue = {
  from: "",
  to: "",
  language: "",
  isOpenAccess: "",
};

const pageSize = 10;

type PaperSearchFormValues = PaperSearchFiltersValue & {
  q: string;
  page: number;
  size: number;
};

const initialSearchValues: PaperSearchFormValues = {
  q: "",
  page: 1,
  size: pageSize,
  ...initialFilters,
};

export function PaperSearchPage() {
  const { control, reset, setValue } = useForm<PaperSearchFormValues>({
    defaultValues: initialSearchValues,
  });
  const formValues = useWatch({ control });
  const q = formValues.q ?? "";
  const from = formValues.from ?? "";
  const to = formValues.to ?? "";
  const language = formValues.language ?? "";
  const isOpenAccess = formValues.isOpenAccess ?? "";
  const page = formValues.page ?? 1;
  const size = formValues.size ?? pageSize;
  const filters: PaperSearchFiltersValue = { from, to, language, isOpenAccess };
  const hasSearchCriteria = Boolean(q.trim() || from || to || language || isOpenAccess);
  const searchRequest = toPaperSearchRequest({ q, from, to, language, isOpenAccess, page, size });
  const paperQuery = usePaperSearch(searchRequest);
  const allPapersQuery = usePapers();
  const journalsQuery = useJournals();
  const topicsQuery = useTopics();
  const authorsQuery = useAuthorSearch({ q, size: 12 });
  const papersByYearQuery = usePapersByYear();
  const topTopicsQuery = useTopTopics(12);
  const keywordWordCloudQuery = useKeywordWordCloud(12);
  const topJournalsQuery = useTopJournalsByPaperCount(12);
  const topAuthorsQuery = useTopAuthorsByCitations(12);
  const openAccessRatioQuery = useJournalOpenAccessRatio();
  const bookmarksQuery = useUserBookmarks();
  const searchHasResults = paperQuery.papers.length > 0 || paperQuery.total > 0;
  const useAllPapersFallback = !hasSearchCriteria && !paperQuery.loading && Boolean(paperQuery.error || !searchHasResults);
  const activePaperSource = useAllPapersFallback ? "all" : "search";

  const papers = useMemo(
    () =>
      (activePaperSource === "search" ? paperQuery.papers : allPapersQuery.papers).map((paper, index) => {
        const result = toPaperSearchResult(paper, index);

        return { ...result, bookmarked: bookmarksQuery.papers.some((bookmark) => String(bookmark.id) === result.id || bookmark.apiId === result.apiId) };
      }),
    [activePaperSource, allPapersQuery.papers, bookmarksQuery.papers, paperQuery.papers]
  );

  const visiblePapers = useMemo(
    () => activePaperSource === "search" ? papers : papers.slice((page - 1) * size, page * size),
    [activePaperSource, page, papers, size]
  );
  const resultCount = activePaperSource === "search" ? paperQuery.total : papers.length;
  const loading = paperQuery.loading || (useAllPapersFallback && allPapersQuery.loading);
  const error = useAllPapersFallback ? allPapersQuery.error : paperQuery.error;
  const relatedFacets = useMemo(
    () =>
      mergeFacets(
        mergeFacets(
          activePaperSource === "search" ? paperQuery.facets : emptyFacets,
          buildApiFacets({
            authors: authorsQuery.authors.length ? authorsQuery.authors : toFacetItems(topAuthorsQuery.data),
            journals: buildJournalFacets(journalsQuery.journals, topJournalsQuery.data, papers),
            keywords: toFacetItems(keywordWordCloudQuery.data),
            openAccessRatios: openAccessRatioQuery.data,
            openAccessTotal: resultCount,
            paperYears: toFacetItems(papersByYearQuery.data, "asc"),
            topics: topicsQuery.topics.length
              ? topicsQuery.topics.map((topic) => ({ label: topic.name, count: topic.papers }))
              : toFacetItems(topTopicsQuery.data),
          })
        ),
        buildFacetsFromPapers(papers, resultCount)
      ),
    [
      activePaperSource,
      authorsQuery.authors,
      journalsQuery.journals,
      keywordWordCloudQuery.data,
      openAccessRatioQuery.data,
      paperQuery.facets,
      papers,
      papersByYearQuery.data,
      resultCount,
      topAuthorsQuery.data,
      topJournalsQuery.data,
      topTopicsQuery.data,
      topicsQuery.topics,
    ]
  );
  const suggestions = useMemo(
    () => buildSuggestions(q, papers, relatedFacets),
    [papers, q, relatedFacets]
  );

  const currentPage = page;
  const pageCount = Math.max(1, Math.ceil(resultCount / size));

  function updateQuery(value: string) {
    setValue("q", value);
    setValue("page", 1);
  }

  function updateFilters(value: PaperSearchFiltersValue) {
    setValue("from", value.from);
    setValue("to", value.to);
    setValue("language", value.language);
    setValue("isOpenAccess", value.isOpenAccess);
    setValue("page", 1);
  }

  function updateYear(year: number) {
    setValue("from", String(year));
    setValue("to", String(year));
    setValue("page", 1);
  }

  function resetFilters() {
    reset({ ...initialSearchValues, q });
  }

  function toggleBookmark(id: string) {
    const paper = papers.find((item) => item.id === id);
    const paperId = paper?.apiId ?? id;

    if (paper?.bookmarked) {
      bookmarksQuery.removeBookmark(paperId);
    } else {
      bookmarksQuery.addBookmark(paperId);
    }
  }

  return (
    <div className="paper-search-page">
      <PaperSearchHeader />
      <section className="paper-search-controls">
        <PaperSearchToolbar
          query={q}
          resultCount={resultCount}
          suggestions={suggestions}
          onQueryChange={updateQuery}
        />
      </section>
      <PaperSearchFilters
        facets={{
          authors: relatedFacets.authors,
          journals: relatedFacets.journals,
          topics: relatedFacets.topics,
          types: relatedFacets.types,
          years: relatedFacets.years,
        }}
        filters={filters}
        onChange={updateFilters}
        onFacetSelect={updateQuery}
        onReset={resetFilters}
      />

      <div className="paper-search-layout">
        <section className="paper-search-results">
          {loading ? (
            <PaperSearchStatus title="Loading papers..." description={hasSearchCriteria ? "Searching matching papers from the server." : "Fetching all papers from the server."} />
          ) : error ? (
            <PaperSearchStatus title="Unable to load papers" description={error} />
          ) : visiblePapers.length ? (
            <div className="paper-search-result-list">
              {visiblePapers.map((paper) => (
                <PaperResultCard
                  key={paper.id}
                  paper={paper}
                  onToggleBookmark={toggleBookmark}
                />
              ))}
            </div>
          ) : (
            <PaperSearchStatus title="No papers found" description="Try adjusting the search keyword or filter selection." />
          )}

          {!loading && !error && (
            <PaperSearchPagination
              page={currentPage}
              pageCount={pageCount}
              onChange={(nextPage) => setValue("page", nextPage)}
            />
          )}
        </section>

        <PaperSearchInsights
          facets={relatedFacets}
          total={resultCount}
          onSelectKeyword={updateQuery}
          onSelectYear={updateYear}
        />
      </div>
    </div>
  );
}

function PaperSearchStatus({ title, description }: { title: string; description: string }) {
  return (
    <div className="paper-search-empty">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function toPaperSearchRequest(values: PaperSearchFormValues) {
  return {
    q: values.q,
    page: values.page,
    size: values.size,
    from: toNumberParam(values.from),
    to: toNumberParam(values.to),
    language: values.language,
    isOpenAccess:
      values.isOpenAccess === ""
        ? undefined
        : values.isOpenAccess === "true",
  };
}

function toNumberParam(value: string) {
  const parsed = Number(value);

  return Number.isFinite(parsed) && value.trim() ? parsed : undefined;
}

const emptyFacets: PaperSearchFacets = {
  years: [],
  topics: [],
  journals: [],
  authors: [],
  types: [],
  openAccess: {
    count: 0,
    total: 0,
  },
};

function buildApiFacets({
  authors,
  journals,
  keywords,
  openAccessRatios,
  openAccessTotal,
  paperYears,
  topics,
}: {
  authors: PaperSearchFacetItem[];
  journals: PaperSearchFacetItem[];
  keywords: PaperSearchFacetItem[];
  openAccessRatios: AnalyticsKeyValue[] | undefined;
  openAccessTotal: number;
  paperYears: PaperSearchFacetItem[];
  topics: PaperSearchFacetItem[];
}): PaperSearchFacets {
  return {
    years: paperYears,
    topics: topics.length ? topics : keywords,
    journals,
    authors,
    types: [],
    openAccess: estimateOpenAccess(openAccessRatios, openAccessTotal),
  };
}

function buildJournalFacets(
  journals: Journal[],
  analyticsJournals: AnalyticsKeyValue[] | undefined,
  papers: PaperSearchResult[]
): PaperSearchFacetItem[] {
  const analyticsCounts = new Map(
    (analyticsJournals ?? []).map((item) => [normalizeFacetLabel(item.key), item.value])
  );
  const paperCounts = papers.reduce<Map<string, number>>((map, paper) => {
    const key = normalizeFacetLabel(paper.journal);
    if (key && !paper.journal.includes("unavailable")) {
      map.set(key, (map.get(key) ?? 0) + 1);
    }

    return map;
  }, new Map());

  if (!journals.length) {
    return toFacetItems(analyticsJournals);
  }

  return journals
    .map((journal) => {
      const key = normalizeFacetLabel(journal.name);

      return {
        label: journal.name,
        count: journal.papers || analyticsCounts.get(key) || paperCounts.get(key) || 0,
      };
    })
    .sort((first, second) => second.count - first.count || first.label.localeCompare(second.label))
    .slice(0, 12);
}

function toFacetItems(items: AnalyticsKeyValue[] | undefined, order: "count" | "asc" = "count"): PaperSearchFacetItem[] {
  const facets = (items ?? [])
    .map((item) => ({ label: item.key, count: item.value }))
    .filter((item) => item.label && Number.isFinite(item.count));

  return facets.sort((first, second) => {
    if (order === "asc") return Number(first.label) - Number(second.label);
    return second.count - first.count || first.label.localeCompare(second.label);
  });
}

function normalizeFacetLabel(value: string) {
  return value.trim().toLowerCase();
}

function estimateOpenAccess(items: AnalyticsKeyValue[] | undefined, fallbackTotal: number) {
  if (!items?.length) {
    return emptyFacets.openAccess;
  }

  const ratioItem = items.find((item) => /ratio|percent|percentage/i.test(item.key));
  if (ratioItem) {
    const ratio = ratioItem.value <= 1 ? ratioItem.value : ratioItem.value / 100;
    const total = fallbackTotal || 100;

    return {
      count: Math.round(ratio * total),
      total,
    };
  }

  const openAccessItem = items.find((item) => /open|oa|access|true|yes/i.test(item.key));
  const closedAccessItem = items.find((item) => /closed|false|no|not/i.test(item.key));
  const count = openAccessItem?.value ?? 0;
  const total = openAccessItem || closedAccessItem
    ? count + (closedAccessItem?.value ?? 0)
    : items.reduce((sum, item) => sum + Math.max(0, item.value), 0);

  return {
    count,
    total,
  };
}

const stopWords = new Set([
  "about",
  "after",
  "analysis",
  "and",
  "are",
  "based",
  "between",
  "case",
  "data",
  "for",
  "from",
  "into",
  "learning",
  "model",
  "models",
  "paper",
  "research",
  "study",
  "the",
  "this",
  "through",
  "using",
  "with",
]);

function mergeFacets(apiFacets: PaperSearchFacets, derivedFacets: PaperSearchFacets): PaperSearchFacets {
  return {
    years: apiFacets.years.length ? apiFacets.years : derivedFacets.years,
    topics: apiFacets.topics.length ? apiFacets.topics : derivedFacets.topics,
    journals: apiFacets.journals.length ? apiFacets.journals : derivedFacets.journals,
    authors: apiFacets.authors.length ? apiFacets.authors : derivedFacets.authors,
    types: apiFacets.types.length ? apiFacets.types : derivedFacets.types,
    openAccess: apiFacets.openAccess.count > 0 ? apiFacets.openAccess : derivedFacets.openAccess,
  };
}

function buildFacetsFromPapers(papers: PaperSearchResult[], total: number): PaperSearchFacets {
  return {
    years: buildFacet(papers.map((paper) => String(paper.year)).filter((year) => year !== "0"), "asc"),
    topics: buildFacet(papers.flatMap((paper) => [...paper.tags, ...extractTopicTerms(paper.title), ...extractTopicTerms(paper.abstract)])),
    journals: buildFacet(papers.map((paper) => paper.journal).filter((journal) => !journal.includes("unavailable"))),
    authors: buildFacet(papers.flatMap((paper) => paper.authors).filter((author) => !author.includes("unavailable"))),
    types: buildFacet(papers.map((paper) => paper.paperType ?? "").filter(Boolean)),
    openAccess: {
      count: papers.filter((paper) => paper.openAccess).length,
      total: total || papers.length,
    },
  };
}

function buildFacet(values: string[], order: "count" | "asc" = "count"): PaperSearchFacetItem[] {
  const counts = values.reduce<Map<string, number>>((map, rawValue) => {
    const value = rawValue.trim();
    if (!value) return map;

    map.set(value, (map.get(value) ?? 0) + 1);
    return map;
  }, new Map());

  return Array.from(counts, ([label, count]) => ({ label, count }))
    .sort((first, second) => {
      if (order === "asc") return Number(first.label) - Number(second.label);
      return second.count - first.count || first.label.localeCompare(second.label);
    })
    .slice(0, 12);
}

function extractTopicTerms(text: string) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word));

  const phrases: string[] = [];
  for (let index = 0; index < words.length - 1; index += 1) {
    phrases.push(toTitleCase(`${words[index]} ${words[index + 1]}`));
  }

  return phrases.slice(0, 6);
}

function buildSuggestions(query: string, papers: PaperSearchResult[], facets: PaperSearchFacets) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  const candidates = [
    ...facets.topics.map((item) => item.label),
    ...facets.journals.map((item) => item.label),
    ...facets.authors.map((item) => item.label),
    ...papers.map((paper) => paper.title),
  ];

  return Array.from(new Set(candidates))
    .filter((candidate) => candidate.toLowerCase().includes(normalizedQuery) && candidate.toLowerCase() !== normalizedQuery)
    .slice(0, 6);
}

function toTitleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export { initialFilters };
