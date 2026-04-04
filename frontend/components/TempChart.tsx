"use client";

import type { HourlyWeather } from "@/services/weather";

type TempChartProps = {
  data: HourlyWeather;
};

export default function TempChart({ data }: TempChartProps) {
  if (!data || !Array.isArray(data.time) || !Array.isArray(data.temperature_2m)) {
    return <p className="text-center">No temperature data</p>;
  }

  const chartData = data.time.slice(0, 12).map((t: string, i: number) => ({
    time: t.split("T")[1] || t,
    temp: data.temperature_2m[i] ?? 0,
  }));

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="font-semibold mb-2">Temperature</h2>

      {chartData.map((item, i) => (
        <div key={i} className="flex justify-between text-sm">
          <span>{item.time}</span>
          <span>{item.temp}C</span>
        </div>
      ))}
    </div>
  );
}
