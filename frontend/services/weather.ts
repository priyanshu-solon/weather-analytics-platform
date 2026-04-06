import axios from "axios";

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  precipitation_probability?: number[];
}

export interface WeatherResponse {
  current: any;
  hourly: HourlyWeather;
  daily: any;
}

const GEO_URL = "https://nominatim.openstreetmap.org/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

export const getCoordinates = async (city: string) => {
  const res = await axios.get(GEO_URL, { params: { q: city, format: "json", limit: 1 } });
  if (!res.data.length) throw new Error("City not found");
  return res.data[0];
};

export const getWeather = async (lat: number, lon: number): Promise<WeatherResponse> => {
  const res = await axios.get(WEATHER_URL, {
    params: {
      latitude: lat,
      longitude: lon,
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index",
      hourly: "temperature_2m,precipitation_probability",
      daily: "weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum",
      timezone: "auto",
    },
  });
  return res.data;
};

export const getCityContext = (city: string) => {
  const cityName = city.split(',')[0].trim();
  // Dynamically fetches a landmark image from the web based on city name
  const imageUrl = `https://loremflickr.com/1600/900/${encodeURIComponent(cityName)},landmark/all`;
  return { cityName, imageUrl };
};
export const getWeatherMood = (code: number) => {
  // Simple mapping: 0-1 clear, 2-4 cloudy, 5+ rain/storm
  if (code <= 1) return "from-amber-500 to-orange-700"; // Sunny
  if (code <= 4) return "from-slate-600 to-slate-900";   // Cloudy
  return "from-blue-700 to-indigo-900";                  // Rainy
};