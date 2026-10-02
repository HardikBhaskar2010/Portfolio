import React, { useEffect, useRef, useState } from 'react';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FLUID BACKGROUND CONFIGURATION (TUNABLE CONSTANTS)
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const FLUID_CONFIG = {
  // Grid resolution (128 for mobile, 256 for desktop)
  simResolutionDesktop: 256,
  simResolutionMobile: 128,
  dyeResolutionDesktop: 512,
  dyeResolutionMobile: 256,

  // Fluid physics
  velocityDissipation: 0.985,   // Higher = velocity persists longer (0.95 - 0.99)
  densityDissipation: 0.978,    // Higher = color trails linger longer (0.94 - 0.99)
  pressureIterations: 20,       // Jacobi solver iterations (16 - 28)
  curlStrength: 26.0,           // Vorticity confinement / swirliness (15 - 40)

  // Interaction
  splatRadius: 0.0035,          // Motion splat radius (normalized viewport fraction)
  splatForce: 5200.0,           // Velocity injected by cursor move
  clickBurstRadius: 0.008,      // Radial burst size on click
  clickBurstForce: 7500.0,      // Burst velocity
  scrollForceMultiplier: 1.6,   // Scroll reaction strength

  // Color Palette (Normalized RGB [0..1])
  // Dark navy/black base with fluid in deep indigo and violet, cyan & magenta highlights
  baseColor: [0.024, 0.024, 0.043] as [number, number, number],         // #06060B near-black base
  ambientIndigo: [0.18, 0.08, 0.38] as [number, number, number],       // Deep indigo/violet
  ambientViolet: [0.28, 0.11, 0.58] as [number, number, number],       // Radiant violet
  highlightCyan: [0.0, 0.90, 1.0] as [number, number, number],          // #00E5FF cyan
  highlightMagenta: [0.96, 0.25, 0.37] as [number, number, number],     // #F43F5E crimson/magenta

  // Atmosphere & Contrast
  brightness: 0.82,             // Overall fluid brightness multiplier
  bottomGlowIntensity: 0.55,    // Ambient bottom glow strength
  edgeGlowIntensity: 0.35,      // Edge atmospheric presence
  centerDimming: 0.65,          // Dimming factor in center to preserve card/text readability
  grainIntensity: 0.028,        // High-frequency film grain to prevent dark gradient banding

  // Idle drift & Telemetry Orb
  idleDriftSpeed: 0.32,         // Autonomous gentle current when idle
  orbEmission: true,            // Telemetry orb emits subtle cyan current
};

// ── WebGL Shader Sources (GLSL ES 3.00) ────────────────────────────────────

const baseVertexShader = `#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const clearShaderSource = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;
uniform sampler2D u_texture;
uniform float u_value;
void main() {
  fragColor = u_value * texture(u_texture, v_uv);
}
`;

const splatShaderSource = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;
uniform sampler2D u_target;
uniform float u_aspect;
uniform vec2 u_point;
uniform vec3 u_color;
uniform float u_radius;
void main() {
  vec2 p = v_uv - u_point;
  p.x *= u_aspect;
  vec3 splat = exp(-dot(p, p) / u_radius) * u_color;
  vec3 base = texture(u_target, v_uv).xyz;
  fragColor = vec4(base + splat, 1.0);
}
`;

const advectionShaderSource = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;
uniform sampler2D u_velocity;
uniform sampler2D u_source;
uniform vec2 u_texelSize;
uniform float u_dt;
uniform float u_dissipation;
void main() {
  vec2 coord = v_uv - u_dt * texture(u_velocity, v_uv).xy * u_texelSize;
  fragColor = u_dissipation * texture(u_source, coord);
}
`;

