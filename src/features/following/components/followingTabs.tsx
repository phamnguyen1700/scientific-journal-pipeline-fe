import { BookOpen, Tag } from "lucide-react";

import { cn } from "@/lib/utils";
import type { FollowingTab } from "@/types/library";

export function FollowingTabs({
  activeTab,
  topicCount,
  journalCount,
  onChange,
}: {
  activeTab: FollowingTab;
  topicCount: number;
  journalCount: number;
  onChange: (tab: FollowingTab) => void;
}) {
  return (
    <div className="following-tabs">
      <button type="button" onClick={() => onChange("topics")} className={cn("following-tab", activeTab === "topics" && "following-tab-active")}>
        <Tag /> Topics <span>{topicCount}</span>
      </button>
      <button type="button" onClick={() => onChange("journals")} className={cn("following-tab", activeTab === "journals" && "following-tab-active")}>
        <BookOpen /> Journals <span>{journalCount}</span>
      </button>
    </div>
  );
}
