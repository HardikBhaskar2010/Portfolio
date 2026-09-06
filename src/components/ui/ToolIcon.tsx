/**
 * ToolIcon — maps tool names to real iconsax-react icons.
 * Uses the "Bulk" variant (two-tone filled) for a premium dark-mode look.
 * Color coding: Cyan → Design/Dev | Violet → AI | Muted → Collaboration
 */
import type { ReactNode } from 'react';
import {
  Figma,
  Code,
  Code1,
  Data,
  Global,
  Layer,
  Link21,
  Monitor,
  Shapes,
  Speedometer,
  Setting2,
  Star1,
  Flash,
  Component,
  Element3,
  Graph,
  Kanban,
  MagicStar,
  ClipboardText,
  Command,
  CpuCharge,
  Hierarchy,
  Chart,
} from 'iconsax-react';
import { GitBranch, Triangle, Wind, Braces, Bot } from 'lucide-react';

const SZ   = 18;
const BULK  = 'Bulk' as const;
const CYAN  = '#00E5FF';
const VLT   = '#7C3AED';
const MUTED = '#94A3B8';
const ORG   = '#F97316';
const EMER  = '#10B981';

export function getToolIcon(name: string, customSize?: number): ReactNode {
  const iconSize = customSize || SZ;

  switch (name) {
    // ── Languages & Systems ────────────────────────────────────
    case 'Rust':
      return <CpuCharge   size={iconSize} variant={BULK} color={ORG} />;
    case 'C / C++':
      return <Braces      size={iconSize} color={CYAN} strokeWidth={2} />;
    case 'Assembly (x86_64)':
      return <Setting2    size={iconSize} variant={BULK} color={EMER} />;
    case 'Python':
      return <Code        size={iconSize} variant={BULK} color={VLT} />;
    case 'TypeScript':
      return <Code1       size={iconSize} variant={BULK} color={CYAN} />;
    case 'SQL & BigQuery':
      return <Chart       size={iconSize} variant={BULK} color={CYAN} />;

    // ── Design ────────────────────────────────────────────────
    case 'Figma':
      return <Figma       size={iconSize} variant={BULK} color={CYAN} />;
    case 'Framer':
      return <Flash       size={iconSize} variant={BULK} color={CYAN} />;
    case 'Three.js':
      return <Shapes      size={iconSize} variant={BULK} color={CYAN} />;
    case 'Framer Motion':
      return <Speedometer size={iconSize} variant={BULK} color={CYAN} />;

    // ── Development ───────────────────────────────────────────
    case 'React':
      return <Component   size={iconSize} variant={BULK} color={CYAN} />;
    case 'Tauri v2':
      return <Command     size={iconSize} variant={BULK} color={ORG} />;
    case 'Next.js':
      return <Triangle    size={iconSize} color={CYAN}   strokeWidth={1.5} />;
    case 'Tailwind CSS':
      return <Wind        size={iconSize} color={CYAN}   strokeWidth={1.5} />;

    // ── AI & Systems ──────────────────────────────────────────
    case 'Google ADK 2.0':
      return <Bot         size={iconSize} color={VLT} strokeWidth={1.75} />;
    case 'LangChain':
      return <Hierarchy   size={iconSize} variant={BULK} color={VLT} />;
    case 'OpenAI API':
      return <MagicStar   size={iconSize} variant={BULK} color={VLT} />;
    case 'FastAPI':
      return <Flash       size={iconSize} variant={BULK} color={EMER} />;
    case 'Supabase':
      return <Data        size={iconSize} variant={BULK} color={VLT} />;

    // ── Collaboration ─────────────────────────────────────────
    case 'Notion':
      return <ClipboardText size={iconSize} variant={BULK} color={MUTED} />;
    case 'Linear':
      return <Kanban      size={iconSize} variant={BULK} color={MUTED} />;
    case 'GitHub':
      return <GitBranch   size={iconSize} color={MUTED}  strokeWidth={1.5} />;
    case 'Vercel':
      return <Triangle    size={iconSize} color={MUTED}  strokeWidth={1.5} />;

    default:
      return <Star1       size={iconSize} variant={BULK} color={MUTED} />;
  }
}
