"use client";

import { useMemo, useState } from "react";

import {
  PaperResultCard,
  PaperSearchFilters,
  PaperSearchHeader,
  PaperSearchPagination,
  PaperSearchToolbar,
} from "@/features/paperSearch/components";
import { toPaperSearchResult } from "@/features/paperSearch/paperMapper";
import { usePapers } from "@/hooks/papers";
import type {
  PaperSearchFilters as PaperSearchFiltersValue,
} from "@/types/search";

const initialFilters: PaperSearchFiltersValue = {
  keywords: "",
  author: "",
  journal: "",
  year: "",
  openAccessOnly: false,
};

const pageSize = 4;

export function PaperSearchPage() {
  const paperQuery = usePapers();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("relevance");
  const [filters, setFilters] = useState(initialFilters);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const papers = useMemo(
    () =>
      paperQuery.papers.map((paper, index) => {
        const result = toPaperSearchResult(paper, index);

        return { ...result, bookmarked: bookmarks.includes(result.id) };
      }),
    [bookmarks, paperQuery.papers]
  );

  const journals = useMemo(
    () => [...new Set(papers.map((paper) => paper.journal))].sort(),
    [papers]
  );
  const years = useMemo(
    () => [...new Set(papers.map((paper) => paper.year))].sort((a, b) => b - a),
    [papers]
  );

  const filteredPapers = useMemo(() => {
    const search = query.trim().toLowerCase();
    const keywords = filters.keywords.trim().toLowerCase();
    const author = filters.author.trim().toLowerCase();

    return papers
      .filter((paper) => {
        const searchable = [
          paper.title,
          paper.doi ?? "",
          paper.journal,
          ...paper.authors,
          ...paper.tags,
        ]
          .join(" ")
          .toLowerCase();

        return (
          (!search || searchable.includes(search)) &&
          (!keywords || searchable.includes(keywords)) &&
          (!author || paper.authors.join(" ").toLowerCase().includes(author)) &&
          (!filters.journal || paper.journal === filters.journal) &&
          (!filters.year || paper.year === Number(filters.year)) &&
          (!filters.openAccessOnly || paper.openAccess)
        );
      })
      .sort((first, second) => {
        if (sort === "citations") return second.citations - first.citations;
        if (sort === "newest") return second.year - first.year;
        return first.title.localeCompare(second.title);
      });
  }, [filters, papers, query, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredPapers.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visiblePapers = filteredPapers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function updateFilters(value: PaperSearchFiltersValue) {
    setFilters(value);
    setPage(1);
  }

  function resetFilters() {
    setFilters(initialFilters);
    setPage(1);
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
          journals={journals}
          years={years}
          open={filtersOpen}
          onChange={updateFilters}
          onReset={resetFilters}
        />

        <section className="paper-search-results">
          <PaperSearchToolbar
            query={query}
            sort={sort}
            resultCount={filteredPapers.length}
            onQueryChange={updateQuery}
            onSortChange={(value) => {
              setSort(value);
              setPage(1);
            }}
          />

          {paperQuery.loading ? (
            <PaperSearchStatus title="Loading papers..." description="Fetching the latest papers from the server." />
          ) : paperQuery.error ? (
            <PaperSearchStatus title="Unable to load papers" description={paperQuery.error} />
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

          {!paperQuery.loading && !paperQuery.error && (
            <PaperSearchPagination
              page={currentPage}
              pageCount={pageCount}
              onChange={setPage}
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

export { initialFilters };
