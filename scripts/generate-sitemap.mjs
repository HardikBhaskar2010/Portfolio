// scripts/generate-sitemap.mjs
// Runs at build time (via "prebuild" npm script alongside generate-projects.mjs).
// Uses shared getRoutes() → writes public/sitemap.xml.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { SITE_URL } from '../src/lib/seo-schema.mjs';
import { getRoutes } from './routes.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const routes = getRoutes();
const today = new Date().toISOString().split('T')[0];

const documentEntries = [
  {
    path: '/docs/Hardik_Bhaskar_Portfolio.pdf',
    changefreq: 'weekly',
    priority: '0.8',
    lastmod: today,
  },
  {
    path: '/docs/certificates/Google_GenAI_Academy_APAC_2026.pdf',
    changefreq: 'monthly',
    priority: '0.6',
    lastmod: '2026-08-31',
  },
  {
    path: '/docs/certificates/Anthropic_Claude_101.pdf',
    changefreq: 'monthly',
    priority: '0.6',
    lastmod: '2026-01-01',
  },
  {
    path: '/docs/certificates/be10x_AI_Tools_Workshop.pdf',
    changefreq: 'monthly',
    priority: '0.5',
    lastmod: '2026-01-04',
  },
  {
    path: '/docs/certificates/MYBharat_VBYLD_2026.png',
    changefreq: 'monthly',
    priority: '0.5',
    lastmod: '2025-10-27',
  },
];

function urlEntry({ path, changefreq, priority, lastmod }) {
  return `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const allUrls = [...routes, ...documentEntries];
const entries = allUrls.map(urlEntry);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

const outPath = join(ROOT, 'public', 'sitemap.xml');
writeFileSync(outPath, xml, 'utf8');

console.log(`✓ sitemap.xml → ${outPath}`);
console.log(`  ${routes.length} routes written to sitemap`);
