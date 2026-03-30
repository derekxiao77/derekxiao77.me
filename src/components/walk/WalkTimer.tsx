import { formatDuration, formatDistance } from '../../utils/time';

interface Props {
  elapsed: number;
  distance: number;
}

export function WalkTimer({ elapsed, distance }: Props) {
  return (
    <div className="flex items-center justify-center gap-8 py-3 bg-black/60 backdrop-blur-sm">
      <div className="text-center">
        <div className="text-3xl font-mono font-bold text-white">{formatDuration(elapsed)}</div>
        <div className="text-xs text-gray-300 uppercase tracking-wide">Duration</div>
      </div>
      <div className="w-px h-10 bg-gray-500" />
      <div className="text-center">
        <div className="text-3xl font-mono font-bold text-white">{formatDistance(distance)}</div>
        <div className="text-xs text-gray-300 uppercase tracking-wide">Distance</div>
      </div>
    </div>
  );
}
