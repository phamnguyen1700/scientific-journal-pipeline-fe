import type { LucideIcon } from "lucide-react";

export type DashboardKpi = {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  iconColor: string;
  iconTextColor: string;
  trendValue?: string;
};

export type TrendPoint = {
  year: string;
  [topicKey: string]: string | number;
};

export type TrendSeries = {
  key: string;
  name: string;
  color: string;
};

export type TrendingTopic = {
  name: string;
  count: number;
  growth?: number;
  color: string;
};

export type RecentPaper = {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  citations: number;
  tags: string[];
};

export type BookmarkedPaper = {
  id?: string;
  title: string;
  journal: string;
  saved: string;
};

export type StudentDashboardData = {
  bookmarks: BookmarkedPaper[];
  followedTopicCount: number;
  trendingTopics: TrendingTopic[];
  trendData: TrendPoint[];
  trendSeries: TrendSeries[];
  stats: {
    bookmarkedPapers?: number;
    followedTopics?: number;
    journalAlerts?: number;
    newPapers?: number;
  };
};

export type DashboardApiResponse<T> = {
  succeeded: boolean;
  result: T | null;
  errors: string[];
};

export type DashboardSummary = {
  bookmarkedPapers?: number;
  followedTopics?: number;
  journalAlerts?: number;
  newPapers?: number;
};

export type DashboardHotTopic = {
  topicName: string;
  paperCount: number;
  averageGrowthPercentage?: number;
  growthPercentage?: number;
  totalPercentage?: number;
  yearlyCounts?: Array<{
    year: number;
    count: number;
  }>;
};

export type DashboardPublicationTrendPoint = {
  year: number;
  monthNumber: number;
  month: string;
  count: number;
};

export type DashboardPublicationTrend = {
  topicName: string;
  monthlyCounts: DashboardPublicationTrendPoint[];
};
