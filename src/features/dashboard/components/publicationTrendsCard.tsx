"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
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
            Monthly paper count by topic area
          </p>
        </div>
        <select className="dashboard-range-select" defaultValue="6-months">
          <option value="6-months">Last 6 months</option>
          <option value="year">Last year</option>
        </select>
      </div>

      {data.length && series.length ? (
        <div className="dashboard-chart">
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            initialDimension={{ width: 720, height: 200 }}
          >
            <AreaChart data={data}>
              <defs>
                {series.map((item) => (
                  <linearGradient key={item.key} id={`${item.key}Grad`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={item.color} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={item.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
              <Tooltip contentStyle={{ border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              {series.map((item) => (
                <Area
                  key={item.key}
                  type="monotone"
                  dataKey={item.key}
                  name={item.name}
                  stroke={item.color}
                  strokeWidth={2}
                  fill={`url(#${item.key}Grad)`}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="dashboard-paper-empty">No publication trend data found.</div>
      )}
    </section>
  );
}
