// scripts/generate-projects.mjs
// Runs at build time (via "prebuild" npm script) or manually via "npm run projects:sync".
// Fetches repos tagged with "portfolio-project" from GitHub, merges with local overrides,
// and writes src/data/projects.generated.json.

import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const USERNAME = 'HardikBhaskar2010';
const TOKEN = process.env.PORTFOLIO_GITHUB_TOKEN;
const PALETTE = ['#00E5FF', '#7C3AED', '#A855F7', '#F59E0B', '#EC4899', '#10B981'];

const colorFor = (name) => {
  const hash = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  return PALETTE[hash % PALETTE.length];
};

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

async function gh(path) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
  };

  const res = await fetch(`https://api.github.com${path}`, { headers });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(
      `GitHub API ${path} responded ${res.status} ${res.statusText}${body ? `\n${body}` : ''}`
    );
  }

  return res.json();
}

if (!TOKEN) {
  console.warn(
    '⚠️  PORTFOLIO_GITHUB_TOKEN is not set. ' +
      'Unauthenticated requests are rate-limited to 10/min. ' +
      'Set the token in .env (locally) or in Vercel/GitHub Actions environment variables.'
  );
}

// ── 1. Fetch repos tagged "portfolio-project" ──────────────────────────────
console.log(`🔍 Searching for repos tagged "portfolio-project" for user "${USERNAME}"…`);

const { items: repos } = await gh(
  `/search/repositories?q=user:${USERNAME}+topic:portfolio-project&sort=updated&per_page=100`
);

console.log(`   Found ${repos.length} repo(s).`);

// ── 2. Load overrides ──────────────────────────────────────────────────────
// Dynamic import with a .ts extension won't work in plain Node — we import
// the compiled-or-parallel .js version, or fall back gracefully if it doesn't exist yet.
let overrides = {};
try {
  const mod = await import('../src/data/projects.overrides.mjs');
  overrides = mod.overrides ?? {};
} catch {
  try {
    // Fallback: try the .ts source via ts-node / tsx if available
    const mod = await import('../src/data/projects.overrides.ts');
    overrides = mod.overrides ?? {};
  } catch {
    console.warn(
      '⚠️  Could not import projects.overrides — continuing with no overrides. ' +
        "Create src/data/projects.overrides.mjs (or .ts if using tsx) to add curated fields."
    );
  }
}

// ── 3. Map GitHub repos → Project shape ───────────────────────────────────
const projects = repos.map((repo) => {
  const slug = slugify(repo.name);
  const base = {
    id: slug,
    slug,
    title: repo.name
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    subtitle: repo.description ?? '',
    category: repo.language ?? 'Project',
    tag:
      repo.topics?.find(
        (t) => t !== 'portfolio-project' && t !== 'featured'
      ) ?? repo.language ?? '',
    year: String(new Date(repo.created_at).getFullYear()),
    image: '/images/project-placeholder.png',
    heroImage: '/images/project-placeholder.png',
    description: repo.description ?? '',
    longDescription: repo.description ?? '',
    featured: repo.topics?.includes('featured') ?? false,
    tools:
      repo.topics?.filter(
        (t) => !['portfolio-project', 'featured'].includes(t)
      ) ?? [],
    link: repo.homepage || repo.html_url,
    color: colorFor(repo.name),
  };

  // Merge hand-written overrides (keyed by slug, case-insensitive)
  const override =
    overrides[slug] ??
    overrides[slug.toLowerCase()] ??
    overrides[repo.name.toLowerCase()] ??
    {};

  return { ...base, ...override };
});

// ── 4. Write output ────────────────────────────────────────────────────────
const outPath = new URL('../src/data/projects.generated.json', import.meta.url);
writeFileSync(outPath, JSON.stringify(projects, null, 2) + '\n');

console.log(`✓ Generated ${projects.length} project(s) → src/data/projects.generated.json`);
