import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Props {
  distribution: Record<number, { pee: number; poop: number; accident: number }>;
}

export function HourlyHeatmap({ distribution }: Props) {
  const data = Array.from({ length: 24 }, (_, hour) => ({
    hour: hour === 0 ? '12a' : hour < 12 ? `${hour}a` : hour === 12 ? '12p' : `${hour - 12}p`,
    pee: distribution[hour]?.pee || 0,
    poop: distribution[hour]?.poop || 0,
    accident: distribution[hour]?.accident || 0,
  }));

  const hasData = data.some(d => d.pee + d.poop + d.accident > 0);

  if (!hasData) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Potty Hours</h3>
        <p className="text-xs text-gray-400">
          More data needed to show peak potty hours.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Potty by Hour of Day</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="hour" tick={{ fontSize: 8 }} interval={2} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} width={20} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Bar dataKey="pee" fill="#3b82f6" stackId="a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="poop" fill="#d97706" stackId="a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="accident" fill="#ef4444" stackId="a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
