import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  GitBranch,
  Layers,
  Sparkles,
  Calendar,
  Cpu
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { Tag } from '@/components/ui/Tag';
import { ContactSection } from '@/components/sections/ContactSection';
import { projects } from '@/data/projects';
import { pageEnter, stagger, fadeUp, scaleIn } from '@/lib/motion';
import { track } from '@/lib/analytics';
import { playHoverTick, playClick, playSynthPulse } from '@/lib/audio';

// ── Markdown → Rich JSX Renderer ──────────────────────────────────────────
function MarkdownBody({ md, accentColor }: { md: string; accentColor: string }) {
  const lines = md.split('\n');
  const elements: React.ReactNode[] = [];
  let bulletItems: string[] = [];
  let numberedItems: string[] = [];
  let key = 0;

  const flushLists = () => {
    if (bulletItems.length) {
      elements.push(
        <ul key={key++} className="space-y-3 font-ui text-body text-base leading-relaxed mb-8">
          {bulletItems.map((li, i) => (
            <li key={i} className="flex items-start gap-3 group">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0 transition-transform group-hover:scale-125"
                style={{ backgroundColor: accentColor }}
              />
              <div className="flex-1 text-muted/95 leading-relaxed">
                {renderInline(li)}
              </div>
            </li>
          ))}
        </ul>
      );
      bulletItems = [];
    }

    if (numberedItems.length) {
      elements.push(
        <ol key={key++} className="space-y-3 font-ui text-body text-base leading-relaxed mb-8">
          {numberedItems.map((item, i) => (
            <li key={i} className="flex items-start gap-3.5 group">
              <span
                className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md mt-0.5 flex-shrink-0 border"
                style={{
                  color: accentColor,
                  borderColor: `${accentColor}40`,
                  backgroundColor: `${accentColor}12`
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 text-muted/95 leading-relaxed">
                {renderInline(item)}
              </div>
            </li>
          ))}
        </ol>
      );
      numberedItems = [];
    }
  };

  const renderInline = (text: string): React.ReactNode => {
    // Check if line has a key term before colon like "Curriculum Calibration Agent: description"
    const colonMatch = text.match(/^([A-Za-z0-9\s()_\-./]+):\s*(.*)$/);
    if (colonMatch && !colonMatch[1].includes('http')) {
      const [, label, rest] = colonMatch;
      return (
        <>
          <strong className="text-heading font-medium tracking-tight mr-1.5">{label}:</strong>
          {renderInlineTokens(rest)}
        </>
      );
    }
    return renderInlineTokens(text);
  };

  const renderInlineTokens = (text: string): React.ReactNode => {
    // Regex matches inline code `code`, bold **bold**, or italic *italic*
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            className="font-mono text-xs px-2 py-0.5 rounded border border-white/10 bg-white/[0.05] text-cyan/95 mx-1"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="text-heading font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="text-muted/80">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    // Blank line — flush any active lists
    if (!line.trim()) {
      flushLists();
      continue;
    }

    // Top-level document title (# Title) - skipped since page hero already displays it prominently
    if (line.match(/^#\s+/)) {
      flushLists();
      continue;
    }

    // Section header (## Heading)
    const h2 = line.match(/^##\s+(.*)/);
    if (h2) {
      flushLists();
      elements.push(
        <div key={key++} className="mt-12 mb-6 pt-6 border-t border-border/70">
          <div className="flex items-center gap-3 mb-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <h2 className="font-display italic text-heading text-2xl md:text-3xl">
              {h2[1]}
            </h2>
          </div>
        </div>
      );
      continue;
    }

    // Subsection header (### Heading)
    const h3 = line.match(/^###\s+(.*)/);
    if (h3) {
      flushLists();
      elements.push(
        <h3
          key={key++}
          className="font-heading font-semibold text-heading text-lg md:text-xl mt-8 mb-3 flex items-center gap-2"
        >
          <span className="text-xs font-mono text-muted/60 tracking-wider">§</span>
          {h3[1]}
        </h3>
      );
      continue;
    }

    // Numbered list items (e.g. "1. Item")
    const num = line.match(/^\d+\.\s+(.*)/);
    if (num) {
      if (bulletItems.length) flushLists();
      numberedItems.push(num[1]);
      continue;
    }

    // Bullet list items (e.g. "- Item" or "* Item")
    const bullet = line.match(/^[-*]\s+(.*)/);
    if (bullet) {
      if (numberedItems.length) flushLists();
      bulletItems.push(bullet[1]);
      continue;
    }

    // Blockquote
    const quote = line.match(/^>\s+(.*)/);
    if (quote) {
      flushLists();
      elements.push(
        <blockquote
          key={key++}
          className="border-l-2 pl-4 py-2 my-6 font-ui italic text-muted/90 bg-white/[0.02] rounded-r-lg"
          style={{ borderColor: accentColor }}
        >
          {renderInline(quote[1])}
        </blockquote>
      );
      continue;
    }

    // Normal Paragraph
    flushLists();
    elements.push(
      <p key={key++} className="font-ui text-body text-base md:text-[17px] leading-[1.85] mb-6 text-muted/95">
        {renderInline(line)}
      </p>
    );
  }

  flushLists();
  return <div className="space-y-1">{elements}</div>;
}

// ── Image with Resilient Fallback ───────────────────────────────────────────
function ProjectImage({
  src,
  fallbackSrc,
  alt,
  className,
  style,
  ...rest
}: React.ImgHTMLAttributes<HTMLImageElement> & { style?: React.CSSProperties; fallbackSrc?: string }) {
  const FALLBACK = '/images/project-placeholder.png';
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc || FALLBACK);

  useEffect(() => {
    setImgSrc(src || fallbackSrc || FALLBACK);
  }, [src, fallbackSrc]);

  return (
    <img
      {...rest}
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      onError={() => {
        if (fallbackSrc && imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        } else {
          setImgSrc(FALLBACK);
        }
      }}
    />
  );
}

// ── Main Project Detail Page ────────────────────────────────────────────────
export default function ProjectDetail() {
  const { slug } = useParams();
  const currentIndex = projects.findIndex(p => p.slug === slug);
  const project = projects[currentIndex];
  const heroRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (project) track.projectView(project.title, project.slug);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [project, slug]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroImageY     = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const heroImageScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const heroOpacity    = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const heroTextY      = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <p className="font-display italic text-6xl text-heading mb-4">404</p>
          <p className="font-ui text-body mb-6">Project not found.</p>
          <Link to="/projects" className="font-ui text-sm text-cyan link-underline">
            ← Back to all projects
          </Link>
        </div>
      </div>
    );
  }

  // Determine prev and next project
  const prevProject = projects[(currentIndex - 1 + projects.length) % projects.length];
  const nextProject = projects[(currentIndex + 1) % projects.length];

  // Derive repo URL
  const slugToRepoMap: Record<string, string> = {
    'veronica-ai': 'Veronica-AI',
    'aegis-decision-intelligence-platform': 'AEGIS-Decision-Intelligence-Platform',
    'mahinaos': 'MahinaOS',
    'stem-idea-generator': 'STEM-IDEA-GENERATOR',
    'vectoris': 'Vectoris',
  };
  const repoName = slugToRepoMap[project.slug] || project.slug;
  const githubUrl = `https://github.com/HardikBhaskar2010/${repoName}`;
  const cloneCommand = `git clone ${githubUrl}.git`;

  const copyCloneCommand = () => {
    navigator.clipboard.writeText(cloneCommand);
    setCopied(true);
    playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const hasLiveLink = project.link && !project.link.includes('github.com');
  const related = projects
    .filter(p => p.slug !== slug)
    .slice(0, 2);

  return (
    <motion.div
      variants={pageEnter}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="page-wrapper min-h-screen"
    >
      <main>
        {/* ── Top Floating Header / Breadcrumbs ── */}
        <section className="pt-28 pb-6 border-b border-border/50 bg-bg/60 backdrop-blur-md sticky top-0 z-30">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex items-center justify-between gap-4">
            <Link
              to="/projects"
              onMouseEnter={playHoverTick}
              className="inline-flex items-center gap-2 font-ui text-sm text-muted hover:text-heading transition-colors group"
            >
              <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
              <span>All Projects</span>
              <span className="text-border">/</span>
              <span className="text-heading font-medium truncate max-w-[200px] md:max-w-none">
                {project.title}
              </span>
            </Link>

            <div className="flex items-center gap-3">
              {hasLiveLink && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={playHoverTick}
                  onClick={() => track.projectLinkClick(project.title, project.link!)}
                  className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-ui font-medium border border-cyan/40 bg-cyan/10 text-cyan hover:bg-cyan/20 hover:border-cyan transition-all active:scale-[0.98]"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                  Live Preview
                  <ExternalLink size={12} />
                </a>
              )}
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={playHoverTick}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-ui font-medium border border-border bg-surface text-heading hover:border-accent transition-all active:scale-[0.98]"
              >
                <GitBranch size={13} className="text-muted" />
                <span>GitHub</span>
                <ArrowUpRight size={12} className="text-muted" />
              </a>
            </div>
          </div>
        </section>

        {/* ── Project Hero ── */}
        <section ref={heroRef} className="relative pt-12 pb-20 overflow-hidden border-b border-border">
          {/* Ambient colored backdrop glow */}
          <div
            className="absolute top-0 right-1/4 w-[600px] h-[400px] rounded-full blur-[140px] opacity-15 pointer-events-none -z-10"
            style={{ backgroundColor: project.color }}
          />

          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <motion.div
              style={{ y: heroTextY, opacity: heroOpacity }}
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-5 max-w-3xl"
            >
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
                <Tag>{project.category}</Tag>
                <div className="flex items-center gap-1.5 text-xs font-mono text-muted border border-border/80 px-2.5 py-0.5 rounded-full bg-surface">
                  <Calendar size={12} />
                  <span>{project.year}</span>
                </div>
                {hasLiveLink && (
                  <span className="flex items-center gap-1.5 text-xs font-ui font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Deployed
                  </span>
                )}
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="font-display italic text-heading"
                style={{ fontSize: 'clamp(36px, 6vw, 76px)', lineHeight: '0.96' }}
              >
                {project.title}
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="font-ui text-body text-lg md:text-xl leading-relaxed text-muted/95"
              >
                {project.description}
              </motion.p>
            </motion.div>

            {/* ── Hero Media Showcase ── */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              className="mt-12 rounded-2xl overflow-hidden border border-border bg-surface relative shadow-2xl"
            >
              <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden parallax-container relative">
                <motion.div
                  style={{ y: heroImageY, scale: heroImageScale }}
                  className="w-full h-full"
                >
                  <ProjectImage
                    src={project.image}
                    fallbackSrc={project.fallbackImage}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Subtle gradient overlay to soften edges */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent opacity-60" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Main Content Area: Sidebar Meta + Markdown Documentation ── */}
        <section className="py-20 md:py-28">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

              {/* ── Left Sidebar (4 cols) ── */}
              <div className="lg:col-span-4 flex flex-col gap-8 lg:sticky lg:top-24 self-start">
                {/* Meta Card */}
                <div className="p-6 rounded-2xl border border-border bg-surface/70 backdrop-blur-sm flex flex-col gap-6">
                  <div>
                    <span className="font-ui text-[11px] uppercase tracking-widest text-muted flex items-center gap-1.5 mb-2">
                      <Layers size={13} />
                      Primary Domain
                    </span>
                    <p className="font-heading font-semibold text-heading text-lg">
                      {project.category}
                    </p>
                  </div>

                  <div className="border-t border-border/60 pt-5">
                    <span className="font-ui text-[11px] uppercase tracking-widest text-muted flex items-center gap-1.5 mb-2">
                      <Cpu size={13} />
                      Technology Stack
                    </span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {project.tools.map(t => (
                        <span
                          key={t}
                          className="font-mono text-xs text-tagText bg-tag border border-border/80 px-2.5 py-1 rounded-md hover:border-cyan/40 transition-colors"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="border-t border-border/60 pt-5 flex flex-col gap-3">
                    {hasLiveLink && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        onMouseEnter={playHoverTick}
                        onClick={() => track.projectLinkClick(project.title, project.link!)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-cyan text-bg font-ui font-medium text-sm hover:opacity-90 transition-opacity active:scale-[0.98]"
                      >
                        <span>Explore Live System</span>
                        <ExternalLink size={15} />
                      </a>
                    )}

                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      onMouseEnter={playHoverTick}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-white/[0.03] text-heading font-ui font-medium text-sm hover:border-accent hover:bg-white/[0.06] transition-all active:scale-[0.98]"
                    >
                      <span className="flex items-center gap-2">
                        <GitBranch size={15} />
                        GitHub Repository
                      </span>
                      <ArrowUpRight size={15} />
                    </a>
                  </div>
                </div>

                {/* Terminal Clone Affordance */}
                <div className="p-5 rounded-2xl border border-border bg-bg/80 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted flex items-center gap-1.5">
                      <Terminal size={12} className="text-cyan" />
                      Clone Repository
                    </span>
                    <button
                      onClick={copyCloneCommand}
                      onMouseEnter={playHoverTick}
                      className="text-xs text-muted hover:text-heading flex items-center gap-1 font-mono transition-colors active:scale-95"
                      title="Copy clone command"
                    >
                      {copied ? (
                        <>
                          <Check size={12} className="text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-black/50 p-3 rounded-xl border border-border/50 font-mono text-[11px] text-muted select-all overflow-x-auto">
                    <code>{cloneCommand}</code>
                  </div>
                </div>
              </div>

              {/* ── Right Content: Professional Markdown Documentation (8 cols) ── */}
              <div className="lg:col-span-8">
                <article className="prose prose-invert max-w-none">
                  <MarkdownBody md={project.longDescription} accentColor={project.color} />
                </article>
              </div>

            </div>
          </div>
        </section>

        {/* ── Project Navigation (Previous / Next) ── */}
        <section className="py-16 border-t border-border bg-surface/30">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Previous */}
              <Link
                to={`/project/${prevProject.slug}`}
                onMouseEnter={playSynthPulse}
                className="group p-6 rounded-2xl border border-border bg-surface hover:border-accent transition-all flex items-center gap-5 active:scale-[0.99]"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-border/80">
                  <ProjectImage
                    src={prevProject.image}
                    fallbackSrc={prevProject.fallbackImage}
                    alt={prevProject.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col gap-1 overflow-hidden">
                  <span className="font-mono text-xs text-muted flex items-center gap-1">
                    <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                    Previous Project
                  </span>
                  <p className="font-display italic text-lg text-heading truncate group-hover:text-cyan transition-colors">
                    {prevProject.title}
                  </p>
                  <span className="text-xs text-muted/70 truncate">{prevProject.category}</span>
                </div>
              </Link>

              {/* Next */}
              <Link
                to={`/project/${nextProject.slug}`}
                onMouseEnter={playSynthPulse}
                className="group p-6 rounded-2xl border border-border bg-surface hover:border-accent transition-all flex items-center justify-between gap-5 text-right active:scale-[0.99]"
              >
                <div className="flex flex-col gap-1 overflow-hidden ml-auto">
                  <span className="font-mono text-xs text-muted flex items-center justify-end gap-1">
                    Next Project
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <p className="font-display italic text-lg text-heading truncate group-hover:text-cyan transition-colors">
                    {nextProject.title}
                  </p>
                  <span className="text-xs text-muted/70 truncate">{nextProject.category}</span>
                </div>
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-border/80">
                  <ProjectImage
                    src={nextProject.image}
                    fallbackSrc={nextProject.fallbackImage}
                    alt={nextProject.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ── More Projects Grid ── */}
        {related.length > 0 && (
          <section className="py-24 border-t border-border">
            <div className="max-w-[1200px] mx-auto px-6 md:px-12">
              <div className="flex items-center justify-between mb-10">
                <h2 className="font-display italic text-heading text-3xl">Explore More Work.</h2>
                <Link
                  to="/projects"
                  className="font-ui text-sm text-cyan hover:text-heading transition-colors flex items-center gap-1.5"
                >
                  <span>View All Projects</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {related.map(p => (
                  <Link
                    key={p.id}
                    to={`/project/${p.slug}`}
                    onMouseEnter={playSynthPulse}
                  >
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="rounded-2xl overflow-hidden border border-border bg-surface group transition-all"
                    >
                      <div className="aspect-video overflow-hidden relative">
                        <ProjectImage
                          src={p.image}
                          fallbackSrc={p.fallbackImage}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                          style={{ background: `radial-gradient(ellipse at center, ${p.color}, transparent 70%)` }}
                        />
                      </div>
                      <div className="p-6">
                        <Tag>{p.category}</Tag>
                        <h3 className="font-display italic text-2xl text-heading mt-3 group-hover:text-cyan transition-colors">
                          {p.title}
                        </h3>
                        <p className="font-ui text-sm text-muted mt-2 leading-relaxed line-clamp-2">
                          {p.description}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <ContactSection />
      </main>
      <Footer />
    </motion.div>
  );
}
