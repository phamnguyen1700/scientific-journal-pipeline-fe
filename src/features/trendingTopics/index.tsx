"use client";

import { useMemo, useState } from "react";

import {
  TrendingTopicKpis,
  TrendingTopicsChart,
  TrendingTopicsHeader,
  TrendingTopicsRanking,
} from "@/features/trendingTopics/components";
import { useTrendingTopicMetrics } from "@/hooks/trends";
import type {
  TrendingTimeRange,
  TrendingTopicChartPoint,
} from "@/types/topics";

const chartDataByRange: Record<TrendingTimeRange, TrendingTopicChartPoint[]> = {
  "7-days": [
    { label: "Mon", llm: 92, federated: 48, quantum: 41, climate: 34 },
    { label: "Tue", llm: 98, federated: 54, quantum: 43, climate: 36 },
    { label: "Wed", llm: 104, federated: 63, quantum: 48, climate: 37 },
    { label: "Thu", llm: 112, federated: 72, quantum: 52, climate: 41 },
    { label: "Fri", llm: 121, federated: 84, quantum: 56, climate: 44 },
    { label: "Sat", llm: 128, federated: 95, quantum: 61, climate: 48 },
    { label: "Sun", llm: 136, federated: 109, quantum: 67, climate: 51 },
  ],
  "30-days": [
    { label: "Week 1", llm: 420, federated: 218, quantum: 185, climate: 142 },
    { label: "Week 2", llm: 468, federated: 264, quantum: 209, climate: 158 },
    { label: "Week 3", llm: 532, federated: 338, quantum: 236, climate: 176 },
    { label: "Week 4", llm: 604, federated: 427, quantum: 278, climate: 201 },
  ],
  "6-months": [
    { label: "Jan", llm: 2900, federated: 680, quantum: 1200, climate: 1400 },
    { label: "Feb", llm: 3200, federated: 850, quantum: 1380, climate: 1500 },
    { label: "Mar", llm: 3600, federated: 1050, quantum: 1540, climate: 1590 },
    { label: "Apr", llm: 3900, federated: 1250, quantum: 1720, climate: 1680 },
    { label: "May", llm: 4400, federated: 1450, quantum: 1930, climate: 1780 },
    { label: "Jun", llm: 4821, federated: 1620, quantum: 2140, climate: 1890 },
  ],
};

export function TrendingTopicsPage() {
  const [range, setRange] = useState<TrendingTimeRange>("30-days");
  const topicsQuery = useTrendingTopicMetrics();
  const chartData = useMemo(() => chartDataByRange[range], [range]);

  return (
    <div className="trending-topics-page">
      <TrendingTopicsHeader range={range} onRangeChange={setRange} />
      <TrendingTopicKpis topics={topicsQuery.topics} />
      <TrendingTopicsChart data={chartData} />
      {topicsQuery.loading ? (
        <div className="paper-search-empty">Loading trending topics...</div>
      ) : topicsQuery.error ? (
        <div className="paper-search-empty">{topicsQuery.error}</div>
      ) : (
        <TrendingTopicsRanking topics={topicsQuery.topics} />
      )}
    </div>
  );
}

export { chartDataByRange };
