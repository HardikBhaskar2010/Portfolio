// scripts/generate-sitemap.mjs
// Runs at build time (via "prebuild" npm script alongside generate-projects.mjs).
// Uses shared getRoutes() → writes public/sitemap.xml with Google Image Sitemap schema.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { SITE_URL } from '../src/lib/seo-schema.mjs';
import { getRoutes } from './routes.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const routes = getRoutes();

function urlEntry({ path, changefreq, priority, lastmod, images = [] }) {
  const imageXml = images
    .map(
      (img) => `    <image:image>
      <image:loc>${escapeXml(img.loc)}</image:loc>
      <image:title>${escapeXml(img.title)}</image:title>
      <image:caption>${escapeXml(img.caption)}</image:caption>
    </image:image>`
    )
    .join('\n');

  return `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${imageXml ? '\n' + imageXml : ''}
  </url>`;
}

const entries = routes.map(urlEntry);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join('\n')}
</urlset>
`;

const outPath = join(ROOT, 'public', 'sitemap.xml');
writeFileSync(outPath, xml, 'utf8');

const totalImages = routes.reduce((acc, r) => acc + (r.images?.length || 0), 0);
console.log(`✓ sitemap.xml → ${outPath}`);
console.log(`  ${routes.length} routes, ${totalImages} images written to Google Image Sitemap`);
