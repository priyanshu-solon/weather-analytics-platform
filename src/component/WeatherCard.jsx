export default function WeatherCard({ icon, title, value, warning }) {
  return (
    <div className="p-3 rounded-2xl border rounded-3 bg-white dark:bg-gray-800 flex flex-col items-center">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-sm font-medium">{title}</div>
      <div className="text-lg font-bold">{value}</div>
      {warning && (
        <div
          className={`mt-1 text-xs font-semibold px-2 py-1 rounded-full ${
            warning.level === "Low"
              ? "bg-green-100 text-green-700"
              : warning.level === "Moderate"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {warning.level}
        </div>
      )}
    </div>
  );
}
