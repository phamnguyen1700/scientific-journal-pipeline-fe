import { Bell, Bookmark, BookMarked, FileText } from "lucide-react";

import {
  BookmarksCard,
  DashboardHeader,
  DashboardKpiGrid,
  HotTopicsCard,
  PublicationTrendsCard,
  RecentPapersCard,
} from "@/features/dashboard/components";
import type {
  BookmarkedPaper,
  DashboardKpi,
  RecentPaper,
  TrendingTopic,
  TrendPoint,
} from "@/types/dashboard";

const dashboardKpis: DashboardKpi[] = [
  {
    icon: Bookmark,
    iconColor: "bg-purple-100",
    iconTextColor: "text-purple-600",
    label: "Bookmarked Papers",
    value: "47",
    trendValue: "+3",
    sub: "this week",
  },
  {
    icon: BookMarked,
    iconColor: "bg-blue-100",
    iconTextColor: "text-blue-600",
    label: "Followed Topics",
    value: "12",
    sub: "2 new alerts",
  },
  {
    icon: Bell,
    iconColor: "bg-amber-100",
    iconTextColor: "text-amber-600",
    label: "Journal Alerts",
    value: "5",
    sub: "3 unread",
  },
  {
    icon: FileText,
    iconColor: "bg-emerald-100",
    iconTextColor: "text-emerald-600",
    label: "New Papers",
    value: "23",
    sub: "Since last visit",
  },
];

const trendData: TrendPoint[] = [
  { month: "Jan", ai: 1240, bio: 890, climate: 540 },
  { month: "Feb", ai: 1380, bio: 920, climate: 610 },
  { month: "Mar", ai: 1520, bio: 980, climate: 590 },
  { month: "Apr", ai: 1690, bio: 1040, climate: 680 },
  { month: "May", ai: 1830, bio: 1100, climate: 720 },
  { month: "Jun", ai: 2010, bio: 1180, climate: 800 },
];

const trendingTopics: TrendingTopic[] = [
  { name: "Large Language Models", count: 4821, growth: 38.2, color: "#6C4CF1" },
  { name: "Quantum Computing", count: 2340, growth: 24.7, color: "#8B5CF6" },
  { name: "Climate Modeling", count: 1892, growth: 18.4, color: "#10B981" },
  { name: "CRISPR Gene Editing", count: 1654, growth: 15.1, color: "#F59E0B" },
  { name: "Federated Learning", count: 1247, growth: 42.8, color: "#EF4444" },
];

const recentPapers: RecentPaper[] = [
  {
    id: 1,
    title: "Large Language Models in Scientific Discovery: A Systematic Review",
    authors: "Chen, L., Wang, H., Liu, Y.",
    journal: "Nature Machine Intelligence",
    year: 2024,
    citations: 148,
    tags: ["LLM", "AI", "Science"],
  },
  {
    id: 2,
    title: "CRISPR-Cas9 Applications in Therapeutic Genomics: Recent Advances",
    authors: "Patel, R., Kumar, S., Sharma, A.",
    journal: "Cell",
    year: 2024,
    citations: 312,
    tags: ["CRISPR", "Genomics", "Therapy"],
  },
  {
    id: 3,
    title: "Graph Neural Networks for Drug-Target Interaction Prediction",
    authors: "Zhou, M., Li, X., Zhang, W.",
    journal: "Journal of Chemical Information",
    year: 2024,
    citations: 87,
    tags: ["GNN", "Drug Discovery", "ML"],
  },
  {
    id: 4,
    title: "Climate Change Impacts on Biodiversity: A Meta-analysis",
    authors: "Muller, K., Jacobs, F., Martin, C.",
    journal: "Science",
    year: 2024,
    citations: 224,
    tags: ["Climate", "Ecology"],
  },
];

const bookmarkedPapers: BookmarkedPaper[] = [
  { title: "Attention Is All You Need - Revisited", journal: "arXiv", saved: "2 days ago" },
  { title: "Protein Structure Prediction with AlphaFold 3", journal: "Nature", saved: "1 week ago" },
  { title: "Diffusion Models for Scientific Simulation", journal: "NeurIPS 2024", saved: "2 weeks ago" },
];

export function StudentDashboardPage() {
  return (
    <div className="dashboard-page">
      <DashboardHeader name="Minh" />
      <DashboardKpiGrid items={dashboardKpis} />
      <div className="dashboard-grid">
        <PublicationTrendsCard data={trendData} />
        <HotTopicsCard topics={trendingTopics} />
      </div>
      <div className="dashboard-grid">
        <RecentPapersCard papers={recentPapers} />
        <BookmarksCard papers={bookmarkedPapers} />
      </div>
    </div>
  );
}

export {
  bookmarkedPapers,
  dashboardKpis,
  recentPapers,
  trendingTopics,
  trendData,
};
