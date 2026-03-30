import { useAuth } from '../../hooks/useAuth';
import { useHousehold } from '../../hooks/useHousehold';
import { useEvents } from '../../hooks/useEvents';
import { useAnalytics } from '../../hooks/useAnalytics';
import { DogProfile } from './DogProfile';
import { HouseholdManager } from './HouseholdManager';
import { InvitePartner } from './InvitePartner';
import { VetExport } from './VetExport';

export function Settings() {
  const { appUser, logout } = useAuth();
  const { household, dogs, members, updateDog } = useHousehold();
  const { events, walks } = useEvents(appUser?.householdId);
  const analytics = useAnalytics(events, walks);

  return (
    <div className="space-y-4 px-4 pt-4 pb-4">
      <h2 className="text-xl font-bold text-gray-900">Settings</h2>

      {dogs.map(dog => (
        <DogProfile
          key={dog.id}
          dog={dog}
          onUpdate={updateDog}
          mealToPoopAvg={analytics.mealToPoopAvgMinutes}
        />
      ))}

      {household && (
        <>
          <HouseholdManager household={household} members={members} />
          <InvitePartner inviteCode={household.inviteCode} />
        </>
      )}

      {dogs.length > 0 && (
        <VetExport events={events} dogName={dogs[0].name} />
      )}

      <div className="pt-4">
        <button
          onClick={logout}
          className="w-full bg-red-50 text-red-600 border border-red-200 rounded-xl py-3 text-sm font-medium"
        >
          Sign Out
        </button>
      </div>

      <div className="text-center text-xs text-gray-300 pt-2">
        PupTrack v0.1.0
      </div>
    </div>
  );
}
