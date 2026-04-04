"use client";

import { useEffect, useState } from "react";

export const useLocation = () => {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      () => {
        // fallback (Delhi)
        setCoords({ lat: 28.61, lon: 77.23 });
      }
    );
  }, []);

  return coords;
};