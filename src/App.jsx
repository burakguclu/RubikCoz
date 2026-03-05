import { useState, useCallback, useEffect, useRef } from "react";
import CubeNet from "./components/CubeNet";
import Cube3D from "./components/Cube3D";
import ColorPicker from "./components/ColorPicker";
import SolutionDisplay from "./components/SolutionDisplay";
import Timer from "./components/Timer";
import ScrambleDisplay from "./components/ScrambleDisplay";
import {
  createSolvedCube,
  createEmptyCube,
  cubeStateToString,
  validateCubeState,
  applyMove,
  applyMoves,
  parseMoves,
  generateScramble,
} from "./utils/cubeUtils";
import { solveFromState } from "./utils/solver";

function App() {
  const [cubeState, setCubeState] = useState(createEmptyCube);
  const [displayState, setDisplayState] = useState(null);
  const [selectedColor, setSelectedColor] = useState("R");
  const [solution, setSolution] = useState(null);
  const [solutionMoves, setSolutionMoves] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [error, setError] = useState("");
  const [scramble, setScramble] = useState([]);
  const [activeTab, setActiveTab] = useState("solve"); // 'solve' | 'timer'
  const [solverReady, setSolverReady] = useState(false);
  const playIntervalRef = useRef(null);
  const baseCubeRef = useRef(null);

  // Küp durumunu 3D'de göster
  const currentDisplayState = displayState || cubeState;

  // Hücreye tıklandığında renk ata
  const handleCellClick = useCallback(
    (face, index) => {
      setCubeState((prev) => {
        const newState = { ...prev };
        newState[face] = [...prev[face]];
        newState[face][index] = selectedColor;
        return newState;
      });
      setError("");
      setSolution(null);
      setSolutionMoves([]);
      setCurrentStep(0);
      setDisplayState(null);
    },
    [selectedColor],
  );

  // Çöz butonu
  const handleSolve = useCallback(async () => {
    const validation = validateCubeState(cubeState);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    setError("");
    setIsSolving(true);
    setSolution(null);
    setSolutionMoves([]);
    setCurrentStep(0);
    setDisplayState(null);

    try {
      const stateStr = cubeStateToString(cubeState);
      const result = await solveFromState(stateStr);

      if (!result || result.trim() === "") {
        setSolution("Küp zaten çözülmüş!");
        setSolutionMoves([]);
      } else {
        setSolution(result);
        const moves = parseMoves(result);
        setSolutionMoves(moves);
        baseCubeRef.current = cubeState;
      }
    } catch (err) {
      setError(err.message || "Çözüm bulunamadı. Renkleri kontrol edin.");
    } finally {
      setIsSolving(false);
    }
  }, [cubeState]);

  // Adım değiştiğinde küp durumunu güncelle
  useEffect(() => {
    if (solutionMoves.length > 0 && baseCubeRef.current) {
      const movesToApply = solutionMoves.slice(0, currentStep);
      const newState = applyMoves(baseCubeRef.current, movesToApply);
      setDisplayState(newState);
    }
  }, [currentStep, solutionMoves]);

  // Otomatik oynatma
  useEffect(() => {
    if (isPlaying && currentStep < solutionMoves.length) {
      playIntervalRef.current = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 800);
    } else if (isPlaying && currentStep >= solutionMoves.length) {
      setIsPlaying(false);
    }
    return () => clearTimeout(playIntervalRef.current);
  }, [isPlaying, currentStep, solutionMoves.length]);

  const handlePlay = () => {
    if (currentStep >= solutionMoves.length) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => setIsPlaying(false);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.min(solutionMoves.length, prev + 1));
  };

  const handleStepClick = (step) => {
    setIsPlaying(false);
    setCurrentStep(step);
  };

  // Sıfırla
  const handleClear = () => {
    setCubeState(createEmptyCube());
    setDisplayState(null);
    setSolution(null);
    setSolutionMoves([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setError("");
  };

  // Çözülmüş küp
  const handleSolved = () => {
    setCubeState(createSolvedCube());
    setDisplayState(null);
    setSolution(null);
    setSolutionMoves([]);
    setCurrentStep(0);
    setError("");
  };

  // Karıştır
  const handleScramble = () => {
    const moves = generateScramble(20);
    setScramble(moves);
    const solved = createSolvedCube();
    const scrambled = applyMoves(solved, moves);
    setCubeState(scrambled);
    setDisplayState(null);
    setSolution(null);
    setSolutionMoves([]);
    setCurrentStep(0);
    setError("");
  };

  // Renk sayıları
  const getColorCounts = () => {
    const counts = { W: 0, Y: 0, R: 0, O: 0, B: 0, G: 0 };
    for (const face of Object.values(cubeState)) {
      for (const color of face) {
        if (counts[color] !== undefined) counts[color]++;
      }
    }
    return counts;
  };

  const colorCounts = getColorCounts();

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="text-center py-6 px-4">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          🧊 Rubik Küp Çözücü
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Küpünüzün renklerini girin, çözümü bulalım
        </p>
      </header>

      {/* Tab bar */}
      <div className="flex justify-center gap-2 mb-6 px-4">
        <button
          className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
            activeTab === "solve"
              ? "bg-white/20 text-white"
              : "bg-white/5 text-white/50 hover:bg-white/10"
          }`}
          onClick={() => setActiveTab("solve")}
        >
          🧩 Çözücü
        </button>
        <button
          className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
            activeTab === "timer"
              ? "bg-white/20 text-white"
              : "bg-white/5 text-white/50 hover:bg-white/10"
          }`}
          onClick={() => setActiveTab("timer")}
        >
          ⏱ Zamanlayıcı
        </button>
      </div>

      {activeTab === "solve" ? (
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sol Kolon: 2D Net + Kontroller */}
            <div className="space-y-4">
              {/* Renk Seçici */}
              <div className="glass-card p-4">
                <ColorPicker
                  selectedColor={selectedColor}
                  onColorSelect={setSelectedColor}
                />
                {/* Renk sayıları */}
                <div className="flex gap-3 justify-center mt-3 text-xs">
                  {Object.entries(colorCounts).map(([color, count]) => (
                    <span
                      key={color}
                      className={`px-2 py-1 rounded-md ${
                        count === 9
                          ? "bg-green-500/20 text-green-400"
                          : count > 9
                            ? "bg-red-500/20 text-red-400"
                            : "bg-white/10 text-white/60"
                      }`}
                    >
                      {color}: {count}/9
                    </span>
                  ))}
                </div>
              </div>

              {/* 2D Küp Net */}
              <div className="glass-card p-4">
                <CubeNet cubeState={cubeState} onCellClick={handleCellClick} />
              </div>

              {/* Butonlar */}
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  className="btn-primary"
                  onClick={handleSolve}
                  disabled={isSolving}
                >
                  {isSolving ? "🔄 Çözülüyor..." : "🧠 Çöz"}
                </button>
                <button className="btn-secondary" onClick={handleScramble}>
                  🔀 Karıştır
                </button>
                <button className="btn-secondary" onClick={handleSolved}>
                  ✅ Çözülmüş
                </button>
                <button className="btn-danger" onClick={handleClear}>
                  🗑 Temizle
                </button>
              </div>

              {/* Karıştırma gösterimi */}
              <ScrambleDisplay
                scramble={scramble}
                onNewScramble={handleScramble}
              />

              {/* Hata mesajı */}
              {error && (
                <div className="glass-card p-3 border-red-500/50 bg-red-500/10 text-red-300 text-sm text-center animate-fade-in">
                  ⚠️ {error}
                </div>
              )}
            </div>

            {/* Sağ Kolon: 3D Küp + Çözüm */}
            <div className="space-y-4">
              {/* 3D Küp */}
              <div className="glass-card p-2">
                <Cube3D cubeState={currentDisplayState} />
              </div>

              {/* Çözüm gösterimi */}
              {solution && (
                <SolutionDisplay
                  moves={solutionMoves}
                  currentStep={currentStep}
                  onStepClick={handleStepClick}
                  isPlaying={isPlaying}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onReset={handleReset}
                  onPrev={handlePrev}
                  onNext={handleNext}
                />
              )}

              {/* Çözüm mesajı (zaten çözülmüş) */}
              {solution && solutionMoves.length === 0 && (
                <div className="glass-card p-4 text-center text-green-400 animate-fade-in">
                  ✅ {solution}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-lg mx-auto px-4 space-y-4">
          {/* Karıştırma + Timer */}
          <ScrambleDisplay scramble={scramble} onNewScramble={handleScramble} />
          {scramble.length === 0 && (
            <div className="text-center">
              <button className="btn-primary" onClick={handleScramble}>
                🔀 Karıştırma Oluştur
              </button>
            </div>
          )}
          <Timer />
        </div>
      )}

      {/* Footer */}
      <footer className="text-center mt-8 text-white/30 text-xs">
        <p>
          Rubik Küp Çözücü © 2026 — Kociemba Algoritması ile güçlendirilmiştir
        </p>
      </footer>
    </div>
  );
}

export default App;
