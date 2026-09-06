import { useRef, Suspense } from 'react';
import { useAnimationFrame } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { useHighlightStore } from '@/store/highlightStore';
import * as THREE from 'three';

function GlowingSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.5;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
      // Subtle pulsing scale
      const scale = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.08;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 16, 16]}>
      <meshStandardMaterial 
        color="#00E5FF" 
        emissive="#00E5FF" 
        emissiveIntensity={2.5} 
        toneMapped={false}
      />
    </Sphere>
  );
}

export function ScrollOrb() {
  const containerRef = useRef<HTMLDivElement>(null);
  const highlights = useHighlightStore((state) => state.highlights);

  // Track position (starts off-screen to prevent flash before first frame)
  const currentPos = useRef({ x: -100, y: -100, initialized: false });
  const cachedTargetRef = useRef<{ left: number; top: number; height: number } | null>(null);
  const lastMeasureTimeRef = useRef(0);

  useAnimationFrame((time) => {
    if (!containerRef.current) return;

    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const centerY = vh / 2;

    // Only query DOM layout measurements once every 120ms to prevent layout thrashing
    if (time - lastMeasureTimeRef.current > 120) {
      lastMeasureTimeRef.current = time;
      let closestDist = Infinity;
      let bestRect: { left: number; top: number; height: number } | null = null;

      const latestHighlights = useHighlightStore.getState().highlights;
      const elements = Object.values(latestHighlights);
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const elCenterY = rect.top + rect.height / 2;
        const dist = Math.abs(elCenterY - centerY);

        if (dist < closestDist && dist < vh * 0.6) {
          closestDist = dist;
          bestRect = { left: rect.left, top: rect.top, height: rect.height };
        }
      }
      cachedTargetRef.current = bestRect;
    }

    // Default target: floating near the right edge
    let targetX = vw - (vw < 768 ? 40 : 80);
    let targetY = centerY + Math.sin(time / 1000) * 60;
    
    const targetRect = cachedTargetRef.current;
    if (targetRect) {
      // Hover dynamically to the left of the target element on desktop
      // On mobile, keep it on the right edge so it doesn't overlap left-aligned text
      targetX = vw < 768 ? vw - 40 : Math.max(40, targetRect.left - 60);
      targetY = targetRect.top + targetRect.height / 2;
      
      // Spirit-like slow orbit effect when locked onto a target
      targetX += Math.cos(time / 1200) * 20;
      targetY += Math.sin(time / 1000) * 15;
    }

    if (!currentPos.current.initialized) {
      currentPos.current.x = targetX;
      currentPos.current.y = targetY;
      currentPos.current.initialized = true;
    }

    // Smooth, slow floaty lerp towards target (spirit drifting)
    currentPos.current.x += (targetX - currentPos.current.x) * 0.03;
    currentPos.current.y += (targetY - currentPos.current.y) * 0.03;

    containerRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) translate(-50%, -50%)`;
  });

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-12 h-12 md:w-16 md:h-16 pointer-events-none z-[9999]"
      // CSS drop-shadow provides a cheap and visually perfect bloom effect
      style={{ filter: 'drop-shadow(0 0 12px rgba(0,229,255,0.8))' }}
    >
      <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.5} />
        <Suspense fallback={null}>
          <GlowingSphere />
        </Suspense>
      </Canvas>
    </div>
  );
}
