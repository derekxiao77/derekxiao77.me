import type { EventType } from '../../types';

interface Props {
  activeFilters: EventType[];
  onToggle: (type: EventType) => void;
}

const filters: { type: EventType; label: string; icon: string }[] = [
  { type: 'pee', label: 'Pee', icon: '💧' },
  { type: 'poop', label: 'Poop', icon: '💩' },
  { type: 'feed', label: 'Meals', icon: '🍽️' },
  { type: 'accident', label: 'Accidents', icon: '⚠️' },
  { type: 'nap_start', label: 'Naps', icon: '😴' },
];

export function TimelineFilters({ activeFilters, onToggle }: Props) {
  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto">
      {filters.map((f) => {
        const isActive = activeFilters.length === 0 || activeFilters.includes(f.type);
        return (
          <button
            key={f.type}
            onClick={() => onToggle(f.type)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            <span>{f.icon}</span>
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
