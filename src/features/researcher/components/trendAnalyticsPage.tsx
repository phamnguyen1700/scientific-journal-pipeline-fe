"use client";

import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { growthTrendData, monthlyTrendData, topicPalette } from "@/features/researcher/components/researcherData";
import { chartTooltip, ResearcherPageShell } from "@/features/researcher/components/researcherShared";
import { useKeywordTrend, useKeywordsOverTime, useTopDomains, useTopicTrend } from "@/hooks/analytics";
import type { AnalyticsSeries, AnalyticsTrend } from "@/types/analytics";

export function TrendAnalyticsPage() {
  const [keywordInput, setKeywordInput] = useState("Computer science");
  const [topicInput, setTopicInput] = useState("Natural Language Processing Techniques");
  const [filters, setFilters] = useState({ keyword: keywordInput, topic: topicInput });
  const [years, setYears] = useState(5);
  const [chartMode, setChartMode] = useState<"absolute" | "growth">("absolute");
  const keywordQuery = useKeywordTrend(filters.keyword, years);
  const topicQuery = useTopicTrend(filters.topic, years);
  const combinedQuery = useKeywordsOverTime([filters.keyword, filters.topic]);
  const domainsQuery = useTopDomains(5);
  const liveData = mergeTrendSources(keywordQuery.data, topicQuery.data, combinedQuery.data, chartMode);
  const chartData = liveData.length ? liveData : chartMode === "absolute" ? monthlyTrendData : growthTrendData;
  const liveSeries = liveData.length
    ? combinedQuery.data?.length
      ? combinedQuery.data.map((series) => series.seriesName)
      : [keywordQuery.data?.keyword ?? filters.keyword, topicQuery.data?.topicName ?? filters.topic]
    : ["llm", "bio", "quantum"];

  function submit(event: FormEvent) {
    event.preventDefault();
    setFilters({ keyword: keywordInput.trim(), topic: topicInput.trim() });
  }

  return (
    <div className="space-y-6 p-6">
      <ResearcherPageShell title="Trend Analytics" description="Compare live keyword and topic publication growth" />

      <form onSubmit={submit} className="grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-[1fr_1fr_auto]">
        <label className="space-y-1"><span className="text-xs font-medium text-muted-foreground">Keyword</span><input value={keywordInput} onChange={(event) => setKeywordInput(event.target.value)} className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary" /></label>
        <label className="space-y-1"><span className="text-xs font-medium text-muted-foreground">Topic</span><input value={topicInput} onChange={(event) => setTopicInput(event.target.value)} className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary" /></label>
        <button type="submit" className="mt-auto flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"><Search size={14} /> Analyze</button>
      </form>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1 rounded-xl bg-muted p-1">
          {[1, 2, 5, 10].map((value) => <button key={value} onClick={() => setYears(value)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${years === value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>{value}Y</button>)}
        </div>
        <div className="ml-auto flex items-center gap-1 rounded-xl bg-muted p-1">
          {(["absolute", "growth"] as const).map((mode) => <button key={mode} onClick={() => setChartMode(mode)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${chartMode === mode ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>{mode === "absolute" ? "Publication Volume" : "Growth Rate (%)"}</button>)}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4"><p className="text-sm font-semibold text-foreground">Yearly Trend Comparison</p><p className="mt-0.5 text-xs text-muted-foreground">Results from keyword, topic, and multi-keyword analytics</p></div>
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey={liveData.length ? "year" : "month"} tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(value: number) => chartMode === "growth" ? `${value}%` : value.toLocaleString()} />
            <Tooltip contentStyle={chartTooltip()} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            {liveSeries.map((series, index) => <Line key={series} type="monotone" dataKey={series} name={series} stroke={[topicPalette.purple, topicPalette.emerald, topicPalette.blue][index]} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />)}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {(domainsQuery.data?.length ? domainsQuery.data : []).map((domain, index) => <div key={domain.key} className="rounded-xl border border-border bg-card p-4"><div className="mb-2 h-2 w-2 rounded-full" style={{ backgroundColor: [topicPalette.purple, topicPalette.emerald, topicPalette.blue, topicPalette.amber, topicPalette.red][index % 5] }} /><p className="line-clamp-2 text-xs font-medium text-foreground">{domain.key}</p><p className="mt-1 text-lg font-semibold text-foreground">{domain.value.toLocaleString()}</p><p className="text-[10px] text-muted-foreground">indexed papers</p></div>)}
      </div>
    </div>
  );
}

function mergeTrendSources(keyword: AnalyticsTrend | undefined, topic: AnalyticsTrend | undefined, combined: AnalyticsSeries[] | undefined, mode: "absolute" | "growth") {
  const series = combined?.length ? combined : [
    keyword && { seriesName: keyword.keyword ?? "Keyword", dataPoints: keyword.yearlyCounts.map((point) => ({ key: point.year.toString(), value: point.count })) },
    topic && { seriesName: topic.topicName ?? "Topic", dataPoints: topic.yearlyCounts.map((point) => ({ key: point.year.toString(), value: point.count })) },
  ].filter(Boolean) as AnalyticsSeries[];
  if (!series.length) return [];
  const years = new Set(series.flatMap((item) => item.dataPoints.map((point) => point.key)));
  return Array.from(years).sort().map((year) => Object.fromEntries([["year", year], ...series.map((item) => {
    const value = item.dataPoints.find((point) => point.key === year)?.value ?? 0;
    const first = item.dataPoints.find((point) => point.value > 0)?.value ?? 0;
    return [item.seriesName, mode === "growth" && first ? Number((((value - first) / first) * 100).toFixed(1)) : value];
  })])) as Array<Record<string, string | number>>;
}
