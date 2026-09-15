import { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Loader2,
  AlertCircle,
  Download,
  ExternalLink,
  Maximize2,
} from 'lucide-react';
import { playClick } from '@/lib/audio';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';

// Configure PDF.js worker
let pdfjsPromise: Promise<typeof import('pdfjs-dist')> | null = null;

async function getPdfJs() {
  if (pdfjsPromise) return pdfjsPromise;
  pdfjsPromise = (async () => {
    const pdfjs = await import('pdfjs-dist');
    if (pdfjs.GlobalWorkerOptions) {
      try {
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString();
      } catch {
        pdfjs.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';
      }
    }
    return pdfjs;
  })();
  return pdfjsPromise;
}

export interface PdfViewerProps {
  url: string;
  title: string;
  className?: string;
  accentColor?: string;
}

export function PdfViewer({
  url,
  title,
  className = '',
  accentColor = '#00E5FF',
}: PdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [scale, setScale] = useState<number>(0.85);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  const [prevUrl, setPrevUrl] = useState(url);
  if (prevUrl !== url) {
    setPrevUrl(url);
    setLoading(true);
    setError(null);
    setCurrentPage(1);
  }

  // Global mouseup release listener to prevent sticky pan state
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsPanning(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // Reset scroll position on page change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      containerRef.current.scrollLeft = 0;
    }
  }, [currentPage]);

  // Load PDF Document
  useEffect(() => {
    let isCancelled = false;

    getPdfJs()
      .then((pdfjs) => {
        const loadingTask = pdfjs.getDocument(url);
        return loadingTask.promise;
      })
      .then((doc: PDFDocumentProxy) => {
        if (isCancelled) return;
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setLoading(false);

        // Auto-fit initial scale to available container space
        doc
          .getPage(1)
          .then((firstPage) => {
            if (isCancelled) return;
            const vp = firstPage.getViewport({ scale: 1.0 });
            if (containerRef.current) {
              const availW = containerRef.current.clientWidth - 48;
              const availH = containerRef.current.clientHeight - 48;
              if (availW > 100 && availH > 100) {
                const fitScale = Math.min(availW / vp.width, availH / vp.height);
                setScale(Math.min(1.2, Math.max(0.45, +fitScale.toFixed(2))));
                return;
              }
            }
            setScale(0.85);
          })
          .catch(() => {
            setScale(0.85);
          });
      })
      .catch((err: unknown) => {
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
      } catch {
        /* ignore cancellation error */
      }
    }

    pdfDoc
      .getPage(currentPage)
      .then((page) => {
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
      .catch((err: unknown) => {
        if ((err as { name?: string })?.name !== 'RenderingCancelledException') {
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
    setScale((s) => Math.min(2.5, +(s + 0.15).toFixed(2)));
  };

  const handleZoomOut = () => {
    playClick();
    setScale((s) => Math.max(0.4, +(s - 0.15).toFixed(2)));
  };

  const handleFitPage = async () => {
    if (!pdfDoc || !containerRef.current) return;
    playClick();
    try {
      const page = await pdfDoc.getPage(currentPage);
      const vp = page.getViewport({ scale: 1.0 });
      const availW = containerRef.current.clientWidth - 48;
      const availH = containerRef.current.clientHeight - 48;
      if (availW > 0 && availH > 0) {
        const fitScale = Math.min(availW / vp.width, availH / vp.height);
        setScale(Math.min(1.4, Math.max(0.4, +fitScale.toFixed(2))));
      }
    } catch {
      setScale(0.85);
    }
  };

  const handleFitWidth = async () => {
    if (!pdfDoc || !containerRef.current) return;
    playClick();
    try {
      const page = await pdfDoc.getPage(currentPage);
      const vp = page.getViewport({ scale: 1.0 });
      const availW = containerRef.current.clientWidth - 64;
      if (availW > 0) {
        const fitScale = availW / vp.width;
        setScale(Math.min(2.0, Math.max(0.45, +fitScale.toFixed(2))));
      }
    } catch {
      setScale(1.1);
    }
  };

  const handleResetZoom = () => {
    playClick();
    if (scale !== 1.0) {
      setScale(1.0);
    } else {
      handleFitPage();
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    if (!containerRef.current) return;
    setIsPanning(true);
    panStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: containerRef.current.scrollLeft,
      scrollTop: containerRef.current.scrollTop,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning || !containerRef.current) return;
    e.preventDefault();
    const dx = e.clientX - panStartRef.current.x;
    const dy = e.clientY - panStartRef.current.y;
    containerRef.current.scrollLeft = panStartRef.current.scrollLeft - dx;
    containerRef.current.scrollTop = panStartRef.current.scrollTop - dy;
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.12 : -0.12;
      setScale((s) => Math.min(2.5, Math.max(0.4, +(s + delta).toFixed(2))));
    }
    // Standard mouse wheel scrolls containerRef natively
  };

  // Keyboard navigation & zoom shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentPage < totalPages) {
          playClick();
          setCurrentPage((p) => p + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentPage > 1) {
          playClick();
          setCurrentPage((p) => p - 1);
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) {
        e.preventDefault();
        playClick();
        setScale((s) => Math.min(2.5, +(s + 0.15).toFixed(2)));
      } else if ((e.ctrlKey || e.metaKey) && (e.key === '-' || e.key === '_')) {
        e.preventDefault();
        playClick();
        setScale((s) => Math.max(0.4, +(s - 0.15).toFixed(2)));
      } else if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        playClick();
        setScale(1.0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages]);

  return (
    <div
      className={`relative flex flex-col w-full h-full min-h-0 bg-[#05050A] overflow-hidden ${className}`}
    >
      {/* ── Top Floating Navigation Toolbar ── */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 sm:px-4 py-2 bg-[#080812] border-b border-white/10 text-xs text-white/80 select-none z-20 gap-2">
        {/* Page navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1 || loading}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all text-white/80 hover:text-white"
            title="Previous Page (← / PageUp)"
            aria-label="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-black/60 border border-white/10 text-white/90">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages || loading}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all text-white/80 hover:text-white"
            title="Next Page (→ / PageDown)"
            aria-label="Next Page"
          >
            <ChevronRight size={16} />
          </button>

          {scale > 1 && !loading && !error && (
            <span className="hidden lg:inline-flex items-center gap-1 font-mono text-[10px] text-muted px-2 py-0.5 rounded bg-white/5 border border-white/10 ml-1">
              <span>Scroll or drag to pan</span>
            </span>
          )}
        </div>

        {/* View / Fit Presets & Zoom Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          <button
            onClick={handleFitPage}
            disabled={loading}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/5 hover:bg-white/10 hover:text-cyan active:scale-95 text-white/70 border border-white/5 transition-all"
            title="Fit entire page in view"
          >
            <Maximize2 size={11} />
            <span>Fit Page</span>
          </button>

          <button
            onClick={handleFitWidth}
            disabled={loading}
            className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/5 hover:bg-white/10 hover:text-cyan active:scale-95 text-white/70 border border-white/5 transition-all"
            title="Fit page to width"
          >
            Fit Width
          </button>

          <div className="h-4 w-px bg-white/10 mx-0.5 hidden sm:block" />

          <button
            onClick={handleZoomOut}
            disabled={scale <= 0.4 || loading}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 disabled:opacity-30 transition-all text-white/80 hover:text-white"
            title="Zoom Out (Ctrl -)"
            aria-label="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>

          <button
            onClick={handleResetZoom}
            className="font-mono text-xs px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 hover:text-cyan active:scale-95 text-muted transition-all min-w-[50px] text-center"
            title="Click to toggle 100% / Fit (Ctrl 0)"
            aria-label="Reset zoom"
          >
            {Math.round(scale * 100)}%
          </button>

          <button
            onClick={handleZoomIn}
            disabled={scale >= 2.5 || loading}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 disabled:opacity-30 transition-all text-white/80 hover:text-white"
            title="Zoom In (Ctrl +)"
            aria-label="Zoom In"
          >
            <ZoomIn size={15} />
          </button>
        </div>
      </div>

      {/* ── Document Area (Scrollable canvas with pan & zoom) ── */}
      <div
        ref={containerRef}
        data-lenis-prevent="true"
        className={`relative flex-1 min-h-0 w-full overflow-auto bg-[#030306] select-none ${
          isPanning ? 'cursor-grabbing' : scale > 1 ? 'cursor-grab' : 'cursor-default'
        }`}
        style={{
          overscrollBehavior: 'contain',
          touchAction: 'pan-x pan-y',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#030306]/90 z-20">
            <Loader2 size={32} className="animate-spin" style={{ color: accentColor }} />
            <p className="font-mono text-xs text-muted">Rendering PDF via PDF.js...</p>
          </div>
        )}

        {error ? (
          <div className="flex flex-col items-center justify-center text-center p-8 max-w-md gap-4 m-auto">
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
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan text-black font-ui font-semibold text-xs hover:brightness-110 active:scale-95 transition-all"
              >
                <ExternalLink size={13} />
                <span>Open in Tab</span>
              </a>
              <a
                href={url}
                download
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 text-white font-ui font-semibold text-xs hover:bg-white/20 active:scale-95 transition-all"
              >
                <Download size={13} />
                <span>Download</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="w-max min-w-full min-h-full flex flex-col items-center p-4 sm:p-8">
            <div
              className="my-auto shadow-[0_20px_60px_rgba(0,0,0,0.9)] rounded-lg overflow-hidden border border-white/15 bg-white flex-shrink-0 transition-shadow duration-300"
              style={{
                boxShadow: `0 24px 70px -15px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.15)`,
              }}
            >
              <canvas ref={canvasRef} className="block pointer-events-none" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
