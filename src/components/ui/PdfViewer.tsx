import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2, AlertCircle, Download, ExternalLink } from 'lucide-react';
import { playClick } from '@/lib/audio';

// Configure PDF.js worker
let pdfjsPromise: Promise<any> | null = null;

async function getPdfJs() {
  if (pdfjsPromise) return pdfjsPromise;
  pdfjsPromise = (async () => {
    try {
      // Dynamic import from pdfjs-dist
      const pdfjs = await import('pdfjs-dist');
      if (pdfjs.GlobalWorkerOptions) {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
      }
      return pdfjs;
    } catch {
      // Fallback: load from CDN if bundler has issues with module worker
      return new Promise((resolve, reject) => {
        if ((window as any).pdfjsLib) {
          resolve((window as any).pdfjsLib);
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = () => {
          const lib = (window as any).pdfjsLib;
          if (lib) {
            lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            resolve(lib);
          } else {
            reject(new Error('pdfjsLib not found on window'));
          }
        };
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
  })();
  return pdfjsPromise;
}

export interface PdfViewerProps {
  url: string;
  title: string;
  className?: string;
  accentColor?: string;
}

export function PdfViewer({ url, title, className = '', accentColor = '#00E5FF' }: PdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any>(null);

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load PDF Document
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);
    setCurrentPage(1);

    getPdfJs()
      .then((pdfjs) => {
        const loadingTask = pdfjs.getDocument(url);
        return loadingTask.promise;
      })
      .then((doc: any) => {
        if (isCancelled) return;
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setLoading(false);
      })
      .catch((err: any) => {
        if (isCancelled) return;
        console.error('Failed to load PDF via PDF.js:', err);
        setError('Could not render PDF via canvas.');
        setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [url]);

  // Render Current Page onto Canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let isCancelled = false;

    // Cancel ongoing render task
    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch {}
    }

    pdfDoc
      .getPage(currentPage)
      .then((page: any) => {
        if (isCancelled || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        // Calculate viewport with pixel ratio for crisp retina display
        const pixelRatio = window.devicePixelRatio || 1;
        const viewport = page.getViewport({ scale });

        canvas.width = Math.floor(viewport.width * pixelRatio);
        canvas.height = Math.floor(viewport.height * pixelRatio);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        const task = page.render(renderContext);
        renderTaskRef.current = task;

        return task.promise;
      })
      .catch((err: any) => {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Render page error:', err);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [pdfDoc, currentPage, scale]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      playClick();
      setCurrentPage((p) => p - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      playClick();
      setCurrentPage((p) => p + 1);
    }
  };

  const handleZoomIn = () => {
    playClick();
    setScale((s) => Math.min(2.5, +(s + 0.2).toFixed(1)));
  };

  const handleZoomOut = () => {
    playClick();
    setScale((s) => Math.max(0.6, +(s - 0.2).toFixed(1)));
  };

  return (
    <div className={`relative flex flex-col w-full h-full bg-[#05050A] rounded-xl overflow-hidden ${className}`}>
      {/* ── Top Floating Navigation Toolbar ── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/10 text-xs text-white/80 select-none z-10">
        {/* Page navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1 || loading}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="font-mono text-xs px-2 py-0.5 rounded bg-black/40 border border-white/10">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages || loading}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Next Page"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleZoomOut}
            disabled={scale <= 0.6 || loading}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>

          <span className="font-mono text-xs w-12 text-center text-muted">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            disabled={scale >= 2.5 || loading}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={15} />
          </button>
        </div>
      </div>

      {/* ── Document Area (Scrollable canvas) ── */}
      <div className="relative flex-1 overflow-auto flex items-center justify-center p-4 sm:p-6 bg-[#030306]">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#030306]/90 z-20">
            <Loader2 size={32} className="animate-spin" style={{ color: accentColor }} />
            <p className="font-mono text-xs text-muted">Rendering PDF via PDF.js...</p>
          </div>
        )}

        {error ? (
          <div className="flex flex-col items-center justify-center text-center p-8 max-w-md gap-4">
            <AlertCircle size={40} className="text-amber-400" />
            <div>
              <p className="font-heading font-semibold text-white text-base mb-1">{title}</p>
              <p className="font-ui text-xs text-muted leading-relaxed">
                Your browser or network prevented canvas rendering. You can inspect or download the original vector PDF directly.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan text-black font-ui font-semibold text-xs hover:brightness-110 transition-all"
              >
                <ExternalLink size={13} />
                <span>Open in Tab</span>
              </a>
              <a
                href={url}
                download
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 text-white font-ui font-semibold text-xs hover:bg-white/20 transition-all"
              >
                <Download size={13} />
                <span>Download</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="shadow-[0_20px_60px_rgba(0,0,0,0.8)] rounded-lg overflow-hidden border border-white/10 bg-white">
            <canvas ref={canvasRef} className="block max-w-none" />
          </div>
        )}
      </div>
    </div>
  );
}
