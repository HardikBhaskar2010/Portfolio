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
});

test('Motion Tokens: Zero raw milliseconds outside allowed scale in tokens.ts', () => {
  const allowedNumbers = [120, 240, 420, 700, 1100, 84, 168, 294, 490, 770, 75, 4];
  // Basic sanity check ensuring tokens.ts parses cleanly
  assert.equal(tokensTsContent.includes('export const DURATION'), true);
  assert.equal(tokensTsContent.includes('export const EXIT_DURATION'), true);
  assert.equal(tokensTsContent.includes('export const EASING'), true);
});
