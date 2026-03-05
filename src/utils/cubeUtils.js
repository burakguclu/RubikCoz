// Rubik Küp yardımcı fonksiyonları

// Yüz sırası: U (Up), R (Right), F (Front), D (Down), L (Left), B (Back)
// Renk eşleşmesi: U=White, R=Red, F=Green, D=Yellow, L=Orange, B=Blue

export const FACES = ["U", "R", "F", "D", "L", "B"];

export const COLORS = {
  W: "#FFFFFF", // White
  Y: "#FFD500", // Yellow
  R: "#B71234", // Red
  O: "#FF5800", // Orange
  B: "#0046AD", // Blue
  G: "#009B48", // Green
  X: "#808080", // Gray (empty)
};

export const COLOR_NAMES = {
  W: "Beyaz",
  Y: "Sarı",
  R: "Kırmızı",
  O: "Turuncu",
  B: "Mavi",
  G: "Yeşil",
};

export const FACE_NAMES = {
  U: "Üst (U)",
  R: "Sağ (R)",
  F: "Ön (F)",
  D: "Alt (D)",
  L: "Sol (L)",
  B: "Arka (B)",
};

// Her yüzün varsayılan merkez rengi
export const FACE_CENTER_COLORS = {
  U: "W", // Üst = Beyaz
  R: "R", // Sağ = Kırmızı
  F: "G", // Ön = Yeşil
  D: "Y", // Alt = Sarı
  L: "O", // Sol = Turuncu
  B: "B", // Arka = Mavi
};

/**
 * Çözülmüş (başlangıç) küp durumu oluştur
 */
export function createSolvedCube() {
  const state = {};
  for (const face of FACES) {
    state[face] = Array(9).fill(FACE_CENTER_COLORS[face]);
  }
  return state;
}

/**
 * Boş (gri) küp durumu oluştur – merkezler sabit
 */
export function createEmptyCube() {
  const state = {};
  for (const face of FACES) {
    state[face] = Array(9).fill("X");
    state[face][4] = FACE_CENTER_COLORS[face]; // merkez sabit
  }
  return state;
}

/**
 * Küp durumunu cubejs formatına çevir
 * cubejs sırası: U R F D L B, her biri 9 facelets
 * Renk harfleri: cubejs kendi harflerini kullanır (U, R, F, D, L, B)
 */
export function cubeStateToString(cubeState) {
  const colorToFace = {};
  for (const face of FACES) {
    colorToFace[FACE_CENTER_COLORS[face]] = face;
  }

  let result = "";
  for (const face of FACES) {
    for (let i = 0; i < 9; i++) {
      const color = cubeState[face][i];
      result += colorToFace[color] || "X";
    }
  }
  return result;
}

/**
 * cubejs string'inden küp durumu oluştur
 */
export function stringToCubeState(str) {
  const faceToColor = {};
  for (const face of FACES) {
    faceToColor[face] = FACE_CENTER_COLORS[face];
  }

  const state = {};
  for (let fi = 0; fi < FACES.length; fi++) {
    const face = FACES[fi];
    state[face] = [];
    for (let i = 0; i < 9; i++) {
      const ch = str[fi * 9 + i];
      state[face].push(faceToColor[ch] || "X");
    }
  }
  return state;
}

/**
 * Bir yüzü saat yönünde döndür (sadece yüz array'i)
 */
function rotateFaceCW(arr) {
  return [
    arr[6],
    arr[3],
    arr[0],
    arr[7],
    arr[4],
    arr[1],
    arr[8],
    arr[5],
    arr[2],
  ];
}

/**
 * Bir yüzü saat yönünün tersine döndür
 */
function rotateFaceCCW(arr) {
  return [
    arr[2],
    arr[5],
    arr[8],
    arr[1],
    arr[4],
    arr[7],
    arr[0],
    arr[3],
    arr[6],
  ];
}

/**
 * Tek bir hamle uygula
 */
