import test from 'node:test';
import assert from 'node:assert/strict';

test('Scroll Motion: getGsap lazily loads and registers ScrollTrigger', async () => {
  const { getGsap, initScrollTriggerContext } = await import('../src/motion/scroll.ts');

  assert.equal(typeof getGsap, 'function');
  assert.equal(typeof initScrollTriggerContext, 'function');

  const { gsap, ScrollTrigger } = await getGsap();
  assert.ok(gsap, 'gsap must be resolved');
  assert.ok(ScrollTrigger, 'ScrollTrigger must be resolved');
  assert.equal(typeof gsap.matchMedia, 'function', 'gsap.matchMedia must be available');
  assert.equal(typeof ScrollTrigger.create, 'function', 'ScrollTrigger.create must be available');
});
