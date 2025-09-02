import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function ForecastChart({ hourly }) {
  if (!hourly || hourly.length === 0) return null;

  // hourly: array of { time, temperature, precipitation, windspeed, uv }
  return (
    <div className="card p-3 shadow-sm">
      <h6 className="mb-2">Hourly (next {hourly.length} hrs)</h6>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={hourly}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" minTickGap={20} />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Line yAxisId="left" type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#ff6b6b" strokeWidth={2} dot={{ r: 2 }} />
          <Line yAxisId="left" type="monotone" dataKey="windspeed" name="Wind (m/s)" stroke="#4d96ff" strokeWidth={2} dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="precipitation" name="Precip (mm)" stroke="#00b894" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
