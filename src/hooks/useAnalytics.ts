import { useMemo } from 'react';
import type { PottyEvent, Walk, AnalyticsData } from '../types';
import { computeAnalytics } from '../utils/patterns';

export function useAnalytics(events: PottyEvent[], walks: Walk[]): AnalyticsData {
  return useMemo(() => {
    return computeAnalytics(events, walks);
  }, [events, walks]);
}
