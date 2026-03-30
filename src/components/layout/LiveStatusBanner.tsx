import type { PottyEvent, Walk } from '../../types';
import { timeAgo, formatTime } from '../../utils/time';

interface Props {
  events: PottyEvent[];
  activeWalk: Walk | null;
}

export function LiveStatusBanner({ events, activeWalk }: Props) {
  const lastMeal = events.find(e => e.type === 'feed');
  const lastPotty = events.find(e => e.type === 'pee' || e.type === 'poop');

  return (
    <div className="bg-white border-b border-gray-100 px-4 py-2">
      <div className="flex items-center justify-between text-xs text-gray-500 max-w-lg mx-auto">
        <div className="flex items-center gap-1">
          <span>🍽️</span>
          {lastMeal ? (
            <span>Fed {timeAgo(lastMeal.timestamp)}</span>
          ) : (
            <span className="text-gray-300">No meals logged</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span>🚶</span>
          {activeWalk ? (
            <span className="text-green-600 font-medium animate-pulse">
              {activeWalk.userName} is walking now
            </span>
          ) : lastPotty ? (
            <span>Last out {timeAgo(lastPotty.timestamp)} by {lastPotty.userName}</span>
          ) : (
            <span className="text-gray-300">No walks yet</span>
          )}
        </div>
      </div>
    </div>
  );
}
