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
import {
  getDashboardErrorMessage,
  useDashboardAnalytics,
  useDashboardSummary,
} from "@/hooks/dashboard";
import { useKeywordsOverTime, useTopTopics } from "@/hooks/analytics";
import { usePaperSearch } from "@/hooks/search";
import {
  useUserBookmarks,
  useUserFollowingTopics,
  useUserProfile,
} from "@/hooks/user";
import type { AnalyticsKeyValue, AnalyticsSeries } from "@/types/analytics";
import type {
  BookmarkedPaper,
  DashboardKpi,
  RecentPaper,
  TrendingTopic,
  TrendPoint,
  TrendSeries,
} from "@/types/dashboard";
import type { PaperSearchPaper } from "@/types/search";
import type { UserBookmark } from "@/types/user";

const topicColors = ["#6C4CF1", "#10B981", "#F59E0B", "#EF4444", "#2563EB"];
const publicationTrendKeywords = [
  "Computer science",
  "Artificial intelligence",
  "Machine learning",
  "Data science",
  "Deep learning",
];

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
  const profileQuery = useUserProfile();
  const bookmarksQuery = useUserBookmarks();
  const followingTopicsQuery = useUserFollowingTopics();
  const summaryQuery = useDashboardSummary();
  const analyticsQuery = useDashboardAnalytics();
  const topTopicsQuery = useTopTopics(10);
  const publicationTrendsQuery = useKeywordsOverTime(publicationTrendKeywords);

  const displayName = profileQuery.profile?.username ?? "Researcher";
  const bookmarks = toDashboardBookmarks(bookmarksQuery.bookmarks).slice(0, 4);
  const followedTopics = followingTopicsQuery.topics;
  const summary = summaryQuery.data;
  const analytics = analyticsQuery.data;
  const publicationTrends = toPublicationTrends(
    publicationTrendsQuery.data ?? [],
  );
  const trendingTopics = toTopTopicItems(topTopicsQuery.data ?? []);
  const recentPapers = toRecentPapers(papersQuery.papers);
  const bookmarkTotal =
    summary?.bookmarkedPapers ?? bookmarksQuery.bookmarks.length;
  const followedTopicCount =
    summary?.followedTopics ??
    analytics?.followedTopics ??
    followedTopics.length;
  const kpiItems = dashboardKpis.map((item) =>
    mapDashboardKpi(item, {
      bookmarkedPapers: bookmarkTotal,
      followedTopics: followedTopicCount,
      journalAlerts: summary?.journalAlerts,
      newPapers:
        summary?.newPapers ??
        analytics?.newPapersInFollowedTopics ??
        papersQuery.total,
    }),
  );

  return (
    <div className="dashboard-page">
      <DashboardHeader name={displayName} />
      <DashboardKpiGrid items={kpiItems} />
      <div className="dashboard-grid">
        <PublicationTrendsCard
          data={publicationTrends.data}
          series={publicationTrends.series}
        />
        <HotTopicsCard topics={trendingTopics} />
      </div>
      <div className="dashboard-grid">
        <RecentPapersCard
          error={papersQuery.error}
          loading={papersQuery.loading}
          papers={recentPapers}
        />
        <BookmarksCard
          error={
            bookmarksQuery.error ?? getDashboardErrorMessage(summaryQuery.error)
          }
          loading={bookmarksQuery.loading || summaryQuery.isPending}
          papers={bookmarks}
          total={bookmarkTotal}
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
  },
): DashboardKpi {
  if (
    item.label === "Bookmarked Papers" &&
    stats.bookmarkedPapers !== undefined
  ) {
    return {
      ...item,
      value: String(stats.bookmarkedPapers),
      sub: "saved in your library",
    };
  }

  if (item.label === "Followed Topics" && stats.followedTopics !== undefined) {
    return {
      ...item,
      value: String(stats.followedTopics),
      sub: "topics you follow",
    };
  }

  if (item.label === "Journal Alerts" && stats.journalAlerts !== undefined) {
    return {
      ...item,
      value: String(stats.journalAlerts),
      sub: "from analytics dashboard",
    };
  }

  if (item.label === "New Papers" && stats.newPapers !== undefined) {
    return {
      ...item,
      value: String(stats.newPapers),
      sub: "from search index",
    };
  }

  return item;
}

function toRecentPapers(papers: PaperSearchPaper[]): RecentPaper[] {
  return papers.map((paper) => ({
    id: paper.paperId,
    title: paper.title,
    authors: paper.authors.join(", "),
    journal: "Journal information unavailable",
    year: paper.publicationYear,
    citations: paper.citedByCount,
    tags: paper.keywords.slice(0, 4),
  }));
}

function toDashboardBookmarks(bookmarks: UserBookmark[]): BookmarkedPaper[] {
  return bookmarks.map((bookmark) => ({
    id: bookmark.paperId,
    title: bookmark.paper?.title ?? "Paper information unavailable",
    journal: "Journal information unavailable",
    saved: formatBookmarkDate(bookmark.createdAt),
  }));
}

function formatBookmarkDate(value: string | undefined) {
  if (!value) return "recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toTopTopicItems(topics: AnalyticsKeyValue[]): TrendingTopic[] {
  return topics.slice(0, 10).map((topic, index) => ({
    name: topic.key,
    count: topic.value,
    color: topicColors[index % topicColors.length],
  }));
}

function toPublicationTrends(trends: AnalyticsSeries[]): {
  data: TrendPoint[];
  series: TrendSeries[];
} {
  const rows = new Map<string, TrendPoint & { sortKey: number }>();
  const series: TrendSeries[] = [];

  trends.forEach((trend, topicIndex) => {
    const key = `topic${topicIndex}`;

    series.push({
      key,
      name: trend.seriesName,
      color: topicColors[topicIndex % topicColors.length],
    });

    trend.dataPoints.forEach((point) => {
      const row = rows.get(point.key) ?? {
        year: point.key,
        sortKey: Number(point.key),
      };

      row[key] = point.value;
      rows.set(point.key, row);
    });
  });

  const data = Array.from(rows.values())
    .sort((first, second) => first.sortKey - second.sortKey)
    .map(toTrendPoint);

  return { data, series };
}

function toTrendPoint(row: TrendPoint & { sortKey: number }): TrendPoint {
  const trendPoint: TrendPoint = { year: row.year };

  Object.entries(row).forEach(([key, value]) => {
    if (key !== "year" && key !== "sortKey") {
      trendPoint[key] = value;
    }
  });

  return trendPoint;
}
