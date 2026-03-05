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
  speed,
  onSpeedChange,
}) {
  if (!moves || moves.length === 0) return null;

  const progress = (currentStep / moves.length) * 100;
  const prevMove = currentStep > 1 ? moves[currentStep - 2] : null;
  const currentMove =
    currentStep > 0 && currentStep <= moves.length
      ? moves[currentStep - 1]
      : null;
  const nextMove = currentStep < moves.length ? moves[currentStep] : null;

  return (
    <div className="glass-card p-5 animate-fade-in">
      {/* Başlık + adım sayısı */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold">🧩 Çözüm Adımları</h3>
        <span className="text-sm px-3 py-1 rounded-full bg-white/10 font-mono">
          {currentStep} / {moves.length}
        </span>
      </div>

      {/* İlerleme çubuğu */}
      <div className="relative w-full h-2 bg-white/10 rounded-full mb-4 overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #667eea, #764ba2, #e53e3e)",
          }}
        />
        {/* Clickable progress bar */}
        <input
          type="range"
          min="0"
          max={moves.length}
          value={currentStep}
          onChange={(e) => onStepClick(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {/* Önceki / Mevcut / Sonraki hamle gösterimi */}
      <div className="flex items-center justify-center gap-3 mb-4">
        {/* Önceki */}
        <div className="flex flex-col items-center min-w-[60px]">
          <span className="text-[10px] text-white/40 mb-1">Önceki</span>
          {prevMove ? (
            <span
              className="text-lg font-bold font-mono px-3 py-1 rounded-lg opacity-40"
              style={{
                backgroundColor: getMoveColor(prevMove) + "33",
                color: getMoveColor(prevMove),
              }}
            >
              {prevMove}
            </span>
          ) : (
            <span className="text-lg text-white/20 px-3 py-1">—</span>
          )}
        </div>

        {/* Mevcut */}
        <div className="flex flex-col items-center min-w-[80px]">
          <span className="text-[10px] text-white/60 mb-1">Şimdi</span>
          {currentMove ? (
            <span
              className="text-2xl font-black font-mono px-4 py-2 rounded-xl shadow-lg animate-pulse-glow"
              style={{
                backgroundColor: getMoveColor(currentMove),
                color: "#fff",
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              {currentMove}
            </span>
          ) : (
            <span className="text-2xl text-white/30 px-4 py-2">
              {currentStep === 0 ? "▶" : "✓"}
            </span>
          )}
        </div>

        {/* Sonraki */}
        <div className="flex flex-col items-center min-w-[60px]">
          <span className="text-[10px] text-white/40 mb-1">Sonraki</span>
          {nextMove ? (
            <span
              className="text-lg font-bold font-mono px-3 py-1 rounded-lg opacity-40"
              style={{
                backgroundColor: getMoveColor(nextMove) + "33",
                color: getMoveColor(nextMove),
              }}
            >
              {nextMove}
            </span>
          ) : (
            <span className="text-lg text-white/20 px-3 py-1">—</span>
          )}
        </div>
      </div>

      {/* Mevcut hamle açıklaması */}
      {currentMove && (
        <div className="text-center mb-4 py-2 px-4 bg-white/5 rounded-xl">
          <span className="text-sm text-white/70">
            {getMoveDescription(currentMove)}
          </span>
        </div>
      )}

      {/* Kontrol butonları */}
      <div className="flex gap-2 justify-center items-center mb-4">
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
          title="Önceki adım"
        >
          ⏪
        </button>
        {isPlaying ? (
          <button
            className="btn-danger text-sm px-5 py-2 text-base"
            onClick={onPause}
            title="Duraklat"
          >
            ⏸
          </button>
        ) : (
          <button
            className="btn-success text-sm px-5 py-2 text-base"
            onClick={onPlay}
            title="Oynat"
          >
            ▶
          </button>
        )}
        <button
          className="btn-secondary text-sm px-3 py-2"
          onClick={onNext}
          title="Sonraki adım"
        >
          ⏩
        </button>
        <button
          className="btn-secondary text-sm px-3 py-2"
          onClick={() => onStepClick(moves.length)}
          title="Sona git"
        >
          ⏭
        </button>
      </div>

      {/* Hız kontrolü */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <span className="text-xs text-white/40">Yavaş</span>
        <input
          type="range"
          min="0.2"
          max="3"
          step="0.1"
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="w-32 accent-purple-500"
        />
        <span className="text-xs text-white/40">Hızlı</span>
        <span className="text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded-md font-mono">
          {speed.toFixed(1)}x
        </span>
      </div>

      {/* Tüm hamle badge'leri — kompakt timeline */}
      <div className="border-t border-white/10 pt-3">
        <div className="flex flex-wrap gap-1.5 justify-center">
          {moves.map((move, index) => {
            const isActive = index === currentStep - 1;
            const isDone = index < currentStep;
            return (
              <button
                key={index}
                className={`
                  inline-flex items-center justify-center min-w-[36px] h-[30px] px-2
                  rounded-md font-bold text-xs font-mono cursor-pointer
                  transition-all duration-150
                  ${isActive ? "ring-2 ring-white scale-110 shadow-lg" : ""}
                  ${isDone && !isActive ? "opacity-50" : ""}
                `}
                style={{
                  backgroundColor:
                    isDone || isActive
                      ? getMoveColor(move)
                      : "rgba(255,255,255,0.07)",
                  color: isDone || isActive ? "#fff" : "rgba(255,255,255,0.4)",
                }}
                onClick={() => onStepClick(index + 1)}
                title={`${index + 1}. ${move} — ${getMoveDescription(move)}`}
              >
                {move}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tamamlandı mesajı */}
      {currentStep === moves.length && (
        <div className="mt-3 text-center py-2 bg-green-500/10 rounded-xl text-green-400 text-sm font-semibold animate-fade-in">
          ✅ Küp çözüldü! Tebrikler!
        </div>
      )}
    </div>
  );
}
