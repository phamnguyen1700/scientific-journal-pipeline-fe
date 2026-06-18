"use client";
import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { allComparisonTopics, comparisonMonths, comparisonTopics, type TopicMetricKey } from "@/features/researcher/components/researcherData";
import { chartTooltip, ResearcherPageShell } from "@/features/researcher/components/researcherShared";

export function TopicComparisonPage() {
  const [selected, setSelected] = useState(["Large Language Models", "Computer Vision", "Bioinformatics"]);
  const [adding, setAdding] = useState(false);

  const monthlyBarData = useMemo(
    () => comparisonMonths.map((month, index) => {
      const row: Record<string, string | number> = { month };
      selected.forEach((topic) => {
        row[topic] = comparisonTopics[topic].monthlyTrend[index];
      });
      return row;
    }),
    [selected]
  );

  const radarData = useMemo(
    () => [
      { key: "papers", label: "Publications" },
      { key: "growth", label: "Growth %" },
      { key: "citations", label: "Citations" },
      { key: "hIndex", label: "H-Index" },
      { key: "journals", label: "Journals" },
    ].map((metric) => {
      const row: Record<string, string | number> = { metric: metric.label };
      selected.forEach((topic) => {
        const maxValue = Math.max(...allComparisonTopics.map((item) => comparisonTopics[item][metric.key as TopicMetricKey]));
        row[topic] = Math.round((comparisonTopics[topic][metric.key as TopicMetricKey] / maxValue) * 100);
      });
      return row;
    }),
    [selected]
  );

  function addTopic(topic: string) {
    if (!selected.includes(topic) && selected.length < 5) setSelected((current) => [...current, topic]);
    setAdding(false);
  }

  function removeTopic(topic: string) {
    if (selected.length > 2) setSelected((current) => current.filter((item) => item !== topic));
  }

  return (
    <div className="space-y-6 p-6">
      <ResearcherPageShell title="Topic Comparison" description="Side-by-side analysis of up to five research topics" />
      <div className="flex flex-wrap items-center gap-2">
        {selected.map((topic) => (
          <div key={topic} className="flex items-center gap-2 rounded-full py-1.5 pl-3 pr-2 text-xs font-medium text-white" style={{ backgroundColor: comparisonTopics[topic].color }}>
            {topic}
            <button onClick={() => removeTopic(topic)} className="opacity-80 transition-opacity hover:opacity-100" aria-label={`Remove ${topic}`}>
              <X size={12} />
            </button>
          </div>
        ))}
        {selected.length < 5 && (
          <div className="relative">
            <button onClick={() => setAdding((current) => !current)} className="flex items-center gap-1.5 rounded-full border-2 border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary">
              <Plus size={12} /> Add topic
            </button>
            {adding && (
              <div className="absolute top-full z-10 mt-1 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                {allComparisonTopics.filter((topic) => !selected.includes(topic)).map((topic) => (
                  <button key={topic} onClick={() => addTopic(topic)} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs transition-colors hover:bg-muted">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: comparisonTopics[topic].color }} />
                    {topic}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="overflow-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Metric</th>
              {selected.map((topic) => (
                <th key={topic} className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: comparisonTopics[topic].color }} />
                    <span className="max-w-[120px] truncate text-xs font-semibold text-foreground">{topic}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[
              { label: "Publications", key: "papers" as TopicMetricKey, format: (value: number) => value.toLocaleString() },
              { label: "Growth Rate", key: "growth" as TopicMetricKey, format: (value: number) => `+${value}%` },
              { label: "Total Citations", key: "citations" as TopicMetricKey, format: (value: number) => value.toLocaleString() },
              { label: "H-Index", key: "hIndex" as TopicMetricKey, format: (value: number) => value.toString() },
              { label: "Active Journals", key: "journals" as TopicMetricKey, format: (value: number) => value.toString() },
            ].map((row) => (
              <tr key={row.key} className="transition-colors hover:bg-muted/30">
                <td className="px-5 py-3 text-xs font-medium text-muted-foreground">{row.label}</td>
                {selected.map((topic) => {
                  const value = comparisonTopics[topic][row.key];
                  const maxValue = Math.max(...selected.map((item) => comparisonTopics[item][row.key]));
                  return (
                    <td key={topic} className="px-5 py-3 text-right">
                      <span className={`text-sm font-semibold ${value === maxValue ? "text-primary" : "text-foreground"}`}>{row.format(value)}</span>
                      {value === maxValue && <span className="ml-1 text-[10px] text-primary">▲</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="mb-4 text-sm font-semibold text-foreground">Monthly Publications</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltip()} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              {selected.map((topic) => <Bar key={topic} dataKey={topic} fill={comparisonTopics[topic].color} radius={[3, 3, 0, 0]} />)}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="mb-4 text-sm font-semibold text-foreground">Relative Strength</p>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#F3F4F6" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "#6B7280" }} />
              <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
              {selected.map((topic) => <Radar key={topic} dataKey={topic} stroke={comparisonTopics[topic].color} fill={comparisonTopics[topic].color} fillOpacity={0.08} strokeWidth={2} />)}
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Tooltip contentStyle={chartTooltip()} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
