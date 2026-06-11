"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import {
  PaperResultCard,
  PaperSearchFilters,
  PaperSearchHeader,
  PaperSearchPagination,
  PaperSearchToolbar,
} from "@/features/paperSearch/components";
import { toPaperSearchResult } from "@/features/paperSearch/paperMapper";
import { usePaperSearch } from "@/hooks/search";
import type {
  PaperSearchFilters as PaperSearchFiltersValue,
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
  const paperQuery = usePaperSearch({ page: 1, size: pageSize });
  const { search } = paperQuery;
  const { control, reset, setValue } = useForm<PaperSearchFormValues>({
    defaultValues: initialSearchValues,
  });
  const formValues = useWatch({ control });
  const [sort, setSort] = useState("relevance");
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const q = formValues.q ?? "";
  const from = formValues.from ?? "";
  const to = formValues.to ?? "";
  const language = formValues.language ?? "";
  const isOpenAccess = formValues.isOpenAccess ?? "";
  const page = formValues.page ?? 1;
  const size = formValues.size ?? pageSize;
  const filters: PaperSearchFiltersValue = { from, to, language, isOpenAccess };

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void search(toPaperSearchRequest({ q, from, to, language, isOpenAccess, page, size }));
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [from, isOpenAccess, language, page, q, search, size, to]);

  const papers = useMemo(
    () =>
      paperQuery.papers.map((paper, index) => {
        const result = toPaperSearchResult(paper, index);

        return { ...result, bookmarked: bookmarks.includes(result.id) };
      }),
    [bookmarks, paperQuery.papers]
  );

  const sortedPapers = useMemo(
    () =>
      [...papers].sort((first, second) => {
        if (sort === "citations") return second.citations - first.citations;
        if (sort === "newest") return second.year - first.year;
        return first.title.localeCompare(second.title);
      }),
    [papers, sort]
  );

  const currentPage = page;
  const pageCount = Math.max(page, sortedPapers.length === size ? page + 1 : page);

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

  function resetFilters() {
    reset({ ...initialSearchValues, q });
  }

  function toggleBookmark(id: string) {
    setBookmarks((current) =>
      current.includes(id)
        ? current.filter((bookmarkId) => bookmarkId !== id)
        : [...current, id]
    );
  }

  return (
    <div className="paper-search-page">
      <PaperSearchHeader onToggleFilters={() => setFiltersOpen((open) => !open)} />
      <div className="paper-search-layout">
        <PaperSearchFilters
          filters={filters}
          open={filtersOpen}
          onChange={updateFilters}
          onReset={resetFilters}
        />

        <section className="paper-search-results">
          <PaperSearchToolbar
            query={q}
            sort={sort}
            resultCount={sortedPapers.length}
            onQueryChange={updateQuery}
            onSortChange={(value) => {
              setSort(value);
            }}
          />

          {paperQuery.loading ? (
            <PaperSearchStatus title="Loading papers..." description="Fetching the latest papers from the server." />
          ) : paperQuery.error ? (
            <PaperSearchStatus title="Unable to load papers" description={paperQuery.error} />
          ) : sortedPapers.length ? (
            <div className="paper-search-result-list">
              {sortedPapers.map((paper) => (
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

          {!paperQuery.loading && !paperQuery.error && (
            <PaperSearchPagination
              page={currentPage}
              pageCount={pageCount}
              onChange={(nextPage) => setValue("page", nextPage)}
            />
          )}
        </section>
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

export { initialFilters };
