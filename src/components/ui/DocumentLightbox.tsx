import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink, FileText } from 'lucide-react';
import { playClick } from '@/lib/audio';
import { getLenis } from '@/lib/lenis';
import { PdfViewer } from '@/components/ui/PdfViewer';

export interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    title: string;
    subtitle?: string;
    issuer?: string;
    date?: string;
    credentialId?: string;
    fileUrl: string;
    fileType?: 'pdf' | 'png';
    accentColor?: string;
  } | null;
}

export function DocumentLightbox({ isOpen, onClose, document }: DocumentModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // Halt smooth-scroll loop on the background page while modal is active
    const lenis = getLenis();
    lenis?.stop();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playClick();
        onClose();
      }
    };

    const originalOverflow = window.getComputedStyle(window.document.body).overflow;
    window.document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      lenis?.start();
    };
  }, [isOpen, onClose]);

  if (!document || !mounted) return null;

  const accent = document.accentColor || '#00E5FF';
  const isPdf = document.fileType === 'pdf' || document.fileUrl.endsWith('.pdf');

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={document.title}
          data-lenis-prevent="true"
          className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 md:p-6"
        >
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={() => {
              playClick();
              onClose();
            }}
            className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0 }}
            data-lenis-prevent="true"
            className="relative w-full max-w-5xl h-[90vh] max-h-[90vh] flex flex-col bg-[#0A0A10] border border-white/10 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden z-10"
            style={{
              boxShadow: `0 0 0 1px rgba(255,255,255,0.08), 0 20px 60px -15px ${accent}25`,
            }}
          >

            {/* Top HUD Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${accent}15`, color: accent }}
                >
                  <FileText size={18} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-white text-base truncate">
                      {document.title}
                    </h3>
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      VERIFIED
                    </span>
                  </div>
                  <p className="font-ui text-xs text-muted truncate mt-0.5">
                    {document.issuer && <span className="text-white/80">{document.issuer}</span>}
                    {document.date && <span> • {document.date}</span>}
                    {document.credentialId && (
                      <span className="font-mono text-[11px] text-cyan/90 ml-1">
                        [ID: {document.credentialId}]
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={document.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-ui font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <ExternalLink size={13} />
                  <span>Open Tab</span>
                </a>

                <a
                  href={document.fileUrl}
                  download
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-ui font-semibold text-black transition-all hover:brightness-110 active:scale-95"
                  style={{ background: accent }}
                >
                  <Download size={13} />
                  <span>Download</span>
                </a>

                <button
                  onClick={() => {
                    playClick();
                    onClose();
                  }}
                  className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Document Viewer Body */}
            <div className="relative flex-1 min-h-0 w-full bg-[#050508] flex flex-col overflow-hidden">
              {isPdf ? (
                <PdfViewer
                  url={document.fileUrl}
                  title={document.title}
                  accentColor={accent}
                  className="w-full h-full flex-1 min-h-0"
                />
              ) : (
                <div className="flex-1 min-h-0 w-full overflow-auto flex items-center justify-center p-4">
                  <img
                    src={document.fileUrl}
                    alt={`${document.title} — Official Verification Credential for Hardik Bhaskar`}
                    title={`${document.title} — Hardik Bhaskar`}
                    className="max-h-full w-auto max-w-full object-contain rounded-lg shadow-2xl border border-white/10"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              )}
            </div>

            {/* Footer status bar */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-5 py-2.5 border-t border-white/10 bg-white/[0.01] text-[11px] font-mono text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                SECURE ARTIFACT // PROTOCOL V4
              </span>
              <span className="hidden sm:inline">Press ESC to dismiss</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, window.document.body);
}
