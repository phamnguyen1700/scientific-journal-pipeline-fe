import { SearchInput } from "@/components/common";

export function TopicSearchHeader({
  description = "Explore research areas, discover active fields, and follow the topics that matter to you.",
  query,
  onQueryChange,
  title = "Topic Search",
}: {
  description?: string;
  query: string;
  onQueryChange: (query: string) => void;
  title?: string;
}) {
  return (
    <div className="topic-search-header">
      <div>
        <h1 className="topic-search-title">{title}</h1>
        <p className="topic-search-description">
          {description}
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
