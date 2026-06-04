import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/shared/ui/button";

export function PaperSearchHeader({
  onToggleFilters,
}: {
  onToggleFilters: () => void;
}) {
  return (
    <div className="paper-search-header">
      <div>
        <h1 className="paper-search-title">Paper Search</h1>
        <p className="paper-search-description">
          Discover scientific publications across journals and research topics.
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        className="lg:hidden"
        onClick={onToggleFilters}
      >
        <SlidersHorizontal />
        Filters
      </Button>
    </div>
  );
}
