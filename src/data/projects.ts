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

export const projects: Project[] = [
  {
    id: 'veronica-ai',
    slug: 'veronica-ai',
    title: 'Veronica AI',
    subtitle: 'Conversational AI System',
    category: 'AI Systems',
    tag: 'AI Engineering',
    year: '2025',
    image: '/images/project-ai-veronica.png',
    heroImage: '/images/project-ai-veronica.png',
    description: 'An experimental conversational AI architecture with memory, context-switching, and emotionally adaptive responses.',
    longDescription: 'Veronica is a next-generation AI system built with custom agent orchestration, persistent memory graphs, and emotionally responsive dialogue models. It powers conversational experiences that feel genuinely intelligent.',
    featured: true,
    tools: ['Python', 'LangChain', 'OpenAI', 'React', 'TypeScript', 'FastAPI'],
    color: '#7C3AED',
  },
  {
    id: 'stem-adventure',
    slug: 'stem-adventure',
    title: 'STEM Idea Adventure',
    subtitle: 'Interactive Learning Platform',
    category: 'EdTech',
    tag: 'Full Stack',
    year: '2024',
    image: '/images/project-stem-adventure.png',
    heroImage: '/images/project-stem-adventure.png',
    description: 'A gamified STEM education platform with interactive experiments, progress tracking, and adaptive curriculum paths.',
    longDescription: 'STEM Idea Adventure reimagines science education through interactive challenges, 3D simulations, and game-like progression systems. Built for K-12 students, it makes complex concepts feel like an adventure.',
    featured: true,
    tools: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Three.js'],
    link: 'https://stemideaadventure.com',
    color: '#00E5FF',
  },
  {
    id: 'threejs-experience',
    slug: 'threejs-experience',
    title: 'Void Dimension',
    subtitle: 'Immersive 3D Web Experience',
    category: '3D Web',
    tag: 'WebGL / Three.js',
    year: '2025',
    image: '/images/project-threejs-experience.png',
    heroImage: '/images/project-threejs-experience.png',
    description: 'An immersive scroll-driven 3D experience with particle systems, dynamic lighting, and spatial audio interaction.',
    longDescription: 'Void Dimension is an experimental art piece built entirely in Three.js with custom GLSL shaders, particle physics, and spatial audio. Users navigate through abstract 3D environments driven by scroll.',
    featured: true,
    tools: ['Three.js', 'React Three Fiber', 'GLSL', 'Framer Motion', 'Web Audio API'],
    color: '#A855F7',
  },
  {
    id: 'saas-dashboard',
    slug: 'saas-dashboard',
    title: 'Pulse Analytics',
    subtitle: 'SaaS Analytics Dashboard',
    category: 'SaaS',
    tag: 'Frontend',
    year: '2024',
    image: '/images/project-saas-dashboard.png',
    heroImage: '/images/project-saas-dashboard.png',
    description: 'A real-time analytics dashboard with live data visualization, custom chart components, and team collaboration.',
    longDescription: "Pulse Analytics gives SaaS teams a bird's-eye view of their product metrics with beautiful charts, AI-powered insights, and real-time collaboration features. Performance-first architecture with sub-50ms updates.",
    featured: false,
    tools: ['React', 'D3.js', 'TypeScript', 'Supabase', 'Recharts'],
    color: '#F59E0B',
  },
  {
    id: 'mobile-app',
    slug: 'mobile-app',
    title: 'Aura Companion',
    subtitle: 'AI-Powered Mobile App',
    category: 'Mobile',
    tag: 'React Native',
    year: '2025',
    image: '/images/project-mobile-app.png',
    heroImage: '/images/project-mobile-app.png',
    description: 'A mindfulness and productivity companion app powered by AI mood detection and personalized habit building.',
    longDescription: 'Aura Companion uses AI mood analysis from user inputs to generate personalized mindfulness sessions, habit recommendations, and motivational nudges. Designed with calm, premium interactions.',
    featured: false,
    tools: ['React Native', 'Expo', 'OpenAI', 'Supabase', 'TypeScript'],
    color: '#EC4899',
  },
  {
    id: 'portfolio-design',
    slug: 'portfolio-design',
    title: 'Folio OS',
    subtitle: 'Designer Portfolio System',
    category: 'Web Design',
    tag: 'UI/UX',
    year: '2024',
    image: '/images/project-portfolio-design.png',
    heroImage: '/images/project-portfolio-design.png',
    description: 'A modular portfolio operating system for designers — generate, customize, and deploy beautiful portfolios in minutes.',
    longDescription: 'Folio OS is a portfolio-as-a-system product that lets designers configure their entire online presence through a visual editor. Built with real-time preview, component theming, and one-click Vercel deploy.',
    featured: false,
    tools: ['React', 'Next.js', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
    color: '#10B981',
  },
];

export const featuredProjects = projects.filter(p => p.featured);
