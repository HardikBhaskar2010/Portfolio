import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ExternalLink, Terminal, Cpu, Bot, Shield, Layers, Sparkles } from 'lucide-react';
import type { Project } from '@/data/projects';
import { playHoverTick, playClick } from '@/lib/audio';
import { useHighlightStore } from '@/store/highlightStore';

const PROJECT_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'vectoris': Terminal,
  'veronica-ai': Bot,
  'stem-idea-generator': Layers,
  'aegis-decision-intelligence-platform': Shield,
  'mahinaos': Cpu,
};

interface ProjectGridCardProps {
  project: Project;
  index: number;
}

export function ProjectGridCard({ project, index }: ProjectGridCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const num = String(index + 1).padStart(2, '0');
  const Icon = PROJECT_ICONS[project.slug] || Sparkles;

  const githubUrl = project.repoUrl || (project.link?.includes('github.com') ? project.link : undefined);
  const liveUrl = project.link && !project.link.includes('github.com') ? project.link : undefined;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => {
        setIsHovered(true);
        playHoverTick();
        useHighlightStore.getState().setOverride(project.color, `${project.title.toUpperCase()} // ACTIVE`);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        useHighlightStore.getState().setOverride(null);
      }}
      className="group relative flex flex-col justify-between rounded-[24px] lg:rounded-[28px] border border-white/10 bg-[#09090E]/90 backdrop-blur-md p-6 lg:p-8 transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-black/60"
    >
      {/* Ambient background glow matching project accent color */}
      <div
        className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-20"
        style={{ backgroundColor: project.color }}
      />

      {/* ── Card Header: Number, Category & Year ── */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-semibold text-muted/60 tracking-wider">
            #{num}
          </span>
          <div
            className="flex h-6 w-6 items-center justify-center rounded-md text-xs"
            style={{
              backgroundColor: `${project.color}18`,
              color: project.color,
            }}
          >
            <Icon size={13} />
          </div>
          <span className="font-ui text-[11px] uppercase tracking-wider text-cyan bg-cyan/10 border border-cyan/25 px-2.5 py-0.5 rounded-full font-medium">
            {project.category}
          </span>
        </div>

        <span className="font-mono text-xs text-muted/70 tracking-widest">
          {project.year}
        </span>
      </div>

      {/* ── Visual Media Preview ── */}
      <Link
        to={`/projects/${project.slug}`}
        onClick={() => playClick()}
        className="relative block aspect-[16/10] w-full overflow-hidden rounded-xl lg:rounded-2xl border border-white/10 bg-black/40 mb-6 group/img"
      >
        <img
          src={project.image}
          alt={project.title}
          width={600}
          height={375}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-105"
          onError={(e) => {
            const target = e.currentTarget;
            if (project.fallbackImage && !target.src.endsWith(project.fallbackImage)) {
              target.src = project.fallbackImage;
            } else {
              target.src = '/images/project-placeholder.webp';
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover/img:opacity-40" />

        {/* Hover overlay hint */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-xs text-heading border border-white/15 opacity-0 transition-opacity duration-300 group-hover/img:opacity-100">
          <span>Case Study</span>
          <ArrowUpRight size={13} className="text-cyan" />
        </div>
      </Link>

      {/* ── Content: Title, Subtitle, Description ── */}
      <div className="flex-1 flex flex-col">
        <Link
          to={`/projects/${project.slug}`}
          onClick={() => playClick()}
          className="group/title inline-block mb-2"
        >
          <h3 className="font-display italic text-2xl lg:text-3xl text-heading font-semibold tracking-tight transition-colors duration-200 group-hover/title:text-cyan flex items-center gap-2">
            <span>{project.title}</span>
            <ArrowUpRight
              size={18}
              className="opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 group-hover/title:opacity-100 group-hover/title:translate-x-0 group-hover/title:translate-y-0 text-cyan"
            />
          </h3>
        </Link>

        <p className="font-ui text-xs lg:text-sm font-medium text-cyan/90 mb-2.5">
          {project.subtitle}
        </p>

        <p className="font-ui text-xs lg:text-sm text-muted leading-relaxed line-clamp-3 mb-6">
          {project.description}
        </p>
      </div>

      {/* ── Footer: Tech Stack Tags & Action Links ── */}
      <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1.5">
          {project.tools.map((tool) => (
            <span
              key={tool}
              className="font-mono text-[11px] text-muted/80 bg-white/[0.04] hover:bg-white/[0.08] hover:text-heading px-2 py-0.5 rounded-md border border-white/5 transition-colors"
            >
              {tool}
            </span>
          ))}
        </div>

        {/* External links and explore CTA */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <Link
            to={`/projects/${project.slug}`}
            onClick={() => playClick()}
            className="inline-flex items-center gap-1.5 font-ui text-xs font-semibold text-cyan hover:text-white transition-colors"
          >
            <span>Explore Case Study</span>
            <ArrowUpRight size={14} />
          </Link>

          <div className="flex items-center gap-2">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClick()}
                className="inline-flex items-center gap-1 font-ui text-xs text-muted hover:text-heading transition-colors px-2.5 py-1 rounded-full border border-white/10 hover:border-white/20 bg-white/[0.02]"
                title="Open Live Deployment"
              >
                <span>Live Site</span>
                <ExternalLink size={11} />
              </a>
            )}

            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClick()}
                className="inline-flex items-center gap-1 font-ui text-xs text-muted hover:text-heading transition-colors px-2.5 py-1 rounded-full border border-white/10 hover:border-white/20 bg-white/[0.02]"
                title="View Source on GitHub"
              >
                <span>Code</span>
                <ExternalLink size={11} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
