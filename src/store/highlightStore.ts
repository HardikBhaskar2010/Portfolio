import { create } from 'zustand';

export interface HighlightItem {
  id: string;
  element: HTMLElement;
  color?: string;
  label?: string;
}

export interface CachedRect {
  id: string;
  docTop: number;
  docBottom: number;
  docLeft: number;
  height: number;
  color?: string;
  label?: string;
}

interface HighlightStore {
  highlights: Record<string, HighlightItem>;
  cachedRects: Record<string, CachedRect>;
  addHighlight: (id: string, element: HTMLElement, color?: string, label?: string) => void;
  removeHighlight: (id: string) => void;
  refreshCachedRects: () => void;

  // Dynamic override (e.g. hovering cards or viewing specific projects)
  overrideColor: string | null;
  overrideLabel: string | null;
  setOverride: (color: string | null, label?: string | null) => void;
}

export const useHighlightStore = create<HighlightStore>((set, get) => ({
  highlights: {},
  cachedRects: {},
  overrideColor: null,
  overrideLabel: null,
  addHighlight: (id, element, color, label) => {
    set((state) => ({
      highlights: { ...state.highlights, [id]: { id, element, color, label } },
    }));
    get().refreshCachedRects();
  },
  removeHighlight: (id) => {
    set((state) => {
      const newHighlights = { ...state.highlights };
      delete newHighlights[id];
      const newCachedRects = { ...state.cachedRects };
      delete newCachedRects[id];
      return { highlights: newHighlights, cachedRects: newCachedRects };
    });
  },
  refreshCachedRects: () => {
    if (typeof window === 'undefined') return;
    const { highlights } = get();
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const scrollX = window.scrollX || window.pageXOffset || 0;
    const nextRects: Record<string, CachedRect> = {};

    for (const id in highlights) {
      const item = highlights[id];
      if (item && item.element && typeof item.element.getBoundingClientRect === 'function') {
        const rect = item.element.getBoundingClientRect();
        nextRects[id] = {
          id,
          docTop: rect.top + scrollY,
          docBottom: rect.bottom + scrollY,
          docLeft: rect.left + scrollX,
          height: rect.height,
          color: item.color,
          label: item.label,
        };
      }
    }
    set({ cachedRects: nextRects });
  },
  setOverride: (overrideColor, overrideLabel = null) =>
    set({ overrideColor, overrideLabel }),
}));

// Wire ResizeObserver and event triggers in browser runtime
if (typeof window !== 'undefined') {
  let ro: ResizeObserver | null = null;
  try {
    ro = new ResizeObserver(() => {
      useHighlightStore.getState().refreshCachedRects();
    });
  } catch {
    // ResizeObserver not available in current environment
  }

  useHighlightStore.subscribe((state) => {
    if (!ro) return;
    ro.disconnect();
    for (const id in state.highlights) {
      const item = state.highlights[id];
      if (item?.element) {
        ro.observe(item.element);
      }
    }
  });

  window.addEventListener('resize', () => {
    useHighlightStore.getState().refreshCachedRects();
  }, { passive: true });

  window.addEventListener('orientationchange', () => {
    useHighlightStore.getState().refreshCachedRects();
  }, { passive: true });

  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      useHighlightStore.getState().refreshCachedRects();
    }).catch(() => {});
  }
}
