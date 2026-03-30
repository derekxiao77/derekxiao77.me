import type { EventType } from '../../types';

interface Props {
  onLog: (type: EventType) => void;
  isNapping: boolean;
}

const buttons: { type: EventType; label: string; icon: string; color: string }[] = [
  { type: 'feed', label: 'Fed', icon: '🍽️', color: 'bg-orange-50 text-orange-600 border-orange-200' },
  { type: 'pee', label: 'Pee', icon: '💧', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { type: 'poop', label: 'Poop', icon: '💩', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { type: 'accident', label: 'Accident', icon: '⚠️', color: 'bg-red-50 text-red-600 border-red-200' },
];

export function QuickLogButtons({ onLog, isNapping }: Props) {
  return (
    <div className="px-4">
      <div className="grid grid-cols-4 gap-2 mb-3">
        {buttons.map((btn) => (
          <button
            key={btn.type}
            onClick={() => {
              onLog(btn.type);
              if (navigator.vibrate) navigator.vibrate(30);
            }}
            className={`flex flex-col items-center justify-center rounded-xl border-2 py-3 active:scale-95 transition-transform ${btn.color}`}
          >
            <span className="text-2xl">{btn.icon}</span>
            <span className="text-xs font-medium mt-1">{btn.label}</span>
          </button>
        ))}
      </div>
      <button
        onClick={() => {
          onLog(isNapping ? 'nap_end' : 'nap_start');
          if (navigator.vibrate) navigator.vibrate(30);
        }}
        className={`w-full flex items-center justify-center gap-2 rounded-xl border-2 py-2.5 active:scale-95 transition-transform ${
          isNapping
            ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
            : 'bg-gray-50 text-gray-500 border-gray-200'
        }`}
      >
        <span>{isNapping ? '☀️' : '😴'}</span>
        <span className="text-sm font-medium">{isNapping ? 'Woke Up' : 'Napping'}</span>
      </button>
    </div>
  );
}
