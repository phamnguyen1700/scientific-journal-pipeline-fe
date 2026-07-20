"use client";

import { Activity } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { topicPalette } from "@/features/researcher/components/researcherData";
import { chartTooltip, ResearcherLoadingState, ResearcherPageShell } from "@/features/researcher/components/researcherShared";
import {
  useCitationsByYear,
  useJournalOpenAccessRatio,
  usePapersByYear,
  useTopAuthorsByHIndex,
  useTopKeywordsByYear,
} from "@/hooks/analytics";
import type { AnalyticsKeyValue, AnalyticsSeries } from "@/types/analytics";

export function PublicationAnalyticsPage() {
  const papersQuery = usePapersByYear();
  const citationsQuery = useCitationsByYear();
  const keywordHistoryQuery = useTopKeywordsByYear(5);
  const openAccessQuery = useJournalOpenAccessRatio();
  const authorHIndexQuery = useTopAuthorsByHIndex(5);

  const queries = [papersQuery, citationsQuery, keywordHistoryQuery, openAccessQuery, authorHIndexQuery];
  if (queries.some((query) => query.isPending)) {
    return <div className="space-y-6 p-6"><ResearcherPageShell title="Publication Analytics" description="Research output, citation impact, authors, journals, and keyword metrics" icon={<Activity size={18} className="text-primary" />} /><ResearcherLoadingState label="Loading publication analytics" /></div>;
  }

  const liveYearlyData = mergeYearlyMetrics(papersQuery.data, citationsQuery.data);
  const yearlyData = liveYearlyData;
  const keywordHistory = mergeSeries(keywordHistoryQuery.data ?? []);
  const totalPapers = papersQuery.data?.reduce((sum, item) => sum + item.value, 0) ?? 0;
  const totalCitations = citationsQuery.data?.reduce((sum, item) => sum + item.value, 0) ?? 0;

  return (
    <div className="space-y-6 p-6">
      <ResearcherPageShell title="Publication Analytics" description="Research output, citation impact, authors, journals, and keyword metrics" icon={<Activity size={18} className="text-primary" />} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[
          { label: "Total Papers", value: totalPapers.toLocaleString(), sub: "Indexed publications" },
          { label: "Total Citations", value: totalCitations.toLocaleString(), sub: "Across all years" },
          { label: "Top Author H-Index", value: (authorHIndexQuery.data?.[0]?.value ?? 0).toLocaleString(), sub: authorHIndexQuery.data?.[0]?.key ?? "No author data" },
          { label: "Open Access", value: formatOpenAccessRatio(openAccessQuery.data), sub: "Journal availability" },
          { label: "Avg. Citations/Paper", value: totalPapers ? (totalCitations / totalPapers).toFixed(1) : "0", sub: "Dataset average" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{item.value}</p>
            <p className="mt-0.5 text-xs font-medium text-muted-foreground">{item.label}</p>
            <p className="mt-0.5 truncate text-[11px] text-emerald-600">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Annual Publication Output">
          <BarChart data={yearlyData}>
            <ChartAxes />
            <Bar dataKey="papers" name="Papers" fill={topicPalette.purple} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>
        <ChartCard title="Citation Growth">
          <LineChart data={yearlyData}>
            <ChartAxes />
            <Line type="monotone" dataKey="citations" name="Citations" stroke={topicPalette.emerald} strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ChartCard>
      </div>

      {keywordHistory.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="mb-4 text-sm font-semibold text-foreground">Top Keywords by Year</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={keywordHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltip()} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              {(keywordHistoryQuery.data ?? []).map((series, index) => (
                <Line key={series.seriesName} type="monotone" dataKey={series.seriesName} stroke={[topicPalette.purple, topicPalette.emerald, topicPalette.blue, topicPalette.amber, topicPalette.red][index % 5]} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return <div className="rounded-xl border border-border bg-card p-5"><p className="mb-4 text-sm font-semibold text-foreground">{title}</p><ResponsiveContainer width="100%" height={220}>{children}</ResponsiveContainer></div>;
}

function ChartAxes() {
  return <><CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" /><XAxis dataKey="year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} /><Tooltip contentStyle={chartTooltip()} /></>;
}

function mergeYearlyMetrics(papers?: AnalyticsKeyValue[], citations?: AnalyticsKeyValue[]) {
  if (!papers?.length && !citations?.length) return [];
  const years = new Set([...(papers ?? []).map((item) => item.key), ...(citations ?? []).map((item) => item.key)]);
  return Array.from(years).sort().map((year) => ({ year, papers: papers?.find((item) => item.key === year)?.value ?? 0, citations: citations?.find((item) => item.key === year)?.value ?? 0 }));
}

function mergeSeries(series: AnalyticsSeries[]) {
  const years = new Set(series.flatMap((item) => item.dataPoints.map((point) => point.key)));
  return Array.from(years).sort().map((year) => Object.fromEntries([["year", year], ...series.map((item) => [item.seriesName, item.dataPoints.find((point) => point.key === year)?.value ?? 0])])) as Array<Record<string, string | number>>;
}

function formatOpenAccessRatio(items?: AnalyticsKeyValue[]) {
  if (!items?.length) return "N/A";
  const ratio = items.find((item) => /ratio|open/i.test(item.key))?.value ?? items[0].value;
  return `${ratio <= 1 ? Math.round(ratio * 100) : Math.round(ratio)}%`;
}
