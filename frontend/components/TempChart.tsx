"use client";

import type { HourlyWeather } from "@/services/weather";

// Fix: Correctly define the object structure for the component props
type TempChartProps = {
  data: HourlyWeather;
};

export default function TempChart({ data }: TempChartProps) {
  // Safety check: Ensure data exists and has the expected arrays
  if (!data || !data.time || !data.temperature_2m) {
    return (
      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
        <p className="text-center text-sm text-gray-400">No temperature data available</p>
      </div>
    );
  }

  // Slice the first 12 hours for a cleaner view
  const chartData = data.time.slice(0, 12).map((t: string, i: number) => ({
    time: t.includes("T") ? t.split("T")[1] : t,
    temp: data.temperature_2m[i] ?? 0,
  }));

  return (
    <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
      <h2 className="font-semibold mb-3 text-sm text-blue-200 uppercase tracking-wider">
        Hourly Temperature
      </h2>

      <div className="space-y-2">
        {chartData.map((item, i) => (
          <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-1 last:border-0">
            <span className="text-gray-400">{item.time}</span>
            <span className="font-mono text-blue-100">{item.temp}°C</span>
          </div>
        ))}
      </div>
    </div>
  );
}