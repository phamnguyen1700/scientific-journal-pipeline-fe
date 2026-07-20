"use client";

import { useMemo, useState } from "react";

import {
  PopularTopics,
  TopicGrid,
  TopicSearchHeader,
} from "@/features/topicSearch/components";
import { useTopics } from "@/hooks/topics";
import { useUserFollowingTopics } from "@/hooks/user";
import type { TagColor } from "@/types/common";
import type { ResearchTopic, TopicApiModel } from "@/types/topics";

export function TopicSearchPage({ embedded = false }: { embedded?: boolean }) {
  const [query, setQuery] = useState("");
  const topicsQuery = useTopics();
  const followingTopicsQuery = useUserFollowingTopics();
  const followedTopicIds = useMemo(
    () =>
      new Set(
        followingTopicsQuery.topics.flatMap((topic) =>
          [topic.topicId, topic.topicName].filter(Boolean).map(String)
        )
      ),
    [followingTopicsQuery.topics]
  );
  const topics = useMemo(
    () =>
      topicsQuery.topics.map((topic) => {
        const topicItem = toResearchTopic(topic);

        return {
          ...topicItem,
          followed:
            topicItem.followed ||
            followedTopicIds.has(String(topicItem.id)) ||
            (topicItem.apiId ? followedTopicIds.has(topicItem.apiId) : false) ||
            followedTopicIds.has(topicItem.name),
        };
      }),
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
    <div className={embedded ? "topic-search-embedded" : "topic-search-page"}>
      <TopicSearchHeader
        description={
          embedded
            ? "Search the topic catalog and follow the areas you want to track."
            : undefined
        }
        query={query}
        onQueryChange={setQuery}
        title={embedded ? "Topic Search" : undefined}
      />
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

function toResearchTopic(topic: TopicApiModel): ResearchTopic {
  return {
    id: topic.topicId,
    apiId: topic.topicId,
    name: topic.topicName,
    description: topic.description ?? "No topic description available.",
    category: topic.category ?? "Research Topic",
    color: getTopicColor(topic.category),
    papers: topic.paperCount ?? 0,
    growth: topic.growthPercentage ?? 0,
    trend: "up",
    followed: topic.followed ?? false,
    keywords: topic.keywords ?? [],
  };
}

function getTopicColor(category: string | null | undefined): TagColor {
  const colors: TagColor[] = ["purple", "blue", "green", "amber", "red", "cyan"];
  if (!category) return "gray";

  const index = category
    .split("")
    .reduce((total, character) => total + character.charCodeAt(0), 0);

  return colors[index % colors.length];
}