export function applyMove(state, move) {
  const s = JSON.parse(JSON.stringify(state));

  switch (move) {
    case "U": {
      s.U = rotateFaceCW(s.U);
      const temp = [s.F[0], s.F[1], s.F[2]];
      [s.F[0], s.F[1], s.F[2]] = [s.R[0], s.R[1], s.R[2]];
      [s.R[0], s.R[1], s.R[2]] = [s.B[0], s.B[1], s.B[2]];
      [s.B[0], s.B[1], s.B[2]] = [s.L[0], s.L[1], s.L[2]];
      [s.L[0], s.L[1], s.L[2]] = temp;
      break;
    }
    case "U'": {
      s.U = rotateFaceCCW(s.U);
      const temp = [s.F[0], s.F[1], s.F[2]];
      [s.F[0], s.F[1], s.F[2]] = [s.L[0], s.L[1], s.L[2]];
      [s.L[0], s.L[1], s.L[2]] = [s.B[0], s.B[1], s.B[2]];
      [s.B[0], s.B[1], s.B[2]] = [s.R[0], s.R[1], s.R[2]];
      [s.R[0], s.R[1], s.R[2]] = temp;
      break;
    }
    case "U2": {
      return applyMove(applyMove(s, "U"), "U");
    }
    case "D": {
      s.D = rotateFaceCW(s.D);
      const temp = [s.F[6], s.F[7], s.F[8]];
      [s.F[6], s.F[7], s.F[8]] = [s.L[6], s.L[7], s.L[8]];
      [s.L[6], s.L[7], s.L[8]] = [s.B[6], s.B[7], s.B[8]];
      [s.B[6], s.B[7], s.B[8]] = [s.R[6], s.R[7], s.R[8]];
      [s.R[6], s.R[7], s.R[8]] = temp;
      break;
    }
    case "D'": {
      s.D = rotateFaceCCW(s.D);
      const temp = [s.F[6], s.F[7], s.F[8]];
      [s.F[6], s.F[7], s.F[8]] = [s.R[6], s.R[7], s.R[8]];
      [s.R[6], s.R[7], s.R[8]] = [s.B[6], s.B[7], s.B[8]];
      [s.B[6], s.B[7], s.B[8]] = [s.L[6], s.L[7], s.L[8]];
      [s.L[6], s.L[7], s.L[8]] = temp;
      break;
    }
    case "D2": {
      return applyMove(applyMove(s, "D"), "D");
    }
    case "R": {
      s.R = rotateFaceCW(s.R);
      const temp = [s.U[2], s.U[5], s.U[8]];
      [s.U[2], s.U[5], s.U[8]] = [s.F[2], s.F[5], s.F[8]];
      [s.F[2], s.F[5], s.F[8]] = [s.D[2], s.D[5], s.D[8]];
      [s.D[2], s.D[5], s.D[8]] = [s.B[6], s.B[3], s.B[0]];
      [s.B[0], s.B[3], s.B[6]] = [temp[2], temp[1], temp[0]];
      break;
    }
    case "R'": {
      s.R = rotateFaceCCW(s.R);
      const temp = [s.U[2], s.U[5], s.U[8]];
      [s.U[2], s.U[5], s.U[8]] = [s.B[6], s.B[3], s.B[0]];
      [s.B[0], s.B[3], s.B[6]] = [s.D[8], s.D[5], s.D[2]];
      [s.D[2], s.D[5], s.D[8]] = [s.F[2], s.F[5], s.F[8]];
      [s.F[2], s.F[5], s.F[8]] = temp;
      break;
    }
    case "R2": {
      return applyMove(applyMove(s, "R"), "R");
    }
    case "L": {
      s.L = rotateFaceCW(s.L);
      const temp = [s.U[0], s.U[3], s.U[6]];
      [s.U[0], s.U[3], s.U[6]] = [s.B[8], s.B[5], s.B[2]];
      [s.B[2], s.B[5], s.B[8]] = [s.D[6], s.D[3], s.D[0]];
      [s.D[0], s.D[3], s.D[6]] = [s.F[0], s.F[3], s.F[6]];
      [s.F[0], s.F[3], s.F[6]] = temp;
      break;
    }
    case "L'": {
      s.L = rotateFaceCCW(s.L);
      const temp = [s.U[0], s.U[3], s.U[6]];
      [s.U[0], s.U[3], s.U[6]] = [s.F[0], s.F[3], s.F[6]];
      [s.F[0], s.F[3], s.F[6]] = [s.D[0], s.D[3], s.D[6]];
      [s.D[0], s.D[3], s.D[6]] = [s.B[8], s.B[5], s.B[2]];
      [s.B[2], s.B[5], s.B[8]] = [temp[2], temp[1], temp[0]];
      break;
    }
    case "L2": {
      return applyMove(applyMove(s, "L"), "L");
    }
    case "F": {
      s.F = rotateFaceCW(s.F);
      const temp = [s.U[6], s.U[7], s.U[8]];
      [s.U[6], s.U[7], s.U[8]] = [s.L[8], s.L[5], s.L[2]];
      [s.L[2], s.L[5], s.L[8]] = [s.D[0], s.D[1], s.D[2]];
      [s.D[0], s.D[1], s.D[2]] = [s.R[6], s.R[3], s.R[0]];
      [s.R[0], s.R[3], s.R[6]] = temp;
      break;
    }
    case "F'": {
      s.F = rotateFaceCCW(s.F);
      const temp = [s.U[6], s.U[7], s.U[8]];
      [s.U[6], s.U[7], s.U[8]] = [s.R[0], s.R[3], s.R[6]];
      [s.R[0], s.R[3], s.R[6]] = [s.D[2], s.D[1], s.D[0]];
      [s.D[0], s.D[1], s.D[2]] = [s.L[2], s.L[5], s.L[8]];
      [s.L[2], s.L[5], s.L[8]] = [temp[2], temp[1], temp[0]];
      break;
    }
    case "F2": {
      return applyMove(applyMove(s, "F"), "F");
    }
    case "B": {
      s.B = rotateFaceCW(s.B);
      const temp = [s.U[0], s.U[1], s.U[2]];
      [s.U[0], s.U[1], s.U[2]] = [s.R[2], s.R[5], s.R[8]];
      [s.R[2], s.R[5], s.R[8]] = [s.D[8], s.D[7], s.D[6]];
      [s.D[6], s.D[7], s.D[8]] = [s.L[0], s.L[3], s.L[6]];
      [s.L[0], s.L[3], s.L[6]] = [temp[2], temp[1], temp[0]];
      break;
    }
    case "B'": {
      s.B = rotateFaceCCW(s.B);
      const temp = [s.U[0], s.U[1], s.U[2]];
      [s.U[0], s.U[1], s.U[2]] = [s.L[6], s.L[3], s.L[0]];
      [s.L[0], s.L[3], s.L[6]] = [s.D[6], s.D[7], s.D[8]];
      [s.D[6], s.D[7], s.D[8]] = [s.R[8], s.R[5], s.R[2]];
      [s.R[2], s.R[5], s.R[8]] = temp;
      break;
    }
    case "B2": {
      return applyMove(applyMove(s, "B"), "B");
    }
    default:
      return s;
  }
  return s;
}

