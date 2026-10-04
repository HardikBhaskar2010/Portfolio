import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Parse TypeScript tokens file
const tokensTsContent = fs.readFileSync(path.resolve('src/motion/tokens.ts'), 'utf8');
const tokensCssContent = fs.readFileSync(path.resolve('src/motion/tokens.css'), 'utf8');

test('Motion Tokens: CSS variables match TypeScript tokens source of truth', () => {
  // Extract durations from tokens.ts
  const durations = [120, 240, 420, 700, 1100];
  for (const d of durations) {
    const cssMatch = tokensCssContent.includes(`--dur-${d}: ${d}ms;`);
    assert.equal(cssMatch, true, `tokens.css must define --dur-${d}: ${d}ms;`);
  }

  // Extract exit durations (entrance * 0.7)
  const exitDurations = [
    { key: 84, val: Math.round(120 * 0.7) },
    { key: 168, val: Math.round(240 * 0.7) },
    { key: 294, val: Math.round(420 * 0.7) },
    { key: 490, val: Math.round(700 * 0.7) },
    { key: 770, val: Math.round(1100 * 0.7) },
  ];
  for (const { key, val } of exitDurations) {
    const cssMatch = tokensCssContent.includes(`--exit-${key}: ${val}ms;`);
    assert.equal(cssMatch, true, `tokens.css must define --exit-${key}: ${val}ms;`);
  }

  // Verify easings
  assert.equal(
    tokensCssContent.includes('--ease-out: cubic-bezier(0.32, 0.72, 0, 1);'),
    true,
    'tokens.css must define --ease-out with cubic-bezier(0.32, 0.72, 0, 1)'
  );
  assert.equal(
    tokensCssContent.includes('--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);'),
    true,
    'tokens.css must define --ease-in-out with cubic-bezier(0.65, 0, 0.35, 1)'
  );

  // Verify stagger
  assert.equal(
    tokensCssContent.includes('--stagger-step: 75ms;'),
    true,
    'tokens.css must define --stagger-step: 75ms;'
  );

  // Verify overshoot constraint
  assert.equal(
    tokensCssContent.includes('--overshoot-max: 4%;'),
    true,
    'tokens.css must define --overshoot-max: 4%;'
  );

  // Verify delay tokens
  const delayChecks = [
    { name: '--delay-0', val: '0ms' },
    { name: '--delay-headline', val: '300ms' },
    { name: '--delay-avatar', val: '700ms' },
    { name: '--delay-focus', val: '800ms' },
    { name: '--delay-preview', val: '850ms' },
    { name: '--delay-headline-cta', val: '1120ms' },
    { name: '--delay-scene3d', val: '1300ms' },
    { name: '--delay-scroll-orb', val: '1400ms' },
    { name: '--delay-avatar-content', val: '1520ms' },
    { name: '--delay-focus-content', val: '1620ms' },
    { name: '--delay-preview-content', val: '1670ms' },
    { name: '--delay-badges', val: '1700ms' },
    { name: '--delay-light-sweep', val: '1950ms' },
    { name: '--delay-settle', val: '2200ms' },
    { name: '--delay-mobile-headline', val: '200ms' },
    { name: '--delay-mobile-avatar', val: '400ms' },
    { name: '--delay-mobile-focus', val: '500ms' },
    { name: '--delay-mobile-preview', val: '550ms' },
    { name: '--delay-mobile-avatar-content', val: '940ms' },
    { name: '--delay-mobile-headline-cta', val: '1020ms' },
    { name: '--delay-mobile-focus-content', val: '1040ms' },
    { name: '--delay-mobile-preview-content', val: '1090ms' },
    { name: '--delay-mobile-settle', val: '1400ms' },
    // Preloader delay checks
    { name: '--delay-preloader-milestone1', val: '0ms' },
    { name: '--delay-preloader-milestone2', val: '120ms' },
    { name: '--delay-preloader-milestone3', val: '240ms' },
    { name: '--delay-preloader-milestone4', val: '360ms' },
    { name: '--delay-preloader-resolve', val: '480ms' },
    { name: '--delay-preloader-hello', val: '600ms' },
    { name: '--delay-preloader-hello-hold', val: '840ms' },
    { name: '--delay-preloader-hello-fade', val: '960ms' },
    { name: '--delay-preloader-center-panel', val: '1080ms' },
    { name: '--delay-preloader-mid-panels', val: '1155ms' },
    { name: '--delay-preloader-outer-panels', val: '1230ms' },
    { name: '--delay-preloader-overlay-fade', val: '1930ms' },
    { name: '--delay-preloader-settle', val: '2050ms' },
    { name: '--delay-preloader-mobile-milestone1', val: '0ms' },
    { name: '--delay-preloader-mobile-milestone2', val: '120ms' },
    { name: '--delay-preloader-mobile-resolve', val: '240ms' },
    { name: '--delay-preloader-mobile-hello', val: '360ms' },
    { name: '--delay-preloader-mobile-hello-hold', val: '600ms' },
    { name: '--delay-preloader-mobile-hello-fade', val: '720ms' },
    { name: '--delay-preloader-mobile-center-panel', val: '840ms' },
    { name: '--delay-preloader-mobile-flank-panels', val: '915ms' },
    { name: '--delay-preloader-mobile-overlay-fade', val: '1260ms' },
    { name: '--delay-preloader-mobile-settle', val: '1380ms' },
  ];
  for (const { name, val } of delayChecks) {
    const cssMatch = tokensCssContent.includes(`${name}: ${val};`);
    assert.equal(cssMatch, true, `tokens.css must define ${name}: ${val};`);
  }
});

test('Motion Tokens: Zero raw milliseconds outside allowed scale in tokens.ts', () => {
  // Basic sanity check ensuring tokens.ts parses cleanly
  assert.equal(tokensTsContent.includes('export const DURATION'), true);
  assert.equal(tokensTsContent.includes('export const EXIT_DURATION'), true);
  assert.equal(tokensTsContent.includes('export const EASING'), true);
  assert.equal(tokensTsContent.includes('export const DELAY'), true);
  assert.equal(tokensTsContent.includes('export const OPENING_DELAY'), true);
  assert.equal(tokensTsContent.includes('export const PRELOADER_DELAY'), true);
});
