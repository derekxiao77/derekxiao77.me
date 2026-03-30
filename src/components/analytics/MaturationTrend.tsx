import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  weeklyAccidents: { week: string; count: number }[];
}

export function MaturationTrend({ weeklyAccidents }: Props) {
  if (weeklyAccidents.length < 2) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Progress Over Time</h3>
        <p className="text-xs text-gray-400">
          Keep logging for a few weeks to see your pup's housetraining progress.
        </p>
      </div>
    );
  }

  const data = weeklyAccidents.map(w => ({
    week: w.week.slice(5), // MM-DD
    accidents: w.count,
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-1">Accidents Over Time</h3>
      <p className="text-xs text-gray-400 mb-3">The trend you want to see: going down!</p>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 10 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} width={20} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="accidents"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 4, fill: '#ef4444' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
