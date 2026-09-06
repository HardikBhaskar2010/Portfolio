import { create } from 'zustand';

export interface HighlightItem {
  id: string;
  element: HTMLElement;
  color?: string;
  label?: string;
}

interface HighlightStore {
  highlights: Record<string, HighlightItem>;
  addHighlight: (id: string, element: HTMLElement, color?: string, label?: string) => void;
  removeHighlight: (id: string) => void;
  
  // Dynamic override (e.g. hovering cards or viewing specific projects)
  overrideColor: string | null;
  overrideLabel: string | null;
  setOverride: (color: string | null, label?: string | null) => void;
}

export const useHighlightStore = create<HighlightStore>((set) => ({
  highlights: {},
  overrideColor: null,
  overrideLabel: null,
  addHighlight: (id, element, color, label) =>
    set((state) => ({
      highlights: { ...state.highlights, [id]: { id, element, color, label } },
    })),
  removeHighlight: (id) =>
    set((state) => {
      const newHighlights = { ...state.highlights };
      delete newHighlights[id];
      return { highlights: newHighlights };
    }),
  setOverride: (overrideColor, overrideLabel = null) =>
    set({ overrideColor, overrideLabel }),
}));

