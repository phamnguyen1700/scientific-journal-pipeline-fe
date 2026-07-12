"use client";

import { useMemo, useState } from "react";

import {
  FollowedTopicCard,
  FollowingHeader,
  FollowingTabs,
} from "@/features/following/components";
import { useUserFollowingTopics } from "@/hooks/user";
import type { FollowedTopic, FollowingTab } from "@/types/library";
import type { UserFollowedTopic } from "@/types/user";

export function FollowingPage() {
  const [activeTab, setActiveTab] = useState<FollowingTab>("topics");
  const topicsQuery = useUserFollowingTopics();
  const [topicAlertOverrides, setTopicAlertOverrides] = useState<
    Record<string, boolean>
  >({});
  const topics = useMemo(
    () =>
      topicsQuery.topics.map((topic) => {
        const followedTopic = toFollowedTopic(topic);

        return {
          ...followedTopic,
          alertOn:
            topicAlertOverrides[String(followedTopic.id)] ??
            followedTopic.alertOn,
        };
      }),
    [topicAlertOverrides, topicsQuery.topics],
  );

  return (
    <div className="library-page">
      <FollowingHeader />
      <FollowingTabs
        activeTab={activeTab}
        topicCount={topics.length}
        journalCount={0}
        onChange={setActiveTab}
      />
      {activeTab === "topics" && topicsQuery.loading ? (
        <div className="paper-search-empty">Loading followed topics...</div>
      ) : activeTab === "topics" && topicsQuery.error ? (
        <div className="paper-search-empty">{topicsQuery.error}</div>
      ) : (
        <div className="following-grid">
          {activeTab === "topics" ? (
            topics.length ? (
              topics.map((topic) => (
                <FollowedTopicCard
                  key={topic.id}
                  topic={topic}
                  onToggleAlert={(id) =>
                    setTopicAlertOverrides((items) => ({
                      ...items,
                      [String(id)]: !(items[String(id)] ?? topic.alertOn),
                    }))
                  }
                  onRemove={(id) => topicsQuery.unfollowTopic(id)}
                />
              ))
            ) : (
              <div className="paper-search-empty">
                No followed topics found.
              </div>
            )
          ) : (
            <div className="paper-search-empty">
              No followed journal API is configured yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function toFollowedTopic(topic: UserFollowedTopic): FollowedTopic {
  return {
    id: topic.topicId,
    apiId: topic.topicId,
    name: topic.topicName,
    category: topic.category ?? "Research topic",
    papers: topic.paperCount ?? 0,
    growth: topic.growthPercentage ?? 0,
    alertOn: topic.alertOn ?? true,
  };
}
