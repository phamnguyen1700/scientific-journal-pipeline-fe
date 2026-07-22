"use client";

import { useMemo, useState } from "react";

import {
  FollowedJournalCard,
  FollowedTopicCard,
  FollowingHeader,
  FollowingTabs,
} from "@/features/following/components";
import { JournalDetailDrawer } from "@/features/journals";
import {
  useUserFollowingJournals,
  useUserFollowingTopics,
} from "@/hooks/user";
import type { FollowedJournal, FollowedTopic, FollowingTab } from "@/types/library";
import type { UserFollowedJournal, UserFollowedTopic } from "@/types/user";

export function FollowingPage() {
  const [activeTab, setActiveTab] = useState<FollowingTab>("topics");
  const topicsQuery = useUserFollowingTopics();
  const journalsQuery = useUserFollowingJournals();
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(null);
  const [topicAlertOverrides, setTopicAlertOverrides] = useState<
    Record<string, boolean>
  >({});
  const [journalAlertOverrides, setJournalAlertOverrides] = useState<
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
  const journals = useMemo(
    () =>
      journalsQuery.journals.map((journal) => {
        const followedJournal = toFollowedJournal(journal);

        return {
          ...followedJournal,
          alertOn:
            journalAlertOverrides[String(followedJournal.id)] ??
            followedJournal.alertOn,
        };
      }),
    [journalAlertOverrides, journalsQuery.journals],
  );

  return (
    <div className="library-page">
      <FollowingHeader />
      <FollowingTabs
        activeTab={activeTab}
        topicCount={topics.length}
        journalCount={journals.length}
        onChange={setActiveTab}
      />
      {activeTab === "topics" && topicsQuery.loading ? (
        <div className="paper-search-empty">Loading followed topics...</div>
      ) : activeTab === "topics" && topicsQuery.error ? (
        <div className="paper-search-empty">{topicsQuery.error}</div>
      ) : activeTab === "journals" && journalsQuery.loading ? (
        <div className="paper-search-empty">Loading followed journals...</div>
      ) : activeTab === "journals" && journalsQuery.error ? (
        <div className="paper-search-empty">{journalsQuery.error}</div>
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
            journals.length ? (
              journals.map((journal) => (
                <FollowedJournalCard
                  key={journal.id}
                  journal={journal}
                  onOpen={(id) => setSelectedJournalId(String(id))}
                  onToggleAlert={(id) =>
                    setJournalAlertOverrides((items) => ({
                      ...items,
                      [String(id)]: !(items[String(id)] ?? journal.alertOn),
                    }))
                  }
                  onRemove={(id) => journalsQuery.unfollowJournal(id)}
                />
              ))
            ) : (
              <div className="paper-search-empty">
                No followed journals found.
              </div>
            )
          )}
        </div>
      )}
      <JournalDetailDrawer
        journalId={selectedJournalId}
        open={Boolean(selectedJournalId)}
        onOpenChange={(open) => {
          if (!open) setSelectedJournalId(null);
        }}
      />
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

function toFollowedJournal(journal: UserFollowedJournal): FollowedJournal {
  return {
    id: journal.journalId,
    apiId: journal.journalId,
    name: journal.journalName,
    publisher: journal.normalizedName ?? "Journal",
    followedAt: journal.createdAt,
    alertOn: true,
  };
}
