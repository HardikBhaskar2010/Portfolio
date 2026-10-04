/**
 * ToolIcon: maps tool names to standardized Lucide icons with Frost Navy tokens.
 * Single unified icon set across the entire repository.
 */
import type { ReactNode } from 'react';
import {
  Cpu,
  Braces,
  Binary,
  FileCode,
  Code2,
  Database,
  PenTool,
  Layers,
  Boxes,
  Gauge,
  Atom,
  Terminal,
  Triangle,
  Wind,
  Bot,
  Network,
  Sparkles,
  Zap,
  FileText,
  Kanban,
  GitBranch,
  Star,
} from 'lucide-react';

const SZ = 18;
const ACCENT = '#9DB7D5';
const MUTED = '#7C94AF';

export function getToolIcon(name: string, customSize?: number): ReactNode {
  const iconSize = customSize || SZ;

  switch (name) {
    // ── Languages & Systems ────────────────────────────────────
    case 'Rust':
      return <Cpu size={iconSize} color={ACCENT} strokeWidth={1.75} />;
    case 'C / C++':
      return <Braces size={iconSize} color={ACCENT} strokeWidth={2} />;
    case 'Assembly (x86_64)':
      return <Binary size={iconSize} color={ACCENT} strokeWidth={1.75} />;
    case 'Python':
      return <FileCode size={iconSize} color={ACCENT} strokeWidth={1.75} />;
    case 'TypeScript':
      return <Code2 size={iconSize} color={ACCENT} strokeWidth={1.75} />;
    case 'SQL & BigQuery':
      return <Database size={iconSize} color={ACCENT} strokeWidth={1.75} />;

    // ── Design ────────────────────────────────────────────────
    case 'Figma':
      return <PenTool size={iconSize} color={ACCENT} strokeWidth={1.75} />;
    case 'Framer':
      return <Layers size={iconSize} color={ACCENT} strokeWidth={1.75} />;
    case 'Three.js':
      return <Boxes size={iconSize} color={ACCENT} strokeWidth={1.75} />;
    case 'Framer Motion':
      return <Gauge size={iconSize} color={ACCENT} strokeWidth={1.75} />;

    // ── Development ───────────────────────────────────────────
    case 'React':
      return <Atom size={iconSize} color={ACCENT} strokeWidth={1.75} />;
    case 'Tauri v2':
      return <Terminal size={iconSize} color={ACCENT} strokeWidth={1.75} />;
    case 'Next.js':
      return <Triangle size={iconSize} color={ACCENT} strokeWidth={1.75} />;
    case 'Tailwind CSS':
      return <Wind size={iconSize} color={ACCENT} strokeWidth={1.75} />;

    // ── AI & Systems ──────────────────────────────────────────
    case 'Google ADK 2.0':
      return <Bot size={iconSize} color={ACCENT} strokeWidth={1.75} />;
    case 'LangChain':
      return <Network size={iconSize} color={ACCENT} strokeWidth={1.75} />;
    case 'OpenAI API':
      return <Sparkles size={iconSize} color={ACCENT} strokeWidth={1.75} />;
    case 'FastAPI':
      return <Zap size={iconSize} color={ACCENT} strokeWidth={1.75} />;
    case 'Supabase':
      return <Database size={iconSize} color={ACCENT} strokeWidth={1.75} />;

    // ── Collaboration ─────────────────────────────────────────
    case 'Notion':
      return <FileText size={iconSize} color={MUTED} strokeWidth={1.5} />;
    case 'Linear':
      return <Kanban size={iconSize} color={MUTED} strokeWidth={1.5} />;
    case 'GitHub':
      return <GitBranch size={iconSize} color={MUTED} strokeWidth={1.5} />;
    case 'Vercel':
      return <Triangle size={iconSize} color={MUTED} strokeWidth={1.5} />;

    default:
      return <Star size={iconSize} color={MUTED} strokeWidth={1.5} />;
  }
}
