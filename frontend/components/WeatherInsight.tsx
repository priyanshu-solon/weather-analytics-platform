"use client";
import { useState, useEffect, useRef } from "react";

export default function WeatherInsight({ weatherData, location }: { weatherData: any, location: string }) {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const lastFetched = useRef("");

  useEffect(() => {
    if (!location || location === lastFetched.current) return;

    const fetchInsight = async () => {
      // 1. Check Cache First
      const cached = localStorage.getItem(`weather_intel_${location}`);
      if (cached) {
        setInsight(cached);
        lastFetched.current = location;
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ weatherData, location }),
        });
        
        const json = await res.json();
        if (json.insight) {
          setInsight(json.insight);
          localStorage.setItem(`weather_intel_${location}`, json.insight);
          lastFetched.current = location;
        }
      } catch (err) {
        setInsight("Intelligence feed interrupted.");
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchInsight, 800);
    return () => clearTimeout(debounce);
  }, [location, weatherData]);

  return (
    <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        <h3 className="text-[10px] font-bold uppercase text-blue-300 tracking-[0.3em]">Neural Intelligence</h3>
      </div>
      {loading ? (
        <div className="space-y-2 py-1">
          <div className="h-2 bg-white/10 rounded animate-pulse w-full" />
          <div className="h-2 bg-white/10 rounded animate-pulse w-2/3" />
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-blue-50/90 font-medium italic">
          "{insight || "Awaiting coordinate confirmation..."}"
        </p>
      )}
    </div>
  );
}