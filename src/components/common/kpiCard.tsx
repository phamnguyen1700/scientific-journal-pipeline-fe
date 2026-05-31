import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Trend = "up" | "down" | "flat";

export function KpiCard({
  icon,
  iconColor = "bg-secondary",
  iconTextColor = "text-primary",
  label,
  value,
  trend,
  trendValue,
  sub,
  className,
}: {
  icon?: ReactNode;
  iconColor?: string;
  iconTextColor?: string;
  label: string;
  value: ReactNode;
  trend?: Trend;
  trendValue?: string;
  sub?: string;
  className?: string;
}) {
  const trendClass = {
    up: "text-emerald-600",
    down: "text-red-600",
    flat: "text-muted-foreground",
  } satisfies Record<Trend, string>;

  return (
    <div className={cn("min-w-0 rounded-xl border border-border bg-card p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
          <div className="mt-1 truncate text-2xl font-semibold text-foreground">
            {value}
          </div>
        </div>
        {icon && (
          <div
            className={cn(
              "flex size-9 items-center justify-center rounded-lg",
              iconColor,
              iconTextColor
            )}
          >
            {icon}
          </div>
        )}
      </div>
      {(trendValue || sub) && (
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          {trendValue && trend && (
            <span className={cn("font-medium", trendClass[trend])}>
              {trendValue}
            </span>
          )}
          {sub && <span className="text-muted-foreground">{sub}</span>}
        </div>
      )}
    </div>
  );
}
