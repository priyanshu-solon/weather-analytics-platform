"use client";

import { useState, useEffect } from "react";
import { useLocation } from "@/hooks/useLocation";
import { useWeather } from "@/hooks/useWeather";
import { getCoordinates, getWeatherMood } from "@/services/weather";
import { WeatherData } from "@/types/weather";

// Components
import SearchBar from "@/components/SearchBar";
import MultiLineChart from "@/components/MultiLineChart";
import ForecastList from "@/components/ForecastList";
import PinnedList from "@/components/PinnedList";

export default function Home() {
  const autoCoords = useLocation();
  const [searchCoords, setSearchCoords] = useState<any>(null);
  const [locationName, setLocationName] = useState("Bengaluru");
  const [pinnedCities, setPinnedCities] = useState<any[]>([]);

  const coords = searchCoords || autoCoords;
  const data = useWeather(searchCoords || autoCoords) as WeatherData | null;

  // Initial Sync: Load Pinned Cities
  useEffect(() => {
    fetch("/api/cities")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setPinnedCities(json.data);
      });
  }, []);

  const handlePin = async () => {
    if (!data || pinnedCities.some((c) => c.name === locationName)) return;
    const res = await fetch("/api/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: locationName,
        lat: coords.lat,
        lon: coords.lon,
      }),
    });
    const json = await res.json();
    if (json.success) setPinnedCities([json.data, ...pinnedCities]);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/cities/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPinnedCities((prev) => prev.filter((c) => c._id !== id));
    } else {
      console.error("Delete failed at API level");
    }
  };

  if (!data)
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center text-blue-500 font-bold animate-pulse">
        SYNCING SATELLITE...
      </div>
    );

  // Inside your Home component return statement...

  return (
    <main
      className={`min-h-screen bg-gradient-to-br ${getWeatherMood(data.current.weather_code)} p-6 text-white transition-all`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & Search */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-black/20 p-4 rounded-2xl backdrop-blur-md">
          <h1 className="text-xl font-black italic tracking-tighter">
            WEATHER INTEL
          </h1>
          <SearchBar
            onSearch={async (city) => {
              const loc = await getCoordinates(city);
              setSearchCoords({ lat: loc.lat, lon: loc.lon });
              setLocationName(loc.display_name.split(",")[0]);
            }}
          />
        </header>

        {/* Top Section: Hero & Chart */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white/10 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold">{locationName}</h2>
                <p className="opacity-60 text-sm">Live Intelligence</p>
              </div>
              <button
                onClick={handlePin}
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all"
              >
                {pinnedCities.some((c) => c.name === locationName)
                  ? "✔️"
                  : "📍"}
              </button>
            </div>
            <div className="text-8xl font-black py-10 tracking-tighter">
              {Math.round(data.current.temperature_2m)}°
            </div>
            <div className="bg-black/20 p-4 rounded-2xl text-sm border border-white/5">
              Feels like {Math.round(data.current.apparent_temperature)}°C
            </div>
          </div>

          <div className="lg:col-span-2 bg-black/30 p-6 rounded-[2.5rem] border border-white/5 shadow-inner">
            <h3 className="text-xs font-bold uppercase text-blue-400 mb-4 tracking-widest">
              24h Atmospheric Trends
            </h3>
            <div className="h-[350px] w-full">
              <MultiLineChart hourly={data.hourly} />
            </div>
          </div>
        </div>

        {/* --- RE-ADDED: Metrics Grid --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            label="Humidity"
            value={`${data.current.relative_humidity_2m}%`}
            icon="💧"
          />
          <MetricCard
            label="UV Index"
            value={data.current.uv_index.toFixed(1)}
            icon="☀️"
          />
          <MetricCard
            label="Wind"
            value={`${data.current.wind_speed_10m} km/h`}
            icon="💨"
          />
          <MetricCard
            label="Precip"
            value={`${data.current.precipitation} mm`}
            icon="🌧️"
          />
        </div>

        {/* Pinned Cities Section */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-40">
            Intelligence Network
          </h3>
          <PinnedList
            cities={pinnedCities}
            onDelete={handleDelete}
            onSelect={(city) => {
              setSearchCoords({ lat: city.lat, lon: city.lon });
              setLocationName(city.name);
            }}
          />
        </div>

        {/* --- RE-ADDED: Forecast Section --- */}
        <div className="bg-white/5 p-6 rounded-[2.5rem] backdrop-blur-sm border border-white/5">
          <h3 className="text-xs font-bold uppercase mb-6 opacity-50 tracking-widest">
            7-Day Extended Forecast
          </h3>
          <ForecastList daily={data.daily} />
        </div>
      </div>
    </main>
  );

  function MetricCard({
    label,
    value,
    icon,
  }: {
    label: string;
    value: string;
    icon: string;
  }) {
    return (
      <div className="bg-white/5 hover:bg-white/10 transition-colors p-5 rounded-3xl border border-white/10 flex items-center gap-4">
        <div className="text-2xl">{icon}</div>
        <div>
          <p className="text-[10px] font-bold text-blue-300 uppercase">
            {label}
          </p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    );
  }
}
