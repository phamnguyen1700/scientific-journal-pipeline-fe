import { Bell, BellRing, FileText, TrendingUp } from "lucide-react";
import Link from "next/link";

import { Tag } from "@/components/common";
import { Button } from "@/shared/ui/button";
import type { ResearchTopic } from "@/types/topics";

export function TopicCard({
  topic,
  onToggleFollow,
}: {
  topic: ResearchTopic;
  onToggleFollow: (id: string | number) => void;
}) {
  const topicHref = `/dashboard/topics/${topic.apiId ?? topic.id}`;

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

      <Link href={topicHref} className="topic-card-link">
        <h2 className="topic-card-title">{topic.name}</h2>
        <p className="topic-card-description">{topic.description}</p>
      </Link>

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
