"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

import { SearchInput } from "@/components/common";

export function PaperSearchBox({
  query,
  suggestions,
  onQueryChange,
}: {
  query: string;
  suggestions: string[];
  onQueryChange: (query: string) => void;
}) {
  const [draftQuery, setDraftQuery] = useState(query);
  const [suggestionsHidden, setSuggestionsHidden] = useState(false);
  const normalizedDraft = draftQuery.trim();
  const submittedQuery = query.trim();
  const showSuggestions =
    normalizedDraft === submittedQuery &&
    normalizedDraft &&
    suggestions.length > 0 &&
    !suggestionsHidden;


  function submitSearch(value = draftQuery) {
    setSuggestionsHidden(true);
    onQueryChange(value.trim());
  }

  function clearSearch() {
    setDraftQuery("");
    setSuggestionsHidden(false);
    onQueryChange("");
  }

  return (
    <div className="paper-search-query-box">
      <SearchInput
        value={draftQuery}
        onChange={(value) => {
          setDraftQuery(value);
          setSuggestionsHidden(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            submitSearch();
            event.currentTarget.blur();
          }
        }}
        placeholder="Search papers by title, keyword, author, journal, or DOI..."
        className="min-w-0 flex-1"
      />
      {draftQuery && (
        <button
          type="button"
          className="paper-search-clear"
          onClick={clearSearch}
          aria-label="Clear search"
        >
          <X />
        </button>
      )}
      <button
        type="button"
        className="paper-search-submit"
        onClick={() => submitSearch()}
        aria-label="Search papers"
      >
        <Search />
      </button>
      {showSuggestions && (
        <div className="paper-search-suggestions">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setDraftQuery(suggestion);
                submitSearch(suggestion);
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}