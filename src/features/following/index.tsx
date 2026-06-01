"use client";

import { useState } from "react";

import { FollowedJournalCard, FollowedTopicCard, FollowingHeader, FollowingTabs } from "@/features/following/components";
import type { FollowedJournal, FollowedTopic, FollowingTab } from "@/types/library";

const initialTopics: FollowedTopic[] = [
  { id: 1, name: "Large Language Models", category: "Artificial Intelligence", papers: 4821, growth: 38.2, alertOn: true },
  { id: 2, name: "Climate Modeling", category: "Earth Science", papers: 1892, growth: 18.4, alertOn: true },
  { id: 3, name: "Bioinformatics", category: "Life Science", papers: 2890, growth: 12.8, alertOn: false },
];
const initialJournals: FollowedJournal[] = [
  { id: 1, name: "Nature Machine Intelligence", publisher: "Springer Nature", papers: 1240, impactFactor: 23.8, alertOn: true },
  { id: 2, name: "Cell", publisher: "Cell Press", papers: 3850, impactFactor: 64.5, alertOn: true },
  { id: 3, name: "Science", publisher: "AAAS", papers: 4920, impactFactor: 56.9, alertOn: false },
];

export function FollowingPage() {
  const [activeTab, setActiveTab] = useState<FollowingTab>("topics");
  const [topics, setTopics] = useState(initialTopics);
  const [journals, setJournals] = useState(initialJournals);
  return (
    <div className="library-page">
      <FollowingHeader />
      <FollowingTabs activeTab={activeTab} topicCount={topics.length} journalCount={journals.length} onChange={setActiveTab} />
      <div className="following-grid">
        {activeTab === "topics"
          ? topics.map((topic) => <FollowedTopicCard key={topic.id} topic={topic} onToggleAlert={(id) => setTopics((items) => items.map((item) => item.id === id ? { ...item, alertOn: !item.alertOn } : item))} onRemove={(id) => setTopics((items) => items.filter((item) => item.id !== id))} />)
          : journals.map((journal) => <FollowedJournalCard key={journal.id} journal={journal} onToggleAlert={(id) => setJournals((items) => items.map((item) => item.id === id ? { ...item, alertOn: !item.alertOn } : item))} onRemove={(id) => setJournals((items) => items.filter((item) => item.id !== id))} />)}
      </div>
    </div>
  );
}
