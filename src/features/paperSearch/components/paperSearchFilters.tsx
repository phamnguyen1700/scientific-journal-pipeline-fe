"use client";

import { RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import type { PaperSearchFilters as PaperSearchFiltersValue } from "@/types/search";

export function PaperSearchFilters({
  filters,
  open,
  onChange,
  onReset,
}: {
  filters: PaperSearchFiltersValue;
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
          <span>From year</span>
          <Input
            value={filters.from}
            onChange={(event) => update("from", event.target.value)}
            placeholder="2020"
          />
        </label>

        <label className="paper-search-filter-field">
          <span>To year</span>
          <Input
            value={filters.to}
            onChange={(event) => update("to", event.target.value)}
            placeholder="2024"
          />
        </label>

        <label className="paper-search-filter-field">
          <span>Language</span>
          <select
            value={filters.language}
            onChange={(event) => update("language", event.target.value)}
            className="paper-search-select"
          >
            <option value="">Any language</option>
            <option value="en">English</option>
            <option value="vi">Vietnamese</option>
          </select>
        </label>

        <label className="paper-search-filter-field">
          <span>Open access</span>
          <select
            value={filters.isOpenAccess}
            onChange={(event) => update("isOpenAccess", event.target.value as PaperSearchFiltersValue["isOpenAccess"])}
            className="paper-search-select"
          >
            <option value="">Any access</option>
            <option value="true">Open access</option>
            <option value="false">Not open access</option>
          </select>
        </label>
      </div>
    </aside>
  );
}
