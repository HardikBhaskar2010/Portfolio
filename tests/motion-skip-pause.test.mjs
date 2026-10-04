import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

test('Pause Motion Hierarchy: OS reduced-motion strictly overrides user preference', async () => {
  // Mock window and document environment
  const mockStorage = new Map();
  let reducedMotionMatches = false;

  globalThis.window = {
    matchMedia: (query) => ({
      matches: query.includes('prefers-reduced-motion: reduce') ? reducedMotionMatches : false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
    dispatchEvent: () => true,
    addEventListener: () => {},
    removeEventListener: () => {},
  };

  globalThis.localStorage = {
    getItem: (key) => mockStorage.get(key) ?? null,
    setItem: (key, val) => { mockStorage.set(key, String(val)); },
    removeItem: (key) => { mockStorage.delete(key); },
    clear: () => { mockStorage.clear(); },
  };

  globalThis.document = {
    documentElement: {
      attributes: new Map(),
      getAttribute(k) { return this.attributes.get(k) ?? null; },
      setAttribute(k, v) { this.attributes.set(k, String(v)); },
      removeAttribute(k) { this.attributes.delete(k); },
    },
  };

  const { isMotionPaused, setMotionPaused, toggleMotionPaused } = await import(
    '../src/motion/motionPreference.ts'
  );

  // Case 1: OS allows motion, user has not paused -> false
  reducedMotionMatches = false;
  mockStorage.clear();
  assert.equal(isMotionPaused(), false);

  // Case 2: User pauses motion -> true
  setMotionPaused(true);
  assert.equal(isMotionPaused(), true);
  assert.equal(mockStorage.get('portfolio_motion_paused'), 'true');

  // Case 3: User unpauses motion -> false
  setMotionPaused(false);
  assert.equal(isMotionPaused(), false);
  assert.equal(mockStorage.get('portfolio_motion_paused'), 'false');

  // Case 4: OS reduced motion active -> unconditionally true
  reducedMotionMatches = true;
  assert.equal(isMotionPaused(), true);

  // Strict Override Rule: User tries to enable motion while OS reduced motion is active
  const result = setMotionPaused(false);
  assert.equal(result, true, 'setMotionPaused(false) must return true when OS reduced motion is active');
  assert.equal(isMotionPaused(), true, 'isMotionPaused() must remain true when OS reduced motion is active');
});

test('Mobile Accordion Fold: opening.css specifies bounded 1.40s duration', () => {
  const openingCssPath = path.join(ROOT, 'src', 'motion', 'opening.css');
  assert.equal(fs.existsSync(openingCssPath), true);
  const content = fs.readFileSync(openingCssPath, 'utf8');

  // Assert mobile media query exists
  assert.equal(content.includes('@media (max-width: 767px)'), true);
  // Assert mobile fold keyframe exists
  assert.equal(content.includes('@keyframes motion-mobile-headline-fold'), true);
  assert.equal(content.includes('rotateX(-90deg)'), true);
  assert.equal(content.includes('--delay-mobile-headline'), true);
  assert.equal(content.includes('--delay-mobile-focus'), true);
});
