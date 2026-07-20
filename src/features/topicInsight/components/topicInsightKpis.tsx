import { Activity, FileText, TrendingUp, Users } from "lucide-react";

import { KpiCard } from "@/components/common";
import type { TrendingTopicMetric } from "@/types/topics";

export function TopicInsightKpis({
  topics,
}: {
  topics: TrendingTopicMetric[];
}) {
  const fastestTopic = topics.reduce<TrendingTopicMetric | null>(
    (current, topic) =>
      !current || topic.growth > current.growth ? topic : current,
    null,
  );
  const currentYearPapers = topics.reduce(
    (total, topic) => total + topic.currentYearPapers,
    0,
  );
  const topCurrentYearTopic = topics.reduce<TrendingTopicMetric | null>(
    (current, topic) =>
      !current || topic.currentYearPapers > current.currentYearPapers
        ? topic
        : current,
    null,
  );
  const totalFollowers = topics.reduce(
    (total, topic) => total + topic.followers,
    0,
  );

  return (
    <div className="trending-topics-kpi-grid">
      <KpiCard
        icon={<Activity />}
        iconColor="bg-purple-100"
        iconTextColor="text-purple-600"
        label="Active Topics"
        value={topics.length.toLocaleString()}
        trend="up"
        trendValue={topics.length ? `${topics.length}` : "0"}
        sub="this month"
      />
      <KpiCard
        icon={<FileText />}
        iconColor="bg-blue-100"
        iconTextColor="text-blue-600"
        label="New Publications"
        value={currentYearPapers.toLocaleString()}
        trend="up"
        sub={
          topCurrentYearTopic?.currentYearPapers
            ? topCurrentYearTopic.name
            : `No publications in ${new Date().getFullYear()}`
        }
      />
      <KpiCard
        icon={<TrendingUp />}
        iconColor="bg-emerald-100"
        iconTextColor="text-emerald-600"
        label="Most Growth"
        value={fastestTopic ? `${fastestTopic.growth}%` : "0%"}
        sub={fastestTopic?.name ?? "No topic data"}
      />
      <KpiCard
        icon={<Users />}
        iconColor="bg-amber-100"
        iconTextColor="text-amber-600"
        label="New Followers"
        value={formatCompactNumber(totalFollowers)}
        trend="up"
        trendValue={topics.length ? `${topics.length} topics` : "0 topics"}
        sub="across trending topics"
      />
    </div>
  );
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
