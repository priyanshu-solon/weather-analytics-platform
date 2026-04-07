"use client";

import { useState, useEffect } from "react";

export default function SearchBar({ onSearch }: { onSearch: (city: any) => void }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5&addressdetails=1`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Suggestion fetch failed", err);
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search city (e.g. Bengaluru, Bihar...)"
        className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 z-[110] mt-2 bg-slate-900/95 border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => {
                onSearch(s);
                setQuery("");
                setSuggestions([]);
              }}
              className="p-3 hover:bg-white/10 cursor-pointer text-sm border-b border-white/5 last:border-none"
            >
              <span className="font-bold">{s.address.city || s.address.town || s.address.name}</span>,{" "}
              <span className="opacity-60">{s.address.country}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}