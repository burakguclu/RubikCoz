export default function ScrambleDisplay({ scramble, onNewScramble }) {
  if (!scramble || scramble.length === 0) return null;

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-white/70">🔀 Karıştırma</h3>
        <button
          className="btn-secondary text-xs px-3 py-1"
          onClick={onNewScramble}
        >
          Yeni Karıştırma
        </button>
      </div>
      <div className="text-center font-mono text-lg tracking-wider text-yellow-300">
        {scramble.join("  ")}
      </div>
    </div>
  );
}
