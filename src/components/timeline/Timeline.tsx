import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useEvents } from '../../hooks/useEvents';
import { EventCard } from './EventCard';
import { TimelineFilters } from './TimelineFilters';
import type { EventType } from '../../types';

export function Timeline() {
  const { appUser } = useAuth();
  const { events, loading } = useEvents(appUser?.householdId, 100);
  const [activeFilters, setActiveFilters] = useState<EventType[]>([]);

  const handleToggle = (type: EventType) => {
    setActiveFilters(prev => {
      if (prev.includes(type)) return prev.filter(t => t !== type);
      // Also include nap_end when nap_start is selected
      if (type === 'nap_start') return [...prev, 'nap_start', 'nap_end'];
      return [...prev, type];
    });
  };

  const filteredEvents = activeFilters.length === 0
    ? events
    : events.filter(e => activeFilters.includes(e.type));

  return (
    <div>
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-xl font-bold text-gray-900">Activity Timeline</h2>
      </div>
      <TimelineFilters activeFilters={activeFilters} onToggle={handleToggle} />
      <div className="px-4 space-y-2 pb-4">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No events to show. Start logging from the dashboard!
          </div>
        ) : (
          filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))
        )}
      </div>
    </div>
  );
}
