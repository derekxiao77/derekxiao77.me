import type { PottyEvent } from '../../types';
import { timeAgo } from '../../utils/time';

interface Props {
  events: PottyEvent[];
}

const typeConfig: Record<string, { icon: string; label: string; color: string }> = {
  pee: { icon: '💧', label: 'Pee', color: 'text-blue-600' },
  poop: { icon: '💩', label: 'Poop', color: 'text-amber-700' },
  feed: { icon: '🍽️', label: 'Fed', color: 'text-orange-600' },
  accident: { icon: '⚠️', label: 'Accident', color: 'text-red-600' },
  nap_start: { icon: '😴', label: 'Nap started', color: 'text-gray-500' },
  nap_end: { icon: '☀️', label: 'Woke up', color: 'text-indigo-600' },
};

export function RecentActivity({ events }: Props) {
  const recent = events.slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className="mx-4 text-center py-6 text-gray-400 text-sm">
        No activity yet. Start logging to see your pup's patterns!
      </div>
    );
  }

  return (
    <div className="mx-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Recent Activity</h3>
      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
        {recent.map((event) => {
          const config = typeConfig[event.type] || { icon: '📝', label: event.type, color: 'text-gray-600' };
          return (
            <div key={event.id} className="flex items-center gap-3 px-4 py-2.5">
              <span className="text-lg">{config.icon}</span>
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
                {event.surface && (
                  <span className="text-xs text-gray-400 ml-1">on {event.surface}</span>
                )}
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">{timeAgo(event.timestamp)}</div>
                <div className="text-xs text-gray-300">{event.userName}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
