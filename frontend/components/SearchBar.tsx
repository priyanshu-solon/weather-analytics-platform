"use client";
import { useState } from "react";

export default function SearchBar({ onSearch }: { onSearch: (city: string) => void }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents standard page reload
    if (value.trim()) onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="relative group w-full max-w-lg mx-auto">
      <input
        className="w-full bg-slate-900/60 border border-slate-700/50 backdrop-blur-xl rounded-2xl py-4 px-6 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-2xl"
        placeholder="Enter city (e.g. Bangalore)..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button 
        type="submit"
        className="absolute right-3 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-xl font-medium transition-colors"
      >
        Search
      </button>
    </form>
  );
}