import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, LayoutGrid, Rows3, Table as TableIcon, Sparkles, Filter, Layers } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ContactSection } from '@/components/sections/ContactSection';
import { projects, type Project } from '@/data/projects';
import { ExpandedProjectCards } from '@/components/ui/ExpandedProjectCards';
import { ProjectGridCard } from '@/components/ui/ProjectGridCard';
import { ProjectTableView } from '@/components/ui/ProjectTableView';
import { pageEnter, stagger, fadeUp } from '@/lib/motion';
import { playHoverTick, playClick } from '@/lib/audio';
import { Seo, buildPersonJsonLd, SITE_URL } from '@/lib/seo';

type ViewMode = 'grid' | 'showcase' | 'table';

const CATEGORIES = [
  { id: 'all', label: 'All Systems' },
  { id: 'ai', label: 'AI & Intelligence' },
  { id: 'systems', label: 'Desktop & OS' },
  { id: 'web', label: 'Interactive & Web' },
] as const;

function matchesCategory(project: Project, categoryId: string): boolean {
  if (categoryId === 'all') return true;
  if (categoryId === 'ai') {
    return (
      project.category.toLowerCase().includes('ai') ||
      project.tag.toLowerCase().includes('ai') ||
      project.slug === 'vectoris'
    );
  }
  if (categoryId === 'systems') {
    return (
      project.tag.toLowerCase().includes('system') ||
      project.tag.toLowerCase().includes('desktop') ||
      project.slug === 'mahinaos' ||
      project.slug === 'vectoris'
    );
  }
  if (categoryId === 'web') {
    return (
      project.category.toLowerCase().includes('edtech') ||
      project.tag.toLowerCase().includes('full stack') ||
      project.slug === 'mahinaos' ||
      project.slug === 'stem-idea-generator'
    );
  }
  return true;
}

