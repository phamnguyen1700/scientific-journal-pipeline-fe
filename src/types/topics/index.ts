import type { TagColor } from "@/types/common";

export type TopicTrend = "up" | "stable";

export type TopicApiModel = {
  topicId: string;
  topicName: string;
  normalizedName?: string | null;
  description?: string | null;
  category?: string | null;
  paperCount?: number;
  growthPercentage?: number;
  keywords?: string[];
  followed?: boolean;
};

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

export type TopicApiResponse<T> = {
  succeeded: boolean;
  result: T | null;
  errors: string[];
};

export type TopicListResult = {
  total?: number;
  page?: number;
  size?: number;
  totalPages?: number;
  results: TopicApiModel[];
};

export type TopicListApiResponse = TopicApiResponse<TopicListResult>;
export type TopicDetailApiResponse = TopicApiResponse<TopicApiModel | null>;
