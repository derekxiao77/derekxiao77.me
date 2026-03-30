import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { LiveStatusBanner } from './LiveStatusBanner';
import { useEvents } from '../../hooks/useEvents';
import { useAuth } from '../../hooks/useAuth';

export function AppShell() {
  const { appUser } = useAuth();
  const { events, activeWalk } = useEvents(appUser?.householdId);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <LiveStatusBanner events={events} activeWalk={activeWalk} />
      <main className="max-w-lg mx-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
