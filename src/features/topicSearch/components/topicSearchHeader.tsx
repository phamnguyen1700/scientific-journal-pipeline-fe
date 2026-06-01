import { SearchInput } from "@/components/common";

export function TopicSearchHeader({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (query: string) => void;
}) {
  return (
    <div className="topic-search-header">
      <div>
        <h1 className="topic-search-title">Topic Search</h1>
        <p className="topic-search-description">
          Explore research areas, discover active fields, and follow the topics
          that matter to you.
        </p>
      </div>
      <SearchInput
        value={query}
        onChange={onQueryChange}
        placeholder="Search research topics..."
        className="w-full md:max-w-md"
      />
    </div>
  );
}
