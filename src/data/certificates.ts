export interface Certificate {
  id: string;
  title: string;
  subtitle: string;
  issuer: string;
  issuerCode: string;
  date: string;
  credentialId?: string;
  category: 'all' | 'ai-cloud' | 'llm-agents' | 'leadership';
  categoryLabel: string;
  description: string;
  skills: string[];
  fileUrl: string;
  fileType: 'pdf' | 'png';
  accentColor: string;
  glowColor: string;
  relatedProjectSlug?: string;
}

export interface PortfolioDossier {
  title: string;
  subtitle: string;
  version: string;
  pages: number;
  format: string;
  fileUrl: string;
  description: string;
  highlights: string[];
}

export const portfolioDossier: PortfolioDossier = {
  title: 'Hardik Bhaskar — Executive Portfolio & Technical Dossier',
  subtitle: 'Full 2-Page Architecture Brief & Flagship Build Logs',
  version: '2026.1',
  pages: 2,
  format: 'PDF',
  fileUrl: '/docs/Hardik_Bhaskar_Portfolio.pdf',
  description:
    'Curated offline dossier covering bare-metal OS kernels (MahinaOS), native Rust systems (Vectoris), autonomous multi-agent decision intelligence (AEGIS), and sovereign local-first AI (Veronica).',
  highlights: [
    'AEGIS: 5-agent decision intelligence on Google ADK 2.0 + BigQuery',
    'MahinaOS: Bare-metal x86_64 kernel, PID-1 init & C17 display protocol',
    'Veronica: Sovereign local-first AI with Whisper STT & BLIP vision',
    'Vectoris: Rust + Tauri v2 project intelligence workspace',
  ],
};

export const certificates: Certificate[] = [
  {
    id: 'google-cloud-genai-2026',
    title: 'Google Cloud Gen AI Academy APAC 2026',
    subtitle: 'Cohort 2 Hackathon — Generative AI & Cloud Architecture',
    issuer: 'Google Cloud & Hack2skill',
    issuerCode: 'GOOGLE CLOUD',
    date: '31/08/2026',
    credentialId: '2026H2S08GCGENAIAPACC2H-P01357',
    category: 'ai-cloud',
    categoryLabel: 'Autonomous AI & Cloud',
    description:
      'Official recognition from Google Cloud for designing and deploying advanced generative AI architectures, multi-agent frameworks, and cloud-native solutions to solve complex real-world data challenges.',
    skills: ['Google Cloud', 'ADK 2.0', 'Gemini API', 'BigQuery', 'Multi-Agent Graphs', 'Decision Intelligence'],
    fileUrl: '/docs/certificates/Google_GenAI_Academy_APAC_2026.pdf',
    fileType: 'pdf',
    accentColor: '#00E5FF',
    glowColor: 'rgba(0, 229, 255, 0.15)',
    relatedProjectSlug: 'aegis',
  },
  {
    id: 'anthropic-claude-101',
    title: 'Claude 101 — Large Language Model Mastery',
    subtitle: 'Certificate of Completion',
    issuer: 'Anthropic',
    issuerCode: 'ANTHROPIC',
    date: '2026',
    category: 'llm-agents',
    categoryLabel: 'LLM Systems & Agents',
    description:
      'Official certification validating end-to-end competency in Anthropic Claude model architectures, systematic prompt engineering, tool use/function calling, and autonomous agent loops.',
    skills: ['Claude 3.5 Sonnet', 'Anthropic API', 'System Prompts', 'Tool Calling', 'Agent Workflows'],
    fileUrl: '/docs/certificates/Anthropic_Claude_101.pdf',
    fileType: 'pdf',
    accentColor: '#D97706',
    glowColor: 'rgba(217, 119, 6, 0.15)',
    relatedProjectSlug: 'veronica-ai',
  },
  {
    id: 'be10x-ai-tools-2026',
    title: 'AI Tools & ChatGPT Engineering Workshop',
    subtitle: 'Certificate of Completion (Verified)',
    issuer: 'be10x',
    issuerCode: 'BE10X',
    date: '04/01/2026',
    category: 'ai-cloud',
    categoryLabel: 'AI Tooling & Acceleration',
    description:
      'Certified for mastery in rapid AI-accelerated development, structured analytical workflows, code debugging under 10 minutes, and generative prototyping pipelines.',
    skills: ['AI Debugging', 'Prompt Chaining', 'Data Analytics', 'Rapid Prototyping'],
    fileUrl: '/docs/certificates/be10x_AI_Tools_Workshop.pdf',
    fileType: 'pdf',
    accentColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.15)',
  },
  {
    id: 'mybharat-vbyld-2026',
    title: 'Viksit Bharat Young Leaders Dialogue (VBYLD) 2026',
    subtitle: 'Certificate of Participation',
    issuer: 'Ministry of Youth Affairs & Sports, Govt. of India',
    issuerCode: 'MYBHARAT',
    date: '27/10/2025',
    category: 'leadership',
    categoryLabel: 'Leadership & National Innovation',
    description:
      'Recognized by the Ministry of Youth Affairs & Sports for participating in the national youth innovation dialogue on technological self-reliance and emerging technology leadership.',
    skills: ['Technology Leadership', 'National Dialogue', 'Innovation Policy', 'Youth Empowerment'],
    fileUrl: '/docs/certificates/MYBharat_VBYLD_2026.png',
    fileType: 'png',
    accentColor: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.15)',
  },
];
