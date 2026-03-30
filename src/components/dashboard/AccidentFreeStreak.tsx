interface Props {
  days: number;
}

export function AccidentFreeStreak({ days }: Props) {
  const getMessage = () => {
    if (days === 0) return "Let's start a new streak!";
    if (days < 3) return 'Great start! Keep it up!';
    if (days < 7) return 'Doing amazing! Patterns are forming.';
    if (days < 14) return 'Incredible progress!';
    return 'Your pup is a superstar!';
  };

  return (
    <div className="mx-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4 flex items-center gap-4">
      <div className="text-center">
        <div className="text-3xl font-bold text-green-700">{days}</div>
        <div className="text-xs text-green-600">days</div>
      </div>
      <div>
        <div className="text-sm font-semibold text-green-800">Accident-Free Streak</div>
        <div className="text-xs text-green-600">{getMessage()}</div>
      </div>
    </div>
  );
}
