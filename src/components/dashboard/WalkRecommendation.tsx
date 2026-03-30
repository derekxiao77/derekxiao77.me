interface Props {
  recommendation: string | null;
}

export function WalkRecommendation({ recommendation }: Props) {
  if (!recommendation) return null;

  return (
    <div className="mx-4 bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex items-start gap-3">
      <span className="text-xl">🧠</span>
      <p className="text-sm text-indigo-700 font-medium">{recommendation}</p>
    </div>
  );
}
