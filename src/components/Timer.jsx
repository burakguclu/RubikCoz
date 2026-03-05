import { useState, useEffect, useRef, useCallback } from "react";

export default function Timer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [times, setTimes] = useState([]);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    setTime(0);
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (time > 0) {
      setTimes((prev) => [time, ...prev].slice(0, 12));
    }
  }, [time]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTime(0);
  }, []);

  useEffect(() => {
    if (isRunning) {
      const startTime = Date.now() - time;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Space tuşu ile başlat/durdur
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        if (isRunning) {
          stop();
        } else {
          start();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRunning, start, stop]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
    }
    return `${seconds}.${centiseconds.toString().padStart(2, "0")}`;
  };

  const average =
    times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  const best = times.length > 0 ? Math.min(...times) : 0;

  return (
    <div className="glass-card p-5">
      <h3 className="text-lg font-bold mb-4 text-center">⏱ Zamanlayıcı</h3>

      {/* Timer display */}
      <div className="text-center mb-4">
        <div
          className={`text-5xl font-mono font-bold tracking-wider ${
            isRunning ? "text-green-400" : "text-white"
          }`}
        >
          {formatTime(time)}
        </div>
        <p className="text-xs text-white/40 mt-2">
          Space tuşu ile başlat/durdur
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 justify-center mb-4">
        {isRunning ? (
          <button className="btn-danger text-sm" onClick={stop}>
            ⏹ Durdur
          </button>
        ) : (
          <button className="btn-success text-sm" onClick={start}>
            ▶ Başlat
          </button>
        )}
        <button className="btn-secondary text-sm" onClick={reset}>
          🔄 Sıfırla
        </button>
        {times.length > 0 && (
          <button
            className="btn-secondary text-sm"
            onClick={() => setTimes([])}
          >
            🗑 Temizle
          </button>
        )}
      </div>

      {/* Stats */}
      {times.length > 0 && (
        <div className="border-t border-white/10 pt-3">
          <div className="flex justify-around text-sm mb-3">
            <div className="text-center">
              <div className="text-white/50">Ortalama</div>
              <div className="font-bold text-blue-400">
                {formatTime(average)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-white/50">En İyi</div>
              <div className="font-bold text-green-400">{formatTime(best)}</div>
            </div>
            <div className="text-center">
              <div className="text-white/50">Çözüm</div>
              <div className="font-bold text-purple-400">{times.length}</div>
            </div>
          </div>

          {/* Son süreleri */}
          <div className="flex flex-wrap gap-2 justify-center">
            {times.slice(0, 8).map((t, i) => (
              <span
                key={i}
                className="text-xs bg-white/10 px-2 py-1 rounded-md font-mono"
              >
                {formatTime(t)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
