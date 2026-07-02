"use client";

import { ChevronDown, RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import type {
  PaperSearchFacetItem,
  PaperSearchFilters as PaperSearchFiltersValue,
} from "@/types/search";

export function PaperSearchFilters({
  facets,
  filters,
  onChange,
  onFacetSelect,
  onReset,
}: {
  facets: {
    authors: PaperSearchFacetItem[];
    journals: PaperSearchFacetItem[];
    topics: PaperSearchFacetItem[];
    types: PaperSearchFacetItem[];
    years: PaperSearchFacetItem[];
  };
  filters: PaperSearchFiltersValue;
  onChange: (filters: PaperSearchFiltersValue) => void;
  onFacetSelect: (value: string) => void;
  onReset: () => void;
}) {
  function update<Key extends keyof PaperSearchFiltersValue>(
    key: Key,
    value: PaperSearchFiltersValue[Key]
  ) {
    onChange({ ...filters, [key]: value });
  }
  const hasActiveFilters = Boolean(filters.from || filters.to || filters.language || filters.isOpenAccess);

  return (
    <div className="paper-search-filter-bar">
      <FacetDropdown
        label={filters.from && filters.to && filters.from === filters.to ? `Year ${filters.from}` : "Year"}
        items={facets.years}
        emptyLabel="No year data"
        onSelect={(value) => {
          onChange({ ...filters, from: value, to: value });
        }}
      />
      <FacetDropdown label="Journal" items={facets.journals} emptyLabel="No journals" onSelect={onFacetSelect} />
      <FacetDropdown label="Author" items={facets.authors} emptyLabel="No authors" onSelect={onFacetSelect} />
      <FacetDropdown label="Topics" items={facets.topics} emptyLabel="No topics" onSelect={onFacetSelect} />
      <FacetDropdown label="Type" items={facets.types} emptyLabel="No types" onSelect={onFacetSelect} />
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button type="button" variant="outline" className="paper-search-filter-button" />}>
          Open Access
          <ChevronDown />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="paper-search-filter-menu">
          <DropdownMenuItem onClick={() => update("isOpenAccess", "")}>Any access</DropdownMenuItem>
          <DropdownMenuItem onClick={() => update("isOpenAccess", "true")}>Open access</DropdownMenuItem>
          <DropdownMenuItem onClick={() => update("isOpenAccess", "false")}>Not open access</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {hasActiveFilters && (
        <Button type="button" variant="ghost" className="paper-search-filter-reset" onClick={onReset}>
          <RotateCcw />
          Reset
        </Button>
      )}
    </div>
  );
}

function FacetDropdown({
  emptyLabel,
  items,
  label,
  onSelect,
}: {
  emptyLabel: string;
  items: PaperSearchFacetItem[];
  label: string;
  onSelect: (value: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button type="button" variant="outline" className="paper-search-filter-button" />}>
        {label}
        <ChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="paper-search-filter-menu">
        {items.length ? (
          items.slice(0, 12).map((item) => (
            <DropdownMenuItem key={item.label} onClick={() => onSelect(item.label)}>
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              <span className="text-xs text-muted-foreground">{item.count.toLocaleString()}</span>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>{emptyLabel}</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
