import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { RoundedBoxGeometry } from "three-stdlib";
import * as THREE from "three";
import { COLORS } from "../utils/cubeUtils";

extend({ RoundedBoxGeometry });

const GAP = 0.08;
const CUBIE_SIZE = 0.9;
const UNIT = CUBIE_SIZE + GAP;

// Hamle -> döndürme ekseni ve yönü
const MOVE_CONFIG = {
  U: { axis: [0, 1, 0], angle: -Math.PI / 2, filter: (_x, y) => y === 1 },
  "U'": { axis: [0, 1, 0], angle: Math.PI / 2, filter: (_x, y) => y === 1 },
  U2: { axis: [0, 1, 0], angle: -Math.PI, filter: (_x, y) => y === 1 },
  D: { axis: [0, 1, 0], angle: Math.PI / 2, filter: (_x, y) => y === -1 },
  "D'": { axis: [0, 1, 0], angle: -Math.PI / 2, filter: (_x, y) => y === -1 },
  D2: { axis: [0, 1, 0], angle: Math.PI, filter: (_x, y) => y === -1 },
  R: { axis: [1, 0, 0], angle: -Math.PI / 2, filter: (x) => x === 1 },
  "R'": { axis: [1, 0, 0], angle: Math.PI / 2, filter: (x) => x === 1 },
  R2: { axis: [1, 0, 0], angle: -Math.PI, filter: (x) => x === 1 },
  L: { axis: [1, 0, 0], angle: Math.PI / 2, filter: (x) => x === -1 },
  "L'": { axis: [1, 0, 0], angle: -Math.PI / 2, filter: (x) => x === -1 },
  L2: { axis: [1, 0, 0], angle: Math.PI, filter: (x) => x === -1 },
  F: { axis: [0, 0, 1], angle: -Math.PI / 2, filter: (_x, _y, z) => z === 1 },
  "F'": { axis: [0, 0, 1], angle: Math.PI / 2, filter: (_x, _y, z) => z === 1 },
  F2: { axis: [0, 0, 1], angle: -Math.PI, filter: (_x, _y, z) => z === 1 },
  B: { axis: [0, 0, 1], angle: Math.PI / 2, filter: (_x, _y, z) => z === -1 },
  "B'": {
    axis: [0, 0, 1],
    angle: -Math.PI / 2,
    filter: (_x, _y, z) => z === -1,
  },
  B2: { axis: [0, 0, 1], angle: Math.PI, filter: (_x, _y, z) => z === -1 },
};

function getCubieFaceColors(cubeState, x, y, z) {
  const colors = [
    "#1a1a2e",
    "#1a1a2e",
    "#1a1a2e",
    "#1a1a2e",
    "#1a1a2e",
    "#1a1a2e",
  ];
  if (x === 1) colors[0] = COLORS[cubeState.R[(1 - y) * 3 + (1 - z)]];
  if (x === -1) colors[1] = COLORS[cubeState.L[(1 - y) * 3 + (z + 1)]];
  if (y === 1) colors[2] = COLORS[cubeState.U[(1 - z) * 3 + (x + 1)]];
  if (y === -1) colors[3] = COLORS[cubeState.D[(z + 1) * 3 + (x + 1)]];
  if (z === 1) colors[4] = COLORS[cubeState.F[(1 - y) * 3 + (x + 1)]];
  if (z === -1) colors[5] = COLORS[cubeState.B[(1 - y) * 3 + (1 - x)]];
  return colors;
}

function Cubie({ position, faceColors, highlighted }) {
  const materials = useMemo(() => {
    return faceColors.map(
      (color) =>
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(color),
          roughness: 0.25,
          metalness: 0.05,
          emissive: highlighted
            ? new THREE.Color(color)
            : new THREE.Color("#000000"),
          emissiveIntensity: highlighted ? 0.15 : 0,
        }),
    );
  }, [faceColors, highlighted]);

  return (
    <mesh position={position} material={materials}>
      <roundedBoxGeometry
        args={[CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE, 4, 0.08]}
      />
    </mesh>
  );
}

// Animasyonlu yüz döndürme katmanı
function AnimatedLayer({ cubies, moveConfig, animDuration, onComplete }) {
  const groupRef = useRef();
  const progressRef = useRef(0);
  const completedRef = useRef(false);
  const axis = useMemo(
    () => new THREE.Vector3(...moveConfig.axis),
    [moveConfig],
  );

  useFrame((_, delta) => {
    if (!groupRef.current || completedRef.current) return;
    progressRef.current += delta / animDuration;

    if (progressRef.current >= 1) {
      groupRef.current.setRotationFromAxisAngle(axis, moveConfig.angle);
      completedRef.current = true;
      onComplete();
      return;
    }

    // Ease-in-out cubic
    const t = progressRef.current;
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    groupRef.current.setRotationFromAxisAngle(axis, moveConfig.angle * eased);
  });

  return (
    <group ref={groupRef}>
      {cubies.map(({ pos, colors, key }) => (
        <Cubie
          key={key}
          position={pos}
          faceColors={colors}
          highlighted={true}
        />
      ))}
    </group>
  );
}

