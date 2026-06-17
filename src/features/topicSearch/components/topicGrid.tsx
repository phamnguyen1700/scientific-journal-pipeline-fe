import type { ResearchTopic } from "@/types/topics";

import { TopicCard } from "@/features/topicSearch/components/topicCard";

export function TopicGrid({
  topics,
  onToggleFollow,
}: {
  topics: ResearchTopic[];
  onToggleFollow: (id: string | number) => void;
}) {
  if (!topics.length) {
    return (
      <div className="topic-search-empty">
        <h2>No topics found</h2>
        <p>Try a different keyword to discover more research areas.</p>
      </div>
    );
  }

  return (
    <div className="topic-search-grid">
      {topics.map((topic) => (
        <TopicCard key={topic.id} topic={topic} onToggleFollow={onToggleFollow} />
      ))}
    </div>
  );
}
