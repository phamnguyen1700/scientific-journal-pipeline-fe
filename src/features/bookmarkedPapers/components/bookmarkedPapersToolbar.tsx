import { SearchInput } from "@/components/common";

export function BookmarkedPapersToolbar({
  query,
  sort,
  onQueryChange,
  onSortChange,
}: {
  query: string;
  sort: string;
  onQueryChange: (query: string) => void;
  onSortChange: (sort: string) => void;
}) {
  return (
    <div className="library-toolbar">
      <SearchInput
        value={query}
        onChange={onQueryChange}
        placeholder="Search your saved papers..."
        className="min-w-0 flex-1"
      />
      <select
        value={sort}
        onChange={(event) => onSortChange(event.target.value)}
        className="library-select"
        aria-label="Sort bookmarked papers"
      >
        <option value="recent">Recently saved</option>
        <option value="citations">Most cited</option>
        <option value="year">Newest papers</option>
      </select>
    </div>
  );
}
