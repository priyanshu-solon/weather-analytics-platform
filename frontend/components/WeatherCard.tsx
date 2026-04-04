import { WeatherData } from "@/types/weather";

export default function WeatherCard({ data, location }: { data: any; location: string }) {
  return (
    <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-2xl h-full flex flex-col justify-between">
      <div>
        <p className="text-sm font-black uppercase tracking-widest opacity-70 mb-2">
          {location}
        </p>
        <h2 className="text-8xl font-black tracking-tighter">
          {Math.round(data.current.temperature_2m)}°
        </h2>
      </div>

      <div className="mt-8 border-t border-white/20 pt-6 flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Wind Speed</p>
          <p className="text-xl font-bold">{data.current.wind_speed_10m} <span className="text-sm font-medium">km/h</span></p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Condition</p>
          <p className="text-xl font-bold">Cloudy</p>
        </div>
      </div>
    </div>
  );
}