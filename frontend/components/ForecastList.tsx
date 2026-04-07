"use client";

interface ForecastListProps {
  daily: any;
  isCelsius: boolean;
}

export default function ForecastList({ daily, isCelsius }: ForecastListProps) {
  if (!daily) return null;

  // Helper to convert and format based on unit
  const formatValue = (temp: number) => {
    const converted = isCelsius ? temp : (temp * 9) / 5 + 32;
    return Math.round(converted);
  };

  const unitLabel = isCelsius ? "C" : "F";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
      {daily.time.map((date: string, i: number) => (
        <div 
          key={i} 
          className="flex flex-col items-center p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all group"
        >
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
          </span>
          
          <div className="text-3xl my-4 group-hover:scale-110 transition-transform duration-300">
            {daily.weather_code[i] < 3 ? '☀️' : daily.weather_code[i] < 60 ? '☁️' : '🌧️'}
          </div>
          
          <p className="text-xl font-bold">
            {formatValue(daily.temperature_2m_max[i])}°{unitLabel}
          </p>
          
          <p className="text-xs text-slate-500 font-bold">
            {formatValue(daily.temperature_2m_min[i])}°{unitLabel}
          </p>
          
          <div className="mt-4 flex items-center gap-1">
             <div className="w-1 h-1 bg-blue-400 rounded-full" />
             <span className="text-[9px] font-black text-blue-400 uppercase">
               {daily.precipitation_sum[i]}mm
             </span>
          </div>
        </div>
      ))}
    </div>
  );
}