import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { Tag } from '@/components/ui/Tag';
import { ContactSection } from '@/components/sections/ContactSection';
import { projects } from '@/data/projects';
import { pageEnter, stagger, fadeUp, scaleIn } from '@/lib/motion';
import { track } from '@/lib/analytics';

// ── Lightweight markdown → JSX renderer (no extra dependency) ────────────
// Handles: # headings, **bold**, *italic*, - lists, blank-line paragraphs
function MarkdownBody({ md }: { md: string }) {
  const FALLBACK_IMAGE = '/images/project-placeholder.png';

  const lines = md.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length) {
      elements.push(
        <ul key={key++} className="list-disc list-inside space-y-1 font-ui text-body text-base leading-relaxed mb-6 text-muted">
          {listItems.map((li, i) => (
            <li key={i}>{renderInline(li)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const renderInline = (text: string): React.ReactNode => {
    // **bold**, *italic*
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**'))
        return <strong key={i} className="text-heading font-semibold">{part.slice(2, -2)}</strong>;
      if (part.startsWith('*') && part.endsWith('*'))
        return <em key={i}>{part.slice(1, -1)}</em>;
      return part;
    });
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    // Blank line — flush list, paragraph break handled by spacing
    if (!line.trim()) { flushList(); continue; }

    // Headings
    const h3 = line.match(/^###\s+(.*)/);
    const h2 = line.match(/^##\s+(.*)/);
    const h1 = line.match(/^#\s+(.*)/);
    if (h1) { flushList(); elements.push(<h3 key={key++} className="font-display italic text-heading text-2xl mt-8 mb-3">{h1[1]}</h3>); continue; }
    if (h2) { flushList(); elements.push(<h4 key={key++} className="font-display italic text-heading text-xl mt-6 mb-2">{h2[1]}</h4>); continue; }
    if (h3) { flushList(); elements.push(<h5 key={key++} className="font-ui font-semibold text-heading text-base mt-4 mb-1 uppercase tracking-wider">{h3[1]}</h5>); continue; }

    // List items
    const li = line.match(/^[-*]\s+(.*)/);
    if (li) { listItems.push(li[1]); continue; }

    // Paragraph
    flushList();
    elements.push(
      <p key={key++} className="font-ui text-body text-base leading-[1.9] mb-6">
        {renderInline(line)}
      </p>
    );
  }
  flushList();
  return <>{elements}</>;
}

// ── Image with fallback ───────────────────────────────────────────────────
function ProjectImage({
  src, alt, className, style, ...rest
}: React.ImgHTMLAttributes<HTMLImageElement> & { style?: React.CSSProperties }) {
  const FALLBACK = '/images/project-placeholder.png';
  const [imgSrc, setImgSrc] = useState(src || FALLBACK);
  useEffect(() => { setImgSrc(src || FALLBACK); }, [src]);
  return (
    <img
      {...rest}
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      onError={() => setImgSrc(FALLBACK)}
    />
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find(p => p.slug === slug);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (project) track.projectView(project.title, project.slug);
  }, [project]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroImageY     = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroImageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroOpacity    = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroTextY      = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-display italic text-6xl text-heading mb-4">404</p>
          <p className="font-ui text-body mb-6">Project not found.</p>
          <Link to="/projects" className="font-ui text-sm text-cyan link-underline">← Back to projects</Link>
        </div>
      </div>
    );
  }

  const related = projects
    .filter(p => p.slug !== slug && p.category === project.category)
    .slice(0, 2);

  const isExternalImage = project.heroImage.startsWith('http');

  return (
    <motion.div variants={pageEnter} initial="hidden" animate="visible" exit="exit" className="page-wrapper">
      <main>
        {/* ── Hero ── */}
        <section ref={heroRef} className="relative min-h-[70vh] flex flex-col justify-end overflow-hidden">
          <div className="absolute inset-0 parallax-container">
            <motion.div
              style={{ y: heroImageY, scale: heroImageScale }}
              className="w-full h-full"
            >
              <ProjectImage
                src={project.heroImage}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Stronger gradient when using placeholder */}
            <div
              className="absolute inset-0"
              style={{
                background: isExternalImage
                  ? 'linear-gradient(to top, #080808 0%, rgba(8,8,8,0.5) 50%, transparent 100%)'
                  : `linear-gradient(to top, #080808 0%, rgba(8,8,8,0.7) 40%, rgba(8,8,8,0.3) 100%)`,
              }}
            />

            {/* Accent color wash when using placeholder */}
            {!isExternalImage && (
              <div
                className="absolute inset-0 opacity-20"
                style={{ background: `radial-gradient(ellipse at 60% 40%, ${project.color}, transparent 70%)` }}
              />
            )}
          </div>

          <motion.div
            style={{ y: heroTextY, opacity: heroOpacity }}
            className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 pb-16 pt-32"
          >
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 font-ui text-sm text-muted hover:text-heading transition-colors mb-8 group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              All projects
            </Link>

            <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col gap-4">
              <motion.div variants={fadeUp} className="flex items-center gap-3">
                <Tag>{project.category}</Tag>
                <span className="font-mono text-xs text-muted">{project.year}</span>
              </motion.div>
              <motion.h1
                variants={fadeUp}
                className="font-display italic text-heading"
                style={{ fontSize: 'clamp(36px, 6vw, 88px)', lineHeight: '0.9' }}
              >
                {project.title}
              </motion.h1>
              <motion.p variants={fadeUp} className="font-ui text-body text-lg max-w-[520px] leading-relaxed">
                {project.description}
              </motion.p>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Overview ── */}
        <section className="py-24 md:py-32 border-b border-border">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

              {/* Meta sidebar */}
              <div className="flex flex-col gap-8">
                <div>
                  <span className="font-ui text-[10px] uppercase tracking-widest text-tagText">Category</span>
                  <p className="font-heading font-semibold text-heading mt-2">{project.category}</p>
                </div>
                <div>
                  <span className="font-ui text-[10px] uppercase tracking-widest text-tagText">Year</span>
                  <p className="font-heading font-semibold text-heading mt-2">{project.year}</p>
                </div>
                <div>
                  <span className="font-ui text-[10px] uppercase tracking-widest text-tagText">Tech Stack</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tools.map(t => (
                      <span key={t} className="font-mono text-xs text-tagText bg-tag border border-border px-2.5 py-1 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => track.projectLinkClick(project.title, project.link!)}
                    className="inline-flex items-center gap-2 font-ui text-sm text-cyan hover:text-heading transition-colors group link-underline w-fit"
                  >
                    Live site
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                )}
              </div>

              {/* Long description — rendered as markdown */}
              <div className="lg:col-span-2">
                <h2 className="font-display italic text-heading text-3xl md:text-4xl mb-8">Overview</h2>
                <MarkdownBody md={project.longDescription} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Full-width showcase image ── */}
        {isExternalImage && (
          <section className="py-16 border-b border-border">
            <div className="max-w-[1200px] mx-auto px-6 md:px-12">
              <div className="rounded-2xl overflow-hidden parallax-container h-64 md:h-96 lg:h-[520px] border border-border">
                <motion.div
                  className="w-full h-full"
                  whileInView={{ scale: [1.04, 1] }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true }}
                >
                  <ProjectImage
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* ── Related Projects ── */}
        {related.length > 0 && (
          <section className="py-24 border-b border-border">
            <div className="max-w-[1200px] mx-auto px-6 md:px-12">
              <h2 className="font-display italic text-heading text-3xl mb-10">More projects.</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {related.map(p => (
                  <Link key={p.id} to={`/projects/${p.slug}`}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="rounded-2xl overflow-hidden border border-border bg-surface group"
                    >
                      <div className="aspect-video overflow-hidden relative">
                        <ProjectImage
                          src={p.image}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Accent glow on hover */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                          style={{ background: `radial-gradient(ellipse at center, ${p.color}, transparent 70%)` }}
                        />
                      </div>
                      <div className="p-5">
                        <Tag>{p.category}</Tag>
                        <h3 className="font-display italic text-xl text-heading mt-2">{p.title}</h3>
                        <p className="font-ui text-sm text-muted mt-1 leading-relaxed line-clamp-2">{p.description}</p>
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
