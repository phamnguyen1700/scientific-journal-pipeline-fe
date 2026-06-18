"use client";

import { Bell, Bookmark, BookMarked, FileText } from "lucide-react";

import {
  BookmarksCard,
  DashboardHeader,
  DashboardKpiGrid,
  HotTopicsCard,
  PublicationTrendsCard,
  RecentPapersCard,
} from "@/features/dashboard/components";
import type { DashboardKpi } from "@/types/dashboard";
import { toPaperSearchResult } from "@/features/paperSearch/paperMapper";
import { useStudentDashboard } from "@/hooks/dashboard";
import { usePaperSearch } from "@/hooks/search";
import { useUserProfile } from "@/hooks/user";

const dashboardKpis: DashboardKpi[] = [
  {
    icon: Bookmark,
    iconColor: "bg-purple-100",
    iconTextColor: "text-purple-600",
    label: "Bookmarked Papers",
    value: "0",
    sub: "saved in your library",
  },
  {
    icon: BookMarked,
    iconColor: "bg-blue-100",
    iconTextColor: "text-blue-600",
    label: "Followed Topics",
    value: "0",
    sub: "topics you follow",
  },
  {
    icon: Bell,
    iconColor: "bg-amber-100",
    iconTextColor: "text-amber-600",
    label: "Journal Alerts",
    value: "0",
    sub: "from analytics dashboard",
  },
  {
    icon: FileText,
    iconColor: "bg-emerald-100",
    iconTextColor: "text-emerald-600",
    label: "New Papers",
    value: "0",
    sub: "from search index",
  },
];

export function StudentDashboardPage() {
  const papersQuery = usePaperSearch({ page: 1, size: 4 });
  const dashboardQuery = useStudentDashboard();
  const profileQuery = useUserProfile();
  const studentDashboard = dashboardQuery.data;
  const displayName = profileQuery.profile?.username ?? "Researcher";
  const apiRecentPapers = papersQuery.papers.map((paper, index) => {
    const result = toPaperSearchResult(paper, index);

    return {
      id: result.id,
      title: result.title,
      authors: result.authors.join(", "),
      journal: result.journal,
      year: result.year,
      citations: result.citations,
      tags: result.tags,
    };
  });
  const kpiItems = dashboardKpis.map((item) =>
    mapDashboardKpi(item, {
      bookmarkedPapers: studentDashboard.stats.bookmarkedPapers ?? studentDashboard.bookmarks.length,
      followedTopics: studentDashboard.stats.followedTopics ?? studentDashboard.followedTopicCount,
      journalAlerts: studentDashboard.stats.journalAlerts,
      newPapers: studentDashboard.stats.newPapers ?? papersQuery.total,
    })
  );

  return (
    <div className="dashboard-page">
      <DashboardHeader name={displayName} />
      <DashboardKpiGrid items={kpiItems} />
      <div className="dashboard-grid">
        <PublicationTrendsCard data={studentDashboard.trendData} series={studentDashboard.trendSeries} />
        <HotTopicsCard topics={studentDashboard.trendingTopics} />
      </div>
      <div className="dashboard-grid">
        <RecentPapersCard
          error={papersQuery.error}
          loading={papersQuery.loading}
          papers={apiRecentPapers}
        />
        <BookmarksCard
          error={dashboardQuery.error}
          loading={dashboardQuery.loading}
          papers={studentDashboard.bookmarks}
          total={studentDashboard.stats.bookmarkedPapers ?? studentDashboard.bookmarks.length}
        />
      </div>
    </div>
  );
}

function mapDashboardKpi(
  item: DashboardKpi,
  stats: {
    bookmarkedPapers?: number;
    followedTopics?: number;
    journalAlerts?: number;
    newPapers?: number;
  }
): DashboardKpi {
  if (item.label === "Bookmarked Papers" && stats.bookmarkedPapers !== undefined) {
    return { ...item, value: String(stats.bookmarkedPapers), sub: "saved in your library" };
  }

  if (item.label === "Followed Topics" && stats.followedTopics !== undefined) {
    return { ...item, value: String(stats.followedTopics), sub: "topics you follow" };
  }

  if (item.label === "Journal Alerts" && stats.journalAlerts !== undefined) {
    return { ...item, value: String(stats.journalAlerts), sub: "from analytics dashboard" };
  }

  if (item.label === "New Papers" && stats.newPapers !== undefined) {
    return { ...item, value: String(stats.newPapers), sub: "from search index" };
  }

  return item;
}

