import type { Household } from '../../types';

interface Props {
  household: Household;
  members: { uid: string; displayName: string; photoUrl: string | null }[];
}

export function HouseholdManager({ household, members }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{household.name}</h3>
      <div className="space-y-2">
        {members.map((member) => (
          <div key={member.uid} className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
              {member.photoUrl ? (
                <img src={member.photoUrl} alt="" className="w-8 h-8 rounded-full" />
              ) : (
                member.displayName.charAt(0).toUpperCase()
              )}
            </div>
            <span className="text-sm text-gray-700">{member.displayName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
