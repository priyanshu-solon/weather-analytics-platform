"use client";

import { useState } from "react";
import { useLocation } from "@/hooks/useLocation";
import { useWeather } from "@/hooks/useWeather";
import { getCoordinates, getWeatherMood } from "@/services/weather";
import { WeatherData } from "@/types/weather";
import MultiLineChart from "@/components/MultiLineChart";
import SearchBar from "@/components/SearchBar";
import ForecastList from "@/components/ForecastList";

export default function Home() {
  const autoCoords = useLocation();
  const [searchCoords, setSearchCoords] = useState<any>(null);
  const [locationName, setLocationName] = useState("Bengaluru");

  const data = useWeather(searchCoords || autoCoords) as WeatherData | null;

  if (!data) return (
    <div className="h-screen bg-slate-950 flex items-center justify-center text-blue-500 font-bold animate-pulse">
      SYNCING SATELLITE DATA...
    </div>
  );

  const mood = getWeatherMood(data.current.weather_code);

  return (
    <main className={`min-h-screen w-full bg-gradient-to-br ${mood} text-white p-4 md:p-6 transition-all duration-500`}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-black/20 p-4 rounded-2xl backdrop-blur-md">
          <h1 className="text-2xl font-black italic tracking-tighter">WEATHER INTEL</h1>
          <SearchBar onSearch={async (city) => {
            const loc = await getCoordinates(city);
            setSearchCoords({ lat: loc.lat, lon: loc.lon });
            setLocationName(loc.display_name.split(",")[0]);
          }} />
        </header>

        {/* Top Section: Main Info & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Current Weather Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 flex flex-col justify-between shadow-xl">
            <div>
              <h2 className="text-3xl font-bold">{locationName}</h2>
              <p className="opacity-60 text-sm">Today's Outlook</p>
            </div>
            <div className="my-8">
              <span className="text-8xl font-black tracking-tighter">
                {Math.round(data.current.temperature_2m)}°
              </span>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl">
              <p className="text-[10px] font-bold uppercase opacity-50 mb-1">Atmospheric Condition</p>
              <p className="font-medium">Feels like {Math.round(data.current.apparent_temperature)}°C</p>
            </div>
          </div>

          {/* Multi-Line Chart Card */}
          <div className="lg:col-span-2 bg-black/30 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 shadow-inner">
            <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-6">24h Atmospheric Trends</h3>
            <div className="h-[300px] w-full">
              <MultiLineChart hourly={data.hourly} />
            </div>
          </div>
        </div>

        {/* Middle Section: Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Humidity" value={`${data.current.relative_humidity_2m}%`} icon="💧" />
          <MetricCard label="UV Index" value={data.current.uv_index.toFixed(1)} icon="☀️" />
          <MetricCard label="Wind" value={`${data.current.wind_speed_10m} km/h`} icon="💨" />
          <MetricCard label="Precip" value={`${data.current.precipitation} mm`} icon="🌧️" />
        </div>

        {/* Bottom Section: Forecast */}
        <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 backdrop-blur-sm">
          <h3 className="text-xs font-bold uppercase mb-4 opacity-50">7-Day Extended Forecast</h3>
          <ForecastList daily={data.daily} />
        </div>
      </div>
    </main>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-white/5 hover:bg-white/10 transition-colors p-5 rounded-3xl border border-white/10 flex items-center gap-4">
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-blue-300 uppercase">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}