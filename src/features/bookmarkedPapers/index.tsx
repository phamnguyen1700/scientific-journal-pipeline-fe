"use client";

import { useMemo, useState } from "react";

import {
  BookmarkedPaperCard,
  BookmarkedPapersHeader,
  BookmarkedPapersToolbar,
} from "@/features/bookmarkedPapers/components";
import { usePaperDetails } from "@/hooks/papers";
import { useUserBookmarks } from "@/hooks/user";
import type { PaperApiModel } from "@/types/papers";
import type { UserBookmark } from "@/types/user";

type BookmarkPaper = PaperApiModel | UserBookmark["paper"];

export function BookmarkedPapersPage() {
  const bookmarksQuery = useUserBookmarks();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");
  const bookmarkPaperIds = useMemo(
    () => bookmarksQuery.bookmarks.map((bookmark) => bookmark.paperId),
    [bookmarksQuery.bookmarks],
  );
  const paperDetailsQuery = usePaperDetails(bookmarkPaperIds);
  const papersByBookmarkId = useMemo(
    () =>
      new Map(
        paperDetailsQuery.ids.map((id, index) => [
          id,
          paperDetailsQuery.papers[index],
        ]),
      ),
    [paperDetailsQuery.ids, paperDetailsQuery.papers],
  );

  const visiblePapers = useMemo(() => {
    const search = query.trim().toLowerCase();
    return [...bookmarksQuery.bookmarks]
      .filter((bookmark) => {
        const paper = papersByBookmarkId.get(bookmark.paperId) ?? bookmark.paper;
        return !search || getBookmarkSearchText(paper).includes(search);
      })
      .sort((first, second) => {
        const firstPaper = papersByBookmarkId.get(first.paperId) ?? first.paper;
        const secondPaper = papersByBookmarkId.get(second.paperId) ?? second.paper;

        if (sort === "citations") return getPaperCitations(secondPaper) - getPaperCitations(firstPaper);
        if (sort === "year") return getPaperYear(secondPaper) - getPaperYear(firstPaper);
        return getBookmarkTime(second.createdAt) - getBookmarkTime(first.createdAt);
      });
  }, [bookmarksQuery.bookmarks, papersByBookmarkId, query, sort]);

  return (
    <div className="library-page">
      <BookmarkedPapersHeader count={bookmarksQuery.bookmarks.length} />
      <BookmarkedPapersToolbar query={query} sort={sort} onQueryChange={setQuery} onSortChange={setSort} />
      {bookmarksQuery.loading ? (
        <div className="paper-search-empty">Loading bookmarked papers...</div>
      ) : bookmarksQuery.error || paperDetailsQuery.error ? (
        <div className="paper-search-empty">{bookmarksQuery.error ?? paperDetailsQuery.error}</div>
      ) : visiblePapers.length ? (
        <div className="library-list">
          {visiblePapers.map((bookmark) => (
            <BookmarkedPaperCard
              key={bookmark.bookmarkId}
              bookmark={bookmark}
              paper={papersByBookmarkId.get(bookmark.paperId) ?? bookmark.paper}
              onRemove={() => bookmarksQuery.removeBookmark(bookmark.paperId)}
            />
          ))}
        </div>
      ) : (
        <div className="paper-search-empty">No bookmarked papers found.</div>
      )}
    </div>
  );
}

function getBookmarkSearchText(paper: BookmarkPaper) {
  return [
    paper?.title,
    paper?.abstract,
    ...(paper?.paperKeywords ?? []).map((item) => item.keyword?.keywordName ?? item.keyword?.normalizedName ?? item.keywordName),
    ...(paper?.paperTopics ?? []).map((item) => item.topic?.topicName ?? item.topic?.normalizedName ?? item.topicName),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getPaperCitations(paper: BookmarkPaper) {
  return paper && "citedByCount" in paper ? paper.citedByCount ?? 0 : 0;
}

function getPaperYear(paper: BookmarkPaper) {
  return paper?.publicationYear ?? 0;
}

function getBookmarkTime(value: string | undefined) {
  if (!value) return 0;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}
