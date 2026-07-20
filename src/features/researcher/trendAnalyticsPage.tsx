"use client";

import { FormEvent, useEffect, useState } from "react";
import { Search, TrendingDown, TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { topicPalette } from "@/features/researcher/components/researcherData";
import { chartTooltip, ResearcherEmptyState, ResearcherLoadingState, ResearcherPageShell } from "@/features/researcher/components/researcherShared";
import { useKeywordSuggestions, useKeywordTrend, useTopDomains, useTrendingTopics } from "@/hooks/analytics";
import type { AnalyticsTrend } from "@/types/analytics";

export function TrendAnalyticsPage() {
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [years, setYears] = useState<1 | 5 | 10>(5);
  const keywordQuery = useKeywordTrend(keyword, years);
  const suggestionsQuery = useKeywordSuggestions(debouncedKeyword, 10);
  const trendingQuery = useTrendingTopics(years, 10);
  const domainsQuery = useTopDomains(5);
  const trendData = mapKeywordTrend(keywordQuery.data);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedKeyword(keywordInput), 300);
    return () => window.clearTimeout(timer);
  }, [keywordInput]);

  function submit(event: FormEvent) {
    event.preventDefault();
    setKeyword(keywordInput.trim());
  }

  const loadingInitial = trendingQuery.isPending || domainsQuery.isPending;

  if (loadingInitial) {
    return <div className="space-y-6 p-6"><ResearcherPageShell title="Trend Research" description="Explore keyword trends and trending topics" /><ResearcherLoadingState label="Loading trend research" /></div>;
  }

  return (
    <div className="space-y-6 p-6">
      <ResearcherPageShell title="Trend Research" description="Explore keyword trends and trending topics" />

      <form onSubmit={submit} className="grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-[1fr_auto]">
        <label className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Keyword</span>
          <input
            value={keywordInput}
            onChange={(event) => setKeywordInput(event.target.value)}
            list="keyword-suggestions"
            placeholder="Search a keyword, e.g. machine learning"
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
          />
          <datalist id="keyword-suggestions">
            {(suggestionsQuery.data ?? []).map((suggestion) => <option key={suggestion} value={suggestion} />)}
          </datalist>
        </label>
        <button type="submit" className="mt-auto flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
          <Search size={14} /> Analyze
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1 rounded-xl bg-muted p-1">
          {([1, 5, 10] as const).map((value) => <button key={value} onClick={() => setYears(value)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${years === value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>{value} year{value > 1 ? "s" : ""}</button>)}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4"><p className="text-sm font-semibold text-foreground">Keyword Trend</p><p className="mt-0.5 text-xs text-muted-foreground">Search a keyword to load yearly publication counts from the backend.</p></div>
        {!keyword ? (
          <ResearcherEmptyState title="Search a keyword" description="Keyword trend data loads after you choose or type a keyword." />
        ) : keywordQuery.isPending ? (
          <ResearcherLoadingState label="Loading keyword trend" />
        ) : trendData.length ? (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltip()} />
              <Line type="monotone" dataKey="count" name={keyword} stroke={topicPalette.purple} strokeWidth={2.5} dot activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResearcherEmptyState title="No keyword trend data" description="The analytics service returned no yearly results for this keyword." />
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="mb-4 text-sm font-semibold text-foreground">Trending Topics</p>
          <div className="space-y-3">
            {(trendingQuery.data ?? []).map((topic) => (
              <div key={topic.topicName} className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{topic.topicName}</p>
                  <p className="text-xs text-muted-foreground">{topic.currentYear && topic.previousYear ? `${topic.previousYear} to ${topic.currentYear}` : `${years} year period`}</p>
                </div>
                <div className={`flex shrink-0 items-center gap-1 text-xs font-semibold ${topic.trend === "down" ? "text-red-500" : "text-emerald-600"}`}>
                  {topic.trend === "down" ? <TrendingDown size={13} /> : <TrendingUp size={13} />}
                  {topic.growthPercentage >= 0 ? "+" : ""}{topic.growthPercentage.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(domainsQuery.data ?? []).map((domain, index) => <div key={domain.key} className="rounded-xl border border-border bg-card p-4"><div className="mb-2 h-2 w-2 rounded-full" style={{ backgroundColor: [topicPalette.purple, topicPalette.emerald, topicPalette.blue, topicPalette.amber, topicPalette.red][index % 5] }} /><p className="line-clamp-2 text-xs font-medium text-foreground">{domain.key}</p><p className="mt-1 text-lg font-semibold text-foreground">{domain.value.toLocaleString()}</p><p className="text-[10px] text-muted-foreground">indexed papers</p></div>)}
        </div>
      </div>
    </div>
  );
}

function mapKeywordTrend(trend: AnalyticsTrend | undefined) {
  return trend?.yearlyCounts.map((point) => ({ year: point.year.toString(), count: point.count })) ?? [];
}
