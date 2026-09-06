#!/usr/bin/env node
/**
 * scripts/indexnow-submit.mjs
 * Submits all sitemap URLs to IndexNow (Bing/Yandex/Seznam) after each build.
 * Run via: node scripts/indexnow-submit.mjs
 * Or hook into package.json "postbuild" script.
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { getRoutes } from './routes.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const SITE_URL    = process.env.VITE_SITE_URL || 'https://hardikbhaskar.vercel.app';
const KEY         = 'ba4a24c6fef4406899d311af30c603fc';
const KEY_LOCATION = `${SITE_URL}/${KEY}.txt`;
const HOST        = new URL(SITE_URL).hostname;
const API_ENDPOINT = 'https://api.indexnow.org/IndexNow';

// Parse complete list from public/sitemap.xml so all routes + document URLs are submitted
function getSitemapUrls() {
  const sitemapPath = join(ROOT, 'public', 'sitemap.xml');
  if (existsSync(sitemapPath)) {
    const xml = readFileSync(sitemapPath, 'utf8');
    const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    if (matches.length > 0) return matches;
  }
  return getRoutes().map((r) => `${SITE_URL}${r.path === '/' ? '/' : r.path}`);
}

const URL_LIST = getSitemapUrls();


async function submit() {
  const body = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: URL_LIST,
  });

  console.log(`🔔 IndexNow: submitting ${URL_LIST.length} URLs to ${API_ENDPOINT}…`);

  try {
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body,
    });

    if (res.ok) {
      console.log(`✓ IndexNow: HTTP ${res.status} — URLs accepted`);
    } else {
      const text = await res.text().catch(() => '');
      console.error(`✗ IndexNow: HTTP ${res.status} — ${text}`);
      process.exit(1);
    }
  } catch (err) {
    // Network errors during CI/CD shouldn't break the build — just warn.
    console.warn(`⚠  IndexNow: network error (non-fatal) — ${err.message}`);
  }
}

submit();
