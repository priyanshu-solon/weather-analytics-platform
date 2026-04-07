"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface MultiLineChartProps {
  hourly: any;
  isCelsius: boolean;
}

export default function MultiLineChart({ hourly, isCelsius }: MultiLineChartProps) {
  if (!hourly) return null;

  const chartData = hourly.time.slice(0, 24).map((t: string, i: number) => {
    // Perform conversion if isCelsius is false
    const rawTemp = hourly.temperature_2m[i];
    const convertedTemp = isCelsius ? rawTemp : (rawTemp * 9) / 5 + 32;

    return {
      time: new Date(t).getHours() + ":00",
      Temp: Math.round(convertedTemp),
      Rain: hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0,
      Wind: hourly.wind_speed_10m ? Math.round(hourly.wind_speed_10m[i]) : 5,
    };
  });

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
            domain={['auto', 'auto']}
          />

          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #ffffff10",
              borderRadius: "12px",
            }}
            itemStyle={{ fontSize: "12px", fontWeight: "bold" }}
            // Added formatter to show correct units on hover
            formatter={(value: any, name: string) => {
              if (name === "Temp") return [`${value}°${isCelsius ? "C" : "F"}`, "Temperature"];
              if (name === "Wind") return [`${value} km/h`, "Wind Speed"];
              if (name === "Rain") return [`${value}%`, "Rain Probability"];
              return [value, name];
            }}
          />

          {/* Temperature */}
          <Line
            type="monotone"
            dataKey="Temp"
            stroke="#fbbf24"
            strokeWidth={3}
            dot={false}
            animationDuration={1000}
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