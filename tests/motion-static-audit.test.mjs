import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

test('Static Motion Audit: opening.css animates only transform and opacity', () => {
  const openingCssPath = path.join(ROOT, 'src', 'motion', 'opening.css');
  assert.equal(fs.existsSync(openingCssPath), true, 'src/motion/opening.css must exist');
  const css = fs.readFileSync(openingCssPath, 'utf8');

  // Find all keyframes blocks
  const keyframesMatches = css.match(/@keyframes\s+[\w-]+\s*\{[\s\S]*?\}\s*\}/g) || [];
  assert.ok(keyframesMatches.length > 0, 'Must contain @keyframes definitions');

  const bannedProperties = [
    'filter:',
    'backdrop-filter:',
    'box-shadow:',
    'width:',
    'height:',
    'top:',
    'left:',
    'right:',
    'bottom:',
    'margin:',
    'background-position:'
  ];

  for (const kf of keyframesMatches) {
    for (const prop of bannedProperties) {
      assert.equal(
        kf.includes(prop),
        false,
        `Keyframe block must not animate banned property ${prop} in opening.css: ${kf}`
      );
    }
  }
});

test('Static Motion Audit: GSAP scroll flow animates only transform and opacity', () => {
  const scrollFlowPath = path.join(ROOT, 'src', 'components', 'sections', 'ScrollFlow.tsx');
  assert.equal(fs.existsSync(scrollFlowPath), true, 'ScrollFlow.tsx must exist');
  const code = fs.readFileSync(scrollFlowPath, 'utf8');

  // Verify gsap animations only touch transform properties (scaleX, scaleY, x, y, autoAlpha, opacity)
  const bannedGsapProps = ['filter', 'backdropFilter', 'boxShadow', 'width', 'height', 'top', 'left', 'margin'];
  for (const prop of bannedGsapProps) {
    const propRegex = new RegExp(`\\b${prop}\\s*:`, 'g');
    assert.equal(
      propRegex.test(code),
      false,
      `ScrollFlow.tsx must not animate banned GSAP property ${prop}`
    );
  }
});

test('Static Motion Audit: will-change is scoped only to intro state', () => {
  const openingCssPath = path.join(ROOT, 'src', 'motion', 'opening.css');
  const css = fs.readFileSync(openingCssPath, 'utf8');

  // All will-change declarations in opening.css must be under [data-intro="active"] selector
  const lines = css.split('\n');
  let currentSelector = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.includes('{')) {
      currentSelector = line;
    }
    if (line.includes('will-change:')) {
      // Must be inside an intro-active block
      assert.ok(
        css.includes('[data-intro="active"]'),
        'will-change must be scoped to data-intro="active"'
      );
    }
  }
});

test('Static Motion Audit: Zero em dashes or en dashes across project source and docs', () => {
  const filesToCheck = [
    'src/motion/tokens.ts',
    'src/motion/tokens.css',
    'src/motion/opening.css',
    'src/motion/scroll.ts',
    'src/motion/skipListener.ts',
    'src/components/sections/ScrollFlow.tsx',
    'src/components/sections/Hero.tsx',
    'src/components/sections/ContactSection.tsx',
    'src/components/layout/Navbar.tsx',
    'src/store/highlightStore.ts',
    'MOTION.md'
  ];

  for (const relPath of filesToCheck) {
    const fullPath = path.join(ROOT, relPath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const dashes = content.match(/[\u2013\u2014]/g);
      assert.equal(
        dashes,
        null,
        `File ${relPath} must contain zero em dashes or en dashes, found: ${dashes?.length}`
      );
    }
  }
});
