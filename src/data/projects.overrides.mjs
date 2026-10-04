// src/data/projects.overrides.mjs
//
// Curation layer: keyed by repo slug (lowercase, hyphens).
//
// What goes HERE vs in the repo itself:
//   ✅ Here:       title display name, category, tag, color, tools list, year
//   ✅ In repo:    assets/pic.png  →  image & heroImage
//                  assets/description.md  →  longDescription
//   ✅ On GitHub:  repo description  →  short card description
//                  repo homepage URL  →  "Live site" link
//                  topic "featured"   →  featured: true
//
// Only include fields you want to manually override: everything else is
// auto-derived from GitHub API data or the repo's asset files.

export const overrides = {

  // ── Veronica AI ────────────────────────────────────────────────────────
  'veronica-ai': {
    title:    'Veronica AI',
    subtitle: 'Conversational AI System',
    category: 'AI Systems',
    tag:      'AI Engineering',
    year:     '2025',
    tools:    ['Python', 'LangChain', 'OpenAI', 'React', 'TypeScript', 'FastAPI'],
    color:    '#9DB7D5',
    image:    '/images/project-ai-veronica.webp',
    heroImage: '/images/project-ai-veronica.webp',
    fallbackImage: '/images/project-ai-veronica.webp',
  },

  // ── STEM Idea Generator ────────────────────────────────────────────────
  'stem-idea-generator': {
    title:    'STEM Idea Adventure',
    subtitle: 'Interactive Learning Platform',
    category: 'EdTech',
    tag:      'Full Stack',
    year:     '2024',
    tools:    ['React', 'TypeScript', 'Node.js', 'FastAPI', 'Google ADK'],
    link:     'https://stemidea.vercel.app',
    color:    '#60758E',
    image:    '/images/project-stem-adventure.webp',
    heroImage: '/images/project-stem-adventure.webp',
    fallbackImage: '/images/project-stem-adventure.webp',
  },

  // ── MahinaOS ────────────────────────────────────────────────────────────
  'mahinaos': {
    title:    'Mahina OS',
    subtitle: 'Experimental OS Interface',
    category: 'Systems Design',
    tag:      'UI / Systems',
    year:     '2025',
    tools:    ['TypeScript', 'React', 'WebGL', 'Framer Motion', 'CSS Houdini'],
    color:    '#17345C',
    image:    '/images/project-mahina-os.webp',
    heroImage: '/images/project-mahina-os.webp',
    fallbackImage: '/images/project-mahina-os.webp',
  },

  // ── AEGIS Decision Intelligence ─────────────────────────────────────────
  'aegis-decision-intelligence-platform': {
    title:    'AEGIS',
    subtitle: 'AI Decision Intelligence Platform',
    category: 'AI Systems',
    tag:      'Data Intelligence',
    year:     '2025',
    tools:    ['Python', 'BigQuery', 'Vertex AI', 'Google ADK', 'FastAPI'],
    link:     'https://decisionforge-one.vercel.app',
    color:    '#9DB7D5',
    image:    '/images/project-aegis.webp',
    heroImage: '/images/project-aegis.webp',
    fallbackImage: '/images/project-aegis.webp',
  },

  // ── Vectoris ────────────────────────────────────────────────────────────
  'vectoris': {
    title:    'Vectoris',
    subtitle: 'AI-Native Engineering & Takeoff Workstation',
    category: 'Engineering & AI',
    tag:      'Desktop / Systems',
    year:     '2026',
    featured: true,
    tools:    ['Tauri v2', 'Rust', 'React 19', 'TypeScript', 'TailwindCSS', 'Local AI'],
    link:     'https://github.com/VectorisAI/Vectoris',
    repoUrl:  'https://github.com/VectorisAI/Vectoris',
    color:    '#17345C',
    image:    '/images/project-vectoris.webp',
    heroImage: '/images/project-vectoris.webp',
    fallbackImage: '/images/project-vectoris.webp',
  },

  // ── KAGE ────────────────────────────────────────────────────────────────
  'kage': {
    title:         'KAGE (影)',
    subtitle:      'Developer-First Autonomous Browser & Workstation',
    category:      'Systems & Browser',
    tag:           'Browser / Rust',
    year:          '2026',
    featured:      true,
    tools:         ['Tauri v2', 'Rust', 'Chromium (CEF)', 'React 18', 'TypeScript', 'CDP', 'SQLite'],
    link:          'https://github.com/HardikBhaskar2010/Kage',
    repoUrl:       'https://github.com/HardikBhaskar2010/Kage',
    color:         '#60758E',
    image:         '/images/project-kage.webp',
    heroImage:     '/images/project-kage.webp',
    fallbackImage: '/images/project-kage.webp',
  },

};
