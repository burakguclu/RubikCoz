import { getMoveColor, getMoveDescription } from "../utils/cubeUtils";

export default function SolutionDisplay({
  moves,
  currentStep,
  onStepClick,
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onPrev,
  onNext,
}) {
  if (!moves || moves.length === 0) return null;

  return (
    <div className="glass-card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">🧩 Çözüm ({moves.length} hamle)</h3>
        <span className="text-sm text-white/60">
          Adım: {currentStep}/{moves.length}
        </span>
      </div>

      {/* Kontrol butonları */}
      <div className="flex gap-2 justify-center mb-4">
        <button
          className="btn-secondary text-sm px-3 py-2"
          onClick={onReset}
          title="Başa dön"
        >
          ⏮
        </button>
        <button
          className="btn-secondary text-sm px-3 py-2"
          onClick={onPrev}
          title="Önceki"
        >
          ◀
        </button>
        {isPlaying ? (
          <button
            className="btn-danger text-sm px-4 py-2"
            onClick={onPause}
            title="Duraklat"
          >
            ⏸ Duraklat
          </button>
        ) : (
          <button
            className="btn-success text-sm px-4 py-2"
            onClick={onPlay}
            title="Oynat"
          >
            ▶ Oynat
          </button>
        )}
        <button
          className="btn-secondary text-sm px-3 py-2"
          onClick={onNext}
          title="Sonraki"
        >
          ▶
        </button>
        <button
          className="btn-secondary text-sm px-3 py-2"
          onClick={() => onStepClick(moves.length)}
          title="Sona git"
        >
          ⏭
        </button>
      </div>

      {/* Mevcut hamle açıklaması */}
      {currentStep > 0 && currentStep <= moves.length && (
        <div className="text-center mb-3 text-sm text-white/70">
          <span className="font-semibold text-white">
            {moves[currentStep - 1]}
          </span>
          {" — "}
          {getMoveDescription(moves[currentStep - 1])}
        </div>
      )}

      {/* Hamle badge'leri */}
      <div className="flex flex-wrap gap-2 justify-center">
        {moves.map((move, index) => {
          const isActive = index === currentStep - 1;
          const isDone = index < currentStep;
          return (
            <button
              key={index}
              className={`move-badge cursor-pointer ${isActive ? "active ring-2 ring-white" : ""}`}
              style={{
                backgroundColor: isDone
                  ? getMoveColor(move)
                  : isActive
                    ? getMoveColor(move)
                    : "rgba(255,255,255,0.1)",
                color: isDone || isActive ? "#fff" : "rgba(255,255,255,0.5)",
                opacity: isDone && !isActive ? 0.6 : 1,
              }}
              onClick={() => onStepClick(index + 1)}
              title={getMoveDescription(move)}
            >
              {move}
            </button>
          );
        })}
      </div>
    </div>
  );
}
