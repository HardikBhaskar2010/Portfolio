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
      width: 500,
      height: 500,
    },
    jobTitle: 'Interactive Web Developer & AI Systems Builder',
    disambiguatingDescription:
      'Systems Architect, Low-Level Engineer, and AI Systems Builder based in India. Creator of MahinaOS (bare-metal x86_64 OS), Vectoris (native Rust desktop platform), and AEGIS (multi-agent intelligence platform). Distinct from academic medical researchers or energy engineers of the same name.',
    description:
      'I design and build cinematic web experiences, AI-powered systems, and futuristic interactive products using React, TypeScript, Three.js, and Framer Motion.',
    email: 'hardik.bhaskar2010@gmail.com',
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance / Self-Employed',
    },
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
    name: 'Hardik Bhaskar',
    alternateName: [
      'Hardik Bhaskar Portfolio',
      'Hardik Bhaskar Developer',
      'Hardik Bhaskar — Portfolio',
    ],
    description:
      'Official portfolio of Hardik Bhaskar — Systems architect, low-level engineer, and interactive 3D web developer.',
    author: { '@id': `${SITE_URL}/#person` },
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/projects?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * schema.org FAQPage — pass all FAQ items or grouped object.
 * @param {Record<string, Array<{q: string, a: string}>> | Array<{q: string, a: string}>} faqsByTab
 */
export function buildFaqJsonLd(faqsByTab) {
  const allFaqs = Array.isArray(faqsByTab)
    ? faqsByTab
    : Object.values(faqsByTab).flat();

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q || faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a || faq.answer,
      },
    })),
  };
}

/**
 * schema.org BreadcrumbList
 * @param {Array<{name: string, path: string}>} items
 */
export function buildBreadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path.startsWith('http') ? item.path : `${SITE_URL}${item.path}`,
    })),
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

/**
 * Determines if a project is a shipped software application (not just source code).
 */
function isShippedApp(project) {
  return Boolean(project.link && !project.link.includes('github.com'));
}

/** schema.org CreativeWork or SoftwareApplication — rendered on each /projects/:slug page */
export function buildProjectJsonLd(project) {
  const localImage = project.fallbackImage
    ? `${SITE_URL}${project.fallbackImage.startsWith('/') ? project.fallbackImage : `/${project.fallbackImage}`}`
    : null;

  const imageUrl = localImage || (project.image?.startsWith('http')
    ? project.image
    : `${SITE_URL}${project.image ? (project.image.startsWith('/') ? project.image : `/${project.image}`) : '/og-preview.png'}`);

  const type = isShippedApp(project) ? 'SoftwareApplication' : 'CreativeWork';

  const node = {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${SITE_URL}/projects/${project.slug}#project`,
    name: project.title,
    description: project.description,
    author: { '@id': `${SITE_URL}/#person` },
    image: imageUrl,
    keywords: Array.isArray(project.tools) ? project.tools.join(', ') : '',
    codeRepository: deriveRepoUrl(project),
    url: `${SITE_URL}/projects/${project.slug}`,
  };

  if (type === 'SoftwareApplication') {
    node.applicationCategory = 'DeveloperApplication';
    node.operatingSystem = 'Web / Cross-Platform';
    if (project.link) node.installUrl = project.link;
  }

  if (project.year) {
    node.datePublished = `${project.year}-01-01`;
    node.dateModified = `${project.year}-12-31`;
  }

  return node;
}
