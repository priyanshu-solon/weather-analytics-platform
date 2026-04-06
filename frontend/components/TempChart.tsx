"use client";

// We define the shape here locally so we don't have to import it
interface LocalHourlyData {
  time: string[];
  temperature_2m: number[];
}

type TempChartProps = {
  data: LocalHourlyData;
};

export default function TempChart({ data }: TempChartProps) {
  // 1. Safety check to prevent "undefined" errors during build
  if (!data || !data.time || !data.temperature_2m) {
    return (
      <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center text-xs text-gray-500">
        Waiting for telemetry...
      </div>
    );
  }

  // 2. Map the data safely
  const chartData = data.time.slice(0, 12).map((t: string, i: number) => ({
    time: t.includes("T") ? t.split("T")[1] : t,
    temp: data.temperature_2m[i] ?? 0,
  }));

  return (
    <div className="bg-black/20 p-4 rounded-[2rem] border border-white/10 backdrop-blur-md">
      <h2 className="text-[10px] font-bold uppercase text-blue-300 tracking-[0.2em] mb-4">
        12-Hour Forecast
      </h2>

      <div className="space-y-3">
        {chartData.map((item, i) => (
          <div key={i} className="flex justify-between items-center text-xs group">
            <span className="text-gray-400 group-hover:text-white transition-colors">{item.time}</span>
            <div className="h-[1px] flex-1 mx-4 bg-white/5" />
            <span className="font-mono font-bold text-blue-100">{item.temp}°C</span>
          </div>
        ))}
      </div>
    </div>
  );
}