import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "May 1", orders: 120 },
  { date: "May 2", orders: 98 },
  { date: "May 3", orders: 150 },
  { date: "May 4", orders: 130 },
  { date: "May 5", orders: 170 },
  { date: "May 6", orders: 160 },
  { date: "May 7", orders: 190 },
];

const LineChartOrders: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="orders"
          stroke="#006AFF"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartOrders;
