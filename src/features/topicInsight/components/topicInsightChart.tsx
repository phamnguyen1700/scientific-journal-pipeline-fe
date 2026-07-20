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

import type {
  TrendingTopicChartPoint,
  TrendingTopicChartSeries,
} from "@/types/topics";

export function TopicInsightChart({
  data,
  series,
}: {
  data: TrendingTopicChartPoint[];
  series: TrendingTopicChartSeries[];
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
            {series.map((item) => (
              <Line
                dataKey={item.key}
                dot={false}
                key={item.key}
                name={item.name}
                stroke={item.color}
                strokeWidth={2}
                type="monotone"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
