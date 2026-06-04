import { TrendingUp } from "lucide-react";

import type { ResearchTopic } from "@/types/topics";

export function PopularTopics({
  topics,
  onSelect,
}: {
  topics: ResearchTopic[];
  onSelect: (name: string) => void;
}) {
  return (
    <section className="topic-search-popular">
      <div>
        <h2 className="topic-search-section-title">Popular Topics</h2>
        <p className="topic-search-section-description">
          Most active research areas this month
        </p>
      </div>
      <div className="topic-search-popular-list">
        {topics.map((topic) => (
          <button
            key={topic.id}
            type="button"
            className="topic-search-popular-item"
            onClick={() => onSelect(topic.name)}
          >
            <span>{topic.name}</span>
            <span className="topic-search-popular-growth">
              <TrendingUp />
              {topic.growth}%
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
