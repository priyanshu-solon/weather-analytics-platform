import React, { useState } from "react";
import SearchBar from "./SearchBar";
import WeatherCard from "./WeatherCard";
import ForecastChart from "./ForecastChart";
import WindDirArrow from "./WindDirArrow";

/**
 * Weather main component
 * - Geocodes city name -> lat/lon via Open-Meteo geocoding
 * - Fetches hourly + daily + current with uv_index and extra params
 * - Renders main card, metric cards (including UV), hourly chart, and 7-day horizontal forecast
 */

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [theme, setTheme] = useState("sunny");

  const weatherCodeToIcon = (code) => {
    if (code === 0) return { icon: "☀️", label: "Clear" };
    if (code === 1 || code === 2) return { icon: "🌤️", label: "Partly Cloudy" };
    if (code === 3) return { icon: "☁️", label: "Cloudy" };
    if (code === 45 || code === 48) return { icon: "🌫️", label: "Fog" };
    if (code >= 51 && code <= 67) return { icon: "🌦️", label: "Drizzle" };
    if (code >= 80 && code <= 86) return { icon: "🌧️", label: "Rain" };
    if (code >= 71 && code <= 77) return { icon: "❄️", label: "Snow" };
    if (code >= 95 && code <= 99) return { icon: "⛈️", label: "Thunder" };
    return { icon: "🌡️", label: "Weather" };
  };

  // Precipitation
  const precipitationColor = (precip) => {
    if (precip > 10) return "#e63946"; // High - Red
    if (precip > 2) return "#ffba08"; // Moderate - Yellow
    return "#2a9d8f"; // Low - Green
  };

  const precipitationLabel = (precip) => {
    if (precip > 10) return "Heavy Rain";
    if (precip > 2) return "Moderate";
    return "Light";
  };

  // Humidity
  const humidityColor = (humidity) => {
    if (humidity > 80) return "#e63946"; // High - Red
    if (humidity > 50) return "#ffba08"; // Moderate - Yellow
    return "#2a9d8f"; // Low - Green
  };

  const humidityLabel = (humidity) => {
    if (humidity > 80) return "Very Humid";
    if (humidity > 50) return "Comfortable";
    return "Dry";
  };

  // Gusts
  const gustColor = (gust) => {
    if (gust > 15) return "#e63946"; // High - Red
    if (gust > 5) return "#ffba08"; // Moderate - Yellow
    return "#2a9d8f"; // Low - Green
  };

  const gustLabel = (gust) => {
    if (gust > 15) return "Strong Gusts";
    if (gust > 5) return "Breezy";
    return "Calm";
  };

  const uvLabel = (uv) => {
    if (uv == null) return "N/A";
    if (uv < 3) return "Low";
    if (uv < 6) return "Moderate";
    if (uv < 8) return "High";
    if (uv < 11) return "Very High";
    return "Extreme";
  };

  const uvColor = (uv) => {
    if (uv == null) return "#bbb";
    if (uv < 3) return "#2ecc71";
    if (uv < 6) return "#f1c40f";
    if (uv < 8) return "#e67e22";
    if (uv < 11) return "#e74c3c";
    return "#8e44ad";
  };

  const computeTheme = ({ code, wind, precip }) => {
    const hour = new Date().getHours();
    if ((hour < 6 || hour >= 18) && code === 0) return "night";
    if (code === 0 && precip === 0 && wind < 8) return "sunny";
    if (precip > 0 || (code >= 51 && code <= 86)) return "rainy";
    if (wind >= 10) return "windy";
    return "cloudy";
  };

  const fetchWeather = async (city) => {
    try {
      // 1) geocode
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city
        )}&count=1`
      );
      const geo = await geoRes.json();
      if (!geo.results || geo.results.length === 0) {
        alert("City not found");
        return;
      }
      const { latitude, longitude, name, country } = geo.results[0];

      // 2) fetch weather (include uv_index, windgusts, apparent_temperature, relative humidity)
      const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&hourly=temperature_2m,apparent_temperature,relativehumidity_2m,precipitation,wind_speed_10m,wind_direction_10m,windgusts_10m,uv_index,cloudcover` +
        `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,winddirection_10m_dominant` +
        `&current_weather=true&timezone=auto`;

      const wRes = await fetch(url);
      const data = await wRes.json();

      // hourly (next 24)
      const hoursCount = Math.min(24, data.hourly.time.length);
      const hourly = [];
      for (let i = 0; i < hoursCount; i++) {
        hourly.push({
          time: new Date(data.hourly.time[i]).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          temperature: Number(data.hourly.temperature_2m[i]),
          precipitation: Number(data.hourly.precipitation[i]),
          windspeed: Number(data.hourly.wind_speed_10m[i]),
          winddir: Number(data.hourly.wind_direction_10m[i]),
          uv: data.hourly.uv_index ? Number(data.hourly.uv_index[i]) : null,
        });
      }

      // daily (limit to 7)
      const daysCount = Math.min(7, data.daily.time.length);
      const daily = [];
      for (let i = 0; i < daysCount; i++) {
        daily.push({
          date: data.daily.time[i],
          max: data.daily.temperature_2m_max[i],
          min: data.daily.temperature_2m_min[i],
          precip: data.daily.precipitation_sum
            ? data.daily.precipitation_sum[i]
            : 0,
          windmax: data.daily.windspeed_10m_max
            ? data.daily.windspeed_10m_max[i]
            : null,
          winddir: data.daily.winddirection_10m_dominant
            ? data.daily.winddirection_10m_dominant[i]
            : null,
          weathercode: data.daily.weathercode
            ? data.daily.weathercode[i]
            : null,
        });
      }

      // summary values (first hour)
      const hs = {
        temperature: data.hourly.temperature_2m[0],
        apparent: data.hourly.apparent_temperature
          ? data.hourly.apparent_temperature[0]
          : null,
        humidity: data.hourly.relativehumidity_2m
          ? data.hourly.relativehumidity_2m[0]
          : null,
        precipitation: data.hourly.precipitation[0],
        windspeed: data.hourly.wind_speed_10m[0],
        winddir: data.hourly.wind_direction_10m[0],
        gusts: data.hourly.windgusts_10m ? data.hourly.windgusts_10m[0] : null,
        uv:
          data.hourly.uv_index && data.hourly.uv_index.length
            ? data.hourly.uv_index[0]
            : null,
        cloudcover: data.hourly.cloudcover ? data.hourly.cloudcover[0] : null,
      };

      setWeather({
        city: `${name}, ${country}`,
        current: data.current_weather,
        summary: hs,
      });
      setHourlyData(hourly);
      setDailyData(daily);

      const themeChosen = computeTheme({
        code: data.current_weather.weathercode,
        wind: data.current_weather.windspeed,
        precip: hs.precipitation,
      });
      setTheme(themeChosen);
      document.documentElement.className = `theme-${themeChosen}`;
    } catch (err) {
      console.error(err);
      alert("Failed to fetch weather, check console.");
    }
  };

  return (
    <div className={`weather-root py-4 theme-${theme}`}>
      <div className="app-header text-center mb-3">
        <h2>🌤 Weather Now</h2>
      </div>

      <div className="main-panel mx-auto">
        <SearchBar onSearch={fetchWeather} />

        {weather ? (
          <>
            <div className="row align-items-start g-4">
              {/* Left column: main card + metrics */}
              <div className="col-lg-6">
                <div className="card main-weather p-4 mb-3 shadow-sm">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <div className="small text-muted"> {weather.city} </div>
                      <div className="display-4 py-4 fw-bold">
                        {weather.current.temperature}°C
                      </div>
                      <div className="text-muted">
                        Feels like: {weather.summary.apparent ?? "-"}°C
                      </div>
                      <div className="text-muted mt-1">
                        Windspeed: {weather.current.windspeed} m/s
                      </div>
                    </div>

                    <div className="text-center">
                      <div style={{ fontSize: 14 }}>Wind</div>
                      <WindDirArrow
                        angle={
                          weather.summary.winddir ??
                          weather.current.winddirection
                        }
                        size={74}
                      />
                      <div className="small text-muted mt-1">
                        {weather.summary.winddir ??
                          weather.current.winddirection}
                        °
                      </div>
                    </div>
                  </div>
                </div>

                {/* metric cards row */}
                <div className="row g-3">
                  <div className="col-6 col-md-3">
                    <WeatherCard
                      icon={"🌧️"}
                      title="Precipitation"
                      value={
                        weather.summary.precipitation != null ? (
                          <div>
                            <div style={{ fontSize: 18, fontWeight: 700 }}>
                              {weather.summary.precipitation} mm
                            </div>
                            <div
                              style={{
                                display: "inline-block",
                                marginTop: 6,
                                padding: "4px 8px",
                                borderRadius: 999,
                                fontSize: 12,
                                color: "#fff",
                                background: precipitationColor(
                                  weather.summary.precipitation
                                ),
                              }}
                            >
                              {precipitationLabel(
                                weather.summary.precipitation
                              )}
                            </div>
                          </div>
                        ) : (
                          "N/A"
                        )
                      }
                    />
                  </div>

                  <div className="col-6 col-md-3">
                    <WeatherCard
                      icon={"💦"}
                      title="Humidity"
                      value={
                        weather.summary.humidity != null ? (
                          <div>
                            <div style={{ fontSize: 18, fontWeight: 700 }}>
                              {weather.summary.humidity}%
                            </div>
                            <div
                              style={{
                                display: "inline-block",
                                marginTop: 6,
                                padding: "4px 8px",
                                borderRadius: 999,
                                fontSize: 12,
                                color: "#fff",
                                background: humidityColor(
                                  weather.summary.humidity
                                ),
                              }}
                            >
                              {humidityLabel(weather.summary.humidity)}
                            </div>
                          </div>
                        ) : (
                          "N/A"
                        )
                      }
                    />
                  </div>

                  <div className="col-6 col-md-3">
                    <WeatherCard
                      icon={"🌬️"}
                      title="Gusts"
                      value={
                        weather.summary.gusts != null ? (
                          <div>
                            <div style={{ fontSize: 18, fontWeight: 700 }}>
                              {weather.summary.gusts} m/s
                            </div>
                            <div
                              style={{
                                display: "inline-block",
                                marginTop: 6,
                                padding: "4px 8px",
                                borderRadius: 999,
                                fontSize: 12,
                                color: "#fff",
                                background: gustColor(weather.summary.gusts),
                              }}
                            >
                              {gustLabel(weather.summary.gusts)}
                            </div>
                          </div>
                        ) : (
                          "N/A"
                        )
                      }
                    />
                  </div>

                  {/* UV Index (replaces wind dir) */}
                  <div className="col-6 col-md-3">
                    <WeatherCard
                      icon={"☀️"}
                      title="UV Index"
                      value={
                        weather.summary.uv != null ? (
                          <div>
                            <div style={{ fontSize: 18, fontWeight: 700 }}>
                              {weather.summary.uv}
                            </div>
                            <div
                              style={{
                                display: "inline-block",
                                marginTop: 6,
                                padding: "4px 8px",
                                borderRadius: 999,
                                fontSize: 12,
                                color: "#fff",
                                background: uvColor(weather.summary.uv),
                              }}
                            >
                              {uvLabel(weather.summary.uv)}
                            </div>
                          </div>
                        ) : (
                          "N/A"
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Right column: hourly chart */}
              <div className="col-lg-6">
                <ForecastChart hourly={hourlyData} />
              </div>
            </div>

            {/* 7-day horizontal forecast strip */}
            <div className="mt-4">
              <h6 className="text-center mb-3">7 Day Forecast</h6>

              <div className="forecast-strip d-flex gap-3">
                {dailyData.map((d, i) => {
                  const wc = weatherCodeToIcon(d.weathercode);
                  return (
                    <div
                      className="card forecast-day p-3 text-center shadow-sm"
                      key={i}
                    >
                      <div className="small text-muted">
                        {new Date(d.date).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="my-2" style={{ fontSize: 20 }}>
                        {wc.icon}
                      </div>
                      <div className="fw-bold">
                        {d.max}° / {d.min}°
                      </div>
                      <div className="small mt-1">Precip: {d.precip} mm</div>
                      <div className="d-flex align-items-center justify-content-center gap-2 mt-2">
                        <WindDirArrow angle={d.winddir ?? 0} size={18} />
                        <div className="small text-muted">Wind</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center mt-4 text-muted">
            🔍 Search a city to see weather
          </div>
        )}
      </div>
    </div>
  );
}
