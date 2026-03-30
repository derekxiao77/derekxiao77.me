import type { PottyEvent } from '../../types';
import { formatTime, formatDate, isToday } from '../../utils/time';

interface Props {
  event: PottyEvent;
}

const typeConfig: Record<string, { icon: string; label: string; bgColor: string; textColor: string }> = {
  pee: { icon: '💧', label: 'Pee', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
  poop: { icon: '💩', label: 'Poop', bgColor: 'bg-amber-50', textColor: 'text-amber-700' },
  feed: { icon: '🍽️', label: 'Meal', bgColor: 'bg-orange-50', textColor: 'text-orange-700' },
  accident: { icon: '⚠️', label: 'Accident', bgColor: 'bg-red-50', textColor: 'text-red-700' },
  nap_start: { icon: '😴', label: 'Nap started', bgColor: 'bg-gray-50', textColor: 'text-gray-600' },
  nap_end: { icon: '☀️', label: 'Woke up', bgColor: 'bg-indigo-50', textColor: 'text-indigo-600' },
};

export function EventCard({ event }: Props) {
  const config = typeConfig[event.type] || { icon: '📝', label: event.type, bgColor: 'bg-gray-50', textColor: 'text-gray-600' };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 ${config.bgColor} rounded-xl`}>
      <span className="text-2xl">{config.icon}</span>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-semibold ${config.textColor}`}>{config.label}</div>
        <div className="text-xs text-gray-400 flex items-center gap-2">
          <span>{event.userName}</span>
          {event.surface && <span>on {event.surface}</span>}
          {event.walkId && <span className="text-green-500">during walk</span>}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-sm font-medium text-gray-700">{formatTime(event.timestamp)}</div>
        {!isToday(event.timestamp) && (
          <div className="text-xs text-gray-400">{formatDate(event.timestamp)}</div>
        )}
      </div>
    </div>
  );
}
