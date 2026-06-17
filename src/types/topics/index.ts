import type { TagColor } from "@/types/common";

export type TopicTrend = "up" | "stable";

export type ResearchTopic = {
  id: string | number;
  apiId?: string;
  name: string;
  description: string;
  category: string;
  color: TagColor;
  papers: number;
  growth: number;
  trend: TopicTrend;
  followed: boolean;
  keywords: string[];
};

export type TrendingTimeRange = "7-days" | "30-days" | "6-months";

export type TrendingTopicMetric = {
  id: string | number;
  name: string;
  category: string;
  color: string;
  papers: number;
  growth: number;
  citations: number;
  followers: number;
  sparkline: number[];
};

export type TrendingTopicChartPoint = {
  label: string;
  llm: number;
  federated: number;
  quantum: number;
  climate: number;
};
