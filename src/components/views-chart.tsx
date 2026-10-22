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
export function ViewsChart({
  data,
}: {
  data: { date: string; views: number }[];
}) {
  return (
    <div
      style={{ height: 260 }}
      aria-label="Daily page views. Exact values are available in the table below."
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid stroke="#303131" vertical={false} />
          <XAxis dataKey="date" stroke="#aaa8a2" fontSize={10} />
          <YAxis allowDecimals={false} stroke="#aaa8a2" fontSize={10} />
          <Tooltip
            contentStyle={{ background: "#202121", border: "1px solid #555" }}
          />
          <Area
            type="monotone"
            dataKey="views"
            stroke="#ef7058"
            fill="#ef705830"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
