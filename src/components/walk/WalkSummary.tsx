import { formatDuration, formatDistance } from '../../utils/time';

interface Props {
  duration: number;
  distance: number;
  eventCount: { pee: number; poop: number };
  onClose: () => void;
}

export function WalkSummary({ duration, distance, eventCount, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center">
        <div className="text-5xl mb-3">🎉</div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Walk Complete!</h2>
        <p className="text-sm text-gray-500 mb-6">Great job getting your pup outside.</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="text-2xl font-bold text-gray-800">{formatDuration(duration)}</div>
            <div className="text-xs text-gray-500">Duration</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="text-2xl font-bold text-gray-800">{formatDistance(distance)}</div>
            <div className="text-xs text-gray-500">Distance</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3">
            <div className="text-2xl font-bold text-blue-600">{eventCount.pee}</div>
            <div className="text-xs text-blue-500">Pees</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-3">
            <div className="text-2xl font-bold text-amber-700">{eventCount.poop}</div>
            <div className="text-xs text-amber-600">Poops</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-indigo-600 text-white rounded-xl py-3 font-medium hover:bg-indigo-700 transition-all"
        >
          Done
        </button>
      </div>
    </div>
  );
}
