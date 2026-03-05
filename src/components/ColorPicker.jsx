import { COLORS } from '../utils/cubeUtils';

const PALETTE = ['W', 'Y', 'R', 'O', 'B', 'G'];

export default function ColorPicker({ selectedColor, onColorSelect }) {
  return (
    <div className="flex gap-3 justify-center items-center flex-wrap">
      <span className="text-sm text-white/60 mr-1">Renk:</span>
      {PALETTE.map((color) => (
        <button
          key={color}
          className={`color-picker-btn ${selectedColor === color ? 'active' : ''}`}
          style={{ backgroundColor: COLORS[color] }}
          onClick={() => onColorSelect(color)}
          title={color}
        />
      ))}
    </div>
  );
}
