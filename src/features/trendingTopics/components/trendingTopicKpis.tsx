import { Activity, FileText, TrendingUp, Users } from "lucide-react";

import { KpiCard } from "@/components/common";

export function TrendingTopicKpis() {
  return (
    <div className="trending-topics-kpi-grid">
      <KpiCard
        icon={<Activity />}
        iconColor="bg-purple-100"
        iconTextColor="text-purple-600"
        label="Active Topics"
        value="128"
        trend="up"
        trendValue="+18"
        sub="this month"
      />
      <KpiCard
        icon={<FileText />}
        iconColor="bg-blue-100"
        iconTextColor="text-blue-600"
        label="New Publications"
        value="14.8K"
        trend="up"
        trendValue="+21.4%"
        sub="vs previous period"
      />
      <KpiCard
        icon={<TrendingUp />}
        iconColor="bg-emerald-100"
        iconTextColor="text-emerald-600"
        label="Fastest Growth"
        value="42.8%"
        sub="Federated Learning"
      />
      <KpiCard
        icon={<Users />}
        iconColor="bg-amber-100"
        iconTextColor="text-amber-600"
        label="New Followers"
        value="3.2K"
        trend="up"
        trendValue="+12.6%"
        sub="across trending topics"
      />
    </div>
  );
}
