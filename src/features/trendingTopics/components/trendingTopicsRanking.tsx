import { ArrowUpRight, Bookmark, TrendingUp, Users } from "lucide-react";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import type { TrendingTopicMetric } from "@/types/topics";

import { TopicSparkline } from "@/features/trendingTopics/components/topicSparkline";

export function TrendingTopicsRanking({
  topics,
}: {
  topics: TrendingTopicMetric[];
}) {
  return (
    <section className="trending-topics-ranking">
      <div className="trending-topics-ranking-header">
        <div>
          <h2 className="trending-topics-card-title">Topic Ranking</h2>
          <p className="trending-topics-card-description">
            Top research topics ordered by current growth rate
          </p>
        </div>
        <Badge variant="secondary">{topics.length} topics</Badge>
      </div>

      <div className="trending-topics-ranking-list">
        {topics.map((topic, index) => (
          <article key={topic.id} className="trending-topic-row">
            <span className="trending-topic-rank">{index + 1}</span>
            <div className="trending-topic-main">
              <div>
                <h3 className="trending-topic-name">{topic.name}</h3>
                <p className="trending-topic-category">{topic.category}</p>
              </div>
              <div className="trending-topic-stats">
                <span>{topic.papers.toLocaleString()} papers</span>
                <span>{topic.citations.toLocaleString()} citations</span>
                <span>
                  <Users />
                  {topic.followers.toLocaleString()}
                </span>
              </div>
            </div>
            <TopicSparkline data={topic.sparkline} color={topic.color} />
            <div className="trending-topic-growth">
              <TrendingUp />
              {topic.growth}%
            </div>
            <div className="trending-topic-actions">
              <Button type="button" variant="ghost" size="icon-sm" aria-label={`Bookmark ${topic.name}`}>
                <Bookmark />
              </Button>
              <Button type="button" variant="ghost" size="icon-sm" aria-label={`Open ${topic.name}`}>
                <ArrowUpRight />
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
