"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TrendPoint, TrendSeries } from "@/types/dashboard";

export function PublicationTrendsCard({
  data,
  series,
}: {
  data: TrendPoint[];
  series: TrendSeries[];
}) {
  return (
    <section className="dashboard-card dashboard-trends-card">
      <div className="dashboard-card-heading">
        <div>
          <h2 className="dashboard-card-title">Publication Trends</h2>
          <p className="dashboard-card-description">
            Yearly paper count by keyword
          </p>
        </div>
      </div>

      {data.length && series.length ? (
        <div className="dashboard-trend-chart-wrap">
          <div className="dashboard-trend-chart">
            <ResponsiveContainer width="100%" height="100%" minWidth={320}>
              <AreaChart data={data} margin={{ top: 8, right: 18, bottom: 8, left: -12 }}>
                <defs>
                  {series.map((item) => (
                    <linearGradient key={item.key} id={`${item.key}Grad`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={item.color} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={item.color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" />
                <XAxis dataKey="year" axisLine={false} interval="preserveStartEnd" minTickGap={18} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                <Tooltip contentStyle={{ border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12 }} />
                {series.map((item) => (
                  <Area
                    key={item.key}
                    type="monotone"
                    dataKey={item.key}
                    name={item.name}
                    stroke={item.color}
                    strokeWidth={2}
                    fill={`url(#${item.key}Grad)`}
                    activeDot={{ r: 4 }}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="dashboard-trend-legend">
            {series.map((item) => (
              <span key={item.key} className="dashboard-trend-legend-item">
                <span style={{ backgroundColor: item.color }} />
                {item.name}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="dashboard-paper-empty">No publication trend data found.</div>
      )}
    </section>
  );
}
