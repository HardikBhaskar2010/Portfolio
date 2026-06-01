import { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Config ─────────────────────────────────────────────────────────────────
const PARTICLE_COUNT      = 120;
const SPREAD              = 14;         // bounding box half-size
const CONNECTION_DISTANCE = 3.5;
const PARTICLE_COLOR      = '#00E5FF';  // cyan
const LINE_COLOR          = '#7C3AED';  // violet
const PARTICLE_SIZE       = 0.06;
const DRIFT_SPEED         = 0.0008;
const MOUSE_PARALLAX      = 0.4;
// ────────────────────────────────────────────────────────────────────────────

function Particles() {
  const meshRef  = useRef<THREE.InstancedMesh>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);
  const mouse    = useRef({ x: 0, y: 0 });

  // Stable particle positions + velocities (never re-created)
  const { positions, velocities } = useMemo(() => {
    const positions  = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3 + 0]  = (Math.random() - 0.5) * SPREAD;
      positions[i * 3 + 1]  = (Math.random() - 0.5) * SPREAD * 0.6;
      positions[i * 3 + 2]  = (Math.random() - 0.5) * SPREAD * 0.5;
      velocities[i * 3 + 0] = (Math.random() - 0.5) * DRIFT_SPEED;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * DRIFT_SPEED;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * DRIFT_SPEED * 0.5;
    }
    return { positions, velocities };
  }, []);

  // Pre-allocated geometry for line segments (max possible connections)
  const lineGeometry = useMemo(() => {
    const maxPairs = PARTICLE_COUNT * (PARTICLE_COUNT - 1) / 2;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(maxPairs * 2 * 3), 3)
    );
    return geo;
  }, []);

  const { camera } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Mousemove → subtle parallax on camera
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  }, []);

  useMemo(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useFrame(() => {
    if (!meshRef.current || !linesRef.current) return;

    // ── Drift particles ──────────────────────────────────────────────────
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3 + 0] += velocities[i * 3 + 0];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      // Bounce off bounding box
      const half = SPREAD / 2;
      if (Math.abs(positions[i * 3 + 0]) > half)       velocities[i * 3 + 0] *= -1;
      if (Math.abs(positions[i * 3 + 1]) > half * 0.6) velocities[i * 3 + 1] *= -1;
      if (Math.abs(positions[i * 3 + 2]) > half * 0.5) velocities[i * 3 + 2] *= -1;

      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;

    // ── Build connection lines ───────────────────────────────────────────
    const lp = linesRef.current.geometry.attributes.position as THREE.BufferAttribute;
    let lineIndex = 0;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx   = positions[i * 3]     - positions[j * 3];
        const dy   = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz   = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < CONNECTION_DISTANCE) {
          lp.setXYZ(lineIndex++, positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
          lp.setXYZ(lineIndex++, positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
        }
      }
    }
    // Zero out unused verts so they don't render
    for (let k = lineIndex; k < lp.count; k++) lp.setXYZ(k, 0, 0, 0);
    lp.needsUpdate = true;
    linesRef.current.geometry.setDrawRange(0, lineIndex);

    // ── Mouse camera parallax ────────────────────────────────────────────
    camera.position.x += (mouse.current.x * MOUSE_PARALLAX - camera.position.x) * 0.05;
    camera.position.y += (mouse.current.y * MOUSE_PARALLAX - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* Particles — single InstancedMesh draw call for all 120 */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
        <sphereGeometry args={[PARTICLE_SIZE, 6, 6]} />
        <meshBasicMaterial color={PARTICLE_COLOR} />
      </instancedMesh>

      {/* Connection lines */}
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial color={LINE_COLOR} transparent opacity={0.25} />
      </lineSegments>
    </>
  );
}

// ─── Public export — wrap in Canvas ─────────────────────────────────────────
export function NeuralNetworkScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      dpr={[1, 1.5]}
      frameloop="always"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
      }}
    >
      <Particles />
    </Canvas>
  );
}
