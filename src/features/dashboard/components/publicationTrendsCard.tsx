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

import type { TrendPoint } from "@/types/dashboard";

export function PublicationTrendsCard({ data }: { data: TrendPoint[] }) {
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

      <div className="dashboard-chart">
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          initialDimension={{ width: 720, height: 200 }}
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6C4CF1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6C4CF1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="bioGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
            <Tooltip contentStyle={{ border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12 }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="ai" name="AI / ML" stroke="#6C4CF1" strokeWidth={2} fill="url(#aiGrad)" />
            <Area type="monotone" dataKey="bio" name="Biosciences" stroke="#10B981" strokeWidth={2} fill="url(#bioGrad)" />
            <Area type="monotone" dataKey="climate" name="Climate Science" stroke="#F59E0B" strokeWidth={2} fill="none" strokeDasharray="4 2" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
