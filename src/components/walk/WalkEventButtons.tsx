import type { EventType } from '../../types';

interface Props {
  onLogEvent: (type: EventType) => void;
  onEndWalk: () => void;
}

export function WalkEventButtons({ onLogEvent, onEndWalk }: Props) {
  return (
    <div className="absolute bottom-0 left-0 right-0 pb-safe">
      <div className="bg-black/60 backdrop-blur-sm px-4 py-4">
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => onLogEvent('pee')}
            className="w-20 h-20 rounded-full bg-blue-500 text-white flex flex-col items-center justify-center shadow-lg active:scale-90 transition-transform"
          >
            <span className="text-2xl">💧</span>
            <span className="text-xs font-bold">PEE</span>
          </button>
          <button
            onClick={() => onLogEvent('poop')}
            className="w-20 h-20 rounded-full bg-amber-600 text-white flex flex-col items-center justify-center shadow-lg active:scale-90 transition-transform"
          >
            <span className="text-2xl">💩</span>
            <span className="text-xs font-bold">POOP</span>
          </button>
          <button
            onClick={() => onLogEvent('accident')}
            className="w-14 h-14 rounded-full bg-red-500 text-white flex flex-col items-center justify-center shadow-lg active:scale-90 transition-transform self-center"
          >
            <span className="text-lg">⚠️</span>
          </button>
        </div>
        <button
          onClick={onEndWalk}
          className="w-full bg-white/20 text-white rounded-xl py-3 font-bold text-sm tracking-wide active:bg-white/30 transition-colors"
        >
          END WALK
        </button>
      </div>
    </div>
  );
}
