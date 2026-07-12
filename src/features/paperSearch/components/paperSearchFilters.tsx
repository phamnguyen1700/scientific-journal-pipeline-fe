"use client";

import { ChevronDown, Funnel, RotateCcw } from "lucide-react";

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
  onReset,
}: {
  facets: {
    authors: PaperSearchFacetItem[];
    journals: PaperSearchFacetItem[];
    keywords: PaperSearchFacetItem[];
    years: PaperSearchFacetItem[];
  };
  filters: PaperSearchFiltersValue;
  onChange: (filters: PaperSearchFiltersValue) => void;
  onReset: () => void;
}) {
  function update<Key extends keyof PaperSearchFiltersValue>(
    key: Key,
    value: PaperSearchFiltersValue[Key],
  ) {
    onChange({ ...filters, [key]: value });
  }

  function updateYear(value: string) {
    onChange({ ...filters, from: value, to: value, filterYear: value });
  }

  const hasActiveFilters = Boolean(
    filters.from ||
      filters.to ||
      filters.language ||
      filters.isOpenAccess ||
      filters.filterJournal ||
      filters.filterAuthor ||
      filters.filterKeyword ||
      filters.filterYear,
  );

  return (
    <aside className="paper-search-filter-panel" aria-label="Paper search filters">
      <div className="paper-search-filter-heading">
        <div className="paper-search-filter-title">
          <Funnel />
          <span>Filters</span>
        </div>
      </div>
      <div className="paper-search-filter-list">
        <FacetDropdown
          label={filters.filterKeyword || "All keywords"}
          fieldLabel="Keyword"
          items={facets.keywords}
          emptyLabel="No keywords"
          selectedValue={filters.filterKeyword}
          onSelect={(value) => update("filterKeyword", value)}
        />
        <FacetDropdown
          label={filters.filterAuthor || "All authors"}
          fieldLabel="Author"
          items={facets.authors}
          emptyLabel="No authors"
          selectedValue={filters.filterAuthor}
          onSelect={(value) => update("filterAuthor", value)}
        />
        <FacetDropdown
          label={filters.filterJournal || "All journals"}
          fieldLabel="Journal"
          items={facets.journals}
          emptyLabel="No journals"
          selectedValue={filters.filterJournal}
          onSelect={(value) => update("filterJournal", value)}
        />
        <FacetDropdown
          label={filters.filterYear ? `Year ${filters.filterYear}` : "All years"}
          fieldLabel="Year"
          items={facets.years}
          emptyLabel="No year data"
          selectedValue={filters.filterYear}
          onSelect={updateYear}
        />
        <div className="paper-search-filter-field">
          <span>Open Access</span>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button type="button" variant="outline" className="paper-search-filter-button" />
              }
            >
              <span className="min-w-0 truncate">{getOpenAccessLabel(filters.isOpenAccess)}</span>
              <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="paper-search-filter-menu">
              <DropdownMenuItem onClick={() => update("isOpenAccess", "")}>Any access</DropdownMenuItem>
              <DropdownMenuItem onClick={() => update("isOpenAccess", "true")}>Open access</DropdownMenuItem>
              <DropdownMenuItem onClick={() => update("isOpenAccess", "false")}>Not open access</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        className="paper-search-filter-reset"
        disabled={!hasActiveFilters}
        onClick={onReset}
      >
        <RotateCcw />
        Clear all filters
      </Button>
    </aside>
  );
}

function FacetDropdown({
  emptyLabel,
  fieldLabel,
  items,
  label,
  selectedValue,
  onSelect,
}: {
  emptyLabel: string;
  fieldLabel: string;
  items: PaperSearchFacetItem[];
  label: string;
  selectedValue?: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="paper-search-filter-field">
      <span>{fieldLabel}</span>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button type="button" variant="outline" className="paper-search-filter-button" />
          }
        >
          <span className="min-w-0 truncate">{label}</span>
          <ChevronDown />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="paper-search-filter-menu">
          {selectedValue && (
            <DropdownMenuItem onClick={() => onSelect("")}>All</DropdownMenuItem>
          )}
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
    </div>
  );
}

function getOpenAccessLabel(value: PaperSearchFiltersValue["isOpenAccess"]) {
  if (value === "true") return "Open access";
  if (value === "false") return "Not open access";
  return "Open Access";
}
