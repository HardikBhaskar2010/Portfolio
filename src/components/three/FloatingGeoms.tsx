import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { themeColors } from '@/lib/theme';

type GeomType = 'icosahedron' | 'torusKnot' | 'octahedron';

interface Props {
  type: GeomType;
  color?: string;
  speed?: number;
  size?: number;
  reducedMotion?: boolean;
}

function FloatingMesh({ type, color = themeColors.accent, speed = 1, size = 1, reducedMotion = false }: Props) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (reducedMotion) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.3 * speed;
    ref.current.rotation.y = t * 0.5 * speed;
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
 * Drop into any bento cell: fills the container with a floating wireframe geom.
 * Pauses rendering when scrolled offscreen or when tab is hidden.
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting && !document.hidden);
      },
      { threshold: 0.05 }
    );

    observer.observe(el);

    const onVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false);
      } else if (el) {
        const rect = el.getBoundingClientRect();
        setIsVisible(rect.bottom > 0 && rect.top < window.innerHeight);
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        dpr={[1, 1.5]}
        frameloop={reducedMotion ? 'demand' : (isVisible ? 'always' : 'never')}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        <FloatingMesh
          type={type}
          color={color}
          speed={speed}
          size={size}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  );
}
