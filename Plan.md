# Plan: Auto-Syncing GitHub Projects — No Backend

Based on the actual repo (`HardikBhaskar2010/Portfolio`), not a generic template.

## What I found in your code

- `src/data/projects.ts` exports a hardcoded `Project[]` array with a rich, **hand-curated** shape:
  `subtitle`, `longDescription`, custom `heroImage`, brand `color`, curated `tools` list, `category`, `tag`.
  This is *not* 1:1 with what the GitHub API returns — it's closer to case-study content than repo metadata.
- 5 files consume it the same simple way: `import { projects } from '@/data/projects'`
  (`FeaturedWork.tsx`, `Hero.tsx`, `MarqueeBanner.tsx`, `Projects.tsx`, `ProjectDetail.tsx`).
- `api/contact.ts` already exists as a Vercel **Edge Function** using `process.env` for secrets (Resend key) — same pattern we'll reuse for the GitHub token. No server, no `api/` changes needed for this feature.
- `package.json` has `"type": "module"` and `"build": "tsc -b && vite build"` — a `prebuild` npm script will run automatically on every Vercel deploy with zero Vercel config changes.

**Implication:** don't fully auto-generate `projects.ts` from raw GitHub data — you'd lose the curation. Instead: auto-*discover* which repos to show (via a topic tag), auto-fill sane defaults from GitHub, and let a small overrides file hold your hand-written polish. New repos show up immediately with decent defaults; you upgrade the ones you care about whenever you want.

---

## Architecture

```
GitHub repos (tagged topic: portfolio-project)
        │
        ▼
scripts/generate-projects.mjs   (Node script, runs at build time)
        │  merges GitHub data + src/data/projects.overrides.ts
        ▼
src/data/projects.generated.json   (committed or build-only, your call)
        │
        ▼
src/data/projects.ts   (unchanged export shape — reads generated + overrides)
        │
        ▼
FeaturedWork / Hero / MarqueeBanner / Projects / ProjectDetail  ← NO CHANGES NEEDED
```

No runtime backend. No new `api/` route. GitHub Actions only move data around; Vercel just builds a static site like it already does.

---

## Step 1 — Tag the repos you want shown

On each project repo → **Settings → Topics** → add:
- `portfolio-project` — required, marks it for inclusion
- `featured` — optional, maps to your existing `featured: boolean` field

## Step 2 — Get a token

Create a fine-grained GitHub PAT, read-only, "Public Repositories" access only (no write scopes needed).

Add it in two places:
- Locally: `.env` → `PORTFOLIO_GITHUB_TOKEN=...` (repo already has `.env.example` + `.gitignore`, follow that pattern)
- Vercel: Project → Settings → Environment Variables → `PORTFOLIO_GITHUB_TOKEN`
- GitHub Actions (later step): repo → Settings → Secrets and variables → Actions → same name

## Step 3 — Overrides file (your curation layer)

```ts
// src/data/projects.overrides.ts
import type { Project } from './projects';

// Keyed by repo name (case-insensitive). Only include fields you want to
// override — everything else falls back to GitHub-derived defaults.
export const overrides: Record<string, Partial<Project>> = {
  'veronica-ai': {
    subtitle: 'Conversational AI System',
    heroImage: '/images/project-ai-veronica.png',
    longDescription: 'Veronica is a next-generation AI system built with custom agent orchestration...',
    color: '#7C3AED',
    category: 'AI Systems',
  },
  // add more as you promote repos to "featured" quality
};
```

## Step 4 — The generator script

```js
// scripts/generate-projects.mjs
import { writeFileSync } from 'node:fs';

const USERNAME = 'HardikBhaskar2010';
const TOKEN = process.env.PORTFOLIO_GITHUB_TOKEN;
const PALETTE = ['#00E5FF', '#7C3AED', '#A855F7', '#F59E0B', '#EC4899', '#10B981'];

const colorFor = (name) => {
  const hash = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  return PALETTE[hash % PALETTE.length];
};

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function gh(path) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub API ${path} failed: ${res.status}`);
  return res.json();
}

const { items: repos } = await gh(
  `/search/repositories?q=user:${USERNAME}+topic:portfolio-project&sort=updated`
);

const { overrides } = await import('../src/data/projects.overrides.ts');