/**
 * CubeScene: Tamamen prop-driven animasyon sistemi.
 * - cubeState: Animasyonsuz durumda gösterilecek küp state'i
 * - preAnimState: Animasyon başlangıç state'i (animasyon varsa)
 * - currentMove: Animasyon yapılacak hamle (null ise animasyon yok)
 * - Animasyon sırasında preAnimState gösterilir, katman döner,
 *   animasyon bitince onAnimComplete çağrılır ve parent cubeState'i günceller
 */
function CubeScene({
  cubeState,
  preAnimState,
  currentMove,
  animDuration,
  onAnimComplete,
  highlightFace,
}) {
  // Animasyon aktifse preAnimState kullan, değilse cubeState
  const renderState = currentMove && preAnimState ? preAnimState : cubeState;
  const animIdRef = useRef(0);
  const [localAnimId, setLocalAnimId] = useState(0);
  const isAnimating = !!(
    currentMove &&
    MOVE_CONFIG[currentMove] &&
    preAnimState
  );

  // currentMove değiştiğinde animasyon ID'sini artır (AnimatedLayer'ı yeniden oluştur)
  useEffect(() => {
    if (currentMove && MOVE_CONFIG[currentMove]) {
      animIdRef.current += 1;
      setLocalAnimId(animIdRef.current);
    }
  }, [currentMove]);

  const allCubies = useMemo(() => {
    const result = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue;
          const pos = [x * UNIT, y * UNIT, z * UNIT];
          const colors = getCubieFaceColors(renderState, x, y, z);
          result.push({ pos, colors, key: `${x}_${y}_${z}`, x, y, z });
        }
      }
    }
    return result;
  }, [renderState]);

  const moveConfig = currentMove ? MOVE_CONFIG[currentMove] : null;
  const layerCubies = [];
  const staticCubies = [];

  for (const cubie of allCubies) {
    if (
      isAnimating &&
      moveConfig &&
      moveConfig.filter(cubie.x, cubie.y, cubie.z)
    ) {
      layerCubies.push(cubie);
    } else {
      const isHighlighted =
        !isAnimating &&
        highlightFace &&
        MOVE_CONFIG[highlightFace] &&
        MOVE_CONFIG[highlightFace].filter(cubie.x, cubie.y, cubie.z);
      staticCubies.push({ ...cubie, highlighted: !!isHighlighted });
    }
  }

  return (
    <group rotation={[Math.PI / 6, -Math.PI / 4, 0]}>
      {staticCubies.map(({ pos, colors, key, highlighted }) => (
        <Cubie
          key={key}
          position={pos}
          faceColors={colors}
          highlighted={highlighted}
        />
      ))}

      {isAnimating && moveConfig && (
        <AnimatedLayer
          key={`anim-${localAnimId}`}
          cubies={layerCubies}
          moveConfig={moveConfig}
          animDuration={animDuration}
          onComplete={onAnimComplete}
        />
      )}

      {!isAnimating &&
        layerCubies.map(({ pos, colors, key }) => (
          <Cubie
            key={key}
            position={pos}
            faceColors={colors}
            highlighted={false}
          />
        ))}
    </group>
  );
}

export default function Cube3D({
  cubeState,
  preAnimState,
  currentMove,
  animDuration = 0.5,
  onAnimComplete,
  highlightFace,
}) {
  return (
    <div className="w-full h-[350px] md:h-[420px]">
      <Canvas camera={{ position: [4.5, 3.5, 4.5], fov: 42 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={0.9} />
        <directionalLight position={[-5, -3, -5]} intensity={0.3} />
        <pointLight position={[0, 5, 0]} intensity={0.3} color="#667eea" />
        <CubeScene
          cubeState={cubeState}
          preAnimState={preAnimState}
          currentMove={currentMove}
          animDuration={animDuration}
          onAnimComplete={onAnimComplete}
          highlightFace={highlightFace}
        />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={4}
          maxDistance={12}
          autoRotate={false}
          dampingFactor={0.1}
          enableDamping={true}
        />
      </Canvas>
    </div>
  );
}
