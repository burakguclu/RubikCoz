// Rubik Küp Çözücü - Web Worker tabanlı (ana thread'i bloke etmez)
import SolverWorker from "./solverWorker.js?worker";

let worker = null;
let msgId = 0;
let initPromise = null;

function getWorker() {
  if (!worker) {
    worker = new SolverWorker();
  }
  return worker;
}

/**
 * Solver'ı arka planda başlat (sayfa açılınca çağrılabilir)
 */
export function initSolver() {
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve, reject) => {
    const w = getWorker();
    const id = ++msgId;
    const timeout = setTimeout(() => {
      reject(new Error("Çözücü başlatma zaman aşımına uğradı."));
    }, 30000);

    const handler = (e) => {
      if (e.data.id !== id) return;
      clearTimeout(timeout);
      w.removeEventListener("message", handler);
      if (e.data.type === "init-done") {
        resolve();
      } else {
        initPromise = null;
        reject(new Error(e.data.error));
      }
    };
    w.addEventListener("message", handler);
    w.postMessage({ type: "init", id });
  });

  return initPromise;
}

/**
 * Küpü çöz (Web Worker üzerinden, timeout'lu)
 * @param {string} cubeStateString - 54 karakter (URFDLB)
 * @returns {Promise<string>} Çözüm hamleleri
 */
export async function solveFromState(cubeStateString) {
  const w = getWorker();
  const id = ++msgId;

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(
        new Error(
          "Çözüm zaman aşımına uğradı. Renklerin doğru girildiğinden emin olun.",
        ),
      );
    }, 30000);

    const handler = (e) => {
      if (e.data.id !== id) return;
      clearTimeout(timeout);
      w.removeEventListener("message", handler);
      if (e.data.type === "solution") {
        resolve(e.data.solution);
      } else {
        reject(new Error(e.data.error));
      }
    };

    w.addEventListener("message", handler);
    w.postMessage({ type: "solve", facelets: cubeStateString, id });
  });
}
