// scripts/generate-sitemap.mjs
// Runs at build time (via "prebuild" npm script alongside generate-projects.mjs).
// Reads src/data/projects.generated.json → writes public/sitemap.xml.

import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const SITE_URL = process.env.VITE_SITE_URL || 'https://lunakitsune.vercel.app';
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

// ── Read generated projects ─────────────────────────────────────────────────
const projectsPath = join(ROOT, 'src', 'data', 'projects.generated.json');
let projects = [];
try {
  projects = JSON.parse(readFileSync(projectsPath, 'utf8'));
} catch {
  console.warn('⚠️  Could not read projects.generated.json — sitemap will only include static routes.');
}

// ── Static routes ────────────────────────────────────────────────────────────
const staticRoutes = [
  { path: '/',         changefreq: 'weekly',  priority: '1.0' },
  { path: '/about',    changefreq: 'monthly', priority: '0.8' },
  { path: '/projects', changefreq: 'monthly', priority: '0.9' },
];

// ── Build <url> entries ──────────────────────────────────────────────────────
function urlEntry({ path, changefreq, priority, lastmod = today }) {
  return `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const staticEntries = staticRoutes.map(urlEntry);

const projectEntries = projects.map((p) => {
  // Use the project's year as a rough lastmod date if available
  const lastmod = p.year ? `${p.year}-12-31` : today;
  return urlEntry({
    path: `/projects/${p.slug}`,
    changefreq: 'monthly',
    priority: '0.7',
    lastmod,
  });
});

// ── Write sitemap.xml ────────────────────────────────────────────────────────
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...projectEntries].join('\n')}
</urlset>
`;

const outPath = join(ROOT, 'public', 'sitemap.xml');
writeFileSync(outPath, xml, 'utf8');

console.log(`✓ sitemap.xml → ${outPath}`);
console.log(`  ${staticEntries.length} static routes + ${projectEntries.length} project routes`);
