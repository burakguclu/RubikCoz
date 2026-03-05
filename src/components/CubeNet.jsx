import CubeFace from './CubeFace';

export default function CubeNet({ cubeState, onCellClick }) {
  return (
    <div className="flex flex-col items-center gap-1">
      {/* Üst sıra: Üst yüz */}
      <div className="flex justify-center">
        <CubeFace face="U" faceData={cubeState.U} onCellClick={onCellClick} highlightCenter />
      </div>

      {/* Orta sıra: Sol, Ön, Sağ, Arka */}
      <div className="flex gap-1 justify-center flex-wrap">
        <CubeFace face="L" faceData={cubeState.L} onCellClick={onCellClick} highlightCenter />
        <CubeFace face="F" faceData={cubeState.F} onCellClick={onCellClick} highlightCenter />
        <CubeFace face="R" faceData={cubeState.R} onCellClick={onCellClick} highlightCenter />
        <CubeFace face="B" faceData={cubeState.B} onCellClick={onCellClick} highlightCenter />
      </div>

      {/* Alt sıra: Alt yüz */}
      <div className="flex justify-center">
        <CubeFace face="D" faceData={cubeState.D} onCellClick={onCellClick} highlightCenter />
      </div>
    </div>
  );
}
