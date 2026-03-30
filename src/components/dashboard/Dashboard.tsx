import { useAuth } from '../../hooks/useAuth';
import { useHousehold } from '../../hooks/useHousehold';
import { useEvents } from '../../hooks/useEvents';
import { useActiveWalk } from '../../hooks/useActiveWalk';
import { useAnalytics } from '../../hooks/useAnalytics';
import { usePottyRiskScore } from '../../hooks/usePottyRiskScore';
import { getWalkRecommendation } from '../../utils/predictions';
import { PottyRiskGauge } from './PottyRiskGauge';
import { StartWalkButton } from './StartWalkButton';
import { QuickLogButtons } from './QuickLogButtons';
import { AccidentFreeStreak } from './AccidentFreeStreak';
import { RecentActivity } from './RecentActivity';
import { WalkRecommendation } from './WalkRecommendation';
import { ActiveWalk } from '../walk/ActiveWalk';
import type { EventType } from '../../types';

export function Dashboard() {
  const { appUser } = useAuth();
  const { dogs } = useHousehold();
  const { events, walks, activeWalk, logEvent } = useEvents(appUser?.householdId);
  const walkController = useActiveWalk(appUser?.householdId);
  const analytics = useAnalytics(events, walks);
  const dog = dogs[0]; // Primary dog

  const dogAgeWeeks = dog?.birthDate
    ? Math.floor((Date.now() - new Date(dog.birthDate).getTime()) / (7 * 86400000))
    : null;

  const risk = usePottyRiskScore(events, analytics.mealToPoopAvgMinutes, dogAgeWeeks);

  const recommendation = dog
    ? getWalkRecommendation(risk.minutesSinceLastMeal, analytics.mealToPoopAvgMinutes, risk.level, dog.name)
    : null;

  const isNapping = (() => {
    const napEvents = events.filter(e => e.type === 'nap_start' || e.type === 'nap_end');
    if (napEvents.length === 0) return false;
    return napEvents[0].type === 'nap_start';
  })();

  const handleLog = (type: EventType) => {
    if (dog) logEvent(type, dog.id);
  };

  const handleStartWalk = () => {
    if (dog) walkController.startWalk(dog.id);
  };

  // Show active walk overlay
  if (walkController.isWalking) {
    return <ActiveWalk controller={walkController} dogName={dog?.name || 'Your pup'} />;
  }

  // If someone else is walking, show their active walk notice
  if (activeWalk && activeWalk.userId !== appUser?.uid) {
    // Another household member is walking
  }

  return (
    <div className="space-y-4 pt-2 pb-4">
      <PottyRiskGauge risk={risk} />
      <WalkRecommendation recommendation={recommendation} />
      <StartWalkButton onStart={handleStartWalk} isWalking={walkController.isWalking} />
      <QuickLogButtons onLog={handleLog} isNapping={isNapping} />
      <AccidentFreeStreak days={analytics.accidentFreeStreak} />
      <RecentActivity events={events} />
    </div>
  );
}
