import { useState } from 'react';
import { useHousehold } from '../../hooks/useHousehold';

export function Onboarding() {
  const { createHousehold, joinHousehold, addDog } = useHousehold();
  const [step, setStep] = useState<'choice' | 'create' | 'join' | 'add-dog'>('choice');
  const [householdName, setHouseholdName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [dogName, setDogName] = useState('');
  const [dogBreed, setDogBreed] = useState('');
  const [dogBirthDate, setDogBirthDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!householdName.trim()) return;
    setLoading(true);
    await createHousehold(householdName.trim());
    setStep('add-dog');
    setLoading(false);
  };

  const handleJoin = async () => {
    if (!inviteCode.trim()) return;
    setLoading(true);
    setError('');
    const success = await joinHousehold(inviteCode.trim());
    if (!success) {
      setError('Invalid invite code. Please try again.');
    }
    setLoading(false);
  };

  const handleAddDog = async () => {
    if (!dogName.trim()) return;
    setLoading(true);
    await addDog({
      name: dogName.trim(),
      breed: dogBreed.trim(),
      birthDate: dogBirthDate,
      weight: null,
      photoUrl: null,
      feedingSchedule: ['08:00', '17:30'],
    });
    setLoading(false);
    // After adding dog, AuthGuard will see householdId and render main app
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full">
        {step === 'choice' && (
          <div className="text-center">
            <div className="text-5xl mb-4">🏠</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Set Up Your Den</h2>
            <p className="text-gray-500 mb-8">Create a household or join an existing one</p>
            <div className="space-y-3">
              <button
                onClick={() => setStep('create')}
                className="w-full bg-indigo-600 text-white rounded-xl px-6 py-3 font-medium hover:bg-indigo-700 transition-all"
              >
                Create New Household
              </button>
              <button
                onClick={() => setStep('join')}
                className="w-full bg-white border-2 border-gray-200 text-gray-700 rounded-xl px-6 py-3 font-medium hover:bg-gray-50 transition-all"
              >
                Join with Invite Code
              </button>
            </div>
          </div>
        )}

        {step === 'create' && (
          <div>
            <button onClick={() => setStep('choice')} className="text-gray-400 mb-4">&larr; Back</button>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Name Your Den</h2>
            <input
              type="text"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              placeholder='e.g., "The Xiao Den"'
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 mb-4 focus:border-indigo-500 focus:outline-none"
              autoFocus
            />
            <button
              onClick={handleCreate}
              disabled={loading || !householdName.trim()}
              className="w-full bg-indigo-600 text-white rounded-xl px-6 py-3 font-medium hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Den'}
            </button>
          </div>
        )}

        {step === 'join' && (
          <div>
            <button onClick={() => setStep('choice')} className="text-gray-400 mb-4">&larr; Back</button>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Join a Household</h2>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-character code"
              maxLength={6}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 mb-2 text-center text-2xl tracking-widest font-mono focus:border-indigo-500 focus:outline-none"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button
              onClick={handleJoin}
              disabled={loading || inviteCode.length < 6}
              className="w-full bg-indigo-600 text-white rounded-xl px-6 py-3 font-medium hover:bg-indigo-700 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Joining...' : 'Join Household'}
            </button>
          </div>
        )}

        {step === 'add-dog' && (
          <div>
            <div className="text-center mb-6">
              <div className="text-5xl mb-2">🐶</div>
              <h2 className="text-2xl font-bold text-gray-900">Add Your Puppy</h2>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                value={dogName}
                onChange={(e) => setDogName(e.target.value)}
                placeholder="Puppy's name"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:outline-none"
                autoFocus
              />
              <input
                type="text"
                value={dogBreed}
                onChange={(e) => setDogBreed(e.target.value)}
                placeholder="Breed (optional)"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:outline-none"
              />
              <div>
                <label className="text-sm text-gray-500 ml-1">Birth date (approximate is fine)</label>
                <input
                  type="date"
                  value={dogBirthDate}
                  onChange={(e) => setDogBirthDate(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={handleAddDog}
              disabled={loading || !dogName.trim()}
              className="w-full bg-indigo-600 text-white rounded-xl px-6 py-3 font-medium hover:bg-indigo-700 transition-all disabled:opacity-50 mt-6"
            >
              {loading ? 'Adding...' : 'Start Tracking!'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
