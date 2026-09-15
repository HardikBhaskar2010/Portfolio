import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

test('Security Headers: vercel.json contains hardened headers', () => {
  const vercelPath = join(ROOT, 'vercel.json');
  assert.ok(existsSync(vercelPath), 'vercel.json must exist');

  const config = JSON.parse(readFileSync(vercelPath, 'utf8'));
  assert.ok(Array.isArray(config.headers), 'headers must be defined');

  const globalHeaders = config.headers.find((h) => h.source === '/(.*)');
  assert.ok(globalHeaders, 'Global headers for /(.*) must be defined');

  const headerMap = Object.fromEntries(
    globalHeaders.headers.map((h) => [h.key.toLowerCase(), h.value])
  );

  assert.equal(headerMap['x-frame-options'], 'DENY');
  assert.equal(headerMap['x-content-type-options'], 'nosniff');
  assert.equal(headerMap['referrer-policy'], 'strict-origin-when-cross-origin');
  assert.match(headerMap['strict-transport-security'], /max-age=63072000/);
  assert.ok(headerMap['content-security-policy'], 'CSP header must be present');
  assert.match(headerMap['content-security-policy'], /default-src 'self'/);
  assert.match(headerMap['content-security-policy'], /frame-ancestors 'none'/);
  assert.match(headerMap['content-security-policy'], /object-src 'none'/);
  assert.ok(headerMap['permissions-policy'], 'Permissions-Policy header must be present');
});

test('Secret Protection: .gitignore excludes environment secrets', () => {
  const gitignorePath = join(ROOT, '.gitignore');
  const content = readFileSync(gitignorePath, 'utf8');

  assert.match(content, /^\.env$/m, '.env must be ignored');
  assert.match(content, /^\.env\.\*$/m, '.env.* must be ignored');
  assert.match(content, /^!\.env\.example$/m, '!.env.example must be kept');
});

test('Search Engine Directives: robots.txt disallows /api/', () => {
  const robotsPath = join(ROOT, 'public', 'robots.txt');
  assert.ok(existsSync(robotsPath), 'robots.txt must exist');
  const content = readFileSync(robotsPath, 'utf8');

  assert.match(content, /Disallow:\s*\/api\//i, 'Disallow: /api/ must be present in robots.txt');
});

test('Build Script Integrity: routes.mjs and prerender.mjs do not use new Function or eval', () => {
  const routesPath = join(ROOT, 'scripts', 'routes.mjs');
  const prerenderPath = join(ROOT, 'scripts', 'prerender.mjs');

  const routesContent = readFileSync(routesPath, 'utf8');
  const prerenderContent = readFileSync(prerenderPath, 'utf8');

  assert.doesNotMatch(routesContent, /new\s+Function/, 'routes.mjs must not contain new Function');
  assert.doesNotMatch(routesContent, /\beval\s*\(/, 'routes.mjs must not contain eval');
  assert.doesNotMatch(prerenderContent, /new\s+Function/, 'prerender.mjs must not contain new Function');
  assert.doesNotMatch(prerenderContent, /\beval\s*\(/, 'prerender.mjs must not contain eval');
});

test('Safe Serialization: prerender.mjs escapes script tags in JSON-LD', () => {
  const prerenderPath = join(ROOT, 'scripts', 'prerender.mjs');
  const prerenderContent = readFileSync(prerenderPath, 'utf8');

  assert.match(
    prerenderContent,
    /\\u003c/,
    'prerender.mjs must escape < to \\u003c to prevent script breakout in JSON-LD'
  );
});

test('Supply Chain: pdfjs-dist has no dynamic script injection', () => {
  const pdfViewerPath = join(ROOT, 'src', 'components', 'ui', 'PdfViewer.tsx');
  const content = readFileSync(pdfViewerPath, 'utf8');

  assert.doesNotMatch(
    content,
    /document\.createElement\(['"]script['"]\)/,
    'PdfViewer must not dynamically inject unhashed external scripts'
  );
});

test('Audio Accessibility: audio.ts provides mute controls and persists preference', () => {
  const audioPath = join(ROOT, 'src', 'lib', 'audio.ts');
  const content = readFileSync(audioPath, 'utf8');

  assert.match(content, /isAudioMuted/, 'audio.ts must export isAudioMuted');
  assert.match(content, /setAudioMuted/, 'audio.ts must export setAudioMuted');
  assert.match(content, /toggleAudioMuted/, 'audio.ts must export toggleAudioMuted');
  assert.match(content, /prefers-reduced-motion/, 'audio.ts must check prefers-reduced-motion');
  assert.match(content, /portfolio_audio_muted/, 'audio.ts must persist to localStorage');
});

test('Privacy & Consent: analytics.ts implements consent management', () => {
  const analyticsPath = join(ROOT, 'src', 'lib', 'analytics.ts');
  const content = readFileSync(analyticsPath, 'utf8');

  assert.match(content, /consentManager/, 'analytics.ts must implement consentManager');
  assert.match(content, /getStatus/, 'consentManager must provide getStatus');
  assert.match(content, /setConsent/, 'consentManager must provide setConsent');
  assert.match(content, /analytics_consent/, 'consent must be stored in localStorage');
});

test('Contact API Logic: sanitization and rate limiting invariants', async () => {
  const contactApiPath = join(ROOT, 'api', 'contact.ts');
  const content = readFileSync(contactApiPath, 'utf8');

  assert.match(content, /req\.method\s*!==?\s*['"]POST['"]/, 'Must enforce POST method only');
  assert.match(content, /status:\s*405/, 'Must respond with 405 for disallowed methods');
  assert.match(content, /body\.website/, 'Must check bot honeypot field');
  assert.match(content, /escapeHtml/, 'Must escape HTML in payload');
  assert.match(content, /isRateLimited/, 'Must implement IP rate limiting');
  assert.match(content, /name\.length\s*>\s*100/, 'Must validate name length limit');
  assert.match(content, /message\.length\s*>\s*5000/, 'Must validate message length limit');
  assert.match(content, /replace\(\/\[\\r\\n\\t\]\/g/, 'Must strip CRLF injection from subject header');
});
