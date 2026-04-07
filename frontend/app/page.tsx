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
import WeatherInsight from "@/components/WeatherInsight";

export default function Home() {
  const autoCoords = useLocation();
  const [searchCoords, setSearchCoords] = useState<any>(null);
  const [locationName, setLocationName] = useState("Bengaluru");
  const [pinnedCities, setPinnedCities] = useState<any[]>([]);
  
  // --- NEW: Unit State ---
  const [isCelsius, setIsCelsius] = useState(true);

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

  // --- NEW: Conversion Helper ---
  const convertTemp = (temp: number) => {
    if (isCelsius) return Math.round(temp);
    return Math.round((temp * 9) / 5 + 32);
  };

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

  const handleLocationSelect = (locationData: any) => {
    if (!locationData || !locationData.lat || !locationData.lon) {
      alert("❌ Invalid location selected. Please try again.");
      return;
    }

    // Extract name and country
    const addr = locationData.address;
    const city = addr.city || addr.town || addr.village || addr.suburb || "Unknown";
    const country = addr.country || "";
    
    setSearchCoords({ lat: parseFloat(locationData.lat), lon: parseFloat(locationData.lon) });
    setLocationName(`${city}, ${country}`); 
  };

  if (!data)
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center text-blue-500 font-bold animate-pulse tracking-[0.2em]">
        SYNCING SATELLITE...
      </div>
    );

  return (
    <main
      className={`min-h-screen bg-gradient-to-br ${getWeatherMood(data.current.weather_code)} p-6 text-white transition-all duration-700`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Search */}
        <header className="relative z-[100] flex flex-col md:flex-row justify-between items-center gap-4 bg-black/20 p-4 rounded-2xl backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-black italic tracking-tighter">
              WEATHER INTEL
            </h1>
            {/* --- NEW: Unit Toggle Button --- */}
            <button 
              onClick={() => setIsCelsius(!isCelsius)}
              className="px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all"
            >
              Switch to °{isCelsius ? "F" : "C"}
            </button>
          </div>
          <SearchBar onSearch={handleLocationSelect} />
        </header>

        {/* Top Section: Hero & Chart */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white/10 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl flex flex-col justify-between shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold leading-tight">{locationName}</h2>
                <p className="opacity-60 text-sm">Live Intelligence</p>
              </div>
              <button
                onClick={handlePin}
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all border border-white/5"
              >
                {pinnedCities.some((c) => c.name === locationName)
                  ? "✔️"
                  : "📍"}
              </button>
            </div>
            
            {/* --- UPDATED: Hero Temperature --- */}
            <div className="text-8xl font-black py-10 tracking-tighter flex items-start">
              {convertTemp(data.current.temperature_2m)}
              <span className="text-3xl font-light mt-4 opacity-40">°{isCelsius ? "C" : "F"}</span>
            </div>

            {/* --- UPDATED: Feels Like --- */}
            <div className="bg-black/20 p-4 rounded-2xl text-sm border border-white/5">
              Feels like {convertTemp(data.current.apparent_temperature)}°{isCelsius ? "C" : "F"}
            </div>
          </div>

          <div className="lg:col-span-2 bg-black/30 p-6 rounded-[2.5rem] border border-white/5 shadow-inner">
            <h3 className="text-xs font-bold uppercase text-blue-400 mb-4 tracking-widest">
              24h Atmospheric Trends
            </h3>
            <div className="h-[350px] w-full">
              {/* --- UPDATED: Pass unit state to chart --- */}
              <MultiLineChart hourly={data.hourly} isCelsius={isCelsius} />
            </div>
          </div>
        </div>

        <WeatherInsight weatherData={data} location={locationName} />

        {/* Metrics Grid */}
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

        {/* Forecast Section */}
        <div className="bg-white/5 p-6 rounded-[2.5rem] backdrop-blur-sm border border-white/5">
          <h3 className="text-xs font-bold uppercase mb-6 opacity-50 tracking-widest">
            7-Day Extended Forecast
          </h3>
          {/* --- NOTE: ForecastList will also need internal conversion if you want it in F --- */}
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