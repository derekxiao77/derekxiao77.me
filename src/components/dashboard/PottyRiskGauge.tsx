import type { PottyRiskScore } from '../../types';

interface Props {
  risk: PottyRiskScore;
}

const COLORS = {
  low: { ring: '#22c55e', bg: '#f0fdf4', text: '#15803d' },
  medium: { ring: '#f59e0b', bg: '#fffbeb', text: '#b45309' },
  high: { ring: '#ef4444', bg: '#fef2f2', text: '#b91c1c' },
};

export function PottyRiskGauge({ risk }: Props) {
  const color = COLORS[risk.level];
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (risk.score / 100) * circumference;

  return (
    <div className="flex flex-col items-center py-6">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke={color.ring}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="risk-gauge"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color: color.text }}>{risk.score}</span>
          <span className="text-xs text-gray-400 uppercase tracking-wide">{risk.level} risk</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-3 text-center px-4 max-w-xs">{risk.message}</p>
      <div className="flex gap-6 mt-3 text-xs text-gray-400">
        {risk.minutesSinceLastPotty !== null && (
          <span>Last potty: {risk.minutesSinceLastPotty}m ago</span>
        )}
        {risk.predictedMinutesToNext !== null && (
          <span>Next in ~{risk.predictedMinutesToNext}m</span>
        )}
      </div>
    </div>
  );
}
