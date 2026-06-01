# 3D Implementation Guide — React Three Fiber

> Full code for all three 3D scenes described in `PORTFOLIO_UPGRADE_PLAN.md`.  
> Stack: React Three Fiber (R3F) + Drei + Postprocessing + Lenis integration.

---

## Table of Contents

1. [Installation & Setup](#1-installation--setup)
2. [Lenis Integration](#2-lenis-integration)
3. [Scene 1 — Neural Network Hero (Priority 1)](#3-scene-1--neural-network-hero)
4. [Scene 2 — Floating Geometric Objects (Priority 2)](#4-scene-2--floating-geometric-objects)
5. [Scene 3 — 3D Skill Orbs Marquee (Priority 3)](#5-scene-3--3d-skill-orbs-marquee)
6. [GSAP ScrollTrigger + Lenis Adapter](#6-gsap-scrolltrigger--lenis-adapter)
7. [Performance Checklist](#7-performance-checklist)
8. [WebGL Fallback Pattern](#8-webgl-fallback-pattern)

---

## 1. Installation & Setup

```bash
npm install @react-three/fiber @react-three/drei @react-three/postprocessing three gsap
npm install -D @types/three
```

### Folder structure additions

```
src/
├── components/
│   ├── three/                     ← new folder
│   │   ├── NeuralNetworkScene.tsx  ← Scene 1
│   │   ├── FloatingGeoms.tsx       ← Scene 2
│   │   ├── SkillOrbs.tsx           ← Scene 3
│   │   └── index.ts               ← barrel export
```

---

## 2. Lenis Integration

Update your existing `src/lib/lenis.ts` to export a scroll store:

```ts
// src/lib/lenis.ts
import Lenis from '@studio-freight/lenis'

export const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
})

// --- ADD THIS ---
export const scrollStore = {
  progress: 0,
  velocity: 0,
  scroll: 0,
}

lenis.on('scroll', ({ progress, velocity, scroll }) => {
  scrollStore.progress = progress
  scrollStore.velocity = velocity
  scrollStore.scroll = scroll
})
// ----------------

function raf(time: number) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

export default lenis
```

---

## 3. Scene 1 — Neural Network Hero

This is your highest-priority 3D addition. A living particle network that sits behind your hero headline.

### How it works

- Creates N particles at random positions within a bounded box
- Every frame, checks distance between all particle pairs
- Pairs within `CONNECTION_DISTANCE` get a line drawn between them
- All particles drift slowly; camera responds subtly to mouse position

### Full component code

```tsx
// src/components/three/NeuralNetworkScene.tsx
import { useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Config ───────────────────────────────────────────────
const PARTICLE_COUNT = 120
const SPREAD = 14            // how far particles spread in 3D space
const CONNECTION_DISTANCE = 3.5
const PARTICLE_COLOR = '#00E5FF'   // your cyan
const LINE_COLOR = '#7C3AED'       // your violet
const PARTICLE_SIZE = 0.06
const DRIFT_SPEED = 0.0008
const MOUSE_PARALLAX_STRENGTH = 0.4
// ──────────────────────────────────────────────────────────

function Particles() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const linesRef = useRef<THREE.LineSegments>(null!)
  const mouse = useRef({ x: 0, y: 0 })

  // Generate initial particle positions and velocities
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const velocities = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * SPREAD
      positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD * 0.6
      positions[i * 3 + 2] = (Math.random() - 0.5) * SPREAD * 0.5
      velocities[i * 3 + 0] = (Math.random() - 0.5) * DRIFT_SPEED
      velocities[i * 3 + 1] = (Math.random() - 0.5) * DRIFT_SPEED
      velocities[i * 3 + 2] = (Math.random() - 0.5) * DRIFT_SPEED * 0.5
    }
    return { positions, velocities }
  }, [])

  // Geometry for lines (max possible connections)
  const lineGeometry = useMemo(() => {
    const maxLines = PARTICLE_COUNT * (PARTICLE_COUNT - 1) / 2
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(
      new Float32Array(maxLines * 2 * 3), 3
    ))
    return geo
  }, [])

  const { camera } = useThree()

  // Track mouse
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
    mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
  }, [])

  useMemo(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame(() => {
    if (!meshRef.current || !linesRef.current) return

    // Move particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3 + 0] += velocities[i * 3 + 0]
      positions[i * 3 + 1] += velocities[i * 3 + 1]
      positions[i * 3 + 2] += velocities[i * 3 + 2]

      // Bounce off bounds
      const half = SPREAD / 2
      if (Math.abs(positions[i * 3 + 0]) > half) velocities[i * 3 + 0] *= -1
      if (Math.abs(positions[i * 3 + 1]) > half * 0.6) velocities[i * 3 + 1] *= -1
      if (Math.abs(positions[i * 3 + 2]) > half * 0.5) velocities[i * 3 + 2] *= -1

      dummy.position.set(
        positions[i * 3 + 0],
        positions[i * 3 + 1],
        positions[i * 3 + 2]
      )
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true

    // Build connections
    const linePositions = linesRef.current.geometry.attributes.position as THREE.BufferAttribute
    let lineIndex = 0
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx = positions[i * 3] - positions[j * 3]
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1]
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (dist < CONNECTION_DISTANCE) {
          linePositions.setXYZ(lineIndex++, positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
          linePositions.setXYZ(lineIndex++, positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2])
        }
      }
    }
    // Zero out unused line verts
    for (let k = lineIndex; k < linePositions.count; k++) {
      linePositions.setXYZ(k, 0, 0, 0)
    }
    linePositions.needsUpdate = true
    linesRef.current.geometry.setDrawRange(0, lineIndex)

    // Mouse camera parallax
    camera.position.x += (mouse.current.x * MOUSE_PARALLAX_STRENGTH - camera.position.x) * 0.05
    camera.position.y += (mouse.current.y * MOUSE_PARALLAX_STRENGTH - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      {/* Particles — InstancedMesh for performance */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
        <sphereGeometry args={[PARTICLE_SIZE, 6, 6]} />
        <meshBasicMaterial color={PARTICLE_COLOR} />
      </instancedMesh>

      {/* Connection lines */}
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial
          color={LINE_COLOR}
          transparent
          opacity={0.25}
        />
      </lineSegments>
    </>
  )
}

// ─── Public component — wrap in Canvas ────────────────────
export function NeuralNetworkScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      dpr={[1, 1.5]}          // cap pixel ratio for performance
      frameloop="always"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      gl={{ antialias: false, alpha: true }}
    >
      <Particles />
    </Canvas>
  )
}
```

### Usage in Hero.tsx

```tsx
// src/components/sections/Hero.tsx
import { lazy, Suspense } from 'react'

const NeuralNetworkScene = lazy(() =>
  import('../three/NeuralNetworkScene').then(m => ({ default: m.NeuralNetworkScene }))
)

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">

      {/* 3D Background — lazy loaded, zero impact on initial paint */}
      <Suspense fallback={null}>
        <NeuralNetworkScene />
      </Suspense>

      {/* Overlay to ensure text readability over the particle scene */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(to right, rgba(5,5,10,0.85) 55%, rgba(5,5,10,0.3) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Your existing hero content — raise to z-20 */}
      <div className="relative z-20 ...">
        {/* headline, subtext, CTAs, avatar card */}
      </div>

    </section>
  )
}
```

---

## 4. Scene 2 — Floating Geometric Objects

Three abstract geometries for the About/Bento section. Each floats independently.

```tsx
// src/components/three/FloatingGeoms.tsx
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshWireframe } from '@react-three/drei'
import * as THREE from 'three'

type GeomType = 'icosahedron' | 'torusKnot' | 'octahedron'

interface Props {
  type: GeomType
  color?: string
  speed?: number
  size?: number
}

function FloatingMesh({ type, color = '#00E5FF', speed = 1, size = 1 }: Props) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.rotation.x = t * 0.3 * speed
    ref.current.rotation.y = t * 0.5 * speed
    ref.current.position.y = Math.sin(t * 0.8 * speed) * 0.15  // gentle float
  })

  const geometry = (() => {
    switch (type) {
      case 'icosahedron': return <icosahedronGeometry args={[size, 1]} />
      case 'torusKnot':   return <torusKnotGeometry args={[size * 0.6, size * 0.2, 64, 8]} />
      case 'octahedron':  return <octahedronGeometry args={[size]} />
    }
  })()

  return (
    <mesh ref={ref}>
      {geometry}
      <meshBasicMaterial color={color} wireframe />
    </mesh>
  )
}

// Exported wrapper — pass type as a prop from the bento cell
export function FloatingGeomCanvas({ type, color }: { type: GeomType; color?: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      dpr={[1, 1.5]}
      frameloop="always"
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: false, alpha: true }}
    >
      <FloatingMesh type={type} color={color} />
    </Canvas>
  )
}
```

### Usage in a bento cell

```tsx
// Somewhere in AboutPreview.tsx
import { FloatingGeomCanvas } from '../three/FloatingGeoms'

// In a bento grid cell:
<div className="glass-cyan rounded-2xl p-4 relative overflow-hidden" style={{ height: 200 }}>
  <FloatingGeomCanvas type="icosahedron" color="#00E5FF" />
</div>

<div className="glass-violet rounded-2xl p-4 relative overflow-hidden" style={{ height: 200 }}>
  <FloatingGeomCanvas type="torusKnot" color="#7C3AED" />
</div>
```

---

## 5. Scene 3 — 3D Skill Orbs Marquee

Optional. Replaces the existing text marquee with floating labeled spheres.

```tsx
// src/components/three/SkillOrbs.tsx
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Sphere } from '@react-three/drei'

const SKILLS = [
  { label: 'React',          color: '#61DAFB' },
  { label: 'Three.js',       color: '#00E5FF' },
  { label: 'TypeScript',     color: '#3178C6' },
  { label: 'Framer Motion',  color: '#7C3AED' },
  { label: 'FastAPI',        color: '#009688' },
  { label: 'Supabase',       color: '#3ECF8E' },
  { label: 'GSAP',           color: '#88CE02' },
  { label: 'R3F',            color: '#00E5FF' },
]

function SkillOrb({ label, color, index }: { label: string; color: string; index: number }) {
  const groupRef = useRef<any>(null!)
  const angle = (index / SKILLS.length) * Math.PI * 2

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.3
    const r = 5.5
    groupRef.current.position.x = Math.cos(angle + t) * r
    groupRef.current.position.z = Math.sin(angle + t) * r
    groupRef.current.position.y = Math.sin((angle + t) * 1.5) * 0.4
    groupRef.current.rotation.y = -(angle + t)
  })

  return (
    <group ref={groupRef}>
      <Sphere args={[0.35, 16, 16]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
      </Sphere>
      <Text
        position={[0, 0.6, 0]}
        fontSize={0.22}
        color="#F0F0F8"
        anchorX="center"
        anchorY="bottom"
        font="/fonts/SpaceGrotesk-Medium.ttf"
      >
        {label}
      </Text>
    </group>
  )
}

export function SkillOrbsScene() {
  return (
    <Canvas
      camera={{ position: [0, 2.5, 0], fov: 75 }}
      dpr={[1, 1.5]}
      style={{ width: '100%', height: 200 }}
      gl={{ antialias: false, alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 4, 0]} intensity={1} color="#00E5FF" />
      {SKILLS.map((skill, i) => (
        <SkillOrb key={skill.label} {...skill} index={i} />
      ))}
    </Canvas>
  )
}
```

> **Note:** To use `Text` from Drei, you need a `.ttf` font file in `/public/fonts/`. Copy your Space Grotesk TTF there.

---

## 6. GSAP ScrollTrigger + Lenis Adapter

If you add GSAP, configure it to work with Lenis properly:

```ts
// src/lib/gsap.ts
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'   // GSAP Club (paid) — optional
import lenis from './lenis'

gsap.registerPlugin(ScrollTrigger)

// ─── Critical: sync GSAP ticker with Lenis RAF ────────────
// Without this, ScrollTrigger uses window.scroll which lags
// behind Lenis's virtual scroll position
lenis.on('scroll', () => ScrollTrigger.update())
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
// ─────────────────────────────────────────────────────────

export { gsap, ScrollTrigger }
```

### Example: scroll-driven camera movement in R3F

```tsx
// In your NeuralNetworkScene or a separate scene component
import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { gsap, ScrollTrigger } from '@/lib/gsap'

function ScrollCamera() {
  const { camera } = useThree()
  const containerRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      }
    })

    // Camera slowly pulls back as user scrolls
    tl.to(camera.position, { z: 14, ease: 'none' })
    tl.to(camera.rotation, { x: -0.2, ease: 'none' }, 0)

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [camera])

  return null  // renders nothing — just drives the camera
}
```

---

## 7. Performance Checklist

### R3F Canvas settings

```tsx
<Canvas
  dpr={[1, 1.5]}          // never go above 2 — [1, 2] on retina screens doubles pixel count
  frameloop="demand"      // only re-render when state changes — use for static scenes
  frameloop="always"      // use for animated scenes (particles, orbs)
  performance={{ min: 0.5 }} // automatically reduces quality if FPS drops below 30
  gl={{
    antialias: false,     // big perf win — your dark bg hides jaggies anyway
    alpha: true,          // transparent bg so your CSS bg shows through
    powerPreference: 'high-performance',
  }}
>
```

### Instanced mesh for particles

Always use `instancedMesh` for anything with 10+ identical objects. Single draw call vs N draw calls.

```tsx
// ✅ ONE draw call for 120 particles
<instancedMesh args={[undefined, undefined, 120]}>

// ❌ 120 separate draw calls — never do this
{particles.map(p => <mesh key={p.id} position={p.pos} />)}
```

### Lazy load all Canvas components

```tsx
// Every Three.js Canvas should be lazy imported
const NeuralNetworkScene = lazy(() => import('../three/NeuralNetworkScene').then(...))
const FloatingGeomCanvas = lazy(() => import('../three/FloatingGeoms').then(...))

// Wrap in Suspense — null fallback means no loading spinner (instant appearance)
<Suspense fallback={null}>
  <NeuralNetworkScene />
</Suspense>
```

### Limit draw calls

| Scene | Draw calls | Notes |
|---|---|---|
| Neural Network | 2 (particles + lines) | InstancedMesh for particles |
| Floating Geoms | 1 per cell | One mesh per bento cell |
| Skill Orbs | ~16 (8 orbs + 8 labels) | Acceptable |

Target: < 20 draw calls per scene on mobile.

### Dispose on unmount

```tsx
useEffect(() => {
  return () => {
    // Clean up geometry and material when component unmounts
    geometry.dispose()
    material.dispose()
  }
}, [])
```

---

## 8. WebGL Fallback Pattern

Some users have WebGL disabled (corporate networks, older devices). Always wrap:

```tsx
// src/components/three/WebGLGuard.tsx
import { useEffect, useState, ReactNode } from 'react'

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

export function WebGLGuard({ children, fallback = null }: Props) {
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    setSupported(isWebGLAvailable())
  }, [])

  return supported ? <>{children}</> : <>{fallback}</>
}
```

### Usage

```tsx
<WebGLGuard fallback={<div className="hero-bg-static" />}>
  <Suspense fallback={null}>
    <NeuralNetworkScene />
  </Suspense>
</WebGLGuard>
```

The `hero-bg-static` fallback can be a CSS gradient or a static image — the flat `#05050A` background your site currently has works perfectly as the fallback. Users without WebGL still see a clean, functional hero.

---

## Quick Reference — R3F Primitives Cheat Sheet

| Three.js class | R3F JSX equivalent |
|---|---|
| `new THREE.Mesh()` | `<mesh>` |
| `new THREE.InstancedMesh()` | `<instancedMesh>` |
| `new THREE.LineSegments()` | `<lineSegments>` |
| `new THREE.BufferGeometry()` | `<bufferGeometry>` |
| `new THREE.MeshBasicMaterial()` | `<meshBasicMaterial>` |
| `new THREE.MeshStandardMaterial()` | `<meshStandardMaterial>` |
| `new THREE.LineBasicMaterial()` | `<lineBasicMaterial>` |
| `new THREE.PointLight()` | `<pointLight>` |
| `new THREE.AmbientLight()` | `<ambientLight>` |
| `new THREE.IcosahedronGeometry()` | `<icosahedronGeometry>` |
| `new THREE.TorusKnotGeometry()` | `<torusKnotGeometry>` |
| `new THREE.SphereGeometry()` | `<sphereGeometry>` |

In R3F, constructor args go in the `args` prop:
```tsx
// THREE.SphereGeometry(radius, widthSegments, heightSegments)
<sphereGeometry args={[0.5, 16, 16]} />
```

Material props map directly:
```tsx
<meshStandardMaterial
  color="#00E5FF"
  emissive="#00E5FF"
  emissiveIntensity={0.3}
  wireframe={false}
  transparent
  opacity={0.8}
/>
```

---

*See `PORTFOLIO_UPGRADE_PLAN.md` for the full strategy, design decisions, and section-by-section plan.*
