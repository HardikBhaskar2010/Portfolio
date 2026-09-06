import { useRef, useState, useEffect } from 'react';
import { type HTMLMotionProps, motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowUpRight, LayoutGrid, Rows3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Tag } from '@/components/ui/Tag';
import { projects } from '@/data/projects';
import { stagger, scaleIn, fadeUp } from '@/lib/motion';
import { playSynthPulse, playHoverTick } from '@/lib/audio';
import { ExpandedProjectCards } from '@/components/ui/ExpandedProjectCards';

interface FeaturedWorkProps {
  limit?: number;
  showViewAll?: boolean;
}

export function FeaturedWork({ limit = 6, showViewAll = true }: FeaturedWorkProps) {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });
  const [viewMode, setViewMode] = useState<'expanded' | 'grid'>('expanded');
  const displayed = projects.slice(0, limit);

  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex flex-col gap-10"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="flex flex-col gap-4">
              <motion.div variants={fadeUp}>
                <SectionLabel>Selected work</SectionLabel>
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="font-display italic text-heading"
                style={{ fontSize: 'clamp(32px, 4.5vw, 64px)', lineHeight: '0.92' }}
              >
                Some of my<br />best projects.
              </motion.h2>
            </div>

            <motion.div variants={fadeUp} className="flex items-center gap-4">
              {/* View Switcher: Expanded Rail vs Grid */}
              <div className="hidden sm:flex items-center gap-1 p-1 bg-surface border border-border rounded-full text-xs">
                <button
                  onClick={() => {
                    playHoverTick();
                    setViewMode('expanded');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                    viewMode === 'expanded'
                      ? 'bg-cyan text-bg font-semibold shadow-sm'
                      : 'text-muted hover:text-heading'
                  }`}
                  title="Expanded Cards View (Interactive Rail)"
                >
                  <Rows3 size={13} />
                  <span>Interactive Rail</span>
                </button>
                <button
                  onClick={() => {
                    playHoverTick();
                    setViewMode('grid');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                    viewMode === 'grid'
                      ? 'bg-cyan text-bg font-semibold shadow-sm'
                      : 'text-muted hover:text-heading'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid size={13} />
                  <span>Grid</span>
                </button>
              </div>

              {showViewAll && (
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 font-ui text-sm text-muted hover:text-heading transition-colors group link-underline"
                >
                  View all projects
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              )}
            </motion.div>
          </div>

          {/* Primary View: Scrolltide-style Expanded Cards */}
          {viewMode === 'expanded' ? (
            <motion.div variants={fadeUp} className="w-full">
              <ExpandedProjectCards projects={projects} />
            </motion.div>
          ) : (
            /* Secondary View: Classic Responsive 2-col Grid */
            <motion.div
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {displayed.map((project, i) => (
                <motion.div key={project.id} variants={scaleIn}>
                  <ProjectCard project={project} priority={i < 2} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Fallback Image ── */
function FallbackImg({
  src, fallbackSrc, alt, className, style, priority, ...rest
}: HTMLMotionProps<"img"> & { priority?: boolean; fallbackSrc?: string }) {
  const FALLBACK = '/images/project-placeholder.png';
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc || FALLBACK);
  useEffect(() => { setImgSrc(src || fallbackSrc || FALLBACK); }, [src, fallbackSrc]);
  return (
    <motion.img
      {...rest as any}
      src={imgSrc}
      alt={alt}
      className={className || "w-full h-full object-cover"}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
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

/* ── Project Card ── */
function ProjectCard({ project, priority }: { project: typeof projects[0]; priority?: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  /* Image moves at 80% of scroll speed — creates parallax within card */
  const imageY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <Link to={`/project/${project.slug}`}>
      <motion.article
        ref={cardRef}
        whileHover={{ y: -6 }}
        onHoverStart={playSynthPulse}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="group relative rounded-2xl overflow-hidden border border-border bg-surface cursor-pointer"
      >
        {/* Image area */}
        <div className="aspect-video overflow-hidden parallax-container">
          <FallbackImg
            src={project.image}
            fallbackSrc={project.fallbackImage}
            alt={project.title}
            style={{ y: imageY, scale: 1.1 }}
            priority={priority}
          />
          {/* Overlay gradient */}
          <div
            className="absolute inset-0 opacity-30 group-hover:opacity-10 transition-opacity duration-500"
            style={{ background: `linear-gradient(135deg, ${project.color}22, transparent)` }}
          />
        </div>

        {/* Card footer */}
        <div className="p-5 md:p-6 flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <Tag>{project.category}</Tag>
            <h3 className="font-display italic text-xl md:text-2xl text-heading group-hover:text-white transition-colors duration-200">
              {project.title}
            </h3>
            <p className="font-ui text-sm text-muted leading-relaxed">
              {project.description}
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="flex-shrink-0 w-9 h-9 rounded-full border border-border flex items-center justify-center text-heading opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <ArrowUpRight size={14} />
          </motion.div>
        </div>

        {/* Tools row */}
        <div className="px-5 md:px-6 pb-5 flex flex-wrap gap-1.5">
          {project.tools.slice(0, 4).map((tool) => (
            <span key={tool} className="font-mono text-[10px] text-muted bg-bg px-2 py-0.5 rounded border border-border">
              {tool}
            </span>
          ))}
          {project.tools.length > 4 && (
            <span className="font-mono text-[10px] text-muted">+{project.tools.length - 4}</span>
          )}
        </div>
      </motion.article>
    </Link>
  );
}

export { ProjectCard };
