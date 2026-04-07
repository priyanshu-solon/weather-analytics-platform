"use client";

import { useState, useEffect } from "react";

export default function SearchBar({ onSearch }: { onSearch: (location: any) => void }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. Only search if the query is long enough
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    // 2. Start the timer (The Debounce)
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'WeatherIntelApp/1.0' // Good practice for Nominatim
            }
          }
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Geocoding failed:", err);
      } finally {
        setLoading(false);
      }
    }, 600); // 600ms wait time

    // 3. Cleanup: This is the magic. 
    // If the user types another letter before 600ms is up, 
    // this "clearTimeout" kills the previous timer and starts a new one.
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city..."
          className="w-full p-3 pl-10 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        {/* Loading Spinner Icon */}
        {loading && (
          <div className="absolute right-3 top-3.5 animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
        )}
      </div>
      
      {suggestions.length > 0 && (
        <ul className="absolute z-[110] w-full mt-2 bg-slate-900/95 border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => {
                onSearch(s);
                setQuery("");
                setSuggestions([]);
              }}
              className="p-3 hover:bg-white/20 cursor-pointer text-sm border-b border-white/5 last:border-none transition-colors"
            >
              <span className="font-bold text-blue-300">
                {s.address.city || s.address.town || s.address.village || s.display_name.split(',')[0]}
              </span>
              <span className="ml-2 text-[10px] opacity-50 uppercase tracking-tighter">
                {s.address.country}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}