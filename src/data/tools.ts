export interface Tool {
  name: string;
  desc: string;
  icon: string;
  category: string;
}

export const tools: Record<string, Tool[]> = {
  Design: [
    { name: 'Figma',          desc: 'Design systems & scalable UI',    icon: '🎨', category: 'Design' },
    { name: 'Framer',         desc: 'Prototypes & live experiences',    icon: '⚡', category: 'Design' },
    { name: 'Three.js',       desc: 'Real-time 3D & WebGL',             icon: '🌐', category: 'Design' },
    { name: 'Framer Motion',  desc: 'Production-grade animations',      icon: '🎭', category: 'Design' },
  ],
  Development: [
    { name: 'React',          desc: 'Component-driven UIs',             icon: '⚛️', category: 'Development' },
    { name: 'TypeScript',     desc: 'Type-safe scalable code',          icon: '🔷', category: 'Development' },
    { name: 'Next.js',        desc: 'Full-stack React framework',       icon: '▲',  category: 'Development' },
    { name: 'Tailwind CSS',   desc: 'Utility-first styling',            icon: '💨', category: 'Development' },
  ],
  'AI & Systems': [
    { name: 'Python',         desc: 'AI / ML / backend scripting',      icon: '🐍', category: 'AI & Systems' },
    { name: 'LangChain',      desc: 'LLM orchestration & agents',       icon: '🔗', category: 'AI & Systems' },
    { name: 'OpenAI API',     desc: 'GPT-4o & embeddings',              icon: '🤖', category: 'AI & Systems' },
    { name: 'Supabase',       desc: 'Database & realtime backend',      icon: '⚡', category: 'AI & Systems' },
  ],
  Collaboration: [
    { name: 'Notion',         desc: 'Docs & project planning',          icon: '📋', category: 'Collaboration' },
    { name: 'Linear',         desc: 'Product & sprint management',      icon: '📐', category: 'Collaboration' },
    { name: 'GitHub',         desc: 'Version control & CI/CD',          icon: '🐙', category: 'Collaboration' },
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
    role: 'Founder & Lead Developer',
    company: 'STEM Idea Adventure',
    period: '2024 — Present',
    description: 'Founded and built an interactive STEM education platform from scratch. Led product strategy, design, and full-stack development.',
  },
  {
    role: 'AI Systems Developer',
    company: 'Veronica AI Project',
    period: '2025 — Present',
    description: 'Architecting a next-generation conversational AI system with memory persistence, emotional adaptation, and multi-agent orchestration.',
  },
  {
    role: 'Freelance Frontend Developer',
    company: 'Independent',
    period: '2023 — Present',
    description: 'Delivering premium React applications, animation-rich interfaces, and performance-optimized frontends for startups and agencies globally.',
  },
  {
    role: 'Interactive UI/UX Developer',
    company: 'Independent Projects Lab',
    period: '2022 — Present',
    description: 'Experimenting with Three.js, WebGL, Framer Motion, and advanced CSS to push the boundaries of web interaction and visual design.',
  },
];
