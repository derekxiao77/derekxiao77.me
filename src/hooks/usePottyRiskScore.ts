import { useState, useEffect } from 'react';
import type { PottyEvent, PottyRiskScore } from '../types';
import { computePottyRiskScore } from '../utils/predictions';

export function usePottyRiskScore(
  events: PottyEvent[],
  mealToPoopAvgMinutes: number | null,
  dogAgeWeeks: number | null
): PottyRiskScore {
  const [score, setScore] = useState<PottyRiskScore>({
    level: 'low',
    score: 0,
    message: 'No data yet. Start logging to see predictions!',
    minutesSinceLastPotty: null,
    minutesSinceLastMeal: null,
    predictedMinutesToNext: null,
  });

  useEffect(() => {
    const update = () => {
      if (events.length > 0) {
        setScore(computePottyRiskScore(events, mealToPoopAvgMinutes, dogAgeWeeks));
      }
    };
    update();
    const interval = setInterval(update, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [events, mealToPoopAvgMinutes, dogAgeWeeks]);

  return score;
}
