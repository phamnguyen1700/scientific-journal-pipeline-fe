"use client";

import { Activity } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { topicPalette } from "@/features/researcher/components/researcherData";
import { chartTooltip, ResearcherLoadingState, ResearcherPageShell } from "@/features/researcher/components/researcherShared";
import {
  useCitationsByYear,
  useJournalOpenAccessRatio,
  useKeywordWordCloud,
  usePapersByYear,
  useTopAuthorsByCitations,
  useTopAuthorsByHIndex,
  useTopJournalsByCitations,
  useTopJournalsByPaperCount,
  useTopKeywordsByYear,
} from "@/hooks/analytics";
import type { AnalyticsKeyValue, AnalyticsSeries } from "@/types/analytics";

export function PublicationAnalyticsPage() {
  const papersQuery = usePapersByYear();
  const citationsQuery = useCitationsByYear();
  const keywordsQuery = useKeywordWordCloud(10);
  const keywordHistoryQuery = useTopKeywordsByYear(5);
  const journalPapersQuery = useTopJournalsByPaperCount(10);
  const journalCitationsQuery = useTopJournalsByCitations(10);
  const openAccessQuery = useJournalOpenAccessRatio();
  const authorCitationsQuery = useTopAuthorsByCitations(5);
  const authorHIndexQuery = useTopAuthorsByHIndex(5);

  const queries = [papersQuery, citationsQuery, keywordsQuery, keywordHistoryQuery, journalPapersQuery, journalCitationsQuery, openAccessQuery, authorCitationsQuery, authorHIndexQuery];
  if (queries.some((query) => query.isPending)) {
    return <div className="space-y-6 p-6"><ResearcherPageShell title="Publication Analytics" description="Research output, citation impact, authors, journals, and keyword metrics" icon={<Activity size={18} className="text-primary" />} /><ResearcherLoadingState label="Loading publication analytics" /></div>;
  }

  const liveYearlyData = mergeYearlyMetrics(papersQuery.data, citationsQuery.data);
  const yearlyData = liveYearlyData;
  const keywordData = keywordsQuery.data?.map((item) => ({ keyword: item.key, count: item.value })) ?? [];
  const journalData = journalPapersQuery.data?.map((item) => ({
        name: item.key,
        papers: item.value,
        avgCitations: journalCitationsQuery.data?.find((citation) => citation.key === item.key)?.value ?? 0,
      })) ?? [];
  const keywordHistory = mergeSeries(keywordHistoryQuery.data ?? []);
  const totalPapers = papersQuery.data?.reduce((sum, item) => sum + item.value, 0) ?? 0;
  const totalCitations = citationsQuery.data?.reduce((sum, item) => sum + item.value, 0) ?? 0;
  const keywordMax = Math.max(...keywordData.map((item) => item.count), 1);

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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="mb-4 text-sm font-semibold text-foreground">Top Keywords</p>
          <div className="space-y-3">
            {keywordData.slice(0, 10).map((keyword) => (
              <div key={keyword.keyword} className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">{keyword.keyword}</p>
                  <div className="mt-1 rounded-full bg-muted"><div className="h-1.5 rounded-full bg-primary" style={{ width: `${(keyword.count / keywordMax) * 100}%` }} /></div>
                </div>
                <span className="shrink-0 text-xs font-semibold text-muted-foreground">{keyword.count}</span>
              </div>
            ))}
          </div>
        </div>
        <RankingList title="Top Authors by Citations" items={authorCitationsQuery.data ?? []} />
        <RankingList title="Top Authors by H-Index" items={authorHIndexQuery.data ?? []} />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4"><p className="text-sm font-semibold text-foreground">Top Publishing Venues</p></div>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/40"><th className="px-5 py-2.5 text-left text-xs font-semibold uppercase text-muted-foreground">Journal</th><th className="px-5 py-2.5 text-right text-xs font-semibold uppercase text-muted-foreground">Papers</th><th className="px-5 py-2.5 text-right text-xs font-semibold uppercase text-muted-foreground">Citations</th></tr></thead>
          <tbody className="divide-y divide-border">
            {journalData.map((journal) => <tr key={journal.name} className="hover:bg-muted/30"><td className="px-5 py-3 font-medium text-foreground">{journal.name}</td><td className="px-5 py-3 text-right text-muted-foreground">{journal.papers}</td><td className="px-5 py-3 text-right font-semibold text-primary">{journal.avgCitations.toLocaleString()}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return <div className="rounded-xl border border-border bg-card p-5"><p className="mb-4 text-sm font-semibold text-foreground">{title}</p><ResponsiveContainer width="100%" height={220}>{children}</ResponsiveContainer></div>;
}

function ChartAxes() {
  return <><CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" /><XAxis dataKey="year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} /><Tooltip contentStyle={chartTooltip()} /></>;
}

function RankingList({ title, items }: { title: string; items: AnalyticsKeyValue[] }) {
  return <div className="rounded-xl border border-border bg-card p-5"><p className="mb-4 text-sm font-semibold text-foreground">{title}</p><div className="space-y-3">{items.map((item, index) => <div key={item.key} className="flex items-center gap-3"><span className="w-5 text-xs text-muted-foreground">{index + 1}</span><span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">{item.key}</span><span className="text-xs font-semibold text-primary">{item.value.toLocaleString()}</span></div>)}</div></div>;
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
