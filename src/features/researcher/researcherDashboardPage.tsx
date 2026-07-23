"use client";
import Link from "next/link";
import { ArrowUpRight, Clock, FileText, TrendingUp } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuthStore } from "@/store/auth";
import { useCitationsByYear, usePapersByYear, useTopTopics } from "@/hooks/analytics";
import { topicPalette } from "@/features/researcher/components/researcherData";
import { chartTooltip, ResearcherKpiCard, ResearcherLoadingState } from "@/features/researcher/components/researcherShared";

export function ResearcherDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const displayName = user?.username ?? "Researcher";
  const papersQuery = usePapersByYear();
  const citationsQuery = useCitationsByYear();
  const topicsQuery = useTopTopics(5);
  const liveTrendData = mergeYearlyMetrics(papersQuery.data, citationsQuery.data);
  const publicationData: Array<Record<string, string | number>> = liveTrendData;
  const citationData: Array<Record<string, string | number>> = liveTrendData;
  const topicData = topicsQuery.data?.map((topic) => ({ name: topic.key, papers: topic.value })) ?? [];
  const totalPapers = papersQuery.data?.reduce((total, item) => total + item.value, 0) ?? 0;

  if ([papersQuery, citationsQuery, topicsQuery].some((query) => query.isPending)) {
    return <div className="space-y-6 p-6"><h1 className="text-xl font-semibold text-foreground">Research Intelligence Dashboard</h1><ResearcherLoadingState label="Loading research dashboard" /></div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Research Intelligence Dashboard</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Welcome back, {displayName}. Here is your research overview.</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock size={12} /> Updated just now
        </div>
      </div>

      <div className="grid max-w-sm grid-cols-1 gap-4">
        <ResearcherKpiCard icon={<FileText size={17} className="text-purple-600" />} label="Papers Indexed" value={totalPapers.toLocaleString()} delta="All years" color="bg-purple-100" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Multi-Topic Publication Trends</p>
              <p className="text-xs text-muted-foreground">Monthly paper counts across top research domains</p>
            </div>
            <Link href="/researcher/trends" className="flex items-center gap-1 text-xs text-primary hover:underline">
              Full analysis <ArrowUpRight size={11} />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={publicationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltip()} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="papers" name="Papers" stroke={topicPalette.purple} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Citation Velocity</p>
            <TrendingUp size={14} className="text-emerald-500" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={citationData}>
              <defs>
                <linearGradient id="researcherCitationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={topicPalette.purple} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={topicPalette.purple} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltip()} />
              <Area type="monotone" dataKey="citations" name="Citations" stroke={topicPalette.purple} strokeWidth={2} fill="url(#researcherCitationGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <p className="text-sm font-semibold text-foreground">Top Topics by Volume</p>
            <Link href="/researcher/compare" className="flex items-center gap-1 text-xs text-primary hover:underline">
              Compare <ArrowUpRight size={11} />
            </Link>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topicData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} width={160} />
                <Tooltip contentStyle={chartTooltip()} />
                <Bar dataKey="papers" name="Papers" fill={topicPalette.purple} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-border bg-card p-5">
          <p className="text-sm font-semibold text-foreground">Quick Analysis Tools</p>
          {[
            { label: "Trend Research", desc: "Multi-line publication trend analysis", path: "/researcher/trends", color: "bg-purple-100 text-purple-700" },
            { label: "Topic Comparison", desc: "Side-by-side topic analytics", path: "/researcher/compare", color: "bg-blue-100 text-blue-700" },
            { label: "Topic Cluster Map", desc: "Interactive network visualization", path: "/researcher/cluster", color: "bg-emerald-100 text-emerald-700" },
            { label: "Emerging Topics", desc: "AI-detected growth signals", path: "/researcher/emerging", color: "bg-amber-100 text-amber-700" },
            { label: "Publication Analytics", desc: "H-index and citation metrics", path: "/researcher/analytics", color: "bg-red-100 text-red-700" },
          ].map((item) => (
            <Link key={item.path} href={item.path} className="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted">
              <div className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${item.color}`}>{item.label.split(" ")[0]}</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ArrowUpRight size={13} className="shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function mergeYearlyMetrics(
  papers: Array<{ key: string; value: number }> | undefined,
  citations: Array<{ key: string; value: number }> | undefined
) {
  if (!papers?.length && !citations?.length) return [];

  const years = new Set([...(papers ?? []).map((item) => item.key), ...(citations ?? []).map((item) => item.key)]);
  return Array.from(years).sort().map((year) => ({
    year,
    papers: papers?.find((item) => item.key === year)?.value ?? 0,
    citations: citations?.find((item) => item.key === year)?.value ?? 0,
  }));
}
