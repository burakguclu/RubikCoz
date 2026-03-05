import { COLORS, FACE_NAMES } from '../utils/cubeUtils';

export default function CubeFace({ face, faceData, onCellClick, highlightCenter }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs font-semibold text-white/70 mb-1">{FACE_NAMES[face]}</span>
      <div className="grid grid-cols-3 gap-1">
        {faceData.map((color, index) => (
          <button
            key={index}
            className={`face-cell ${index === 4 && highlightCenter ? 'ring-2 ring-white/50' : ''}`}
            style={{
              backgroundColor: COLORS[color] || COLORS.X,
              cursor: index === 4 ? 'default' : 'pointer',
            }}
            onClick={() => index !== 4 && onCellClick(face, index)}
            disabled={index === 4}
          />
        ))}
      </div>
    </div>
  );
}
