export interface Tool {
  name: string;
  desc: string;
  icon: string;
  category: string;
}

export const tools: Record<string, Tool[]> = {
  'Languages & Systems': [
    { name: 'Rust',               desc: 'Systems, memory safety & Tauri v2 desktop', icon: '🦀', category: 'Languages & Systems' },
    { name: 'C / C++',            desc: 'OS kernel, bare-metal boot & high perf',    icon: '⚙️', category: 'Languages & Systems' },
    { name: 'Python',             desc: 'AI orchestration, Google ADK & neural ops', icon: '🐍', category: 'Languages & Systems' },
    { name: 'TypeScript',         desc: 'Type-safe enterprise web & desktop apps',    icon: '🔷', category: 'Languages & Systems' },
    { name: 'Assembly (x86_64)',  desc: 'Bare-metal early boot & CPU registers',     icon: '⚡', category: 'Languages & Systems' },
    { name: 'SQL & BigQuery',     desc: 'Telemetry analytics & vector datasets',      icon: '📊', category: 'Languages & Systems' },
  ],
  Development: [
    { name: 'React',          desc: 'Component-driven UIs & React 19',  icon: '⚛️', category: 'Development' },
    { name: 'Tauri v2',       desc: 'Rust-powered lightweight desktop', icon: '🦀', category: 'Development' },
    { name: 'Next.js',        desc: 'Full-stack React framework',       icon: '▲',  category: 'Development' },
    { name: 'Tailwind CSS',   desc: 'Utility-first styling',            icon: '💨', category: 'Development' },
  ],
  Design: [
    { name: 'Three.js',       desc: 'Real-time 3D & WebGL rendering',   icon: '🌐', category: 'Design' },
    { name: 'Framer Motion',  desc: 'Production-grade animations',      icon: '🎭', category: 'Design' },
    { name: 'Figma',          desc: 'Design systems & scalable UI',    icon: '🎨', category: 'Design' },
    { name: 'Framer',         desc: 'Prototypes & live experiences',    icon: '⚡', category: 'Design' },
  ],
  'AI & Systems': [
    { name: 'Google ADK 2.0', desc: 'Autonomous multi-agent systems',   icon: '🤖', category: 'AI & Systems' },
    { name: 'LangChain',      desc: 'LLM orchestration & agents',       icon: '🔗', category: 'AI & Systems' },
    { name: 'FastAPI',        desc: 'High-throughput async backend APIs',icon: '⚡', category: 'AI & Systems' },
    { name: 'Supabase',       desc: 'Database & realtime backend',      icon: '⚡', category: 'AI & Systems' },
  ],
  Collaboration: [
    { name: 'GitHub',         desc: 'Version control & CI/CD workflows', icon: '🐙', category: 'Collaboration' },
    { name: 'Linear',         desc: 'Product & sprint management',      icon: '📐', category: 'Collaboration' },
    { name: 'Notion',         desc: 'Docs & architectural specs',       icon: '📋', category: 'Collaboration' },
    { name: 'Vercel',         desc: 'Deployment & edge hosting',        icon: '▲',  category: 'Collaboration' },
  ],
};

export const services = [
  {
    category: 'FRONTEND',
    title: 'Cinematic Web Development',
    description: 'Premium React & Next.js websites with smooth animations, immersive interactions, and responsive performance-first architecture.',
    icon: '🎬',
  },
  {
    category: 'AI SYSTEMS',
    title: 'AI Product Engineering',
    description: 'Building AI-powered apps, intelligent workflows, chatbot systems, and experimental artificial intelligence experiences.',
    icon: '🤖',
  },
  {
    category: 'UI/UX',
    title: 'Interactive Experience Design',
    description: 'Designing futuristic interfaces with motion design, storytelling, premium layouts, and engaging user experiences.',
    icon: '✦',
  },
  {
    category: '3D WEB',
    title: 'Three.js & WebGL Experiences',
    description: 'Creating interactive 3D scenes, scroll-driven animations, and immersive web visuals using Three.js and React Three Fiber.',
    icon: '🌐',
  },
  {
    category: 'PERFORMANCE',
    title: 'Frontend Optimization',
    description: 'Optimizing websites for smooth 60FPS interactions, scalability, accessibility, and production-grade responsiveness.',
    icon: '⚡',
  },
  {
    category: 'BRANDING',
    title: 'Portfolio & Product Identity',
    description: 'Crafting modern digital identities, developer portfolios, visual systems, and startup-style product presentations.',
    icon: '◈',
  },
];

export const experience = [
  {
    role: 'Systems & Desktop Engineer',
    company: 'Vectoris',
    period: '2025 — Present',
    description: 'Engineered a high-performance native desktop AI takeoff platform with Tauri v2, Rust 2021, and React 19. Designed IPC bridges and local AI execution pipelines.',
  },
  {
    role: 'Operating Systems Architect',
    company: 'MahinaOS',
    period: '2024 — Present',
    description: 'Developed an x86_64 bare-metal micro-operating system from scratch using C++, C, and Assembly. Built luna-init PID 1, VGA framebuffer driver, and memory manager.',
  },
  {
    role: 'AI Systems Developer',
    company: 'Veronica AI & AEGIS Project',
    period: '2025 — Present',
    description: 'Architecting multi-agent decision intelligence and conversational AI systems with Google ADK 2.0, Python, BigQuery telemetry, and memory persistence.',
  },
  {
    role: 'Founder & Lead Developer',
    company: 'STEM Idea Adventure',
    period: '2024 — Present',
    description: 'Founded and built an interactive STEM education platform from scratch. Led product strategy, design, and full-stack development.',
  },
  {
    role: 'Interactive Web & 3D Developer',
    company: 'Independent Projects Lab',
    period: '2023 — Present',
    description: 'Delivering cinematic Three.js WebGL experiences, animation-rich interfaces, and performance-optimized frontends for modern web applications.',
  },
];
