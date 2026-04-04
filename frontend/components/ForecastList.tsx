export default function ForecastList({ daily }: any) {
  if (!daily) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
      {daily.time.map((date: string, i: number) => (
        <div key={i} className="flex flex-col items-center p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all">
          <span className="text-[10px] font-black text-slate-500 uppercase">
            {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
          </span>
          <div className="text-3xl my-4">
            {daily.weather_code[i] < 3 ? '☀️' : daily.weather_code[i] < 60 ? '☁️' : '🌧️'}
          </div>
          <p className="text-xl font-bold">{Math.round(daily.temperature_2m_max[i])}°</p>
          <p className="text-xs text-slate-500 font-bold">{Math.round(daily.temperature_2m_min[i])}°</p>
          <div className="mt-4 flex items-center gap-1">
             <div className="w-1 h-1 bg-blue-400 rounded-full" />
             <span className="text-[9px] font-black text-blue-400 uppercase">{daily.precipitation_sum[i]}mm</span>
          </div>
        </div>
      ))}
    </div>
  );
}