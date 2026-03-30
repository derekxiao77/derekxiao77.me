import type { PottyEvent, AnalyticsData } from '../types';
import { minutesBetween, getWeekKey } from './time';

export function computeAnalytics(events: PottyEvent[], walks: { duration: number; userId: string; userName: string; startTime: number }[]): AnalyticsData {
  const feeds = events.filter(e => e.type === 'feed').sort((a, b) => a.timestamp - b.timestamp);
  const poops = events.filter(e => e.type === 'poop').sort((a, b) => a.timestamp - b.timestamp);
  const accidents = events.filter(e => e.type === 'accident');

  // Meal-to-poop intervals
  const mealToPoopIntervals: number[] = [];
  for (const feed of feeds) {
    const nextPoop = poops.find(p => p.timestamp > feed.timestamp && p.timestamp - feed.timestamp < 120 * 60000);
    if (nextPoop) {
      mealToPoopIntervals.push(minutesBetween(feed.timestamp, nextPoop.timestamp));
    }
  }
  const mealToPoopAvgMinutes = mealToPoopIntervals.length > 0
    ? Math.round(mealToPoopIntervals.reduce((a, b) => a + b, 0) / mealToPoopIntervals.length)
    : null;

  // Hourly distribution
  const hourlyDistribution: Record<number, { pee: number; poop: number; accident: number }> = {};
  for (let h = 0; h < 24; h++) {
    hourlyDistribution[h] = { pee: 0, poop: 0, accident: 0 };
  }
  for (const e of events) {
    if (e.type === 'pee' || e.type === 'poop' || e.type === 'accident') {
      const hour = new Date(e.timestamp).getHours();
      hourlyDistribution[hour][e.type]++;
    }
  }

  // Weekly accidents
  const accidentsByWeek: Record<string, number> = {};
  for (const a of accidents) {
    const week = getWeekKey(a.timestamp);
    accidentsByWeek[week] = (accidentsByWeek[week] || 0) + 1;
  }
  const weeklyAccidents = Object.entries(accidentsByWeek)
    .map(([week, count]) => ({ week, count }))
    .sort((a, b) => a.week.localeCompare(b.week));

  // Accident-free streak (days)
  const accidentFreeStreak = computeAccidentFreeStreak(accidents);

  // Walk stats
  const daysTracked = Math.max(1, Math.ceil(
    (Date.now() - Math.min(...events.map(e => e.timestamp), Date.now())) / 86400000
  ));
  const avgWalksPerDay = walks.length / daysTracked;
  const avgWalkDurationMinutes = walks.length > 0
    ? Math.round(walks.reduce((sum, w) => sum + w.duration, 0) / walks.length / 60)
    : 0;

  // Contributor balance
  const contributorBalance: Record<string, number> = {};
  for (const w of walks) {
    const name = w.userName || w.userId;
    contributorBalance[name] = (contributorBalance[name] || 0) + 1;
  }

  return {
    mealToPoopAvgMinutes,
    mealToPoopIntervals,
    hourlyDistribution,
    weeklyAccidents,
    accidentFreeStreak,
    avgWalksPerDay: Math.round(avgWalksPerDay * 10) / 10,
    avgWalkDurationMinutes,
    contributorBalance,
  };
}

export function computeAccidentFreeStreak(accidents: PottyEvent[]): number {
  if (accidents.length === 0) return 0;
  const sorted = [...accidents].sort((a, b) => b.timestamp - a.timestamp);
  const lastAccident = sorted[0].timestamp;
  return Math.floor((Date.now() - lastAccident) / 86400000);
}
