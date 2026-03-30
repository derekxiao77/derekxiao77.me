import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  intervals: number[];
  average: number | null;
}

export function MealToPoopChart({ intervals, average }: Props) {
  if (intervals.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Meal-to-Poop Interval</h3>
        <p className="text-xs text-gray-400">
          Log some meals and poops to see your pup's gastrocolic reflex pattern.
        </p>
      </div>
    );
  }

  // Bucket intervals into 5-minute bins
  const buckets: Record<string, number> = {};
  for (const interval of intervals) {
    const bucket = Math.floor(interval / 5) * 5;
    const label = `${bucket}-${bucket + 5}m`;
    buckets[label] = (buckets[label] || 0) + 1;
  }
  const data = Object.entries(buckets)
    .map(([range, count]) => ({ range, count }))
    .sort((a, b) => parseInt(a.range) - parseInt(b.range));

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Meal-to-Poop Interval</h3>
        {average !== null && (
          <span className="text-2xl font-bold text-amber-600">{average}m avg</span>
        )}
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="range" tick={{ fontSize: 10 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} width={20} />
            <Tooltip />
            <Bar dataKey="count" fill="#d97706" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
