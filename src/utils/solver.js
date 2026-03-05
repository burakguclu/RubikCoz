// Rubik Küp Çözücü - Kociemba Algoritması Wrapper
import Cube from 'cubejs';

let initialized = false;

/**
 * cubejs kütüphanesini başlat (ilk kullanımda çağrılır)
 */
export async function initSolver() {
  if (initialized) return;

  return new Promise((resolve) => {
    Cube.initSolver();
    initialized = true;
    resolve();
  });
}

/**
 * Küpü çöz
 * @param {string} facelets - 54 karakter, cubejs formatında (URFDLB sırasıyla)
 * @returns {string} Çözüm hamleleri
 */
export function solveCube(facelets) {
  try {
    const cube = Cube.fromString(facelets);
    const solution = cube.solve();
    return solution;
  } catch (error) {
    console.error('Çözüm hatası:', error);
    throw new Error('Küp çözülemedi. Lütfen renkleri kontrol edin.');
  }
}

/**
 * Çözüm sürecini başlat
 */
export async function solveFromState(cubeStateString) {
  await initSolver();
  return solveCube(cubeStateString);
}
