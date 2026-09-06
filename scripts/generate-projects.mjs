// scripts/generate-projects.mjs
// Runs at build time (via "prebuild" npm script) or manually via "npm run projects:sync".
//
// For each repo tagged "portfolio-project" it:
//   1. Tries to fetch  assets/description.md  → longDescription
//   2. Tries to fetch  assets/pic.png         → image / heroImage (raw CDN URL)
//   3. Merges with projects.overrides.mjs for hand-curated metadata
//   4. Writes src/data/projects.generated.json

import { writeFileSync, existsSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const USERNAME  = 'HardikBhaskar2010';
let TOKEN       = process.env.PORTFOLIO_GITHUB_TOKEN;

if (!TOKEN) {
  try {
    const ghToken = execSync('gh auth token', { stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim();
    if (ghToken) {
      TOKEN = ghToken;
      console.log('🔑 Using authenticated token from GitHub CLI (gh auth token).');
    }
  } catch {
    // no gh cli token available
  }
}

const PALETTE   = ['#00E5FF', '#7C3AED', '#A855F7', '#F59E0B', '#EC4899', '#10B981'];
const FALLBACK_IMAGE = '/images/project-placeholder.webp';

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
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(3000) });
    if (!res.ok) return { ok: false };
    const text = await res.text();
    return { ok: true, text, url };
  } catch {
    return { ok: false };
  }
}

/**
 * Try to fetch file content via GitHub Contents API (authenticated, base64 encoded)
 */
async function fetchRepoFileContent(repoName, filePath) {
  try {
    const data = await gh(`/repos/${USERNAME}/${repoName}/contents/${filePath}`);
    if (data && data.content && data.encoding === 'base64') {
      const decoded = Buffer.from(data.content, 'base64').toString('utf8');
      return { ok: true, text: decoded };
    }
  } catch {
    // API call failed or file doesn't exist
  }
  return { ok: false };
}

/**
 * Fetch both assets/pic.png and assets/description.md from the repo in parallel.
 * Returns { imageUrl, longDescription } — each falls back gracefully to existing cache or default.
 */
async function fetchRepoAssets(repoName, fallbackDescription, existingProject = null) {
  const slug = slugify(repoName);
  
  // 1. Fetch description and image in parallel
  const [picResult, rawMd] = await Promise.all([
    rawFile(repoName, 'assets/pic.png'),
    rawFile(repoName, 'assets/description.md'),
  ]);

  let longDescription = '';
  if (rawMd.ok && rawMd.text.trim()) {
    longDescription = rawMd.text.trim();
  } else {
    // Try GitHub Contents API
    const apiMd = await fetchRepoFileContent(repoName, 'assets/description.md');
    if (apiMd.ok && apiMd.text.trim()) {
      longDescription = apiMd.text.trim();
    } else {
      // Try local fallback file
      const localPath = `./public/descriptions/${slug}.md`;
      if (existsSync(localPath)) {
        try {
          longDescription = readFileSync(localPath, 'utf8').trim();
        } catch {}
      }
    }
  }

  if (!longDescription) {
    longDescription = existingProject?.longDescription || fallbackDescription;
  }

  let imageUrl = existingProject?.image || FALLBACK_IMAGE;
  if (picResult.ok) {
    imageUrl = `https://raw.githubusercontent.com/${USERNAME}/${repoName}/HEAD/assets/pic.png`;
  } else {
    // Try checking if pic.png exists via GitHub Contents API
    try {
      const picData = await gh(`/repos/${USERNAME}/${repoName}/contents/assets/pic.png`);
      if (picData && picData.download_url) {
        imageUrl = picData.download_url;
      }
    } catch {
      if (existingProject?.image && existingProject.image !== FALLBACK_IMAGE) {
        imageUrl = existingProject.image;
      }
    }
  }

  return { imageUrl, longDescription };
}

// ── 0. Read existing cache & overrides ─────────────────────────────────────

const outPath = new URL('../src/data/projects.generated.json', import.meta.url);
let existingProjects = [];
if (existsSync(outPath)) {
  try {
    existingProjects = JSON.parse(readFileSync(outPath, 'utf8'));
    console.log(`📁 Loaded ${existingProjects.length} existing project(s) from cache.`);
  } catch {}
}

