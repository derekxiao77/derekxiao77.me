interface Props {
  onStart: () => void;
  isWalking: boolean;
}

export function StartWalkButton({ onStart, isWalking }: Props) {
  if (isWalking) return null;

  return (
    <div className="flex justify-center py-4">
      <button
        onClick={onStart}
        className="relative w-28 h-28 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg shadow-green-200 active:scale-95 transition-transform"
      >
        <div className="absolute inset-1 rounded-full border-2 border-white/30 flex flex-col items-center justify-center">
          <span className="text-3xl">🚶</span>
          <span className="text-xs font-bold mt-1 tracking-wide">START WALK</span>
        </div>
      </button>
    </div>
  );
}
