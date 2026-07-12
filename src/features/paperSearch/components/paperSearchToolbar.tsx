"use client";

import { PaperSearchBox } from "@/features/paperSearch/components/paperSearchBox";

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
  return (
    <div className="paper-search-toolbar">
      <PaperSearchBox
        key={query}
        query={query}
        suggestions={suggestions}
        onQueryChange={onQueryChange}
      />
      <div className="paper-search-toolbar-meta">
        <span>{resultCount} results</span>
      </div>
    </div>
  );
}