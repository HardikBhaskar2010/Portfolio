import { useEffect, useRef, useState, useCallback } from 'react';
import { playClick, playSynthPulse } from '@/lib/audio';

type Meta = {
  width: number;
  height: number;
  frames: number;
  fps: number;
  chars: string;
  palette: number[][];
};

export type BlackHolePaletteMode = 'frost' | 'amber' | 'matrix';
export type BlackHoleGlyphMode = 'jp' | 'ascii';

export const JAPANESE_CHARS = ' ･､ｧｨｩｪｫｯｼﾂｸｶｷｽｾﾀﾈﾎﾏﾝ影';
export const ASCII_CHARS    = ' .`\':-,;~+<i*rsXA3#%@&';

interface BlackHoleASCIIProps {
  src?: string;
  metaSrc?: string;
  className?: string;
  defaultMode?: BlackHolePaletteMode;
  defaultGlyph?: BlackHoleGlyphMode;
  speed?: number; // Speed factor (default 0.35x for majestic slow rotation)
}

// ── Color Palette Generators ────────────────────────────────────────────────
function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lerpColor(c1: [number, number, number], c2: [number, number, number], t: number): [number, number, number] {
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * t),
    Math.round(c1[1] + (c2[1] - c1[1]) * t),
    Math.round(c1[2] + (c2[2] - c1[2]) * t),
  ];
}

function buildFrostPalette(): string[] {
  const cVoid  = hexToRgb('#071629');
  const cDeep  = hexToRgb('#17345C');
  const cSteel = hexToRgb('#9DB7D5');
  const cMist  = hexToRgb('#EAF4FF');
  const cCore  = hexToRgb('#FFFFFF');

  const palette: string[] = [];
  for (let i = 0; i < 32; i++) {
    const t = i / 31;
    let c: [number, number, number];
    if (t < 0.15) {
      c = lerpColor(cVoid, cDeep, t / 0.15);
    } else if (t < 0.50) {
      c = lerpColor(cDeep, cSteel, (t - 0.15) / 0.35);
    } else if (t < 0.80) {
      c = lerpColor(cSteel, cMist, (t - 0.50) / 0.30);
    } else {
      c = lerpColor(cMist, cCore, (t - 0.80) / 0.20);
    }
    palette.push(`rgb(${c[0]},${c[1]},${c[2]})`);
  }
  return palette;
}

function buildAmberPalette(sourcePalette: number[][]): string[] {
  if (!sourcePalette || sourcePalette.length === 0) return buildFrostPalette();
  return sourcePalette.map(([r, g, b]) => `rgb(${r},${g},${b})`);
}

function buildMatrixPalette(): string[] {
  const cVoid   = hexToRgb('#071629');
  const cShadow = hexToRgb('#0B2E24');
  const cEmerald= hexToRgb('#10B981');
  const cNeon   = hexToRgb('#6EE7B7');
  const cCore   = hexToRgb('#FFFFFF');

  const palette: string[] = [];
  for (let i = 0; i < 32; i++) {
    const t = i / 31;
    let c: [number, number, number];
    if (t < 0.25) {
      c = lerpColor(cVoid, cShadow, t / 0.25);
    } else if (t < 0.65) {
      c = lerpColor(cShadow, cEmerald, (t - 0.25) / 0.40);
    } else if (t < 0.88) {
      c = lerpColor(cEmerald, cNeon, (t - 0.65) / 0.23);
    } else {
      c = lerpColor(cNeon, cCore, (t - 0.88) / 0.12);
    }
    palette.push(`rgb(${c[0]},${c[1]},${c[2]})`);
  }
  return palette;
}

