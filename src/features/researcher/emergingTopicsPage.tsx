"use client";

import { useState } from "react";
import { Flame, Star, TrendingDown, TrendingUp, Zap } from "lucide-react";

import { topicPalette } from "@/features/researcher/components/researcherData";
import { MiniSparkline, ResearcherEmptyState, ResearcherLoadingState, ResearcherPageShell } from "@/features/researcher/components/researcherShared";
import { useTrendingTopics } from "@/hooks/analytics";

export function EmergingTopicsPage() {
  const [years, setYears] = useState<1 | 5 | 10>(1);
  const trendingQuery = useTrendingTopics(years, 10);

  if (trendingQuery.isPending) {
    return <div className="space-y-6 p-6"><ResearcherPageShell title="Emerging Topics" description="Research topics with accelerating publication growth" icon={<Zap size={18} className="text-amber-500" />} /><ResearcherLoadingState label="Loading emerging topics" /></div>;
  }

  if (!trendingQuery.data?.length) {
    return <div className="space-y-6 p-6"><ResearcherPageShell title="Emerging Topics" description="Research topics with accelerating publication growth" icon={<Zap size={18} className="text-amber-500" />} /><ResearcherEmptyState title="No emerging topics" description="The analytics service has not returned any trending topic signals." /></div>;
  }

  const topicData = trendingQuery.data.map((topic, index) => ({
    name: topic.topicName,
    field: "Trending research topic",
    growth: topic.growthPercentage,
    papers: topic.paperCount,
    previousPapers: topic.previousPaperCount,
    currentYear: topic.currentYear,
    previousYear: topic.previousYear,
    stage: topic.growthPercentage >= 100 ? "Explosive" : topic.growthPercentage >= 50 ? "Rapid" : topic.growthPercentage > 0 ? "Growing" : "Stable",
    color: [topicPalette.purple, topicPalette.blue, topicPalette.emerald, topicPalette.amber, topicPalette.red, topicPalette.violet][index % 6],
    opportunity: topic.growthPercentage >= 100 ? "Very High" : topic.growthPercentage >= 25 ? "High" : "Medium",
    trend: buildTrend(topic.previousPaperCount ?? 0, topic.paperCount),
    direction: topic.trend,
  }));

  const stageColors: Record<string, string> = {
    Explosive: "bg-red-100 text-red-700",
    Rapid: "bg-orange-100 text-orange-700",
    Growing: "bg-yellow-100 text-yellow-700",
    Stable: "bg-blue-100 text-blue-700",
  };
  const opportunityColors: Record<string, string> = {
    "Very High": "bg-purple-100 text-purple-700",
    High: "bg-emerald-100 text-emerald-700",
    Medium: "bg-sky-100 text-sky-700",
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ResearcherPageShell title="Emerging Topics" description="Research topics with accelerating publication growth" icon={<Zap size={18} className="text-amber-500" />} />
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl bg-muted p-1">
            {([1, 5, 10] as const).map((value) => (
              <button key={value} onClick={() => setYears(value)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${years === value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
                {value} year{value > 1 ? "s" : ""}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
            <Flame size={12} /> {topicData.length} hot signals detected
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-secondary/40 px-5 py-3">
        <Star size={15} className="shrink-0 text-primary" />
        <p className="text-xs leading-relaxed text-foreground">Growth is calculated by the backend using the latest available database year, not the current calendar year.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {topicData.map((topic, index) => (
          <div key={topic.name} className="group rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">#{index + 1}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${stageColors[topic.stage]}`}>{topic.stage}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${opportunityColors[topic.opportunity]}`}>{topic.opportunity} opportunity</span>
                </div>
                <h3 className="text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">{topic.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{topic.field}</p>
                {topic.currentYear && topic.previousYear ? <p className="mt-1 text-[11px] text-muted-foreground">{topic.previousYear} to {topic.currentYear}</p> : null}
                <div className="mt-3 flex items-center gap-4">
                  <div>
                    <p className="text-xl font-bold text-foreground">{topic.papers.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">papers{topic.currentYear ? ` in ${topic.currentYear}` : ""}</p>
                  </div>
                  <div className={`flex items-center gap-1 ${topic.direction === "down" ? "text-red-500" : "text-emerald-600"}`}>
                    {topic.direction === "down" ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                    <div>
                      <p className="text-base font-bold">{topic.growth >= 0 ? "+" : ""}{topic.growth.toFixed(1)}%</p>
                      <p className="text-[10px] text-muted-foreground">growth rate</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 rounded-full bg-muted">
                  <div className="h-1.5 rounded-full" style={{ width: `${Math.min(100, Math.abs(topic.growth))}%`, backgroundColor: topic.color }} />
                </div>
              </div>
              <div className="shrink-0 pt-1">
                <MiniSparkline data={topic.trend} color={topic.color} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function buildTrend(previous: number, current: number) {
  return Array.from({ length: 8 }, (_, index) => Math.round(previous + ((current - previous) * index) / 7));
}
