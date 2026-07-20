"use client";

import { useMemo } from "react";

import {
  TopicInsightChart,
  TopicInsightHeader,
  TopicInsightKpis,
  TopicInsightRanking,
} from "@/features/topicInsight/components";
import { TopicSearchPage } from "@/features/topicSearch";
import {
  getDashboardErrorMessage,
  useDashboardHotTopics,
} from "@/hooks/dashboard";
import type { DashboardHotTopic } from "@/types/dashboard";
import type {
  TrendingTimeRange,
  TrendingTopicChartPoint,
  TrendingTopicChartSeries,
  TrendingTopicMetric,
} from "@/types/topics";

const topicColors = ["#6C4CF1", "#10B981", "#F59E0B", "#EF4444", "#2563EB", "#06B6D4"];
const topicInsightEndYear = new Date().getFullYear();
const topicInsightStartYear = topicInsightEndYear - 20;

export function TopicInsightPage() {
  const range: TrendingTimeRange = "20-years";
  const hotTopicsQuery = useDashboardHotTopics({
    endYear: topicInsightEndYear,
    startYear: topicInsightStartYear,
  });
  const chart = useMemo(
    () => toTrendingTopicChart(hotTopicsQuery.data ?? []),
    [hotTopicsQuery.data],
  );
  const topics = useMemo(() => {
    return toHotTopicMetrics(hotTopicsQuery.data ?? []).sort(
      (first, second) => second.growth - first.growth,
    );
  }, [hotTopicsQuery.data]);
  const loading = hotTopicsQuery.isPending;
  const error = getDashboardErrorMessage(hotTopicsQuery.error);

  return (
    <div className="trending-topics-page">
      <TopicInsightHeader range={range} />
      <TopicInsightKpis topics={topics} />
      <div className="topic-insight-main-grid">
        <TopicInsightChart data={chart.data} series={chart.series} />
        {loading ? (
          <div className="paper-search-empty">Loading trending topics...</div>
        ) : error ? (
          <div className="paper-search-empty">{error}</div>
        ) : (
          <TopicInsightRanking topics={topics} />
        )}
      </div>
      <section className="topic-insight-search-section">
        <TopicSearchPage embedded />
      </section>
    </div>
  );
}

function toHotTopicMetrics(topics: DashboardHotTopic[]): TrendingTopicMetric[] {
  return topics.map((topic, index) => ({
    id: topic.topicName,
    name: topic.topicName,
    category: "Research topic",
    color: topicColors[index % topicColors.length],
    papers: topic.paperCount,
    currentYearPapers:
      topic.yearlyCounts?.find((point) => point.year === topicInsightEndYear)
        ?.count ?? 0,
    growth: topic.averageGrowthPercentage ?? topic.growthPercentage ?? 0,
    citations: 0,
    followers: 0,
    sparkline: topic.yearlyCounts?.map((point) => point.count) ?? buildSparkline(
      topic.averageGrowthPercentage ?? topic.growthPercentage ?? 0,
    ),
  }));
}

function toTrendingTopicChart(topics: DashboardHotTopic[]): {
  data: TrendingTopicChartPoint[];
  series: TrendingTopicChartSeries[];
} {
  const visibleTopics = topics.slice(0, 5);
  const yearSet = new Set<number>();

  for (const topic of visibleTopics) {
    for (const point of topic.yearlyCounts ?? []) {
      yearSet.add(point.year);
    }
  }

  const years = [...yearSet].sort((first, second) => first - second);
  const series = visibleTopics.map((topic, index) => ({
    color: topicColors[index % topicColors.length],
    key: toSeriesKey(topic.topicName, index),
    name: topic.topicName,
  }));
  const data = years.map((year) => {
    const row: TrendingTopicChartPoint = { label: String(year) };

    visibleTopics.forEach((topic, index) => {
      const key = series[index].key;
      const point = topic.yearlyCounts?.find((item) => item.year === year);
      row[key] = point?.count ?? 0;
    });

    return row;
  });

  return { data, series };
}

function buildSparkline(growth: number) {
  const base = Math.max(8, 48 - Math.round(growth));

  return Array.from({ length: 7 }, (_, index) => base + Math.round((growth / 6) * index));
}

function toSeriesKey(topicName: string, index: number) {
  return `topic_${index}_${topicName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")}`;
}
