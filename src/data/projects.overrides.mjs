// src/data/projects.overrides.mjs
//
// Keyed by repo slug (lowercase, hyphens). Only include the fields you want
// to override — everything else falls back to GitHub-derived defaults.
//
// Slug = repo name lowercased, non-alphanumeric runs → hyphen.
// e.g.  "Veronica-AI"                        → "veronica-ai"
//       "STEM-IDEA-GENERATOR"                → "stem-idea-generator"
//       "MahinaOS"                           → "mahinaos"
//       "AEGIS-Decision-Intelligence-Platform" → "aegis-decision-intelligence-platform"

export const overrides = {

  // ── Veronica AI ──────────────────────────────────────────────────────────
  'veronica-ai': {
    title: 'Veronica AI',
    subtitle: 'Conversational AI System',
    category: 'AI Systems',
    tag: 'AI Engineering',
    year: '2025',
    image: '/images/project-ai-veronica.png',
    heroImage: '/images/project-ai-veronica.png',
    longDescription:
      'Veronica is a next-generation AI system built with custom agent orchestration, persistent memory graphs, and emotionally responsive dialogue models. It powers conversational experiences that feel genuinely intelligent.',
    featured: true,
    tools: ['Python', 'LangChain', 'OpenAI', 'React', 'TypeScript', 'FastAPI'],
    color: '#7C3AED',
  },

  // ── STEM Idea Generator ───────────────────────────────────────────────────
  'stem-idea-generator': {
    title: 'STEM Idea Adventure',
    subtitle: 'Interactive Learning Platform',
    category: 'EdTech',
    tag: 'Full Stack',
    year: '2024',
    image: '/images/project-stem-adventure.png',
    heroImage: '/images/project-stem-adventure.png',
    longDescription:
      'STEM Idea Adventure reimagines science education through interactive challenges, 3D simulations, and game-like progression systems. Built for K-12 students, it makes complex concepts feel like an adventure.',
    featured: true,
    tools: ['React', 'TypeScript', 'Node.js', 'FastAPI', 'Google ADK'],
    link: 'https://stemidea.vercel.app',
    color: '#00E5FF',
  },

  // ── MahinaOS ─────────────────────────────────────────────────────────────
  'mahinaos': {
    title: 'Mahina OS',
    subtitle: 'Experimental OS Interface',
    category: 'Systems Design',
    tag: 'UI / Systems',
    year: '2025',
    image: '/images/project-placeholder.png',
    heroImage: '/images/project-placeholder.png',
    longDescription:
      'MahinaOS is a radical rethink of the computing interface — stripped of corporate polish, rebuilt around intentionality. A fully interactive OS-shell aesthetic that challenges what a desktop environment can feel like.',
    featured: true,
    tools: ['TypeScript', 'React', 'WebGL', 'Framer Motion', 'CSS Houdini'],
    color: '#A855F7',
  },

  // ── AEGIS Decision Intelligence ──────────────────────────────────────────
  'aegis-decision-intelligence-platform': {
    title: 'AEGIS',
    subtitle: 'AI Decision Intelligence Platform',
    category: 'AI Systems',
    tag: 'Data Intelligence',
    year: '2025',
    image: '/images/project-placeholder.png',
    heroImage: '/images/project-placeholder.png',
    longDescription:
      'AEGIS orchestrates agentic data pipelines on BigQuery and Vertex AI, combining multi-model reasoning with enterprise data warehousing to produce structured, evidence-based strategic decisions at scale.',
    featured: true,
    tools: ['Python', 'BigQuery', 'Vertex AI', 'Google ADK', 'FastAPI'],
    link: 'https://decisionforge-one.vercel.app',
    color: '#F59E0B',
  },

};
