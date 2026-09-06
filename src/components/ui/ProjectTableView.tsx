import { Link } from 'react-router-dom';
import { ArrowUpRight, ExternalLink, Terminal, Cpu, Bot, Shield, Layers, Sparkles } from 'lucide-react';
import type { Project } from '@/data/projects';
import { playHoverTick, playClick } from '@/lib/audio';

const PROJECT_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'vectoris': Terminal,
  'veronica-ai': Bot,
  'stem-idea-generator': Layers,
  'aegis-decision-intelligence-platform': Shield,
  'mahinaos': Cpu,
};

interface ProjectTableViewProps {
  projects: Project[];
}

export function ProjectTableView({ projects }: ProjectTableViewProps) {
  return (
    <div className="w-full overflow-x-auto rounded-[24px] border border-white/10 bg-[#09090E]/90 backdrop-blur-md">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-white/10 text-[11px] font-mono uppercase tracking-widest text-muted/60">
            <th className="py-4 pl-6 pr-3 font-medium">Index / System</th>
            <th className="py-4 px-4 font-medium">Category</th>
            <th className="py-4 px-4 font-medium">Core Architecture</th>
            <th className="py-4 px-4 font-medium">Year</th>
            <th className="py-4 px-4 font-medium">Source / Demo</th>
            <th className="py-4 pl-4 pr-6 font-medium text-right">Case Study</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 font-ui text-sm">
          {projects.map((project, index) => {
            const num = String(index + 1).padStart(2, '0');
            const Icon = PROJECT_ICONS[project.slug] || Sparkles;
            const githubUrl = project.repoUrl || (project.link?.includes('github.com') ? project.link : undefined);
            const liveUrl = project.link && !project.link.includes('github.com') ? project.link : undefined;

            return (
              <tr
                key={project.id}
                onMouseEnter={() => playHoverTick()}
                className="group transition-colors duration-200 hover:bg-white/[0.03]"
              >
                {/* Index & Name */}
                <td className="py-5 pl-6 pr-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-muted/50 font-semibold group-hover:text-cyan transition-colors">
                      #{num}
                    </span>
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-xs flex-shrink-0"
                      style={{
                        backgroundColor: `${project.color}20`,
                        color: project.color,
                      }}
                    >
                      <Icon size={14} />
                    </div>
                    <div>
                      <Link
                        to={`/projects/${project.slug}`}
                        onClick={() => playClick()}
                        className="font-display italic text-base lg:text-lg font-semibold text-heading hover:text-cyan transition-colors"
                      >
                        {project.title}
                      </Link>
                      <p className="font-ui text-xs text-muted/80 line-clamp-1">
                        {project.subtitle}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="py-5 px-4 whitespace-nowrap">
                  <span className="inline-block font-ui text-[11px] uppercase tracking-wider text-cyan bg-cyan/10 border border-cyan/20 px-2.5 py-0.5 rounded-full font-medium">
                    {project.category}
                  </span>
                </td>

                {/* Tech Stack */}
                <td className="py-5 px-4">
                  <div className="flex flex-wrap gap-1 max-w-[280px]">
                    {project.tools.slice(0, 4).map((tool) => (
                      <span
                        key={tool}
                        className="font-mono text-[10px] text-muted/80 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/5"
                      >
                        {tool}
                      </span>
                    ))}
                    {project.tools.length > 4 && (
                      <span className="font-mono text-[10px] text-muted/40 px-1 py-0.5">
                        +{project.tools.length - 4}
                      </span>
                    )}
                  </div>
                </td>

                {/* Year */}
                <td className="py-5 px-4 font-mono text-xs text-muted/70 whitespace-nowrap">
                  {project.year}
                </td>

                {/* External Links */}
                <td className="py-5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {liveUrl && (
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => playClick()}
                        className="p-1.5 rounded-md text-muted hover:text-cyan hover:bg-white/[0.05] border border-white/5 transition-colors"
                        title="Live Site"
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                    {githubUrl && (
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => playClick()}
                        className="p-1.5 rounded-md text-muted hover:text-cyan hover:bg-white/[0.05] border border-white/5 transition-colors"
                        title="GitHub Repository"
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </td>

                {/* Action */}
                <td className="py-5 pl-4 pr-6 text-right whitespace-nowrap">
                  <Link
                    to={`/projects/${project.slug}`}
                    onClick={() => playClick()}
                    className="inline-flex items-center gap-1 font-ui text-xs font-medium text-cyan hover:text-white transition-colors group-hover:underline"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
