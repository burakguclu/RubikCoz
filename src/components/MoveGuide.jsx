import { getMoveColor } from "../utils/cubeUtils";

// Her hamle için SVG ile görsel yön gösterici
const FACE_POSITIONS = {
  U: { cx: 100, cy: 30, label: "Üst" },
  D: { cx: 100, cy: 170, label: "Alt" },
  L: { cx: 30, cy: 100, label: "Sol" },
  R: { cx: 170, cy: 100, label: "Sağ" },
  F: { cx: 100, cy: 100, label: "Ön" },
  B: { cx: 100, cy: 100, label: "Arka" },
};

function ArrowCW({ cx, cy, color, size = 28 }) {
  // Saat yönünde dairesel ok
  const r = size;
  return (
    <g>
      <path
        d={`M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx + r} ${cy}`}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Ok ucu */}
      <polygon
        points={`${cx + r - 5},${cy - 8} ${cx + r + 5},${cy - 8} ${cx + r},${cy + 2}`}
        fill={color}
      />
    </g>
  );
}

function ArrowCCW({ cx, cy, color, size = 28 }) {
  // Saat yönünün tersine dairesel ok
  const r = size;
  return (
    <g>
      <path
        d={`M ${cx} ${cy - r} A ${r} ${r} 0 1 0 ${cx - r} ${cy}`}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Ok ucu */}
      <polygon
        points={`${cx - r - 5},${cy - 8} ${cx - r + 5},${cy - 8} ${cx - r},${cy + 2}`}
        fill={color}
      />
    </g>
  );
}

function Arrow180({ cx, cy, color, size = 28 }) {
  const r = size;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="3" strokeDasharray="6 3" />
      <text x={cx} y={cy + 5} textAnchor="middle" fill={color} fontSize="16" fontWeight="bold">
        180°
      </text>
    </g>
  );
}

// 3D küp izometrik gösterimi
function CubeIsometric({ face, modifier, color }) {
  const faceHighlight = {
    U: (
      <polygon
        points="50,20 100,45 50,70 0,45"
        fill={color}
        fillOpacity="0.4"
        stroke={color}
        strokeWidth="2"
      />
    ),
    D: (
      <polygon
        points="50,80 100,105 50,130 0,105"
        fill={color}
        fillOpacity="0.4"
        stroke={color}
        strokeWidth="2"
      />
    ),
    F: (
      <polygon
        points="0,45 50,70 50,130 0,105"
        fill={color}
        fillOpacity="0.4"
        stroke={color}
        strokeWidth="2"
      />
    ),
    R: (
      <polygon
        points="50,70 100,45 100,105 50,130"
        fill={color}
        fillOpacity="0.4"
        stroke={color}
        strokeWidth="2"
      />
    ),
    L: (
      <polygon
        points="0,45 50,70 50,130 0,105"
        fill={color}
        fillOpacity="0.4"
        stroke={color}
        strokeWidth="2"
      />
    ),
    B: (
      <polygon
        points="50,70 100,45 100,105 50,130"
        fill={color}
        fillOpacity="0.4"
        stroke={color}
        strokeWidth="2"
      />
    ),
  };

  // Ok yönünü belirle
  const arrowPositions = {
    U: { cx: 50, cy: 45 },
    D: { cx: 50, cy: 105 },
    F: { cx: 25, cy: 85 },
    R: { cx: 75, cy: 85 },
    L: { cx: 25, cy: 85 },
    B: { cx: 75, cy: 85 },
  };

  const ap = arrowPositions[face];

  return (
    <svg viewBox="-15 5 130 140" className="w-full h-full">
      {/* Küp çerçevesi */}
      {/* Üst yüz */}
      <polygon points="50,20 100,45 50,70 0,45" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      {/* Sol yüz */}
      <polygon points="0,45 50,70 50,130 0,105" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      {/* Sağ yüz */}
      <polygon points="50,70 100,45 100,105 50,130" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

      {/* Vurgulu yüz */}
      {faceHighlight[face]}

      {/* Yön oku */}
      {modifier === "'" ? (
        <ArrowCCW cx={ap.cx} cy={ap.cy} color={color} size={18} />
      ) : modifier === "2" ? (
        <Arrow180 cx={ap.cx} cy={ap.cy} color={color} size={18} />
      ) : (
        <ArrowCW cx={ap.cx} cy={ap.cy} color={color} size={18} />
      )}
    </svg>
  );
}

export default function MoveGuide({ move }) {
  if (!move) return null;

  const face = move[0];
  const modifier = move.slice(1);
  const color = getMoveColor(move);

  const directionText =
    modifier === "'" ? "Saat yönünün tersine" : modifier === "2" ? "180° döndür" : "Saat yönünde";

  const faceText = {
    U: "ÜST",
    D: "ALT",
    R: "SAĞ",
    L: "SOL",
    F: "ÖN",
    B: "ARKA",
  };

  return (
    <div className="glass-card p-4 animate-fade-in">
      <div className="flex items-center gap-4">
        {/* İzometrik küp */}
        <div className="w-24 h-24 flex-shrink-0">
          <CubeIsometric face={face} modifier={modifier} color={color} />
        </div>

        {/* Bilgi */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-3xl font-black font-mono tracking-wider"
              style={{ color }}
            >
              {move}
            </span>
          </div>
          <div className="text-sm text-white/60 mb-1">
            <span className="font-semibold text-white/80">{faceText[face]}</span> yüzü
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {modifier === "'" ? "↺" : modifier === "2" ? "🔄" : "↻"}
            </span>
            <span className="text-sm text-white/70">{directionText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
