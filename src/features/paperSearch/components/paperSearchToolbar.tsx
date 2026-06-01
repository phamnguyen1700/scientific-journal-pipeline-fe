"use client";

import { SearchInput } from "@/components/common";

export function PaperSearchToolbar({
  query,
  sort,
  resultCount,
  onQueryChange,
  onSortChange,
}: {
  query: string;
  sort: string;
  resultCount: number;
  onQueryChange: (query: string) => void;
  onSortChange: (sort: string) => void;
}) {
  return (
    <div className="paper-search-toolbar">
      <SearchInput
        value={query}
        onChange={onQueryChange}
        placeholder="Search papers by title, keyword, or DOI..."
        className="min-w-0 flex-1"
      />
      <div className="paper-search-toolbar-meta">
        <span>{resultCount} results</span>
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          className="paper-search-select w-auto"
          aria-label="Sort papers"
        >
          <option value="relevance">Most relevant</option>
          <option value="citations">Most cited</option>
          <option value="newest">Newest first</option>
        </select>
      </div>
    </div>
  );
}
