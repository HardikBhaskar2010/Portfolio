import { useEffect } from 'react';
import { ArrowUpRight, Terminal, Cpu, Layers, Shield, Activity, Boxes, Sparkles } from 'lucide-react';
import { initScrollTriggerContext } from '@/motion/scroll';
import { HighlightPoint } from '@/components/ui/HighlightPoint';

export function ScrollFlow() {
  useEffect(() => {
    let isMounted = true;
    let teardown: (() => void) | undefined;

    initScrollTriggerContext(({ gsap, ScrollTrigger, isDesktop }) => {
      if (!isDesktop) return;

      const panels = gsap.utils.toArray<HTMLElement>('.chapter-pin-panel');
      const archivePanel = document.querySelector<HTMLElement>('#archive-pan');
      const track = archivePanel?.querySelector<HTMLElement>('.archive-track');

      panels.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: 'top top',
          end: () => 'bottom top',
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
        });

        if (i === 0) {
          const busLinesX = panel.querySelectorAll<HTMLElement>('.architecture-bus-line-x');
          const busLinesY = panel.querySelectorAll<HTMLElement>('.architecture-bus-line-y');

          if (busLinesX.length > 0) {
            gsap.fromTo(
              busLinesX,
              { scaleX: 0 },
              {
                scaleX: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: panel,
                  start: 'top 80%',
                  end: 'top 30%',
                  scrub: 1,
                },
              }
            );
          }

          if (busLinesY.length > 0) {
            gsap.fromTo(
              busLinesY,
              { scaleY: 0 },
              {
                scaleY: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: panel,
                  start: 'top 75%',
                  end: 'top 25%',
                  scrub: 1,
                },
              }
            );
          }
        }

        const nextPanel = panels[i + 1] || archivePanel;
        if (nextPanel) {
          const inner = panel.querySelector<HTMLElement>('.chapter-inner');
          const dim = panel.querySelector<HTMLElement>('.chapter-dim');

          if (inner) {
            gsap.to(inner, {
              scale: 0.94,
              ease: 'none',
              scrollTrigger: {
                trigger: nextPanel,
                start: 'top bottom',
                end: 'top top',
                scrub: 1,
              },
            });
          }

          if (dim) {
            gsap.to(dim, {
              opacity: 0.5,
              ease: 'none',
              scrollTrigger: {
                trigger: nextPanel,
                start: 'top bottom',
                end: 'top top',
                scrub: 1,
              },
            });
          }
        }
      });

      if (archivePanel && track) {
        const getDistance = () => {
          return Math.max(0, track.scrollWidth - archivePanel.clientWidth + 96);
        };

        gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: archivePanel,
            start: 'top top',
            end: '+=1200',
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }
    }).then((cleanup) => {
      if (isMounted) {
        teardown = cleanup;
      } else {
        cleanup();
      }
    });

    return () => {
      isMounted = false;
      teardown?.();
    };
  }, []);

  return (
    <div className="relative w-full">
      {/* ── CHAPTER 1: FOUNDATIONS ── */}
      <section
        id="chapter-foundations"
        className="chapter-pin-panel relative w-full lg:min-h-screen bg-bg flex flex-col justify-center overflow-hidden z-10 border-t border-border/80"
      >
        <div className="chapter-dim pointer-events-none absolute inset-0 bg-bg opacity-0 z-20" />
        <div className="chapter-inner w-full max-w-[1240px] mx-auto px-6 md:px-12 py-16 lg:py-24">
          <div className="mb-8">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-cyan/90 block mb-2">
              Chapter 1: Foundations
            </span>
            <h2 className="font-display italic text-heading text-3xl sm:text-4xl lg:text-5xl tracking-tight">
              Bare-metal runtimes and deterministic operating systems.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Mahina OS Architecture Blueprint */}
            <div className="lg:col-span-7 bg-surface/50 border border-border/80 rounded-xl p-6 sm:p-8 backdrop-blur-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-display font-semibold text-heading">
                    Mahina OS
                  </h3>
                  <p className="text-sm font-mono text-cyan/80 mt-0.5">
                    Experimental OS Interface
                  </p>
                </div>
                <HighlightPoint id="luna-init-anchor" color="#00E5FF" label="FOUNDATIONS // MAHINA OS">
                  <div
                    id="luna-init-anchor"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-cyan/10 border border-cyan/30 text-cyan text-xs font-mono"
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                    <span>PID 1 luna-init active</span>
                  </div>
                </HighlightPoint>
              </div>

              <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-6 font-ui">
                Deterministic, lightweight, and AI-native operating system engineered on the discipline of documentation-first engineering.
              </p>

              {/* Subsystems Blueprint Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-card/60 border border-border/60">
                  <div className="flex items-center gap-2 text-xs font-mono text-heading mb-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan" />
                    <span className="font-semibold">luna-init</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-normal">
                    PID 1 Service Manager in C17 with deterministic DAG dependency solver.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-card/60 border border-border/60">
                  <div className="flex items-center gap-2 text-xs font-mono text-heading mb-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan" />
                    <span className="font-semibold">luna-splash</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-normal">
                    Zero-allocation early boot graphics directly on framebuffer device (/dev/fb0).
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-card/60 border border-border/60">
                  <div className="flex items-center gap-2 text-xs font-mono text-heading mb-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan" />
                    <span className="font-semibold">Luna Graphics Protocol</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-normal">
                    Compact display protocol and compositor with shared-memory buffer transport.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-card/60 border border-border/60">
                  <div className="flex items-center gap-2 text-xs font-mono text-heading mb-1.5">
                    <Shield className="w-3.5 h-3.5 text-cyan" />
                    <span className="font-semibold">Verification</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-normal">
                    Documentation-First Engineering with Limine bootloader protocol and hardened kernel.
                  </p>
                </div>
              </div>

              {/* Subsystems Interconnect Bus Blueprint */}
              <div className="mb-6 pt-5 border-t border-border/60">
                <div className="flex items-center justify-between text-[11px] font-mono text-cyan/90 uppercase tracking-wider mb-3">
                  <span>Architecture Interconnect Bus</span>
                  <span className="text-[10px] text-muted">Clock: Synchronous</span>
                </div>

                <div className="relative bg-card/40 border border-border/60 rounded-lg p-3.5 font-mono text-xs">
                  {/* Node 1: Limine Bootloader */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                      <span className="text-heading font-medium">Limine Bootloader</span>
                    </div>
                    <span className="text-[10px] text-muted font-mono">PORT 0x00</span>
                  </div>

                  {/* Bus Line Vertical 1 */}
                  <div className="my-2 ml-2 pl-4 relative h-6 flex items-center">
                    <div
                      className="architecture-bus-line-y absolute left-0 top-0 bottom-0 w-[1px] bg-cyan/60 origin-top"
                      style={{ transform: 'scaleY(1)' }}
                    />
                    <span className="text-[10px] text-muted">/dev/fb0 Framebuffer Handoff</span>
                  </div>

                  {/* Node 2: luna-init PID 1 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                      <span className="text-heading font-medium">luna-init (PID 1)</span>
                    </div>
                    <span className="text-[10px] text-muted font-mono">DAG SOLVER</span>
                  </div>

                  {/* Bus Line Horizontal to LGP */}
                  <div className="my-2 ml-2 pl-4 relative h-3 flex items-center">
                    <div
                      className="architecture-bus-line-x absolute left-0 top-1/2 w-full h-[1px] bg-cyan/60 origin-left"
                      style={{ transform: 'scaleX(1)' }}
                    />
                  </div>

                  {/* Node 3: Luna Graphics Protocol */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                      <span className="text-heading font-medium">Luna Graphics Protocol</span>
                    </div>
                    <span className="text-[10px] text-muted font-mono">SHM BUFFER</span>
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <a
                href="https://github.com/HardikBhaskar2010/MahinaOS"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono text-heading hover:text-cyan transition-colors"
              >
                <span>View repository source</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Right Column: Visual Artifact */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="relative rounded-xl border border-border overflow-hidden bg-card/60 aspect-[16/10]">
                <img
                  src="/images/project-mahina-os.webp"
                  alt="Mahina OS system screenshot"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                  decoding="async"
                  width={600}
                  height={375}
                />
              </div>

              <div className="p-4 rounded-xl bg-surface/30 border border-border/60 font-mono text-xs text-text-secondary space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted">Footprint:</span>
                  <span className="text-heading">Under 18 MB userland</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Toolchain:</span>
                  <span className="text-heading">C17 / Clang 18 / QEMU</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Cadence:</span>
                  <span className="text-heading">Active git commit pipeline</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CHAPTER 2: RUNTIME ── */}
      <section
        id="chapter-runtime"
        className="chapter-pin-panel relative w-full lg:min-h-screen bg-bg flex flex-col justify-center overflow-hidden z-20 border-t border-border/80"
      >
        <div className="chapter-dim pointer-events-none absolute inset-0 bg-bg opacity-0 z-20" />
        <div className="chapter-inner w-full max-w-[1240px] mx-auto px-6 md:px-12 py-16 lg:py-24">
          <div className="mb-8">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-cyan/90 block mb-2">
              Chapter 2: Runtime
            </span>
            <h2 className="font-display italic text-heading text-3xl sm:text-4xl lg:text-5xl tracking-tight">
              Autonomous browser workstation and native developer tooling.
            </h2>
          </div>

          <div className="bg-surface/50 border border-border/80 rounded-xl p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-display font-semibold text-heading">
                  KAGE (影)
                </h3>
                <p className="text-sm font-mono text-cyan/80 mt-0.5">
                  Developer-First Autonomous Browser & Workstation
                </p>
              </div>
              <HighlightPoint id="kage-runtime-anchor" color="#00E5FF" label="RUNTIME // KAGE BROWSER">
                <div
                  id="kage-runtime-anchor"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-cyan/10 border border-cyan/30 text-cyan text-xs font-mono"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                  <span>CDP Tool Bus active</span>
                </div>
              </HighlightPoint>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-6">
              <div className="lg:col-span-7 space-y-4">
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-ui">
                  Independent desktop browser and instrumentation workstation fusing web standards execution, deep runtime DevTools, and an autonomous AI agent into a singular developer environment.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-lg bg-card/60 border border-border/60">
                    <span className="text-xs font-mono font-semibold text-heading block mb-1">
                      Tauri v2 + CEF 152
                    </span>
                    <p className="text-xs text-text-secondary leading-normal">
                      Native parent HWND orchestration with zero-cost Rust FFI bindings and sandboxed isolation.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-card/60 border border-border/60">
                    <span className="text-xs font-mono font-semibold text-heading block mb-1">
                      Rust Tool Bus
                    </span>
                    <p className="text-xs text-text-secondary leading-normal">
                      Two-stage execution gate and append-only SQLite ledger with SHA-256 chain hashes.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-card/60 border border-border/60">
                    <span className="text-xs font-mono font-semibold text-heading block mb-1">
                      CDP WebSocket Engine
                    </span>
                    <p className="text-xs text-text-secondary leading-normal">
                      Direct developer port bridge multiplexing DOM, CSS, Network, and Runtime domains.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-card/60 border border-border/60">
                    <span className="text-xs font-mono font-semibold text-heading block mb-1">
                      Context Engine
                    </span>
                    <p className="text-xs text-text-secondary leading-normal">
                      Token-budgeted semantic slice extraction with automated privacy sanitization.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative rounded-xl border border-border overflow-hidden bg-card/60 aspect-[16/10]">
                  <img
                    src="/images/project-kage.webp"
                    alt="KAGE Browser interface"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    width={600}
                    height={375}
                  />
                </div>
              </div>
            </div>

            <a
              href="https://github.com/HardikBhaskar2010/Kage"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono text-heading hover:text-cyan transition-colors"
            >
              <span>Inspect KAGE architecture</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ── CHAPTER 3: INTELLIGENCE ── */}
      <section
        id="chapter-intelligence"
        className="chapter-pin-panel relative w-full lg:min-h-screen bg-bg flex flex-col justify-center overflow-hidden z-30 border-t border-border/80"
      >
        <div className="chapter-dim pointer-events-none absolute inset-0 bg-bg opacity-0 z-20" />
        <div className="chapter-inner w-full max-w-[1240px] mx-auto px-6 md:px-12 py-16 lg:py-24">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-cyan/90 block mb-2">
                Chapter 3: Intelligence
              </span>
              <h2 className="font-display italic text-heading text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                Local perception engines, sovereign memory, and multi-agent DAGs.
              </h2>
            </div>
            <HighlightPoint id="intelligence-hub-anchor" color="#00E5FF" label="INTELLIGENCE // HUB">
              <div
                id="intelligence-hub-anchor"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-cyan/10 border border-cyan/30 text-cyan text-xs font-mono"
              >
                <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                <span>Intelligence Hub connected</span>
              </div>
            </HighlightPoint>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Vectoris */}
            <div className="bg-surface/50 border border-border/80 rounded-xl p-6 backdrop-blur-sm flex flex-col justify-between">
              <div>
                <div className="relative rounded-lg border border-border overflow-hidden bg-card/60 aspect-[16/10] mb-4">
                  <img
                    src="/images/project-vectoris.webp"
                    alt="Vectoris Engineering Workstation"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={250}
                  />
                </div>
                <h3 className="text-lg font-display font-semibold text-heading mb-1">
                  Vectoris
                </h3>
                <p className="text-xs font-mono text-cyan/80 mb-3">
                  AI-Native Engineering & Takeoff Workstation
                </p>
                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                  Hardware-accelerated local parsing, deterministic geometry extraction, and AI-assisted conductor sizing directly on workstation hardware.
                </p>
              </div>
              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-card border border-border/60 text-text-secondary">
                    Tauri v2
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-card border border-border/60 text-text-secondary">
                    Rust
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-card border border-border/60 text-text-secondary">
                    Local AI
                  </span>
                </div>
                <a
                  href="https://github.com/VectorisAI/Vectoris"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-heading hover:text-cyan transition-colors"
                >
                  <span>Explore Vectoris</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Card 2: Veronica AI */}
            <div className="bg-surface/50 border border-border/80 rounded-xl p-6 backdrop-blur-sm flex flex-col justify-between">
              <div>
                <div className="relative rounded-lg border border-border overflow-hidden bg-card/60 aspect-[16/10] mb-4">
                  <img
                    src="/images/project-ai-veronica.webp"
                    alt="Veronica AI System"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={250}
                  />
                </div>
                <h3 className="text-lg font-display font-semibold text-heading mb-1">
                  Veronica AI
                </h3>
                <p className="text-xs font-mono text-cyan/80 mb-3">
                  Conversational AI System
                </p>
                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                  Sovereign local-first computing model with Windows system-level awareness, centralized semantic memory knowledge graph, and sub-50ms local memory retrieval.
                </p>
              </div>
              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-card border border-border/60 text-text-secondary">
                    FastAPI
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-card border border-border/60 text-text-secondary">
                    Python
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-card border border-border/60 text-text-secondary">
                    SQLite FTS5
                  </span>
                </div>
                <a
                  href="https://github.com/HardikBhaskar2010/Veronica-AI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-heading hover:text-cyan transition-colors"
                >
                  <span>Explore Veronica</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Card 3: AEGIS Platform */}
            <div className="bg-surface/50 border border-border/80 rounded-xl p-6 backdrop-blur-sm flex flex-col justify-between">
              <div>
                <div className="relative rounded-lg border border-border overflow-hidden bg-card/60 aspect-[16/10] mb-4">
                  <img
                    src="/images/project-aegis.webp"
                    alt="AEGIS Decision Intelligence Platform"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={250}
                  />
                </div>
                <h3 className="text-lg font-display font-semibold text-heading mb-1">
                  AEGIS
                </h3>
                <p className="text-xs font-mono text-cyan/80 mb-3">
                  AI Decision Intelligence Platform
                </p>
                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                  Asynchronous multi-agent Directed Acyclic Graphs via Google ADK 2.0 with BigQuery analytical querying via Model Context Protocol (MCP).
                </p>
              </div>
              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-card border border-border/60 text-text-secondary">
                    Google ADK
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-card border border-border/60 text-text-secondary">
                    BigQuery
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-card border border-border/60 text-text-secondary">
                    Vertex AI
                  </span>
                </div>
                <a
                  href="https://github.com/HardikBhaskar2010/AEGIS-Decision-Intelligence-Platform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-heading hover:text-cyan transition-colors"
                >
                  <span>Explore AEGIS</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ARCHIVE PAN: REMAINING SYSTEMS (Horizontal Filmstrip >= 1024px) ── */}
      <section
        id="archive-pan"
        className="relative w-full lg:min-h-screen bg-bg flex flex-col justify-center overflow-hidden z-40 border-t border-border/80"
      >
        <div className="w-full max-w-[1240px] mx-auto px-6 md:px-12 py-16 lg:py-24">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-cyan/90 block mb-2">
                Archive pan: Remaining systems
              </span>
              <h2 className="font-display italic text-heading text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                Interactive learning platforms and exploratory systems prototypes.
              </h2>
            </div>
            <HighlightPoint id="project-track-anchor" color="#F59E0B" label="ARCHIVE // REMAINING SYSTEMS">
              <div
                id="project-track-anchor"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-cyan/10 border border-cyan/30 text-cyan text-xs font-mono"
              >
                <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                <span>Archive filmstrip active</span>
              </div>
            </HighlightPoint>
          </div>

          <div className="w-full overflow-hidden">
            <div className="archive-track flex flex-col lg:flex-row gap-6 w-full lg:w-max will-change-transform">
              {/* Card 1: STEM Idea Adventure */}
              <div className="w-full lg:w-[420px] flex-shrink-0 bg-surface/50 border border-border/80 rounded-xl p-6 backdrop-blur-sm flex flex-col justify-between">
                <div>
                  <div className="relative rounded-lg border border-border overflow-hidden bg-card/60 aspect-[16/10] mb-4">
                    <img
                      src="/images/project-stem-adventure.webp"
                      alt="STEM Idea Adventure learning platform"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      width={420}
                      height={262}
                    />
                  </div>
                  <h3 className="text-lg font-display font-semibold text-heading mb-1">
                    STEM Idea Adventure
                  </h3>
                  <p className="text-xs font-mono text-cyan/80 mb-3">
                    Interactive Learning Platform
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed mb-4">
                    AI-powered STEM idea generator that creates personalized science experiments, engineering challenges, and learning paths for K-12 students using multi-agent AI.
                  </p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-card border border-border/60 text-text-secondary">
                      React
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-card border border-border/60 text-text-secondary">
                      TypeScript
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-card border border-border/60 text-text-secondary">
                      FastAPI
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-card border border-border/60 text-text-secondary">
                      Google ADK
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <a
                      href="https://stemidea.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-heading hover:text-cyan transition-colors"
                    >
                      <span>Live Platform</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href="https://github.com/HardikBhaskar2010/STEM-IDEA-GENERATOR"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-text-secondary hover:text-heading transition-colors"
                    >
                      <span>Repository</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Card 2: Systems Architecture Laboratory */}
              <div className="w-full lg:w-[420px] flex-shrink-0 bg-surface/50 border border-border/80 rounded-xl p-6 backdrop-blur-sm flex flex-col justify-between">
                <div>
                  <div className="relative rounded-lg border border-border overflow-hidden bg-card/60 aspect-[16/10] mb-4 flex items-center justify-center p-6 bg-gradient-to-br from-surface to-card">
                    <div className="text-center font-mono">
                      <Terminal className="w-8 h-8 text-cyan mx-auto mb-2 opacity-80" />
                      <span className="text-xs text-text-secondary block">Systems Prototype Lab</span>
                      <span className="text-[10px] text-muted block mt-1">C17 / Rust / ASM</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-display font-semibold text-heading mb-1">
                    Systems Prototype Lab
                  </h3>
                  <p className="text-xs font-mono text-cyan/80 mb-3">
                    Low-Level Runtimes & Kernels
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed mb-4">
                    Exploratory prototypes across bare-metal bootloaders, zero-allocation display pipelines, memory-mapped shared buffers, and hardened kernel configurations.
                  </p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-card border border-border/60 text-text-secondary">
                      C17
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-card border border-border/60 text-text-secondary">
                      Rust
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-card border border-border/60 text-text-secondary">
                      Assembly
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-card border border-border/60 text-text-secondary">
                      Limine
                    </span>
                  </div>
                  <a
                    href="/projects"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-heading hover:text-cyan transition-colors"
                  >
                    <span>Inspect Lab Work</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Card 3: Complete Project Index */}
              <div className="w-full lg:w-[420px] flex-shrink-0 bg-surface/50 border border-border/80 rounded-xl p-6 backdrop-blur-sm flex flex-col justify-between">
                <div>
                  <div className="relative rounded-lg border border-border overflow-hidden bg-card/60 aspect-[16/10] mb-4 flex items-center justify-center p-6 bg-gradient-to-br from-surface to-card">
                    <div className="text-center font-mono">
                      <Boxes className="w-8 h-8 text-cyan mx-auto mb-2 opacity-80" />
                      <span className="text-xs text-text-secondary block">Full Project Index</span>
                      <span className="text-[10px] text-muted block mt-1">6 Production Systems</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-display font-semibold text-heading mb-1">
                    Complete Systems Archive
                  </h3>
                  <p className="text-xs font-mono text-cyan/80 mb-3">
                    Verified Production Repositories
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed mb-4">
                    In-depth case studies, formal architectural specifications, benchmark verification tables, and complete source repositories across all shipped projects.
                  </p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-card border border-border/60 text-text-secondary">
                      6 Systems
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-card border border-border/60 text-text-secondary">
                      Case Studies
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-card border border-border/60 text-text-secondary">
                      Benchmarks
                    </span>
                  </div>
                  <a
                    href="/projects"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-heading hover:text-cyan transition-colors"
                  >
                    <span>View All Systems</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
