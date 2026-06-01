"use client";

import { RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import type { PaperSearchFilters as PaperSearchFiltersValue } from "@/types/search";

export function PaperSearchFilters({
  filters,
  journals,
  years,
  open,
  onChange,
  onReset,
}: {
  filters: PaperSearchFiltersValue;
  journals: string[];
  years: number[];
  open: boolean;
  onChange: (filters: PaperSearchFiltersValue) => void;
  onReset: () => void;
}) {
  function update<Key extends keyof PaperSearchFiltersValue>(
    key: Key,
    value: PaperSearchFiltersValue[Key]
  ) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <aside className={cn("paper-search-filters", open && "paper-search-filters-open")}>
      <div className="paper-search-filter-heading">
        <h2 className="paper-search-filter-title">Filters</h2>
        <Button type="button" variant="ghost" size="xs" onClick={onReset}>
          <RotateCcw />
          Reset
        </Button>
      </div>

      <div className="paper-search-filter-list">
        <label className="paper-search-filter-field">
          <span>Keywords</span>
          <Input
            value={filters.keywords}
            onChange={(event) => update("keywords", event.target.value)}
            placeholder="e.g. machine learning"
          />
        </label>

        <label className="paper-search-filter-field">
          <span>Author</span>
          <Input
            value={filters.author}
            onChange={(event) => update("author", event.target.value)}
            placeholder="Search author"
          />
        </label>

        <label className="paper-search-filter-field">
          <span>Journal</span>
          <select
            value={filters.journal}
            onChange={(event) => update("journal", event.target.value)}
            className="paper-search-select"
          >
            <option value="">All journals</option>
            {journals.map((journal) => (
              <option key={journal}>{journal}</option>
            ))}
          </select>
        </label>

        <label className="paper-search-filter-field">
          <span>Publication year</span>
          <select
            value={filters.year}
            onChange={(event) => update("year", event.target.value)}
            className="paper-search-select"
          >
            <option value="">Any year</option>
            {years.map((year) => (
              <option key={year}>{year}</option>
            ))}
          </select>
        </label>

        <label className="paper-search-checkbox">
          <Checkbox
            checked={filters.openAccessOnly}
            onCheckedChange={(checked) => update("openAccessOnly", checked)}
          />
          <span>Open access only</span>
        </label>
      </div>
    </aside>
  );
}
