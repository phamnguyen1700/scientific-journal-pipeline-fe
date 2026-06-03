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
  month: string;
  ai: number;
  bio: number;
  climate: number;
};

export type TrendingTopic = {
  name: string;
  count: number;
  growth: number;
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
  title: string;
  journal: string;
  saved: string;
};