const projects = repos.map((repo) => {
  const slug = slugify(repo.name);
  const base = {
    id: slug,
    slug,
    title: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    subtitle: repo.description ?? '',
    category: repo.language ?? 'Project',
    tag: repo.topics?.find((t) => t !== 'portfolio-project' && t !== 'featured') ?? repo.language ?? '',
    year: String(new Date(repo.created_at).getFullYear()),
    image: '/images/project-placeholder.png',
    heroImage: '/images/project-placeholder.png',
    description: repo.description ?? '',
    longDescription: repo.description ?? '',
    featured: repo.topics?.includes('featured') ?? false,
    tools: repo.topics?.filter((t) => !['portfolio-project', 'featured'].includes(t)) ?? [],
    link: repo.homepage || repo.html_url,
    color: colorFor(repo.name),
  };
  return { ...base, ...(overrides[slug] ?? {}) };
});

writeFileSync(
  new URL('../src/data/projects.generated.json', import.meta.url),
  JSON.stringify(projects, null, 2)
);

console.log(`✓ Generated ${projects.length} projects`);
```

## Step 5 — Update `src/data/projects.ts`

Replace the hardcoded array with:

```ts
import generated from './projects.generated.json';

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  tag: string;
  year: string;
  image: string;
  heroImage: string;
  description: string;
  longDescription: string;
  featured: boolean;
  tools: string[];
  link?: string;
  color: string;
}

export const projects: Project[] = generated as Project[];
export const featuredProjects = projects.filter(p => p.featured);
```

Every downstream component keeps working untouched — same export names, same shape.

## Step 6 — Wire into the build

`package.json`:

```json
"scripts": {
  "prebuild": "node scripts/generate-projects.mjs",
  "build": "tsc -b && vite build",
  "projects:sync": "node scripts/generate-projects.mjs"
}
```

`prebuild` runs automatically before every `npm run build` — including Vercel's build step. Zero Vercel config changes. Use `npm run projects:sync` to preview locally during `dev`.

## Step 7 — Automate the rebuild trigger (your original GitHub Action idea)

Instead of putting a workflow in *every* project repo, put **one** scheduled workflow in the **Portfolio repo** that checks for new tagged repos and commits if anything changed. Simpler to maintain than N copies of the same Action.

```yaml
# .github/workflows/sync-projects.yml
name: Sync Projects
on:
  schedule:
    - cron: '0 6 * * *'   # daily, 6am UTC
  workflow_dispatch: {}    # lets you trigger it manually right after tagging a repo

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run projects:sync
        env:
          PORTFOLIO_GITHUB_TOKEN: ${{ secrets.PORTFOLIO_GITHUB_TOKEN }}
      - name: Commit if changed
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git diff --quiet src/data/projects.generated.json || \
            (git add src/data/projects.generated.json && \
             git commit -m "chore: sync projects from GitHub" && \
             git push)
```

The push to `main` triggers Vercel's existing auto-deploy — no Deploy Hook needed.

**Want it instant instead of daily?** Skip the cron, and add a one-line workflow to each source repo that fires `repository_dispatch` on push, with a matching `on: repository_dispatch` trigger here. More setup (a token in every source repo), more real-time. Start with the cron version — flip to this only if a day's lag actually bothers you.

---

## Files to add/change

| File | Action |
|---|---|
| `scripts/generate-projects.mjs` | new |
| `src/data/projects.overrides.ts` | new — seed with your current 6 projects' rich fields |
| `src/data/projects.generated.json` | new — gitignored or committed, your call (committing makes diffs visible in PRs) |
| `src/data/projects.ts` | replace hardcoded array with generated + typed re-export |
| `public/images/project-placeholder.png` | new — fallback hero image for un-curated repos |
| `.github/workflows/sync-projects.yml` | new |
| `.env.example` | add `PORTFOLIO_GITHUB_TOKEN=` line |
| Vercel env vars | add `PORTFOLIO_GITHUB_TOKEN` |

## Testing checklist

1. `npm run projects:sync` locally with a real token → check `projects.generated.json` looks right
2. `npm run dev` → confirm Home / Projects / ProjectDetail render correctly for both overridden and default-only projects
3. Tag one throwaway repo, re-run sync, confirm it appears with sane fallback fields
4. Push to a branch, confirm Vercel preview build succeeds (prebuild step runs)
5. Manually trigger the Action (`workflow_dispatch`) once to confirm it commits + Vercel redeploys
