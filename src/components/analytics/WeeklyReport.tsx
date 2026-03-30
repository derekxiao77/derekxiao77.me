interface Props {
  weeklyAccidents: { week: string; count: number }[];
  avgWalksPerDay: number;
  avgWalkDurationMinutes: number;
  contributorBalance: Record<string, number>;
  accidentFreeStreak: number;
}

export function WeeklyReport({ weeklyAccidents, avgWalksPerDay, avgWalkDurationMinutes, contributorBalance, accidentFreeStreak }: Props) {
  const thisWeek = weeklyAccidents.length > 0 ? weeklyAccidents[weeklyAccidents.length - 1] : null;
  const lastWeek = weeklyAccidents.length > 1 ? weeklyAccidents[weeklyAccidents.length - 2] : null;

  const totalWalks = Object.values(contributorBalance).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Weekly Summary</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-gray-800">{avgWalksPerDay}</div>
          <div className="text-xs text-gray-500">walks/day avg</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-gray-800">{avgWalkDurationMinutes}m</div>
          <div className="text-xs text-gray-500">avg walk duration</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-green-600">{accidentFreeStreak}d</div>
          <div className="text-xs text-gray-500">accident-free streak</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-red-500">{thisWeek?.count ?? 0}</div>
          <div className="text-xs text-gray-500">
            accidents this week
            {lastWeek && (
              <span className={thisWeek && thisWeek.count < lastWeek.count ? ' text-green-500' : ' text-red-400'}>
                {' '}({thisWeek && thisWeek.count < lastWeek.count ? '↓' : '↑'} from {lastWeek.count})
              </span>
            )}
          </div>
        </div>
      </div>

      {totalWalks > 0 && Object.keys(contributorBalance).length > 1 && (
        <div className="mt-3">
          <div className="text-xs text-gray-500 mb-1">Walk contributions</div>
          <div className="flex gap-1 h-3 rounded-full overflow-hidden">
            {Object.entries(contributorBalance).map(([name, count], i) => (
              <div
                key={name}
                className={`${i === 0 ? 'bg-indigo-400' : 'bg-pink-400'}`}
                style={{ width: `${(count / totalWalks) * 100}%` }}
                title={`${name}: ${count} walks`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            {Object.entries(contributorBalance).map(([name, count]) => (
              <span key={name}>{name}: {count}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
