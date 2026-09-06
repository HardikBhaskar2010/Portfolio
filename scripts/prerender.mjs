#!/usr/bin/env node
/**
 * scripts/prerender.mjs
 * Build-time HTML route snapshotting (Option A).
 * Runs after `vite build` and before `indexnow-submit.mjs`.
 *
 * Clones `dist/index.html` per route and rewrites head metadata
 * + adds a minimal semantic fallback body inside `<div id="root">`
 * for non-JS link unfurlers (Twitter/X, Discord, LinkedIn, Slack, WhatsApp).
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { SITE_URL } from '../src/lib/seo-schema.mjs';
import { getRoutes } from './routes.mjs';

const startTime = performance.now();
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const distDir = join(ROOT, 'dist');
const templatePath = join(distDir, 'index.html');

if (!existsSync(templatePath)) {
  console.error('✗ prerender: dist/index.html not found. Run `vite build` first.');
  process.exit(1);
}

const template = readFileSync(templatePath, 'utf8');
const routes = getRoutes();

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function setTitle(html, title) {
  const regex = /<title[^>]*>[\s\S]*?<\/title>/i;
  const tag = `<title data-rh="true">${escapeHtml(title)}</title>`;
  return html.replace(regex, tag);
}

function setCanonical(html, url) {
  const regex = /<link[^>]*rel="canonical"[^>]*\/?>/i;
  const tag = `<link data-rh="true" rel="canonical" href="${escapeHtml(url)}" />`;
  if (regex.test(html)) {
    return html.replace(regex, tag);
  }
  return html.replace('</head>', `  ${tag}\n  </head>`);
}

function setMetaProperty(html, property, content) {
  const regex = new RegExp(`<meta(?=[^>]*\\bproperty=["']${property}["'])[^>]*>`, 'i');
  const tag = `<meta data-rh="true" property="${property}" content="${escapeHtml(content)}" />`;
  if (regex.test(html)) {
    return html.replace(regex, tag);
  }
  return html.replace('</head>', `  ${tag}\n  </head>`);
}

function setMetaName(html, name, content) {
  const regex = new RegExp(`<meta(?=[^>]*\\bname=["']${name}["'])[^>]*>`, 'i');
  const tag = `<meta data-rh="true" name="${name}" content="${escapeHtml(content)}" />`;
  if (regex.test(html)) {
    return html.replace(regex, tag);
  }
  return html.replace('</head>', `  ${tag}\n  </head>`);
}

function setJsonLd(html, jsonLd) {
  const regex = /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i;
  const tag = `<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n    </script>`;
  return html.replace(regex, tag);
}

function removeMetaProperty(html, property) {
  const regex = new RegExp(`\\s*<meta(?=[^>]*\\bproperty=["']${property}["'])[^>]*>`, 'gi');
  return html.replace(regex, '');
}

function setNoscriptContent(html, content) {
  const regex = /<noscript>[\s\S]*?<\/noscript>/i;
  const tag = `<noscript>\n${content}\n    </noscript>`;
  if (regex.test(html)) {
    return html.replace(regex, tag);
  }
  return html.replace('</body>', `  ${tag}\n  </body>`);
}

let generatedCount = 0;

for (const route of routes) {
  // Skip root '/' route — dist/index.html already serves '/'
  if (route.path === '/') continue;

  const canonicalUrl = `${SITE_URL}${route.path}`;
  const ogImageUrl = route.ogImage.startsWith('http')
    ? route.ogImage
    : `${SITE_URL}${route.ogImage.startsWith('/') ? route.ogImage : `/${route.ogImage}`}`;
  const imageType = ogImageUrl.endsWith('.webp') ? 'image/webp' : 'image/png';
  const imageAlt = `${route.title} Preview`;

  let html = template;

  // 1. Primary tags
  html = setTitle(html, route.title);
  html = setMetaName(html, 'description', route.description);
  html = setCanonical(html, canonicalUrl);

  // 2. Open Graph tags
  html = setMetaProperty(html, 'og:title', route.title);
  html = setMetaProperty(html, 'og:description', route.description);
  html = setMetaProperty(html, 'og:url', canonicalUrl);
  html = setMetaProperty(html, 'og:image', ogImageUrl);
  html = setMetaProperty(html, 'og:image:secure_url', ogImageUrl);
  html = setMetaProperty(html, 'og:image:type', imageType);
  html = setMetaProperty(html, 'og:image:alt', imageAlt);

  // Declare dimensions ONLY for the standard 1200x630 banner.
  // For project screenshots (arbitrary aspect ratios), strip declared dimensions
  // so social debuggers (Facebook, LinkedIn) auto-detect natural size without mis-cropping.
  if (route.ogImage === '/og-preview.png') {
    html = setMetaProperty(html, 'og:image:width', '1200');
    html = setMetaProperty(html, 'og:image:height', '630');
  } else {
    html = removeMetaProperty(html, 'og:image:width');
    html = removeMetaProperty(html, 'og:image:height');
  }

  // 3. Twitter tags
  html = setMetaName(html, 'twitter:title', route.title);
  html = setMetaName(html, 'twitter:description', route.description);
  html = setMetaName(html, 'twitter:image', ogImageUrl);
  html = setMetaName(html, 'twitter:url', canonicalUrl);
  html = setMetaName(html, 'twitter:image:alt', imageAlt);

  // 4. JSON-LD structured data
  if (route.jsonLd) {
    html = setJsonLd(html, route.jsonLd);
  }

  // 5. Semantic non-JS fallback inside <noscript>
  // <div id="root"></div> remains completely empty so #root:empty::after handles the
  // background cleanly and React mounts with zero flash-of-content or CLS.
  if (route.fallbackHtml) {
    html = setNoscriptContent(html, route.fallbackHtml);
  }

  // 6. Write to dist/<route>/index.html (directory index)
  // and dist/<route>.html (cleanUrls direct match)
  const subPath = route.path.replace(/^\/+/, '');
  const outDir = join(distDir, subPath);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html, 'utf8');
  writeFileSync(join(distDir, `${subPath}.html`), html, 'utf8');

  generatedCount++;
}

const duration = (performance.now() - startTime).toFixed(2);
console.log(`✓ prerender: generated ${generatedCount} route snapshots in ${duration}ms`);
