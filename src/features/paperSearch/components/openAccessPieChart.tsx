"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import type { PieSectorShapeProps } from "recharts/types/polar/Pie";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { AnalyticsOpenAccessStat } from "@/types/analytics";

const chartConfig = {
  papers: {
    label: "Papers",
  },
  openAccess: {
    label: "Open Access",
    color: "var(--chart-1)",
  },
  closed: {
    label: "Closed",
    color: "var(--muted)",
  },
} satisfies ChartConfig;

type OpenAccessPieItem = {
  key: "openAccess" | "closed";
  label: string;
  papers: number;
  fill: string;
};

export function OpenAccessPieChart({
  items,
}: {
  items: AnalyticsOpenAccessStat[];
}) {
  const chartData = React.useMemo(() => toOpenAccessPieData(items), [items]);
  const [activeKey, setActiveKey] = React.useState<OpenAccessPieItem["key"]>(
    "openAccess",
  );

  const resolvedActiveKey = chartData.some((item) => item.key === activeKey)
    ? activeKey
    : chartData[0]?.key;
  const activeIndex = React.useMemo(
    () =>
      resolvedActiveKey
        ? Math.max(
            chartData.findIndex((item) => item.key === resolvedActiveKey),
            0,
          )
        : 0,
    [resolvedActiveKey, chartData],
  );
  const activeItem = chartData[activeIndex];
  const total = chartData.reduce((sum, item) => sum + item.papers, 0);
  const openAccess = chartData.find((item) => item.key === "openAccess");
  const openAccessRate = total
    ? Math.round(((openAccess?.papers ?? 0) / total) * 1000) / 10
    : 0;

  const handlePieClick = React.useCallback(
    (_: unknown, index: number) => {
      const selectedItem = chartData[index];

      if (selectedItem) {
        setActiveKey(selectedItem.key);
      }
    },
    [chartData],
  );

  const renderPieShape = React.useCallback(
    ({ index, outerRadius = 0, ...props }: PieSectorShapeProps) => {
      if (index === activeIndex) {
        return <Sector {...props} outerRadius={outerRadius + 8} />;
      }

      return <Sector {...props} outerRadius={outerRadius} />;
    },
    [activeIndex],
  );

  if (!chartData.length || !activeItem) {
    return <p className="paper-search-insight-empty">No data yet</p>;
  }

  return (
    <div className="paper-search-open-access-pie">
      <div className="paper-search-open-access-summary">
        <strong>{openAccessRate}%</strong>
        <span>{(openAccess?.papers ?? 0).toLocaleString()} open papers</span>
      </div>
      <div className="paper-search-open-access-legend">
        {chartData.map((item) => (
          <span key={item.key} data-active={item.key === resolvedActiveKey}>
            <i style={{ backgroundColor: item.fill }} />
            {item.label}
          </span>
        ))}
      </div>
      <ChartContainer
        id="paper-search-open-access"
        config={chartConfig}
        className="paper-search-open-access-chart"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel nameKey="label" />}
          />
          <Pie
            data={chartData}
            dataKey="papers"
            nameKey="label"
            innerRadius={42}
            outerRadius={68}
            strokeWidth={2}
            shape={renderPieShape}
            onClick={handlePieClick}
          >
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                  return null;
                }

                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-lg font-semibold"
                    >
                      {activeItem.papers.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 18}
                      className="fill-muted-foreground text-[10px]"
                    >
                      {activeItem.label}
                    </tspan>
                  </text>
                );
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}

function toOpenAccessPieData(items: AnalyticsOpenAccessStat[]) {
  return items
    .map((item): OpenAccessPieItem | null => {
      const normalizedKey = item.key.trim().toLowerCase();
      const papers = Number.isFinite(item.value) ? item.value : 0;

      if (normalizedKey === "open access") {
        return {
          key: "openAccess",
          label: "Open Access",
          papers,
          fill: "var(--color-openAccess)",
        };
      }

      if (normalizedKey === "closed") {
        return {
          key: "closed",
          label: "Closed",
          papers,
          fill: "var(--color-closed)",
        };
      }

      return null;
    })
    .filter((item): item is OpenAccessPieItem => Boolean(item && item.papers >= 0));
}