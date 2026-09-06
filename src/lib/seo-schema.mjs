/**
 * src/lib/seo-schema.mjs
 * Framework-agnostic pure metadata and schema.org JSON-LD builders.
 * Shared between client-side <Seo> component (src/lib/seo.tsx)
 * and build-time scripts (scripts/prerender.mjs, scripts/generate-sitemap.mjs).
 */

export const SITE_URL =
  (typeof process !== 'undefined' && process.env?.VITE_SITE_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL) ||
  'https://hardikbhaskar.vercel.app';

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
      url: `${SITE_URL}/images/avatar.webp`,
      width: 400,
      height: 400,
    },
    jobTitle: 'Interactive Web Developer & AI Systems Builder',
    description:
      'I design and build cinematic web experiences, AI-powered systems, and futuristic interactive products using React, TypeScript, Three.js, and Framer Motion.',
    email: 'hardik.bhaskar2010@gmail.com',
    knowsAbout: [
      'Rust',
      'C / C++',
      'Operating Systems',
      'AI Systems',
      'Autonomous Agents',
      'Google Cloud Platform',
      'Anthropic Claude',
      'Generative AI',
      'Large Language Models',
      'TypeScript',
      'React 19',
      'Three.js',
      'Framer Motion',
      'Node.js',
    ],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Google Cloud Gen AI Academy APAC 2026 — Cohort 2 Hackathon',
        recognizedBy: {
          '@type': 'Organization',
          name: 'Google Cloud & Hack2skill',
        },
        credentialCategory: 'Certification',
        url: `${SITE_URL}/docs/certificates/Google_GenAI_Academy_APAC_2026.pdf`,
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Claude 101 — Large Language Model Mastery',
        recognizedBy: {
          '@type': 'Organization',
          name: 'Anthropic',
        },
        credentialCategory: 'Certification',
        url: `${SITE_URL}/docs/certificates/Anthropic_Claude_101.pdf`,
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'AI Tools & ChatGPT Engineering Workshop',
        recognizedBy: {
          '@type': 'Organization',
          name: 'be10x',
        },
        credentialCategory: 'Certification',
        url: `${SITE_URL}/docs/certificates/be10x_AI_Tools_Workshop.pdf`,
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Viksit Bharat Young Leaders Dialogue (VBYLD) 2026',
        recognizedBy: {
          '@type': 'GovernmentOrganization',
          name: 'Ministry of Youth Affairs and Sports, Government of India',
        },
        credentialCategory: 'Recognition',
        url: `${SITE_URL}/docs/certificates/MYBharat_VBYLD_2026.png`,
      },
    ],
    subjectOf: {
      '@type': 'DigitalDocument',
      name: 'Hardik Bhaskar Executive Portfolio & Technical Dossier',
      url: `${SITE_URL}/docs/Hardik_Bhaskar_Portfolio.pdf`,
      fileFormat: 'application/pdf',
    },
    sameAs: [
      'https://github.com/HardikBhaskar2010',
      'https://x.com/kitsune_luna05',
      'https://www.linkedin.com/in/hardik-bhaskar-8a107a3bb/',
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

/**
 * Derives the GitHub repository URL using the same logic as ProjectDetail.tsx
 */
function deriveRepoUrl(project) {
  if (project.repoUrl) return project.repoUrl;

  const slugToRepoMap = {
    'veronica-ai': 'Veronica-AI',
    'aegis-decision-intelligence-platform': 'AEGIS-Decision-Intelligence-Platform',
    mahinaos: 'MahinaOS',
    'stem-idea-generator': 'STEM-IDEA-GENERATOR',
    vectoris: 'Vectoris',
  };

  if (project.slug === 'vectoris') return 'https://github.com/VectorisAI/Vectoris';
  if (project.link && project.link.includes('github.com')) return project.link;

  const repoName = slugToRepoMap[project.slug] || project.slug;
  return `https://github.com/HardikBhaskar2010/${repoName}`;
}

/** schema.org CreativeWork — rendered on each /projects/:slug page */
export function buildProjectJsonLd(project) {
  const imageUrl = project.image?.startsWith('http')
    ? project.image
    : `${SITE_URL}${project.image || '/og-preview.png'}`;

  const node = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${SITE_URL}/projects/${project.slug}#project`,
    name: project.title,
    description: project.description,
    author: { '@id': `${SITE_URL}/#person` },
    image: imageUrl,
    keywords: Array.isArray(project.tools) ? project.tools.join(', ') : '',
    codeRepository: deriveRepoUrl(project),
    url: `${SITE_URL}/projects/${project.slug}`,
  };

  if (project.year) {
    node.datePublished = `${project.year}-01-01`;
  }

  return node;
}
