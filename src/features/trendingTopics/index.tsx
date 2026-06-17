"use client";

import { useMemo, useState } from "react";

import {
  TrendingTopicKpis,
  TrendingTopicsChart,
  TrendingTopicsHeader,
  TrendingTopicsRanking,
} from "@/features/trendingTopics/components";
import type {
  TrendingTimeRange,
  TrendingTopicChartPoint,
  TrendingTopicMetric,
} from "@/types/topics";

const trendingTopics: TrendingTopicMetric[] = [
  {
    id: 1,
    name: "Federated Learning",
    category: "Machine Learning",
    color: "#EF4444",
    papers: 1247,
    growth: 42.8,
    citations: 38900,
    followers: 3840,
    sparkline: [18, 24, 31, 38, 49, 63, 78],
  },
  {
    id: 2,
    name: "Large Language Models",
    category: "Artificial Intelligence",
    color: "#6C4CF1",
    papers: 4821,
    growth: 38.2,
    citations: 142800,
    followers: 12640,
    sparkline: [42, 49, 56, 68, 74, 88, 96],
  },
  {
    id: 3,
    name: "Quantum Computing",
    category: "Computer Science",
    color: "#3B82F6",
    papers: 2340,
    growth: 24.7,
    citations: 61200,
    followers: 5210,
    sparkline: [31, 35, 43, 46, 55, 61, 69],
  },
  {
    id: 4,
    name: "Climate Modeling",
    category: "Earth Science",
    color: "#10B981",
    papers: 1892,
    growth: 18.4,
    citations: 54800,
    followers: 4320,
    sparkline: [39, 42, 44, 51, 54, 58, 64],
  },
  {
    id: 5,
    name: "CRISPR Gene Editing",
    category: "Biotechnology",
    color: "#F59E0B",
    papers: 1654,
    growth: 15.1,
    citations: 73400,
    followers: 3960,
    sparkline: [48, 52, 53, 58, 61, 65, 68],
  },
  {
    id: 6,
    name: "Bioinformatics",
    category: "Life Science",
    color: "#06B6D4",
    papers: 2890,
    growth: 12.8,
    citations: 87600,
    followers: 6120,
    sparkline: [51, 53, 56, 59, 61, 64, 67],
  },
];

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
  const chartData = useMemo(() => chartDataByRange[range], [range]);

  return (
    <div className="trending-topics-page">
      <TrendingTopicsHeader range={range} onRangeChange={setRange} />
      <TrendingTopicKpis />
      <TrendingTopicsChart data={chartData} />
      <TrendingTopicsRanking topics={trendingTopics} />
    </div>
  );
}

export { chartDataByRange, trendingTopics };