function matchesSearch(project: Project, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase().trim();
  return (
    project.title.toLowerCase().includes(q) ||
    project.subtitle.toLowerCase().includes(q) ||
    project.description.toLowerCase().includes(q) ||
    project.category.toLowerCase().includes(q) ||
    project.tag.toLowerCase().includes(q) ||
    project.tools.some((tool) => tool.toLowerCase().includes(q))
  );
}

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Filtered projects based on active category & keyword search
  const filteredProjects = useMemo(() => {
    return projects.filter(
      (project) => matchesCategory(project, selectedCategory) && matchesSearch(project, searchQuery)
    );
  }, [selectedCategory, searchQuery]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    return CATEGORIES.reduce((acc, cat) => {
      acc[cat.id] = projects.filter((p) => matchesCategory(p, cat.id)).length;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/projects#collection`,
    name: 'Projects — Hardik Bhaskar',
    url: `${SITE_URL}/projects`,
    about: { '@id': `${SITE_URL}/#person` },
    author: { '@id': `${SITE_URL}/#person` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: projects.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.title,
        url: `${SITE_URL}/projects/${p.slug}`,
      })),
    },
  };

  return (
    <motion.div
      variants={pageEnter}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="page-wrapper"
    >
      <Seo
        title="Projects — Hardik Bhaskar"
        description="A curated collection of AI systems, low-level desktop applications, OS research, and cinematic 3D web experiences built by Hardik Bhaskar using Rust, C++, Python, React, and Three.js."
        path="/projects"
        jsonLd={[buildPersonJsonLd(), collectionJsonLd]}
      />

      <main className="pt-20">
        {/* ── 1. Hero Header & Telemetry Metrics ── */}
        <section className="pt-16 pb-12 md:pt-24 md:pb-16 border-b border-border">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <motion.div variants={fadeUp}>
                  <SectionLabel>Archive // 2024 — 2026</SectionLabel>
                </motion.div>

                {/* Status Indicator */}
                <motion.div
                  variants={fadeUp}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-medium"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>{projects.length} Systems Online</span>
                </motion.div>
              </div>

              <motion.h1
                variants={fadeUp}
                className="font-display italic text-heading"
                style={{ fontSize: 'clamp(44px, 7vw, 104px)', lineHeight: '0.92' }}
              >
                Engineering &amp;<br />Creative Works.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="font-ui text-body text-base lg:text-lg max-w-[560px] leading-relaxed"
              >
                Autonomous AI systems, local-first desktop runtimes, Linux OS distributions, and cinematic 3D web applications architected for real-world reliability.
              </motion.p>

              {/* Telemetry Metrics Strip */}
              <motion.div
                variants={fadeUp}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-4 border-t border-white/10"
              >
                <div className="flex flex-col">
                  <span className="font-mono text-xs text-muted/60 uppercase tracking-widest">Total Repos</span>
                  <span className="font-display italic text-2xl lg:text-3xl text-heading font-semibold">05 Systems</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-xs text-muted/60 uppercase tracking-widest">Architectures</span>
                  <span className="font-display italic text-2xl lg:text-3xl text-heading font-semibold">Local &amp; AI</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-xs text-muted/60 uppercase tracking-widest">Primary Stack</span>
                  <span className="font-display italic text-2xl lg:text-3xl text-heading font-semibold">Rust &amp; Python</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-xs text-muted/60 uppercase tracking-widest">Verification</span>
                  <span className="font-display italic text-2xl lg:text-3xl text-cyan font-semibold">100% Public</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── 2. Interactive Control Bar (Filter & View Toolbar) ── */}
        <section className="sticky top-16 z-30 bg-[#05050A]/90 backdrop-blur-xl border-b border-border py-4 transition-all">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {CATEGORIES.map((category) => {
                const isActive = selectedCategory === category.id;
                const count = categoryCounts[category.id] ?? 0;

                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      playHoverTick();
                      setSelectedCategory(category.id);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-ui font-medium transition-all active:scale-[0.97] whitespace-nowrap ${
                      isActive
                        ? 'bg-cyan text-bg font-semibold shadow-sm'
                        : 'bg-white/[0.03] text-muted hover:text-heading hover:bg-white/[0.08] border border-white/5'
                    }`}
                  >
                    <span>{category.label}</span>
                    <span
                      className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-bg/20 text-bg' : 'bg-white/10 text-muted/80'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right: Search + View Mode Switcher */}
            <div className="flex items-center gap-3">
              {/* Search Box */}
              <div className="relative flex-1 md:w-64">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted/60 pointer-events-none"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by tech or keyword..."
                  className="w-full pl-8 pr-7 py-1.5 rounded-full bg-white/[0.04] border border-white/10 focus:border-cyan/50 focus:bg-white/[0.07] text-xs font-ui text-heading placeholder:text-muted/50 outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted/60 hover:text-heading p-0.5"
                    title="Clear Search"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* View Switcher Toggle */}
              <div className="flex items-center gap-1 p-1 bg-surface border border-border rounded-full text-xs flex-shrink-0">
                <button
                  onClick={() => {
                    playClick();
                    setViewMode('grid');
                  }}
                  className={`p-1.5 rounded-full transition-all active:scale-[0.96] ${
                    viewMode === 'grid'
                      ? 'bg-cyan text-bg font-semibold shadow-sm'
                      : 'text-muted hover:text-heading'
                  }`}
                  title="Bento Grid View"
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setViewMode('showcase');
                  }}
                  className={`p-1.5 rounded-full transition-all active:scale-[0.96] ${
                    viewMode === 'showcase'
                      ? 'bg-cyan text-bg font-semibold shadow-sm'
                      : 'text-muted hover:text-heading'
                  }`}
                  title="Interactive Rail Showcase"
                >
                  <Rows3 size={14} />
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setViewMode('table');
                  }}
                  className={`p-1.5 rounded-full transition-all active:scale-[0.96] ${
                    viewMode === 'table'
                      ? 'bg-cyan text-bg font-semibold shadow-sm'
                      : 'text-muted hover:text-heading'
                  }`}
                  title="Technical Spec Table"
                >
                  <TableIcon size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. Primary Projects Showcase (Exactly One Authoritative View) ── */}
        <section className="py-12 md:py-16">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            {/* Filter status header */}
            <div className="flex items-center justify-between mb-8">
              <span className="font-mono text-xs text-muted/60 uppercase tracking-widest">
                Showing {filteredProjects.length} of {projects.length} Systems
              </span>

              {(selectedCategory !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    playHoverTick();
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="font-ui text-xs text-cyan hover:underline flex items-center gap-1"
                >
                  <span>Reset Filters</span>
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Content View Switching */}
            {filteredProjects.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-20 px-6 rounded-[28px] border border-dashed border-white/10 bg-surface/30 text-center">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted mb-4">
                  <Filter size={20} />
                </div>
                <h3 className="font-display italic text-2xl text-heading font-semibold mb-2">
                  No systems matching "{searchQuery}"
                </h3>
                <p className="font-ui text-sm text-muted max-w-[400px] leading-relaxed mb-6">
                  No repositories or projects match your current query or category filter. Try refining your keywords or clear your filters.
                </p>
                <button
                  onClick={() => {
                    playClick();
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-5 py-2 rounded-full bg-cyan text-bg font-ui text-xs font-semibold hover:shadow-lg hover:shadow-cyan/20 active:scale-95 transition-all"
                >
                  View All Systems
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* Bento Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {filteredProjects.map((project, index) => (
                  <ProjectGridCard
                    key={project.id}
                    project={project}
                    index={index}
                  />
                ))}
              </div>
            ) : viewMode === 'showcase' ? (
              /* Interactive Accordion Rail */
              <div className="w-full">
                <ExpandedProjectCards projects={filteredProjects} />
              </div>
            ) : (
              /* System Spec Sheet Table View */
              <ProjectTableView projects={filteredProjects} />
            )}
          </div>
        </section>

        {/* ── 4. Refined Inquiries & Collaboration CTA ── */}
        <section className="py-16 border-t border-border bg-[#07070C]/50">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-[540px]">
              <SectionLabel>Architecture &amp; Collaboration</SectionLabel>
              <h2
                className="font-display italic text-heading mt-3 font-semibold"
                style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: '0.96' }}
              >
                Building a desktop runtime, AI system, or 3D product?
              </h2>
              <p className="font-ui text-sm text-muted mt-3 leading-relaxed">
                Available for high-impact contracts, low-level systems engineering, local AI architectures, and interactive WebGL experiences.
              </p>
            </div>

            <a
              href="#contact"
              onClick={() => playClick()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan text-bg font-ui font-semibold text-sm hover:shadow-xl hover:shadow-cyan/25 active:scale-95 transition-all"
            >
              <span>Initiate Project Inquiry</span>
              <Sparkles size={15} />
            </a>
          </div>
        </section>

        {/* ── 5. Contact Section ── */}
        <div id="contact">
          <ContactSection />
        </div>
      </main>

      <Footer />
    </motion.div>
  );
}
