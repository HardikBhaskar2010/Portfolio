import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, Download, Eye } from 'lucide-react';
import { playHoverTick, playClick } from '@/lib/audio';

export interface CardFolderProps {
  number: string;
  title: string;
  subtitle: string;
  issuer: string;
  badgeText?: string;
  credentialId?: string;
  skills?: string[];
  gradient: string;
  folderBg?: string;
  folderTextColor?: string;
  accentColor: string;
  graphic: React.ReactNode;
  onInspect?: () => void;
  onDownload?: () => void;
}

export function CardFolder({
  number,
  title,
  subtitle,
  issuer,
  badgeText = 'VERIFIED',
  credentialId,
  skills,
  gradient,
  folderBg = '#0E0F1A',
  folderTextColor = '#FFFFFF',
  accentColor,
  graphic,
  onInspect,
  onDownload,
}: CardFolderProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => {
        setIsHovered(true);
        playHoverTick();
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onInspect}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full aspect-[3/4.4] sm:aspect-[3/4.2] rounded-[28px] overflow-hidden cursor-pointer select-none border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)] group"
      style={{
        boxShadow: isHovered
          ? `0 20px 50px -10px ${accentColor}35, 0 0 0 1px rgba(255,255,255,0.2)`
          : '0 10px 30px rgba(0,0,0,0.4)',
      }}
    >
      {/* ── 1. Iridescent Background Layer (Revealed on hover) ── */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out"
        style={{
          background: gradient,
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        }}
      >
        {/* Subtle noise/vignette overlay */}
        <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/60" />
      </div>

      {/* ── 2. Cut-Out 3D Graphic (Rises up on hover) ── */}
      <div className="absolute inset-x-0 top-0 h-[60%] flex items-center justify-center p-4 pointer-events-none z-10">
        <motion.div
          animate={{
            y: isHovered ? -12 : 36,
            scale: isHovered ? 1.08 : 0.88,
            opacity: isHovered ? 1 : 0.75,
          }}
          transition={{
            type: 'spring',
            stiffness: 320,
            damping: 24,
          }}
          className="relative flex items-center justify-center filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)]"
        >
          {graphic}
        </motion.div>
      </div>

      {/* ── 3. Manila Folder Face (Slides down on hover) ── */}
      <motion.div
        animate={{
          y: isHovered ? 115 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 26,
        }}
        className="absolute inset-x-0 top-[60px] bottom-0 z-20 flex flex-col"
      >
        {/* SVG Folder Tab Shape & Border Highlight */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <svg
            viewBox="0 0 320 520"
            preserveAspectRatio="none"
            className="w-full h-full filter drop-shadow-[0_-4px_16px_rgba(0,0,0,0.4)]"
          >
            {/* Folder body fill */}
            <path
              d="M 0 0 L 175 0 C 194 0 200 26 218 26 L 320 26 L 320 520 L 0 520 Z"
              fill={folderBg}
            />
            {/* 1px glowing top edge highlight */}
            <path
              d="M 0 0 L 175 0 C 194 0 200 26 218 26 L 320 26"
              fill="none"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* ── Folder Content ── */}
        <div className="relative z-10 flex flex-col justify-between h-full p-6 sm:p-7">
          {/* Top Row: Big Number on tab, Arrow on shoulder */}
          <div className="flex items-start justify-between">
            {/* Tab Number */}
            <div className="flex items-center gap-2">
              <span
                className="font-display font-black text-4xl sm:text-5xl leading-none tracking-tight"
                style={{ color: folderTextColor }}
              >
                {number}
              </span>
              {badgeText && (
                <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[9px] uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 size={10} />
                  {badgeText}
                </span>
              )}
            </div>

            {/* Right Shoulder Arrow */}
            <motion.div
              animate={{
                rotate: isHovered ? 45 : 0,
                x: isHovered ? 2 : 0,
                y: isHovered ? -2 : 0,
              }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 group-hover:text-white transition-colors"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <ArrowUpRight size={16} />
            </motion.div>
          </div>

          {/* Bottom Row: Issuer, Title, Subtitle, and Quick Actions */}
          <div className="flex flex-col gap-3 pt-4">
            <div className="flex items-center justify-between gap-2">
              <span
                className="font-mono text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border"
                style={{
                  color: accentColor,
                  borderColor: `${accentColor}40`,
                  background: `${accentColor}15`,
                }}
              >
                {issuer}
              </span>

              {credentialId && (
                <span className="font-mono text-[9px] text-white/40 truncate max-w-[120px]">
                  {credentialId}
                </span>
              )}
            </div>

            <div>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-white group-hover:text-cyan transition-colors leading-tight">
                {title}
              </h3>
              <p className="font-ui text-xs text-white/60 line-clamp-2 mt-1 leading-relaxed">
                {subtitle}
              </p>
            </div>

            {skills && skills.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {skills.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="font-ui text-[9px] text-white/50 bg-white/5 px-2 py-0.5 rounded border border-white/5"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            {/* Quick Action Footer inside Folder */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-ui text-white/70">
              <span className="inline-flex items-center gap-1 text-cyan text-[11px] font-medium group-hover:translate-x-0.5 transition-transform">
                <Eye size={12} />
                <span>Inspect PDF</span>
              </span>

              {onDownload && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playClick();
                    onDownload();
                  }}
                  className="inline-flex items-center gap-1 font-mono text-[10px] text-white/50 hover:text-white transition-colors p-1"
                  title="Download Asset"
                >
                  <Download size={11} />
                  <span>Download</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
