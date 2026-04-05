interface PinnedListProps {
  cities: any[];
  onSelect: (city: any) => void;
  onDelete: (id: string) => void;
}

export default function PinnedList({ cities, onSelect, onDelete }: PinnedListProps) {
  if (!cities.length) return null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
      {cities.map((city) => (
        <div key={city._id} className="group relative flex-shrink-0">
          <button
            onClick={() => onSelect(city)}
            className="bg-white/10 border border-white/10 px-6 py-2.5 rounded-full hover:bg-white/20 transition-all pr-12 text-sm backdrop-blur-md"
          >
            {city.name}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(city._id);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-red-400 p-1 transition-colors"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}