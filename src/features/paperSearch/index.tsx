"use client";

import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { motion } from "motion/react";

import {
  PaperResultCard,
  PaperSearchFilters,
  PaperSearchHeader,
  PaperSearchInsights,
  PaperSearchPagination,
  PaperSearchToolbar,
} from "@/features/paperSearch/components";
import {
  useJournalOpenAccessRatio,
  useKeywordWordCloud,
  usePapersByYear,
  useTopAuthorsByCitations,
  useTopJournalsByCitations,
  useTrendingTopics,
} from "@/hooks/analytics";
import { usePaperSearch } from "@/hooks/search";
import { useUserBookmarks } from "@/hooks/user";
import type { AnalyticsKeyValue } from "@/types/analytics";
import type {
  PaperSearchFilters as PaperSearchFiltersValue,
  PaperSearchApiFacetItem,
  PaperSearchApiFacets,
  PaperSearchFacetItem,
  PaperSearchFacets,
  PaperSearchPaper,
} from "@/types/search";

const initialFilters: PaperSearchFiltersValue = {
  from: "",
  to: "",
  language: "",
  isOpenAccess: "",
  filterJournal: "",
  filterAuthor: "",
  filterKeyword: "",
  filterYear: "",
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

export function PaperSearchPage({
  initialFromHome = false,
  initialQuery = "",
}: {
  initialFromHome?: boolean;
  initialQuery?: string;
}) {
  const { control, reset, setValue } = useForm<PaperSearchFormValues>({
    defaultValues: {
      ...initialSearchValues,
      q: initialQuery,
    },
  });
  const formValues = useWatch({ control });
  const q = formValues.q ?? "";
  const from = formValues.from ?? "";
  const to = formValues.to ?? "";
  const language = formValues.language ?? "";
  const isOpenAccess = formValues.isOpenAccess ?? "";
  const filterJournal = formValues.filterJournal ?? "";
  const filterAuthor = formValues.filterAuthor ?? "";
  const filterKeyword = formValues.filterKeyword ?? "";
  const filterYear = formValues.filterYear ?? "";
  const page = formValues.page ?? 1;
  const size = formValues.size ?? pageSize;
  const filters: PaperSearchFiltersValue = {
    from,
    to,
    language,
    isOpenAccess,
    filterJournal,
    filterAuthor,
    filterKeyword,
    filterYear,
  };
  const hasSearchCriteria = Boolean(
    q.trim() ||
      from ||
      to ||
      language ||
      isOpenAccess ||
      filterJournal ||
      filterAuthor ||
      filterKeyword ||
      filterYear,
  );
  const searchRequest = toPaperSearchRequest({
    q,
    from,
    to,
    language,
    isOpenAccess,
    filterJournal,
    filterAuthor,
    filterKeyword,
    filterYear,
    page,
    size,
  });
  const paperQuery = usePaperSearch(searchRequest);
  const papersByYearQuery = usePapersByYear();
  const trendingTopicsQuery = useTrendingTopics(1, 10);
  const keywordWordCloudQuery = useKeywordWordCloud(12);
  const topJournalsQuery = useTopJournalsByCitations(10);
  const topAuthorsQuery = useTopAuthorsByCitations(10);
  const openAccessRatioQuery = useJournalOpenAccessRatio();
  const bookmarksQuery = useUserBookmarks();
  const papers = paperQuery.papers;
  const bookmarkedPaperIds = useMemo(
    () => new Set(bookmarksQuery.bookmarks.map((bookmark) => bookmark.paperId)),
    [bookmarksQuery.bookmarks]
  );
  const resultCount = paperQuery.total || papers.length;
  const loading = paperQuery.loading;
  const error = paperQuery.error;
  const relatedFacets = useMemo(
    () =>
      mergeFacets(
        mergeFacets(
          toSearchFacets(paperQuery.facets),
          buildApiFacets({
            authors: toFacetItems(topAuthorsQuery.data),
            journals: toFacetItems(topJournalsQuery.data),
            keywords: toFacetItems(keywordWordCloudQuery.data),
            paperYears: toFacetItems(papersByYearQuery.data, "asc"),
            topics: [],
          })
        ),
        buildFacetsFromPapers(papers, resultCount)
      ),
    [
      keywordWordCloudQuery.data,
      paperQuery.facets,
      papers,
      papersByYearQuery.data,
      resultCount,
      topAuthorsQuery.data,
      topJournalsQuery.data,
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
    setValue("filterJournal", value.filterJournal);
    setValue("filterAuthor", value.filterAuthor);
    setValue("filterKeyword", value.filterKeyword);
    setValue("filterYear", value.filterYear);
    setValue("page", 1);
  }

  function updateYear(year: number) {
    setValue("from", String(year));
    setValue("to", String(year));
    setValue("filterYear", String(year));
    setValue("page", 1);
  }

  function resetFilters() {
    reset({ ...initialSearchValues, q });
  }

  function toggleBookmark(id: string) {
    if (bookmarkedPaperIds.has(id)) {
      bookmarksQuery.removeBookmark(id);
    } else {
      bookmarksQuery.addBookmark(id);
    }
  }

  return (
    <motion.div
      initial={
        initialFromHome
          ? { opacity: 0, y: 26, scale: 0.985, filter: "blur(2px)" }
          : false
      }
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ type: "spring", stiffness: 260, damping: 32 }}
      className="paper-search-page"
    >
      <div className="paper-search-workspace">
        <PaperSearchFilters
          facets={{
            authors: relatedFacets.authors,
            journals: relatedFacets.journals,
            keywords: relatedFacets.keywords,
            years: relatedFacets.years,
          }}
          filters={filters}
          onChange={updateFilters}
          onReset={resetFilters}
        />

        <div className="paper-search-main">
          <PaperSearchHeader />
          <section className="paper-search-controls">
            <PaperSearchToolbar
              query={q}
              resultCount={resultCount}
              suggestions={suggestions}
              onQueryChange={updateQuery}
            />
          </section>

          <div className="paper-search-layout">
            <section className="paper-search-results">
              {loading ? (
                <PaperSearchStatus title="Loading papers..." description={hasSearchCriteria ? "Searching matching papers from the server." : "Fetching all papers from the server."} />
              ) : error ? (
                <PaperSearchStatus title="Unable to load papers" description={error} />
              ) : papers.length ? (
                <div className="paper-search-result-list">
                  {papers.map((paper) => (
                    <PaperResultCard
                      key={paper.paperId}
                      bookmarked={bookmarkedPaperIds.has(paper.paperId)}
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
              openAccessStats={openAccessRatioQuery.data ?? []}
              papersByYear={papersByYearQuery.data ?? []}
              onSelectKeyword={updateQuery}
              onSelectYear={updateYear}
              topAuthors={topAuthorsQuery.data ?? []}
              topJournals={topJournalsQuery.data ?? []}
              trendingTopics={trendingTopicsQuery.data ?? []}
            />
          </div>
        </div>
      </div>
    </motion.div>
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
    filterJournal: toStringArrayParam(values.filterJournal),
    filterAuthor: toStringArrayParam(values.filterAuthor),
    filterKeyword: toStringArrayParam(values.filterKeyword),
    filterYear: toNumberArrayParam(values.filterYear),
  };
}


function toStringArrayParam(value: string) {
  const trimmed = value.trim();

  return trimmed ? [trimmed] : undefined;
}

function toNumberArrayParam(value: string) {
  const parsed = toNumberParam(value);

  return parsed === undefined ? undefined : [parsed];
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
  keywords: [],
  types: [],
  openAccess: {
    count: 0,
    total: 0,
  },
};


function toSearchFacets(facets: PaperSearchApiFacets | undefined): PaperSearchFacets {
  return {
    years: toSearchFacetItems(facets?.years, "asc"),
    topics: [],
    journals: toSearchFacetItems(facets?.journals),
    authors: toSearchFacetItems(facets?.authors),
    keywords: toSearchFacetItems(facets?.keywords),
    types: [],
    openAccess: emptyFacets.openAccess,
  };
}

function toSearchFacetItems(
  items: PaperSearchApiFacetItem[] | undefined,
  order: "count" | "asc" = "count",
): PaperSearchFacetItem[] {
  const facets = (items ?? [])
    .map((item) => ({ label: item.value, value: item.value, count: item.count }))
    .filter((item) => item.label && Number.isFinite(item.count));

  return facets.sort((first, second) => {
    if (order === "asc") return Number(first.label) - Number(second.label);
    return second.count - first.count || first.label.localeCompare(second.label);
  });
}
function buildApiFacets({
  authors,
  journals,
  keywords,
  paperYears,
  topics,
}: {
  authors: PaperSearchFacetItem[];
  journals: PaperSearchFacetItem[];
  keywords: PaperSearchFacetItem[];
  paperYears: PaperSearchFacetItem[];
  topics: PaperSearchFacetItem[];
}): PaperSearchFacets {
  return {
    years: paperYears,
    topics,
    journals,
    authors,
    keywords,
    types: [],
    openAccess: emptyFacets.openAccess,
  };
}

function toFacetItems(items: AnalyticsKeyValue[] | undefined, order: "count" | "asc" = "count"): PaperSearchFacetItem[] {
  const facets = (items ?? [])
    .map((item) => ({ label: item.key, value: item.key, count: item.value }))
    .filter((item) => item.label && Number.isFinite(item.count));

  return facets.sort((first, second) => {
    if (order === "asc") return Number(first.label) - Number(second.label);
    return second.count - first.count || first.label.localeCompare(second.label);
  });
}



function mergeFacets(apiFacets: PaperSearchFacets, derivedFacets: PaperSearchFacets): PaperSearchFacets {
  return {
    years: apiFacets.years.length ? apiFacets.years : derivedFacets.years,
    topics: apiFacets.topics.length ? apiFacets.topics : derivedFacets.topics,
    journals: apiFacets.journals.length ? apiFacets.journals : derivedFacets.journals,
    authors: apiFacets.authors.length ? apiFacets.authors : derivedFacets.authors,
    keywords: apiFacets.keywords.length ? apiFacets.keywords : derivedFacets.keywords,
    types: apiFacets.types.length ? apiFacets.types : derivedFacets.types,
    openAccess: apiFacets.openAccess.count > 0 ? apiFacets.openAccess : derivedFacets.openAccess,
  };
}

function buildFacetsFromPapers(papers: PaperSearchPaper[], total: number): PaperSearchFacets {
  return {
    years: buildFacet(papers.map((paper) => String(paper.publicationYear)).filter((year) => year !== "0"), "asc"),
    topics: [],
    journals: [],
    authors: buildFacet(papers.flatMap((paper) => paper.authors)),
    keywords: buildFacet(papers.flatMap((paper) => paper.keywords)),
    types: [],
    openAccess: {
      count: 0,
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

  return Array.from(counts, ([label, count]) => ({ label, value: label, count }))
    .sort((first, second) => {
      if (order === "asc") return Number(first.label) - Number(second.label);
      return second.count - first.count || first.label.localeCompare(second.label);
    })
    .slice(0, 12);
}

function buildSuggestions(query: string, papers: PaperSearchPaper[], facets: PaperSearchFacets) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  const candidates = [
    ...facets.topics.map((item) => item.label),
    ...facets.journals.map((item) => item.label),
    ...facets.authors.map((item) => item.label),
    ...papers.flatMap((paper) => [paper.title, ...paper.authors, ...paper.keywords]),
  ];

  return Array.from(new Set(candidates))
    .filter((candidate) => candidate.toLowerCase().includes(normalizedQuery) && candidate.toLowerCase() !== normalizedQuery)
    .slice(0, 6);
}

export { initialFilters };
