"use client";

import { ArrowLeft, Bell, BellRing, Hash, Tag as TagIcon } from "lucide-react";
import Link from "next/link";

import { Tag } from "@/components/common";
import { useTopic } from "@/hooks/topics";
import { useUserFollowingTopics } from "@/hooks/user";
import { Button } from "@/shared/ui/button";

export function TopicDetailPage({ id }: { id: string }) {
  const topicQuery = useTopic(id);
  const followingTopicsQuery = useUserFollowingTopics();
  const topic = topicQuery.topic;

  if (topicQuery.loading) {
    return <TopicDetailStatus title="Loading topic..." description="Fetching topic details from the server." />;
  }

  if (topicQuery.error || !topic) {
    return (
      <TopicDetailStatus
        title="Topic not found"
        description={topicQuery.error ?? "The requested topic is not available."}
      />
    );
  }

  const topicId = topic.apiId ?? String(topic.id);
  const followedTopicIds = new Set(
    followingTopicsQuery.topics.flatMap((item) =>
      [item.id, item.apiId, item.name].filter(Boolean).map(String)
    )
  );
  const isFollowing =
    topic.followed ||
    followedTopicIds.has(String(topic.id)) ||
    followedTopicIds.has(topicId) ||
    followedTopicIds.has(topic.name);

  function toggleFollow() {
    if (isFollowing) {
      followingTopicsQuery.unfollowTopic(topicId);
    } else {
      followingTopicsQuery.followTopic(topicId);
    }
  }

  return (
    <div className="paper-detail-page">
      <Link href="/dashboard/topics" className="paper-detail-back">
        <ArrowLeft /> Back to topic search
      </Link>

      <article className="paper-detail-card">
        <div className="paper-detail-heading">
          <div>
            <div className="paper-result-badges">
              <span>Topic</span>
              <span>{topic.category}</span>
            </div>
            <h1 className="paper-detail-title">{topic.name}</h1>
            <p className="paper-detail-authors">{topic.description}</p>
          </div>

          <Button
            type="button"
            size="sm"
            variant={isFollowing ? "soft" : "outline"}
            disabled={followingTopicsQuery.saving}
            onClick={toggleFollow}
          >
            {isFollowing ? <BellRing /> : <Bell />}
            {isFollowing ? "Following" : "Follow"}
          </Button>
        </div>

        <div className="paper-detail-meta">
          <span><Hash />Topic ID: {topic.apiId ?? topic.id}</span>
          <span><TagIcon />{topic.keywords.length.toLocaleString()} keywords</span>
        </div>

        {topic.keywords.length > 0 && (
          <section className="paper-detail-section">
            <h2>Keywords</h2>
            <div className="paper-result-tags">
              {topic.keywords.map((keyword) => (
                <Tag key={keyword} color={topic.color}>{keyword}</Tag>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}

function TopicDetailStatus({ title, description }: { title: string; description: string }) {
  return (
    <div className="paper-detail-page">
      <Link href="/dashboard/topics" className="paper-detail-back">
        <ArrowLeft /> Back to topic search
      </Link>
      <div className="paper-search-empty">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}
