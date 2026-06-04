"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TrendingTopicChartPoint } from "@/types/topics";

export function TrendingTopicsChart({
  data,
}: {
  data: TrendingTopicChartPoint[];
}) {
  return (
    <section className="trending-topics-chart-card">
      <div>
        <h2 className="trending-topics-card-title">Publication Growth</h2>
        <p className="trending-topics-card-description">
          Publication volume for the leading research topics
        </p>
      </div>
      <div className="trending-topics-chart">
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          initialDimension={{ width: 840, height: 250 }}
        >
          <LineChart data={data}>
            <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
            <Tooltip contentStyle={{ border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12 }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="llm" name="Large Language Models" stroke="#6C4CF1" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="federated" name="Federated Learning" stroke="#EF4444" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="quantum" name="Quantum Computing" stroke="#3B82F6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="climate" name="Climate Modeling" stroke="#10B981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
