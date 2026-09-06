import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, GitBranch, Terminal } from 'lucide-react';
import type { Project } from '@/data/projects';
import { playHoverTick, playSynthPulse } from '@/lib/audio';

interface StackingProjectCardsProps {
  projects: Project[];
}

export function StackingProjectCards({ projects }: StackingProjectCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress of the entire stack sequence
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={containerRef} className="relative w-full">
      {projects.map((project, index) => {
        // Target scale: earlier cards scale down more as new cards stack over them
        const targetScale = Math.max(0.85, 1 - (projects.length - index) * 0.035);
        // Scaling starts as the card is being covered by subsequent cards
        const range = [index * (1 / projects.length), 1];

        return (
          <StackingCard
            key={project.id}
            project={project}
            index={index}
            total={projects.length}
            progress={scrollYProgress}
            range={range}
            targetScale={targetScale}
          />
        );
      })}
    </div>
  );
}

interface StackingCardProps {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  range: number[];
  targetScale: number;
}

function StackingCard({
  project,
  index,
  total,
  progress,
  range,
  targetScale,
}: StackingCardProps) {
  // Smoothly scale down and subtly dim as newer cards slide over
  const scale = useTransform(progress, range, [1, targetScale]);
  const dim = useTransform(progress, range, [0, 0.4]);

  const padIndex = String(index + 1).padStart(2, '0');
  const padTotal = String(total).padStart(2, '0');
  const accentColor = project.color || '#00E5FF';

  return (
    <div className="h-screen flex items-center justify-center sticky top-0 px-2 sm:px-4 md:px-6">
      <motion.div
        style={{
          scale,
          top: `calc(10px + ${index * 26}px)`,
          transformOrigin: 'top center',
          zIndex: 10 + index,
        }}
        className="relative w-full max-w-[1050px] h-[520px] md:h-[540px] rounded-2xl md:rounded-3xl border border-white/[0.12] bg-[#0c0e14]/95 backdrop-blur-2xl overflow-hidden shadow-[0_-22px_60px_-15px_rgba(0,0,0,0.92),0_30px_80px_-15px_rgba(0,0,0,0.95)] transition-colors duration-300 hover:border-white/20"
      >
        {/* Top cardstock illuminated edge highlight */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] z-20 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${accentColor} 30%, #ffffff 50%, ${accentColor} 70%, transparent 100%)`,
            opacity: 0.85,
          }}
        />

        {/* Ambient background glow matching project accent */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />

        {/* Darkening overlay when covered by subsequent cards */}
        <motion.div
          style={{ opacity: dim }}
          className="absolute inset-0 bg-black pointer-events-none z-30 transition-opacity"
        />

        {/* ── CARD HEADER BAR (Deck Tab) ── */}
        <div className="flex items-center justify-between px-5 py-3 md:px-8 md:py-4 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] md:text-xs text-muted font-medium tracking-wider">
              DECK [{padIndex} / {padTotal}]
            </span>
            <span className="text-white/20">|</span>
            <span
              className="font-ui text-[10px] md:text-xs font-semibold tracking-widest uppercase px-2.5 py-0.5 rounded-full border"
              style={{
                color: accentColor,
                borderColor: `${accentColor}33`,
                backgroundColor: `${accentColor}12`,
              }}
            >
              {project.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            <span className="font-mono text-[10px] md:text-xs text-muted">{project.year}</span>
          </div>
        </div>

        {/* ── CARD CONTENT BODY (2-col Layout matching reference) ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 p-5 md:p-8 lg:p-10 items-center h-[calc(100%-52px)]">
          {/* Left Column: Authentic Screenshot (6 cols) */}
          <div className="md:col-span-6 h-full flex items-center">
            <Link
              to={`/project/${project.slug}`}
              onClick={() => playSynthPulse()}
              onMouseEnter={playHoverTick}
              className="group/img block w-full h-[220px] sm:h-[260px] md:h-full max-h-[380px] relative rounded-xl md:rounded-2xl border border-white/10 bg-black/60 overflow-hidden shadow-2xl transition-all duration-300 hover:border-white/25"
            >
              {/* Live Badge */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted font-medium">
                  Verified Artifact
                </span>
              </div>

              {/* Screenshot */}
              <StackingCardImg
                src={project.image}
                fallback={project.fallbackImage}
                alt={`${project.title} screenshot`}
              />

              {/* Glass reflection and hover prompt overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40 group-hover/img:opacity-20 transition-opacity" />
              
              <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
                <span className="px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/15 font-ui text-xs text-heading flex items-center gap-1.5">
                  Open Documentation <ArrowUpRight size={13} />
                </span>
              </div>
            </Link>
          </div>

          {/* Right Column: Details & Tech (6 cols) */}
          <div className="md:col-span-6 flex flex-col justify-between h-full py-1">
            <div>
              {/* Tagline */}
              <div className="flex items-center gap-2 mb-2">
                <Terminal size={13} style={{ color: accentColor }} />
                <span className="font-mono text-[11px] text-muted tracking-wide">
                  {project.tag || 'SYSTEMS ARCHITECTURE'}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display italic text-heading text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.05]">
                <Link
                  to={`/project/${project.slug}`}
                  onClick={() => playSynthPulse()}
                  onMouseEnter={playHoverTick}
                  className="hover:text-cyan transition-colors"
                >
                  {project.title}
                </Link>
              </h3>

              {/* Subtitle */}
              <p className="font-heading font-medium text-heading/85 text-sm md:text-base mt-2">
                {project.subtitle}
              </p>

              {/* Description */}
              <p className="font-ui text-body text-xs md:text-sm leading-relaxed mt-3 max-w-lg line-clamp-3 md:line-clamp-4">
                {project.description}
              </p>

              {/* Languages & Core Tech Stack Pills */}
              <div className="mt-5 flex flex-wrap gap-1.5 md:gap-2">
                {project.tools.map((tool) => {
                  const isCoreLang = ['Rust', 'C++', 'C', 'Assembly (x86_64)', 'Python', 'TypeScript', 'Tauri v2'].includes(tool);
                  return (
                    <span
                      key={tool}
                      className={`font-mono text-[10px] md:text-xs px-2.5 py-1 rounded-md border transition-colors ${
                        isCoreLang
                          ? 'bg-white/[0.08] text-heading font-semibold border-white/25'
                          : 'bg-white/[0.02] text-muted border-white/[0.08]'
                      }`}
                    >
                      {tool}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center flex-wrap gap-3">
              <Link
                to={`/project/${project.slug}`}
                onClick={() => playSynthPulse()}
                onMouseEnter={playHoverTick}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-ui text-xs md:text-sm font-semibold bg-cyan text-bg hover:bg-cyan/90 transition-all active:scale-[0.97] shadow-sm"
              >
                <span>View Project</span>
                <ArrowUpRight size={15} />
              </Link>

              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={playHoverTick}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-ui text-xs md:text-sm text-heading bg-white/[0.04] border border-white/10 hover:border-white/20 hover:bg-white/[0.08] transition-all active:scale-[0.97]"
                >
                  <GitBranch size={13} className="text-muted" />
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StackingCardImg({
  src,
  fallback,
  alt,
}: {
  src: string;
  fallback?: string;
  alt: string;
}) {
  const FALLBACK = '/images/project-placeholder.webp';
  const [imgSrc, setImgSrc] = useState<string>(src || fallback || FALLBACK);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src || fallback || FALLBACK);
    setHasError(false);
  }, [src, fallback]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      width={500}
      height={312}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (!hasError && fallback && imgSrc !== fallback) {
          setImgSrc(fallback);
          setHasError(true);
        } else {
          setImgSrc(FALLBACK);
        }
      }}
      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover/img:scale-[1.03]"
    />
  );
}
