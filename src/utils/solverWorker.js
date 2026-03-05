// Web Worker: Rubik Küp çözücü (ana thread'i bloke etmez)
import Cube from "cubejs";

let initialized = false;

self.onmessage = function (e) {
  const { type, facelets, id } = e.data;

  if (type === "init") {
    try {
      if (!initialized) {
        Cube.initSolver();
        initialized = true;
      }
      self.postMessage({ type: "init-done", id });
    } catch (err) {
      self.postMessage({ type: "error", error: "Çözücü başlatılamadı.", id });
    }
    return;
  }

  if (type === "solve") {
    try {
      if (!initialized) {
        Cube.initSolver();
        initialized = true;
      }
      const cube = Cube.fromString(facelets);
      const solution = cube.solve();
      self.postMessage({ type: "solution", solution, id });
    } catch (err) {
      self.postMessage({
        type: "error",
        error: "Küp çözülemedi. Lütfen renkleri kontrol edin.",
        id,
      });
    }
    return;
  }
};
