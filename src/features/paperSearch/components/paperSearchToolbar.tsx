"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { SearchInput } from "@/components/common";

export function PaperSearchToolbar({
  query,
  resultCount,
  suggestions,
  onQueryChange,
}: {
  query: string;
  resultCount: number;
  suggestions: string[];
  onQueryChange: (query: string) => void;
}) {
  const [suggestionsHidden, setSuggestionsHidden] = useState(false);
  const showSuggestions = query && suggestions.length > 0 && !suggestionsHidden;

  return (
    <div className="paper-search-toolbar">
      <div className="paper-search-query-box">
        <SearchInput
          value={query}
          onChange={(value) => {
            setSuggestionsHidden(false);
            onQueryChange(value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              setSuggestionsHidden(true);
              event.currentTarget.blur();
            }
          }}
          placeholder="Search papers by title, keyword, author, journal, or DOI..."
          className="min-w-0 flex-1"
        />
        {query && (
          <button
            type="button"
            className="paper-search-clear"
            onClick={() => {
              setSuggestionsHidden(false);
              onQueryChange("");
            }}
            aria-label="Clear search"
          >
            <X />
          </button>
        )}
        {showSuggestions && (
          <div className="paper-search-suggestions">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setSuggestionsHidden(true);
                  onQueryChange(suggestion);
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="paper-search-toolbar-meta">
        <span>{resultCount} results</span>
      </div>
    </div>
  );
}
