import { useState, useMemo } from 'react';
import { WalkMap } from './WalkMap';
import { WalkTimer } from './WalkTimer';
import { WalkEventButtons } from './WalkEventButtons';
import { WalkSummary } from './WalkSummary';
import type { EventType } from '../../types';

interface WalkController {
  isWalking: boolean;
  elapsed: number;
  distance: number;
  currentPosition: { lat: number; lng: number } | null;
  route: { lat: number; lng: number }[];
  endWalk: () => Promise<void>;
  logWalkEvent: (type: EventType) => Promise<void>;
}

interface Props {
  controller: WalkController;
  dogName: string;
}

export function ActiveWalk({ controller, dogName }: Props) {
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState({ duration: 0, distance: 0, pee: 0, poop: 0 });
  const [eventPins, setEventPins] = useState<{ lat: number; lng: number; type: string }[]>([]);

  const handleLogEvent = async (type: EventType) => {
    await controller.logWalkEvent(type);
    if (controller.currentPosition) {
      setEventPins(prev => [...prev, { ...controller.currentPosition!, type }]);
    }
  };

  const handleEndWalk = async () => {
    const peeCount = eventPins.filter(p => p.type === 'pee').length;
    const poopCount = eventPins.filter(p => p.type === 'poop').length;
    setSummaryData({
      duration: controller.elapsed,
      distance: controller.distance,
      pee: peeCount,
      poop: poopCount,
    });
    await controller.endWalk();
    setShowSummary(true);
  };

  if (showSummary) {
    return (
      <WalkSummary
        duration={summaryData.duration}
        distance={summaryData.distance}
        eventCount={{ pee: summaryData.pee, poop: summaryData.poop }}
        onClose={() => setShowSummary(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col">
      <div className="bg-black/80 backdrop-blur-sm px-4 py-2 text-center text-white text-sm font-medium safe-top">
        Walking {dogName}
      </div>
      <WalkTimer elapsed={controller.elapsed} distance={controller.distance} />
      <div className="flex-1 relative">
        <WalkMap
          route={controller.route}
          eventPins={eventPins}
          currentPosition={controller.currentPosition}
        />
        <WalkEventButtons onLogEvent={handleLogEvent} onEndWalk={handleEndWalk} />
      </div>
    </div>
  );
}
