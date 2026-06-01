import { KpiCard } from "@/components/common";
import type { DashboardKpi } from "@/types/dashboard";

export function DashboardKpiGrid({ items }: { items: DashboardKpi[] }) {
  return (
    <div className="dashboard-kpi-grid">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <KpiCard
            key={item.label}
            icon={<Icon className="size-[18px]" />}
            iconColor={item.iconColor}
            iconTextColor={item.iconTextColor}
            label={item.label}
            value={item.value}
            trend={item.trendValue ? "up" : undefined}
            trendValue={item.trendValue}
            sub={item.sub}
            className="transition-shadow hover:shadow-md"
          />
        );
      })}
    </div>
  );
}
