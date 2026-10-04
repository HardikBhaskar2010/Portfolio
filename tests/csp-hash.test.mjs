import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();

test('CSP Integrity: inline pre-paint intro script matches vercel.json sha256 hash', () => {
  const indexHtmlPath = path.join(ROOT, 'index.html');
  assert.equal(fs.existsSync(indexHtmlPath), true, 'index.html must exist');

  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  const scriptMatch = indexHtml.match(/<script>(\(function\(\)\{[\s\S]*?\}\)\(\);)<\/script>/);
  assert.ok(scriptMatch, 'index.html must contain inline pre-paint script');

  const scriptContent = scriptMatch[1];
  const computedHash = crypto.createHash('sha256').update(scriptContent).digest('base64');
  const expectedHashDirective = `'sha256-${computedHash}'`;

  const vercelPath = path.join(ROOT, 'vercel.json');
  assert.equal(fs.existsSync(vercelPath), true, 'vercel.json must exist');

  const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  const globalHeaders = vercelConfig.headers.find((h) => h.source === '/(.*)');
  assert.ok(globalHeaders, 'Global headers for /(.*) must be defined');

  const cspHeader = globalHeaders.headers.find((h) => h.key === 'Content-Security-Policy');
  assert.ok(cspHeader, 'Content-Security-Policy header must exist');

  // Verify hash is present in script-src
  assert.equal(
    cspHeader.value.includes(expectedHashDirective),
    true,
    `CSP must include ${expectedHashDirective} for inline script`
  );

  // Verify unsafe-inline is removed from script-src
  const scriptSrcPart = cspHeader.value.split(';').find((p) => p.trim().startsWith('script-src'));
  assert.ok(scriptSrcPart, 'script-src directive must exist in CSP');
  assert.equal(
    scriptSrcPart.includes("'unsafe-inline'"),
    false,
    "script-src in CSP must not contain 'unsafe-inline'"
  );
});

test('CSP Integrity: dist/index.html preserved script hash matches vercel.json', () => {
  const distIndexPath = path.join(ROOT, 'dist', 'index.html');
  if (!fs.existsSync(distIndexPath)) {
    return; // Pass if dist has not been generated yet
  }

  const distHtml = fs.readFileSync(distIndexPath, 'utf8');
  const scriptMatch = distHtml.match(/<script>(\(function\(\)\{[\s\S]*?\}\)\(\);)<\/script>/);
  assert.ok(scriptMatch, 'dist/index.html must contain inline pre-paint script');

  const scriptContent = scriptMatch[1];
  const computedHash = crypto.createHash('sha256').update(scriptContent).digest('base64');
  const expectedHashDirective = `'sha256-${computedHash}'`;

  const vercelConfig = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
  const globalHeaders = vercelConfig.headers.find((h) => h.source === '/(.*)');
  const cspHeader = globalHeaders.headers.find((h) => h.key === 'Content-Security-Policy');

  assert.equal(
    cspHeader.value.includes(expectedHashDirective),
    true,
    `CSP must match hash from built dist/index.html: ${expectedHashDirective}`
  );
});
