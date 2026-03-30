import type { PottyEvent, PottyRiskScore, RiskLevel } from '../types';
import { minutesBetween } from './time';

export function computePottyRiskScore(
  events: PottyEvent[],
  mealToPoopAvgMinutes: number | null,
  dogAgeWeeks: number | null
): PottyRiskScore {
  const now = Date.now();
  const pottyEvents = events.filter(e => e.type === 'pee' || e.type === 'poop');
  const feedEvents = events.filter(e => e.type === 'feed');
  const napEndEvents = events.filter(e => e.type === 'nap_end');

  const lastPotty = pottyEvents.length > 0
    ? pottyEvents.reduce((a, b) => a.timestamp > b.timestamp ? a : b)
    : null;
  const lastMeal = feedEvents.length > 0
    ? feedEvents.reduce((a, b) => a.timestamp > b.timestamp ? a : b)
    : null;
  const lastNapEnd = napEndEvents.length > 0
    ? napEndEvents.reduce((a, b) => a.timestamp > b.timestamp ? a : b)
    : null;

  const minutesSinceLastPotty = lastPotty ? minutesBetween(lastPotty.timestamp, now) : null;
  const minutesSinceLastMeal = lastMeal ? minutesBetween(lastMeal.timestamp, now) : null;

  // Max hold time based on age (rule of thumb: age in months + 1 hours, capped)
  const maxHoldMinutes = dogAgeWeeks
    ? Math.min(Math.floor(dogAgeWeeks / 4) + 1, 8) * 60
    : 120; // default 2 hours if unknown

  let score = 0; // 0 = safe, 100 = urgent

  // Factor 1: Time since last potty (biggest factor)
  if (minutesSinceLastPotty !== null) {
    const pottyRatio = minutesSinceLastPotty / maxHoldMinutes;
    score += Math.min(pottyRatio * 50, 50);
  } else {
    score += 30; // No data = moderate concern
  }

  // Factor 2: Meal-to-poop window
  if (minutesSinceLastMeal !== null && mealToPoopAvgMinutes !== null) {
    const mealWindowRatio = minutesSinceLastMeal / mealToPoopAvgMinutes;
    if (mealWindowRatio >= 0.8 && mealWindowRatio <= 1.5) {
      score += 30; // In the poop window
    } else if (mealWindowRatio > 1.5) {
      score += 10; // Past the window, may have already gone or be overdue
    }
  } else if (minutesSinceLastMeal !== null && minutesSinceLastMeal > 15 && minutesSinceLastMeal < 45) {
    score += 20; // Generic puppy poop window
  }

  // Factor 3: Just woke from nap
  if (lastNapEnd && minutesBetween(lastNapEnd.timestamp, now) < 10) {
    score += 20;
  }

  score = Math.min(Math.round(score), 100);

  let level: RiskLevel;
  let message: string;

  if (score >= 70) {
    level = 'high';
    message = 'Time to go out! Your pup likely needs a potty break.';
  } else if (score >= 40) {
    level = 'medium';
    message = 'Keep an eye out. A walk may be needed soon.';
  } else {
    level = 'low';
    message = 'Looking good! No urgent potty need right now.';
  }

  // Predicted minutes to next
  let predictedMinutesToNext: number | null = null;
  if (minutesSinceLastMeal !== null && mealToPoopAvgMinutes !== null) {
    const remaining = mealToPoopAvgMinutes - minutesSinceLastMeal;
    if (remaining > 0) predictedMinutesToNext = remaining;
  }
  if (predictedMinutesToNext === null && minutesSinceLastPotty !== null) {
    const remaining = maxHoldMinutes - minutesSinceLastPotty;
    if (remaining > 0) predictedMinutesToNext = remaining;
  }

  return {
    level,
    score,
    message,
    minutesSinceLastPotty,
    minutesSinceLastMeal,
    predictedMinutesToNext,
  };
}

export function getWalkRecommendation(
  minutesSinceLastMeal: number | null,
  mealToPoopAvgMinutes: number | null,
  riskLevel: RiskLevel,
  dogName: string
): string | null {
  if (riskLevel === 'high') {
    return `${dogName} probably needs to go out now!`;
  }
  if (minutesSinceLastMeal !== null && mealToPoopAvgMinutes !== null) {
    const remaining = mealToPoopAvgMinutes - minutesSinceLastMeal;
    if (remaining > 0 && remaining <= 15) {
      return `${dogName}'s meal-to-poop window closes in ~${remaining} min. Head out soon!`;
    }
    if (remaining > 15 && remaining <= 30) {
      return `Based on ${dogName}'s patterns, plan a walk in about ${remaining} minutes.`;
    }
  }
  return null;
}
