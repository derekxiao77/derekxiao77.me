export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoUrl: string | null;
  householdId: string | null;
  role: 'parent' | 'contributor';
  fcmToken: string | null;
  createdAt: number;
}

export interface Household {
  id: string;
  name: string;
  inviteCode: string;
  members: string[];
  createdBy: string;
  createdAt: number;
}

export interface Dog {
  id: string;
  name: string;
  breed: string;
  birthDate: string;
  weight: number | null;
  photoUrl: string | null;
  feedingSchedule: string[];
  createdAt: number;
}

export type EventType = 'pee' | 'poop' | 'feed' | 'accident' | 'nap_start' | 'nap_end';
export type Surface = 'grass' | 'concrete' | 'pad' | 'indoor';
export type ContextTag = 'after_nap' | 'guests_visiting' | 'new_treats' | 'thunderstorm' | 'after_play' | 'morning' | 'after_meal';

export interface PottyEvent {
  id: string;
  type: EventType;
  timestamp: number;
  userId: string;
  userName: string;
  dogId: string;
  walkId: string | null;
  location: { lat: number; lng: number } | null;
  surface: Surface | null;
  context: ContextTag[];
  notes: string | null;
  createdAt: number;
}

export interface Walk {
  id: string;
  userId: string;
  userName: string;
  dogId: string;
  startTime: number;
  endTime: number | null;
  duration: number;
  distance: number;
  route: { lat: number; lng: number }[];
  events: string[];
  status: 'active' | 'completed';
  createdAt: number;
}

export type RiskLevel = 'low' | 'medium' | 'high';

export interface PottyRiskScore {
  level: RiskLevel;
  score: number; // 0-100
  message: string;
  minutesSinceLastPotty: number | null;
  minutesSinceLastMeal: number | null;
  predictedMinutesToNext: number | null;
}

export interface AnalyticsData {
  mealToPoopAvgMinutes: number | null;
  mealToPoopIntervals: number[];
  hourlyDistribution: Record<number, { pee: number; poop: number; accident: number }>;
  weeklyAccidents: { week: string; count: number }[];
  accidentFreeStreak: number;
  avgWalksPerDay: number;
  avgWalkDurationMinutes: number;
  contributorBalance: Record<string, number>;
}
