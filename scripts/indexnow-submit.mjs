#!/usr/bin/env node
/**
 * scripts/indexnow-submit.mjs
 * Submits all sitemap URLs to IndexNow (Bing/Yandex/Seznam) after each build.
 * Run via: node scripts/indexnow-submit.mjs
 * Or hook into package.json "postbuild" script.
 */

const SITE_URL    = process.env.VITE_SITE_URL || 'https://lunakitsune.vercel.app';
const KEY         = 'ba4a24c6fef4406899d311af30c603fc';
const KEY_LOCATION = `${SITE_URL}/${KEY}.txt`;
const HOST        = new URL(SITE_URL).hostname;
const API_ENDPOINT = 'https://api.indexnow.org/IndexNow';

const URL_LIST = [
  `${SITE_URL}/`,
  `${SITE_URL}/about`,
  `${SITE_URL}/projects`,
  `${SITE_URL}/projects/vectoris`,
  `${SITE_URL}/projects/veronica-ai`,
  `${SITE_URL}/projects/aegis-decision-intelligence-platform`,
  `${SITE_URL}/projects/mahinaos`,
  `${SITE_URL}/projects/stem-idea-generator`,
];

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
