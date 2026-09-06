import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Terminal, Cpu, Sparkles, Layers, Shield, Bot } from 'lucide-react';
import type { Project } from '@/data/projects';
import { playHoverTick, playSynthPulse } from '@/lib/audio';

interface ExpandedProjectCardsProps {
  projects: Project[];
}

const PROJECT_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'vectoris': Terminal,
  'veronica-ai': Bot,
  'stem-idea-generator': Layers,
  'aegis-decision-intelligence-platform': Shield,
  'mahinaos': Cpu,
};

export function ExpandedProjectCards({ projects }: ExpandedProjectCardsProps) {
  // Default to the first project or middle project
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Take top 5 projects for the 5-sliver rail
  const railProjects = projects.slice(0, 5);

  return (
    <div className="w-full select-none" ref={containerRef}>
      {/* Desktop / Tablet: Rail of Tall Slivers */}
      <div className="hidden md:flex gap-3 lg:gap-4 h-[560px] lg:h-[620px] w-full items-stretch">
        {railProjects.map((project, index) => {
          const isActive = index === activeIndex;
          const num = String(index + 1).padStart(2, '0');
          const Icon = PROJECT_ICONS[project.slug] || Sparkles;

          return (
            <motion.div
              key={project.id}
              layout
              transition={{
                layout: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
              }}
              onMouseEnter={() => {
                if (index !== activeIndex) {
                  playSynthPulse();
                  setActiveIndex(index);
                }
              }}
              className={`relative rounded-[28px] lg:rounded-[32px] overflow-hidden border transition-colors duration-500 cursor-pointer ${
                isActive
                  ? 'flex-[3.6] lg:flex-[4.2] border-white/20 bg-surface shadow-2xl shadow-black/80'
                  : 'flex-[0.65] lg:flex-[0.75] border-white/5 bg-[#09090b] hover:border-white/15'
              }`}
            >
              {/* Entire card is clickable to project detail */}
              <Link
                to={`/project/${project.slug}`}
                className="absolute inset-0 z-20 flex flex-col justify-between p-5 lg:p-7"
              >
                {/* ── Top row: Number and Status ── */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`font-mono text-xs font-semibold tracking-widest transition-colors duration-300 ${
                      isActive ? 'text-heading' : 'text-muted/60'
                    }`}
                  >
                    {num}
                  </span>

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <span className="font-ui text-[10px] uppercase tracking-widest text-cyan bg-cyan/10 border border-cyan/30 px-3 py-1 rounded-full">
                        {project.category}
                      </span>
                      <div className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.05] flex items-center justify-center text-heading group-hover:border-cyan transition-colors">
                        <ArrowUpRight size={14} />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* ── Center Artwork (Active vs Sliver Teaser) ── */}
                {isActive ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="relative my-auto w-full h-[62%] rounded-2xl overflow-hidden border border-white/10 shadow-inner group"
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      width={600}
                      height={375}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (project.fallbackImage && !target.src.endsWith(project.fallbackImage)) {
                          target.src = project.fallbackImage;
                        } else {
                          target.src = '/images/project-placeholder.png';
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent opacity-40" />

                    {/* Ambient glow in project's accent color */}
                    <div
                      className="absolute -bottom-8 -right-8 w-44 h-44 rounded-full blur-3xl opacity-30 pointer-events-none"
                      style={{ backgroundColor: project.color }}
                    />
                  </motion.div>
                ) : (
                  <div className="absolute inset-0 -z-10 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      width={400}
                      height={500}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover opacity-25 filter grayscale contrast-125"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (project.fallbackImage && !target.src.endsWith(project.fallbackImage)) {
                          target.src = project.fallbackImage;
                        } else {
                          target.src = '/images/project-placeholder.png';
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-black/60" />
                  </div>
                )}

                {/* ── Bottom: Description & Title (Strictly fixed layout so text never rewraps) ── */}
                <div className="w-full overflow-hidden">
                  {isActive ? (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.15 }}
                      className="w-full max-w-[540px]"
                    >
                      <p className="font-ui text-sm lg:text-base text-muted/90 line-clamp-2 leading-relaxed mb-4">
                        {project.description}
                      </p>

                      <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: `${project.color}20`,
                            color: project.color,
                          }}
                        >
                          <Icon size={15} />
                        </div>
                        <h3 className="font-display italic text-lg lg:text-xl text-heading font-semibold tracking-tight truncate">
                          {project.title}
                        </h3>
                        <span className="ml-auto font-ui text-xs text-cyan flex items-center gap-1">
                          View Project
                          <ArrowUpRight size={13} />
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 pb-2">
                      <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-muted/60">
                        <Icon size={14} />
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-muted/40 [writing-mode:vertical-rl] rotate-180 truncate max-h-[100px]">
                        {project.title}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile: Accordion / Stack */}
      <div className="flex flex-col gap-3 md:hidden">
        {railProjects.map((project, index) => {
          const isActive = index === activeIndex;
          const num = String(index + 1).padStart(2, '0');
          const Icon = PROJECT_ICONS[project.slug] || Sparkles;

          return (
            <div
              key={project.id}
              onClick={() => {
                playHoverTick();
                setActiveIndex(index);
              }}
              className={`rounded-2xl border overflow-hidden transition-all ${
                isActive
                  ? 'border-cyan/40 bg-surface'
                  : 'border-white/10 bg-[#09090b]'
              }`}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-cyan font-semibold">{num}</span>
                  <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-muted">
                    <Icon size={12} />
                  </div>
                  <span className="font-display italic text-base text-heading">{project.title}</span>
                </div>
                <span className="text-xs font-mono text-muted">{project.category}</span>
              </div>

              {isActive && (
                <div className="px-4 pb-4 flex flex-col gap-3">
                  <div className="aspect-[16/9] rounded-xl overflow-hidden border border-white/10 relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      width={400}
                      height={225}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (project.fallbackImage && !target.src.endsWith(project.fallbackImage)) {
                          target.src = project.fallbackImage;
                        } else {
                          target.src = '/images/project-placeholder.png';
                        }
                      }}
                    />
                  </div>
                  <p className="font-ui text-xs text-muted leading-relaxed">
                    {project.description}
                  </p>
                  <Link
                    to={`/project/${project.slug}`}
                    className="w-full py-2.5 rounded-xl bg-cyan text-bg font-ui font-medium text-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Explore Project</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