// ── Stream Decompression Helper ─────────────────────────────────────────────
async function loadAsciiData(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);

  // If server automatically decoded gzip (Content-Encoding: gzip), return buffer directly
  const enc = res.headers.get('content-encoding');
  if (enc && enc.includes('gzip')) {
    return res.arrayBuffer();
  }

  const raw = await res.arrayBuffer();
  const u8 = new Uint8Array(raw);
  // Check for gzip magic numbers: 0x1F, 0x8B
  if (u8[0] === 0x1f && u8[1] === 0x8b) {
    if (typeof DecompressionStream !== 'undefined') {
      const stream = new Response(raw).body!.pipeThrough(new DecompressionStream('gzip'));
      return new Response(stream).arrayBuffer();
    }
  }
  return raw;
}

export function BlackHoleASCII({
  src = '/blackhole.ascii.gz',
  metaSrc = '/blackhole.ascii.json',
  className = '',
  defaultMode = 'frost',
  defaultGlyph = 'jp',
  speed = 0.35,
}: BlackHoleASCIIProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<Uint16Array | null>(null);
  const metaRef = useRef<Meta | null>(null);

  // Palettes map
  const palettesRef = useRef<Record<BlackHolePaletteMode, string[]>>({
    frost: buildFrostPalette(),
    amber: [],
    matrix: buildMatrixPalette(),
  });

  const [mode, setMode] = useState<BlackHolePaletteMode>(defaultMode);
  const [glyphMode, setGlyphMode] = useState<BlackHoleGlyphMode>(defaultGlyph);
  const glyphModeRef = useRef<BlackHoleGlyphMode>(defaultGlyph);
  useEffect(() => {
    glyphModeRef.current = glyphMode;
  }, [glyphMode]);

  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [hudCoords, setHudCoords] = useState<{ r: number; theta: number } | null>(null);

  const toggleGlyph = () => {
    playClick();
    setGlyphMode((prev) => (prev === 'jp' ? 'ascii' : 'jp'));
  };

  // Mouse & Gravitational Physics Refs
  const mouseRef = useRef({
    x: 0.5,
    y: 0.5,
    targetX: 0.5,
    targetY: 0.5,
    active: false,
    decay: 0,
  });

  // Gravitational ripple shockwave on click
  const rippleRef = useRef<{
    cx: number;
    cy: number;
    radius: number;
    intensity: number;
    active: boolean;
  }>({
    cx: 90,
    cy: 30,
    radius: 0,
    intensity: 0,
    active: false,
  });

  // Playback timing
  const startRef = useRef<number | null>(null);
  const lastRenderTime = useRef(0);
  const rafRef = useRef<number>(0);
  const pausedAtRef = useRef(0);

  // ── 1. Lazy Load Data on Near-Viewport Entry ─────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { rootMargin: '300px 0px', threshold: 0.01 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || ready) return;
    let cancelled = false;

    async function initData() {
      try {
        const [metaRes, rawBuf] = await Promise.all([
          fetch(metaSrc),
          loadAsciiData(src),
        ]);

        if (!metaRes.ok) throw new Error(`Failed to load ${metaSrc}`);
        const meta = (await metaRes.json()) as Meta;
        const words = new Uint16Array(rawBuf);

        if (cancelled) return;
        metaRef.current = meta;
        frameRef.current = words;

        // Build amber palette from source
        palettesRef.current.amber = buildAmberPalette(meta.palette);
        setReady(true);
      } catch (err) {
        console.error('BlackHoleASCII failed to initialize:', err);
      }
    }

    initData();
    return () => {
      cancelled = true;
    };
  }, [inView, ready, src, metaSrc]);

  // ── 2. Mouse & Gravitational Interaction Handlers ───────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    mouseRef.current.targetX = nx;
    mouseRef.current.targetY = ny;
    mouseRef.current.active = true;
    mouseRef.current.decay = 1.0;

    // Relativistic polar coordinates relative to singularity center (0.5, 0.5)
    const dx = (nx - 0.5) * 2;
    const dy = (ny - 0.5) * 2;
    const r = Math.sqrt(dx * dx + dy * dy) * 3.0; // in Schwarzschild radii Rs
    const theta = Math.round(((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360);

    setHudCoords({ r: Math.round(r * 10) / 10, theta });
    if (!interactive) setInteractive(true);
  }, [interactive]);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.active = false;
    setHudCoords(null);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    // Spawn relativistic ripple shockwave
    rippleRef.current = {
      cx: nx * 180,
      cy: ny * 60,
      radius: 0,
      intensity: 1.0,
      active: true,
    };

    playSynthPulse();
  }, []);

  // ── 3. High-Performance Canvas Render Loop ──────────────────────────────
  useEffect(() => {
    if (!ready || !inView) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targetFps = isReduced ? 0 : (metaRef.current?.fps || 30.0);
    const frameInterval = targetFps > 0 ? 1000 / targetFps : Infinity;

    const onVisibility = () => {
      if (document.hidden) {
        pausedAtRef.current = performance.now();
      } else if (startRef.current !== null) {
        const pause = performance.now() - pausedAtRef.current;
        startRef.current += pause;
      }
    };

    document.addEventListener('visibilitychange', onVisibility);

    let layoutWidth = 0;
    let layoutHeight = 0;
    let cellW = 0;
    let cellH = 0;
    let dpr = 1;

    function resizeCanvas() {
      const parent = canvas!.parentElement ?? canvas!;
      const parentW = Math.max(1, parent.clientWidth);
      const parentH = Math.max(1, parent.clientHeight);
      const meta = metaRef.current;
      if (!meta) return;

      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      // In source data, 180x60 monospace characters span approx 1.8:1 aspect ratio
      const naturalAspect = 180 / (60 / 0.60);

      let renderW = parentW;
      let renderH = parentW / naturalAspect;

      // Ensure canvas covers entire parent height so accretion disk stays centered
      if (renderH < parentH) {
        renderH = parentH;
        renderW = parentH * naturalAspect;
      }

      layoutWidth = renderW;
      layoutHeight = renderH;
      cellW = layoutWidth / meta.width;
      cellH = layoutHeight / meta.height;

      canvas!.style.width = `${Math.round(layoutWidth)}px`;
      canvas!.style.height = `${Math.round(layoutHeight)}px`;
      canvas!.width = Math.round(layoutWidth * dpr);
      canvas!.height = Math.round(layoutHeight * dpr);

      const ctx = canvas!.getContext('2d');
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.imageSmoothingEnabled = false;
        renderFrame(performance.now(), ctx, true);
      }
    }

    const ro = new ResizeObserver(() => resizeCanvas());
    ro.observe(canvas.parentElement ?? canvas);
    resizeCanvas();

    function renderFrame(now: number, ctx: CanvasRenderingContext2D, force = false) {
      const meta = metaRef.current;
      const words = frameRef.current;
      if (!meta || !words) return;

      if (!force && targetFps > 0) {
        if (now - lastRenderTime.current < frameInterval - 1) return;
      }
      lastRenderTime.current = now;

      if (startRef.current === null) startRef.current = now;
      const elapsed = isReduced ? 0 : now - startRef.current;
      const effectiveFps = meta.fps * (isReduced ? 0 : speed);
      const currentFrame = isReduced ? 120 : Math.floor((elapsed / 1000) * effectiveFps) % meta.frames;
      const frameOffset = currentFrame * meta.width * meta.height;

      // Smooth mouse coordinate tracking
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;
      if (!mouse.active && mouse.decay > 0.01) {
        mouse.decay *= 0.94;
      }

      // Ripple shockwave propagation
      const ripple = rippleRef.current;
      if (ripple.active) {
        ripple.radius += 2.2;
        ripple.intensity *= 0.94;
        if (ripple.radius > 110 || ripple.intensity < 0.02) {
          ripple.active = false;
        }
      }

      // Background fill with theme base navy
      ctx.fillStyle = '#071629';
      ctx.fillRect(0, 0, layoutWidth, layoutHeight);

      // Typography setup: Geist Mono with pixel-exact height for high contrast and fine matrix fidelity
      ctx.font = `bold ${Math.ceil(cellH * 1.05)}px 'Geist Mono', 'Yu Gothic UI', 'Meiryo', monospace`;
      ctx.textBaseline = 'top';

      const activePalette = palettesRef.current[mode] || palettesRef.current.frost;
      const chars = glyphModeRef.current === 'jp' ? JAPANESE_CHARS : ASCII_CHARS;
      const totalChars = chars.length;
      const mGridX = mouse.x * meta.width;
      const mGridY = mouse.y * meta.height;
      const hasMouseInfluence = mouse.decay > 0.05;

      // ── Batched Run-Length Drawing with Gravitational Lensing ──
      for (let y = 0; y < meta.height; y++) {
        const row = frameOffset + y * meta.width;
        let currentColor = -1;
        let runStr = '';
        let runStartX = 0;

        for (let x = 0; x < meta.width; x++) {
          let sampleX = x;
          let sampleY = y;
          let boostLuma = 0;

          // 1. Relativistic Gravitational Lensing around Cursor
          if (hasMouseInfluence) {
            const dx = x - mGridX;
            const dy = (y - mGridY) * 1.8;
            const distSq = dx * dx + dy * dy;

            if (distSq < 784) { // radius ~ 28 cells
              const dist = Math.sqrt(distSq);
              const lensFactor = (1 - dist / 28) * 3.8 * mouse.decay;
              sampleX = Math.max(0, Math.min(meta.width - 1, Math.round(x - (dx / (dist + 1)) * lensFactor)));
              sampleY = Math.max(0, Math.min(meta.height - 1, Math.round(y - (dy / (dist + 1)) * lensFactor * 0.5)));

              if (dist < 14) {
                // Photon blueshift energy boost
                boostLuma = Math.round((1 - dist / 14) * 6 * mouse.decay);
              }
            }
          }

          // 2. Gravitational Wave Shockwave Ripple
          if (ripple.active) {
            const rdx = x - ripple.cx;
            const rdy = (y - ripple.cy) * 1.8;
            const rDist = Math.sqrt(rdx * rdx + rdy * rdy);
            const waveDist = Math.abs(rDist - ripple.radius);

            if (waveDist < 5) {
              const waveOffset = Math.sin((rDist - ripple.radius) * 0.8) * 2.5 * ripple.intensity;
              sampleX = Math.max(0, Math.min(meta.width - 1, Math.round(sampleX + (rdx / (rDist + 1)) * waveOffset)));
              boostLuma = Math.min(31, boostLuma + Math.round(ripple.intensity * 8));
            }
          }

          // Sample packed cell from frame
          const sampleRow = frameOffset + sampleY * meta.width;
          const packed = words[sampleRow + sampleX];
          let charIndex = packed >>> 5;
          let colorIndex = packed & 31;

          if (boostLuma > 0) {
            colorIndex = Math.min(31, colorIndex + boostLuma);
            if (charIndex > 0) {
              charIndex = Math.min(totalChars - 1, charIndex + Math.ceil(boostLuma * 0.5));
            }
          }

          const ch = chars[charIndex] || ' ';

          // Void space optimization: flush current run and skip draw
          if (charIndex === 0 || ch === ' ') {
            if (runStr.length > 0) {
              ctx.fillStyle = activePalette[currentColor] || '#ffffff';
              ctx.fillText(runStr, runStartX * cellW, y * cellH);
              runStr = '';
              currentColor = -1;
            }
            continue;
          }

          // Batch consecutive characters with same palette color
          if (currentColor === colorIndex) {
            runStr += ch;
          } else {
            if (runStr.length > 0) {
              ctx.fillStyle = activePalette[currentColor] || '#ffffff';
              ctx.fillText(runStr, runStartX * cellW, y * cellH);
            }
            currentColor = colorIndex;
            runStr = ch;
            runStartX = x;
          }
        }

        if (runStr.length > 0) {
          ctx.fillStyle = activePalette[currentColor] || '#ffffff';
          ctx.fillText(runStr, runStartX * cellW, y * cellH);
        }
      }

      // ── 3. Subtle CRT Scanline Raster ──
      ctx.fillStyle = 'rgba(7, 22, 41, 0.16)';
      for (let scanY = 0; scanY < layoutHeight; scanY += Math.max(2, cellH * 2)) {
        ctx.fillRect(0, scanY, layoutWidth, Math.max(1, cellH * 0.2));
      }
    }

    function loop(now: number) {
      if (!document.hidden && inView) {
        const ctx = canvas!.getContext('2d');
        if (ctx) {
          renderFrame(now, ctx);
        }
      }
      if (!isReduced) {
        rafRef.current = requestAnimationFrame(loop);
      }
    }

    if (!isReduced) {
      rafRef.current = requestAnimationFrame(loop);
    } else {
      const ctx = canvas.getContext('2d');
      if (ctx) renderFrame(performance.now(), ctx, true);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [ready, inView, mode]);

  // Mode cycle helper
  const nextMode = () => {
    playClick();
    setMode((prev) => {
      if (prev === 'frost') return 'amber';
      if (prev === 'amber') return 'matrix';
      return 'frost';
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`relative w-full h-full min-h-[360px] overflow-hidden select-none bg-[#071629] ${className}`}
      aria-label="Interactive ASCII Black Hole Singularity Simulation"
    >
      {/* ── Active Canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-none cursor-crosshair opacity-100 transition-opacity duration-700"
      />

      {/* ── Edge Blending Gradients (Frost Navy) ── */}
      <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-[#071629] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#071629] to-transparent pointer-events-none" />

      {/* ── Cybernetic Telemetry HUD Overlay ── */}
      <div className="absolute inset-x-0 top-0 bottom-[68px] sm:bottom-[76px] z-20 pointer-events-none flex flex-col justify-between p-4 sm:p-6 font-mono text-[10px] text-[var(--text-muted)] tracking-wider">
        {/* Top telemetry bar */}
        <div className="flex items-center justify-between opacity-70 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-available)] animate-pulse" />
            <span className="hidden sm:inline">KERR SINGULARITY // a* = 0.998</span>
            <span className="sm:hidden">SINGULARITY</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--accent)] font-semibold">
              {metaRef.current ? `${metaRef.current.width}×${metaRef.current.height}@${Math.round(metaRef.current.fps * speed)}FPS` : '280×90@10FPS'}
            </span>
          </div>
        </div>

        {/* Bottom interactive telemetry & Toggles */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
          <div className="flex flex-col gap-0.5 pointer-events-auto">
            {hudCoords ? (
              <span className="text-[var(--accent)] font-semibold">
                SPACETIME : r = {hudCoords.r} Rs | θ = {hudCoords.theta}°
              </span>
            ) : (
              <span className="opacity-70 hidden sm:inline">
                HOVER TO CURVE SPACETIME · CLICK TO PULSE
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Interactive Glyph Switcher */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleGlyph();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[var(--border-strong)] bg-[#071629]/90 text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-white transition-all shadow-md active:scale-95"
              title="Click to toggle Japanese / ASCII characters"
            >
              <span className="text-[9px] uppercase tracking-widest text-[var(--accent)]">GLYPH:</span>
              <span className="font-bold text-[10px] uppercase text-[var(--text-strong)]">
                {glyphMode === 'jp' ? '日本語' : 'ASCII'}
              </span>
            </button>

            {/* Interactive Palette Mode Switcher */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextMode();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[var(--border-strong)] bg-[#071629]/90 text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-white transition-all shadow-md active:scale-95"
              title="Click to cycle black hole visual mode"
            >
              <span className="text-[9px] uppercase tracking-widest text-[var(--accent)]">PALETTE:</span>
              <span className="font-bold text-[10px] uppercase text-[var(--text-strong)]">{mode}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default BlackHoleASCII;
