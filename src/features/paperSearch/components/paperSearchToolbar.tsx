"use client";

import { X } from "lucide-react";

import { SearchInput } from "@/components/common";

export function PaperSearchToolbar({
  query,
  sort,
  resultCount,
  suggestions,
  onQueryChange,
  onSortChange,
}: {
  query: string;
  sort: string;
  resultCount: number;
  suggestions: string[];
  onQueryChange: (query: string) => void;
  onSortChange: (sort: string) => void;
}) {
  return (
    <div className="paper-search-toolbar">
      <div className="paper-search-query-box">
        <SearchInput
          value={query}
          onChange={onQueryChange}
          placeholder="Search papers by title, keyword, author, journal, or DOI..."
          className="min-w-0 flex-1"
        />
        {query && (
          <button
            type="button"
            className="paper-search-clear"
            onClick={() => onQueryChange("")}
            aria-label="Clear search"
          >
            <X />
          </button>
        )}
        {query && suggestions.length > 0 && (
          <div className="paper-search-suggestions">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onQueryChange(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
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
