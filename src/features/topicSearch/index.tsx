"use client";

import { useMemo, useState } from "react";

import {
  PopularTopics,
  TopicGrid,
  TopicSearchHeader,
} from "@/features/topicSearch/components";
import { useTopics } from "@/hooks/topics";
import { useUserFollowingTopics } from "@/hooks/user";

export function TopicSearchPage() {
  const [query, setQuery] = useState("");
  const topicsQuery = useTopics();
  const followingTopicsQuery = useUserFollowingTopics();
  const followedTopicIds = useMemo(
    () =>
      new Set(
        followingTopicsQuery.topics.flatMap((topic) =>
          [topic.id, topic.apiId, topic.name].filter(Boolean).map(String)
        )
      ),
    [followingTopicsQuery.topics]
  );
  const topics = useMemo(
    () =>
      topicsQuery.topics.map((topic) => ({
        ...topic,
        followed:
          topic.followed ||
          followedTopicIds.has(String(topic.id)) ||
          (topic.apiId ? followedTopicIds.has(topic.apiId) : false) ||
          followedTopicIds.has(topic.name),
      })),
    [followedTopicIds, topicsQuery.topics]
  );

  const visibleTopics = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return topics;

    return topics.filter((topic) =>
      [
        topic.name,
        topic.category,
        topic.description,
        ...topic.keywords,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [query, topics]);

  const popularTopics = useMemo(
    () => [...topics].sort((first, second) => second.growth - first.growth).slice(0, 5),
    [topics]
  );

  function toggleFollow(id: string | number) {
    const topic = topics.find((item) => item.id === id);
    if (!topic) return;

    const topicId = topic.apiId ?? String(topic.id);
    if (topic.followed) {
      followingTopicsQuery.unfollowTopic(topicId);
    } else {
      followingTopicsQuery.followTopic(topicId);
    }
  }

  return (
    <div className="topic-search-page">
      <TopicSearchHeader query={query} onQueryChange={setQuery} />
      <PopularTopics topics={popularTopics} onSelect={setQuery} />
      <section className="topic-search-results">
        <div>
          <h2 className="topic-search-section-title">Explore Topics</h2>
          <p className="topic-search-section-description">
            {visibleTopics.length} research topics found
          </p>
        </div>
        {topicsQuery.loading ? (
          <div className="paper-search-empty">Loading research topics...</div>
        ) : topicsQuery.error ? (
          <div className="paper-search-empty">{topicsQuery.error}</div>
        ) : (
          <TopicGrid topics={visibleTopics} onToggleFollow={toggleFollow} />
        )}
      </section>
    </div>
  );
}
