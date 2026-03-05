import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { COLORS } from '../utils/cubeUtils';

const GAP = 0.08;
const CUBIE_SIZE = 0.9;

// Her küçük kübün 6 yüzündeki renk indekslerini hesapla
function getCubieFaceColors(cubeState, x, y, z) {
  const colors = ['#1a1a2e', '#1a1a2e', '#1a1a2e', '#1a1a2e', '#1a1a2e', '#1a1a2e'];

  // +x = R yüzü
  if (x === 1) {
    const row = 1 - y;
    const col = 1 - z;
    const idx = row * 3 + col;
    colors[0] = COLORS[cubeState.R[idx]];
  }
  // -x = L yüzü
  if (x === -1) {
    const row = 1 - y;
    const col = z + 1;
    const idx = row * 3 + col;
    colors[1] = COLORS[cubeState.L[idx]];
  }
  // +y = U yüzü
  if (y === 1) {
    const row = 1 - z;
    const col = x + 1;
    const idx = row * 3 + col;
    colors[2] = COLORS[cubeState.U[idx]];
  }
  // -y = D yüzü
  if (y === -1) {
    const row = z + 1;
    const col = x + 1;
    const idx = row * 3 + col;
    colors[3] = COLORS[cubeState.D[idx]];
  }
  // +z = F yüzü
  if (z === 1) {
    const row = 1 - y;
    const col = x + 1;
    const idx = row * 3 + col;
    colors[4] = COLORS[cubeState.F[idx]];
  }
  // -z = B yüzü
  if (z === -1) {
    const row = 1 - y;
    const col = 1 - x;
    const idx = row * 3 + col;
    colors[5] = COLORS[cubeState.B[idx]];
  }

  return colors;
}

function Cubie({ position, faceColors }) {
  const meshRef = useRef();

  const materials = useMemo(() => {
    return faceColors.map(
      (color) =>
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(color),
          roughness: 0.3,
          metalness: 0.1,
        })
    );
  }, [faceColors]);

  return (
    <mesh ref={meshRef} position={position} material={materials}>
      <roundedBoxGeometry args={[CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE, 4, 0.08]} />
    </mesh>
  );
}

function CubeGroup({ cubeState }) {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const cubies = useMemo(() => {
    const result = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue;
          const pos = [x * (CUBIE_SIZE + GAP), y * (CUBIE_SIZE + GAP), z * (CUBIE_SIZE + GAP)];
          const colors = getCubieFaceColors(cubeState, x, y, z);
          result.push({ pos, colors, key: `${x}_${y}_${z}` });
        }
      }
    }
    return result;
  }, [cubeState]);

  return (
    <group ref={groupRef} rotation={[Math.PI / 6, -Math.PI / 4, 0]}>
      {cubies.map(({ pos, colors, key }) => (
        <Cubie key={key} position={pos} faceColors={colors} />
      ))}
    </group>
  );
}

export default function Cube3D({ cubeState }) {
  return (
    <div className="w-full h-[350px] md:h-[400px]">
      <Canvas camera={{ position: [4, 3, 4], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} />
        <CubeGroup cubeState={cubeState} />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={4}
          maxDistance={12}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
