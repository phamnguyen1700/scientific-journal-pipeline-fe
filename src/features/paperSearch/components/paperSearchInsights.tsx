"use client";

import type { ReactNode } from "react";
import {
  BookOpen,
  CalendarDays,
  Globe2,
  Tags,
  UserRound,
} from "lucide-react";

import type {
  AnalyticsKeyValue,
  AnalyticsOpenAccessStat,
  AnalyticsTrendingTopic,
} from "@/types/analytics";
import type { PaperSearchFacets } from "@/types/search";
import { OpenAccessPieChart } from "./openAccessPieChart";
export function PaperSearchInsights({
  facets,
  openAccessStats,
  papersByYear,
  topAuthors,
  topJournals,
  onSelectAuthor,
  onSelectJournal,
  onSelectTopic,
  onSelectYear,
  trendingTopics,
}: {
  facets: PaperSearchFacets;
  openAccessStats: AnalyticsOpenAccessStat[];
  papersByYear: AnalyticsKeyValue[];
  topAuthors: AnalyticsKeyValue[];
  topJournals: AnalyticsKeyValue[];
  onSelectAuthor: (author: string) => void;
  onSelectJournal: (journal: string) => void;
  onSelectTopic: (topic: string) => void;
  onSelectYear: (year: number) => void;
  trendingTopics: AnalyticsTrendingTopic[];
}) {
  return (
    <aside
      className="paper-search-insights"
      aria-label="Related search information"
    >
      <InsightPanel title="Year" icon={<CalendarDays />}>
        {papersByYear.length ? (
          <YearBars items={papersByYear} onSelectYear={onSelectYear} />
        ) : (
          <InsightEmpty />
        )}
      </InsightPanel>

      <InsightPanel title="Open Access" icon={<Globe2 />}>
        <OpenAccessPieChart items={openAccessStats} />
      </InsightPanel>

      <TrendingTopicPanel
        facets={facets.topics}
        items={trendingTopics}
        onSelect={onSelectTopic}
      />
      <AnalyticsFacetPanel
        title="Journal"
        icon={<BookOpen />}
        items={topJournals}
        onSelect={onSelectJournal}
      />
      <AnalyticsFacetPanel
        title="Author"
        icon={<UserRound />}
        items={topAuthors}
        onSelect={onSelectAuthor}
      />
    </aside>
  );
}
function InsightPanel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="paper-search-insight-panel w-full overflow-hidden rounded-xl border border-border bg-card p-4">
      <div className="paper-search-insight-heading mb-3 flex items-center gap-2 text-foreground">
        <span className="flex size-6 items-center justify-center rounded-md bg-muted text-muted-foreground">
          {icon}
        </span>
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function TrendingTopicPanel({
  facets,
  items,
  onSelect,
}: {
  facets: PaperSearchFacets["topics"];
  items: AnalyticsTrendingTopic[];
  onSelect: (topic: string) => void;
}) {
  const topicItems = items.length
    ? items.map((topic) => ({
        count: topic.paperCount,
        label: topic.topicName,
      }))
    : facets.map((topic) => ({
        count: topic.count,
        label: topic.label,
      }));

  return (
    <InsightPanel title="Topic" icon={<Tags />}>
      {topicItems.length ? (
        <div className="paper-search-facet-list">
          {topicItems.slice(0, 5).map((topic) => (
            <button
              key={topic.label}
              type="button"
              className="flex w-full items-center justify-between gap-3 py-2 text-left text-xs"
              onClick={() => onSelect(topic.label)}
            >
              <span className="min-w-0 flex-1 truncate">{topic.label}</span>
              <strong className="shrink-0 font-medium text-muted-foreground">
                {topic.count.toLocaleString()}
              </strong>
            </button>
          ))}
        </div>
      ) : (
        <InsightEmpty />
      )}
    </InsightPanel>
  );
}

function AnalyticsFacetPanel({
  title,
  icon,
  items,
  onSelect,
}: {
  title: string;
  icon: ReactNode;
  items: AnalyticsKeyValue[];
  onSelect: (keyword: string) => void;
}) {
  return (
    <InsightPanel title={title} icon={icon}>
      {items.length ? (
        <div className="paper-search-facet-list">
          {items.slice(0, 5).map((item) => (
            <button
              key={item.key}
              type="button"
              className="flex w-full items-center justify-between gap-3 py-2 text-left text-xs"
              onClick={() => onSelect(item.key)}
            >
              <span className="min-w-0 flex-1 truncate">{item.key}</span>
              <strong className="shrink-0 font-medium text-muted-foreground">
                {item.value.toLocaleString()}
              </strong>
            </button>
          ))}
        </div>
      ) : (
        <InsightEmpty />
      )}
    </InsightPanel>
  );
}
function YearBars({
  items,
  onSelectYear,
}: {
  items: AnalyticsKeyValue[];
  onSelectYear: (year: number) => void;
}) {
  const visibleItems = [...items]
    .filter(
      (item) =>
        Number.isFinite(Number(item.key)) && Number.isFinite(item.value),
    )
    .sort((first, second) => Number(first.key) - Number(second.key))
    .slice(-10);
  const max = Math.max(...visibleItems.map((item) => item.value), 1);

  if (!visibleItems.length) {
    return <InsightEmpty />;
  }

  return (
    <div className="paper-search-year-chart">
      {visibleItems.map((item) => {
        const year = Number(item.key);
        const height = Math.max((item.value / max) * 100, 8);

        return (
          <button
            key={item.key}
            type="button"
            className="paper-search-year-chart-item"
            title={`${item.key}: ${item.value.toLocaleString()} papers`}
            onClick={() => onSelectYear(year)}
            aria-label={`Filter papers from ${item.key}`}
          >
            <span>{item.value.toLocaleString()}</span>
            <i>
              <b style={{ height: `${height}%` }} />
            </i>
            <em>{item.key}</em>
          </button>
        );
      })}
    </div>
  );
}
function InsightEmpty() {
  return <p className="paper-search-insight-empty">No data yet</p>;
}