const divergenceShaderSource = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;
uniform sampler2D u_velocity;
uniform vec2 u_texelSize;
void main() {
  float L = texture(u_velocity, v_uv - vec2(u_texelSize.x, 0.0)).x;
  float R = texture(u_velocity, v_uv + vec2(u_texelSize.x, 0.0)).x;
  float B = texture(u_velocity, v_uv - vec2(0.0, u_texelSize.y)).y;
  float T = texture(u_velocity, v_uv + vec2(0.0, u_texelSize.y)).y;
  float div = 0.5 * (R - L + T - B);
  fragColor = vec4(div, 0.0, 0.0, 1.0);
}
`;

const curlShaderSource = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;
uniform sampler2D u_velocity;
uniform vec2 u_texelSize;
void main() {
  float L = texture(u_velocity, v_uv - vec2(u_texelSize.x, 0.0)).y;
  float R = texture(u_velocity, v_uv + vec2(u_texelSize.x, 0.0)).y;
  float B = texture(u_velocity, v_uv - vec2(0.0, u_texelSize.y)).x;
  float T = texture(u_velocity, v_uv + vec2(0.0, u_texelSize.y)).x;
  float vorticity = R - L - T + B;
  fragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}
`;

const vorticityShaderSource = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;
uniform sampler2D u_velocity;
uniform sampler2D u_curl;
uniform float u_curlStrength;
uniform float u_dt;
uniform vec2 u_texelSize;
void main() {
  float L = texture(u_curl, v_uv - vec2(u_texelSize.x, 0.0)).x;
  float R = texture(u_curl, v_uv + vec2(u_texelSize.x, 0.0)).x;
  float B = texture(u_curl, v_uv - vec2(0.0, u_texelSize.y)).x;
  float T = texture(u_curl, v_uv + vec2(0.0, u_texelSize.y)).x;
  float C = texture(u_curl, v_uv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  float len = max(length(force), 0.0001);
  force = (force / len) * u_curlStrength * C;
  force.y *= -1.0;
  vec2 vel = texture(u_velocity, v_uv).xy;
  fragColor = vec4(vel + force * u_dt, 0.0, 1.0);
}
`;

const pressureShaderSource = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;
uniform sampler2D u_pressure;
uniform sampler2D u_divergence;
uniform vec2 u_texelSize;
void main() {
  float L = texture(u_pressure, v_uv - vec2(u_texelSize.x, 0.0)).x;
  float R = texture(u_pressure, v_uv + vec2(u_texelSize.x, 0.0)).x;
  float B = texture(u_pressure, v_uv - vec2(0.0, u_texelSize.y)).x;
  float T = texture(u_pressure, v_uv + vec2(0.0, u_texelSize.y)).x;
  float div = texture(u_divergence, v_uv).x;
  float p = (L + R + B + T - div) * 0.25;
  fragColor = vec4(p, 0.0, 0.0, 1.0);
}
`;

const gradientSubtractShaderSource = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;
uniform sampler2D u_pressure;
uniform sampler2D u_velocity;
uniform vec2 u_texelSize;
void main() {
  float L = texture(u_pressure, v_uv - vec2(u_texelSize.x, 0.0)).x;
  float R = texture(u_pressure, v_uv + vec2(u_texelSize.x, 0.0)).x;
  float B = texture(u_pressure, v_uv - vec2(0.0, u_texelSize.y)).x;
  float T = texture(u_pressure, v_uv + vec2(0.0, u_texelSize.y)).x;
  vec2 vel = texture(u_velocity, v_uv).xy;
  vel -= vec2(R - L, T - B) * 0.5;
  fragColor = vec4(vel, 0.0, 1.0);
}
`;

const displayShaderSource = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;
uniform sampler2D u_dye;
uniform vec3 u_baseColor;
uniform vec3 u_ambientColor;
uniform float u_brightness;
uniform float u_bottomGlowIntensity;
uniform float u_edgeGlowIntensity;
uniform float u_centerDimming;
uniform float u_grainIntensity;
uniform float u_time;

// Pseudo-random high-frequency dither hash
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec3 dye = texture(u_dye, v_uv).rgb;

  // 1. Ambient bottom atmosphere (deep violet glow rising from bottom)
  float bottomRamp = pow(1.0 - v_uv.y, 1.5);
  vec3 bottomAtmosphere = u_ambientColor * bottomRamp * u_bottomGlowIntensity;

  // 2. Ambient subtle side edge glows
  float edgeDist = min(v_uv.x, 1.0 - v_uv.x);
  float edgeRamp = smoothstep(0.35, 0.0, edgeDist);
  vec3 edgeAtmosphere = u_ambientColor * edgeRamp * u_edgeGlowIntensity;

  // 3. Center dimming to protect central card/text readability
  vec2 centered = (v_uv - vec2(0.5, 0.5)) * vec2(1.15, 1.0);
  float centerDist = length(centered);
  float centerDim = smoothstep(0.18, 0.68, centerDist) * (1.0 - u_centerDimming) + u_centerDimming;

  // 4. Combine base background + ambient atmosphere + fluid dynamics
  vec3 color = u_baseColor + bottomAtmosphere + edgeAtmosphere + (dye * u_brightness * centerDim);

  // 5. Soft Reinhard tone-mapping to prevent harsh burnouts
  color = color / (1.0 + color * 0.45);

  // 6. Anti-banding fine film grain
  float grain = (hash21(gl_FragCoord.xy + fract(u_time * 7.13)) - 0.5) * u_grainIntensity;
  color += grain;

  fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

// ── WebGL Helper Types & Utilities ──────────────────────────────────────────

interface FBO {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  attach(id: number): number;
}

interface DoubleFBO {
  read: FBO;
  write: FBO;
  swap(): void;
}

function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('Shader compile failed:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGL2RenderingContext, vertexSrc: string, fragmentSrc: string): WebGLProgram | null {
  const vs = createShader(gl, gl.VERTEX_SHADER, vertexSrc);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('Program link failed:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function createFBO(
  gl: WebGL2RenderingContext,
  w: number,
  h: number,
  internalFormat: number,
  format: number,
  type: number,
  filter: number
): FBO {
  const texture = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

  const fbo = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.viewport(0, 0, w, h);
  gl.clear(gl.COLOR_BUFFER_BIT);

  return {
    texture,
    fbo,
    width: w,
    height: h,
    attach(id: number) {
      gl.activeTexture(gl.TEXTURE0 + id);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      return id;
    },
  };
}

function createDoubleFBO(
  gl: WebGL2RenderingContext,
  w: number,
  h: number,
  internalFormat: number,
  format: number,
  type: number,
  filter: number
): DoubleFBO {
  let fbo1 = createFBO(gl, w, h, internalFormat, format, type, filter);
  let fbo2 = createFBO(gl, w, h, internalFormat, format, type, filter);
  return {
    get read() {
      return fbo1;
    },
    get write() {
      return fbo2;
    },
    swap() {
      const temp = fbo1;
      fbo1 = fbo2;
      fbo2 = temp;
    },
  };
}

// ── Main Fluid Component ───────────────────────────────────────────────────

export function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(media.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Acquire WebGL2 Context with optimal flags
    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    }) as WebGL2RenderingContext | null;

    if (!gl) {
      console.warn('WebGL2 not supported, falling back to CSS atmospheric gradient.');
      setHasWebGL(false);
      return;
    }

    // Required extension for float/half-float rendering
    const extColorBufferFloat = gl.getExtension('EXT_color_buffer_float');
    const extFloatLinear = gl.getExtension('OES_texture_float_linear');

    // Select optimal format
    const filter = extFloatLinear ? gl.LINEAR : gl.NEAREST;
    const internalFormat = extColorBufferFloat ? gl.RGBA16F : gl.RGBA;
    const format = gl.RGBA;
    const type = extColorBufferFloat ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE;

    // Fullscreen Quad geometry
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    // Compile Shader Programs
    const clearProgram = createProgram(gl, baseVertexShader, clearShaderSource);
    const splatProgram = createProgram(gl, baseVertexShader, splatShaderSource);
    const advectionProgram = createProgram(gl, baseVertexShader, advectionShaderSource);
    const divergenceProgram = createProgram(gl, baseVertexShader, divergenceShaderSource);
    const curlProgram = createProgram(gl, baseVertexShader, curlShaderSource);
    const vorticityProgram = createProgram(gl, baseVertexShader, vorticityShaderSource);
    const pressureProgram = createProgram(gl, baseVertexShader, pressureShaderSource);
    const gradientSubtractProgram = createProgram(gl, baseVertexShader, gradientSubtractShaderSource);
    const displayProgram = createProgram(gl, baseVertexShader, displayShaderSource);

    if (
      !clearProgram ||
      !splatProgram ||
      !advectionProgram ||
      !divergenceProgram ||
      !curlProgram ||
      !vorticityProgram ||
      !pressureProgram ||
      !gradientSubtractProgram ||
      !displayProgram
    ) {
      console.warn('Failed to compile fluid simulation shader programs.');
      setHasWebGL(false);
      return;
    }

    // Setup Quad attribute
    const bindQuad = (prog: WebGLProgram) => {
      const posLoc = gl.getAttribLocation(prog, 'a_position');
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    };

    // Calculate dimensions
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    const isMobile = width < 768;
    const simRes = isMobile ? FLUID_CONFIG.simResolutionMobile : FLUID_CONFIG.simResolutionDesktop;
    const dyeRes = isMobile ? FLUID_CONFIG.dyeResolutionMobile : FLUID_CONFIG.dyeResolutionDesktop;

    const simW = simRes;
    const simH = Math.floor(simRes * (height / width));
    const dyeW = dyeRes;
    const dyeH = Math.floor(dyeRes * (height / width));

    // Simulation Framebuffers
    let density = createDoubleFBO(gl, dyeW, dyeH, internalFormat, format, type, filter);
    let velocity = createDoubleFBO(gl, simW, simH, internalFormat, format, type, filter);
    let divergence = createFBO(gl, simW, simH, internalFormat, format, type, gl.NEAREST);
    let curl = createFBO(gl, simW, simH, internalFormat, format, type, gl.NEAREST);
    let pressure = createDoubleFBO(gl, simW, simH, internalFormat, format, type, gl.NEAREST);

    // ── Splat Helper ──────────────────────────────────────────────────────────
    const splat = (x: number, y: number, dx: number, dy: number, color: [number, number, number], radius = FLUID_CONFIG.splatRadius) => {
      gl.viewport(0, 0, velocity.write.width, velocity.write.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
      gl.useProgram(splatProgram);
      bindQuad(splatProgram);
      gl.uniform1i(gl.getUniformLocation(splatProgram, 'u_target'), velocity.read.attach(0));
      gl.uniform1f(gl.getUniformLocation(splatProgram, 'u_aspect'), width / height);
      gl.uniform2f(gl.getUniformLocation(splatProgram, 'u_point'), x, y);
      gl.uniform3f(gl.getUniformLocation(splatProgram, 'u_color'), dx, dy, 0.0);
      gl.uniform1f(gl.getUniformLocation(splatProgram, 'u_radius'), radius);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      velocity.swap();

      gl.viewport(0, 0, density.write.width, density.write.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, density.write.fbo);
      gl.uniform1i(gl.getUniformLocation(splatProgram, 'u_target'), density.read.attach(0));
      gl.uniform3f(gl.getUniformLocation(splatProgram, 'u_color'), color[0], color[1], color[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      density.swap();
    };

    // Color cycling state for cursor trails
    let colorCycle = 0;
    const getNextColor = (): [number, number, number] => {
      colorCycle = (colorCycle + 1) % 4;
      if (colorCycle === 0) return FLUID_CONFIG.ambientViolet;
      if (colorCycle === 1) return FLUID_CONFIG.highlightCyan;
      if (colorCycle === 2) return FLUID_CONFIG.ambientIndigo;
      return FLUID_CONFIG.highlightMagenta;
    };

    // Initial ambient seeding so the screen immediately has glowing fluid
    const seedInitialAtmosphere = () => {
      for (let i = 0; i < 5; i++) {
        const sx = 0.2 + 0.15 * i;
        const sy = 0.85 + 0.08 * Math.sin(i);
        splat(sx, sy, (Math.random() - 0.5) * 400, (Math.random() - 0.5) * 400, FLUID_CONFIG.ambientViolet, 0.018);
      }
    };
    seedInitialAtmosphere();

    // ── Input Handling (Window listeners, canvas is pointer-events: none) ─────
    let lastX = -1;
    let lastY = -1;

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
      const x = clientX / width;
      const y = 1.0 - clientY / height; // Invert Y for WebGL texture coordinates

      if (lastX > 0 && lastY > 0) {
        const dx = (x - lastX) * FLUID_CONFIG.splatForce;
        const dy = (y - lastY) * FLUID_CONFIG.splatForce;
        const distSq = dx * dx + dy * dy;
        if (distSq > 1.0) {
          splat(x, y, dx, dy, getNextColor(), FLUID_CONFIG.splatRadius);
        }
      }
      lastX = x;
      lastY = y;
    };

    const onClick = (e: MouseEvent) => {
      const x = e.clientX / width;
      const y = 1.0 - e.clientY / height;
      // Gentle radial splat with cyber cyan / violet pulse
      const clickColor = Math.random() > 0.5 ? FLUID_CONFIG.highlightCyan : FLUID_CONFIG.highlightMagenta;
      splat(x, y, (Math.random() - 0.5) * FLUID_CONFIG.clickBurstForce, (Math.random() - 0.5) * FLUID_CONFIG.clickBurstForce, clickColor, FLUID_CONFIG.clickBurstRadius);
    };

    let lastScrollY = window.scrollY;
    let scrollTimeout: number;
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = (currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;

      if (Math.abs(delta) > 1.5) {
        // Inject upward or downward vertical flow based on scroll velocity
        const scrollForce = -delta * FLUID_CONFIG.scrollForceMultiplier * 15.0;
        const scrollX = 0.3 + 0.4 * Math.random();
        splat(scrollX, 0.4, 0.0, scrollForce, FLUID_CONFIG.ambientViolet, 0.012);
      }

      window.clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        lastScrollY = window.scrollY;
      }, 100);
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('click', onClick, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    // Handle Resize
    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };
    window.addEventListener('resize', onResize, { passive: true });

    // Pause when tab hidden
    let isTabVisible = true;
    const onVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // ── Simulation Step & Render Loop ─────────────────────────────────────────
    let rafId: number;
    let lastTime = performance.now();
    let idleTimer = 0;

    const step = (now: number) => {
      rafId = requestAnimationFrame(step);
      if (!isTabVisible) return;

      const dt = Math.min((now - lastTime) / 1000, 0.033);
      lastTime = now;
      idleTimer += dt * FLUID_CONFIG.idleDriftSpeed;

      // ── Ambient Idle Current & Telemetry Orb Emittance ──
      // Subtle continuous drift so background always breathes
      const idleX = 0.5 + 0.35 * Math.sin(idleTimer * 0.9);
      const idleY = 0.15 + 0.08 * Math.cos(idleTimer * 1.3);
      const idleDx = Math.cos(idleTimer * 1.1) * 35.0;
      const idleDy = Math.sin(idleTimer * 0.8) * 35.0;
      splat(idleX, idleY, idleDx, idleDy, FLUID_CONFIG.ambientIndigo, 0.022);

      // Cyan Telemetry Orb current emission from left edge
      if (FLUID_CONFIG.orbEmission) {
        const orbY = 0.48 + 0.12 * Math.sin(idleTimer * 0.7);
        splat(0.04, orbY, 65.0, 15.0 * Math.cos(idleTimer), FLUID_CONFIG.highlightCyan, 0.005);
      }

      // 1. Curl Calculation
      gl.viewport(0, 0, simW, simH);
      gl.bindFramebuffer(gl.FRAMEBUFFER, curl.fbo);
      gl.useProgram(curlProgram);
      bindQuad(curlProgram);
      gl.uniform1i(gl.getUniformLocation(curlProgram, 'u_velocity'), velocity.read.attach(0));
      gl.uniform2f(gl.getUniformLocation(curlProgram, 'u_texelSize'), 1.0 / simW, 1.0 / simH);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // 2. Vorticity Confinement
      gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
      gl.useProgram(vorticityProgram);
      bindQuad(vorticityProgram);
      gl.uniform1i(gl.getUniformLocation(vorticityProgram, 'u_velocity'), velocity.read.attach(0));
      gl.uniform1i(gl.getUniformLocation(vorticityProgram, 'u_curl'), curl.attach(1));
      gl.uniform1f(gl.getUniformLocation(vorticityProgram, 'u_curlStrength'), FLUID_CONFIG.curlStrength);
      gl.uniform1f(gl.getUniformLocation(vorticityProgram, 'u_dt'), dt);
      gl.uniform2f(gl.getUniformLocation(vorticityProgram, 'u_texelSize'), 1.0 / simW, 1.0 / simH);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      velocity.swap();

      // 3. Divergence Calculation
      gl.bindFramebuffer(gl.FRAMEBUFFER, divergence.fbo);
      gl.useProgram(divergenceProgram);
      bindQuad(divergenceProgram);
      gl.uniform1i(gl.getUniformLocation(divergenceProgram, 'u_velocity'), velocity.read.attach(0));
      gl.uniform2f(gl.getUniformLocation(divergenceProgram, 'u_texelSize'), 1.0 / simW, 1.0 / simH);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // 4. Clear Pressure
      gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.write.fbo);
      gl.useProgram(clearShaderSource ? clearProgram : clearProgram);
      bindQuad(clearProgram);
      gl.uniform1i(gl.getUniformLocation(clearProgram, 'u_texture'), pressure.read.attach(0));
      gl.uniform1f(gl.getUniformLocation(clearProgram, 'u_value'), 0.8);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      pressure.swap();

      // 5. Pressure Poisson Solver (Jacobi)
      gl.useProgram(pressureProgram);
      bindQuad(pressureProgram);
      gl.uniform2f(gl.getUniformLocation(pressureProgram, 'u_texelSize'), 1.0 / simW, 1.0 / simH);
      gl.uniform1i(gl.getUniformLocation(pressureProgram, 'u_divergence'), divergence.attach(1));

      for (let i = 0; i < FLUID_CONFIG.pressureIterations; i++) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.write.fbo);
        gl.uniform1i(gl.getUniformLocation(pressureProgram, 'u_pressure'), pressure.read.attach(0));
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        pressure.swap();
      }

      // 6. Gradient Subtraction (Projection step)
      gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
      gl.useProgram(gradientSubtractProgram);
      bindQuad(gradientSubtractProgram);
      gl.uniform1i(gl.getUniformLocation(gradientSubtractProgram, 'u_pressure'), pressure.read.attach(0));
      gl.uniform1i(gl.getUniformLocation(gradientSubtractProgram, 'u_velocity'), velocity.read.attach(1));
      gl.uniform2f(gl.getUniformLocation(gradientSubtractProgram, 'u_texelSize'), 1.0 / simW, 1.0 / simH);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      velocity.swap();

      // 7. Velocity Advection
      gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
      gl.useProgram(advectionProgram);
      bindQuad(advectionProgram);
      gl.uniform1i(gl.getUniformLocation(advectionProgram, 'u_velocity'), velocity.read.attach(0));
      gl.uniform1i(gl.getUniformLocation(advectionProgram, 'u_source'), velocity.read.attach(0));
      gl.uniform2f(gl.getUniformLocation(advectionProgram, 'u_texelSize'), 1.0 / simW, 1.0 / simH);
      gl.uniform1f(gl.getUniformLocation(advectionProgram, 'u_dt'), dt);
      gl.uniform1f(gl.getUniformLocation(advectionProgram, 'u_dissipation'), FLUID_CONFIG.velocityDissipation);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      velocity.swap();

      // 8. Dye Advection
      gl.viewport(0, 0, dyeW, dyeH);
      gl.bindFramebuffer(gl.FRAMEBUFFER, density.write.fbo);
      gl.uniform1i(gl.getUniformLocation(advectionProgram, 'u_velocity'), velocity.read.attach(0));
      gl.uniform1i(gl.getUniformLocation(advectionProgram, 'u_source'), density.read.attach(1));
      gl.uniform2f(gl.getUniformLocation(advectionProgram, 'u_texelSize'), 1.0 / dyeW, 1.0 / dyeH);
      gl.uniform1f(gl.getUniformLocation(advectionProgram, 'u_dt'), dt);
      gl.uniform1f(gl.getUniformLocation(advectionProgram, 'u_dissipation'), FLUID_CONFIG.densityDissipation);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      density.swap();

      // 9. Display pass to Screen Canvas
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.useProgram(displayProgram);
      bindQuad(displayProgram);
      gl.uniform1i(gl.getUniformLocation(displayProgram, 'u_dye'), density.read.attach(0));
      gl.uniform3f(
        gl.getUniformLocation(displayProgram, 'u_baseColor'),
        FLUID_CONFIG.baseColor[0],
        FLUID_CONFIG.baseColor[1],
        FLUID_CONFIG.baseColor[2]
      );
      gl.uniform3f(
        gl.getUniformLocation(displayProgram, 'u_ambientColor'),
        FLUID_CONFIG.ambientViolet[0],
        FLUID_CONFIG.ambientViolet[1],
        FLUID_CONFIG.ambientViolet[2]
      );
      gl.uniform1f(gl.getUniformLocation(displayProgram, 'u_brightness'), FLUID_CONFIG.brightness);
      gl.uniform1f(gl.getUniformLocation(displayProgram, 'u_bottomGlowIntensity'), FLUID_CONFIG.bottomGlowIntensity);
      gl.uniform1f(gl.getUniformLocation(displayProgram, 'u_edgeGlowIntensity'), FLUID_CONFIG.edgeGlowIntensity);
      gl.uniform1f(gl.getUniformLocation(displayProgram, 'u_centerDimming'), FLUID_CONFIG.centerDimming);
      gl.uniform1f(gl.getUniformLocation(displayProgram, 'u_grainIntensity'), FLUID_CONFIG.grainIntensity);
      gl.uniform1f(gl.getUniformLocation(displayProgram, 'u_time'), now * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    rafId = requestAnimationFrame(step);

    // ── Teardown and Cleanup on Unmount ───────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);

      // Clean WebGL resources
      const deleteFBO = (fbo: FBO) => {
        gl.deleteTexture(fbo.texture);
        gl.deleteFramebuffer(fbo.fbo);
      };
      deleteFBO(density.read);
      deleteFBO(density.write);
      deleteFBO(velocity.read);
      deleteFBO(velocity.write);
      deleteFBO(pressure.read);
      deleteFBO(pressure.write);
      deleteFBO(divergence);
      deleteFBO(curl);

      gl.deleteProgram(clearProgram);
      gl.deleteProgram(splatProgram);
      gl.deleteProgram(advectionProgram);
      gl.deleteProgram(divergenceProgram);
      gl.deleteProgram(curlProgram);
      gl.deleteProgram(vorticityProgram);
      gl.deleteProgram(pressureProgram);
      gl.deleteProgram(gradientSubtractProgram);
      gl.deleteProgram(displayProgram);
      gl.deleteBuffer(quadBuffer);
    };
  }, [prefersReducedMotion]);

  // Fallback for non-WebGL browsers or prefers-reduced-motion
  if (!hasWebGL || prefersReducedMotion) {
    return (
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none select-none -z-30 overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, #1f103d 0%, #0c0818 45%, #05050A 100%)',
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none -z-30 w-full h-full"
      style={{
        display: 'block',
      }}
    />
  );
}

export default FluidBackground;
