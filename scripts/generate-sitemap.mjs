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
function urlEntry({ path, changefreq, priority, lastmod }) {
  return `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const entries = routes.map(urlEntry);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

const outPath = join(ROOT, 'public', 'sitemap.xml');
writeFileSync(outPath, xml, 'utf8');

console.log(`✓ sitemap.xml → ${outPath}`);
console.log(`  ${routes.length} routes written to sitemap`);
