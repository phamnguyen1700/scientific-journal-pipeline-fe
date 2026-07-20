"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
} from "recharts";

export function TopicSparkline({
  data,
  color,
}: {
  data: number[];
  color: string;
}) {
  const points = data.map((value, index) => ({ index, value }));

  return (
    <div className="trending-topics-sparkline">
      <ResponsiveContainer
        width="100%"
        height="100%"
        minWidth={0}
        initialDimension={{ width: 92, height: 32 }}
      >
        <LineChart data={points}>
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
