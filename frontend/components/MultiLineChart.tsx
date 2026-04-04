import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function MultiLineChart({ hourly }: any) {
  if (!hourly) return null;

 // Inside your .map function, add explicit types to fix the (item, i) errors
const chartData = hourly.time.slice(0, 24).map((t: string, i: number) => ({
    time: new Date(t).getHours() + ":00",
    Temp: Math.round(hourly.temperature_2m[i]),
    Rain: hourly.precipitation_probability[i],
    Wind: hourly.wind_speed_10m ? Math.round(hourly.wind_speed_10m[i]) : 5,
}));

  return (
    <div className="w-full h-[250px] sm:h-[300px] md:h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#ffffff10"
            vertical={false}
          />

          <XAxis
            dataKey="time"
            stroke="#ffffff40"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            tickFormatter={(value, index) => (index % 3 === 0 ? value : "")}
          />

          <YAxis
            stroke="#ffffff40"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #ffffff10",
              borderRadius: "12px",
            }}
            itemStyle={{ fontSize: "12px", fontWeight: "bold" }}
          />

          {/* Temperature */}
          <Line
            type="monotone"
            dataKey="Temp"
            stroke="#fbbf24"
            strokeWidth={2}
            dot={false}
          />

          {/* Rain */}
          <Line
            type="monotone"
            dataKey="Rain"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />

          {/* Wind */}
          <Line
            type="monotone"
            dataKey="Wind"
            stroke="#f43f5e"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
