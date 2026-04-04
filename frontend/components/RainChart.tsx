import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';

export default function RainChart({ hourly }: any) {
  if (!hourly) return null;

  const chartData = hourly.time.slice(0, 24).map((t: string, i: number) => ({
    time: new Date(t).getHours() + ":00",
    temp: hourly.temperature_2m[i],
  }));

  return (
    <div className="w-full h-full min-h-[150px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <XAxis dataKey="time" hide />
          <Tooltip 
            contentStyle={{ borderRadius: '15px', background: '#0f172a', border: 'none', color: '#fff' }} 
            itemStyle={{ color: '#3b82f6' }}
          />
          <Area type="monotone" dataKey="temp" stroke="#3b82f6" fill="url(#colorTemp)" fillOpacity={0.3} />
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}