let overrides = {};
try {
  const mod = await import('../src/data/projects.overrides.mjs');
  overrides = mod.overrides ?? {};
  console.log(`   Loaded overrides for: ${Object.keys(overrides).join(', ') || '(none)'}`);
} catch {
  console.warn('⚠️  Could not load projects.overrides.mjs — no overrides applied.');
}

if (!TOKEN) {
  console.warn(
    '⚠️  PORTFOLIO_GITHUB_TOKEN is not set.\n' +
    '   Unauthenticated requests are rate-limited (10 req/min for search, 60 req/min for raw).\n' +
    '   Set it in .env.local (locally) or in Vercel / GitHub Actions environment variables.'
  );
}

// ── 1. Fetch repos ─────────────────────────────────────────────────────────

console.log(`🔍 Searching repos tagged "portfolio-project" for ${USERNAME}…`);

let repos = [];
try {
  const searchResult = await gh(
    `/search/repositories?q=user:${USERNAME}+topic:portfolio-project&sort=updated&per_page=100`
  );
  repos = searchResult.items || [];
  console.log(`   Found ${repos.length} repo(s).`);
} catch (err) {
  console.warn(`\n⚠️  GitHub search API failed: ${err.message}`);
  if (existingProjects.length > 0) {
    console.warn(`🛡️  Rate limit reached or network offline. Retaining all ${existingProjects.length} existing project(s) in projects.generated.json.`);
    console.log(`✓ Retained existing ${existingProjects.length} project(s) → build will proceed safely without dropping any projects.\n`);
    process.exit(0);
  } else {
    throw err;
  }
}

// ── 2. Check for missing known projects (e.g. Vectoris during search indexing lag) ──

const fetchedSlugs = new Set(repos.map((r) => slugify(r.name)));
const missingProjects = existingProjects.filter((p) => !fetchedSlugs.has(p.slug));

if (missingProjects.length > 0) {
  console.warn(`⚠️  Search returned ${repos.length} repos; ${missingProjects.length} known project(s) missing from search: ${missingProjects.map((p) => p.slug).join(', ')}.`);
  console.log(`🛡️  Preserving missing project(s) from cache so nothing is dropped from portfolio or sitemap.`);
}

// ── 3. Fetch per-repo assets in parallel ───────────────────────────────────

console.log('📦 Fetching assets/pic.png and assets/description.md from each repo…');

const assetResults = await Promise.all(
  repos.map(async (repo) => {
    const slug = slugify(repo.name);
    const existing = existingProjects.find((p) => p.slug === slug);
    const { imageUrl, longDescription } = await fetchRepoAssets(
      repo.name,
      repo.description ?? '',
      existing
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

  // Merge hand-written overrides (keyed by slug, case-insensitive)
  const override =
    overrides[slug] ??
    overrides[slug.toLowerCase()] ??
    overrides[repo.name.toLowerCase()] ??
    {};

  const finalImage = (imageUrl && imageUrl !== FALLBACK_IMAGE)
    ? imageUrl
    : (override.fallbackImage || FALLBACK_IMAGE);

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
    image:           finalImage,
    heroImage:       finalImage,
    description:     repo.description ?? '',
    longDescription,
    featured:        repo.topics?.includes('featured') ?? false,
    tools:           repo.topics?.filter(
                       (t) => !['portfolio-project', 'featured'].includes(t)
                     ) ?? [],
    link:            repo.homepage || repo.html_url,
    color:           colorFor(repo.name),
  };

  return { ...base, ...override };
});

// Preserve any missing projects from existing cache with fresh overrides applied
for (const missing of missingProjects) {
  const override =
    overrides[missing.slug] ??
    overrides[missing.slug.toLowerCase()] ??
    overrides[missing.id?.toLowerCase()] ??
    {};
  projects.push({ ...missing, ...override });
}

// ── 5. Write output ────────────────────────────────────────────────────────

writeFileSync(outPath, JSON.stringify(projects, null, 2) + '\n');

console.log(`\n✓ Generated ${projects.length} project(s) → src/data/projects.generated.json`);
console.log('  Legend: 🖼 = has assets/pic.png   📝 = has assets/description.md   · = using fallback');
