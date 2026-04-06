"use client";

import { useEffect, useState } from "react";
import { getWeather } from "@/services/weather"; // Updated import [cite: 35]
import { WeatherData } from "@/types/weather";

export const useWeather = (coords: any) => {
  const [data, setData] = useState<WeatherData | null>(null);

  useEffect(() => {
    if (!coords) return;

    const load = async () => {
      // Using the axios-based service to get advanced data [cite: 37]
      const res = await getWeather(coords.lat, coords.lon);
      setData(res as any);
    };

    load();
  }, [coords]);

  return data;
};