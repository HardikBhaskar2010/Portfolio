import { useRef, useEffect, useState, type RefObject } from 'react';
import { motion } from 'framer-motion';

interface NeuralNode {
  id: string;
  ref: RefObject<HTMLElement | null>;
}

interface NeuralPathsProps {
  nodes: NeuralNode[];
  connections: [string, string][];
  color?: string; // e.g. 'rgba(0,229,255,'
}

interface Line {
  x1: number; y1: number;
  x2: number; y2: number;
}

function getCenter(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

/* Only render on desktop + no reduced motion */
function useDesktopAndMotion() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const mq1 = window.matchMedia('(min-width: 1024px)');
    const mq2 = window.matchMedia('(prefers-reduced-motion: no-preference)');
    setOk(mq1.matches && mq2.matches);
  }, []);
  return ok;
}

export function NeuralPaths({ nodes, connections, color = '0,229,255,' }: NeuralPathsProps) {
  const [lines, setLines] = useState<Line[]>([]);
  const show = useDesktopAndMotion();

  useEffect(() => {
    if (!show) return;
    const update = () => {
      const map = Object.fromEntries(
        nodes.map(n => [n.id, n.ref.current])
      );
      const computed = connections
        .map(([a, b]) => {
          const elA = map[a], elB = map[b];
          if (!elA || !elB) return null;
          const ca = getCenter(elA), cb = getCenter(elB);
          return { x1: ca.x, y1: ca.y, x2: cb.x, y2: cb.y };
        })
        .filter(Boolean) as Line[];
      setLines(computed);
    };

    update();
    // Recalculate on scroll/resize
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update);
    };
  }, [show, nodes, connections]);

  if (!show || lines.length === 0) return null;

  return (
    <svg
      className="fixed inset-0 pointer-events-none w-full h-full"
      style={{ zIndex: -5 }}
    >
      <defs>
        <filter id="neural-glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {lines.map((l, i) => (
        <g key={i} filter="url(#neural-glow)">
          {/* Static dim base line */}
          <line
            x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke={`rgba(${color}0.04)`}
            strokeWidth="1"
          />

          {/* Animated dash traveling along path */}
          <motion.line
            x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke={`rgba(${color}0.28)`}
            strokeWidth="1"
            strokeDasharray="6 90"
            animate={{ strokeDashoffset: [0, -96] }}
            transition={{
              duration:  2.8,
              ease:      'linear',
              repeat:    Infinity,
              delay:     i * 0.45,
            }}
          />

          {/* Node dot A */}
          <motion.circle
            cx={l.x1} cy={l.y1} r={2.5}
            fill={`rgba(${color}0.7)`}
            animate={{ opacity: [0.4, 1, 0.4], r: [2.5, 3.5, 2.5] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.3 }}
          />

          {/* Node dot B */}
          <motion.circle
            cx={l.x2} cy={l.y2} r={2.5}
            fill={`rgba(${color}0.7)`}
            animate={{ opacity: [0.4, 1, 0.4], r: [2.5, 3.5, 2.5] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.3 + 1.1 }}
          />
        </g>
      ))}
    </svg>
  );
}
