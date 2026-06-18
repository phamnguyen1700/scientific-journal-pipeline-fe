import type { ReactNode } from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";

import { clusterAreas } from "@/features/researcher/components/researcherData";

export function chartTooltip() {
  return { borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 };
}

export function ResearcherPageShell({ title, description, icon }: { title: string; description: string; icon?: ReactNode }) {
  return (
    <div>
      <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
        {icon}
        {title}
      </h1>
      <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function ResearcherKpiCard({ icon, label, value, delta, color }: { icon: ReactNode; label: string; value: string; delta: string; color: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>{icon}</div>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">{delta}</span>
      </div>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <ResponsiveContainer width={80} height={40}>
      <LineChart data={chartData}>
        <Line dataKey="value" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function getClusterColor(area: string) {
  return clusterAreas.find((item) => item.id === area)?.color ?? "#6B7280";
}


export function InfoMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

export function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
