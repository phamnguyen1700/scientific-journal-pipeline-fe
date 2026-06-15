"use client";

import { useMemo, useState } from "react";

import {
  BookmarkedPaperCard,
  BookmarkedPapersHeader,
  BookmarkedPapersToolbar,
} from "@/features/bookmarkedPapers/components";
import { useUserBookmarks } from "@/hooks/user";

export function BookmarkedPapersPage() {
  const bookmarksQuery = useUserBookmarks();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");

  const visiblePapers = useMemo(() => {
    const search = query.trim().toLowerCase();
    return bookmarksQuery.papers
      .filter((paper) => !search || [paper.title, paper.authors, paper.journal, ...paper.tags].join(" ").toLowerCase().includes(search))
      .sort((first, second) => {
        if (sort === "citations") return second.citations - first.citations;
        if (sort === "year") return second.year - first.year;
        return String(first.savedAt).localeCompare(String(second.savedAt));
      });
  }, [bookmarksQuery.papers, query, sort]);

  return (
    <div className="library-page">
      <BookmarkedPapersHeader count={bookmarksQuery.papers.length} />
      <BookmarkedPapersToolbar query={query} sort={sort} onQueryChange={setQuery} onSortChange={setSort} />
      {bookmarksQuery.loading ? (
        <div className="paper-search-empty">Loading bookmarked papers...</div>
      ) : bookmarksQuery.error ? (
        <div className="paper-search-empty">{bookmarksQuery.error}</div>
      ) : visiblePapers.length ? (
        <div className="library-list">
          {visiblePapers.map((paper) => (
            <BookmarkedPaperCard
              key={paper.id}
              paper={paper}
              onRemove={() => bookmarksQuery.removeBookmark(paper.apiId ?? String(paper.id))}
            />
          ))}
        </div>
      ) : (
        <div className="paper-search-empty">No bookmarked papers found.</div>
      )}
    </div>
  );
}
