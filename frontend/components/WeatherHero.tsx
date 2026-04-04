// components/WeatherHero.tsx
import { getCityContext } from "@/services/weather";

export default function WeatherHero({ data, location }: { data: any, location: string }) {
  const context = getCityContext(location);

  return (
    <div className="relative w-full h-[45vh] lg:h-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group">
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
        style={{ backgroundImage: `url(${context.imageUrl})`, backgroundColor: '#1e293b' }}
      />
      
      {/* Smart Overlay: Darkens bottom for text, keeps top clear for the landmark */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/30 to-transparent" />

      {/* Content Layer: Uses Flexbox to prevent overlapping */}
      <div className="relative z-10 h-full p-8 flex flex-col justify-between">
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter drop-shadow-lg">
            {location}
          </h2>
          <p className="text-sm font-bold text-blue-400 uppercase tracking-[0.2em] mt-2">
            {context.landmarkName}
          </p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="flex items-baseline gap-2">
            <span className="text-8xl lg:text-9xl font-black text-white tracking-tighter">
              {Math.round(data.current.temperature_2m)}°
            </span>
            <span className="text-xl font-bold text-slate-300 mb-4">C</span>
          </div>
          <p className="text-lg font-medium text-slate-300 opacity-80">
            Real-time Environmental Intelligence
          </p>
        </div>
      </div>
    </div>
  );
}