// scripts/routes.mjs
// Single source of truth for all routes across sitemap generation,
// prerendering/HTML snapshotting, and IndexNow postbuild submissions.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import {
  SITE_URL,
  buildPersonJsonLd,
  buildWebsiteJsonLd,
  buildProjectJsonLd,
  buildFaqJsonLd,
  buildBreadcrumbJsonLd,
} from '../src/lib/seo-schema.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

export function getProjects() {
  const projectsPath = join(ROOT, 'src', 'data', 'projects.generated.json');
  try {
    return JSON.parse(readFileSync(projectsPath, 'utf8'));
  } catch (err) {
    console.warn('⚠️ Could not read projects.generated.json:', err.message);
    return [];
  }
}

export function getFaqs() {
  const faqsPath = join(ROOT, 'src', 'data', 'faqs.ts');
  try {
    const content = readFileSync(faqsPath, 'utf8');
    const match = content.match(/export const faqs[^=]*=\s*({[\s\S]*?});/);
    if (match) {
      return new Function(`return ${match[1]}`)();
    }
  } catch (err) {
    console.warn('⚠️ Could not read faqs.ts:', err.message);
  }
  return {};
}

export function getRoutes() {
  const projects = getProjects();
  const faqs = getFaqs();
  const today = new Date().toISOString().split('T')[0];

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Projects by Hardik Bhaskar',
    description: 'Interactive web experiences, AI systems, and systems programming projects.',
    itemListElement: projects.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.title,
      url: `${SITE_URL}/projects/${p.slug}`,
    })),
  };

  const routes = [
    {
      path: '/',
      changefreq: 'weekly',
      priority: '1.0',
      lastmod: today,
      title: 'Hardik Bhaskar — Portfolio | Systems Architect & 3D Developer',
      description:
        'Official portfolio of Hardik Bhaskar — Systems architect, low-level engineer, and interactive 3D web developer. Explore AI systems, Rust apps, and WebGL projects.',
      ogImage: '/og-preview.png',
      jsonLd: [buildPersonJsonLd(), buildWebsiteJsonLd(), buildFaqJsonLd(faqs)],
      fallbackHtml: `
    <header style="padding: 2.5rem 1.5rem; max-width: 1200px; margin: 0 auto; color: #FFFFFF; font-family: system-ui, -apple-system, sans-serif;">
      <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 1rem; color: #FFFFFF;">Hardik Bhaskar — Portfolio | Systems Architect &amp; 3D Developer</h1>
      <p style="font-size: 1.125rem; line-height: 1.6; max-width: 680px; color: #94A3B8; margin-bottom: 1.5rem;">
        Building cinematic web experiences, AI systems, and futuristic interactive products. React · Three.js · TypeScript.
      </p>
      <nav aria-label="Main Navigation" style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
        <a href="/projects" style="color: #00E5FF; text-decoration: none; font-weight: 600;">Explore Projects →</a>
        <a href="/about" style="color: #00E5FF; text-decoration: none; font-weight: 600;">About Hardik →</a>
        <a href="https://www.linkedin.com/in/hardik-bhaskar-8a107a3bb/" target="_blank" rel="noopener noreferrer" style="color: #00E5FF; text-decoration: none; font-weight: 600;">LinkedIn ↗</a>
      </nav>
    </header>`,
    },
    {
      path: '/about',
      changefreq: 'monthly',
      priority: '0.8',
      lastmod: today,
      title: 'About Hardik Bhaskar — Systems Architect & AI Systems Builder',
      description:
        'Systems developer and AI builder focused on robust low-level architectures, autonomous intelligence systems, and high-performance user interfaces — from bare-metal OS kernels to cinematic 3D web experiences.',
      ogImage: '/og-preview.png',
      jsonLd: [
        buildPersonJsonLd(),
        buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ]),
        buildFaqJsonLd(faqs),
      ],
      fallbackHtml: `
      <header style="padding: 2.5rem 1.5rem; max-width: 1200px; margin: 0 auto; color: #FFFFFF; font-family: system-ui, -apple-system, sans-serif;">
        <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 1rem; color: #FFFFFF;">About Hardik Bhaskar — Systems Architect &amp; AI Systems Builder</h1>
        <p style="font-size: 1.125rem; line-height: 1.6; max-width: 680px; color: #94A3B8; margin-bottom: 1.5rem;">
          Systems developer and AI builder focused on robust low-level architectures, autonomous intelligence systems, and high-performance user interfaces — from bare-metal OS kernels to cinematic 3D web experiences.
        </p>
        <section style="margin: 1.5rem 0; padding: 1.25rem; background: #0c0c10; border: 1px solid #222; border-radius: 12px;">
          <h2 style="font-size: 1.25rem; font-weight: 600; color: #00E5FF; margin-bottom: 0.5rem;">Verified GitHub Telemetry &amp; Live Shipping Cadence</h2>
          <p style="color: #94A3B8; font-size: 0.95rem; line-height: 1.5; margin-bottom: 0.5rem;">
            1,867+ contributions across public and private repositories. Active open-source and architecture systems include Vectoris (Native AI Desktop), Veronica-AI (Autonomous reasoning loop), MahinaOS (bare-metal x86_64 kernel), and AEGIS (Intelligence platform).
          </p>
        </section>
        <section style="margin: 1.5rem 0; padding: 1.25rem; background: #0c0c10; border: 1px solid #222; border-radius: 12px;">
          <h2 style="font-size: 1.25rem; font-weight: 600; color: #10B981; margin-bottom: 0.5rem;">Verified Credentials &amp; Certifications</h2>
          <ul style="color: #94A3B8; font-size: 0.95rem; line-height: 1.6; margin-left: 1.25rem;">
            <li><strong style="color: #FFFFFF;">Google Cloud Gen AI Academy APAC 2026:</strong> Cohort 2 Hackathon — Generative AI &amp; Cloud Solutions (<a href="/docs/certificates/Google_GenAI_Academy_APAC_2026.pdf" style="color: #00E5FF;">PDF</a>)</li>
            <li><strong style="color: #FFFFFF;">Anthropic Claude 101:</strong> Large Language Model Architecture &amp; Prompt Engineering (<a href="/docs/certificates/Anthropic_Claude_101.pdf" style="color: #00E5FF;">PDF</a>)</li>
            <li><strong style="color: #FFFFFF;">be10x AI Tools Workshop:</strong> AI Debugging &amp; High-Velocity Prototyping (<a href="/docs/certificates/be10x_AI_Tools_Workshop.pdf" style="color: #00E5FF;">PDF</a>)</li>
            <li><strong style="color: #FFFFFF;">Ministry of Youth Affairs &amp; Sports (MYBharat):</strong> Viksit Bharat Young Leaders Dialogue 2026 (<a href="/docs/certificates/MYBharat_VBYLD_2026.png" style="color: #00E5FF;">Certificate</a>)</li>
          </ul>
          <p style="margin-top: 0.75rem;">
            <a href="/docs/Hardik_Bhaskar_Portfolio.pdf" style="display: inline-block; padding: 0.5rem 1rem; background: #00E5FF; color: #000; font-weight: 600; text-decoration: none; border-radius: 8px;">Download Executive Portfolio Dossier (PDF) ↓</a>
          </p>
        </section>
        <nav aria-label="Main Navigation" style="display: flex; gap: 1.5rem; margin-top: 1.5rem; flex-wrap: wrap;">
          <a href="/" style="color: #00E5FF; text-decoration: none; font-weight: 600;">← Home</a>
          <a href="/projects" style="color: #00E5FF; text-decoration: none; font-weight: 600;">Projects →</a>
          <a href="https://www.linkedin.com/in/hardik-bhaskar-8a107a3bb/" target="_blank" rel="noopener noreferrer" style="color: #00E5FF; text-decoration: none; font-weight: 600;">LinkedIn ↗</a>
          <a href="https://github.com/HardikBhaskar2010" target="_blank" rel="noopener noreferrer" style="color: #00E5FF; text-decoration: none; font-weight: 600;">GitHub ↗</a>
        </nav>
      </header>`,
    },
    {
      path: '/projects',
      changefreq: 'monthly',
      priority: '0.9',
      lastmod: today,
      title: 'Projects — Hardik Bhaskar',
      description:
        'A curated collection of web applications, AI systems, and interactive experiences built by Hardik Bhaskar using React, Node.js, TypeScript, Python, and Rust.',
      ogImage: '/og-preview.png',
      jsonLd: [
        buildPersonJsonLd(),
        collectionJsonLd,
        buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Projects', path: '/projects' },
        ]),
      ],
      fallbackHtml: `
      <header style="padding: 2.5rem 1.5rem; max-width: 1200px; margin: 0 auto; color: #FFFFFF; font-family: system-ui, -apple-system, sans-serif;">
        <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 1rem; color: #FFFFFF;">Projects — Hardik Bhaskar</h1>
        <p style="font-size: 1.125rem; line-height: 1.6; max-width: 680px; color: #94A3B8; margin-bottom: 1.5rem;">
          A curated collection of AI systems, low-level desktop applications, OS research, and cinematic 3D web experiences.
        </p>
        <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 1rem;">
          ${projects
            .map(
              (p) => `
          <li>
            <a href="/projects/${p.slug}" style="color: #00E5FF; text-decoration: none; font-weight: 600;">${p.title}</a>
            <span style="color: #94A3B8;"> — ${p.subtitle || p.category || ''}</span>
          </li>`
            )
            .join('')}
        </ul>
        <nav aria-label="Main Navigation" style="display: flex; gap: 1.5rem; margin-top: 1.5rem;">
          <a href="/" style="color: #00E5FF; text-decoration: none; font-weight: 600;">← Home</a>
          <a href="/about" style="color: #00E5FF; text-decoration: none; font-weight: 600;">About →</a>
        </nav>
      </header>`,
    },
    ...projects.map((project) => {
      const metaDescription =
        project.description.length > 155
          ? `${project.description.slice(0, 152)}…`
          : project.description;
      const lastmod =
        project.year && `${project.year}-12-31` <= today
          ? `${project.year}-12-31`
          : today;

      const ogImage = project.fallbackImage || project.image || '/og-preview.png';

      return {
        path: `/projects/${project.slug}`,
        changefreq: 'monthly',
        priority: '0.7',
        lastmod,
        title: `${project.title} — Hardik Bhaskar`,
        description: metaDescription,
        ogImage,
        jsonLd: [
          buildProjectJsonLd(project),
          buildBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Projects', path: '/projects' },
            { name: project.title, path: `/projects/${project.slug}` },
          ]),
        ],
        fallbackHtml: `
      <header style="padding: 2.5rem 1.5rem; max-width: 1200px; margin: 0 auto; color: #FFFFFF; font-family: system-ui, -apple-system, sans-serif;">
        <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 1rem; color: #FFFFFF;">${project.title}</h1>
        <p style="font-size: 1.125rem; line-height: 1.6; max-width: 680px; color: #94A3B8; margin-bottom: 1.5rem;">
          ${project.description}
        </p>
        <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
          ${
            project.link
              ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer" style="color: #00E5FF; text-decoration: none; font-weight: 600;">Live Project / Repository ↗</a>`
              : ''
          }
          <a href="/projects" style="color: #00E5FF; text-decoration: none; font-weight: 600;">← Back to all projects</a>
        </div>
      </header>`,
      };
    }),
  ];

  return routes;
}
