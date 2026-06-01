import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type GeomType = 'icosahedron' | 'torusKnot' | 'octahedron';

interface Props {
  type: GeomType;
  color?: string;
  speed?: number;
  size?: number;
}

function FloatingMesh({ type, color = '#00E5FF', speed = 1, size = 1 }: Props) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.3 * speed;
    ref.current.rotation.y = t * 0.5 * speed;
    // Gentle floating up/down
    ref.current.position.y = Math.sin(t * 0.8 * speed) * 0.15;
  });

  const geometry = (() => {
    switch (type) {
      case 'icosahedron': return <icosahedronGeometry args={[size, 1]} />;
      case 'torusKnot':   return <torusKnotGeometry   args={[size * 0.6, size * 0.2, 64, 8]} />;
      case 'octahedron':  return <octahedronGeometry   args={[size]} />;
    }
  })();

  return (
    <mesh ref={ref}>
      {geometry}
      <meshBasicMaterial color={color} wireframe />
    </mesh>
  );
}

/**
 * Drop into any bento cell — fills the container with a floating wireframe geom.
 * Usage:
 *   <div style={{ height: 200 }}>
 *     <FloatingGeomCanvas type="icosahedron" color="#00E5FF" />
 *   </div>
 */
export function FloatingGeomCanvas({
  type,
  color,
  speed,
  size,
}: {
  type: GeomType;
  color?: string;
  speed?: number;
  size?: number;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      dpr={[1, 1.5]}
      frameloop="always"
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
    >
      <FloatingMesh type={type} color={color} speed={speed} size={size} />
    </Canvas>
  );
}