/**
 * Hamle listesini uygula
 */
export function applyMoves(state, moves) {
  let s = state;
  for (const move of moves) {
    s = applyMove(s, move);
  }
  return s;
}

/**
 * Hamle string'ini parse et: "R U' F2 L B'" -> ["R", "U'", "F2", "L", "B'"]
 */
export function parseMoves(moveString) {
  if (!moveString || !moveString.trim()) return [];
  return moveString.trim().split(/\s+/);
}

/**
 * Rastgele karıştırma oluştur
 */
export function generateScramble(length = 20) {
  const baseMoves = ["U", "D", "R", "L", "F", "B"];
  const modifiers = ["", "'", "2"];
  const moves = [];
  let lastFace = "";
  let secondLastFace = "";

  for (let i = 0; i < length; i++) {
    let face;
    do {
      face = baseMoves[Math.floor(Math.random() * baseMoves.length)];
    } while (
      face === lastFace ||
      (face === secondLastFace && isOppositeFace(face, lastFace))
    );

    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    moves.push(face + modifier);
    secondLastFace = lastFace;
    lastFace = face;
  }

  return moves;
}

function isOppositeFace(a, b) {
  const opposites = { U: "D", D: "U", R: "L", L: "R", F: "B", B: "F" };
  return opposites[a] === b;
}

/**
 * Küp durumunun geçerli olup olmadığını kontrol et
 */
export function validateCubeState(cubeState) {
  const colorCounts = { W: 0, Y: 0, R: 0, O: 0, B: 0, G: 0 };

  for (const face of FACES) {
    for (let i = 0; i < 9; i++) {
      const color = cubeState[face][i];
      if (color === "X") {
        return { valid: false, message: "Tüm kareler doldurulmalıdır." };
      }
      if (colorCounts[color] !== undefined) {
        colorCounts[color]++;
      }
    }
  }

  for (const [color, count] of Object.entries(colorCounts)) {
    if (count !== 9) {
      return {
        valid: false,
        message: `Her renkten tam 9 adet olmalıdır. ${COLOR_NAMES[color]}: ${count}/9`,
      };
    }
  }

  return { valid: true, message: "" };
}

/**
 * Hamlenin rengini belirle (UI'da göstermek için)
 */
export function getMoveColor(move) {
  const face = move[0];
  const faceColors = {
    U: "#FFFFFF",
    D: "#FFD500",
    R: "#B71234",
    L: "#FF5800",
    F: "#009B48",
    B: "#0046AD",
  };
  return faceColors[face] || "#888";
}

/**
 * Hamlenin açıklamasını Türkçe döndür
 */
export function getMoveDescription(move) {
  const face = move[0];
  const modifier = move.slice(1);

  const faceDescriptions = {
    U: "Üst yüz",
    D: "Alt yüz",
    R: "Sağ yüz",
    L: "Sol yüz",
    F: "Ön yüz",
    B: "Arka yüz",
  };

  let direction = "";
  if (modifier === "'") direction = "saat yönünün tersine";
  else if (modifier === "2") direction = "180°";
  else direction = "saat yönünde";

  return `${faceDescriptions[face]} ${direction}`;
}
