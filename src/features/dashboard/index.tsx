"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Bell,
  Bookmark,
  BookMarked,
  FileText,
  Newspaper,
  Search,
  Tags,
  UserRound,
  X,
} from "lucide-react";

import {
  BookmarksCard,
  CitationRankingChart,
  DashboardKpiGrid,
  HotTopicsCard,
  HomeMetricCarousel,
  HomeRightRailCarousel,
  PublicationTrendsCard,
  RecentPapersCard,
} from "@/features/dashboard/components";
import { useAuthors } from "@/hooks/authors";
import {
  useAnalyticsDashboard,
  useKeywordsOverTime,
  useTopAuthorsByCitations,
  useTopJournalsByCitations,
  useTopTopics,
} from "@/hooks/analytics";
import {
  getDashboardErrorMessage,
  useDashboardSummary,
} from "@/hooks/dashboard";
import { useJournals } from "@/hooks/journals";
import { usePaperSearch } from "@/hooks/search";
import { useTopics } from "@/hooks/topics";
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
    label: "Saved",
    value: "0",
    sub: "Library",
  },
  {
    icon: BookMarked,
    iconColor: "bg-blue-100",
    iconTextColor: "text-blue-600",
    label: "Following",
    value: "0",
    sub: "Topics",
  },
  {
    icon: Bell,
    iconColor: "bg-amber-100",
    iconTextColor: "text-amber-600",
    label: "Alerts",
    value: "0",
    sub: "Analytics",
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

const softSpring = { type: "spring" as const, stiffness: 240, damping: 30 };
const exitSpring = { type: "spring" as const, stiffness: 260, damping: 32 };

type HomeExitTarget = {
  filter?: string;
  opacity: number;
  scale: number;
  x?: number;
  y?: number;
};

function homeExitMotion(
  active: boolean,
  target: HomeExitTarget,
  delay = 0,
) {
  const origin = {
    filter: "blur(0px)",
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
  };

  return {
    animate: active ? { ...origin, ...target } : origin,
    transition: { ...exitSpring, delay: active ? delay : 0 },
  };
}

export function StudentDashboardPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isLeaving, setIsLeaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const papersQuery = usePaperSearch({ page: 1, size: 4 });
  const authorsQuery = useAuthors(1, 10);
  const journalsQuery = useJournals();
  const topicsQuery = useTopics();
  const profileQuery = useUserProfile();
  const bookmarksQuery = useUserBookmarks();
  const followingTopicsQuery = useUserFollowingTopics();
  const summaryQuery = useDashboardSummary();
  const analyticsQuery = useAnalyticsDashboard();
  const topTopicsQuery = useTopTopics(10);
  const topAuthorsQuery = useTopAuthorsByCitations(10);
  const topJournalsQuery = useTopJournalsByCitations(10);
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
  const overviewItems = [
    {
      icon: UserRound,
      label: "Authors",
      value: authorsQuery.authorList.total,
    },
    {
      icon: Newspaper,
      label: "Papers",
      value: papersQuery.total,
    },
    {
      icon: BookMarked,
      label: "Journals",
      value: journalsQuery.journalList.total,
    },
    {
      icon: Tags,
      label: "Topics",
      value: topicsQuery.topicList?.total ?? topicsQuery.topics.length,
    },
  ];

  function submitSearch() {
    const nextQuery = query.trim();
    if (!nextQuery) {
      inputRef.current?.focus();
      return;
    }

    setIsLeaving(true);
    window.setTimeout(() => {
      router.push(`/dashboard/papers?q=${encodeURIComponent(nextQuery)}&fromHome=1`);
    }, 620);
  }

  return (
    <motion.div
      animate={{
        opacity: isLeaving ? 0.96 : 1,
        scale: isLeaving ? 0.995 : 1,
      }}
      transition={softSpring}
      className="home-page"
    >
      <div className="home-analytics">
        <div className="home-layout-grid">
          <main className="home-search-column">
            <section className="home-top-row">
              <motion.div
                {...homeExitMotion(
                  isLeaving,
                  {
                    filter: "blur(2px)",
                    opacity: 0.08,
                    scale: 0.91,
                    x: -240,
                  },
                  0.04,
                )}
                className="min-h-0 min-w-0"
              >
                <HomeMetricCarousel items={overviewItems} />
              </motion.div>

              <div className="home-top-stack">
                <motion.div
                  {...homeExitMotion(
                    isLeaving,
                    {
                      filter: "blur(2px)",
                      opacity: 0.08,
                      scale: 0.91,
                      x: -180,
                      y: -24,
                    },
                    0.02,
                  )}
                  className="min-w-0"
                >
                  <RecentPapersCard
                    error={papersQuery.error}
                    loading={papersQuery.loading}
                    papers={recentPapers}
                  />
                </motion.div>
                <motion.section
                  {...homeExitMotion(
                    isLeaving,
                    {
                      filter: "blur(3px)",
                      opacity: 0,
                      scale: 0.96,
                      y: -28,
                    },
                    0,
                  )}
                  className="home-hero"
                >
                  <div className="home-hero-copy">
                    <span>Welcome back, {displayName}</span>
                    <h1>
                      Explore research trends, papers, and topics in one place.
                    </h1>
                    <p>
                      Search across papers, authors, journals, and emerging
                      topics from your research workspace.
                    </p>
                  </div>
                  <div className="home-search-box">
                    <Search className="size-4 text-muted-foreground" />
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") submitSearch();
                        if (event.key === "Escape") setQuery("");
                      }}
                      placeholder="Search papers, topics, authors, journals..."
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        aria-label="Clear search"
                      >
                        <X className="size-3.5" />
                      </button>
                    )}
                    <button type="button" onClick={submitSearch}>
                      <Search className="size-3.5" />
                      Search
                    </button>
                  </div>
                </motion.section>
              </div>
            </section>

            <motion.section
              {...homeExitMotion(
                isLeaving,
                {
                  filter: "blur(2px)",
                  opacity: 0.08,
                  scale: 0.91,
                  y: 100,
                },
                0.07,
              )}
              className="home-trends-row"
            >
              <DashboardKpiGrid items={kpiItems} />
              <div className="home-trends">
                <PublicationTrendsCard
                  data={publicationTrends.data}
                  series={publicationTrends.series}
                />
              </div>
            </motion.section>
          </main>

          <motion.aside
            {...homeExitMotion(
              isLeaving,
              {
                filter: "blur(2px)",
                opacity: 0.08,
                scale: 0.91,
                x: 240,
              },
              0.06,
            )}
            className="home-right-rail"
          >
            <HomeRightRailCarousel>
              <BookmarksCard
                error={
                  bookmarksQuery.error ??
                  getDashboardErrorMessage(summaryQuery.error)
                }
                loading={bookmarksQuery.loading || summaryQuery.isPending}
                papers={bookmarks}
                total={bookmarkTotal}
              />
              <HotTopicsCard topics={trendingTopics.slice(0, 5)} />
              <CitationRankingChart
                color="#2563EB"
                items={topAuthorsQuery.data ?? []}
                title="Top Authors by Citations"
              />
              <CitationRankingChart
                color="#10B981"
                items={topJournalsQuery.data ?? []}
                title="Top Journals by Citations"
              />
            </HomeRightRailCarousel>
          </motion.aside>
        </div>
      </div>
    </motion.div>
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
    item.label === "Saved" &&
    stats.bookmarkedPapers !== undefined
  ) {
    return {
      ...item,
      value: String(stats.bookmarkedPapers),
      sub: "Library",
    };
  }

  if (item.label === "Following" && stats.followedTopics !== undefined) {
    return {
      ...item,
      value: String(stats.followedTopics),
      sub: "Topics",
    };
  }

  if (item.label === "Alerts" && stats.journalAlerts !== undefined) {
    return {
      ...item,
      value: String(stats.journalAlerts),
      sub: "Analytics",
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
