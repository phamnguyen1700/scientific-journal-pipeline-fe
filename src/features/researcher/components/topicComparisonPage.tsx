"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { topicPalette } from "@/features/researcher/components/researcherData";
import { chartTooltip, ResearcherEmptyState, ResearcherLoadingState, ResearcherPageShell } from "@/features/researcher/components/researcherShared";
import { useTopicComparison } from "@/hooks/analytics";
import { useTopics } from "@/hooks/topics";
import type { TopicComparison } from "@/types/analytics";

const colors = [topicPalette.purple, topicPalette.emerald, topicPalette.blue, topicPalette.amber, topicPalette.red];

export function TopicComparisonPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [years, setYears] = useState(5);
  const topicsQuery = useTopics();
  const topics = topicsQuery.topics.map((topic) => ({
    id: String(topic.apiId ?? topic.id),
    name: topic.name,
  }));
  const activeSelectedIds = selectedIds.length ? selectedIds : topics.slice(0, 2).map((topic) => topic.id);
  const comparisonQuery = useTopicComparison(activeSelectedIds, years);
  const comparison = useMemo(() => comparisonQuery.data ?? [], [comparisonQuery.data]);
  const chartData = useMemo(() => buildComparisonChart(comparison), [comparison]);

  function addTopic(topicId: string) {
    if (activeSelectedIds.includes(topicId) || activeSelectedIds.length >= 5) return;
    setSelectedIds([...activeSelectedIds, topicId]);
  }

  function removeTopic(topicId: string) {
    if (activeSelectedIds.length <= 2) return;
    setSelectedIds(activeSelectedIds.filter((id) => id !== topicId));
  }

  if (topicsQuery.loading) {
    return <div className="space-y-6 p-6"><ResearcherPageShell title="Topic Comparison" description="Side-by-side analysis of two to five research topics" /><ResearcherLoadingState label="Loading topics" /></div>;
  }

  return (
    <div className="space-y-6 p-6">
      <ResearcherPageShell title="Topic Comparison" description="Side-by-side analysis of two to five research topics" />

      <div className="flex flex-wrap items-center gap-2">
        {activeSelectedIds.map((topicId, index) => {
          const topic = topics.find((item) => item.id === topicId);
          return (
            <div key={topicId} className="flex items-center gap-2 rounded-full py-1.5 pl-3 pr-2 text-xs font-medium text-white" style={{ backgroundColor: colors[index % colors.length] }}>
              {topic?.name ?? topicId}
              <button onClick={() => removeTopic(topicId)} className="opacity-80 transition-opacity hover:opacity-100" aria-label={`Remove ${topic?.name ?? topicId}`}>
                <X size={12} />
              </button>
            </div>
          );
        })}
        {activeSelectedIds.length < 5 && (
          <select onChange={(event) => { addTopic(event.target.value); event.currentTarget.value = ""; }} defaultValue="" className="h-9 rounded-full border-2 border-dashed border-border bg-background px-3 text-xs text-muted-foreground outline-none focus:border-primary">
            <option value="" disabled>Add topic</option>
            {topics.filter((topic) => !activeSelectedIds.includes(topic.id)).map((topic) => (
              <option key={topic.id} value={topic.id}>{topic.name}</option>
            ))}
          </select>
        )}
        <div className="ml-auto flex items-center gap-1 rounded-xl bg-muted p-1">
          {[1, 5, 10, 20].map((value) => <button key={value} onClick={() => setYears(value)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${years === value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>{value}Y</button>)}
        </div>
      </div>

      {activeSelectedIds.length < 2 ? (
        <ResearcherEmptyState title="Select at least two topics" description="The comparison endpoint requires two to five selected topics." />
      ) : comparisonQuery.isPending ? (
        <ResearcherLoadingState label="Loading topic comparison" />
      ) : !comparison.length ? (
        <ResearcherEmptyState title="No comparison data" description="The analytics service returned no comparison data for the selected topics." />
      ) : (
        <>
          <div className="overflow-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Metric</th>
                  {comparison.map((topic, index) => (
                    <th key={topic.topicId} className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                        <span className="max-w-[160px] truncate text-xs font-semibold text-foreground">{topic.topicName}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { label: "Publications", key: "paperCount" as const, format: formatNumber },
                  { label: "Growth Rate", key: "growthPercentage" as const, format: formatPercent },
                  { label: "Total Citations", key: "citationCount" as const, format: formatNumber },
                  { label: "Topic H-Index", key: "topicHIndex" as const, format: formatNumber },
                  { label: "Journals", key: "journalCount" as const, format: formatNumber },
                ].map((row) => (
                  <tr key={row.key} className="transition-colors hover:bg-muted/30">
                    <td className="px-5 py-3 text-xs font-medium text-muted-foreground">{row.label}</td>
                    {comparison.map((topic) => (
                      <td key={topic.topicId} className="px-5 py-3 text-right text-sm font-semibold text-foreground">
                        {row.format(topic[row.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <p className="mb-4 text-sm font-semibold text-foreground">Yearly Publications</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltip()} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                {comparison.map((topic, index) => <Line key={topic.topicId} type="monotone" dataKey={topic.topicName} stroke={colors[index % colors.length]} strokeWidth={2.5} dot={false} />)}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

function buildComparisonChart(comparison: TopicComparison[]) {
  const years = new Set(comparison.flatMap((topic) => topic.yearlyCounts.map((point) => point.year)));
  return Array.from(years).sort((a, b) => a - b).map((year) => {
    const row: Record<string, string | number> = { year };
    comparison.forEach((topic) => {
      row[topic.topicName] = topic.yearlyCounts.find((point) => point.year === year)?.count ?? 0;
    });
    return row;
  });
}

function formatNumber(value: number) {
  return value.toLocaleString();
}

function formatPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}
