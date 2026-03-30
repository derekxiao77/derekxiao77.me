import { useAuth } from '../../hooks/useAuth';
import { useEvents } from '../../hooks/useEvents';
import { useAnalytics } from '../../hooks/useAnalytics';
import { MealToPoopChart } from './MealToPoopChart';
import { HourlyHeatmap } from './HourlyHeatmap';
import { WeeklyReport } from './WeeklyReport';
import { MaturationTrend } from './MaturationTrend';

export function Analytics() {
  const { appUser } = useAuth();
  const { events, walks } = useEvents(appUser?.householdId, 500);
  const analytics = useAnalytics(events, walks);

  return (
    <div className="space-y-4 px-4 pt-4 pb-4">
      <h2 className="text-xl font-bold text-gray-900">Insights</h2>
      <MealToPoopChart
        intervals={analytics.mealToPoopIntervals}
        average={analytics.mealToPoopAvgMinutes}
      />
      <HourlyHeatmap distribution={analytics.hourlyDistribution} />
      <WeeklyReport
        weeklyAccidents={analytics.weeklyAccidents}
        avgWalksPerDay={analytics.avgWalksPerDay}
        avgWalkDurationMinutes={analytics.avgWalkDurationMinutes}
        contributorBalance={analytics.contributorBalance}
        accidentFreeStreak={analytics.accidentFreeStreak}
      />
      <MaturationTrend weeklyAccidents={analytics.weeklyAccidents} />
    </div>
  );
}
