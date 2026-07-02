"use client";
import { Flame, Star, TrendingUp, Zap } from "lucide-react";
import { MiniSparkline, ResearcherEmptyState, ResearcherLoadingState, ResearcherPageShell } from "@/features/researcher/components/researcherShared";
import { useTrendingTopics } from "@/hooks/analytics";
import { topicPalette } from "@/features/researcher/components/researcherData";

export function EmergingTopicsPage() {
  const trendingQuery = useTrendingTopics();
  if (trendingQuery.isPending) {
    return <div className="space-y-6 p-6"><ResearcherPageShell title="Emerging Topics" description="AI-detected research areas with accelerating publication growth" icon={<Zap size={18} className="text-amber-500" />} /><ResearcherLoadingState label="Loading emerging topics" /></div>;
  }
  if (!trendingQuery.data?.length) {
    return <div className="space-y-6 p-6"><ResearcherPageShell title="Emerging Topics" description="AI-detected research areas with accelerating publication growth" icon={<Zap size={18} className="text-amber-500" />} /><ResearcherEmptyState title="No emerging topics" description="The analytics service has not returned any trending topic signals." /></div>;
  }
  const topicData = trendingQuery.data.map((topic, index) => ({
        name: topic.topicName,
        field: "Trending research topic",
        growth: topic.growthPercentage,
        papers: topic.paperCount,
        since: "current period",
        stage: topic.growthPercentage >= 100 ? "Explosive" : topic.growthPercentage >= 50 ? "Rapid" : topic.growthPercentage > 0 ? "Growing" : "Emerging",
        color: [topicPalette.purple, topicPalette.blue, topicPalette.emerald, topicPalette.amber, topicPalette.red, topicPalette.violet][index % 6],
        opportunity: topic.growthPercentage >= 100 ? "Very High" : topic.growthPercentage >= 25 ? "High" : "Medium",
        trend: buildTrend(topic.paperCount, topic.growthPercentage),
      }));
  const stageColors: Record<string, string> = {
    Explosive: "bg-red-100 text-red-700",
    Rapid: "bg-orange-100 text-orange-700",
    Growing: "bg-yellow-100 text-yellow-700",
    Emerging: "bg-blue-100 text-blue-700",
  };
  const opportunityColors: Record<string, string> = {
    "Very High": "bg-purple-100 text-purple-700",
    High: "bg-emerald-100 text-emerald-700",
    Medium: "bg-sky-100 text-sky-700",
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <ResearcherPageShell title="Emerging Topics" description="AI-detected research areas with accelerating publication growth" icon={<Zap size={18} className="text-amber-500" />} />
        <div className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
          <Flame size={12} /> {topicData.length} hot signals detected
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-secondary/40 px-5 py-3">
        <Star size={15} className="shrink-0 text-primary" />
        <p className="text-xs leading-relaxed text-foreground">These topics are identified from publication velocity, citation acceleration, and keyword co-occurrence patterns across indexed papers.</p>
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
                <div className="mt-3 flex items-center gap-4">
                  <div>
                    <p className="text-xl font-bold text-foreground">{topic.papers.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">papers in {topic.since}</p>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <TrendingUp size={14} />
                    <div>
                      <p className="text-base font-bold">+{topic.growth}%</p>
                      <p className="text-[10px] text-muted-foreground">growth rate</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 rounded-full bg-muted">
                  <div className="h-1.5 rounded-full" style={{ width: `${Math.min(100, (topic.growth / 150) * 100)}%`, backgroundColor: topic.color }} />
                </div>
              </div>
              <div className="shrink-0 pt-1">
                <MiniSparkline data={topic.trend} color={topic.color} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold text-foreground">6-Month Outlook</h3>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Topics likely to peak", value: "2", desc: "Explosive to mature" },
            { label: "Topics to watch", value: "4", desc: "Early acceleration" },
            { label: "Avg. predicted growth", value: "+91%", desc: "Next 6 months" },
            { label: "New signals forming", value: "12", desc: "Pre-emerging stage" },
          ].map((item) => (
            <div key={item.label} className="rounded-lg bg-muted/60 p-3">
              <p className="text-xl font-bold text-foreground">{item.value}</p>
              <p className="mt-0.5 text-xs font-medium text-foreground">{item.label}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function buildTrend(papers: number, growth: number) {
  const start = papers / Math.max(1, 1 + growth / 100);
  return Array.from({ length: 8 }, (_, index) => Math.round(start + ((papers - start) * index) / 7));
}
