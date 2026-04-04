import { NextResponse } from "next/server";

const GEO_URL = "https://nominatim.openstreetmap.org/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

const WEATHER_PARAMS = {
  hourly: "temperature_2m,precipitation_probability",
  daily: "temperature_2m_max,temperature_2m_min",
  current_weather: "true",
  timezone: "auto",
};

const parseNumber = (value: string | null): number | null => {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city")?.trim();
  let lat = parseNumber(searchParams.get("lat"));
  let lon = parseNumber(searchParams.get("lon"));

  try {
    if ((lat === null || lon === null) && city) {
      const geoUrl = new URL(GEO_URL);
      geoUrl.searchParams.set("q", city);
      geoUrl.searchParams.set("format", "json");
      geoUrl.searchParams.set("limit", "1");

      const geoRes = await fetch(geoUrl.toString(), {
        headers: {
          "User-Agent": "next-weather-app/1.0",
        },
        cache: "no-store",
      });

      if (!geoRes.ok) {
        return NextResponse.json(
          { error: "Unable to geocode city" },
          { status: 502 }
        );
      }

      const geoData = (await geoRes.json()) as Array<{
        lat: string;
        lon: string;
        display_name?: string;
      }>;

      if (!geoData.length) {
        return NextResponse.json({ error: "City not found" }, { status: 404 });
      }

      lat = Number(geoData[0].lat);
      lon = Number(geoData[0].lon);

      if (searchParams.get("lat") === null && searchParams.get("lon") === null) {
        return NextResponse.json({
          lat,
          lon,
          city: geoData[0].display_name ?? city,
        });
      }
    }

    if (lat === null || lon === null) {
      return NextResponse.json(
        { error: "Missing valid coordinates or city" },
        { status: 400 }
      );
    }

    const weatherUrl = new URL(WEATHER_URL);
    weatherUrl.searchParams.set("latitude", String(lat));
    weatherUrl.searchParams.set("longitude", String(lon));
    weatherUrl.searchParams.set("hourly", WEATHER_PARAMS.hourly);
    weatherUrl.searchParams.set("daily", WEATHER_PARAMS.daily);
    weatherUrl.searchParams.set("current_weather", WEATHER_PARAMS.current_weather);
    weatherUrl.searchParams.set("timezone", WEATHER_PARAMS.timezone);

    const weatherRes = await fetch(weatherUrl.toString(), { cache: "no-store" });
    if (!weatherRes.ok) {
      return NextResponse.json(
        { error: "Unable to fetch weather data" },
        { status: 502 }
      );
    }

    const weatherData = await weatherRes.json();
    return NextResponse.json({ city, ...weatherData });
  } catch {
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
