import { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { useAnimationFrame } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Torus } from '@react-three/drei';
import { useHighlightStore } from '@/store/highlightStore';
import { playHoverTick, playSynthPulse } from '@/lib/audio';
import * as THREE from 'three';

interface CelestialOrbProps {
  activeColorHex: string;
  isHovered: boolean;
  shockwaveCount: number;
  reducedMotion: boolean;
}

function CelestialOrb({ activeColorHex, isHovered, shockwaveCount, reducedMotion }: CelestialOrbProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const nucleusRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const satelliteRef = useRef<THREE.Mesh>(null);

  // Materials refs for direct lerping
  const coreMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const nucleusMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const ring1MatRef = useRef<THREE.MeshBasicMaterial>(null);
  const ring2MatRef = useRef<THREE.MeshBasicMaterial>(null);
  const satelliteMatRef = useRef<THREE.MeshBasicMaterial>(null);

  // Shockwave burst factor (kicks up on click, decays smoothly)
  const impulseRef = useRef(1.0);
  const prevShockwaveRef = useRef(shockwaveCount);

  // Pre-allocated reusable Three.js color objects to prevent GC churn in useFrame
  const targetColor = useMemo(() => new THREE.Color(activeColorHex), [activeColorHex]);
  const whiteColor = useMemo(() => new THREE.Color('#FFFFFF'), []);
  const tempNucleusTarget = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    if (shockwaveCount !== prevShockwaveRef.current) {
      prevShockwaveRef.current = shockwaveCount;
      impulseRef.current = 1.45;
    }
  }, [shockwaveCount]);

  useFrame(({ clock }, delta) => {
    const elapsed = clock.getElapsedTime();

    // Smoothly decay impulse back to 1.0
    impulseRef.current += (1.0 - impulseRef.current) * Math.min(delta * 6, 1);

    // Lerp material colors towards target
    if (coreMatRef.current) {
      coreMatRef.current.color.lerp(targetColor, 0.08);
      coreMatRef.current.emissive.lerp(targetColor, 0.08);
      coreMatRef.current.emissiveIntensity =
        (isHovered ? 3.4 : 2.4) * impulseRef.current + Math.sin(elapsed * 4) * 0.4;
    }

    if (nucleusMatRef.current) {
      tempNucleusTarget.copy(whiteColor).lerp(targetColor, 0.4);
      nucleusMatRef.current.color.lerp(tempNucleusTarget, 0.1);
    }

    if (ring1MatRef.current) {
      ring1MatRef.current.color.lerp(targetColor, 0.08);
    }
    if (ring2MatRef.current) {
      ring2MatRef.current.color.lerp(targetColor, 0.08);
    }
    if (satelliteMatRef.current) {
      satelliteMatRef.current.color.lerp(whiteColor, 0.08);
    }

    // Rotations & Pulsing (subdued if prefers-reduced-motion)
    const baseMult = reducedMotion ? 0.3 : 1.0;
    const speedMult = (isHovered ? 2.6 : baseMult) * impulseRef.current;

    if (coreRef.current) {
      coreRef.current.rotation.x = elapsed * 0.4 * speedMult;
      coreRef.current.rotation.y = elapsed * 0.55 * speedMult;
      const pulseScale = (1 + Math.sin(elapsed * 3.5) * (reducedMotion ? 0.02 : 0.07)) * impulseRef.current;
      coreRef.current.scale.set(pulseScale, pulseScale, pulseScale);
    }

    if (nucleusRef.current) {
      const nucleusScale = (1 + Math.cos(elapsed * 5) * (reducedMotion ? 0.03 : 0.12)) * impulseRef.current;
      nucleusRef.current.scale.set(nucleusScale, nucleusScale, nucleusScale);
    }

    // Outer Gyroscopic Ring 1 (tilted on Z, rotating on X and Y)
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.9 * speedMult;
      ring1Ref.current.rotation.y += delta * 1.3 * speedMult;
    }

    // Outer Gyroscopic Ring 2 (tilted on X, rotating on Y and Z in reverse)
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 1.1 * speedMult;
      ring2Ref.current.rotation.z += delta * 0.8 * speedMult;
    }

    // Orbiting Satellite Spark
    if (satelliteRef.current) {
      const satAngle = elapsed * 2.2 * speedMult;
      const satRadius = 1.45;
      satelliteRef.current.position.set(
        Math.cos(satAngle) * satRadius,
        Math.sin(satAngle * 1.5) * 0.4,
        Math.sin(satAngle) * satRadius
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. Luminous Inner Nucleus (Low poly budget for 80px element) */}
      <Sphere ref={nucleusRef} args={[0.34, 16, 16]}>
        <meshBasicMaterial ref={nucleusMatRef} color="#FFFFFF" />
      </Sphere>

      {/* 2. Primary Glowing Core */}
      <Sphere ref={coreRef} args={[0.7, 24, 24]}>
        <meshStandardMaterial
          ref={coreMatRef}
          color={activeColorHex}
          emissive={activeColorHex}
          emissiveIntensity={2.5}
          roughness={0.2}
          metalness={0.1}
          toneMapped={false}
          wireframe={false}
        />
      </Sphere>

      {/* 3. Gyroscopic Ring 1 (tilted 42 deg, optimized 10x32 torus) */}
      <group rotation={[0, 0, Math.PI / 4.2]}>
        <Torus ref={ring1Ref} args={[1.12, 0.02, 10, 32]}>
          <meshBasicMaterial ref={ring1MatRef} color={activeColorHex} wireframe={false} />
        </Torus>
      </group>

      {/* 4. Gyroscopic Ring 2 (tilted -35 deg, optimized 10x32 torus) */}
      <group rotation={[Math.PI / -5.2, 0, 0]}>
        <Torus ref={ring2Ref} args={[1.32, 0.016, 10, 32]}>
          <meshBasicMaterial ref={ring2MatRef} color={activeColorHex} wireframe={false} />
        </Torus>
      </group>

      {/* 5. Satellite Spark */}
      <Sphere ref={satelliteRef} args={[0.07, 12, 12]}>
        <meshBasicMaterial ref={satelliteMatRef} color="#FFFFFF" />
      </Sphere>
    </group>
  );
}

