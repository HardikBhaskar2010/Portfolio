// src/data/projects.overrides.mjs
//
// Curation layer — keyed by repo slug (lowercase, hyphens).
//
// What goes HERE vs in the repo itself:
//   ✅ Here:       title display name, category, tag, color, tools list, year
//   ✅ In repo:    assets/pic.png  →  image & heroImage
//                  assets/description.md  →  longDescription
//   ✅ On GitHub:  repo description  →  short card description
//                  repo homepage URL  →  "Live site" link
//                  topic "featured"   →  featured: true
//
// Only include fields you want to manually override — everything else is
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
    color:    '#7C3AED',
    fallbackImage: '/images/project-ai-veronica.png',
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
    color:    '#00E5FF',
    fallbackImage: '/images/project-stem-adventure.png',
  },

  // ── MahinaOS ────────────────────────────────────────────────────────────
  'mahinaos': {
    title:    'Mahina OS',
    subtitle: 'Experimental OS Interface',
    category: 'Systems Design',
    tag:      'UI / Systems',
    year:     '2025',
    tools:    ['TypeScript', 'React', 'WebGL', 'Framer Motion', 'CSS Houdini'],
    color:    '#A855F7',
    fallbackImage: '/images/project-mahina-os.png',
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
    color:    '#F59E0B',
    fallbackImage: '/images/project-aegis.png',
  },

  // ── Vectoris ────────────────────────────────────────────────────────────
  'vectoris': {
    title:    'Vectoris',
    subtitle: 'AI-Native Engineering & Takeoff Workstation',
    category: 'Engineering & AI',
    tag:      'Desktop / Systems',
    year:     '2026',
    tools:    ['Tauri v2', 'Rust', 'React 19', 'TypeScript', 'TailwindCSS', 'Local AI'],
    link:     'https://github.com/VectorisAI/Vectoris',
    repoUrl:  'https://github.com/VectorisAI/Vectoris',
    color:    '#E11D48',
    image:    'https://raw.githubusercontent.com/VectorisAI/Vectoris/main/assets/pic.png',
    heroImage: 'https://raw.githubusercontent.com/VectorisAI/Vectoris/main/assets/pic.png',
    fallbackImage: '/images/project-vectoris.png',
  },

};
