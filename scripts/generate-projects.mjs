// scripts/generate-projects.mjs
// Runs at build time (via "prebuild" npm script) or manually via "npm run projects:sync".
//
// For each repo tagged "portfolio-project" it:
//   1. Tries to fetch  assets/description.md  → longDescription
//   2. Tries to fetch  assets/pic.png         → image / heroImage (raw CDN URL)
//   3. Merges with projects.overrides.mjs for hand-curated metadata
//   4. Writes src/data/projects.generated.json

import { writeFileSync } from 'node:fs';

const USERNAME  = 'HardikBhaskar2010';
const TOKEN     = process.env.PORTFOLIO_GITHUB_TOKEN;
const PALETTE   = ['#00E5FF', '#7C3AED', '#A855F7', '#F59E0B', '#EC4899', '#10B981'];
const FALLBACK_IMAGE = '/images/project-placeholder.png';

// ── Helpers ────────────────────────────────────────────────────────────────

const colorFor = (name) => {
  const hash = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  return PALETTE[hash % PALETTE.length];
};

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/** GitHub API call with auth headers */
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
      `GitHub API ${path} → ${res.status} ${res.statusText}${body ? `\n${body}` : ''}`
    );
  }
  return res.json();
}

/**
 * Try to fetch a raw file from a repo.
 * Returns { ok: true, text } or { ok: false }.
 * Uses /HEAD/ so it always resolves to whatever the default branch is.
 */
async function rawFile(repoName, filePath) {
  const url = `https://raw.githubusercontent.com/${USERNAME}/${repoName}/HEAD/${filePath}`;
  try {
    const headers = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {};
    const res = await fetch(url, { headers });
    if (!res.ok) return { ok: false };
    const text = await res.text();
    return { ok: true, text, url };
  } catch {
    return { ok: false };
  }
}

/**
 * Fetch both assets/pic.png and assets/description.md from the repo in parallel.
 * Returns { imageUrl, longDescription } — each falls back gracefully.
 */
async function fetchRepoAssets(repoName, fallbackDescription) {
  const [picResult, mdResult] = await Promise.all([
    rawFile(repoName, 'assets/pic.png'),
    rawFile(repoName, 'assets/description.md'),
  ]);

  const imageUrl = picResult.ok
    ? `https://raw.githubusercontent.com/${USERNAME}/${repoName}/HEAD/assets/pic.png`
    : FALLBACK_IMAGE;

  const longDescription = mdResult.ok
    ? mdResult.text.trim()
    : fallbackDescription;

  return { imageUrl, longDescription };
}

// ── 0. Auth check ──────────────────────────────────────────────────────────

if (!TOKEN) {
  console.warn(
    '⚠️  PORTFOLIO_GITHUB_TOKEN is not set.\n' +
    '   Unauthenticated requests are rate-limited (10 req/min for search, 60 req/min for raw).\n' +
    '   Set it in .env.local (locally) or in Vercel / GitHub Actions environment variables.'
  );
}

// ── 1. Fetch repos ─────────────────────────────────────────────────────────

console.log(`🔍 Searching repos tagged "portfolio-project" for ${USERNAME}…`);

const { items: repos } = await gh(
  `/search/repositories?q=user:${USERNAME}+topic:portfolio-project&sort=updated&per_page=100`
);

console.log(`   Found ${repos.length} repo(s).`);

// ── 2. Load overrides ──────────────────────────────────────────────────────

let overrides = {};
try {
  const mod = await import('../src/data/projects.overrides.mjs');
  overrides = mod.overrides ?? {};
  console.log(`   Loaded overrides for: ${Object.keys(overrides).join(', ') || '(none)'}`);
} catch {
  console.warn('⚠️  Could not load projects.overrides.mjs — no overrides applied.');
}

// ── 3. Fetch per-repo assets in parallel ───────────────────────────────────

console.log('📦 Fetching assets/pic.png and assets/description.md from each repo…');

const assetResults = await Promise.all(
  repos.map(async (repo) => {
    const { imageUrl, longDescription } = await fetchRepoAssets(
      repo.name,
      repo.description ?? ''
    );

    const hasImage = imageUrl !== FALLBACK_IMAGE;
    const hasDesc  = longDescription !== (repo.description ?? '');
    const status   = [hasImage ? '🖼' : '·', hasDesc ? '📝' : '·'].join('');
    console.log(`   ${status}  ${repo.name}`);

    return { imageUrl, longDescription };
  })
);

// ── 4. Build project objects ───────────────────────────────────────────────

const projects = repos.map((repo, i) => {
  const { imageUrl, longDescription } = assetResults[i];
  const slug = slugify(repo.name);

  const base = {
    id:              slug,
    slug,
    title:           repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    subtitle:        repo.description ?? '',
    category:        repo.language ?? 'Project',
    tag:             repo.topics?.find(
                       (t) => t !== 'portfolio-project' && t !== 'featured'
                     ) ?? repo.language ?? '',
    year:            String(new Date(repo.created_at).getFullYear()),
    image:           imageUrl,
    heroImage:       imageUrl,
    description:     repo.description ?? '',
    longDescription,
    featured:        repo.topics?.includes('featured') ?? false,
    tools:           repo.topics?.filter(
                       (t) => !['portfolio-project', 'featured'].includes(t)
                     ) ?? [],
    link:            repo.homepage || repo.html_url,
    color:           colorFor(repo.name),
  };

  // Merge hand-written overrides (keyed by slug, case-insensitive)
  const override =
    overrides[slug] ??
    overrides[slug.toLowerCase()] ??
    overrides[repo.name.toLowerCase()] ??
    {};

  return { ...base, ...override };
});

// ── 5. Write output ────────────────────────────────────────────────────────

const outPath = new URL('../src/data/projects.generated.json', import.meta.url);
writeFileSync(outPath, JSON.stringify(projects, null, 2) + '\n');

console.log(`\n✓ Generated ${projects.length} project(s) → src/data/projects.generated.json`);
console.log('  Legend: 🖼 = has assets/pic.png   📝 = has assets/description.md   · = using fallback');