export function ScrollOrb() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Active Story & Theme State
  const [activeColor, setActiveColor] = useState('#00E5FF');
  const [activeLabel, setActiveLabel] = useState('SYSTEM // ONLINE');
  const [isHovered, setIsHovered] = useState(false);
  const [shockwaveCount, setShockwaveCount] = useState(0);
  const [isNearRightEdge, setIsNearRightEdge] = useState(true);

  // Cache refs to prevent redundant React re-renders during RAF ticks
  const lastColorRef = useRef(activeColor);
  const lastLabelRef = useRef(activeLabel);
  const lastEdgeRef = useRef(isNearRightEdge);

  // Check prefers-reduced-motion
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Physics and Position tracking
  const currentPos = useRef({ x: -100, y: -100, vx: 0, vy: 0, initialized: false });
  const cachedTargetRef = useRef<{
    left: number;
    top: number;
    bottom: number;
    height: number;
    color?: string;
    label?: string;
  } | null>(null);
  const lastMeasureTimeRef = useRef(0);

  // Animation Frame Loop for Target Selection, Smooth Drift, and Physics
  useAnimationFrame((time) => {
    if (!containerRef.current) return;

    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const centerY = vh / 2;

    // Throttle DOM measurement queries to 100ms
    if (time - lastMeasureTimeRef.current > 100) {
      lastMeasureTimeRef.current = time;
      let closestDist = Infinity;
      let bestItem: {
        left: number;
        top: number;
        bottom: number;
        height: number;
        color?: string;
        label?: string;
      } | null = null;

      const latestHighlights = useHighlightStore.getState().highlights;
      const elements = Object.values(latestHighlights);

      for (let i = 0; i < elements.length; i++) {
        const item = elements[i];
        if (!item || !item.element) continue;
        const rect = item.element.getBoundingClientRect();
        
        // Distance is 0 if viewport center is inside the section boundaries
        const dist = (rect.top <= centerY && rect.bottom >= centerY)
          ? 0
          : (rect.top > centerY ? rect.top - centerY : centerY - rect.bottom);

        if (dist < closestDist && dist < vh * 0.75) {
          closestDist = dist;
          bestItem = {
            left: rect.left,
            top: rect.top,
            bottom: rect.bottom,
            height: rect.height,
            color: item.color,
            label: item.label,
          };
        }
      }
      cachedTargetRef.current = bestItem;

      // Update Active Color & Label (Overrides from hovering cards take priority)
      const overrideColor = useHighlightStore.getState().overrideColor;
      const overrideLabel = useHighlightStore.getState().overrideLabel;

      const resolvedColor = overrideColor || bestItem?.color || '#00E5FF';
      const resolvedLabel = overrideLabel || bestItem?.label || 'SYSTEM // ONLINE';

      // Only update React state if the value actually changed
      if (resolvedColor !== lastColorRef.current) {
        lastColorRef.current = resolvedColor;
        setActiveColor(resolvedColor);
      }
      if (resolvedLabel !== lastLabelRef.current) {
        lastLabelRef.current = resolvedLabel;
        setActiveLabel(resolvedLabel);
      }
    }

    // Default target: floating gracefully along the right border
    let targetX = vw - (vw < 768 ? 36 : 64);
    let targetY = centerY + (reducedMotion ? 0 : Math.sin(time / 1100) * 45);

    const targetRect = cachedTargetRef.current;
    if (targetRect) {
      // If locked onto a highlight point:
      // Clamp targetY so orb stays within viewport and section boundaries
      const clampedY = Math.max(
        Math.max(70, targetRect.top + 60),
        Math.min(vh - 70, targetRect.bottom - 60, centerY)
      );

      if (vw >= 768) {
        targetX = Math.max(36, targetRect.left - (vw < 1024 ? 40 : 64));
        targetY = clampedY;
        // Organic Lissajous orbit while locked on
        if (!reducedMotion) {
          targetX += Math.cos(time / 1200) * 14;
          targetY += Math.sin(time / 900) * 12;
        }
      } else {
        // Mobile: stay on the right edge so it never occludes text
        targetX = vw - 36;
        targetY = clampedY;
        if (!reducedMotion) {
          targetY += Math.sin(time / 1000) * 8;
        }
      }
    } else {
      // Ambient Lissajous drift when resting
      if (!reducedMotion) {
        targetX += Math.sin(time / 1700) * 10;
      }
    }

    if (!currentPos.current.initialized) {
      currentPos.current.x = targetX;
      currentPos.current.y = targetY;
      currentPos.current.initialized = true;
    }

    // Spring-like fluid velocity lerp
    const dx = targetX - currentPos.current.x;
    const dy = targetY - currentPos.current.y;
    const vx = dx * 0.042;
    const vy = dy * 0.042;

    currentPos.current.vx = vx;
    currentPos.current.vy = vy;
    currentPos.current.x += vx;
    currentPos.current.y += vy;

    // Velocity stretch / squash (disabled if reduced motion)
    const speed = Math.hypot(vx, vy);
    const stretch = reducedMotion ? 0 : Math.min(speed * 0.02, 0.16);
    const angle = Math.atan2(vy, vx);

    // Only update nearRight state if changed
    const nearRight = currentPos.current.x > vw - 220;
    if (nearRight !== lastEdgeRef.current) {
      lastEdgeRef.current = nearRight;
      setIsNearRightEdge(nearRight);
    }

    // Apply transform with sub-pixel 3D acceleration
    containerRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) translate(-50%, -50%) rotate(${angle}rad) scale(${1 + stretch}, ${1 - stretch * 0.5}) rotate(${-angle}rad)`;
  });

  const handleOrbClick = () => {
    playSynthPulse();
    setShockwaveCount((prev) => prev + 1);
  };

  const handleMouseEnter = () => {
    playHoverTick();
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-16 h-16 md:w-20 md:h-20 pointer-events-none z-[9999]"
      style={{
        willChange: 'transform',
      }}
    >
      {/* ── Ambient Radial Glow (Hardware-accelerated separate layer, avoids Canvas raster filter invalidation) ── */}
      <div
        className="absolute inset-0 rounded-full blur-xl pointer-events-none transition-colors duration-500 opacity-60"
        style={{
          backgroundColor: activeColor,
        }}
      />

      {/* ── Interactive Orb Hit Target ── */}
      <div
        onClick={handleOrbClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full relative pointer-events-auto cursor-pointer group"
        title="Neural Core: Click to ping"
      >
        {/* Shockwave visual pulse ring on click */}
        {shockwaveCount > 0 && (
          <span
            key={shockwaveCount}
            className="absolute inset-0 rounded-full animate-ping pointer-events-none opacity-60"
            style={{ backgroundColor: activeColor }}
          />
        )}

        {/* 3D WebGL Canvas with restricted DPR and high-performance settings */}
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 3.8], fov: 45 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[4, 4, 4]} intensity={1.5} color={activeColor} />
          <Suspense fallback={null}>
            <CelestialOrb
              activeColorHex={activeColor}
              isHovered={isHovered}
              shockwaveCount={shockwaveCount}
              reducedMotion={reducedMotion}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* ── Micro-HUD Telemetry Pill ── */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 select-none hidden sm:flex items-center gap-2 ${
          isNearRightEdge
            ? 'right-full mr-3.5 flex-row-reverse text-right'
            : 'left-full ml-3.5 flex-row text-left'
        }`}
      >
        {/* Blinking status beacon dot */}
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: activeColor }}
          />
          <span
            className="relative inline-flex rounded-full h-2 w-2"
            style={{ backgroundColor: activeColor }}
          />
        </span>

        {/* Glassmorphic Telemetry Badge */}
        <div
          className="px-2.5 py-1 rounded-md border backdrop-blur-md transition-all duration-200"
          style={{
            borderColor: `${activeColor}30`,
            backgroundColor: 'rgba(5, 5, 10, 0.75)',
            boxShadow: `0 4px 16px ${activeColor}15`,
          }}
        >
          <div className="font-mono text-[9px] font-semibold tracking-wider text-heading/95 uppercase whitespace-nowrap">
            {isHovered ? 'CORE // READY' : activeLabel}
          </div>
          <div className="font-mono text-[8px] tracking-tight text-muted/60 whitespace-nowrap">
            {isHovered ? 'CLICK TO PING' : 'NEURAL TELEMETRY'}
          </div>
        </div>
      </div>
    </div>
  );
}

