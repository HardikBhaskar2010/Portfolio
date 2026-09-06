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

export function getRoutes() {
  const projects = getProjects();
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
      title: 'Hardik Bhaskar — Interactive Web & 3D Developer',
      description:
        'Scroll-driven 3D web experiences, AI-powered apps & full-stack products. React · Three.js · TypeScript. Available for freelance contracts.',
      ogImage: '/og-preview.png',
      jsonLd: [buildPersonJsonLd(), buildWebsiteJsonLd()],
      fallbackHtml: `
    <header style="padding: 2.5rem 1.5rem; max-width: 1200px; margin: 0 auto; color: #FFFFFF; font-family: system-ui, -apple-system, sans-serif;">
      <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 1rem; color: #FFFFFF;">Hardik Bhaskar — Interactive Web &amp; 3D Developer</h1>
      <p style="font-size: 1.125rem; line-height: 1.6; max-width: 680px; color: #94A3B8; margin-bottom: 1.5rem;">
        Building cinematic web experiences, AI systems, and futuristic interactive products. React · Three.js · TypeScript.
      </p>
      <nav aria-label="Main Navigation" style="display: flex; gap: 1.5rem;">
        <a href="/projects" style="color: #00E5FF; text-decoration: none; font-weight: 600;">Explore Projects →</a>
        <a href="/about" style="color: #00E5FF; text-decoration: none; font-weight: 600;">About Hardik →</a>
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
      jsonLd: buildPersonJsonLd(),
      fallbackHtml: `
    <main style="padding: 2.5rem 1.5rem; max-width: 1200px; margin: 0 auto; color: #FFFFFF; font-family: system-ui, -apple-system, sans-serif;">
      <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 1rem; color: #FFFFFF;">About Hardik Bhaskar</h1>
      <p style="font-size: 1.125rem; line-height: 1.6; max-width: 680px; color: #94A3B8; margin-bottom: 1.5rem;">
        Systems developer and AI builder focused on robust low-level architectures, autonomous intelligence systems, and high-performance user interfaces — from bare-metal OS kernels to cinematic 3D web experiences.
      </p>
      <nav aria-label="Main Navigation" style="display: flex; gap: 1.5rem; margin-top: 1.5rem;">
        <a href="/" style="color: #00E5FF; text-decoration: none; font-weight: 600;">← Home</a>
        <a href="/projects" style="color: #00E5FF; text-decoration: none; font-weight: 600;">Projects →</a>
      </nav>
    </main>`,
    },
    {
      path: '/projects',
      changefreq: 'monthly',
      priority: '0.9',
      lastmod: today,
      title: 'Projects — Hardik Bhaskar',
      description:
        'A curated collection of AI systems, low-level desktop applications, OS research, and cinematic 3D web experiences built by Hardik Bhaskar using Rust, C++, Python, React, and Three.js.',
      ogImage: '/og-preview.png',
      jsonLd: [buildPersonJsonLd(), collectionJsonLd],
      fallbackHtml: `
    <main style="padding: 2.5rem 1.5rem; max-width: 1200px; margin: 0 auto; color: #FFFFFF; font-family: system-ui, -apple-system, sans-serif;">
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
    </main>`,
    },
    ...projects.map((project) => {
      const metaDescription =
        project.description.length > 155
          ? `${project.description.slice(0, 152)}…`
          : project.description;
      const lastmod = project.year ? `${project.year}-12-31` : today;

      return {
        path: `/projects/${project.slug}`,
        changefreq: 'monthly',
        priority: '0.7',
        lastmod,
        title: `${project.title} — Hardik Bhaskar`,
        description: metaDescription,
        ogImage: project.image || '/og-preview.png',
        jsonLd: buildProjectJsonLd(project),
        fallbackHtml: `
    <main style="padding: 2.5rem 1.5rem; max-width: 1200px; margin: 0 auto; color: #FFFFFF; font-family: system-ui, -apple-system, sans-serif;">
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
    </main>`,
      };
    }),
  ];

  return routes;
}
