import { useState } from 'react';
import type { Dog } from '../../types';

interface Props {
  dog: Dog;
  onUpdate: (dogId: string, data: Partial<Dog>) => Promise<void>;
  mealToPoopAvg: number | null;
}

export function DogProfile({ dog, onUpdate, mealToPoopAvg }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(dog.name);
  const [breed, setBreed] = useState(dog.breed);
  const [weight, setWeight] = useState(dog.weight?.toString() || '');
  const [schedule, setSchedule] = useState(dog.feedingSchedule.join(', '));

  const ageWeeks = dog.birthDate
    ? Math.floor((Date.now() - new Date(dog.birthDate).getTime()) / (7 * 86400000))
    : null;

  const handleSave = async () => {
    await onUpdate(dog.id, {
      name: name.trim(),
      breed: breed.trim(),
      weight: weight ? parseFloat(weight) : null,
      feedingSchedule: schedule.split(',').map(s => s.trim()).filter(Boolean),
    });
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Dog Profile</h3>
        <button
          onClick={() => editing ? handleSave() : setEditing(true)}
          className="text-sm text-indigo-600 font-medium"
        >
          {editing ? 'Save' : 'Edit'}
        </button>
      </div>

      {editing ? (
        <div className="space-y-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Name"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          <input value={breed} onChange={e => setBreed(e.target.value)} placeholder="Breed"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          <input value={weight} onChange={e => setWeight(e.target.value)} placeholder="Weight (lbs)" type="number"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          <input value={schedule} onChange={e => setSchedule(e.target.value)} placeholder="Feeding times (e.g., 08:00, 17:30)"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-2xl">
              🐶
            </div>
            <div>
              <div className="font-bold text-gray-900">{dog.name}</div>
              <div className="text-xs text-gray-500">
                {dog.breed}{ageWeeks !== null && ` · ${ageWeeks} weeks old`}
                {dog.weight && ` · ${dog.weight} lbs`}
              </div>
            </div>
          </div>
          {dog.feedingSchedule.length > 0 && (
            <div className="text-xs text-gray-500">
              Feeding schedule: {dog.feedingSchedule.join(', ')}
            </div>
          )}
          {mealToPoopAvg !== null && (
            <div className="text-xs text-amber-600 font-medium">
              Avg meal-to-poop: {mealToPoopAvg} minutes
            </div>
          )}
        </div>
      )}
    </div>
  );
}
