/**
 * src/lib/seo.ts
 * Single source of truth for per-route SEO metadata.
 *
 * Exports:
 *  - SITE_URL            — canonical production domain
 *  - buildPersonJsonLd   — schema.org Person node (Hardik Bhaskar)
 *  - buildWebsiteJsonLd  — schema.org WebSite node
 *  - buildProjectJsonLd  — schema.org CreativeWork/SoftwareSourceCode node
 *  - <Seo>               — thin wrapper around react-helmet-async <Helmet>
 */

import { Helmet } from 'react-helmet-async';

// ── Production domain ───────────────────────────────────────────────────────
export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined) ||
  'https://lunakitsune.vercel.app';

// ── JSON-LD builders ────────────────────────────────────────────────────────

/** schema.org Person — represents Hardik Bhaskar across all pages */
export function buildPersonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: 'Hardik Bhaskar',
    alternateName: 'Luna Kitsune',
    url: SITE_URL,
    image: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/images/avatar.png`,
      width: 400,
      height: 400,
    },
    jobTitle: 'Interactive Web Developer & AI Systems Builder',
    description:
      'I design and build cinematic web experiences, AI-powered systems, and futuristic interactive products using React, TypeScript, Three.js, and Framer Motion.',
    email: 'hardik.bhaskar2010@gmail.com',
    knowsAbout: [
      'React',
      'TypeScript',
      'Three.js',
      'Framer Motion',
      'AI Systems',
      'Next.js',
      'Supabase',
      'Node.js',
    ],
    sameAs: [
      'https://github.com/HardikBhaskar2010',
      'https://x.com/kitsune_luna05',
      'https://www.linkedin.com/in/luna-kitsune-8a107a3bb/',
    ],
    nationality: {
      '@type': 'Country',
      name: 'India',
    },
  };
}

/** schema.org WebSite — homepage only */
export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Hardik Bhaskar — Portfolio',
    description:
      'Cinematic web experiences, AI-powered systems, and futuristic interactive products.',
    author: { '@id': `${SITE_URL}/#person` },
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/projects?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/** Minimal shape of a project record needed for JSON-LD */
export interface ProjectForJsonLd {
  slug: string;
  title: string;
  description: string;
  image: string;
  tools: string[];
  repoUrl?: string;
  link?: string;
  year?: string;
}

/**
 * Derives the GitHub repository URL using the same logic as ProjectDetail.tsx
 * so we don't duplicate the mapping.
 */
function deriveRepoUrl(project: ProjectForJsonLd): string {
  if (project.repoUrl) return project.repoUrl;

  const slugToRepoMap: Record<string, string> = {
    'veronica-ai': 'Veronica-AI',
    'aegis-decision-intelligence-platform': 'AEGIS-Decision-Intelligence-Platform',
    mahinaos: 'MahinaOS',
    'stem-idea-generator': 'STEM-IDEA-GENERATOR',
    vectoris: 'Vectoris',
  };

  if (project.slug === 'vectoris') return 'https://github.com/VectorisAI/Vectoris';
  if (project.link?.includes('github.com')) return project.link;

  const repoName = slugToRepoMap[project.slug] || project.slug;
  return `https://github.com/HardikBhaskar2010/${repoName}`;
}

/** schema.org CreativeWork — rendered on each /projects/:slug page */
export function buildProjectJsonLd(project: ProjectForJsonLd) {
  const imageUrl = project.image.startsWith('http')
    ? project.image
    : `${SITE_URL}${project.image}`;

  const node: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${SITE_URL}/projects/${project.slug}#project`,
    name: project.title,
    description: project.description,
    author: { '@id': `${SITE_URL}/#person` },
    image: imageUrl,
    keywords: project.tools.join(', '),
    codeRepository: deriveRepoUrl(project),
    url: `${SITE_URL}/projects/${project.slug}`,
  };

  // Only include datePublished when a real year is present in the data model
  if (project.year) {
    node.datePublished = `${project.year}-01-01`;
  }

  return node;
}

// ── <Seo> component ─────────────────────────────────────────────────────────

interface SeoProps {
  /** Full page title — shown in browser tab and SERP */
  title: string;
  /** ~155-char meta description for SERP */
  description: string;
  /** Route path (e.g. "/about"), used to build canonical + og:url */
  path: string;
  /** Absolute or root-relative OG image URL. Defaults to /og-preview.png */
  ogImage?: string;
  /** JSON-LD object (or array of objects) to inject as ld+json script */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /** If true, adds <meta name="robots" content="noindex, follow"> */
  noindex?: boolean;
}

export function Seo({
  title,
  description,
  path,
  ogImage = '/og-preview.png',
  jsonLd,
  noindex = false,
}: SeoProps) {
  const canonicalUrl = `${SITE_URL}${path === '/' ? '' : path}`;
  const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;
  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : null;

  return (
    <Helmet>
      {/* Primary */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, follow" />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:secure_url" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:url" content={canonicalUrl} />

      {/* JSON-LD structured data */}
      {jsonLdString && (
        <script type="application/ld+json">{jsonLdString}</script>
      )}
    </Helmet>
  );
}
