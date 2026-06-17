import { Bell, BellRing, FileText, TrendingUp } from "lucide-react";

import { Tag } from "@/components/common";
import { Button } from "@/shared/ui/button";
import type { ResearchTopic } from "@/types/topics";

export function TopicCard({
  topic,
  onToggleFollow,
}: {
  topic: ResearchTopic;
  onToggleFollow: (id: number) => void;
}) {
  return (
    <article className="topic-card">
      <div className="topic-card-heading">
        <Tag color={topic.color}>{topic.category}</Tag>
        <Button
          type="button"
          size="sm"
          variant={topic.followed ? "soft" : "outline"}
          onClick={() => onToggleFollow(topic.id)}
        >
          {topic.followed ? <BellRing /> : <Bell />}
          {topic.followed ? "Following" : "Follow"}
        </Button>
      </div>

      <h2 className="topic-card-title">{topic.name}</h2>
      <p className="topic-card-description">{topic.description}</p>

      <div className="topic-card-keywords">
        {topic.keywords.map((keyword) => (
          <span key={keyword}>{keyword}</span>
        ))}
      </div>

      <div className="topic-card-footer">
        <span>
          <FileText />
          {topic.papers.toLocaleString()} papers
        </span>
        <span className="topic-card-growth">
          <TrendingUp />
          {topic.growth}% growth
        </span>
      </div>
    </article>
  );
}
